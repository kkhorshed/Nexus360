import { Pool } from 'pg';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { logger } from '../utils/logger';
import { config } from '../config';

async function initDatabase() {
  const pool = new Pool(config.database);

  try {
    // Read migration files
    const userTableSQL = await readFile(
      join(__dirname, 'migrations', '001_create_users_table.sql'),
      'utf8'
    );

    // Execute migrations
    await pool.query(userTableSQL);

    logger.info('Database initialization completed successfully');
  } catch (error) {
    logger.error('Error initializing database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Execute if run directly
if (require.main === module) {
  initDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Database initialization failed:', error);
      process.exit(1);
    });
}

export { initDatabase };
