# Managing App Access and Permissions

This guide explains how to use the access management tool to grant access and assign roles for XRM and Sales Compensation applications.

## Prerequisites

1. Database must be set up with the app access schema
2. Environment variables for database connection (or will use defaults):
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=nexus360_auth
   DB_USER=postgres
   DB_PASSWORD=postgres
   ```

## Quick Start

### 1. Grant Application Access

Grant a user access to an application:

```bash
# Format
npm run grant-access <userId> <appName> [grantedBy]

# Examples
npm run grant-access "user123" "xrm" "admin1"
npm run grant-access "user456" "sales_compensation"
```

This will:
- Grant access to the specified application
- Assign the default user role (e.g., xrm_user or comp_user)

### 2. Assign Specific Roles

Assign additional roles to a user:

```bash
# Format
npm run assign-role <userId> <appName> <roleName> [grantedBy]

# Examples
npm run assign-role "user123" "xrm" "xrm_admin" "admin1"
npm run assign-role "user456" "sales_compensation" "comp_manager"
```

### 3. View User Access

List a user's current access and permissions:

```bash
# Format
npm run list-access <userId>

# Example
npm run list-access "user123"
```

## Available Roles

### XRM Application
- `xrm_admin`: Full access to all XRM features
- `xrm_user`: Basic user access (create, edit, view)
- `xrm_viewer`: Read-only access

### Sales Compensation Application
- `comp_admin`: Full access to compensation features
- `comp_manager`: Team management access
- `comp_user`: Basic user access (view own data)

## Common Scenarios

### 1. Setting up a new XRM admin
```bash
# First grant access
npm run grant-access "newAdmin" "xrm" "superadmin"

# Then assign admin role
npm run assign-role "newAdmin" "xrm" "xrm_admin" "superadmin"
```

### 2. Setting up a Sales Compensation manager
```bash
# Grant access with default user role
npm run grant-access "manager1" "sales_compensation" "admin1"

# Upgrade to manager role
npm run assign-role "manager1" "sales_compensation" "comp_manager" "admin1"
```

### 3. Verify Access Setup
```bash
# Check user's access and roles
npm run list-access "manager1"
```

## Troubleshooting

### Common Issues

1. "Application not found"
   - Verify the app name is correct (use "xrm" or "sales_compensation")
   - Check if the applications table is properly seeded

2. "Role not found"
   - Verify role name matches exactly (e.g., "xrm_admin", not "xrmadmin")
   - Check if roles are properly seeded in the database

3. "User does not have access"
   - Ensure you've granted app access before assigning roles
   - Check if the user's access is active

### Verification Queries

```sql
-- Check available applications
SELECT name, display_name FROM applications;

-- Check available roles for an app
SELECT ar.name, ar.description 
FROM app_roles ar
JOIN applications a ON a.id = ar.app_id
WHERE a.name = 'xrm';

-- Check user's current access
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
GROUP BY a.name, a.display_name;
```

## Best Practices

1. Always start with granting app access before assigning roles
2. Use descriptive grantedBy values for audit trails
3. Regularly review user access using the list-access command
4. Follow principle of least privilege:
   - Start with viewer/user roles
   - Upgrade permissions only as needed
   - Regularly review admin access

## Security Considerations

1. Keep track of who is granting access (use the grantedBy parameter)
2. Regularly audit user access and permissions
3. Revoke access when no longer needed
4. Document all role assignments
5. Review admin role assignments periodically
