# ADService Documentation

## Overview
The ADService class provides a comprehensive interface for interacting with Azure Active Directory (Azure AD) through Microsoft Graph API. It handles authentication, token management, and user operations.

## Features
- Azure AD authentication using MSAL (Microsoft Authentication Library)
- Token management with caching
- User management operations through Microsoft Graph API
- Group membership queries
- Error handling with custom error types

## Class Methods

### Constructor
Initializes the ADService with Azure AD configurations:
- Requires environment variables:
  - AZURE_AD_CLIENT_ID
  - AZURE_AD_CLIENT_SECRET
  - AZURE_AD_TENANT_ID
  - AZURE_AD_REDIRECT_URI (optional, defaults to http://localhost:3001/api/auth/callback)

### Authentication Methods

#### `getAuthUrl(): Promise<string>`
- Generates authentication URL for OAuth flow
- Scopes: user.read, directory.read.all, groupmember.read.all, offline_access
- Returns: Promise resolving to authentication URL

#### `handleCallback(code: string): Promise<string>`
- Processes OAuth callback
- Parameters:
  - code: Authorization code from OAuth flow
- Returns: Promise resolving to access token
- Caches token if user identifier is available

#### `refreshToken(userId: string): Promise<string>`
- Refreshes expired access token
- Parameters:
  - userId: User's unique identifier
- Returns: Promise resolving to new access token
- Updates token cache with new token

### User Management Methods

#### `getAllUsers(): Promise<User[]>`
- Retrieves all users from Azure AD
- Returns: Promise resolving to array of User objects
- Includes basic user information (id, displayName, mail, etc.)

#### `getUserById(userId: string): Promise<User>`
- Retrieves specific user by ID
- Parameters:
  - userId: User's Azure AD ID
- Returns: Promise resolving to User object
- Throws UserNotFoundError if user doesn't exist

#### `getCurrentUser(accessToken: string): Promise<User>`
- Gets current authenticated user's information
- Parameters:
  - accessToken: Valid access token
- Returns: Promise resolving to User object

#### `searchUsers(query: string): Promise<User[]>`
- Searches users by display name or email
- Parameters:
  - query: Search string
- Returns: Promise resolving to array of matching User objects
- Limits results to 50 users

#### `getUserGroups(userId: string): Promise<string[]>`
- Gets groups user belongs to
- Parameters:
  - userId: User's Azure AD ID
- Returns: Promise resolving to array of group display names

## Error Handling
The service implements custom error types:
- AuthenticationError: For authentication-related failures
- UserNotFoundError: When requested user doesn't exist
- GraphAPIError: For Microsoft Graph API issues
- ConfigurationError: For missing/invalid configuration

## Internal Methods

### `getAccessToken(): Promise<string>`
- Acquires access token using client credentials
- Used internally for Graph API operations

### `initializeGraphClient(): Promise<void>`
- Initializes Microsoft Graph client
- Sets up authentication provider with access token

### `mapGraphUserToUser(graphUser: GraphUser): User`
- Maps Microsoft Graph user object to internal User type
- Standardizes user object structure

## Dependencies
- @microsoft/microsoft-graph-client: For Graph API operations
- @azure/msal-node: For Azure AD authentication
- Custom TokenCache implementation for token management
- Custom logger implementation for operation logging

## Security Considerations
- Implements secure token handling
- Uses client credentials flow for application-level access
- Supports token refresh for maintaining access
- Implements proper error handling and logging
- Requires secure storage of Azure AD credentials

## Environment Configuration
Required environment variables:
```
AZURE_AD_CLIENT_ID=your_client_id
AZURE_AD_CLIENT_SECRET=your_client_secret
AZURE_AD_TENANT_ID=your_tenant_id
AZURE_AD_REDIRECT_URI=your_redirect_uri
