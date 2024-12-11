interface TokenInfo {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

interface CacheEntry {
  userId: string;
  tokenInfo: TokenInfo;
}

export class TokenCache {
  private cache: Map<string, TokenInfo>;
  private readonly DEFAULT_EXPIRY = 3600; // 1 hour in seconds

  constructor() {
    this.cache = new Map<string, TokenInfo>();
  }

  async getToken(userId: string): Promise<TokenInfo | null> {
    const tokenInfo = this.cache.get(userId);
    
    if (!tokenInfo) {
      return null;
    }

    // Check if token is expired
    if (Date.now() >= tokenInfo.expiresAt) {
      this.cache.delete(userId);
      return null;
    }

    return tokenInfo;
  }

  async setToken(userId: string, tokenInfo: Partial<TokenInfo> & { accessToken: string }): Promise<void> {
    const expiresAt = Date.now() + (this.DEFAULT_EXPIRY * 1000);
    
    this.cache.set(userId, {
      accessToken: tokenInfo.accessToken,
      refreshToken: tokenInfo.refreshToken,
      expiresAt: tokenInfo.expiresAt || expiresAt
    });
  }

  async deleteToken(userId: string): Promise<void> {
    this.cache.delete(userId);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  // Helper method to check if a token needs refresh (e.g., if it expires in less than 5 minutes)
  async needsRefresh(userId: string): Promise<boolean> {
    const tokenInfo = await this.getToken(userId);
    if (!tokenInfo) {
      return true;
    }

    const REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds
    return Date.now() + REFRESH_THRESHOLD >= tokenInfo.expiresAt;
  }
}
