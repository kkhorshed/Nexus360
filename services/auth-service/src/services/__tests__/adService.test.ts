import { ADService } from '../adService';
import { TokenCache } from '../tokenCache';
import { AuthenticationError, GraphAPIError, UserNotFoundError } from '../../errors/customErrors';
import { Client } from '@microsoft/microsoft-graph-client';
import { ConfidentialClientApplication, AuthenticationResult } from '@azure/msal-node';
import { config } from '../../config';
import { logger } from '../../utils/logger';

// Mock dependencies
jest.mock('@microsoft/microsoft-graph-client');
jest.mock('@azure/msal-node');
jest.mock('../tokenCache');
jest.mock('../../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn()
  }
}));

describe('ADService', () => {
  let adService: ADService;
  let mockMsalClient: jest.Mocked<ConfidentialClientApplication>;
  let mockGraphClient: jest.Mocked<typeof Client>;

  const createMockAuthResult = (overrides = {}): AuthenticationResult => ({
    authority: 'https://login.microsoftonline.com/test-tenant',
    uniqueId: 'test-unique-id',
    tenantId: 'test-tenant-id',
    scopes: ['user.read'],
    account: {
      homeAccountId: 'test-account-id',
      environment: 'login.microsoftonline.com',
      tenantId: 'test-tenant-id',
      username: 'test@example.com',
      localAccountId: 'test-local-id'
    },
    idToken: 'test-id-token',
    idTokenClaims: {},
    accessToken: 'test-access-token',
    fromCache: false,
    expiresOn: new Date(Date.now() + 3600000),
    correlationId: 'test-correlation-id',
    extExpiresOn: new Date(Date.now() + 7200000),
    tokenType: 'Bearer',
    ...overrides
  });

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock MSAL client
    mockMsalClient = {
      getAuthCodeUrl: jest.fn(),
      acquireTokenByCode: jest.fn(),
      acquireTokenSilent: jest.fn(),
      acquireTokenByClientCredential: jest.fn()
    } as unknown as jest.Mocked<ConfidentialClientApplication>;

    (ConfidentialClientApplication as jest.Mock).mockImplementation(() => mockMsalClient);

    // Mock Graph client
    mockGraphClient = {
      init: jest.fn().mockReturnValue({
        api: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        filter: jest.fn().mockReturnThis(),
        top: jest.fn().mockReturnThis(),
        get: jest.fn()
      })
    } as unknown as jest.Mocked<typeof Client>;

    (Client as unknown as jest.Mock).mockImplementation(() => mockGraphClient);

    adService = new ADService();
  });

  describe('getAuthUrl', () => {
    it('should generate auth URL successfully', async () => {
      const mockAuthUrl = 'https://login.microsoftonline.com/test';
      mockMsalClient.getAuthCodeUrl.mockResolvedValue(mockAuthUrl);

      const result = await adService.getAuthUrl();

      expect(result).toBe(mockAuthUrl);
      expect(mockMsalClient.getAuthCodeUrl).toHaveBeenCalledWith(expect.objectContaining({
        scopes: expect.arrayContaining(['user.read', 'directory.read.all', 'groupmember.read.all']),
        redirectUri: expect.any(String)
      }));
      expect(logger.info).toHaveBeenCalled();
    });

    it('should throw AuthenticationError on failure', async () => {
      mockMsalClient.getAuthCodeUrl.mockRejectedValue(new Error('Failed to generate URL'));

      await expect(adService.getAuthUrl()).rejects.toThrow(AuthenticationError);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('handleCallback', () => {
    const mockCode = 'test-auth-code';

    it('should handle callback successfully', async () => {
      const mockTokenResponse = createMockAuthResult();
      mockMsalClient.acquireTokenByCode.mockResolvedValue(mockTokenResponse);

      const result = await adService.handleCallback(mockCode);

      expect(result).toBe(mockTokenResponse.accessToken);
      expect(mockMsalClient.acquireTokenByCode).toHaveBeenCalledWith(
        expect.objectContaining({
          code: mockCode,
          scopes: expect.any(Array)
        })
      );
      expect(logger.info).toHaveBeenCalled();
    });

    it('should throw AuthenticationError when no access token received', async () => {
      // Create a mock response without an access token
      const mockTokenResponse = {
        ...createMockAuthResult(),
        accessToken: undefined as unknown as string // Force TypeScript to accept undefined
      };
      
      mockMsalClient.acquireTokenByCode.mockResolvedValue(mockTokenResponse);

      await expect(adService.handleCallback(mockCode)).rejects.toThrow(AuthenticationError);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('getCurrentUser', () => {
    const mockAccessToken = 'test-access-token';
    const mockUser = {
      id: 'test-id',
      displayName: 'Test User',
      mail: 'test@example.com',
      jobTitle: 'Developer',
      department: 'IT',
      officeLocation: 'HQ',
      userPrincipalName: 'test@example.com'
    };

    it('should fetch current user successfully', async () => {
      const mockGraphClientInstance = {
        api: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValue(mockUser)
      };

      (Client.init as jest.Mock).mockReturnValue(mockGraphClientInstance);

      const result = await adService.getCurrentUser(mockAccessToken);

      expect(result).toEqual({
        id: mockUser.id,
        displayName: mockUser.displayName,
        email: mockUser.mail,
        jobTitle: mockUser.jobTitle,
        department: mockUser.department,
        officeLocation: mockUser.officeLocation,
        userPrincipalName: mockUser.userPrincipalName
      });
    });

    it('should throw GraphAPIError on failure', async () => {
      const mockGraphClientInstance = {
        api: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        get: jest.fn().mockRejectedValue(new Error('API Error'))
      };

      (Client.init as jest.Mock).mockReturnValue(mockGraphClientInstance);

      await expect(adService.getCurrentUser(mockAccessToken)).rejects.toThrow(GraphAPIError);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    const mockUserId = 'test-user-id';
    const mockUser = {
      id: mockUserId,
      displayName: 'Test User',
      mail: 'test@example.com',
      jobTitle: 'Developer',
      department: 'IT',
      officeLocation: 'HQ',
      userPrincipalName: 'test@example.com'
    };

    it('should fetch user by ID successfully', async () => {
      const mockGraphClientInstance = {
        api: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValue(mockUser)
      };

      (Client.init as jest.Mock).mockReturnValue(mockGraphClientInstance);
      mockMsalClient.acquireTokenByClientCredential.mockResolvedValue(createMockAuthResult());

      const result = await adService.getUserById(mockUserId);

      expect(result).toEqual({
        id: mockUser.id,
        displayName: mockUser.displayName,
        email: mockUser.mail,
        jobTitle: mockUser.jobTitle,
        department: mockUser.department,
        officeLocation: mockUser.officeLocation,
        userPrincipalName: mockUser.userPrincipalName
      });
    });

    it('should throw UserNotFoundError when user does not exist', async () => {
      const mockGraphClientInstance = {
        api: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        get: jest.fn().mockRejectedValue(new Error('User not found'))
      };

      (Client.init as jest.Mock).mockReturnValue(mockGraphClientInstance);
      mockMsalClient.acquireTokenByClientCredential.mockResolvedValue(createMockAuthResult());

      await expect(adService.getUserById(mockUserId)).rejects.toThrow(UserNotFoundError);
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
