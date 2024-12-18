import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware';
import { ConfigurationError } from '../errors/customErrors';

const router = Router();

// Helper function to check if error is related to missing Azure config
const isMissingConfigError = (error: unknown): boolean => {
  return error instanceof ConfigurationError || 
    (error instanceof Error && error.message.includes('Missing required Azure AD configuration'));
};

// Protect all user routes with authentication middleware
router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const users = await req.services!.graph.getAllUsers();
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

    const users = await req.services!.graph.searchUsers(query);
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
    const user = await req.services!.graph.getUserById(req.params.id);
    res.json(user);
  } catch (error: unknown) {
    next(error);
  }
});

router.get('/:id/groups', async (req, res, next) => {
  try {
    const groups = await req.services!.graph.getUserGroups(req.params.id);
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
