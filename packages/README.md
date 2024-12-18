# Nexus360 Packages

This directory contains shared packages used across the Nexus360 platform. Each package is focused on a specific concern to maintain modularity and reusability.

## Package Overview

### @nexus360/api-client
- API communication layer
- Creates API clients and endpoints
- Handles API error handling
- Manages API request/response lifecycle

### @nexus360/auth
- Authentication and authorization
- Login/logout functionality
- Protected route components
- Authentication state management

### @nexus360/core-ui
- Basic UI components
- Reusable form elements
- Common UI utilities
- Base styling and theming

### @nexus360/data-display
- Data visualization components
- Tables and grids
- Charts and graphs
- Data cards and statistics displays

### @nexus360/hooks
- Shared React hooks
- Custom hooks for common functionality
- State management hooks
- Utility hooks (e.g., useDebounce, useAsync)

### @nexus360/layout
- Layout components and systems
- Navigation components
- Page structure components
- Responsive layout utilities

### @nexus360/utils
- Pure utility functions
- Type definitions
- Common constants
- Helper functions

## Package Dependencies

The packages follow a hierarchical dependency structure:

```
@nexus360/utils (base utilities)
       ↑
@nexus360/hooks (react hooks)
       ↑
@nexus360/api-client (API communication)
       ↑
@nexus360/auth (authentication)
       ↑
@nexus360/core-ui (basic components)
       ↑
@nexus360/layout (layout system)
       ↑
@nexus360/data-display (data components)
```

## Development Guidelines

1. Keep packages focused on their specific concerns
2. Avoid circular dependencies
3. Export only what's necessary from each package
4. Maintain consistent naming conventions
5. Document public APIs and interfaces
6. Write unit tests for shared functionality

## Usage

Import packages using their scoped names:

```typescript
import { Button } from '@nexus360/core-ui';
import { AppLayout } from '@nexus360/layout';
import { DataTable } from '@nexus360/data-display';
import { useAsync } from '@nexus360/hooks';
