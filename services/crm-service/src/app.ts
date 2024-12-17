import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { json } from 'body-parser';
import { AppError } from './utils/errors';
import leadRoutes from './routes/leadRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(json());

// Routes
app.use('/api/leads', leadRoutes);

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

// Database connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/crm';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Server setup
const port = process.env.PORT || 3002;

const startServer = async () => {
  await connectDB();
  
  app.listen(port, () => {
    console.log(`CRM service listening on port ${port}`);
  });
};

export { app, startServer };
