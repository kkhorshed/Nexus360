# Nexus360

A modern enterprise platform integrating CRM, AI Chat, and other business tools with Azure AD authentication.

## Services

- **Auth Service** (Port 3006): Azure AD authentication service
- **CRM App** (Port 3010): Customer Relationship Management application
- **AI Chat** (Port 3020): AI-powered chat interface

## Getting Started

### Prerequisites

- Node.js 16+
- npm or pnpm
- Azure AD Application credentials

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/kkhorshed/Nexus360.git
cd Nexus360
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Configure environment variables:

Create `.env` files in the following locations:

**services/auth-service/.env**:
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
```

### Starting the Services

Start all services:
```bash
npm start
```

This will launch:
- Auth Service: http://localhost:3006
- CRM App: http://localhost:3010
- AI Chat: http://localhost:3020

## Authentication Flow

1. Users visit any application (CRM/AI Chat)
2. If not authenticated, redirected to Auth Service
3. Auth Service handles Azure AD authentication
4. Upon successful auth, redirected back to the application
5. User profile displayed in header
6. Authentication persists across sessions

## Architecture

### Services

- **Auth Service**: Handles Azure AD authentication and user management
- **CRM App**: React-based CRM application
- **AI Chat**: AI-powered chat interface

### Key Features

- Azure AD SSO Integration
- Persistent Authentication
- User Profile Management
- Cross-Service Communication

## Development

### Project Structure

```
├── apps/
│   ├── crm/             # CRM Application
│   └── ai-chat/         # AI Chat Application
├── services/
│   ├── auth-service/    # Authentication Service
│   └── shared/          # Shared Utilities
└── packages/            # Shared Packages
```

### Adding New Services

1. Create new directory under `apps/` or `services/`
2. Add service to `start-services.js`
3. Configure CORS in auth service
4. Update documentation

## Contributing

1. Create feature branch
2. Make changes
3. Update documentation
4. Submit pull request

## Security

- Environment variables are not committed
- Sensitive data stored securely
- Azure AD handles authentication
- CORS configured for specific origins

## License

MIT License
