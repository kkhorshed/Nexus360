# Services Configuration

## Overview
The start services script is configured to launch multiple services and applications in development mode. Each service runs on a dedicated port to avoid conflicts.

## Services and Ports

### Platform Services
- Auth Service: Port 3001 (services/auth-service)

### Applications
- Frontend: Port 3000 (frontend)
- Admin App: Port 3002 (apps/admin)
- XRM App: Port 3003 (apps/xrm)
- Sales Compensation App: Port 3004 (apps/sales-comp)

## Usage
To start all services, run:
```bash
node start-services.js
```

The script will:
1. Launch all services in parallel
2. Display real-time logs from each service
3. Show the URL where each application can be accessed

## Termination
Press Ctrl+C to stop all running services.
