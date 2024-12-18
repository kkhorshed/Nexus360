import { logger } from '../utils/logger';

export class ConfigService {
  private static instance: ConfigService;

  private constructor() {}

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  async getConfig(key: string): Promise<string | null> {
    try {
      return process.env[key] || null;
    } catch (error) {
      logger.error('Error getting config:', error);
      throw error;
    }
  }

  async getAzureConfig(): Promise<{
    tenantId: string;
    clientId: string;
    clientSecret: string;
  }> {
    try {
      return {
        tenantId: process.env.AZURE_AD_TENANT_ID || '',
        clientId: process.env.AZURE_AD_CLIENT_ID || '',
        clientSecret: process.env.AZURE_AD_CLIENT_SECRET || ''
      };
    } catch (error) {
      logger.error('Error getting Azure config:', error);
      throw error;
    }
  }

  // These methods are kept for backwards compatibility but now just log warnings
  async setConfig(key: string, value: string): Promise<void> {
    logger.warn('setConfig called but config is now managed via environment variables');
  }

  async setAzureConfig(config: {
    tenantId: string;
    clientId: string;
    clientSecret: string;
  }): Promise<void> {
    logger.warn('setAzureConfig called but config is now managed via environment variables');
  }

  async deleteConfig(key: string): Promise<void> {
    logger.warn('deleteConfig called but config is now managed via environment variables');
  }
}
