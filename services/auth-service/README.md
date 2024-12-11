# Auth Service

Authentication service for Nexus360 platform using Azure AD.

## Features

- Azure AD Single Sign-On (SSO)
- Token-based authentication
- User profile management
- Cross-origin resource sharing (CORS)
- Persistent authentication
- Secure token storage

## Configuration

### Environment Variables

Create a `.env` file in the service root:

```env
# Azure AD Configuration
AZURE_AD_TENANT_ID=your-tenant-id
AZURE_AD_CLIENT_ID=your-client-id
AZURE_AD_CLIENT_SECRET=your-client-secret
AZURE_AD_REDIRECT_URI=http://localhost:3006/api/auth/callback

# API Configuration
PORT=3006
NODE_ENV=development

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3010,http://localhost:3020

# Logging
LOG_LEVEL=info
LOG_FORMAT=json
```

## API Endpoints

### Authentication

#### `GET /api/auth/login`
Initiates Azure AD login flow.

#### `GET /api/auth/callback`
Handles Azure AD callback with authorization code.

### User Management

#### `GET /api/users`
Get all users (requires authentication).

#### `GET /api/users/:userId`
Get user by ID (requires authentication).

#### `GET /api/users/search`
Search users by query (requires authentication).

#### `GET /api/users/:userId/groups`
Get user's groups (requires authentication).

## Authentication Flow

1. User attempts to access protected resource
2. Redirected to `/api/auth/login`
3. Azure AD authentication process
4. Callback received at `/api/auth/callback`
5. User profile retrieved and token generated
6. Redirected back to application with token and profile

## Development

### Prerequisites

- Node.js 16+
- npm or pnpm
- Azure AD Application credentials

### Installation

```bash
npm install
# or
pnpm install
```

### Running

```bash
npm run dev
# or
pnpm dev
```

### Testing

```bash
npm test
# or
pnpm test
```

## Security

### Token Management

- Access tokens stored securely
- Token refresh mechanism
- Token validation middleware
- Secure cookie handling

### CORS Configuration

- Whitelist of allowed origins
- Credential support
- Pre-flight request handling

### Error Handling

- Custom error types
- Consistent error responses
- Detailed logging
- Rate limiting

## Architecture

### Components

- **ADController**: Handles auth endpoints
- **ADService**: Azure AD integration
- **TokenCache**: Token management
- **ErrorHandler**: Error processing

### Dependencies

- @azure/msal-node
- @microsoft/microsoft-graph-client
- express
- winston

## Deployment

### Production Setup

1. Configure environment variables
2. Set NODE_ENV to 'production'
3. Configure proper CORS origins
4. Enable secure cookies
5. Set up logging

### Health Checks

- `/api/health` endpoint
- Azure AD connectivity check
- Token validation check

## Troubleshooting

### Common Issues

1. CORS errors
   - Verify allowed origins
   - Check credentials mode

2. Token errors
   - Check Azure AD configuration
   - Verify token expiration
   - Clear browser cache

3. Callback errors
   - Verify redirect URI
   - Check Azure AD permissions

## Contributing

1. Create feature branch
2. Add tests
3. Update documentation
4. Submit pull request

## License

MIT License
