const { execSync } = require('child_process');

function clearPort(port) {
    try {
        // Find process using the port
        const findCommand = `netstat -ano | findstr :${port}`;
        const output = execSync(findCommand, { encoding: 'utf-8' });
        
        if (output) {
            // Extract PID from the output
            const lines = output.split('\n');
            const pids = new Set();
            
            lines.forEach(line => {
                const match = line.match(/\s+(\d+)\s*$/);
                if (match) {
                    pids.add(match[1]);
                }
            });

            // Kill each process
            pids.forEach(pid => {
                try {
                    execSync(`taskkill /F /PID ${pid}`);
                    console.log(`Successfully killed process ${pid} using port ${port}`);
                } catch (err) {
                    console.log(`Failed to kill process ${pid}: ${err.message}`);
                }
            });
        } else {
            console.log(`No process found using port ${port}`);
        }
    } catch (error) {
        // If no process is found using the port, netstat command will fail
        console.log(`Port ${port} is free`);
    }
}

// Clear frontend and auth service ports
clearPort(3000); // Frontend port
clearPort(3001); // Auth service port
