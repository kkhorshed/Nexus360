import { Pool } from 'pg';
import { logger } from '../utils/logger';
import { GraphService } from './graphService';
import { DatabaseError } from '../errors/customErrors';
import { User, SyncResult } from '../types/user';

export class SyncService {
  private pool: Pool;
  private graphService: GraphService;

  constructor(pool: Pool, graphService: GraphService) {
    this.pool = pool;
    this.graphService = graphService;
  }

  async syncUsers(): Promise<SyncResult> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      logger.info('Starting user synchronization...');

      // Get users from Azure AD
      const azureUsers = await this.graphService.getAllUsers();
      logger.info(`Retrieved ${azureUsers.length} users from Azure AD`);

      let updated = 0;
      let failed = 0;

      // Process each user
      for (const user of azureUsers) {
        try {
          await client.query(
            `SELECT sync_azure_user($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
              user.id,
              user.email,
              user.displayName,
              null, // givenName - not available in current GraphUser
              null, // surname - not available in current GraphUser
              user.jobTitle,
              user.department,
              user.officeLocation
            ]
          );
          updated++;
        } catch (error) {
          logger.error(`Failed to sync user ${user.id}:`, error);
          failed++;
        }
      }

      await client.query('COMMIT');
      logger.info(`Sync completed. Updated: ${updated}, Failed: ${failed}`);

      return {
        total: azureUsers.length,
        updated,
        failed
      };
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Error during user synchronization:', error);
      throw new DatabaseError('Failed to synchronize users');
    } finally {
      client.release();
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      const result = await this.pool.query(`
        SELECT 
          id,
          email,
          display_name as "displayName",
          given_name as "givenName",
          surname,
          job_title as "jobTitle",
          department,
          office_location as "officeLocation",
          email as "userPrincipalName",
          is_active as "isActive",
          last_sync_at as "lastSyncAt"
        FROM users
        WHERE is_active = true
        ORDER BY display_name
      `);

      return result.rows.map(row => ({
        id: row.id,
        email: row.email,
        displayName: row.displayName,
        givenName: row.givenName,
        surname: row.surname,
        jobTitle: row.jobTitle,
        department: row.department,
        officeLocation: row.officeLocation,
        userPrincipalName: row.userPrincipalName,
        isActive: row.isActive,
        lastSyncAt: row.lastSyncAt
      }));
    } catch (error) {
      logger.error('Error fetching users from database:', error);
      throw new DatabaseError('Failed to fetch users from database');
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      const result = await this.pool.query(`
        SELECT 
          id,
          email,
          display_name as "displayName",
          given_name as "givenName",
          surname,
          job_title as "jobTitle",
          department,
          office_location as "officeLocation",
          email as "userPrincipalName",
          is_active as "isActive",
          last_sync_at as "lastSyncAt"
        FROM users
        WHERE id = $1
      `, [userId]);

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        id: row.id,
        email: row.email,
        displayName: row.displayName,
        givenName: row.givenName,
        surname: row.surname,
        jobTitle: row.jobTitle,
        department: row.department,
        officeLocation: row.officeLocation,
        userPrincipalName: row.userPrincipalName,
        isActive: row.isActive,
        lastSyncAt: row.lastSyncAt
      };
    } catch (error) {
      logger.error('Error fetching user by ID:', error);
      throw new DatabaseError('Failed to fetch user from database');
    }
  }

  async searchUsers(query: string): Promise<User[]> {
    try {
      const result = await this.pool.query(`
        SELECT 
          id,
          email,
          display_name as "displayName",
          given_name as "givenName",
          surname,
          job_title as "jobTitle",
          department,
          office_location as "officeLocation",
          email as "userPrincipalName",
          is_active as "isActive",
          last_sync_at as "lastSyncAt"
        FROM users
        WHERE 
          is_active = true
          AND (
            LOWER(display_name) LIKE LOWER($1)
            OR LOWER(email) LIKE LOWER($1)
          )
        ORDER BY display_name
        LIMIT 50
      `, [`%${query}%`]);

      return result.rows.map(row => ({
        id: row.id,
        email: row.email,
        displayName: row.displayName,
        givenName: row.givenName,
        surname: row.surname,
        jobTitle: row.jobTitle,
        department: row.department,
        officeLocation: row.officeLocation,
        userPrincipalName: row.userPrincipalName,
        isActive: row.isActive,
        lastSyncAt: row.lastSyncAt
      }));
    } catch (error) {
      logger.error('Error searching users:', error);
      throw new DatabaseError('Failed to search users in database');
    }
  }
}
