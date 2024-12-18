import { config as dotenvConfig } from 'dotenv';
// Load environment variables first
dotenvConfig();

import express from 'express';
import cors from 'cors';
import config from './config';
import { logger } from './utils/logger';
import { authRouter } from './routes/auth';
import { usersRouter } from './routes/users';
import { configRouter } from './routes/config';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Configure CORS
app.use(cors({
  origin: config.cors.allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Parse JSON bodies
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ 
    service: 'Auth Service',
    version: '1.0.0',
    status: 'running',
    endpoints: [
      '/api/auth',
      '/api/users',
      '/api/config'
    ]
  });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/config', configRouter);

// Error handling
app.use(errorHandler);

// Start server
const port = config.port;
app.listen(port, () => {
  // Log non-sensitive configuration
  const safeConfig = {
    port: config.port,
    env: config.env,
    cors: {
      allowedOrigins: config.cors.allowedOrigins
    },
    logLevel: config.logLevel
  };
  
  logger.info(`Starting auth service with configuration: ${JSON.stringify(safeConfig)}`);
});
