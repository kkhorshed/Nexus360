# Application Layout Guide

## Overview
This guide describes the standard layout pattern that should be used across all Nexus360 applications to ensure consistency in user experience and maintainability.

## Components

### AppLayout
The `AppLayout` component provides the main application structure with:
- Fixed header with app name and user profile
- Navigation sidebar
- Content area

```tsx
import { AppLayout } from '@nexus360/ui';

const menuItems = [
  { name: 'Dashboard', path: '/' },
  { name: 'Settings', path: '/settings' }
];

function App() {
  return (
    <AppLayout 
      appName="Your App Name"
      menuItems={menuItems}
      user={userObject}
      onLogout={handleLogout}
    >
      {/* Your routes/content here */}
    </AppLayout>
  );
}
```

### PageWrapper
The `PageWrapper` component provides consistent page-level structure within the main content area:
- Page title
- Optional description
- Content area with consistent padding and styling

```tsx
import { PageWrapper } from '@nexus360/ui';

function DashboardPage() {
  return (
    <PageWrapper
      title="Dashboard"
      description="Overview of key metrics and activities"
    >
      {/* Your page content here */}
    </PageWrapper>
  );
}
```

## Implementation Pattern

1. Use `AppLayout` as the root component in your application's `App.tsx`
2. Wrap each route's content with `PageWrapper`
3. Place page-specific content within the `PageWrapper`

Example implementation:

```tsx
// App.tsx
import { AppLayout } from '@nexus360/ui';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './routes/Dashboard';
import Settings from './routes/Settings';

const menuItems = [
  { name: 'Dashboard', path: '/' },
  { name: 'Settings', path: '/settings' }
];

function App() {
  return (
    <AppLayout 
      appName="Your App Name"
      menuItems={menuItems}
      user={userObject}
      onLogout={handleLogout}
    >
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </AppLayout>
  );
}

// routes/Dashboard.tsx
import { PageWrapper } from '@nexus360/ui';

function Dashboard() {
  return (
    <PageWrapper
      title="Dashboard"
      description="Overview of key metrics and activities"
    >
      {/* Dashboard content */}
    </PageWrapper>
  );
}
```

## Best Practices

1. Always use both `AppLayout` and `PageWrapper` components
2. Keep menu items consistent with your application's routes
3. Ensure page titles and descriptions are clear and meaningful
4. Maintain consistent styling by using the provided layout components rather than custom containers

## Component Props

### AppLayout Props
- `appName`: string - The name of your application
- `menuItems`: Array<{ name: string, path: string }> - Navigation menu items
- `user`: Object (optional) - User information for the profile section
- `onLogout`: Function (optional) - Logout handler
- `children`: ReactNode - The application's content/routes

### PageWrapper Props
- `title`: string - The page title
- `description`: string (optional) - A brief description of the page
- `children`: ReactNode - The page's content
