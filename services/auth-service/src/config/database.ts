import { DatabaseConfig } from '../types';

export const databaseConfig: DatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'nexus360_auth',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '987789',
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : undefined
};
