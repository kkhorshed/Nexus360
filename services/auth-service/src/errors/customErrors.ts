export class BaseError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public errorCode?: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class AuthenticationError extends BaseError {
  constructor(message = 'Authentication failed') {
    super(message, 401, 'AUTH_ERROR');
  }
}

export class AuthorizationError extends BaseError {
  constructor(message = 'Access denied') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

export class ValidationError extends BaseError {
  constructor(message = 'Validation failed') {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export class NotFoundError extends BaseError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class UserNotFoundError extends NotFoundError {
  constructor(userId: string) {
    super(`User not found: ${userId}`);
    this.errorCode = 'USER_NOT_FOUND';
  }
}

export class DatabaseError extends BaseError {
  constructor(message = 'Database operation failed') {
    super(message, 500, 'DATABASE_ERROR');
  }
}

export class GraphAPIError extends BaseError {
  constructor(message = 'Microsoft Graph API error') {
    super(message, 500, 'GRAPH_API_ERROR');
  }
}

export class ConfigurationError extends BaseError {
  constructor(message = 'Service configuration error') {
    super(message, 500, 'CONFIG_ERROR');
  }
}
