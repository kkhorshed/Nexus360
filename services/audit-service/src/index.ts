import dotenv from 'dotenv';
import { startServer } from './app';

// Load environment variables
dotenv.config();

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

// Start the server
startServer().catch((error: Error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
