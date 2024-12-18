# Error Handler Middleware Documentation

## Overview
The error handler middleware provides centralized error handling for the auth service, ensuring consistent error responses and proper error logging across all endpoints.

## Interface

```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  statusCode: number;
}
```

## Features

### Error Processing
- Converts various error types to consistent response format
- Handles both synchronous and asynchronous errors
- Provides appropriate HTTP status codes
- Includes error details when appropriate

### Error Categories
1. Authentication Errors (401)
2. Authorization Errors (403)
3. Validation Errors (400)
4. Not Found Errors (404)
5. Internal Server Errors (500)

## Implementation

### Middleware Setup
```typescript
app.use(errorHandler());
```

### Error Response Format
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {} // Optional additional information
  },
  "statusCode": 400
}
```

## Error Handling Strategy

### Custom Errors
- Handles custom error types defined in the service
- Preserves error codes and messages
- Maintains error hierarchy

### Standard Errors
- Converts standard Node.js errors
- Maps to appropriate HTTP status codes
- Provides meaningful error messages

### Third-party Errors
- Handles Azure AD errors
- Processes Graph API errors
- Maps external error codes

## Logging

### Error Logging
- Logs detailed error information
- Includes stack traces in development
- Sanitizes sensitive information
- Uses appropriate log levels

### Log Format
```typescript
{
  timestamp: string;
  level: string;
  error: {
    message: string;
    code: string;
    stack?: string;
  };
  request: {
    method: string;
    url: string;
    headers: object;
  };
}
```

## Best Practices

### Implementation Guidelines
1. Always use custom error types
2. Include appropriate error codes
3. Provide meaningful error messages
4. Handle all error scenarios

### Security Considerations
1. Sanitize error messages
2. Hide internal error details
3. Log sensitive errors appropriately
4. Implement rate limiting

### Development Guidelines
1. Use consistent error patterns
2. Document error codes
3. Test error scenarios
4. Monitor error patterns

## Usage Example

```typescript
// Route handler
app.get('/users', async (req, res, next) => {
  try {
    // Route logic
  } catch (error) {
    next(error); // Pass to error handler
  }
});

// Error handler processes the error
// and sends consistent response
```

## Error Monitoring
- Error frequency tracking
- Pattern detection
- Performance impact analysis
- Alert triggers

## Maintenance
1. Regular review of error patterns
2. Update error messages
3. Refine error categories
4. Optimize logging

## Integration
- Works with logging systems
- Supports monitoring tools
- Interfaces with alerting systems
- Compatible with debugging tools
