# Nexus360 Deployment Guide

Comprehensive guide for deploying Nexus360 platform.

## Architecture Overview

### Services
- Auth Service (Port 3006)
- Notification Service (Port 3003)
- Admin Dashboard
- XRM App (Port 3010)

### Dependencies
- Node.js 16+
- pnpm
- Azure AD Application
- PostgreSQL Database (optional)

## Pre-deployment Checklist

### Azure AD Setup
1. Register application in Azure AD
2. Configure redirect URIs
3. Generate client secret
4. Note down credentials:
   - Client ID
   - Client Secret
   - Tenant ID

### Environment Configuration

#### Auth Service (.env)
```env
# Azure AD Configuration
AZURE_AD_TENANT_ID=your-tenant-id
AZURE_AD_CLIENT_ID=your-client-id
AZURE_AD_CLIENT_SECRET=your-client-secret
AZURE_AD_REDIRECT_URI=https://your-domain/api/auth/callback

# API Configuration
PORT=3006
NODE_ENV=production

# CORS Configuration
CORS_ALLOWED_ORIGINS=https://your-xrm-domain,https://your-admin-domain
```

#### XRM App (.env)
```env
VITE_AUTH_URL=https://your-auth-domain
VITE_API_URL=https://your-auth-domain/api
```

## Deployment Steps

### 1. Build Applications

```bash
# Build all applications
pnpm -r build

# Individual builds
cd apps/xrm && pnpm build
cd ../admin && pnpm build
```

### 2. Server Setup

#### Requirements
- Ubuntu 20.04 LTS or similar
- Nginx
- PM2 or similar process manager
- SSL certificates

#### Nginx Configuration

```nginx
# Auth Service
server {
    listen 443 ssl;
    server_name auth.your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3006;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# XRM App
server {
    listen 443 ssl;
    server_name xrm.your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        root /path/to/xrm/dist;
        try_files $uri $uri/ /index.html;
    }
}

# Admin Dashboard
server {
    listen 443 ssl;
    server_name admin.your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        root /path/to/admin/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

### 3. Process Management

#### PM2 Configuration (ecosystem.config.js)
```javascript
module.exports = {
  apps: [
    {
      name: 'auth-service',
      script: 'services/auth-service/dist/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3006
      }
    },
    {
      name: 'notification-service',
      script: 'services/notification-service/dist/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3003
      }
    }
  ]
};
```

#### Start Services
```bash
pm2 start ecosystem.config.js
```

### 4. Security Configuration

#### Firewall Rules
```bash
# Allow HTTP/HTTPS
ufw allow 80
ufw allow 443

# Allow SSH
ufw allow 22
```

#### SSL Setup
```bash
# Using certbot
certbot --nginx -d auth.your-domain.com
certbot --nginx -d xrm.your-domain.com
certbot --nginx -d admin.your-domain.com
```

## Monitoring

### Health Checks
- Auth Service: https://auth.your-domain.com/api/health
- Notification Service: https://notification.your-domain.com/health
- Monitor response times and error rates

### Logging
- Configure centralized logging
- Set up error notifications
- Monitor resource usage

## Backup Strategy

### Database Backups
- Daily automated backups
- Secure offsite storage
- Regular restore testing

### Configuration Backups
- Version control for configurations
- Backup environment variables
- Document all custom settings

## Scaling Considerations

### Horizontal Scaling
- Load balancer configuration
- Session management
- Cache synchronization

### Vertical Scaling
- CPU/Memory monitoring
- Disk space management
- Database optimization

## Troubleshooting

### Common Issues

1. Authentication Errors
   - Check Azure AD configuration
   - Verify redirect URIs
   - Check SSL certificates

2. CORS Issues
   - Verify allowed origins
   - Check request headers
   - Confirm SSL configuration

3. Performance Issues
   - Monitor resource usage
   - Check database queries
   - Review application logs

## Maintenance

### Regular Tasks
- SSL certificate renewal
- Security updates
- Database optimization
- Log rotation

### Emergency Procedures
- Service restoration steps
- Rollback procedures
- Contact information

## Security Best Practices

1. Access Control
   - Implement least privilege
   - Regular access review
   - Strong password policy

2. Network Security
   - Use WAF
   - DDoS protection
   - Regular security scans

3. Data Protection
   - Encrypt sensitive data
   - Regular backups
   - Secure key management

## Updates and Upgrades

### Update Process
1. Backup current state
2. Test updates in staging
3. Deploy to production
4. Verify functionality
5. Monitor for issues

### Version Control
- Tag releases
- Document changes
- Maintain changelog

## Support

### Contact Information
- Technical support
- Emergency contacts
- Vendor support

### Documentation
- Keep deployment guide updated
- Document custom configurations
- Maintain troubleshooting guides
