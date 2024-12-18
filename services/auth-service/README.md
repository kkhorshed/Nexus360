# Auth Service

## Overview
The Auth Service is a robust authentication and user management system built on Azure Active Directory (Azure AD). It provides secure authentication, user management, and group membership functionality through Microsoft Graph API integration.

## Features
- Azure AD Authentication
- User Management
- Group Management
- Token Management
- Secure Error Handling

## Architecture

### Core Components
1. **User Routes** ([Documentation](docs/routes/users.md))
   - User management endpoints
   - Search functionality
   - Group membership queries

2. **AD Service** ([Documentation](docs/services/adService.md))
   - Azure AD integration
   - Microsoft Graph API operations
   - Authentication handling

3. **Token Cache** ([Documentation](docs/services/tokenCache.md))
   - In-memory token management
   - Expiration handling
   - Refresh token support

4. **Custom Errors** ([Documentation](docs/errors/customErrors.md))
   - Structured error handling
   - HTTP status code mapping
   - Consistent error responses

## Setup

### Prerequisites
- Node.js (v14 or higher)
- Azure AD Tenant
- Microsoft Graph API access

### Environment Variables
```env
AZURE_AD_CLIENT_ID=your_client_id
AZURE_AD_CLIENT_SECRET=your_client_secret
AZURE_AD_TENANT_ID=your_tenant_id
AZURE_AD_REDIRECT_URI=your_redirect_uri
```

### Installation
```bash
npm install
```

### Running the Service
```bash
npm run dev    # Development mode
npm start      # Production mode
```

## API Endpoints

### User Management
- `GET /users` - Get all users
- `GET /users/search` - Search users
- `GET /users/:id` - Get user by ID
- `GET /users/:id/groups` - Get user's groups

### Authentication
- OAuth 2.0 flow with Azure AD
- Token management and refresh
- Group-based authorization

## Security Features
- Azure AD integration
- Token-based authentication
- Secure error handling
- Input validation
- Rate limiting support

## Error Handling
The service implements a comprehensive error handling system:
- Custom error types for different scenarios
- Consistent error responses
- Proper HTTP status codes
- Detailed error logging

## Development

### Project Structure
```
auth-service/
├── src/
│   ├── routes/          # API routes
│   ├── services/        # Core services
│   ├── errors/          # Custom error types
│   ├── types/           # TypeScript types
│   └── utils/           # Utility functions
├── docs/               # Documentation
│   ├── routes/         # Route documentation
│   ├── services/       # Service documentation
│   └── errors/         # Error handling docs
└── tests/              # Test files
```

### Best Practices
1. Follow TypeScript best practices
2. Implement proper error handling
3. Write comprehensive tests
4. Document new features
5. Follow security guidelines

## Testing
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## Monitoring
- Error logging
- Performance metrics
- Azure AD integration status
- Token management statistics

## Contributing
1. Follow the existing code structure
2. Add appropriate documentation
3. Include tests for new features
4. Update relevant documentation

## License
[Your License Here]

## Support
[Your Support Information]
