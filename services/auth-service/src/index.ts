import express from 'express';
import cors from 'cors';
import { config } from './config';
import { logger } from './utils/logger';
import { authRouter } from './routes/auth';
import { usersRouter } from './routes/users';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Configure CORS
app.use(cors({
  origin: config.cors.allowedOrigins,
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

// Error handling
app.use(errorHandler);

// Start server
const port = config.port;
app.listen(port, () => {
  // Log non-sensitive configuration
  const safeConfig = {
    port: config.port,
    nodeEnv: config.nodeEnv,
    cors: {
      allowedOrigins: config.cors.allowedOrigins
    },
    logging: {
      level: config.logging.level,
      format: config.logging.format
    }
  };
  
  logger.info(`Starting auth service with configuration: ${JSON.stringify(safeConfig)}`);
});
