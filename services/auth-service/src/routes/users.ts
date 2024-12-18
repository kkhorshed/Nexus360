import { Router } from 'express';
import { ADService } from '../services/adService';

const router = Router();

// Helper function to check if error is related to missing Azure config
const isMissingConfigError = (error: unknown): boolean => {
  return error instanceof Error && 
    error.message.includes('Missing required Azure AD configuration');
};

// Initialize ADService only when needed
router.get('/', async (req, res, next) => {
  try {
    const adService = new ADService();
    const users = await adService.getAllUsers();
    res.json(users);
  } catch (error: unknown) {
    // If Azure AD is not configured, return empty array
    if (isMissingConfigError(error)) {
      res.json([]);
    } else {
      next(error);
    }
  }
});

router.get('/search', async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query || typeof query !== 'string') {
      throw new Error('Search query is required');
    }

    const adService = new ADService();
    const users = await adService.searchUsers(query);
    res.json(users);
  } catch (error: unknown) {
    // If Azure AD is not configured, return empty array
    if (isMissingConfigError(error)) {
      res.json([]);
    } else {
      next(error);
    }
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const adService = new ADService();
    const user = await adService.getUserById(req.params.id);
    res.json(user);
  } catch (error: unknown) {
    next(error);
  }
});

router.get('/:id/groups', async (req, res, next) => {
  try {
    const adService = new ADService();
    const groups = await adService.getUserGroups(req.params.id);
    res.json(groups);
  } catch (error: unknown) {
    // If Azure AD is not configured, return empty array
    if (isMissingConfigError(error)) {
      res.json([]);
    } else {
      next(error);
    }
  }
});

export const usersRouter = router;
