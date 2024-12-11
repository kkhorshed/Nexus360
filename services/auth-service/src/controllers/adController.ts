import { Request, Response } from 'express';
import { ADService } from '../services/adService';
import { logger } from '../utils/logger';

export class ADController {
  private adService: ADService;
  private redirectUrl: string;

  constructor() {
    this.adService = new ADService();
    this.redirectUrl = process.env.REDIRECT_URL || 'http://localhost:3010';
  }

  /**
   * Initiate login flow
   * @route GET /api/auth/login
   */
  login = async (_req: Request, res: Response): Promise<void> => {
    try {
      logger.info('Initiating login flow...');
      const authUrl = await this.adService.getAuthUrl();
      logger.info(`Generated auth URL: ${authUrl}`);
      
      // Send JSON response for API calls
      if (_req.headers.accept?.includes('application/json')) {
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

      const accessToken = await this.adService.handleCallback(code);
      const user = await this.adService.getCurrentUser(accessToken);

      // For API requests, return JSON response
      if (req.headers.accept?.includes('application/json')) {
        res.json({
          accessToken,
          user
        });
      } else {
        // For browser requests, redirect to CRM with token
        const redirectUrl = new URL(this.redirectUrl);
        redirectUrl.searchParams.append('token', accessToken);
        redirectUrl.searchParams.append('user', JSON.stringify(user));
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
