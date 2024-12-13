# Auth Service Improvements

## Current Architecture

The auth service implements Azure AD authentication using the Microsoft Identity Platform and provides user management capabilities through the Microsoft Graph API. The service follows an MVC pattern with clear separation of concerns.

### Key Components

1. **Authentication Flow**
   - Azure AD integration
   - OAuth2 authorization code flow
   - Dual support for API and browser-based auth
   - Token management

2. **User Management**
   - User CRUD operations
   - Group membership handling
   - Microsoft Graph API integration

3. **Security Features**
   - Security headers (Helmet)
   - CORS configuration
   - Environment-aware error handling
   - Security event logging

## Recommended Improvements

### 1. Error Handling Enhancements

#### Current State
- Basic error handling with generic error types
- Simple error logging

#### Proposed Changes
- Implement specific error types for different scenarios:
  ```typescript
  class AuthenticationError extends Error {}
  class UserNotFoundError extends Error {}
  class ValidationError extends Error {}
  ```
- Add middleware for handling different error types:
  ```typescript
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AuthenticationError) {
      res.status(401).json({ error: err.message });
    } else if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
    }
    // ... handle other error types
  });
  ```
- Enhance error logging with request context:
  ```typescript
  logger.error('Error occurred', {
    error: err,
    requestId: req.id,
    path: req.path,
    method: req.method
  });
  ```

### 2. Authentication Improvements

#### Current State
- Basic token acquisition
- No token refresh mechanism
- No token caching

#### Proposed Changes
- Implement token refresh:
  ```typescript
  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const tokenRequest = {
      refreshToken,
      scopes: ['user.read', 'directory.read.all']
    };
    return await this.msalClient.acquireTokenByRefreshToken(tokenRequest);
  }
  ```
- Add token caching:
  ```typescript
  class TokenCache {
    private cache: Map<string, TokenInfo>;
    async getToken(userId: string): Promise<TokenInfo | null>;
    async setToken(userId: string, token: TokenInfo): Promise<void>;
  }
  ```
- Add rate limiting:
  ```typescript
  import rateLimit from 'express-rate-limit';
  
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });
  
  app.use('/api/auth', authLimiter);
  ```

### 3. Code Organization

#### Current State
- Configuration mixed in service
- Missing interfaces
- Basic request handling

#### Proposed Changes
- Create dedicated config service:
  ```typescript
  interface IConfigService {
    getAzureConfig(): AzureConfig;
    getCorsConfig(): CorsConfig;
    // ... other config getters
  }
  ```
- Add service interfaces:
  ```typescript
  interface IAuthService {
    getAuthUrl(): Promise<string>;
    handleCallback(code: string): Promise<string>;
    // ... other auth methods
  }
  
  interface IUserService {
    getUser(id: string): Promise<User>;
    searchUsers(params: UserSearchParams): Promise<User[]>;
    // ... other user methods
  }
  ```
- Add request validation middleware:
  ```typescript
  import { validate } from 'class-validator';
  
  const validateRequest = (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
    const errors = await validate(Object.assign(new schema(), req.body));
    if (errors.length > 0) {
      res.status(400).json({ errors });
    } else {
      next();
    }
  };
  ```

### 4. Testing Strategy

#### Current State
- No visible test implementation

#### Proposed Changes
- Add unit tests:
  ```typescript
  describe('ADService', () => {
    describe('getAuthUrl', () => {
      it('should generate correct auth URL with configured parameters');
      it('should handle missing configuration gracefully');
    });
    
    describe('handleCallback', () => {
      it('should exchange code for token successfully');
      it('should handle invalid codes appropriately');
    });
  });
  ```
- Add integration tests:
  ```typescript
  describe('Auth Flow', () => {
    it('should complete full authentication flow');
    it('should handle token refresh');
    it('should manage user session');
  });
  ```
- Add test utilities:
  ```typescript
  const mockGraphClient = {
    api: jest.fn().mockReturnThis(),
    get: jest.fn()
  };
  
  const mockMsalClient = {
    getAuthCodeUrl: jest.fn(),
    acquireTokenByCode: jest.fn()
  };
  ```

## Implementation Priority

1. Error Handling Enhancements
   - Critical for production reliability
   - Immediate impact on debugging capability

2. Testing Implementation
   - Essential for maintaining service quality
   - Enables confident refactoring

3. Authentication Improvements
   - Important for user experience
   - Security enhancement

4. Code Organization
   - Beneficial for long-term maintenance
   - Can be implemented gradually

## Next Steps

1. Create GitHub issues for each improvement area
2. Prioritize based on team capacity and business needs
3. Implement changes in feature branches
4. Review and test changes thoroughly
5. Deploy improvements gradually to minimize risk
