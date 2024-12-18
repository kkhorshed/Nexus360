# Nexus360 Quick Start Guide

## Project Structure

The Nexus360 platform consists of several components:

### Frontend (Main Entry Point)
- Located in `/frontend`
- Serves as the main application shell
- Handles routing and state management
- Runs on `http://localhost:3000`

### Shared Packages
Located in `/packages`:
- `ui` - Shared UI components and theme
- `api-client` - API client utilities
- `utils` - Common utilities and helpers

### Platform Services
Located in `/platform`:
- `integration` - Integration service (port 3002)
- `notification` - Notification service (port 3003)

### Apps (Micro-frontends)
Located in `/apps`:
- `admin` - Admin Dashboard
- `xrm` - Extended Relationship Management (port 3010)

## Prerequisites

1. **Node.js and pnpm**
   ```bash
   # Install Node.js 18+ from https://nodejs.org
   
   # Install pnpm
   npm install -g pnpm
   ```

2. **PostgreSQL 14+**
   - Download and install from https://www.postgresql.org/download/
   - Create a superuser account
   - Note down credentials for configuration

## Setup Instructions

1. **Clone and Install Dependencies**
   ```bash
   # Clone repository
   git clone https://github.com/your-org/nexus360.git
   cd nexus360

   # Install all workspace dependencies
   pnpm install
   ```

2. **Package Setup**
   ```bash
   # Build shared packages
   cd packages/utils && pnpm build
   cd ../api-client && pnpm build
   cd ../ui && pnpm build
   ```

3. **Environment Configuration**

   a. **Frontend Configuration**
   ```bash
   cp frontend/.env.example frontend/.env
   ```
   ```env
   VITE_API_URL=http://localhost:3002
   VITE_WEBSOCKET_URL=ws://localhost:3003
   ```

   b. **Services Configuration**
   ```bash
   # Copy .env files for all services
   for service in contact integration lead notification task; do
     cp services/${service}-service/.env.example services/${service}-service/.env
   done
   ```

4. **Database Setup**
   ```bash
   # Create database
   psql -U postgres -c "CREATE DATABASE xrm_db;"

   # Initialize schemas
   cd services/contact-service && pnpm run db:init
   cd ../lead-service && pnpm run db:init
   ```

5. **Start Development Environment**

   a. **Start Services**
   ```bash
   # Start all services
   node start-services.js
   ```

   b. **Start Frontend**
   ```bash
   # In a new terminal
   cd frontend
   pnpm dev
   ```

## Verification Steps

1. **Check Services**
   ```bash
   # Verify services are running
   curl http://localhost:3002/health
   curl http://localhost:3003/health
   ```

2. **Access Frontend**
   - Open http://localhost:3000
   - Verify the application loads correctly
   - Check navigation between different apps works

## Common Issues and Solutions

### Database Connection Issues
```bash
# Check PostgreSQL is running
pg_ctl status -D /path/to/data

# Verify connection
psql -U postgres -c "\l" # List databases
```

### Package Build Issues
```bash
# Clear build artifacts
pnpm clean

# Rebuild all packages
pnpm build
```

### Port Conflicts
```bash
# Check ports in use
netstat -ano | findstr "3000 3002 3003"

# Kill process if needed
taskkill /PID <process_id> /F
```

## Development Workflow

### Running Individual Apps
```bash
# Start XRM app
cd apps/xrm
pnpm dev

# Start Admin app
cd apps/admin
pnpm dev
```

### Working with Packages
```bash
# Watch mode for UI package
cd packages/ui
pnpm dev

# Build specific package
cd packages/api-client
pnpm build
```

### Database Migrations
```bash
# Run migrations
cd services/contact-service
pnpm run migration:run
```

## Additional Resources

- [Architecture Overview](../architecture/system-design.md)
- [Database Guide](../database/README.md)
- [Production Guide](../deployment/production-guide.md)
