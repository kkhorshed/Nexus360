import { Request, Response, NextFunction } from 'express';
import { BaseError } from '../errors/customErrors';
import { logger } from '../utils/logger';
import { config } from '../config';
import { ValidationError as JoiValidationError, Schema } from 'joi';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Log error with request context
  logger.error('Error occurred', {
    error: err,
    requestId: req.headers['x-request-id'],
    path: req.path,
    method: req.method,
    query: req.query,
    body: req.body,
    stack: err.stack
  });

  // Handle known errors
  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.errorCode,
      details: config.nodeEnv === 'development' ? err.stack : undefined
    });
  }

  // Handle unknown errors
  return res.status(500).json({
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
    details: config.nodeEnv === 'development' ? err.stack : undefined
  });
};

// Middleware to add request ID
export const addRequestId = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  req.headers['x-request-id'] = req.headers['x-request-id'] || 
    `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  next();
};

// Middleware to validate request schema
export const validateRequest = (schema: Schema) => async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (err) {
    if (err instanceof JoiValidationError) {
      next(new BaseError(err.message, 400, 'VALIDATION_ERROR'));
    } else {
      next(new BaseError('Validation failed', 400, 'VALIDATION_ERROR'));
    }
  }
};
