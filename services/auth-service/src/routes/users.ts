import { Router } from 'express';
import { ADService } from '../services/adService';

const router = Router();
const adService = new ADService();

router.get('/', async (req, res, next) => {
  try {
    const users = await adService.getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get('/search', async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query || typeof query !== 'string') {
      throw new Error('Search query is required');
    }

    const users = await adService.searchUsers(query);
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const user = await adService.getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.get('/:id/groups', async (req, res, next) => {
  try {
    const groups = await adService.getUserGroups(req.params.id);
    res.json(groups);
  } catch (error) {
    next(error);
  }
});

export const usersRouter = router;
