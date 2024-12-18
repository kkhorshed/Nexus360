import { Router } from 'express';
import { Pool } from 'pg';
import { requireAuth } from '../middleware/authMiddleware';
import { AppAccessService } from '../services/appAccessService';
import { ValidationError } from '../errors/customErrors';
import { logger } from '../utils/logger';

const router = Router();
const pool = new Pool(); // Configure with your database settings
const appAccessService = new AppAccessService(pool);

// Protect all app access routes with authentication
router.use(requireAuth);

// Get user's app access
router.get('/apps', async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const apps = await appAccessService.getUserApps(userId);
    res.json(apps);
  } catch (error) {
    next(error);
  }
});

// Grant app access
router.post('/grant', async (req, res, next) => {
  try {
    const { userId, appName } = req.body;
    const grantedBy = req.user!.id;

    if (!userId || !appName) {
      throw new ValidationError('User ID and app name are required');
    }

    await appAccessService.grantAppAccess(userId, appName, grantedBy);
    res.json({ message: 'Access granted successfully' });
  } catch (error) {
    next(error);
  }
});

// Revoke app access
router.post('/revoke', async (req, res, next) => {
  try {
    const { userId, appName } = req.body;
    const revokedBy = req.user!.id;

    if (!userId || !appName) {
      throw new ValidationError('User ID and app name are required');
    }

    await appAccessService.revokeAppAccess(userId, appName, revokedBy);
    res.json({ message: 'Access revoked successfully' });
  } catch (error) {
    next(error);
  }
});

// Assign role to user for an app
router.post('/roles/assign', async (req, res, next) => {
  try {
    const { userId, appName, roleName } = req.body;
    const grantedBy = req.user!.id;

    if (!userId || !appName || !roleName) {
      throw new ValidationError('User ID, app name, and role name are required');
    }

    await appAccessService.assignRole(userId, appName, roleName, grantedBy);
    res.json({ message: 'Role assigned successfully' });
  } catch (error) {
    next(error);
  }
});

// Get user's permissions for an app
router.get('/:appName/permissions', async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { appName } = req.params;

    const permissions = await appAccessService.getUserAppPermissions(userId, appName);
    res.json(permissions);
  } catch (error) {
    next(error);
  }
});

// Check if user has specific permission
router.get('/:appName/check-permission', async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { appName } = req.params;
    const { permission } = req.query;

    if (!permission || typeof permission !== 'string') {
      throw new ValidationError('Permission parameter is required');
    }

    const hasPermission = await appAccessService.hasPermission(userId, appName, permission);
    res.json({ hasPermission });
  } catch (error) {
    next(error);
  }
});

export const appAccessRouter = router;
