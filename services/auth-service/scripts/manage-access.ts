import { Pool } from 'pg';
import { program } from 'commander';
import { databaseConfig } from '../src/config/database';
import { logger } from '../src/utils/logger';

const pool = new Pool(databaseConfig);

async function grantAppAccess(userId: string, appName: string, grantedBy: string) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check if app exists
    const appResult = await client.query(
      'SELECT id FROM applications WHERE name = $1',
      [appName]
    );

    if (appResult.rows.length === 0) {
      throw new Error(`Application ${appName} not found`);
    }

    const appId = appResult.rows[0].id;

    // Grant access
    await client.query(
      `INSERT INTO user_app_access (user_id, app_id, granted_by)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, app_id) 
       DO UPDATE SET 
         is_active = true,
         revoked_at = NULL,
         granted_by = $3,
         granted_at = CURRENT_TIMESTAMP`,
      [userId, appId, grantedBy]
    );

    // Grant default role
    const defaultRoleResult = await client.query(
      `SELECT id FROM app_roles 
       WHERE app_id = $1 AND name = $2`,
      [appId, `${appName}_user`]
    );

    if (defaultRoleResult.rows.length > 0) {
      await client.query(
        `INSERT INTO user_app_roles (user_id, app_role_id, granted_by)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, app_role_id) 
         DO UPDATE SET 
           is_active = true,
           revoked_at = NULL,
           granted_by = $3,
           granted_at = CURRENT_TIMESTAMP`,
        [userId, defaultRoleResult.rows[0].id, grantedBy]
      );
    }

    await client.query('COMMIT');
    logger.info(`Granted ${appName} access to user ${userId}`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function assignRole(userId: string, appName: string, roleName: string, grantedBy: string) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check if user has app access
    const accessResult = await client.query(
      `SELECT uaa.id 
       FROM user_app_access uaa
       JOIN applications a ON a.id = uaa.app_id
       WHERE uaa.user_id = $1 
       AND a.name = $2 
       AND uaa.is_active = true`,
      [userId, appName]
    );

    if (accessResult.rows.length === 0) {
      throw new Error(`User ${userId} does not have access to ${appName}`);
    }

    // Get role ID
    const roleResult = await client.query(
      `SELECT ar.id 
       FROM app_roles ar
       JOIN applications a ON a.id = ar.app_id
       WHERE a.name = $1 AND ar.name = $2`,
      [appName, roleName]
    );

    if (roleResult.rows.length === 0) {
      throw new Error(`Role ${roleName} not found for ${appName}`);
    }

    // Assign role
    await client.query(
      `INSERT INTO user_app_roles (user_id, app_role_id, granted_by)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, app_role_id) 
       DO UPDATE SET 
         is_active = true,
         revoked_at = NULL,
         granted_by = $3,
         granted_at = CURRENT_TIMESTAMP`,
      [userId, roleResult.rows[0].id, grantedBy]
    );

    await client.query('COMMIT');
    logger.info(`Assigned role ${roleName} to user ${userId} for ${appName}`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function listUserAccess(userId: string) {
  try {
    const result = await pool.query(
      `SELECT 
        a.name as app_name,
        a.display_name,
        STRING_AGG(ar.name, ', ') as roles,
        STRING_AGG(DISTINCT ap.name, ', ') as permissions
       FROM user_app_access uaa
       JOIN applications a ON a.id = uaa.app_id
       LEFT JOIN user_app_roles uar ON uar.user_id = uaa.user_id
       LEFT JOIN app_roles ar ON ar.id = uar.app_role_id
       LEFT JOIN app_role_permissions arp ON arp.app_role_id = ar.id
       LEFT JOIN app_permissions ap ON ap.id = arp.permission_id
       WHERE uaa.user_id = $1
         AND uaa.is_active = true
         AND (uar.is_active IS NULL OR uar.is_active = true)
       GROUP BY a.name, a.display_name`,
      [userId]
    );

    console.log('\nUser Access Summary:');
    console.table(result.rows);
  } catch (error) {
    throw error;
  }
}

program
  .version('1.0.0')
  .description('Manage application access and roles');

program
  .command('grant-access')
  .description('Grant application access to a user')
  .argument('<userId>', 'User ID')
  .argument('<appName>', 'Application name (e.g., xrm, sales_compensation)')
  .argument('[grantedBy]', 'Admin user ID granting access', 'system')
  .action(async (userId, appName, grantedBy) => {
    try {
      await grantAppAccess(userId, appName, grantedBy);
      process.exit(0);
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

program
  .command('assign-role')
  .description('Assign a role to a user')
  .argument('<userId>', 'User ID')
  .argument('<appName>', 'Application name')
  .argument('<roleName>', 'Role name (e.g., xrm_admin, comp_manager)')
  .argument('[grantedBy]', 'Admin user ID granting the role', 'system')
  .action(async (userId, appName, roleName, grantedBy) => {
    try {
      await assignRole(userId, appName, roleName, grantedBy);
      process.exit(0);
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

program
  .command('list-access')
  .description('List user\'s access and permissions')
  .argument('<userId>', 'User ID')
  .action(async (userId) => {
    try {
      await listUserAccess(userId);
      process.exit(0);
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

if (require.main === module) {
  program.parse(process.argv);
}
