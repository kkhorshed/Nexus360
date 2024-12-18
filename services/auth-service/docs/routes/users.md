# Users API Documentation

## Overview
The Users API provides endpoints to interact with Azure Active Directory (AD) user management functionality. It enables retrieving user information, searching users, and getting user group memberships. All endpoints are protected by authentication middleware requiring a valid Bearer token.

## Authentication
All endpoints require authentication using a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

If the token is missing, invalid, or expired, the request will be rejected with a 401 Unauthorized response.

## Endpoints

### GET /users
Retrieves all users from Azure AD.

**Authentication Required:** Yes (Bearer token)

**Response:**
- Success: Array of user objects
- If Azure AD is not configured: Empty array `[]`
- Unauthorized: 401 if no valid token provided

### GET /users/search
Searches for users in Azure AD based on a query string.

**Authentication Required:** Yes (Bearer token)

**Query Parameters:**
- `query` (required): String to search users by

**Response:**
- Success: Array of matching user objects
- If Azure AD is not configured: Empty array `[]`
- Error: If query parameter is missing or invalid
- Unauthorized: 401 if no valid token provided

### GET /users/:id
Retrieves a specific user by their ID.

**Authentication Required:** Yes (Bearer token)

**Parameters:**
- `id`: User's Azure AD ID

**Response:**
- Success: Single user object
- Error: If user not found or other Azure AD errors
- Unauthorized: 401 if no valid token provided

### GET /users/:id/groups
Retrieves all groups that a specific user is a member of.

**Authentication Required:** Yes (Bearer token)

**Parameters:**
- `id`: User's Azure AD ID

**Response:**
- Success: Array of group objects
- If Azure AD is not configured: Empty array `[]`
- Unauthorized: 401 if no valid token provided

## Error Handling
- Authentication errors return 401 Unauthorized with appropriate error message
- The service gracefully handles cases where Azure AD is not configured by returning empty arrays
- Other errors are passed to the Express error handling middleware
- Specific error handling for missing/invalid search queries
- ConfigurationError for Azure AD setup issues

## Implementation Details
- Uses a modular service architecture:
  - AuthenticationService: Handles token management and auth flows
  - GraphService: Manages Microsoft Graph API operations
  - TokenCache: Provides token caching functionality
- Protected by requireAuth middleware that:
  - Validates Bearer tokens
  - Attaches authenticated user to request
  - Provides service instances through req.services
- Implements singleton pattern for services to improve performance
- Uses dependency injection for better testability
- TypeScript implementation with proper error typing

## Architecture Benefits
- Improved modularity with separate concerns:
  - Authentication logic isolated in AuthenticationService
  - Graph API operations consolidated in GraphService
- Better performance through:
  - Singleton service instances
  - Token caching
  - Reuse of service instances across requests
- Enhanced maintainability:
  - Clear separation of concerns
  - Consistent error handling
  - Dependency injection ready
- Improved testing capabilities:
  - Services can be mocked independently
  - Clear interfaces between components

## Security Considerations
- All routes are protected with authentication middleware
- Bearer tokens are validated against Azure AD
- Azure AD credentials must be properly configured in environment
- User ID validation before querying AD
- Token validation includes user profile verification
- Secure token caching implementation

## Dependencies
- Express Router
- @azure/msal-node for Azure AD authentication
- @microsoft/microsoft-graph-client for Graph API operations
- Authentication middleware for route protection
- Custom error types for specific error scenarios
