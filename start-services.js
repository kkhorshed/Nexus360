const { spawn } = require('child_process');
const path = require('path');

// Configuration for all services
const services = {
  platform: [
    { name: 'auth', path: 'services/auth-service', port: 3006 }
  ],
  apps: [
    { name: 'crm', path: 'apps/crm', port: 3010 },
    { name: 'ai-chat', path: 'apps/ai-chat', port: 3020 }
  ]
};

// Function to start a service
function startService(service) {
  const cwd = path.join(__dirname, service.path);
  const env = { ...process.env, PORT: service.port };

  console.log(`Starting ${service.name} on port ${service.port}...`);
  const proc = spawn('npm', ['run', 'dev'], { cwd, env, shell: true });

  proc.stdout.on('data', (data) => {
    console.log(`[${service.name}] ${data.toString().trim()}`);
  });

  proc.stderr.on('data', (data) => {
    console.error(`[${service.name}] ${data.toString().trim()}`);
  });

  proc.on('close', (code) => {
    if (code !== 0) {
      console.error(`[${service.name}] Process exited with code ${code}`);
    }
  });

  return proc;
}

// Start platform services
console.log('Starting platform services...');
services.platform.forEach(service => {
  startService(service);
});

// Start applications
console.log('\nStarting applications...');
services.apps.forEach(service => {
  startService(service);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nShutting down all services...');
  process.exit();
});

console.log('\nAll services started. Press Ctrl+C to stop.');
console.log('\nAccess the applications at:');
services.apps.forEach(app => {
  console.log(`- ${app.name}: http://localhost:${app.port}`);
});
