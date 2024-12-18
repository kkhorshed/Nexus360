import { Router } from 'express';
import { ADService } from '../services/adService';
import { ConfigService } from '../services/configService';
import { logger } from '../utils/logger';
import { Request, Response, NextFunction } from 'express';

const router = Router();
const configService = ConfigService.getInstance();

// Helper function to check if error is related to missing Azure config
const isMissingConfigError = (error: unknown): boolean => {
  return error instanceof Error && 
    error.message.includes('Missing required Azure AD configuration');
};

// Get Azure configuration
router.get('/azure', async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('Fetching Azure configuration');
    
    const config = {
      tenantId: process.env.AZURE_AD_TENANT_ID || '',
      clientId: process.env.AZURE_AD_CLIENT_ID || ''
      // Don't send client secret
    };
    
    res.json(config);
  } catch (error) {
    logger.error('Error in Azure config endpoint:', error);
    next(error);
  }
});

// Save Azure configuration
router.post('/azure', async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('Saving Azure configuration');
    const { tenantId, clientId, clientSecret } = req.body;

    if (!tenantId || !clientId || !clientSecret) {
      logger.error('Missing required configuration fields');
      return res.status(400).json({ error: 'Missing required configuration fields' });
    }

    // Update environment variables
    process.env.AZURE_AD_TENANT_ID = tenantId;
    process.env.AZURE_AD_CLIENT_ID = clientId;
    process.env.AZURE_AD_CLIENT_SECRET = clientSecret;

    logger.info('Azure configuration saved successfully');

    // Return safe config (without client secret)
    res.json({
      tenantId,
      clientId
    });
  } catch (error) {
    logger.error('Error saving Azure configuration:', error);
    next(error);
  }
});

// Test Azure AD connection
router.post('/azure/test', async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('Testing Azure AD connection');
    
    const tenantId = process.env.AZURE_AD_TENANT_ID;
    const clientId = process.env.AZURE_AD_CLIENT_ID;
    const clientSecret = process.env.AZURE_AD_CLIENT_SECRET;
    
    if (!tenantId || !clientId || !clientSecret) {
      logger.error('No Azure configuration found in environment');
      return res.status(400).json({ 
        error: 'Azure AD configuration not found. Please save configuration first.' 
      });
    }

    try {
      const adService = new ADService();
      await adService.getAllUsers();
      logger.info('Azure AD connection test successful');
      res.json({ status: 'success', message: 'Connection test successful' });
    } catch (error) {
      // Provide more specific error messages
      if (isMissingConfigError(error)) {
        logger.error('Azure AD configuration is incomplete or invalid');
        res.status(400).json({ 
          error: 'Azure AD configuration is incomplete or invalid. Please verify your credentials.' 
        });
      } else if (error instanceof Error) {
        logger.error('Azure AD connection failed:', error);
        res.status(400).json({ 
          error: `Azure AD connection failed: ${error.message}` 
        });
      } else {
        throw error;
      }
    }
  } catch (error) {
    logger.error('Error testing Azure connection:', error);
    next(error);
  }
});

export const configRouter = router;
