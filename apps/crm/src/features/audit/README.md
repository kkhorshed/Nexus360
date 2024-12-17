# Audit Trail Feature

The Audit Trail feature provides a comprehensive timeline view of all changes made to entities within the CRM system. It tracks creates, updates, and deletions across various entity types and displays them in a chronological, filterable timeline.

## Structure

```
audit/
├── components/           # Reusable UI components
│   ├── AuditLogFilters  # Filtering controls for audit logs
│   └── AuditLogItem     # Individual audit log entry display
├── hooks/               # Custom React hooks
│   └── useAuditLogs     # State management and data fetching
├── services/            # API and data services
│   └── auditService     # Audit API interactions
├── types.ts            # TypeScript interfaces and types
├── AuditTrail.tsx      # Main component
└── README.md           # Documentation
```

## Page Layout

The Audit Trail page uses the common `PageWrapper` component for consistent layout and navigation:
- Page header with title "Audit Trail"
- Description explaining the feature
- Breadcrumb navigation
- Main content area with:
  - Filtering controls
  - Timeline of audit logs

## Components

### AuditTrail
Main component that orchestrates the audit trail display. Uses PageWrapper for consistent layout and uses the `useAuditLogs` hook for state management.

### AuditLogFilters
Provides filtering capabilities:
- Entity type selection (Leads, Contacts, Companies, etc.)
- Text search across all audit log fields

### AuditLogItem
Displays a single audit log entry in the timeline, showing:
- Action type (Create/Update/Delete)
- Entity information
- Timestamp
- User who made the change
- Detailed changes (old and new values)

## Hooks

### useAuditLogs
Custom hook that manages:
- Fetching audit logs from the API
- Filtering logic
- Loading states
- Formatting utilities

## Services

### auditService
Handles all API interactions for audit logs:
- Fetching audit logs with optional entity type filtering
- Error handling and response processing

## Types

The feature uses TypeScript for type safety. Key types include:
- `AuditLog`: Main audit log entry structure
- `AuditChange`: Individual field changes
- `AuditAction`: Possible audit actions (CREATE/UPDATE/DELETE)
- `AuditLogFilters`: Filter parameters

## Usage

```tsx
import AuditTrail from 'features/audit/AuditTrail';

// Simply render the component
<AuditTrail />
```

The component is self-contained and will handle its own state management and data fetching.

## API Integration

The feature expects an API endpoint at `http://localhost:3001/api/audit/logs` that:
- Accepts optional `entityType` query parameter
- Returns audit logs in the format specified by the `AuditLog` interface

## Future Improvements

Potential areas for enhancement:
- Date range filtering
- Export functionality
- Detailed view modal for individual logs
- Real-time updates
- Pagination for large datasets
