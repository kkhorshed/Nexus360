import { Pool } from 'pg';
import { logger } from '../utils/logger';
import { DatabaseError, NotFoundError, AuthorizationError } from '../errors/customErrors';

interface AppAccess {
  userId: string;
  appId: number;
  isActive: boolean;
  grantedAt: Date;
  grantedBy: string;
  revokedAt?: Date;
}

interface AppRole {
  id: number;
  appId: number;
  name: string;
  description?: string;
}

interface AppPermission {
  id: number;
  appId: number;
  name: string;
  description?: string;
}

export class AppAccessService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async hasAppAccess(userId: string, appName: string): Promise<boolean> {
    try {
      const query = `
        SELECT uaa.is_active 
        FROM user_app_access uaa
        JOIN applications a ON a.id = uaa.app_id
        WHERE uaa.user_id = $1 
        AND a.name = $2 
        AND uaa.is_active = true
        AND uaa.revoked_at IS NULL`;

      const result = await this.pool.query(query, [userId, appName]);
      return result.rows.length > 0;
    } catch (error) {
      logger.error('Error checking app access:', error);
      throw new DatabaseError('Failed to check app access');
    }
  }

  async grantAppAccess(userId: string, appName: string, grantedBy: string): Promise<void> {
    try {
      // Start transaction
      const client = await this.pool.connect();
      try {
        await client.query('BEGIN');

        // Get app ID
        const appQuery = 'SELECT id FROM applications WHERE name = $1';
        const appResult = await client.query(appQuery, [appName]);
        
        if (appResult.rows.length === 0) {
          throw new NotFoundError(`Application ${appName} not found`);
        }

        const appId = appResult.rows[0].id;

        // Grant access
        const grantQuery = `
          INSERT INTO user_app_access (user_id, app_id, granted_by)
          VALUES ($1, $2, $3)
          ON CONFLICT (user_id, app_id) 
          DO UPDATE SET 
            is_active = true,
            revoked_at = NULL,
            granted_by = $3,
            granted_at = CURRENT_TIMESTAMP`;

        await client.query(grantQuery, [userId, appId, grantedBy]);

        // Grant default role for the app
        const defaultRoleQuery = `
          INSERT INTO user_app_roles (user_id, app_role_id, granted_by)
          SELECT $1, id, $3
          FROM app_roles
          WHERE app_id = $2 AND name LIKE $4
          ON CONFLICT (user_id, app_role_id) 
          DO UPDATE SET 
            is_active = true,
            revoked_at = NULL,
            granted_by = $3,
            granted_at = CURRENT_TIMESTAMP`;

        await client.query(defaultRoleQuery, [userId, appId, grantedBy, `${appName}_user`]);

        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error('Error granting app access:', error);
      throw error instanceof DatabaseError ? error : new DatabaseError('Failed to grant app access');
    }
  }

  async revokeAppAccess(userId: string, appName: string, revokedBy: string): Promise<void> {
    try {
      const client = await this.pool.connect();
      try {
        await client.query('BEGIN');

        // Get app ID
        const appQuery = 'SELECT id FROM applications WHERE name = $1';
        const appResult = await client.query(appQuery, [appName]);
        
        if (appResult.rows.length === 0) {
          throw new NotFoundError(`Application ${appName} not found`);
        }

        const appId = appResult.rows[0].id;

        // Revoke access
        const revokeQuery = `
          UPDATE user_app_access 
          SET is_active = false, revoked_at = CURRENT_TIMESTAMP
          WHERE user_id = $1 AND app_id = $2`;

        await client.query(revokeQuery, [userId, appId]);

        // Revoke all roles for this app
        const revokeRolesQuery = `
          UPDATE user_app_roles uar
          SET is_active = false, revoked_at = CURRENT_TIMESTAMP
          FROM app_roles ar
          WHERE uar.app_role_id = ar.id
          AND ar.app_id = $2
          AND uar.user_id = $1`;

        await client.query(revokeRolesQuery, [userId, appId]);

        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error('Error revoking app access:', error);
      throw error instanceof DatabaseError ? error : new DatabaseError('Failed to revoke app access');
    }
  }

  async getUserAppPermissions(userId: string, appName: string): Promise<string[]> {
    try {
      const query = `
        SELECT DISTINCT ap.name
        FROM user_app_roles uar
        JOIN app_roles ar ON ar.id = uar.app_role_id
        JOIN applications a ON a.id = ar.app_id
        JOIN app_role_permissions arp ON arp.app_role_id = ar.id
        JOIN app_permissions ap ON ap.id = arp.permission_id
        WHERE uar.user_id = $1 
        AND a.name = $2
        AND uar.is_active = true
        AND uar.revoked_at IS NULL`;

      const result = await this.pool.query(query, [userId, appName]);
      return result.rows.map(row => row.name);
    } catch (error) {
      logger.error('Error getting user app permissions:', error);
      throw new DatabaseError('Failed to get user app permissions');
    }
  }

  async hasPermission(userId: string, appName: string, permission: string): Promise<boolean> {
    try {
      const query = `
        SELECT 1
        FROM user_app_roles uar
        JOIN app_roles ar ON ar.id = uar.app_role_id
        JOIN applications a ON a.id = ar.app_id
        JOIN app_role_permissions arp ON arp.app_role_id = ar.id
        JOIN app_permissions ap ON ap.id = arp.permission_id
        WHERE uar.user_id = $1 
        AND a.name = $2
        AND ap.name = $3
        AND uar.is_active = true
        AND uar.revoked_at IS NULL
        LIMIT 1`;

      const result = await this.pool.query(query, [userId, appName, permission]);
      return result.rows.length > 0;
    } catch (error) {
      logger.error('Error checking permission:', error);
      throw new DatabaseError('Failed to check permission');
    }
  }

  async assignRole(userId: string, appName: string, roleName: string, grantedBy: string): Promise<void> {
    try {
      const client = await this.pool.connect();
      try {
        await client.query('BEGIN');

        // Verify app access
        const hasAccess = await this.hasAppAccess(userId, appName);
        if (!hasAccess) {
          throw new AuthorizationError(`User does not have access to ${appName}`);
        }

        // Get role ID
        const roleQuery = `
          SELECT ar.id 
          FROM app_roles ar
          JOIN applications a ON a.id = ar.app_id
          WHERE a.name = $1 AND ar.name = $2`;
        const roleResult = await client.query(roleQuery, [appName, roleName]);

        if (roleResult.rows.length === 0) {
          throw new NotFoundError(`Role ${roleName} not found for ${appName}`);
        }

        const roleId = roleResult.rows[0].id;

        // Assign role
        const assignQuery = `
          INSERT INTO user_app_roles (user_id, app_role_id, granted_by)
          VALUES ($1, $2, $3)
          ON CONFLICT (user_id, app_role_id) 
          DO UPDATE SET 
            is_active = true,
            revoked_at = NULL,
            granted_by = $3,
            granted_at = CURRENT_TIMESTAMP`;

        await client.query(assignQuery, [userId, roleId, grantedBy]);

        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error('Error assigning role:', error);
      throw error instanceof DatabaseError ? error : new DatabaseError('Failed to assign role');
    }
  }

  async getUserApps(userId: string): Promise<{ name: string; displayName: string; roles: string[] }[]> {
    try {
      const query = `
        SELECT 
          a.name,
          a.display_name,
          ARRAY_AGG(DISTINCT ar.name) as roles
        FROM user_app_access uaa
        JOIN applications a ON a.id = uaa.app_id
        LEFT JOIN user_app_roles uar ON uar.user_id = uaa.user_id
        LEFT JOIN app_roles ar ON ar.id = uar.app_role_id AND ar.app_id = a.id
        WHERE uaa.user_id = $1 
        AND uaa.is_active = true
        AND uaa.revoked_at IS NULL
        AND (uar.is_active IS NULL OR uar.is_active = true)
        AND (uar.revoked_at IS NULL)
        GROUP BY a.name, a.display_name`;

      const result = await this.pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      logger.error('Error getting user apps:', error);
      throw new DatabaseError('Failed to get user apps');
    }
  }
}
