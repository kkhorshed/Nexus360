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
    res.json({ authUrl });
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
    res.json({ token });
  } catch (error: unknown) {
    if (isMissingConfigError(error)) {
      res.status(400).json({ error: 'Azure AD not configured' });
    } else {
      next(error);
    }
  }
});

export const authRouter = router;
