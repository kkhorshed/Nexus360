import { Pool } from 'pg';
import { encrypt, decrypt } from '../utils/encryption';
import { logger } from '../utils/logger';

interface ConfigItem {
  key: string;
  value: string;
  encrypted: boolean;
  created_at: Date;
  updated_at: Date;
}

export class ConfigService {
  private pool: Pool;
  private static instance: ConfigService;

  private constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL
    });
  }

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  private async query(text: string, params?: any[]) {
    const client = await this.pool.connect();
    try {
      return await client.query(text, params);
    } finally {
      client.release();
    }
  }

  async getConfig(key: string): Promise<string | null> {
    try {
      const result = await this.query(
        'SELECT value, encrypted FROM app_config WHERE key = $1',
        [key]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const { value, encrypted } = result.rows[0];
      return encrypted ? decrypt(value) : value;
    } catch (error) {
      logger.error('Error getting config:', error);
      throw error;
    }
  }

  async setConfig(key: string, value: string, encrypted: boolean = false): Promise<void> {
    try {
      const storedValue = encrypted ? encrypt(value) : value;
      await this.query(
        `INSERT INTO app_config (key, value, encrypted)
         VALUES ($1, $2, $3)
         ON CONFLICT (key) DO UPDATE
         SET value = $2, encrypted = $3, updated_at = CURRENT_TIMESTAMP`,
        [key, storedValue, encrypted]
      );
    } catch (error) {
      logger.error('Error setting config:', error);
      throw error;
    }
  }

  async getAzureConfig(): Promise<{
    tenantId: string;
    clientId: string;
    clientSecret: string;
  }> {
    try {
      const [tenantId, clientId, clientSecret] = await Promise.all([
        this.getConfig('azure_ad_tenant_id'),
        this.getConfig('azure_ad_client_id'),
        this.getConfig('azure_ad_client_secret')
      ]);

      return {
        tenantId: tenantId || '',
        clientId: clientId || '',
        clientSecret: clientSecret || ''
      };
    } catch (error) {
      logger.error('Error getting Azure config:', error);
      throw error;
    }
  }

  async setAzureConfig(config: {
    tenantId: string;
    clientId: string;
    clientSecret: string;
  }): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      await Promise.all([
        this.setConfig('azure_ad_tenant_id', config.tenantId),
        this.setConfig('azure_ad_client_id', config.clientId),
        this.setConfig('azure_ad_client_secret', config.clientSecret, true)
      ]);

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Error setting Azure config:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async deleteConfig(key: string): Promise<void> {
    try {
      await this.query('DELETE FROM app_config WHERE key = $1', [key]);
    } catch (error) {
      logger.error('Error deleting config:', error);
      throw error;
    }
  }
}
