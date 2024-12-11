import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { logger, logStream } from './utils/logger';
import { ADController } from './controllers/adController';
import { errorHandler, addRequestId } from './middleware/errorHandler';

const app = express();
const adController = new ADController();

// Log the configuration to verify environment variables
logger.info('Starting auth service with configuration:', config);

// Basic security middleware
app.use(helmet());
app.use(cors({
  origin: config.cors.allowedOrigins,
  credentials: true
}));

// Request processing middleware
app.use(express.json());
app.use(morgan('combined', { stream: logStream }));
app.use(addRequestId);

// Rate limiting middleware
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
const apiRouter = express.Router();

// Auth routes with rate limiting
const authRouter = express.Router();
authRouter.use(authLimiter);
authRouter.get('/login', adController.login);
authRouter.get('/callback', adController.handleCallback);

// User routes
const userRouter = express.Router();
userRouter.get('/', adController.getAllUsers);
userRouter.get('/search', adController.searchUsers);
userRouter.get('/:userId', adController.getUserById);
userRouter.get('/:userId/groups', adController.getUserGroups);

// Health check
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    version: process.env.npm_package_version || '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount routers
apiRouter.use('/auth', authRouter);
apiRouter.use('/users', userRouter);
app.use('/api', apiRouter);

// Serve index.html for root path
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const port = config.port || 3001;
app.listen(port, () => {
  logger.info(`Auth service listening on port ${port}`);
  logger.info(`Environment: ${config.nodeEnv}`);
  logger.info(`CORS enabled for origins: ${config.cors.allowedOrigins.join(', ')}`);
});
