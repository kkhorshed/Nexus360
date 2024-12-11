# CRM Deployment Quick Reference

## Common Commands

### Installation
```bash
# Install all dependencies
npm run install-all

# Install specific service
cd services/auth-service && npm install
cd frontend && npm install
```

### Development
```bash
# Start all services in development mode
npm start

# Start auth service in development mode
cd services/auth-service
npm run dev

# Start frontend in development mode
cd frontend
npm run dev
```

### Building
```bash
# Build auth service
cd services/auth-service
npm run build

# Build frontend
cd frontend
npm run build
```

### Database
```bash
# Initialize database
cd services/auth-service
npm run db:init

# Backup database
pg_dump -U your_postgres_user crm_auth_db > backup.sql

# Restore database
psql -U your_postgres_user crm_auth_db < backup.sql
```

## Environment Variables Quick Reference

### Auth Service (.env)
```env
AZURE_AD_CLIENT_ID=
AZURE_AD_CLIENT_SECRET=
AZURE_AD_TENANT_ID=
AZURE_AD_REDIRECT_URI=
FRONTEND_URL=
SESSION_SECRET=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_HOST=
POSTGRES_PORT=
POSTGRES_DB=
NODE_ENV=
```

### Frontend (.env)
```env
VITE_AUTH_SERVICE_URL=
```

## Required Ports

- Frontend: 3000
- Auth Service: 8081
- PostgreSQL: 5432

## Health Check Endpoints

- Auth Service: `GET /health`
- Frontend: `GET /health.html`

## Common Issues & Solutions

1. Port already in use:
   ```bash
   # Clear ports
   cd services/auth-service
   npm run clear-ports
   ```

2. Database connection failed:
   - Check PostgreSQL service is running
   - Verify database credentials in .env
   - Ensure database exists

3. Azure SSO not working:
   - Verify Azure AD credentials
   - Check redirect URI configuration
   - Ensure proper permissions are set

## Production Checklist

- [ ] All .env files configured
- [ ] Database initialized
- [ ] SSL certificates installed
- [ ] CORS configured
- [ ] Services built in production mode
- [ ] Health checks responding
- [ ] Backups configured
- [ ] Monitoring set up
- [ ] Load balancer configured (if applicable)
