import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { initializeDatabase } from './config/database';
import { AppError } from './utils/errors';
import auditRoutes from './routes/auditRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    service: 'audit-service',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/audit', auditRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      isOperational: err.isOperational
    });
  }

  return res.status(500).json({
    success: false,
    message: 'An unexpected error occurred'
  });
});

// Server setup
const port = process.env.PORT || 3001;

const startServer = async () => {
  try {
    // Initialize database with retries
    const dbConnected = await initializeDatabase();
    if (!dbConnected) {
      console.error('Failed to initialize database after retries');
      process.exit(1);
    }

    // Start server
    app.listen(port, () => {
      console.log(`
┌────────────────────────────────────────┐
│          Audit Service Started         │
├────────────────────────────────────────┤
│ Status: Running                        │
│ Port: ${port.toString().padEnd(30)} │
│ Environment: ${(process.env.NODE_ENV || 'development').padEnd(23)} │
│ Database: Connected                    │
└────────────────────────────────────────┘
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

export { app, startServer };
