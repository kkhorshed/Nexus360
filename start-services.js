const { exec } = require('child_process');
const path = require('path');
const util = require('util');
const execAsync = util.promisify(exec);

// Configuration for selected services
const services = {
  platform: [
    { name: 'auth', path: 'services/auth-service', port: 3001 }
  ],
  apps: [
    { name: 'frontend', path: 'frontend', port: 3000 },
    { name: 'admin', path: 'apps/admin', port: 3002 },
    { name: 'xrm', path: 'apps/xrm', port: 3003 },
    { name: 'sales-comp', path: 'apps/sales-comp', port: 3004 }
  ]
};

// Function to kill process on a specific port
async function killProcessOnPort(port) {
  try {
    // Find PID using port
    const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
    if (stdout) {
      // Extract PID from the last column
      const pid = stdout.split(/\s+/).filter(Boolean).pop();
      if (pid) {
        console.log(`Killing process on port ${port} (PID: ${pid})`);
        await execAsync(`taskkill /F /PID ${pid}`);
      }
    }
  } catch (error) {
    // Ignore errors if no process found
    if (!error.message.includes('no tasks')) {
      console.log(`No process found on port ${port}`);
    }
  }
}

// Function to kill all used ports
async function killAllPorts() {
  console.log('Cleaning up ports...');
  const ports = [
    ...services.platform.map(s => s.port),
    ...services.apps.map(s => s.port)
  ];

  await Promise.all(ports.map(port => killProcessOnPort(port)));
  console.log('Ports cleanup completed');
}

// Function to start a service
async function startService(service) {
  const cwd = path.join(__dirname, service.path);
  const env = { ...process.env, PORT: service.port };

  console.log(`Starting ${service.name} on port ${service.port}...`);
  
  try {
    const child = exec('npm run dev', { 
      cwd,
      env,
      windowsHide: true
    });

    child.stdout.on('data', (data) => {
      console.log(`[${service.name}] ${data.toString().trim()}`);
    });

    child.stderr.on('data', (data) => {
      console.error(`[${service.name}] ${data.toString().trim()}`);
    });

    child.on('error', (error) => {
      console.error(`[${service.name}] Error: ${error.message}`);
    });

    child.on('close', (code) => {
      if (code !== 0) {
        console.error(`[${service.name}] Process exited with code ${code}`);
      }
    });

    return child;
  } catch (error) {
    console.error(`Error starting ${service.name}:`, error);
  }
}

// Main function to start everything
async function main() {
  try {
    // First kill any processes on required ports
    await killAllPorts();

    // Start platform services
    console.log('\nStarting platform services...');
    for (const service of services.platform) {
      await startService(service);
    }

    // Start applications
    console.log('\nStarting applications...');
    for (const service of services.apps) {
      await startService(service);
    }

    console.log('\nAll services started. Press Ctrl+C to stop.');
    console.log('\nAccess the applications at:');
    services.apps.forEach(app => {
      console.log(`- ${app.name}: http://localhost:${app.port}`);
    });

  } catch (error) {
    console.error('Error starting services:', error);
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nShutting down all services...');
  process.exit();
});

// Start everything
main();
