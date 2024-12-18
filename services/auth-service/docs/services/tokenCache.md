# TokenCache Documentation

## Overview
The TokenCache class provides an in-memory caching mechanism for managing Azure AD access tokens. It handles token storage, retrieval, expiration, and refresh management.

## Features
- In-memory token storage using Map
- Automatic token expiration handling
- Refresh token management
- Token validity checking
- Cache clearing capabilities

## Class Structure

### Interfaces

#### TokenInfo
```typescript
interface TokenInfo {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}
```
- `accessToken`: The Azure AD access token
- `refreshToken`: Optional refresh token for token renewal
- `expiresAt`: Timestamp when the token expires

#### CacheEntry
```typescript
interface CacheEntry {
  userId: string;
  tokenInfo: TokenInfo;
}
```
- `userId`: Unique identifier for the user
- `tokenInfo`: Associated token information

## Methods

### Constructor
```typescript
constructor()
```
- Initializes a new Map for token storage
- Sets default token expiry to 1 hour (3600 seconds)

### `getToken(userId: string): Promise<TokenInfo | null>`
- Retrieves token information for a specific user
- Parameters:
  - `userId`: User's unique identifier
- Returns:
  - TokenInfo if valid token exists
  - null if token doesn't exist or is expired
- Automatically removes expired tokens from cache

### `setToken(userId: string, tokenInfo: Partial<TokenInfo> & { accessToken: string }): Promise<void>`
- Stores token information for a user
- Parameters:
  - `userId`: User's unique identifier
  - `tokenInfo`: Token information object
    - Must include `accessToken`
    - Optional `refreshToken` and `expiresAt`
- Uses default expiry if not specified
- Overwrites existing token if present

### `deleteToken(userId: string): Promise<void>`
- Removes token information for a specific user
- Parameters:
  - `userId`: User's unique identifier

### `clear(): Promise<void>`
- Removes all tokens from the cache
- Used for cleanup or reset operations

### `needsRefresh(userId: string): Promise<boolean>`
- Checks if a token needs refreshing
- Parameters:
  - `userId`: User's unique identifier
- Returns:
  - true if token doesn't exist or expires within 5 minutes
  - false if token is valid and not near expiration
- Uses 5-minute threshold for refresh decisions

## Constants
- `DEFAULT_EXPIRY`: 3600 seconds (1 hour)
- `REFRESH_THRESHOLD`: 300000 milliseconds (5 minutes)

## Usage Example
```typescript
const tokenCache = new TokenCache();

// Store a token
await tokenCache.setToken('user123', {
  accessToken: 'access_token_value',
  refreshToken: 'refresh_token_value',
  expiresAt: Date.now() + 3600000 // 1 hour from now
});

// Retrieve token
const token = await tokenCache.getToken('user123');

// Check if token needs refresh
const needsRefresh = await tokenCache.needsRefresh('user123');

// Delete token
await tokenCache.deleteToken('user123');

// Clear all tokens
await tokenCache.clear();
```

## Security Considerations
- Tokens are stored in memory only
- No persistent storage of sensitive information
- Automatic cleanup of expired tokens
- Token expiration is enforced on retrieval

## Best Practices
1. Regular cache cleanup to prevent memory leaks
2. Check token validity before use
3. Implement refresh logic when `needsRefresh` returns true
4. Clear cache during application shutdown
5. Handle token absence gracefully in application logic

## Integration with ADService
The TokenCache class is designed to work seamlessly with ADService for:
- Storing tokens obtained during authentication
- Managing token lifecycle
- Facilitating token refresh operations
- Maintaining session state
