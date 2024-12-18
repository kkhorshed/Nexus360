# App Access API Documentation

## Overview
The App Access API provides endpoints to manage user access to different applications within the Nexus360 platform. It enables granting and revoking access, managing roles, and checking permissions for specific applications like XRM and Sales Compensation.

## Authentication
All endpoints require authentication using a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Endpoints

### GET /api/app-access/apps
Retrieves all applications the authenticated user has access to.

**Authentication Required:** Yes (Bearer token)

**Response:**
```json
[
  {
    "name": "xrm",
    "displayName": "XRM",
    "roles": ["xrm_user", "xrm_admin"]
  },
  {
    "name": "sales_compensation",
    "displayName": "Sales Compensation",
    "roles": ["comp_user"]
  }
]
```

### POST /api/app-access/grant
Grants a user access to a specific application.

**Authentication Required:** Yes (Bearer token)

**Request Body:**
```json
{
  "userId": "user123",
  "appName": "xrm"
}
```

**Response:**
- Success: `{ "message": "Access granted successfully" }`
- Error: Appropriate error message with status code

### POST /api/app-access/revoke
Revokes a user's access to a specific application.

**Authentication Required:** Yes (Bearer token)

**Request Body:**
```json
{
  "userId": "user123",
  "appName": "xrm"
}
```

**Response:**
- Success: `{ "message": "Access revoked successfully" }`
- Error: Appropriate error message with status code

### POST /api/app-access/roles/assign
Assigns a role to a user for a specific application.

**Authentication Required:** Yes (Bearer token)

**Request Body:**
```json
{
  "userId": "user123",
  "appName": "xrm",
  "roleName": "xrm_admin"
}
```

**Response:**
- Success: `{ "message": "Role assigned successfully" }`
- Error: Appropriate error message with status code

### GET /api/app-access/:appName/permissions
Gets all permissions the authenticated user has for a specific application.

**Authentication Required:** Yes (Bearer token)

**Parameters:**
- `appName`: The name of the application (e.g., "xrm", "sales_compensation")

**Response:**
```json
[
  "xrm.view",
  "xrm.create",
  "xrm.edit"
]
```

### GET /api/app-access/:appName/check-permission
Checks if the authenticated user has a specific permission.

**Authentication Required:** Yes (Bearer token)

**Parameters:**
- `appName`: The name of the application
- `permission`: Query parameter for the permission to check

**Example:**
```
GET /api/app-access/xrm/check-permission?permission=xrm.edit
```

**Response:**
```json
{
  "hasPermission": true
}
```

## Middleware Usage

The auth service provides middleware for protecting application routes:

### requireAppAccess
Ensures the user has access to the specific application.

```typescript
import { requireAppAccess } from '../middleware/appAccessMiddleware';

// Use in your application routes
router.use(requireAppAccess('xrm'));
```

### requirePermission
Checks if the user has a specific permission within an application.

```typescript
import { requirePermission } from '../middleware/appAccessMiddleware';

// Use in your route handlers
router.post('/records', 
  requirePermission('xrm', 'xrm.create'),
  (req, res) => {
    // Handle creating records
  }
);
```

### attachAppPermissions
Attaches the user's permissions to the request object for flexible permission checking.

```typescript
import { attachAppPermissions } from '../middleware/appAccessMiddleware';

// Use to attach permissions
router.use(attachAppPermissions('xrm'));

// Access permissions in your route handlers
router.get('/dashboard', (req, res) => {
  const canEdit = req.appPermissions?.includes('xrm.edit');
  // Use permissions to customize response
});
```

## Default Roles and Permissions

### XRM Application
- **xrm_admin**
  - All permissions (xrm.view, xrm.create, xrm.edit, xrm.delete, xrm.admin)
- **xrm_user**
  - Basic operations (xrm.view, xrm.create, xrm.edit)
- **xrm_viewer**
  - Read-only access (xrm.view)

### Sales Compensation Application
- **comp_admin**
  - All permissions (comp.view_own, comp.view_team, comp.manage, comp.approve, comp.admin)
- **comp_manager**
  - Team management (comp.view_own, comp.view_team, comp.manage, comp.approve)
- **comp_user**
  - Basic access (comp.view_own)

## Error Handling
- 401 Unauthorized: Missing or invalid authentication token
- 403 Forbidden: User doesn't have required permissions
- 404 Not Found: Resource not found
- 400 Bad Request: Invalid input parameters
- 500 Internal Server Error: Server-side errors

## Implementation Notes
- All timestamps are stored in UTC
- Role assignments are tracked with audit information (granted by, granted at)
- Permissions are hierarchical (e.g., admin role includes all lower-level permissions)
- Access can be temporarily revoked without deleting the records
- Default roles are automatically assigned when granting application access
