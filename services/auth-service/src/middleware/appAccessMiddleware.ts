import { Request, Response, NextFunction } from 'express';
import { Pool } from 'pg';
import { AppAccessService } from '../services/appAccessService';
import { AuthorizationError } from '../errors/customErrors';
import { logger } from '../utils/logger';

const pool = new Pool(); // Configure with your database settings
const appAccessService = new AppAccessService(pool);

/**
 * Middleware to check if user has access to a specific application
 * @param appName The name of the application to check access for
 */
export const requireAppAccess = (appName: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AuthorizationError('User not authenticated');
      }

      const hasAccess = await appAccessService.hasAppAccess(userId, appName);
      if (!hasAccess) {
        throw new AuthorizationError(`Access denied to ${appName}`);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware to check if user has specific permission in an application
 * @param appName The name of the application
 * @param permission The permission to check for
 */
export const requirePermission = (appName: string, permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AuthorizationError('User not authenticated');
      }

      const hasPermission = await appAccessService.hasPermission(userId, appName, permission);
      if (!hasPermission) {
        throw new AuthorizationError(`Permission denied: ${permission}`);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware to attach user's app permissions to the request
 * This is useful when you need to check multiple permissions in a route handler
 * @param appName The name of the application
 */
export const attachAppPermissions = (appName: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AuthorizationError('User not authenticated');
      }

      const permissions = await appAccessService.getUserAppPermissions(userId, appName);
      req.appPermissions = permissions;

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Type augmentation for Express Request
declare global {
  namespace Express {
    interface Request {
      appPermissions?: string[];
    }
  }
}
