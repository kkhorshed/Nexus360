# Auth Service

A robust authentication service using Azure AD (Microsoft Identity Platform) with comprehensive user management capabilities through Microsoft Graph API.

## Features

- Azure AD authentication with OAuth2 flow
- Token management with caching and auto-refresh
- User management (search, get by ID, groups)
- Rate limiting for auth endpoints
- Comprehensive error handling
- Request tracking with unique IDs
- Full test coverage

## Architecture

The service follows a clean architecture pattern with clear separation of concerns:

```
src/
├── controllers/    # Request handlers
├── services/      # Business logic
├── middleware/    # Express middleware
├── errors/        # Custom error types
├── types/         # TypeScript interfaces
└── utils/         # Shared utilities
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Required environment variables:
- `AZURE_AD_CLIENT_ID`: Azure AD application client ID
- `AZURE_AD_CLIENT_SECRET`: Azure AD application client secret
- `AZURE_AD_TENANT_ID`: Azure AD tenant ID
- `AZURE_AD_REDIRECT_URI`: OAuth callback URL
- `PORT`: Service port (default: 3001)
- `NODE_ENV`: Environment (development/production)

## Development

Start the service in development mode:
```bash
npm run dev
```

Run tests:
```bash
npm test                # Run all tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage report
```

Lint code:
```bash
npm run lint      # Check for linting issues
npm run lint:fix  # Auto-fix linting issues
```

Build for production:
```bash
npm run build
```

## API Endpoints

### Authentication

- `GET /api/auth/login`: Initiate login flow
- `GET /api/auth/callback`: Handle OAuth callback

### User Management

- `GET /api/users`: Get all users
- `GET /api/users/search?query=`: Search users
- `GET /api/users/:userId`: Get user by ID
- `GET /api/users/:userId/groups`: Get user's groups

### Health Check

- `GET /api/health`: Service health status

## Security Features

1. **Rate Limiting**
   - 100 requests per 15 minutes for auth endpoints
   - Customizable limits per route

2. **Error Handling**
   - Custom error types for different scenarios
   - Environment-aware error details
   - Comprehensive error logging

3. **Token Management**
   - Automatic token refresh
   - In-memory token cache
   - Token expiration handling

4. **Request Tracking**
   - Unique request IDs
   - Detailed request logging
   - Error correlation

## Testing

The service includes comprehensive test coverage:

1. **Unit Tests**
   - Service layer tests
   - Controller tests
   - Middleware tests
   - Error handling tests

2. **Integration Tests**
   - Authentication flow tests
   - User management tests
   - Error scenarios tests

## Error Handling

Custom error types for different scenarios:

- `AuthenticationError`: Authentication-related errors
- `ValidationError`: Input validation errors
- `UserNotFoundError`: User lookup errors
- `GraphAPIError`: Microsoft Graph API errors
- `ConfigurationError`: Service configuration errors

## Best Practices

1. **Security**
   - Helmet for security headers
   - CORS configuration
   - Rate limiting
   - Secure token handling

2. **Performance**
   - Token caching
   - Connection pooling
   - Request limiting

3. **Reliability**
   - Comprehensive error handling
   - Request tracking
   - Health monitoring

4. **Maintainability**
   - Clean architecture
   - TypeScript for type safety
   - Comprehensive documentation
   - Full test coverage

## Contributing

1. Create a feature branch
2. Make changes
3. Add tests
4. Update documentation
5. Submit pull request

## License

MIT
