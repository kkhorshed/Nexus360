# Auth Service

Authentication and authorization service for the Nexus360 platform.

## Features

- Azure AD integration for user authentication
- Local user database synchronization
- Application permission management
- Role-based access control
- User activity tracking

## Setup

### Prerequisites

- Node.js 16 or higher
- PostgreSQL 12 or higher
- Azure AD tenant (for production use)

### Database Setup

1. Create a PostgreSQL database for the auth service:

```sql
CREATE DATABASE nexus360_auth;
```

2. Configure database connection in `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nexus360_auth
DB_USER=your_user
DB_PASSWORD=your_password
```

3. Initialize the database:

```bash
npm run db:init
```

This will create all necessary tables for:
- User management
- Application registration
- Role-based access control
- Permission management

### Azure AD Configuration

1. Configure Azure AD credentials in `.env`:

```env
AZURE_CLIENT_ID=your_client_id
AZURE_CLIENT_SECRET=your_client_secret
AZURE_TENANT_ID=your_tenant_id
```

2. Ensure your Azure AD application has the following permissions:
- User.Read.All
- Group.Read.All
- Directory.Read.All

## User Management

The service automatically syncs users from Azure AD to the local database when:
- Users log in
- Admin searches for users
- Admin views user details
- Admin manually triggers sync

### User States

Users can be in the following states:
- Active: User has access to permitted applications
- Inactive: User access is suspended
- Pending: User exists in Azure AD but hasn't accessed the system

### Application Access

Users need explicit access grants to use platform applications:

1. Admin grants application access
2. Admin assigns roles within the application
3. Roles determine available permissions
4. User can access application features based on permissions

### Permission Hierarchy

```
Application
└── Roles
    └── Permissions
```

Example:
```
XRM Application
├── Admin Role
│   ├── Create Records
│   ├── Edit Records
│   ├── Delete Records
│   └── Manage Settings
├── User Role
│   ├── Create Records
│   └── Edit Records
└── Viewer Role
    └── View Records
```

## API Endpoints

### User Management

```
GET /api/users
GET /api/users/search?query=
GET /api/users/:id
GET /api/users/:id/groups
GET /api/users/:id/permissions
POST /api/users/:id/sync
POST /api/users/:id/deactivate
POST /api/users/:id/reactivate
```

### Application Access

```
GET /api/applications
GET /api/applications/:id/roles
GET /api/applications/:id/permissions
POST /api/users/:userId/applications/:appId/access
DELETE /api/users/:userId/applications/:appId/access
```

### Role Management

```
GET /api/roles
POST /api/users/:userId/roles/:roleId
DELETE /api/users/:userId/roles/:roleId
```

## Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Run tests:
```bash
npm test
```

## Production Deployment

1. Build the service:
```bash
npm run build
```

2. Start the service:
```bash
npm start
```

## Monitoring

The service logs important events:
- User synchronization
- Permission changes
- Access grants/revocations
- Authentication attempts
- System errors

Monitor logs through:
- Console output
- Log files (if configured)
- Application Insights (if configured)
