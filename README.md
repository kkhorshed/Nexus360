# Nexus360 Platform

A comprehensive business platform integrating CRM, AI Chat, Sales Compensation, Forecasting, and Marketing tools.

## Quick Start

See the [Quick Start Guide](docs/setup/quick-start.md) for detailed setup instructions.

## Core Components

### Main Application
- **Frontend** (`/frontend`) - Main application shell running on port 3000
- **Platform Services** (`/platform`) - Core services for auth, integration, etc.
- **Apps** (`/apps`) - Micro-frontend applications

### Platform Services
- Authentication (port 3001)
- Integration (port 3002)
- Notification (port 3003)
- Analytics (port 3004)

### Applications
- CRM (port 3010)
- AI Chat (port 3020)
- Sales Compensation (port 3030)
- Forecasting (port 3040)
- Marketing (port 3050)

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- pnpm (for package management)
- Azure AD account (for SSO)

## Development Setup

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Configure Environment**
   - Copy `.env.example` files to `.env` in required directories
   - Configure Azure AD credentials
   - Set up database connection

3. **Start Development Server**
   ```bash
   node start-services.js
   ```

4. **Access the Application**
   - Main application: http://localhost:3000
   - Login page: http://localhost:3000/login

## Documentation

- [Setup Guide](docs/setup/quick-start.md) - Detailed setup instructions
- [Database Guide](docs/database/README.md) - Database structure and setup
- [Architecture](docs/architecture/system-design.md) - System design and architecture
- [SSO Setup](docs/setup/azure-sso-setup.md) - Azure AD configuration
- [Deployment](docs/deployment/guide.md) - Production deployment guide

## Contributing

1. Ensure you have all prerequisites installed
2. Follow the setup guide
3. Create feature branches from `main`
4. Submit pull requests with tests

## Support

For issues and questions:
1. Check the documentation
2. Search existing issues
3. Contact the development team

## License

Copyright © 2024 Nexus360. All rights reserved.
