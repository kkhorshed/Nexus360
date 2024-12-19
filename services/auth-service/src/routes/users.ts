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
router.use(process.env.NODE_ENV === 'development' ? devAuth : requireAuth);

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

// Sync all users from Azure AD
router.post('/sync', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get all users from Azure AD
    const graphUsers = await req.services!.graph.getAllUsers();
    const azureUsers = graphUsers.map(user => mapAzureUser(user as AzureGraphUser));
    
    // Sync all users to the database
    const result = await usersData.syncUsers(azureUsers);
    res.json(result);
  } catch (error) {
    if (isMissingConfigError(error)) {
      res.status(400).json({ message: 'Azure AD integration not configured' });
    } else {
      next(error);
    }
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
