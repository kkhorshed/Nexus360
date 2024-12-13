const { execSync } = require('child_process');
const path = require('path');

console.log('Installing dependencies for Nexus360 workspace...\n');

try {
  // Clean install at root level which will handle all workspaces
  console.log('Installing all workspace dependencies...');
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });

  // Build shared packages in order
  console.log('\nBuilding shared packages...');
  
  // Build utils first as it has no dependencies
  console.log('\nBuilding @nexus360/utils...');
  execSync('npm run build', { 
    cwd: path.join(__dirname, 'packages', 'utils'),
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' }
  });

  // Build api-client next as it depends on utils
  console.log('\nBuilding @nexus360/api-client...');
  execSync('npm run build', { 
    cwd: path.join(__dirname, 'packages', 'api-client'),
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' }
  });

  // Build UI last as it depends on both utils and api-client
  console.log('\nBuilding @nexus360/ui...');
  execSync('npm run build', { 
    cwd: path.join(__dirname, 'packages', 'ui'),
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' }
  });

  console.log('\nAll dependencies installed and packages built successfully!');
  console.log('\nYou can now start the development servers:');
  console.log('- Platform services: npm run start:platform');
  console.log('- Applications: npm run start:apps');
  console.log('- Individual app: cd apps/[app-name] && npm run dev');

} catch (error) {
  console.error('\nError during installation:', error.message);
  process.exit(1);
}
