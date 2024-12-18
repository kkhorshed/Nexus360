import { Router } from 'express';
import { ADService } from '../services/adService';
import { config } from '../config';
import fs from 'fs/promises';
import path from 'path';
import { logger } from '../utils/logger';
import { Request, Response, NextFunction } from 'express';

const router = Router();
const CONFIG_FILE = path.join(__dirname, '../config/azure.json');

// Helper function to check if error is related to missing Azure config
const isMissingConfigError = (error: unknown): boolean => {
  return error instanceof Error && 
    error.message.includes('Missing required Azure AD configuration');
};

// Ensure config directory exists
const ensureConfigDir = async () => {
  const configDir = path.dirname(CONFIG_FILE);
  await fs.mkdir(configDir, { recursive: true });
};

// Get Azure configuration
router.get('/azure', async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('Fetching Azure configuration');
    await ensureConfigDir();
    
    try {
      const configData = await fs.readFile(CONFIG_FILE, 'utf8');
      logger.info('Found existing Azure configuration');
      const azureConfig = JSON.parse(configData);
      // Don't send the client secret back to the client
      const { clientSecret, ...safeConfig } = azureConfig;
      res.json(safeConfig);
    } catch (error) {
      // If file doesn't exist, return empty config
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        logger.info('No existing Azure configuration found, returning empty config');
        res.json({
          tenantId: '',
          clientId: ''
        });
      } else {
        logger.error('Error reading Azure configuration:', error);
        throw error;
      }
    }
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

    await ensureConfigDir();
    
    // Save configuration
    const configData = {
      tenantId,
      clientId,
      clientSecret
    };
    
    await fs.writeFile(CONFIG_FILE, JSON.stringify(configData, null, 2));

    // Update environment variables
    process.env.AZURE_AD_TENANT_ID = tenantId;
    process.env.AZURE_AD_CLIENT_ID = clientId;
    process.env.AZURE_AD_CLIENT_SECRET = clientSecret;

    logger.info('Azure configuration saved successfully');

    // Return safe config (without client secret)
    const { clientSecret: _, ...safeConfig } = configData;
    res.json(safeConfig);
  } catch (error) {
    logger.error('Error saving Azure configuration:', error);
    next(error);
  }
});

// Test Azure AD connection
router.post('/azure/test', async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('Testing Azure AD connection');
    
    // Check environment variables instead of file
    if (!process.env.AZURE_AD_TENANT_ID || 
        !process.env.AZURE_AD_CLIENT_ID || 
        !process.env.AZURE_AD_CLIENT_SECRET) {
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
