# Nexus360 Platform Azure Deployment Guide

## Prerequisites

1. Azure Account with necessary permissions
2. Azure CLI installed
3. Docker installed
4. Node.js 18+ installed
5. PostgreSQL 14+ installed

## Infrastructure Setup

### 1. Resource Group
```bash
az group create --name nexus360-rg --location eastus
```

### 2. Azure Container Registry
```bash
az acr create --resource-group nexus360-rg --name nexus360acr --sku Basic
az acr login --name nexus360acr
```

### 3. Azure Kubernetes Service (AKS)
```bash
az aks create \
    --resource-group nexus360-rg \
    --name nexus360-aks \
    --node-count 3 \
    --enable-addons monitoring \
    --generate-ssh-keys
```

### 4. Azure Database for PostgreSQL
```bash
# Platform Databases
az postgres flexible-server create \
    --resource-group nexus360-rg \
    --name nexus360-platform-db \
    --location eastus \
    --admin-user nexus360admin \
    --admin-password "<your-password>" \
    --sku-name Standard_B2s \
    --version 14

# Application Databases
az postgres flexible-server create \
    --resource-group nexus360-rg \
    --name nexus360-apps-db \
    --location eastus \
    --admin-user nexus360admin \
    --admin-password "<your-password>" \
    --sku-name Standard_D4s_v3 \
    --version 14
```

### 5. Azure Redis Cache
```bash
az redis create \
    --resource-group nexus360-rg \
    --name nexus360-redis \
    --sku Premium \
    --vm-size P1
```

## Platform Deployment

### 1. Build Platform Services

```bash
# Authentication Service
docker build -t nexus360acr.azurecr.io/auth-service:latest ./platform/auth-service
docker push nexus360acr.azurecr.io/auth-service:latest

# Integration Hub
docker build -t nexus360acr.azurecr.io/integration-hub:latest ./platform/integration-hub
docker push nexus360acr.azurecr.io/integration-hub:latest

# Notification Service
docker build -t nexus360acr.azurecr.io/notification-service:latest ./platform/notification-service
docker push nexus360acr.azurecr.io/notification-service:latest

# Analytics Service
docker build -t nexus360acr.azurecr.io/analytics-service:latest ./platform/analytics-service
docker push nexus360acr.azurecr.io/analytics-service:latest
```

### 2. Deploy Platform Services

```bash
# Get AKS credentials
az aks get-credentials --resource-group nexus360-rg --name nexus360-aks

# Create platform namespace
kubectl create namespace nexus360-platform

# Deploy platform services
kubectl apply -f k8s/platform/configmaps.yaml
kubectl apply -f k8s/platform/secrets.yaml
kubectl apply -f k8s/platform/services/
kubectl apply -f k8s/platform/deployments/
```

## Application Deployment

### 1. Build Applications

```bash
# CRM Application
docker build -t nexus360acr.azurecr.io/crm-app:latest ./apps/crm
docker push nexus360acr.azurecr.io/crm-app:latest

# AI Chat Application
docker build -t nexus360acr.azurecr.io/chat-app:latest ./apps/ai-chat
docker push nexus360acr.azurecr.io/chat-app:latest

# Sales Compensation Application
docker build -t nexus360acr.azurecr.io/compensation-app:latest ./apps/sales-comp
docker push nexus360acr.azurecr.io/compensation-app:latest

# Sales Forecasting Application
docker build -t nexus360acr.azurecr.io/forecasting-app:latest ./apps/forecasting
docker push nexus360acr.azurecr.io/forecasting-app:latest

# Marketing Application
docker build -t nexus360acr.azurecr.io/marketing-app:latest ./apps/marketing
docker push nexus360acr.azurecr.io/marketing-app:latest
```

### 2. Deploy Applications

```bash
# Create application namespaces
kubectl create namespace nexus360-crm
kubectl create namespace nexus360-chat
kubectl create namespace nexus360-compensation
kubectl create namespace nexus360-forecasting
kubectl create namespace nexus360-marketing

# Deploy applications
kubectl apply -f k8s/apps/crm/
kubectl apply -f k8s/apps/chat/
kubectl apply -f k8s/apps/compensation/
kubectl apply -f k8s/apps/forecasting/
kubectl apply -f k8s/apps/marketing/
```

## Database Setup

### 1. Platform Databases

```sql
-- Connect to platform database server
CREATE DATABASE nexus360_auth;
CREATE DATABASE nexus360_integration;
CREATE DATABASE nexus360_notifications;
CREATE DATABASE nexus360_analytics;
```

### 2. Application Databases

```sql
-- Connect to application database server
CREATE DATABASE nexus360_crm;
CREATE DATABASE nexus360_chat;
CREATE DATABASE nexus360_compensation;
CREATE DATABASE nexus360_forecasting;
CREATE DATABASE nexus360_marketing;
```

### 3. Run Migrations

```bash
# Platform migrations
cd platform/auth-service && npm run migrate
cd platform/integration-hub && npm run migrate
cd platform/notification-service && npm run migrate
cd platform/analytics-service && npm run migrate

# Application migrations
cd apps/crm && npm run migrate
cd apps/ai-chat && npm run migrate
cd apps/sales-comp && npm run migrate
cd apps/forecasting && npm run migrate
cd apps/marketing && npm run migrate
```

## Azure AD Configuration

### 1. Register Platform Application
```bash
az ad app create \
    --display-name "Nexus360 Platform" \
    --sign-in-audience "AzureADMyOrg" \
    --web-redirect-uris "https://nexus360.com/auth/callback"
```

### 2. Register Individual Applications
```bash
# Register CRM Application
az ad app create \
    --display-name "Nexus360 CRM" \
    --sign-in-audience "AzureADMyOrg" \
    --web-redirect-uris "https://crm.nexus360.com/auth/callback"

# Register AI Chat Application
az ad app create \
    --display-name "Nexus360 Chat" \
    --sign-in-audience "AzureADMyOrg" \
    --web-redirect-uris "https://chat.nexus360.com/auth/callback"

# Continue for other applications...
```

## SSL/TLS Configuration

### 1. Create Certificate
```bash
az network application-gateway ssl-cert create \
    --resource-group nexus360-rg \
    --gateway-name nexus360-gateway \
    --name nexus360-cert \
    --cert-file path/to/cert.pfx \
    --cert-password <password>
```

### 2. Configure Ingress
```bash
# Platform ingress
kubectl apply -f k8s/platform/ingress.yaml

# Application ingress
kubectl apply -f k8s/apps/ingress/
```

## Monitoring Setup

### 1. Application Insights
```bash
# Create Application Insights for platform
az monitor app-insights component create \
    --app nexus360-platform \
    --location eastus \
    --resource-group nexus360-rg

# Create Application Insights for each app
az monitor app-insights component create \
    --app nexus360-crm \
    --location eastus \
    --resource-group nexus360-rg

# Continue for other applications...
```

### 2. Log Analytics
```bash
az monitor log-analytics workspace create \
    --resource-group nexus360-rg \
    --workspace-name nexus360-logs
```

## Security Configuration

### 1. Network Security
```bash
# Create network security group
az network nsg create \
    --resource-group nexus360-rg \
    --name nexus360-nsg

# Configure rules
az network nsg rule create \
    --resource-group nexus360-rg \
    --nsg-name nexus360-nsg \
    --name allow-https \
    --priority 100 \
    --destination-port-ranges 443
```

### 2. Key Vault
```bash
# Create Key Vault
az keyvault create \
    --resource-group nexus360-rg \
    --name nexus360-vault \
    --location eastus

# Store secrets
az keyvault secret set \
    --vault-name nexus360-vault \
    --name "DB-PASSWORD" \
    --value "<your-password>"
```

## Post-Deployment Verification

### 1. Platform Health
```bash
# Check platform services
kubectl get pods -n nexus360-platform
kubectl get services -n nexus360-platform
```

### 2. Application Health
```bash
# Check each application
kubectl get pods -n nexus360-crm
kubectl get pods -n nexus360-chat
kubectl get pods -n nexus360-compensation
kubectl get pods -n nexus360-forecasting
kubectl get pods -n nexus360-marketing
```

### 3. Database Connectivity
```bash
# Test platform database connections
kubectl exec -it [auth-pod] -n nexus360-platform -- npm run db:status

# Test application database connections
kubectl exec -it [crm-pod] -n nexus360-crm -- npm run db:status
```

## Maintenance

### 1. Backup Configuration
```bash
# Database backups
az postgres flexible-server backup create \
    --resource-group nexus360-rg \
    --server-name nexus360-platform-db

az postgres flexible-server backup create \
    --resource-group nexus360-rg \
    --server-name nexus360-apps-db
```

### 2. Monitoring
```bash
# Set up alerts
az monitor metrics alert create \
    --resource-group nexus360-rg \
    --name cpu-alert \
    --condition "avg cpu > 80"
```

### 3. Scaling
```bash
# Scale AKS nodes
az aks scale \
    --resource-group nexus360-rg \
    --name nexus360-aks \
    --node-count 5
```

## Troubleshooting

### 1. View Logs
```bash
# Platform logs
kubectl logs -f deployment/auth-service -n nexus360-platform
kubectl logs -f deployment/integration-hub -n nexus360-platform

# Application logs
kubectl logs -f deployment/crm-app -n nexus360-crm
kubectl logs -f deployment/chat-app -n nexus360-chat
```

### 2. Check Events
```bash
kubectl get events -n nexus360-platform
kubectl get events -n nexus360-crm
```

### 3. Debug Pods
```bash
kubectl describe pod [pod-name] -n nexus360-platform
kubectl describe pod [pod-name] -n nexus360-crm
