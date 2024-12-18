# Nexus360 CRM

A modern, feature-rich Customer Relationship Management system built with React, TypeScript, and Material-UI.

## Features

- **Dashboard**: Overview of key metrics and activities
- **Contacts Management**: Track and manage customer information
- **Leads Management**: Monitor and nurture potential opportunities
- **Opportunities Management**: Track sales pipeline and deals
- **Modern UI**: Clean and responsive interface using Material-UI
- **Type Safety**: Built with TypeScript for better development experience

## Tech Stack

- React 18
- TypeScript
- Material-UI (MUI)
- React Router for navigation
- React Query for data fetching
- Vite for build tooling

## Getting Started

1. Install dependencies:
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm dev
```

3. Build for production:
```bash
pnpm build
```

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── common/        # Shared components
│   └── layout/        # Layout components
├── features/          # Feature-specific components
│   ├── dashboard/
│   ├── contacts/
│   ├── leads/
│   └── opportunities/
├── theme/             # MUI theme configuration
└── utils/            # Utility functions
```

## Development Guidelines

- Follow the established folder structure
- Use TypeScript for all new code
- Follow Material-UI best practices
- Implement proper error handling
- Write clean, maintainable code
- Use proper TypeScript types and interfaces

### UI Component Standards

#### Layout Components
The layout components (Header and Sidebar) follow a clean, modern design with sharp edges:

##### Sidebar Component (`src/components/layout/Sidebar.tsx`)
- Uses MUI Drawer with sharp edges
- Features Cequens logo at the top
- Menu items have no border radius for consistent styling
- Features:
  - Collapsible settings menu
  - Active state highlighting
  - Responsive design with mobile drawer

##### Header Component (`src/components/layout/Header.tsx`)
- Uses MUI AppBar with no elevation
- Features sharp edges (no border radius) throughout
- Contains:
  - Search functionality
  - Notifications system
  - User profile menu
  - Help section

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT
