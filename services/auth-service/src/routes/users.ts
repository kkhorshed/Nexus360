import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../middleware/authMiddleware';
import { devAuth } from '../middleware/devAuthMiddleware';
import { ConfigurationError } from '../errors/customErrors';
import { UsersData, AzureUser } from '../data/users';
import { Pool } from 'pg';
import config from '../config';
import { logger } from '../utils/logger';

const router = Router();
const pool = new Pool(config.database);
const usersData = new UsersData(pool);

// Helper function to check if error is related to missing Azure config
const isMissingConfigError = (error: unknown): boolean => {
  return error instanceof ConfigurationError || 
    (error instanceof Error && error.message.includes('Missing required Azure AD configuration'));
};

interface AzureGraphUser {
  id: string;
  mail?: string;
  userPrincipalName: string;
  displayName: string;
  givenName?: string | null;
  surname?: string | null;
  jobTitle?: string | null;
  department?: string | null;
}

// Helper function to map Azure AD user to our schema
const mapAzureUser = (azureUser: AzureGraphUser): AzureUser => {
  logger.info('Mapping user:', { 
    id: azureUser.id, 
    displayName: azureUser.displayName,
    email: azureUser.mail || azureUser.userPrincipalName
  });
  
  return {
    id: azureUser.id,
    email: azureUser.mail || azureUser.userPrincipalName,
    displayName: azureUser.displayName,
    givenName: azureUser.givenName || undefined,
    surname: azureUser.surname || undefined,
    jobTitle: azureUser.jobTitle || undefined,
    department: azureUser.department || undefined
  };
};

// Use development auth middleware in development mode
const authMiddleware = process.env.NODE_ENV === 'development' ? devAuth : requireAuth;

// Health check endpoint (no auth required)
router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Test endpoint to get photo URL by email (no auth required for testing)
router.get('/test/photo-url', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.services?.graph) {
      throw new ConfigurationError('Graph service not initialized');
    }

    const email = req.query.email as string;
    if (!email) {
      res.status(400).json({ message: 'Email parameter is required' });
      return;
    }

    logger.info('Looking up user by email:', email);

    // First get user by email
    const users = await req.services.graph.searchUsers(email);
    const user = users.find(u => u.email === email || u.userPrincipalName === email);

    if (!user) {
      logger.info('User not found:', email);
      res.status(404).json({ message: 'User not found' });
      return;
    }

    logger.info('Found user:', { id: user.id, email: user.email });

    // Now check if photo exists
    try {
      await req.services.graph.getUserProfilePhoto(user.id);
      const photoUrl = `http://localhost:3001/api/users/${user.id}/photo`;
      
      logger.info('Photo exists, returning URL:', photoUrl);
      
      res.json({ 
        userId: user.id,
        photoUrl,
        graphUrl: `https://graph.microsoft.com/v1.0/users/${user.id}/photos/120x120/$value`,
        message: 'Photo exists and should be accessible'
      });
    } catch (error: any) {
      if (error.statusCode === 404) {
        logger.info('No photo found for user:', user.id);
        res.json({ 
          userId: user.id,
          photoUrl: null,
          message: 'User found but no photo exists'
        });
      } else {
        throw error;
      }
    }
  } catch (error) {
    logger.error('Error in test/photo-url:', error);
    next(error);
  }
});

// Protect all other routes with authentication middleware
router.use(authMiddleware);

// Get user profile photo
router.get('/:id/photo', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.services?.graph) {
      throw new ConfigurationError('Graph service not initialized');
    }

    // Log request details
    logger.info('Fetching profile photo for user:', {
      userId: req.params.id,
      headers: {
        ...req.headers,
        authorization: req.headers.authorization ? '[redacted]' : undefined
      }
    });

    try {
      const photoData = await req.services.graph.getUserProfilePhoto(req.params.id);

      // Set appropriate headers
      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Cache-Control', 'private, max-age=3600');
      // Add CORS headers
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3002');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

      // Log response details
      logger.info('Sending profile photo response:', {
        contentLength: photoData.byteLength,
        headers: res.getHeaders()
      });

      // Send the photo data
      res.send(photoData);
    } catch (error: any) {
      // If photo not found, return a 404
      if (error.statusCode === 404) {
        logger.info(`No profile photo found for user ${req.params.id}`);
        res.status(404).json({ message: 'Profile photo not found' });
        return;
      }
      throw error;
    }
  } catch (error: any) {
    logger.error('Error handling profile photo request:', {
      userId: req.params.id,
      error: error.message,
      stack: error.stack
    });

    if (isMissingConfigError(error)) {
      res.status(400).json({ message: 'Azure AD integration not configured' });
    } else {
      next(error);
    }
  }
});

// Handle OPTIONS request for CORS preflight
router.options('/:id/photo', (req: Request, res: Response) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3002');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(204).end();
});

// Get all users
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dbUsers = await usersData.getAllUsers();
    logger.info('Retrieved users from DB:', dbUsers);
    res.json(dbUsers);
  } catch (error) {
    next(error);
  }
});

// Search users
router.get('/search', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query = '' } = req.query;
    if (typeof query !== 'string') {
      throw new Error('Search query must be a string');
    }

    // If query is empty, return all users
    if (!query.trim()) {
      const allUsers = await usersData.getAllUsers();
      return res.json(allUsers);
    }

    // Return users from DB that match the search
    const dbUsers = await usersData.searchUsers(query);
    res.json(dbUsers);
  } catch (error) {
    next(error);
  }
});

// Get user by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // First check local DB
    const dbUser = await usersData.getUser(req.params.id);
    if (dbUser) {
      return res.json(dbUser);
    }

    // Try Azure AD
    try {
      const graphUser = await req.services!.graph.getUserById(req.params.id);
      const azureUser = graphUser as AzureGraphUser;
      if (azureUser) {
        // Sync to DB and return
        const mappedUser = mapAzureUser(azureUser);
        const syncedUser = await usersData.syncUser(mappedUser);
        return res.json(syncedUser);
      }
    } catch (error) {
      if (!isMissingConfigError(error)) {
        throw error;
      }
    }

    // If user not found anywhere
    res.status(404).json({ message: 'User not found' });
  } catch (error) {
    next(error);
  }
});

// Get user groups
router.get('/:id/groups', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const groups = await req.services!.graph.getUserGroups(req.params.id);
    res.json(groups);
  } catch (error) {
    if (isMissingConfigError(error)) {
      res.json([]);
    } else {
      next(error);
    }
  }
});

// Get user permissions
router.get('/:id/permissions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const permissions = await usersData.getUserPermissions(req.params.id);
    res.json(permissions);
  } catch (error) {
    next(error);
  }
});

// Sync specific user from Azure AD
router.post('/:id/sync', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const graphUser = await req.services!.graph.getUserById(req.params.id);
    const azureUser = graphUser as AzureGraphUser;
    const mappedUser = mapAzureUser(azureUser);
    const syncedUser = await usersData.syncUser(mappedUser);
    res.json(syncedUser);
  } catch (error) {
    if (isMissingConfigError(error)) {
      res.status(400).json({ message: 'Azure AD integration not configured' });
    } else {
      next(error);
    }
  }
});

// Deactivate user
router.post('/:id/deactivate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await usersData.deactivateUser(req.params.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Reactivate user
router.post('/:id/reactivate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await usersData.reactivateUser(req.params.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

export const usersRouter = router;
