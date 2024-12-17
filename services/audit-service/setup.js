const { execSync } = require('child_process');
const { existsSync, writeFileSync } = require('fs');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => readline.question(query, resolve));

async function main() {
  console.log('\n📦 Audit Service Setup\n');

  // Check if .env exists
  if (!existsSync('.env')) {
    console.log('Creating .env file...');
    writeFileSync('.env', `
PORT=3001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=nexus360_audit

# Cors Configuration
CORS_ORIGIN=http://localhost:3000
    `.trim());
    console.log('✅ Created .env file');
  }

  // Install dependencies
  console.log('\n📥 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed');

  console.log('\n🗄️ Database Setup');
  console.log('Please ensure PostgreSQL is running and follow these steps:');
  console.log('1. If you need to reset PostgreSQL password, follow instructions in POSTGRES_RESET.md');
  console.log('2. Make sure the database credentials in .env match your PostgreSQL setup');
  console.log('3. The database will be created automatically when the service starts\n');

  const ready = await question('Are you ready to start the service? (y/n) ');
  
  if (ready.toLowerCase() === 'y') {
    console.log('\n🚀 Starting Audit Service...');
    execSync('npm run dev', { stdio: 'inherit' });
  } else {
    console.log('\n👋 Setup completed. Start the service with "npm run dev" when ready.');
  }

  readline.close();
}

main().catch(error => {
  console.error('Setup failed:', error);
  process.exit(1);
});
