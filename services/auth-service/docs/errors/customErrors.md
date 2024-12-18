# Custom Errors Documentation

## Overview
The auth service implements a custom error handling system with specific error types for different scenarios. This system provides consistent error handling, proper HTTP status codes, and detailed error information.

## Base Error Class

### BaseError
The foundation class for all custom errors in the system.

```typescript
class BaseError extends Error {
  constructor(message: string, statusCode: number, errorCode?: string)
}
```

Properties:
- `message`: Human-readable error description
- `statusCode`: HTTP status code
- `errorCode`: Unique error identifier
- `name`: Error class name
- `stack`: Stack trace information

## Specific Error Types

### AuthenticationError
Used for authentication-related failures.

```typescript
class AuthenticationError extends BaseError
```

Details:
- Status Code: 401
- Error Code: AUTH_ERROR
- Default Message: "Authentication failed"
- Use Cases:
  - Failed login attempts
  - Invalid tokens
  - Token refresh failures
  - Unauthorized access attempts

### ValidationError
Used for input validation failures.

```typescript
class ValidationError extends BaseError
```

Details:
- Status Code: 400
- Error Code: VALIDATION_ERROR
- Default Message: "Validation failed"
- Use Cases:
  - Invalid request parameters
  - Missing required fields
  - Incorrect data formats

### UserNotFoundError
Used when a requested user cannot be found.

```typescript
class UserNotFoundError extends BaseError
```

Details:
- Status Code: 404
- Error Code: USER_NOT_FOUND
- Message Format: "User not found: {userId}"
- Use Cases:
  - User lookup failures
  - Invalid user IDs
  - Deleted user access attempts

### GraphAPIError
Used for Microsoft Graph API related errors.

```typescript
class GraphAPIError extends BaseError
```

Details:
- Status Code: 500
- Error Code: GRAPH_API_ERROR
- Default Message: "Microsoft Graph API error"
- Use Cases:
  - Graph API communication failures
  - API rate limiting
  - Service unavailability
  - Response parsing errors

### ConfigurationError
Used for service configuration issues.

```typescript
class ConfigurationError extends BaseError
```

Details:
- Status Code: 500
- Error Code: CONFIG_ERROR
- Default Message: "Service configuration error"
- Use Cases:
  - Missing environment variables
  - Invalid configuration values
  - Missing required settings

## Usage Example

```typescript
try {
  // Attempt to find user
  const user = await getUserById(id);
  if (!user) {
    throw new UserNotFoundError(id);
  }
} catch (error) {
  if (error instanceof UserNotFoundError) {
    // Handle user not found case
    logger.warn(error.message);
    return res.status(error.statusCode).json({
      error: error.errorCode,
      message: error.message
    });
  }
  // Handle other errors
  throw error;
}
```

## Error Response Format
When these errors are caught and handled by the error middleware, they produce consistent JSON responses:

```json
{
  "error": "ERROR_CODE",
  "message": "Human readable error message",
  "statusCode": 4XX or 5XX
}
```

## Best Practices

1. Error Handling:
   - Always catch specific error types before catching general errors
   - Include appropriate logging with error details
   - Maintain consistent error response format

2. Creating New Errors:
   - Extend BaseError for new error types
   - Provide meaningful default messages
   - Use appropriate HTTP status codes
   - Include specific error codes

3. Error Codes:
   - Use uppercase with underscores
   - Make codes descriptive and unique
   - Document new error codes

4. Status Codes:
   - 400-499 for client errors
   - 500-599 for server errors
   - Use standard HTTP status codes

## Integration with Logging
Errors should be properly logged:
- Use appropriate log levels (error, warn, info)
- Include relevant context with errors
- Maintain stack traces for debugging
- Avoid logging sensitive information

## Security Considerations
- Sanitize error messages sent to clients
- Avoid exposing internal system details
- Log security-related errors appropriately
- Handle sensitive information in errors carefully
