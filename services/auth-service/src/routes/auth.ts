import { Router } from 'express';
import { ADService } from '../services/adService';

const router = Router();

// Helper function to check if error is related to missing Azure config
const isMissingConfigError = (error: unknown): boolean => {
  return error instanceof Error && 
    error.message.includes('Missing required Azure AD configuration');
};

router.get('/login', async (req, res, next) => {
  try {
    const adService = new ADService();
    const authUrl = await adService.getAuthUrl();
    console.log('Generated auth URL:', authUrl);
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

    const adService = new ADService();
    const token = await adService.handleCallback(code);
    const user = await adService.getCurrentUser(token);

    // Redirect back to frontend with token and user data
    const frontendUrl = 'http://localhost:3001';
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
