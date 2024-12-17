import { DataSource } from 'typeorm';
import { AuditLog } from '../models/AuditLog';
import 'dotenv/config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'nexus360_audit',
  synchronize: true, // Set to false in production
  logging: process.env.NODE_ENV === 'development',
  entities: [AuditLog],
  migrations: [],
  subscribers: [],
  connectTimeoutMS: 10000,
  extra: {
    // Pool configuration
    max: 20,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000
  }
});

export const initializeDatabase = async () => {
  let retries = 3;
  
  while (retries > 0) {
    try {
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
        console.log('Database connection established successfully');
        
        // Verify connection by running a simple query
        await AppDataSource.query('SELECT NOW()');
        console.log('Database connection verified');
      }
      return true;
    } catch (error) {
      console.error(`Database connection attempt failed (${retries} retries left):`, error);
      retries--;
      
      if (retries === 0) {
        console.log('\nPlease ensure that:');
        console.log('1. PostgreSQL service is running');
        console.log('2. Database credentials in .env are correct');
        console.log('3. Database "nexus360_audit" exists');
        console.log('\nFollow the instructions in POSTGRES_RESET.md if you need to reset the password.');
        return false;
      }
      
      // Wait for 5 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  return false;
};
