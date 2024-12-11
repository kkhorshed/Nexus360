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

export class ValidationError extends BaseError {
  constructor(message = 'Validation failed') {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export class UserNotFoundError extends BaseError {
  constructor(userId: string) {
    super(`User not found: ${userId}`, 404, 'USER_NOT_FOUND');
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
