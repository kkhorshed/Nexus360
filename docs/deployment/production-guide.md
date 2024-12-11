# Production Deployment Guide

This guide explains how to deploy the CRM system in a production environment.

## Prerequisites

1. Node.js (v18 or higher)
2. PostgreSQL database server
3. Azure AD tenant with configured SSO application

## Environment Setup

1. Create production environment files:

   **Auth Service (.env)**:
   ```env
   # Azure AD Configuration
   AZURE_AD_CLIENT_ID=your_production_client_id
   AZURE_AD_CLIENT_SECRET=your_production_client_secret
   AZURE_AD_TENANT_ID=your_production_tenant_id
   AZURE_AD_REDIRECT_URI=https://your-domain.com/auth/callback

   # Frontend URL
   FRONTEND_URL=https://your-domain.com

   # Cookie Settings
   COOKIE_SECRET=your_production_cookie_secret

   # PostgreSQL Configuration
   POSTGRES_USER=your_production_db_user
   POSTGRES_PASSWORD=your_production_db_password
   POSTGRES_HOST=your_production_db_host
   POSTGRES_PORT=5432
   POSTGRES_DB=crm_db

   # Node Environment
   NODE_ENV=production
   ```

   **Frontend (.env)**:
   ```env
   VITE_AUTH_SERVICE_URL=https://your-domain.com
   VITE_APP_NAME=CRM
   VITE_APP_VERSION=1.0.0
   ```

## Build Process

1. Install dependencies:
   ```bash
   npm run install-all
   ```

2. Build the project:
   ```bash
   npm run build
   ```

   This will:
   - Build the auth service (TypeScript compilation)
   - Build the frontend (Vite production build)

## Deployment Steps

1. Copy the following files/directories to your production server:
   - `dist/` directories from both frontend and auth service
   - `package.json` files
   - `start-production.js`
   - Production environment files (.env)

2. Install production dependencies:
   ```bash
   npm install --production
   ```

3. Start the services:
   ```bash
   npm run start:prod
   ```

## Production Configuration

### Nginx Configuration (Recommended)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;

    # Frontend
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Auth Service
    location /auth/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL Configuration

1. Obtain SSL certificates (e.g., using Let's Encrypt)
2. Configure SSL in your web server
3. Update environment variables to use HTTPS URLs

### Database Setup

1. Create production database:
   ```sql
   CREATE DATABASE crm_db;
   ```

2. Apply database migrations:
   ```bash
   cd services/auth-service
   npm run migrate
   ```

## Process Management

It's recommended to use a process manager like PM2:

1. Install PM2:
   ```bash
   npm install -g pm2
   ```

2. Start services with PM2:
   ```bash
   pm2 start start-production.js --name crm
   ```

3. Configure PM2 startup:
   ```bash
   pm2 startup
   pm2 save
   ```

## Monitoring

1. Monitor application logs:
   ```bash
   pm2 logs crm
   ```

2. Monitor process status:
   ```bash
   pm2 status
   ```

## Security Considerations

1. Enable CORS only for trusted domains
2. Use secure session cookies
3. Implement rate limiting
4. Keep dependencies updated
5. Use environment-specific secrets
6. Enable SSL/TLS
7. Implement proper logging and monitoring

## Backup Strategy

1. Configure regular database backups
2. Store environment configurations securely
3. Implement automated backup verification

## Scaling Considerations

1. Use load balancer for multiple instances
2. Configure session persistence
3. Implement caching strategy
4. Monitor resource usage
5. Plan for database scaling

## Troubleshooting

1. Check application logs:
   ```bash
   pm2 logs crm
   ```

2. Verify service status:
   ```bash
   pm2 status
   ```

3. Check nginx logs:
   ```bash
   tail -f /var/log/nginx/error.log
   ```

4. Test database connection:
   ```bash
   psql -h localhost -U your_user -d crm_db
   ```

## Maintenance

1. Regular updates:
   ```bash
   git pull
   npm run install-all
   npm run build
   pm2 restart crm
   ```

2. Monitor system resources
3. Review and rotate logs
4. Update SSL certificates
5. Perform regular security audits
