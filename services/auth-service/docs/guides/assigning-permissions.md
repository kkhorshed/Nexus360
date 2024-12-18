# Guide: Assigning App Permissions

## Method 1: Using the API

### 1. Grant App Access
First, grant access to the application:

```bash
curl -X POST http://localhost:3000/api/app-access/grant \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "appName": "xrm"
  }'
```

### 2. Assign Role
Then assign a specific role:

```bash
curl -X POST http://localhost:3000/api/app-access/roles/assign \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "appName": "xrm",
    "roleName": "xrm_admin"
  }'
```

## Method 2: Using Database Queries

### 1. Grant App Access
```sql
-- First, grant application access
INSERT INTO user_app_access (user_id, app_id, granted_by)
SELECT 
  'user123', -- user_id
  id,        -- app_id
  'admin123' -- granted_by
FROM applications 
WHERE name = 'xrm';

-- Then assign role
INSERT INTO user_app_roles (user_id, app_role_id, granted_by)
SELECT 
  'user123',  -- user_id
  ar.id,      -- app_role_id
  'admin123'  -- granted_by
FROM app_roles ar
JOIN applications a ON a.id = ar.app_id
WHERE a.name = 'xrm' AND ar.name = 'xrm_admin';
```

## Available Roles and Permissions

### XRM Application
```sql
-- Available roles
SELECT name, description 
FROM app_roles 
WHERE app_id = (SELECT id FROM applications WHERE name = 'xrm');

-- Available permissions
SELECT name, description 
FROM app_permissions 
WHERE app_id = (SELECT id FROM applications WHERE name = 'xrm');
```

Roles:
1. xrm_admin
   - All permissions
2. xrm_user
   - xrm.view
   - xrm.create
   - xrm.edit
3. xrm_viewer
   - xrm.view

### Sales Compensation Application
```sql
-- Available roles
SELECT name, description 
FROM app_roles 
WHERE app_id = (SELECT id FROM applications WHERE name = 'sales_compensation');

-- Available permissions
SELECT name, description 
FROM app_permissions 
WHERE app_id = (SELECT id FROM applications WHERE name = 'sales_compensation');
```

Roles:
1. comp_admin
   - All permissions
2. comp_manager
   - comp.view_own
   - comp.view_team
   - comp.manage
   - comp.approve
3. comp_user
   - comp.view_own

## Common Tasks

### Check User's Current Access
```sql
-- Check user's apps and roles
SELECT 
  a.name as app_name,
  a.display_name,
  STRING_AGG(ar.name, ', ') as roles
FROM user_app_access uaa
JOIN applications a ON a.id = uaa.app_id
LEFT JOIN user_app_roles uar ON uar.user_id = uaa.user_id
LEFT JOIN app_roles ar ON ar.id = uar.app_role_id
WHERE uaa.user_id = 'user123'
  AND uaa.is_active = true
  AND (uar.is_active IS NULL OR uar.is_active = true)
GROUP BY a.name, a.display_name;

-- Check user's permissions
SELECT DISTINCT ap.name as permission
FROM user_app_roles uar
JOIN app_roles ar ON ar.id = uar.app_role_id
JOIN app_role_permissions arp ON arp.app_role_id = ar.id
JOIN app_permissions ap ON ap.id = arp.permission_id
WHERE uar.user_id = 'user123'
  AND uar.is_active = true;
```

### Revoke Access
```sql
-- Revoke all access to an app
UPDATE user_app_access
SET is_active = false, revoked_at = CURRENT_TIMESTAMP
WHERE user_id = 'user123'
  AND app_id = (SELECT id FROM applications WHERE name = 'xrm');

-- Revoke specific role
UPDATE user_app_roles
SET is_active = false, revoked_at = CURRENT_TIMESTAMP
WHERE user_id = 'user123'
  AND app_role_id = (
    SELECT ar.id 
    FROM app_roles ar
    JOIN applications a ON a.id = ar.app_id
    WHERE a.name = 'xrm' AND ar.name = 'xrm_admin'
  );
```

## Best Practices

1. Always grant app access before assigning roles
2. Use the API endpoints when possible for proper validation and logging
3. Start with minimal permissions (e.g., viewer role) and escalate as needed
4. Regularly audit user permissions using the provided SQL queries
5. Document any custom role assignments for compliance
6. Use the middleware in your applications to enforce permissions:

```typescript
// In your XRM or Sales Compensation app routes
import { requireAppAccess, requirePermission } from '../middleware/appAccessMiddleware';

// Protect all routes
router.use(requireAppAccess('xrm')); // or 'sales_compensation'

// Protect specific routes
router.post('/records', 
  requirePermission('xrm', 'xrm.create'),
  (req, res) => {
    // Handle creating records
  }
);
```

## Troubleshooting

1. If permissions aren't taking effect:
   - Check if user has active app access
   - Verify role assignment is active
   - Confirm role has the required permissions
   - Check middleware is properly configured

2. Common issues:
   - Missing app access before role assignment
   - Inactive role assignments
   - Incorrect permission names
   - Middleware not properly configured

3. Debugging queries:
```sql
-- Check complete access chain
WITH user_access AS (
  SELECT 
    a.name as app_name,
    ar.name as role_name,
    ap.name as permission_name,
    uaa.is_active as app_access_active,
    uar.is_active as role_active,
    uaa.granted_at as access_granted,
    uar.granted_at as role_granted
  FROM user_app_access uaa
  JOIN applications a ON a.id = uaa.app_id
  LEFT JOIN user_app_roles uar ON uar.user_id = uaa.user_id
  LEFT JOIN app_roles ar ON ar.id = uar.app_role_id
  LEFT JOIN app_role_permissions arp ON arp.app_role_id = ar.id
  LEFT JOIN app_permissions ap ON ap.id = arp.permission_id
  WHERE uaa.user_id = 'user123'
)
SELECT * FROM user_access;
