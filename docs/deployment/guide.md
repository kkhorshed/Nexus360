# CRM System Deployment Guide

## System Requirements

- Node.js (v18 or higher recommended)
- PostgreSQL (v13 or higher)
- npm or yarn package manager

## Pre-deployment Setup

### 1. Database Setup

1. Install PostgreSQL if not already installed
2. Create a new database named `crm_auth_db`
3. Initialize the database by running:
   ```bash
   cd services/auth-service
   npm run db:init
   ```

### 2. Environment Configuration

#### Auth Service Configuration
Create `.env` file in `services/auth-service/` with the following variables:
```env
# Azure AD Configuration
AZURE_AD_CLIENT_ID=your_client_id
AZURE_AD_CLIENT_SECRET=your_client_secret
AZURE_AD_TENANT_ID=your_tenant_id
AZURE_AD_REDIRECT_URI=http://localhost:8081/auth/callback

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Session Secret
SESSION_SECRET=your_session_secret

# PostgreSQL Configuration
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=crm_auth_db

# Node Environment
NODE_ENV=production
```

#### Frontend Configuration
Create `.env` file in `frontend/` with:
```env
VITE_AUTH_SERVICE_URL=http://localhost:8081
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install-all
   ```

## Building the Application

### 1. Build Auth Service
```bash
cd services/auth-service
npm run build
```

### 2. Build Frontend
```bash
cd frontend
npm run build
```

## Deployment Steps

### 1. Auth Service Deployment

1. Ensure PostgreSQL is running and accessible
2. Start the auth service:
   ```bash
   cd services/auth-service
   npm start
   ```

### 2. Frontend Deployment

1. After building, deploy the contents of `frontend/dist` to your web server
2. Configure your web server (nginx/apache) to serve the static files
3. For SPA routing, configure the web server to redirect all requests to index.html

## Azure SSO Configuration

1. Register your application in Azure AD
2. Configure the following:
   - Redirect URIs
   - Client ID and Secret
   - Required permissions for Microsoft Graph API
3. Update the auth service .env file with your Azure credentials

## Production Considerations

1. Use process managers like PM2 for Node.js services
2. Set up SSL certificates for HTTPS
3. Configure proper CORS settings
4. Use secure session storage
5. Implement proper logging
6. Set up monitoring and alerts

## Health Checks

Monitor the following endpoints:
- Auth Service: `GET /health`
- Frontend: Serve a static health.html

## Troubleshooting

Common issues and solutions:

1. Database Connection Issues
   - Verify PostgreSQL is running
   - Check database credentials
   - Ensure database is initialized

2. Azure SSO Issues
   - Verify Azure AD configuration
   - Check redirect URIs
   - Validate client credentials

3. Frontend Connection Issues
   - Verify auth service URL in frontend .env
   - Check CORS configuration
   - Validate SSL certificates if using HTTPS

## Backup and Recovery

1. Database Backup
   ```bash
   pg_dump -U your_postgres_user crm_auth_db > backup.sql
   ```

2. Environment Configuration Backup
   - Keep secure copies of all .env files
   - Document any custom configuration changes

## Security Checklist

- [ ] SSL/TLS certificates installed
- [ ] Environment variables properly set
- [ ] Database access restricted
- [ ] Azure AD permissions configured
- [ ] CORS policies set
- [ ] Session security configured
- [ ] Rate limiting enabled
- [ ] Logging configured
- [ ] Monitoring set up

## Scaling Considerations

1. Database
   - Consider connection pooling
   - Implement caching where appropriate
   - Monitor query performance

2. Auth Service
   - Deploy multiple instances behind load balancer
   - Implement session sharing if using multiple instances
   - Monitor resource usage

3. Frontend
   - Use CDN for static assets
   - Implement caching strategies
   - Consider containerization
