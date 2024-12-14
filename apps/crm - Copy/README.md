# Nexus360 CRM

Modern CRM application with Azure AD authentication integration.

## Features

- Azure AD Single Sign-On
- User Profile Management
- Deal Management
- Product Catalog
- Persistent Authentication
- Responsive Layout

## Getting Started

### Prerequisites

- Node.js 16+
- npm or pnpm
- Running auth-service

### Installation

```bash
cd apps/crm
npm install
# or
pnpm install
```

### Development

```bash
npm run dev
# or
pnpm dev
```

Application will be available at http://localhost:3010

## Architecture

### Components

#### Authentication
- **Header**: User profile display and authentication status
- **PrivateRoute**: Protected route wrapper
- **AuthContext**: Authentication state management

#### Core Features
- **DealBoard**: Deal management interface
- **ProductCatalog**: Product listing and management
- **AddDealForm**: Deal creation form
- **AddProductForm**: Product creation form

### Authentication Flow

1. User visits CRM app
2. If not authenticated, redirected to auth service
3. After successful auth, redirected back with token
4. User profile displayed in header
5. Authentication persists via localStorage

### State Management

- Authentication state in localStorage
- User profile in localStorage
- React context for global state
- Component-level state for UI

## Configuration

### Environment Variables

Create `.env` file:

```env
VITE_AUTH_URL=http://localhost:3006
VITE_API_URL=http://localhost:3006/api
```

### Build Configuration

vite.config.ts settings:
```typescript
{
  server: {
    port: 3010
  },
  build: {
    outDir: 'dist'
  }
}
```

## Components

### Header

```typescript
interface User {
  displayName: string;
  email: string;
  jobTitle?: string;
}

const Header: React.FC = () => {
  // User profile display
  // Authentication status
  // Logout functionality
}
```

### Routes

- `/dashboard`: Main dashboard
- `/deals`: Deal management
- `/products`: Product catalog
- `/customers`: Customer management
- `/settings`: App settings

## Styling

- Ant Design components
- CSS Modules for custom styling
- Responsive design
- Theme customization

## Development

### Code Structure

```
src/
├── components/     # Reusable components
├── routes/        # Route components
├── styles/        # CSS modules
└── main.tsx       # Entry point
```

### Adding New Features

1. Create component in `components/`
2. Add styles in `styles/`
3. Update routes if needed
4. Add to main layout

### Testing

```bash
npm test
# or
pnpm test
```

## Build

```bash
npm run build
# or
pnpm build
```

Outputs to `dist/` directory.

## Security

- Secure token storage
- Protected routes
- XSS prevention
- CSRF protection

## Contributing

1. Create feature branch
2. Add tests
3. Update documentation
4. Submit pull request

## License

MIT License
