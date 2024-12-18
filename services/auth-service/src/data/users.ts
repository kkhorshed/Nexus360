import { Pool } from 'pg';
import { logger } from '../utils/logger';

export interface AzureUser {
  id: string;
  email: string;
  displayName: string;
  givenName?: string;
  surname?: string;
  jobTitle?: string;
  department?: string;
  officeLocation?: string;
  profilePictureUrl?: string | null;
}

export interface SyncResult {
  updated: number;
  failed: number;
}

export class UsersData {
  constructor(private pool: Pool) {}

  async syncUser(user: AzureUser) {
    const query = `
      SELECT * FROM sync_azure_user($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;

    try {
      logger.info('Syncing user:', { id: user.id, displayName: user.displayName });
      const result = await this.pool.query(query, [
        user.id,
        user.email,
        user.displayName,
        user.givenName || null,
        user.surname || null,
        user.jobTitle || null,
        user.department || null,
        user.officeLocation || null,
        user.profilePictureUrl || null
      ]);
      
      return result.rows[0];
    } catch (error) {
      logger.error('Error syncing user:', error);
      throw error;
    }
  }

  async syncUsers(users: AzureUser[]): Promise<SyncResult> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      let updated = 0;
      let failed = 0;

      for (const user of users) {
        try {
          logger.info('Syncing user in batch:', { id: user.id, displayName: user.displayName });
          await client.query(`
            SELECT * FROM sync_azure_user($1, $2, $3, $4, $5, $6, $7, $8, $9)
          `, [
            user.id,
            user.email,
            user.displayName,
            user.givenName || null,
            user.surname || null,
            user.jobTitle || null,
            user.department || null,
            user.officeLocation || null,
            user.profilePictureUrl || null
          ]);
          updated++;
        } catch (error) {
          logger.error(`Error syncing user ${user.id}:`, error);
          failed++;
        }
      }

      await client.query('COMMIT');
      return { updated, failed };
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Error syncing users:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getUserByEmail(email: string) {
    const query = `
      SELECT 
        id,
        email,
        display_name as "displayName",
        given_name as "givenName",
        surname,
        job_title as "jobTitle",
        department,
        office_location as "officeLocation",
        profile_picture_url as "profilePictureUrl",
        is_active as "isActive",
        last_sync_at as "lastSyncAt"
      FROM users 
      WHERE email = $1
    `;
    
    try {
      logger.info('Getting user by email:', email);
      const result = await this.pool.query(query, [email]);
      if (result.rows.length === 0) {
        // If user doesn't exist, create a mock user for development
        if (process.env.NODE_ENV === 'development') {
          const mockUser = {
            id: 'dev-admin',
            email: email,
            displayName: 'Development Admin',
            givenName: 'Development',
            surname: 'Admin',
            jobTitle: 'Administrator',
            department: 'IT',
            officeLocation: 'Main Office',
            profilePictureUrl: null,
            isActive: true,
            lastSyncAt: new Date().toISOString()
          };
          
          // Sync the mock user to the database
          await this.syncUser({
            id: mockUser.id,
            email: mockUser.email,
            displayName: mockUser.displayName,
            givenName: mockUser.givenName,
            surname: mockUser.surname,
            jobTitle: mockUser.jobTitle,
            department: mockUser.department,
            officeLocation: mockUser.officeLocation,
            profilePictureUrl: mockUser.profilePictureUrl
          });

          return mockUser;
        }
        return null;
      }
      return result.rows[0];
    } catch (error) {
      logger.error('Error getting user by email:', error);
      throw error;
    }
  }

  async searchUsers(query: string) {
    const searchQuery = `
      SELECT 
        id,
        email,
        display_name as "displayName",
        given_name as "givenName",
        surname,
        job_title as "jobTitle",
        department,
        office_location as "officeLocation",
        profile_picture_url as "profilePictureUrl",
        is_active as "isActive",
        last_sync_at as "lastSyncAt"
      FROM users 
      WHERE is_active = true 
        AND (
          LOWER(display_name) LIKE LOWER($1) 
          OR LOWER(email) LIKE LOWER($1)
        )
      ORDER BY display_name
      LIMIT 50
    `;
    
    try {
      const result = await this.pool.query(searchQuery, [`%${query}%`]);
      return result.rows;
    } catch (error) {
      logger.error('Error searching users:', error);
      throw error;
    }
  }

  async getUser(id: string) {
    const query = `
      SELECT 
        id,
        email,
        display_name as "displayName",
        given_name as "givenName",
        surname,
        job_title as "jobTitle",
        department,
        office_location as "officeLocation",
        profile_picture_url as "profilePictureUrl",
        is_active as "isActive",
        last_sync_at as "lastSyncAt"
      FROM users 
      WHERE id = $1
    `;
    
    try {
      const result = await this.pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      logger.error('Error getting user:', error);
      throw error;
    }
  }

  async getAllUsers() {
    const query = `
      SELECT 
        id,
        email,
        display_name as "displayName",
        given_name as "givenName",
        surname,
        job_title as "jobTitle",
        department,
        office_location as "officeLocation",
        profile_picture_url as "profilePictureUrl",
        is_active as "isActive",
        last_sync_at as "lastSyncAt"
      FROM users 
      WHERE is_active = true 
      ORDER BY display_name
    `;
    
    try {
      const result = await this.pool.query(query);
      logger.info(`Retrieved ${result.rows.length} users from database`);
      result.rows.forEach(user => {
        logger.debug('User data:', { id: user.id, displayName: user.displayName });
      });
      return result.rows;
    } catch (error) {
      logger.error('Error getting all users:', error);
      throw error;
    }
  }

  async getUserPermissions(userId: string) {
    const query = `
      SELECT * FROM user_permissions_view 
      WHERE user_id = $1
      ORDER BY app_name, role_name, permission_name
    `;
    
    try {
      const result = await this.pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      logger.error('Error getting user permissions:', error);
      throw error;
    }
  }

  async deactivateUser(id: string) {
    const query = `
      UPDATE users 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    
    try {
      const result = await this.pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      logger.error('Error deactivating user:', error);
      throw error;
    }
  }

  async reactivateUser(id: string) {
    const query = `
      UPDATE users 
      SET is_active = true, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    
    try {
      const result = await this.pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      logger.error('Error reactivating user:', error);
      throw error;
    }
  }
}
