import { Request, Response } from 'express';
import { ADService } from '../services/adService';
import { logger } from '../utils/logger';
import { config } from '../config';

// Extend Express Session type
declare module 'express-session' {
  interface SessionData {
    returnTo?: string;
  }
}

export class ADController {
  private adService: ADService;
  private defaultRedirectUrl: string;

  constructor() {
    this.adService = new ADService();
    this.defaultRedirectUrl = 'http://localhost:3000';
  }

  /**
   * Validates if a URL is allowed based on configured origins
   * @param url URL to validate
   * @returns boolean indicating if URL is allowed
   */
  private isValidReturnUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      return config.cors.allowedOrigins.some(origin => {
        const parsedOrigin = new URL(origin);
        return parsedUrl.protocol === parsedOrigin.protocol &&
               parsedUrl.hostname === parsedOrigin.hostname &&
               parsedUrl.port === parsedOrigin.port;
      });
    } catch {
      return false;
    }
  }

  /**
   * Safely stores the return URL in session
   * @param req Express request
   * @param returnTo URL to store
   * @returns The stored URL or default URL
   */
  private storeReturnUrl(req: Request, returnTo?: string): string {
    const validReturnTo = returnTo && this.isValidReturnUrl(returnTo) ? returnTo : this.defaultRedirectUrl;
    
    if (req.session) {
      req.session.returnTo = validReturnTo;
      logger.info(`Stored return URL: ${validReturnTo}`);
    }

    return validReturnTo;
  }

  /**
   * Initiate login flow
   * @route GET /api/auth/login
   */
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info('Initiating login flow...');
      const authUrl = await this.adService.getAuthUrl();
      logger.info('Using redirect URI:', this.adService.getRedirectUri());
      
      // Store the return URL from query param or referrer
      const returnTo = req.query.returnTo as string || req.headers.referer;
      this.storeReturnUrl(req, returnTo);
      
      // Send JSON response for API calls
      if (req.headers.accept?.includes('application/json')) {
        res.json({ loginUrl: authUrl });
      } else {
        // Redirect directly for browser requests
        res.redirect(authUrl);
      }
    } catch (error) {
      logger.error('Error generating auth URL:', error);
      res.status(500).json({ 
        error: 'Failed to generate login URL',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Handle auth callback
   * @route GET /api/auth/callback
   */
  handleCallback = async (req: Request, res: Response): Promise<void> => {
    try {
      const { code } = req.query;
      logger.info('Received auth callback with code');
      
      if (!code || typeof code !== 'string') {
        res.status(400).json({ error: 'Authorization code is required' });
        return;
      }

      logger.info('Processing auth callback with code');
      const accessToken = await this.adService.handleCallback(code);
      const user = await this.adService.getCurrentUser(accessToken);

      // For API requests, return JSON response
      if (req.headers.accept?.includes('application/json')) {
        res.json({
          accessToken,
          user
        });
      } else {
        // Get the stored return URL or use default
        let returnTo = req.session?.returnTo;
        
        // Validate stored return URL
        if (!returnTo || !this.isValidReturnUrl(returnTo)) {
          logger.warn(`Invalid stored return URL: ${returnTo}, using default`);
          returnTo = this.defaultRedirectUrl;
        }
        
        // Clear the stored return URL
        if (req.session) {
          delete req.session.returnTo;
        }

        // For browser requests, redirect to original app with token and user data
        const redirectUrl = new URL(returnTo);
        
        // Add token and user data as URL parameters
        redirectUrl.searchParams.append('token', accessToken);
        redirectUrl.searchParams.append('user', JSON.stringify({
          id: user.id,
          displayName: user.displayName,
          userPrincipalName: user.userPrincipalName,
        }));

        // Set auth cookie that can be accessed by all apps on localhost
        res.cookie('auth_token', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          domain: 'localhost',
          maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        logger.info(`Redirecting to ${redirectUrl.toString()}`);
        res.redirect(redirectUrl.toString());
      }
    } catch (error) {
      logger.error('Error in auth callback:', error);
      res.status(500).json({ 
        error: 'Authentication failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Handle logout
   * @route GET /api/auth/logout
   */
  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      // Clear auth cookie
      res.clearCookie('auth_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        domain: 'localhost'
      });

      // Get return URL from query param and validate
      const returnTo = req.query.returnTo as string;
      const redirectUrl = this.isValidReturnUrl(returnTo) ? returnTo : this.defaultRedirectUrl;

      // For API requests, return success message
      if (req.headers.accept?.includes('application/json')) {
        res.json({ message: 'Logged out successfully' });
      } else {
        // For browser requests, redirect back to app
        res.redirect(redirectUrl);
      }
    } catch (error) {
      logger.error('Error in logout:', error);
      res.status(500).json({ 
        error: 'Logout failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Get current user
   * @route GET /api/users/me
   */
  getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
      // Get token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'No token provided' });
        return;
      }

      const token = authHeader.split(' ')[1];
      try {
        const user = await this.adService.getCurrentUser(token);
        res.json(user);
      } catch (error) {
        // If token is expired, try to refresh it
        if (error instanceof Error && error.message.includes('expired')) {
          try {
            // Extract user ID from token (you'll need to implement this)
            const userId = this.extractUserIdFromToken(token);
            if (!userId) {
              throw new Error('Invalid token format');
            }

            // Refresh the token
            const newToken = await this.adService.refreshToken(userId);
            const user = await this.adService.getCurrentUser(newToken);

            // Send both the new token and user data
            res.json({
              token: newToken,
              user
            });
          } catch (refreshError) {
            // If refresh fails, return 401 to trigger re-login
            res.status(401).json({ 
              error: 'Token expired and refresh failed',
              details: refreshError instanceof Error ? refreshError.message : 'Unknown error'
            });
          }
        } else {
          throw error;
        }
      }
    } catch (error) {
      logger.error('Error getting current user:', error);
      res.status(500).json({ 
        error: 'Failed to get current user',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Extract user ID from JWT token
   * @param token JWT token
   * @returns User ID or null if not found
   */
  private extractUserIdFromToken(token: string): string | null {
    try {
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      return payload.oid || null;
    } catch {
      return null;
    }
  }

  /**
   * Get all users
   * @route GET /api/users
   */
  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.adService.getAllUsers();
      res.json(users);
    } catch (error) {
      logger.error('Error in getAllUsers:', error);
      res.status(500).json({ 
        error: 'Failed to fetch users',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Get user by ID
   * @route GET /api/users/:userId
   */
  getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const user = await this.adService.getUserById(userId);
      res.json(user);
    } catch (error) {
      logger.error('Error in getUserById:', error);
      res.status(500).json({ 
        error: 'Failed to fetch user',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Search users by query
   * @route GET /api/users/search
   */
  searchUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const { query } = req.query;
      
      if (!query || typeof query !== 'string') {
        res.status(400).json({ error: 'Search query is required' });
        return;
      }

      const users = await this.adService.searchUsers(query);
      res.json(users);
    } catch (error) {
      logger.error('Error in searchUsers:', error);
      res.status(500).json({ 
        error: 'Failed to search users',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Get user groups
   * @route GET /api/users/:userId/groups
   */
  getUserGroups = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const groups = await this.adService.getUserGroups(userId);
      res.json(groups);
    } catch (error) {
      logger.error('Error in getUserGroups:', error);
      res.status(500).json({ 
        error: 'Failed to fetch user groups',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  /**
   * Health check endpoint
   * @route GET /api/health
   */
  healthCheck = async (_req: Request, res: Response): Promise<void> => {
    try {
      // Try to get access token to verify AD connectivity
      await this.adService.getAuthUrl();
      res.json({ status: 'healthy', message: 'AD Service is operational' });
    } catch (error) {
      logger.error('Health check failed:', error);
      res.status(503).json({ 
        status: 'unhealthy',
        message: 'AD Service is not operational',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}
