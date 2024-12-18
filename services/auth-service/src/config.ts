import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  port: 3000, // Auth service fixed port
  nodeEnv: process.env.NODE_ENV || 'development',
  azure: {
    clientId: process.env.AZURE_AD_CLIENT_ID,
    clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
    tenantId: process.env.AZURE_AD_TENANT_ID
  },
  cors: {
    allowedOrigins: [
      'http://localhost:3000', // Auth service
      'http://localhost:3001', // Frontend
      'http://localhost:3002', // Admin app
      'http://localhost:3003',
      'http://localhost:3004',
      'http://localhost:3005'
    ]
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json'
  }
};
