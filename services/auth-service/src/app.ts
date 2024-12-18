import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { authRouter } from './routes/auth';
import { usersRouter } from './routes/users';
import { appAccessRouter } from './routes/appAccess';
import { errorHandler } from './middleware/errorHandler';
import { config } from './config';
import { logger } from './utils/logger';

const app = express();

// Middleware
app.use(cors({
  origin: config.cors.allowedOrigins,
  credentials: true
}));
app.use(json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/app-access', appAccessRouter);

// Error handling
app.use(errorHandler);

export { app };
