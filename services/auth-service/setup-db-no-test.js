const { Client } = require('pg');
const fs = require('fs').promises;
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const dbConfig = {
  user: 'postgres',
  password: '987789',
  host: 'localhost',
  port: 5432,
  database: 'postgres' // Connect to default database first
};

async function dropAndCreateDatabase() {
  const client = new Client(dbConfig);
  const dbName = 'nexus360_auth';

  try {
    await client.connect();
    
    // Force close all connections to the database
    console.log('Closing all connections to the database...');
    await client.query(`
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = '${dbName}'
      AND pid <> pg_backend_pid()
    `);
    
    // Drop database if exists
    console.log(`Dropping database if exists: ${dbName}`);
    await client.query(`DROP DATABASE IF EXISTS ${dbName}`);
    
    // Create database
    console.log(`Creating database: ${dbName}`);
    await client.query(`CREATE DATABASE ${dbName}`);
    console.log('Database created successfully');
  } catch (err) {
    console.error('Error creating database:', err);
    throw err;
  } finally {
    await client.end();
  }
}

async function runMigrations() {
  // Connect to the nexus360_auth database
  const client = new Client({
    ...dbConfig,
    database: 'nexus360_auth'
  });

  try {
    await client.connect();
    console.log('Connected to database, running migrations...');

    // Get all migration files
    const migrationsDir = path.join(__dirname, 'src', 'db', 'migrations');
    const migrationFiles = await fs.readdir(migrationsDir);
    
    // Sort migration files to ensure they run in order
    migrationFiles.sort();

    // Run each migration in a transaction, excluding test user migration
    for (const file of migrationFiles) {
      // Skip the test user migration
      if (file === '003_insert_test_user.sql') {
        console.log('Skipping test user migration');
        continue;
      }

      if (file.endsWith('.sql')) {
        console.log(`Running migration: ${file}`);
        const migrationPath = path.join(migrationsDir, file);
        const migration = await fs.readFile(migrationPath, 'utf8');
        
        await client.query('BEGIN');
        try {
          await client.query(migration);
          await client.query('COMMIT');
          console.log(`Migration ${file} completed successfully`);
        } catch (err) {
          await client.query('ROLLBACK');
          console.error(`Error running migration ${file}:`, err);
          throw err;
        }
      }
    }
    
    console.log('All migrations completed successfully');

  } catch (err) {
    console.error('Error running migrations:', err);
    throw err;
  } finally {
    await client.end();
  }
}

async function setupDatabase() {
  try {
    await dropAndCreateDatabase();
    await runMigrations();
    console.log('Database setup completed successfully');
  } catch (err) {
    console.error('Database setup failed:', err);
    process.exit(1);
  }
}

setupDatabase();
