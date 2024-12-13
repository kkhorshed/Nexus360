# Nexus360 Frontend

## Overview
The frontend application serves as the main entry point for the Nexus360 platform, providing authentication and navigation to various micro-frontend applications.

## Features

### Authentication
- Login page with email/password authentication
- Session management
- Protected routes

### Application Navigation
Access to platform applications:
- CRM (port 3010)
- AI Chat (port 3020)
- Sales Compensation (port 3030)
- Forecasting (port 3040)
- Marketing (port 3050)

## Structure

```
src/
├── components/
│   └── Common/          # Shared components
├── contexts/
│   └── AuthContext.tsx  # Authentication context
├── hooks/
│   └── useAuth.ts      # Authentication hook
├── routes/
│   └── Login.tsx       # Login page
├── styles/
│   └── globals.css     # Global styles
├── App.tsx             # Main application component
└── main.tsx           # Application entry point
```

## Development

### Running the Application
```bash
cd frontend
pnpm install
pnpm run dev
```

The application will be available at `http://localhost:3000`

### Additional Scripts
- **Clear Ports**: Clears any ports that might be in use.
  ```bash
  pnpm run clear-ports
  ```
- **Build**: Builds the application for production.
  ```bash
  pnpm run build
  ```
- **Serve**: Previews the production build.
  ```bash
  pnpm run serve
  ```
- **Lint**: Runs ESLint to check for code quality issues.
  ```bash
  pnpm run lint
  ```

### Dependencies
- React
- React Router DOM
- Ant Design
- @ant-design/icons
- @ant-design/cssinjs
- @dnd-kit/core
- @dnd-kit/sortable
- @dnd-kit/utilities
- react-beautiful-dnd
- @nexus360/ui

## Integration

The frontend integrates with:
- Authentication Service: For user authentication
- Platform Services: For shared functionality
- Micro-frontends: Individual applications within the platform

## Environment Variables

Required environment variables in `.env`:
```env
VITE_AUTH_SERVICE_URL=http://localhost:3001
VITE_APP_NAME=Nexus360
VITE_APP_VERSION=0.1.0
```

## Notes
- The frontend serves as a shell application, providing authentication and navigation
- Each micro-frontend application runs independently on its own port
- Authentication state is shared across all applications through the auth service
