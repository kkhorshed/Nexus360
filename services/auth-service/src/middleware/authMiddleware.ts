import { Request, Response, NextFunction } from 'express';
import { AuthenticationService } from '../services/authenticationService';
import { GraphService } from '../services/graphService';
import { AuthenticationError } from '../errors/customErrors';

// Singleton instances of services
const authService = new AuthenticationService();
const graphService = new GraphService(authService);

/**
 * Middleware to protect routes that require authentication
 * Verifies the Bearer token from the Authorization header
 */
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided');
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      throw new AuthenticationError('Invalid token format');
    }
    
    try {
      // Verify token by attempting to get current user
      const graphUser = await graphService.getCurrentUser(token);
      
      // Construct user object with required fields, ensuring non-null values
      const user = {
        ...graphUser,
        displayName: graphUser.displayName || 'Unknown',
        email: graphUser.email || '',
      };
      
      // Attach user and services to request for use in route handlers
      req.user = user;
      req.services = {
        auth: authService,
        graph: graphService
      };
      
      next();
    } catch (error) {
      throw new AuthenticationError('Invalid or expired token');
    }
  } catch (error) {
    next(error);
  }
};

// Type augmentation for Express Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        displayName: string;
        email: string;
        [key: string]: any;
      };
      services?: {
        auth: AuthenticationService;
        graph: GraphService;
      };
    }
  }
}
