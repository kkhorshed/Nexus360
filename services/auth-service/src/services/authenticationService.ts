import { 
  ConfidentialClientApplication, 
  AuthorizationCodeRequest,
  Configuration,
  AuthorizationUrlRequest,
  AccountInfo
} from '@azure/msal-node';
import { logger } from '../utils/logger';
import { TokenCache } from './tokenCache';
import { config } from '../config';
import { 
  AuthenticationError,
  ConfigurationError 
} from '../errors/customErrors';

export class AuthenticationService {
  private msalClient: ConfidentialClientApplication;
  private tokenCache: TokenCache;
  private redirectUri: string;
  private readonly scopes = ['user.read', 'directory.read.all', 'groupmember.read.all', 'offline_access'];

  constructor() {
    this.redirectUri = process.env.AZURE_AD_REDIRECT_URI || 'http://localhost:3001/api/auth/callback';
    this.tokenCache = new TokenCache();
    
    const { clientId, clientSecret, tenantId } = config.azure;

    if (!clientId || !clientSecret || !tenantId) {
      logger.error('Missing Azure AD configuration:', { clientId: !!clientId, clientSecret: !!clientSecret, tenantId: !!tenantId });
      throw new ConfigurationError('Missing required Azure AD configuration');
    }

    const msalConfig: Configuration = {
      auth: {
        clientId,
        clientSecret,
        authority: `https://login.microsoftonline.com/${tenantId}`,
        knownAuthorities: [`login.microsoftonline.com`]
      },
      system: {
        loggerOptions: {
          loggerCallback(loglevel: any, message: string) {
            logger.info(message);
          },
          piiLoggingEnabled: false,
          logLevel: 3
        }
      }
    };

    this.msalClient = new ConfidentialClientApplication(msalConfig);
  }

  getRedirectUri(): string {
    return this.redirectUri;
  }

  async getAuthUrl(): Promise<string> {
    try {
      logger.info(`Using redirect URI: ${this.redirectUri}`);
      
      const authCodeUrlParameters: AuthorizationUrlRequest = {
        scopes: this.scopes,
        redirectUri: this.redirectUri,
        prompt: 'select_account',
        responseMode: 'query'
      };

      return await this.msalClient.getAuthCodeUrl(authCodeUrlParameters);
    } catch (error) {
      logger.error('Error generating auth URL:', error);
      throw new AuthenticationError('Failed to generate authentication URL');
    }
  }

  async handleCallback(code: string): Promise<string> {
    try {
      logger.info('Processing auth callback with code');
      
      const tokenRequest: AuthorizationCodeRequest = {
        code,
        scopes: this.scopes,
        redirectUri: this.redirectUri
      };

      const response = await this.msalClient.acquireTokenByCode(tokenRequest);
      if (!response?.accessToken) {
        throw new AuthenticationError('No access token received');
      }

      if (response.account?.homeAccountId) {
        await this.tokenCache.setToken(response.account.homeAccountId, {
          accessToken: response.accessToken,
          expiresAt: response.expiresOn?.getTime() || Date.now() + 3600 * 1000
        });
      }

      return response.accessToken;
    } catch (error) {
      logger.error('Error handling auth callback:', error);
      throw new AuthenticationError('Authentication failed during callback');
    }
  }

  async refreshToken(userId: string): Promise<string> {
    try {
      const cachedToken = await this.tokenCache.getToken(userId);
      if (!cachedToken) {
        throw new AuthenticationError('No token found to refresh');
      }

      const account: AccountInfo = {
        homeAccountId: userId,
        environment: 'login.microsoftonline.com',
        tenantId: config.azure.tenantId || '',
        username: userId,
        localAccountId: userId
      };

      const response = await this.msalClient.acquireTokenSilent({
        account,
        scopes: this.scopes
      });

      if (!response?.accessToken) {
        throw new AuthenticationError('Failed to refresh token');
      }

      await this.tokenCache.setToken(userId, {
        accessToken: response.accessToken,
        expiresAt: response.expiresOn?.getTime() || Date.now() + 3600 * 1000
      });

      return response.accessToken;
    } catch (error) {
      logger.error('Error refreshing token:', error);
      throw new AuthenticationError('Failed to refresh authentication token');
    }
  }

  async getClientCredentialsToken(): Promise<string> {
    try {
      logger.info('Acquiring client credentials token...');
      const result = await this.msalClient.acquireTokenByClientCredential({
        scopes: ['https://graph.microsoft.com/.default']
      });

      if (!result?.accessToken) {
        throw new AuthenticationError('Failed to acquire access token');
      }

      logger.info('Access token acquired successfully');
      return result.accessToken;
    } catch (error) {
      logger.error('Error acquiring access token:', error);
      throw new AuthenticationError('Failed to acquire access token');
    }
  }
}
