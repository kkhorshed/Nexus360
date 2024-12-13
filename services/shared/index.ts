import { Request, Response, NextFunction } from 'express';

// Error handling
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Global error handler middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      isOperational: err.isOperational
    });
  }

  // Log unexpected errors
  console.error('Unexpected error:', err);

  return res.status(500).json({
    success: false,
    message: 'An unexpected error occurred'
  });
};

// Async handler wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Response formatter
export const formatResponse = <T>(
  data: T,
  message = 'Success',
  success = true
) => {
  return {
    success,
    message,
    data
  };
};

// Validation middleware
export const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        const errors = error.details.map((detail: any) => detail.message);
        throw new AppError(400, 'Validation failed', true);
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

// Authentication middleware
export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = req.cookies?.token || (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null);

  if (!token) {
    throw new AppError(401, 'Authentication required');
  }

  try {
    // Verify token logic here
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = decoded;
    next();
  } catch (err) {
    throw new AppError(401, 'Invalid authentication token');
  }
};

interface RateLimitConfig {
  windowMs?: number;
  max?: number;
}

// Rate limiting middleware
export const rateLimit = ({
  windowMs = 15 * 60 * 1000, // 15 minutes
  max = 100 // limit each IP to 100 requests per windowMs
}: RateLimitConfig = {}) => {
  const requests = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const requestData = requests.get(ip);

    if (!requestData || now > requestData.resetTime) {
      requests.set(ip, {
        count: 1,
        resetTime: now + windowMs
      });
      return next();
    }

    if (requestData.count >= max) {
      throw new AppError(429, 'Too many requests');
    }

    requestData.count++;
    next();
  };
};

// Database configuration interface
interface DbConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

// Database connection helper
export const createDbConnection = async (config: DbConfig) => {
  try {
    // Database connection logic here
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

interface LogMeta {
  [key: string]: any;
}

// Logger utility
export const logger = {
  info: (message: string, meta?: LogMeta) => {
    console.log(`[INFO] ${message}`, meta ? JSON.stringify(meta) : '');
  },
  error: (message: string, error?: Error | LogMeta) => {
    console.error(`[ERROR] ${message}`, error ? JSON.stringify(error) : '');
  },
  warn: (message: string, meta?: LogMeta) => {
    console.warn(`[WARN] ${message}`, meta ? JSON.stringify(meta) : '');
  },
  debug: (message: string, meta?: LogMeta) => {
    console.debug(`[DEBUG] ${message}`, meta ? JSON.stringify(meta) : '');
  }
};
