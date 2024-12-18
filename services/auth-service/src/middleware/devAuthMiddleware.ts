import { Request, Response, NextFunction } from 'express';
import { AuthenticationService } from '../services/authenticationService';
import { GraphService } from '../services/graphService';
import { AuthenticationError } from '../errors/customErrors';
import { Pool } from 'pg';
import { UsersData } from '../data/users';
import config from '../config';
import { logger } from '../utils/logger';

// Singleton instances of services
const authService = new AuthenticationService();
const graphService = new GraphService(authService);
const pool = new Pool(config.database);
const usersData = new UsersData(pool);

/**
 * Development middleware that bypasses Azure AD authentication
 * and uses a test user from the database
 */
export const devAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('Using development authentication middleware');
    
    // Get test user from database
    const testUser = await usersData.getUserByEmail('dev.admin@nexus360.local');
    
    if (!testUser) {
      logger.warn('Test user not found, creating development user');
      // Create a development user if none exists
      const devUser = {
        id: 'dev-admin',
        email: 'dev.admin@nexus360.local',
        displayName: 'Development Admin',
        givenName: 'Development',
        surname: 'Admin',
        jobTitle: 'Administrator',
        department: 'IT',
        isActive: true,
        lastSyncAt: new Date().toISOString()
      };

      // Sync the development user to the database
      await usersData.syncUser({
        id: devUser.id,
        email: devUser.email,
        displayName: devUser.displayName,
        givenName: devUser.givenName,
        surname: devUser.surname,
        jobTitle: devUser.jobTitle,
        department: devUser.department
      });

      // Attach user and services to request
      req.user = devUser;
    } else {
      logger.info('Using existing test user:', { id: testUser.id, email: testUser.email });
      // Attach user and services to request
      req.user = {
        id: testUser.id,
        displayName: testUser.displayName, // Using camelCase property
        email: testUser.email,
        ...testUser
      };
    }

    req.services = {
      auth: authService,
      graph: graphService
    };
    
    next();
  } catch (error) {
    logger.error('Development authentication error:', error);
    next(error);
  }
};
