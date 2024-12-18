import dotenv from 'dotenv';
import { Config } from './types';

// Load environment variables from .env file
dotenv.config();

const config: Config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,  // Set to 3000 as required
  logLevel: (process.env.LOG_LEVEL || 'info') as Config['logLevel'],
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    saltRounds: Number(process.env.SALT_ROUNDS) || 10
  },
  azure: {
    tenantId: process.env.AZURE_TENANT_ID,
    clientId: process.env.AZURE_CLIENT_ID,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
    redirectUri: process.env.AZURE_REDIRECT_URI
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'nexus360_auth',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '987789',
    ssl: process.env.DB_SSL === 'true' ? {
      rejectUnauthorized: false
    } : undefined
  },
  cors: {
    allowedOrigins: (process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:3001').split(',')
  }
};

export default config;
