# Azure Deployment Quick Start Guide

This is a condensed version of the full Azure deployment guide, focusing on essential steps to get the Nexus360 system running on Azure quickly.

## Quick Setup Checklist

### 1. Azure Resources Setup

```bash
# Login to Azure
az login

# Create resource group
az group create --name nexus360-production --location eastus

# Create PostgreSQL server
az postgres server create \
  --resource-group nexus360-production \
  --name nexus360-db-server \
  --location eastus \
  --admin-user nexus360admin \
  --admin-password <your-secure-password> \
  --sku-name GP_Gen5_2

# Create database
az postgres db create \
  --resource-group nexus360-production \
  --server-name nexus360-db-server \
  --name nexus360_db

# Create App Service Plan
az appservice plan create \
  --name nexus360-service-plan \
  --resource-group nexus360-production \
  --sku B1 \
  --is-linux

# Create Web Apps
az webapp create \
  --resource-group nexus360-production \
  --plan nexus360-service-plan \
  --name nexus360-frontend \
  --runtime "NODE:18-lts"

az webapp create \
  --resource-group nexus360-production \
  --plan nexus360-service-plan \
  --name nexus360-auth-service \
  --runtime "NODE:18-lts"
```

### 2. Azure AD Configuration

1. Go to Azure Portal > Azure Active Directory
2. Register a new application
3. Configure redirect URI: `https://nexus360-auth-service.azurewebsites.net/auth/callback`
4. Note down:
   - Application (client) ID
   - Directory (tenant) ID
   - Create and save client secret

### 3. Environment Configuration

```bash
# Configure Auth Service
az webapp config appsettings set \
  --resource-group nexus360-production \
  --name nexus360-auth-service \
  --settings \
  AZURE_AD_CLIENT_ID="your_client_id" \
  AZURE_AD_CLIENT_SECRET="your_client_secret" \
  AZURE_AD_TENANT_ID="your_tenant_id" \
  AZURE_AD_REDIRECT_URI="https://nexus360-auth-service.azurewebsites.net/auth/callback" \
  FRONTEND_URL="https://nexus360-frontend.azurewebsites.net" \
  POSTGRES_HOST="nexus360-db-server.postgres.database.azure.com" \
  POSTGRES_DB="nexus360_db" \
  POSTGRES_USER="nexus360admin" \
  POSTGRES_PASSWORD="your-db-password" \
  NODE_ENV="production"

# Configure Frontend
az webapp config appsettings set \
  --resource-group nexus360-production \
  --name nexus360-frontend \
  --settings \
  VITE_AUTH_SERVICE_URL="https://nexus360-auth-service.azurewebsites.net" \
  VITE_APP_NAME="Nexus360" \
  VITE_APP_VERSION="1.0.0"
```

### 4. Build and Deploy

```bash
# Install dependencies
npm run install-all

# Build both services
npm run build

# Deploy auth service
cd services/auth-service
zip -r dist.zip dist package.json
az webapp deployment source config-zip \
  --resource-group nexus360-production \
  --name nexus360-auth-service \
  --src dist.zip

# Deploy frontend
cd ../../frontend
zip -r dist.zip dist
az webapp deployment source config-zip \
  --resource-group nexus360-production \
  --name nexus360-frontend \
  --src dist.zip
```

### 5. Verify Deployment

1. Frontend URL: `https://nexus360-frontend.azurewebsites.net`
2. Auth Service URL: `https://nexus360-auth-service.azurewebsites.net`

### 6. Basic Monitoring

```bash
# View application logs
az webapp log tail \
  --resource-group nexus360-production \
  --name nexus360-auth-service

az webapp log tail \
  --resource-group nexus360-production \
  --name nexus360-frontend
```

## Common Issues and Solutions

1. **Database Connection Issues**
   - Verify PostgreSQL firewall rules
   - Check connection string in app settings
   - Ensure SSL is enabled for database connection

2. **Authentication Errors**
   - Verify Azure AD configuration
   - Check redirect URI matches exactly
   - Confirm client ID and secret are correct

3. **Deployment Failures**
   - Check build output for errors
   - Verify Node.js version compatibility
   - Review deployment logs in Azure Portal

## Next Steps

1. Set up custom domain
2. Configure SSL certificates
3. Implement monitoring and alerts
4. Set up automatic backups
5. Configure scaling rules

For detailed instructions and advanced configurations, refer to the full [Azure Deployment Guide](azure-deployment-guide.md).
