import { TokenCache } from '../tokenCache';

describe('TokenCache', () => {
  let tokenCache: TokenCache;
  const mockUserId = 'test-user-id';
  const mockTokenInfo = {
    accessToken: 'test-access-token',
    refreshToken: 'test-refresh-token',
    expiresAt: Date.now() + 3600000 // 1 hour from now
  };

  beforeEach(() => {
    tokenCache = new TokenCache();
  });

  describe('setToken', () => {
    it('should store token information', async () => {
      await tokenCache.setToken(mockUserId, mockTokenInfo);
      const storedToken = await tokenCache.getToken(mockUserId);
      expect(storedToken).toEqual(mockTokenInfo);
    });

    it('should update existing token information', async () => {
      await tokenCache.setToken(mockUserId, mockTokenInfo);
      const newTokenInfo = {
        ...mockTokenInfo,
        accessToken: 'new-access-token'
      };
      await tokenCache.setToken(mockUserId, newTokenInfo);
      const storedToken = await tokenCache.getToken(mockUserId);
      expect(storedToken).toEqual(newTokenInfo);
    });
  });

  describe('getToken', () => {
    it('should return null for non-existent token', async () => {
      const token = await tokenCache.getToken('non-existent-user');
      expect(token).toBeNull();
    });

    it('should return null for expired token', async () => {
      const expiredTokenInfo = {
        ...mockTokenInfo,
        expiresAt: Date.now() - 1000 // Expired 1 second ago
      };
      await tokenCache.setToken(mockUserId, expiredTokenInfo);
      const token = await tokenCache.getToken(mockUserId);
      expect(token).toBeNull();
    });

    it('should return valid token', async () => {
      await tokenCache.setToken(mockUserId, mockTokenInfo);
      const token = await tokenCache.getToken(mockUserId);
      expect(token).toEqual(mockTokenInfo);
    });
  });

  describe('deleteToken', () => {
    it('should remove token from cache', async () => {
      await tokenCache.setToken(mockUserId, mockTokenInfo);
      await tokenCache.deleteToken(mockUserId);
      const token = await tokenCache.getToken(mockUserId);
      expect(token).toBeNull();
    });

    it('should not throw error when deleting non-existent token', async () => {
      await expect(tokenCache.deleteToken('non-existent-user')).resolves.not.toThrow();
    });
  });

  describe('clear', () => {
    it('should remove all tokens from cache', async () => {
      const userId1 = 'user1';
      const userId2 = 'user2';
      
      await tokenCache.setToken(userId1, mockTokenInfo);
      await tokenCache.setToken(userId2, mockTokenInfo);
      await tokenCache.clear();
      
      const token1 = await tokenCache.getToken(userId1);
      const token2 = await tokenCache.getToken(userId2);
      
      expect(token1).toBeNull();
      expect(token2).toBeNull();
    });
  });

  describe('needsRefresh', () => {
    it('should return true for non-existent token', async () => {
      const needsRefresh = await tokenCache.needsRefresh('non-existent-user');
      expect(needsRefresh).toBe(true);
    });

    it('should return true for token expiring soon', async () => {
      const expiringTokenInfo = {
        ...mockTokenInfo,
        expiresAt: Date.now() + 60000 // Expires in 1 minute
      };
      await tokenCache.setToken(mockUserId, expiringTokenInfo);
      const needsRefresh = await tokenCache.needsRefresh(mockUserId);
      expect(needsRefresh).toBe(true);
    });

    it('should return false for valid token not expiring soon', async () => {
      const validTokenInfo = {
        ...mockTokenInfo,
        expiresAt: Date.now() + 3600000 // Expires in 1 hour
      };
      await tokenCache.setToken(mockUserId, validTokenInfo);
      const needsRefresh = await tokenCache.needsRefresh(mockUserId);
      expect(needsRefresh).toBe(false);
    });
  });
});
