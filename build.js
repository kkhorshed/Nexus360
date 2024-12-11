const { spawn } = require('child_process');
const path = require('path');

// Helper function to run a command in a specific directory
function runCommand(command, args, cwd) {
    return new Promise((resolve, reject) => {
        const process = spawn(command, args, {
            cwd: path.join(__dirname, cwd),
            shell: true,
            stdio: 'inherit'
        });

        process.on('error', reject);
        process.on('exit', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Command failed with exit code ${code}`));
            }
        });
    });
}

async function buildProject() {
    try {
        // Build auth service
        console.log('Building auth service...');
        await runCommand('npm', ['run', 'build'], 'services/auth-service');

        // Build frontend
        console.log('Building frontend...');
        await runCommand('npm', ['run', 'build'], 'frontend');

        console.log('Build completed successfully!');
    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

buildProject();
