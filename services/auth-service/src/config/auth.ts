import { config } from 'dotenv';

config();

// Frontend platform runs on port 3000
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

// Ensure required environment variables are set
const requiredEnvVars = ['AZURE_CLIENT_ID', 'AZURE_CLIENT_SECRET', 'AZURE_TENANT_ID'];
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

export const authConfig = {
  azure: {
    clientId: process.env.AZURE_CLIENT_ID,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
    tenantId: process.env.AZURE_TENANT_ID,
  },
  redirects: {
    success: `${frontendUrl}/auth/success`,
    failure: `${frontendUrl}/auth/error`,
    postLogout: frontendUrl,
  },
  cors: {
    allowedOrigins: [
      frontendUrl,                    // Frontend Platform (3000)
      'http://localhost:3010',        // CRM UI
      'http://localhost:3020',        // AI Chat UI
      'http://localhost:3030',        // Sales Comp UI
      'http://localhost:3040',        // Forecasting UI
      'http://localhost:3050',        // Marketing UI
      // Service ports
      'http://localhost:3001',        // Auth Service
      'http://localhost:3002',        // Admin Service
      'http://localhost:3003',        // CRM Service
      'http://localhost:3004',        // Forecasting Service
      'http://localhost:3005',        // Marketing Service
      'http://localhost:3006',        // Sales Comp Service
      'http://localhost:3007',        // AI Chat Service
    ],
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
  },
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
};
