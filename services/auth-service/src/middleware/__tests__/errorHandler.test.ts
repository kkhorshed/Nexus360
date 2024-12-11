import { Request, Response } from 'express';
import { errorHandler, addRequestId } from '../errorHandler';
import { BaseError, AuthenticationError, ValidationError } from '../../errors/customErrors';
import { logger } from '../../utils/logger';
import { config } from '../../config';

// Mock the logger
jest.mock('../../utils/logger', () => ({
  logger: {
    error: jest.fn()
  }
}));

// Mock config
jest.mock('../../config', () => ({
  config: {
    nodeEnv: 'test'
  }
}));

describe('Error Handler Middleware', () => {
  // Define a type for our mock request that ensures headers is always defined
  type MockRequest = Partial<Request> & { headers: Record<string, string | string[] | undefined> };
  let mockRequest: MockRequest;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      path: '/test',
      method: 'GET',
      headers: {},
      query: {},
      body: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
  });

  describe('errorHandler', () => {
    it('should handle BaseError correctly', () => {
      const error = new AuthenticationError('Authentication failed');
      
      errorHandler(
        error,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Authentication failed',
        code: 'AUTH_ERROR',
        details: undefined // Since we're in test environment
      });
      expect(logger.error).toHaveBeenCalled();
    });

    it('should handle ValidationError correctly', () => {
      const error = new ValidationError('Invalid input');
      
      errorHandler(
        error,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid input',
        code: 'VALIDATION_ERROR',
        details: undefined
      });
    });

    it('should handle unknown errors correctly', () => {
      const error = new Error('Unknown error');
      
      errorHandler(
        error,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        details: undefined
      });
    });

    it('should include error details in development environment', () => {
      // Temporarily change environment to development
      jest.replaceProperty(config, 'nodeEnv', 'development');
      
      const error = new Error('Test error');
      error.stack = 'Test stack trace';
      
      errorHandler(
        error,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        details: 'Test stack trace'
      });

      // Reset environment
      jest.replaceProperty(config, 'nodeEnv', 'test');
    });
  });

  describe('addRequestId', () => {
    it('should add request ID if not present', () => {
      addRequestId(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockRequest.headers['x-request-id']).toBeDefined();
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should not override existing request ID', () => {
      const existingId = 'existing-id';
      mockRequest.headers['x-request-id'] = existingId;

      addRequestId(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockRequest.headers['x-request-id']).toBe(existingId);
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should generate unique request IDs', () => {
      const requestIds = new Set();
      const iterations = 100;

      for (let i = 0; i < iterations; i++) {
        const req = { headers: {} } as MockRequest;
        addRequestId(
          req as Request,
          mockResponse as Response,
          nextFunction
        );
        requestIds.add(req.headers['x-request-id']);
      }

      expect(requestIds.size).toBe(iterations);
    });
  });
});
