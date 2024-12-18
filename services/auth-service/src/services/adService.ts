import { Client } from '@microsoft/microsoft-graph-client';
import { 
  ConfidentialClientApplication, 
  AuthorizationCodeRequest,
  Configuration,
  AuthorizationUrlRequest,
  AccountInfo
} from '@azure/msal-node';
import { User, GraphUser } from '../types/user';
import { config } from '../config';
import { logger } from '../utils/logger';
import { TokenCache } from './tokenCache';
import { 
  AuthenticationError, 
  UserNotFoundError, 
  GraphAPIError, 
  ConfigurationError 
} from '../errors/customErrors';

export class ADService {
  private graphClient: Client | null = null;
  private msalClient: ConfidentialClientApplication;
  private tokenCache: TokenCache;
  private redirectUri: string;

  constructor() {
    this.redirectUri = process.env.AZURE_AD_REDIRECT_URI || 'http://localhost:3001/api/auth/callback';
    this.tokenCache = new TokenCache();
    
    if (!config.azure.clientId || !config.azure.clientSecret || !config.azure.tenantId) {
      throw new ConfigurationError('Missing required Azure AD configuration');
    }

    const msalConfig: Configuration = {
      auth: {
        clientId: config.azure.clientId,
        clientSecret: config.azure.clientSecret,
        authority: `https://login.microsoftonline.com/${config.azure.tenantId}`,
        knownAuthorities: [`login.microsoftonline.com`]
      },
      system: {
        loggerOptions: {
          loggerCallback(loglevel: any, message: string) {
            logger.info(message);
          },
          piiLoggingEnabled: false,
          logLevel: 3 // Info
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
        scopes: ['user.read', 'directory.read.all', 'groupmember.read.all', 'offline_access'],
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
        scopes: ['user.read', 'directory.read.all', 'groupmember.read.all', 'offline_access'],
        redirectUri: this.redirectUri
      };

      const response = await this.msalClient.acquireTokenByCode(tokenRequest);
      if (!response?.accessToken) {
        throw new AuthenticationError('No access token received');
      }

      // Cache the token if we have a user identifier
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

      // Create a minimal AccountInfo object for token acquisition
      const account: AccountInfo = {
        homeAccountId: userId,
        environment: 'login.microsoftonline.com',
        tenantId: config.azure.tenantId,
        username: userId,
        localAccountId: userId
      };

      const response = await this.msalClient.acquireTokenSilent({
        account,
        scopes: ['user.read', 'directory.read.all', 'groupmember.read.all']
      });

      if (!response?.accessToken) {
        throw new AuthenticationError('Failed to refresh token');
      }

      // Update the cache with the new token
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

  private async getAccessToken(): Promise<string> {
    try {
      logger.info('Acquiring access token...');
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

  private async initializeGraphClient(): Promise<void> {
    try {
      logger.info('Initializing Graph client...');
      const accessToken = await this.getAccessToken();
      
      this.graphClient = Client.init({
        authProvider: (done) => {
          done(null, accessToken);
        }
      });
      logger.info('Graph client initialized successfully');
    } catch (error) {
      logger.error('Error initializing Graph client:', error);
      throw new GraphAPIError('Failed to initialize Graph client');
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      if (!this.graphClient) {
        await this.initializeGraphClient();
      }

      const response = await this.graphClient!.api('/users')
        .select('id,displayName,mail,jobTitle,department,officeLocation,userPrincipalName')
        .top(999)
        .get();

      return response.value.map((user: GraphUser) => this.mapGraphUserToUser(user));
    } catch (error) {
      logger.error('Error fetching all users:', error);
      throw new GraphAPIError('Failed to fetch users');
    }
  }

  async getUserById(userId: string): Promise<User> {
    try {
      if (!this.graphClient) {
        await this.initializeGraphClient();
      }

      const user = await this.graphClient!.api(`/users/${userId}`)
        .select('id,displayName,mail,jobTitle,department,officeLocation,userPrincipalName')
        .get() as GraphUser;

      return this.mapGraphUserToUser(user);
    } catch (error) {
      logger.error('Error fetching user by ID:', error);
      throw new UserNotFoundError(userId);
    }
  }

  async getCurrentUser(accessToken: string): Promise<User> {
    try {
      const client = Client.init({
        authProvider: (done) => {
          done(null, accessToken);
        }
      });

      const user = await client.api('/me')
        .select('id,displayName,mail,jobTitle,department,officeLocation,userPrincipalName')
        .get() as GraphUser;

      return this.mapGraphUserToUser(user);
    } catch (error) {
      logger.error('Error fetching current user:', error);
      throw new GraphAPIError('Failed to fetch current user');
    }
  }

  async searchUsers(query: string): Promise<User[]> {
    try {
      if (!this.graphClient) {
        await this.initializeGraphClient();
      }

      const response = await this.graphClient!.api('/users')
        .filter(`startswith(displayName,'${query}') or startswith(mail,'${query}')`)
        .select('id,displayName,mail,jobTitle,department,officeLocation,userPrincipalName')
        .top(50)
        .get();

      return response.value.map((user: GraphUser) => this.mapGraphUserToUser(user));
    } catch (error) {
      logger.error('Error searching users:', error);
      throw new GraphAPIError('Failed to search users');
    }
  }

  async getUserGroups(userId: string): Promise<string[]> {
    try {
      if (!this.graphClient) {
        await this.initializeGraphClient();
      }

      const groups = await this.graphClient!.api(`/users/${userId}/memberOf`)
        .select('displayName')
        .get();

      return groups.value.map((group: { displayName: string }) => group.displayName);
    } catch (error) {
      logger.error('Error fetching user groups:', error);
      throw new GraphAPIError('Failed to fetch user groups');
    }
  }

  private mapGraphUserToUser(graphUser: GraphUser): User {
    return {
      id: graphUser.id,
      displayName: graphUser.displayName,
      email: graphUser.mail,
      jobTitle: graphUser.jobTitle,
      department: graphUser.department,
      officeLocation: graphUser.officeLocation,
      userPrincipalName: graphUser.userPrincipalName
    };
  }
}
