const { Client } = require('pg');
require('dotenv').config();

async function verifyPostgres() {
  console.log('\n🔍 Verifying PostgreSQL Connection\n');
  
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: 'postgres' // Connect to default database first
  });

  try {
    console.log('Connecting to PostgreSQL...');
    await client.connect();
    console.log('✅ Successfully connected to PostgreSQL');

    // Check if our database exists
    const result = await client.query(
      "SELECT datname FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME || 'nexus360_audit']
    );

    if (result.rows.length === 0) {
      console.log(`\nCreating database ${process.env.DB_NAME || 'nexus360_audit'}...`);
      await client.query(`CREATE DATABASE ${process.env.DB_NAME || 'nexus360_audit'}`);
      console.log('✅ Database created successfully');
    } else {
      console.log(`\n✅ Database ${process.env.DB_NAME || 'nexus360_audit'} already exists`);
    }

    console.log('\n✨ PostgreSQL is properly configured and ready to use');
    return true;
  } catch (error) {
    console.error('\n❌ PostgreSQL Connection Error:', error.message);
    console.log('\nPossible solutions:');
    console.log('1. Ensure PostgreSQL service is running');
    console.log('2. Verify the password has been reset using POSTGRES_RESET.md instructions');
    console.log('3. Check that .env credentials match your PostgreSQL setup');
    return false;
  } finally {
    await client.end();
  }
}

// Run if called directly
if (require.main === module) {
  verifyPostgres().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { verifyPostgres };
