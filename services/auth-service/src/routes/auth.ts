import { Router } from 'express';
import { ADService } from '../services/adService';
import { logger } from '../utils/logger';

const router = Router();
const adService = new ADService();

router.get('/login', async (req, res, next) => {
  try {
    const authUrl = await adService.getAuthUrl();
    res.json({ url: authUrl });
  } catch (error) {
    next(error);
  }
});

router.get('/callback', async (req, res, next) => {
  try {
    const { code } = req.query;
    if (!code || typeof code !== 'string') {
      throw new Error('Authorization code is required');
    }

    const accessToken = await adService.handleCallback(code);
    const user = await adService.getCurrentUser(accessToken);

    res.json({ accessToken, user });
  } catch (error) {
    logger.error('Auth callback error:', error);
    next(error);
  }
});

router.post('/refresh', async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      throw new Error('User ID is required');
    }

    const accessToken = await adService.refreshToken(userId);
    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
});

export const authRouter = router;
