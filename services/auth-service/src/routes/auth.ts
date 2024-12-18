import { Router } from 'express';
import { AuthenticationService } from '../services/authenticationService';
import { GraphService } from '../services/graphService';
import { logger } from '../utils/logger';
import { ConfigurationError } from '../errors/customErrors';

const router = Router();

// Singleton instances of services
const authService = new AuthenticationService();
const graphService = new GraphService(authService);

// Helper function to check if error is related to missing Azure config
const isMissingConfigError = (error: unknown): boolean => {
  return error instanceof ConfigurationError || 
    (error instanceof Error && error.message.includes('Missing required Azure AD configuration'));
};

// Get auth URL for frontend
router.get('/url', async (req, res, next) => {
  try {
    const authUrl = await authService.getAuthUrl();
    logger.info('Generated auth URL for frontend');
    res.json({ url: authUrl });
  } catch (error: unknown) {
    if (isMissingConfigError(error)) {
      res.status(400).json({ error: 'Azure AD not configured' });
    } else {
      next(error);
    }
  }
});

router.get('/login', async (req, res, next) => {
  try {
    const authUrl = await authService.getAuthUrl();
    logger.info('Generated auth URL:', authUrl);
    res.redirect(authUrl);
  } catch (error: unknown) {
    if (isMissingConfigError(error)) {
      res.status(400).json({ error: 'Azure AD not configured' });
    } else {
      next(error);
    }
  }
});

router.get('/callback', async (req, res, next) => {
  try {
    const { code } = req.query;
    if (!code || typeof code !== 'string') {
      throw new Error('Authorization code is required');
    }

    const token = await authService.handleCallback(code);
    const user = await graphService.getCurrentUser(token);

    // Redirect back to frontend with token and user data
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    const encodedToken = encodeURIComponent(token);
    const encodedUser = encodeURIComponent(JSON.stringify(user));
    res.redirect(`${frontendUrl}?token=${encodedToken}&user=${encodedUser}`);
  } catch (error: unknown) {
    if (isMissingConfigError(error)) {
      res.status(400).json({ error: 'Azure AD not configured' });
    } else {
      next(error);
    }
  }
});

export const authRouter = router;
