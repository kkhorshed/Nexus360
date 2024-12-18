const { Client } = require('pg');
const fs = require('fs').promises;
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const dbConfig = {
  user: 'postgres',
  password: '987789', // Using the password from .env
  host: 'localhost',
  port: 5432,
  database: 'postgres' // Connect to default database first
};

async function createDatabase() {
  const client = new Client(dbConfig);
  const dbName = 'nexus360';

  try {
    await client.connect();
    
    // Check if database exists
    const checkDb = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbName]
    );

    if (checkDb.rows.length === 0) {
      // Create database if it doesn't exist
      console.log(`Creating database: ${dbName}`);
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log('Database created successfully');
    } else {
      console.log(`Database ${dbName} already exists`);
    }
  } catch (err) {
    console.error('Error creating database:', err);
    throw err;
  } finally {
    await client.end();
  }
}

async function runMigrations() {
  // Connect to the nexus360 database
  const client = new Client({
    ...dbConfig,
    database: 'nexus360'
  });

  try {
    await client.connect();
    console.log('Connected to database, running migrations...');

    // Read and execute migration file
    const migrationPath = path.join(__dirname, 'src', 'db', 'migrations', '001_create_config_table.sql');
    const migration = await fs.readFile(migrationPath, 'utf8');
    
    // Run migration in a transaction
    await client.query('BEGIN');
    await client.query(migration);
    await client.query('COMMIT');
    
    console.log('Migrations completed successfully');

  } catch (err) {
    await client.query('ROLLBACK');
    if (err.code === '42710') { // Duplicate object error
      console.log('Some objects already exist, continuing...');
    } else {
      console.error('Error running migrations:', err);
      throw err;
    }
  } finally {
    await client.end();
  }
}

async function setupDatabase() {
  try {
    await createDatabase();
    await runMigrations();
    console.log('Database setup completed successfully');
  } catch (err) {
    if (err.code === '42710') {
      console.log('Database already set up, continuing...');
    } else {
      console.error('Database setup failed:', err);
      process.exit(1);
    }
  }
}

setupDatabase();
