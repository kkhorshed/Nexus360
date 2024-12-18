import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

interface ErrorResponse {
  error: {
    statusCode: number;
    name: string;
    errorCode: string;
    message?: string;
  };
}

export class CustomError extends Error {
  statusCode: number;
  errorCode: string;

  constructor(message: string, statusCode: number = 500, errorCode: string = 'INTERNAL_ERROR') {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

export class ConfigurationError extends CustomError {
  constructor(message: string) {
    super(message, 500, 'CONFIG_ERROR');
  }
}

export class AuthenticationError extends CustomError {
  constructor(message: string) {
    super(message, 401, 'AUTH_ERROR');
  }
}

export class ValidationError extends CustomError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error occurred', {
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack
    },
    path: req.path,
    method: req.method,
    query: req.query,
    body: req.body
  });

  const errorResponse: ErrorResponse = {
    error: {
      statusCode: err instanceof CustomError ? err.statusCode : 500,
      name: err.name,
      errorCode: err instanceof CustomError ? err.errorCode : 'INTERNAL_ERROR',
      message: err.message
    }
  };

  res.status(errorResponse.error.statusCode).json(errorResponse);
};
