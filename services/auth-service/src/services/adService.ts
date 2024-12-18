import { Client, GraphRequest } from '@microsoft/microsoft-graph-client';
import { 
  ConfidentialClientApplication, 
  AuthorizationCodeRequest,
  Configuration,
  AuthorizationUrlRequest,
  AccountInfo
} from '@azure/msal-node';
import { User, GraphUser } from '../types/user';
import { logger } from '../utils/logger';
import { TokenCache } from './tokenCache';
import config from '../config';
import { 
  AuthenticationError, 
  UserNotFoundError, 
  GraphAPIError, 
  ConfigurationError 
} from '../errors/customErrors';

interface GraphResponse {
  value: GraphUser[];
  '@odata.nextLink'?: string;
}

export class ADService {
  private graphClient: Client | null = null;
  private msalClient: ConfidentialClientApplication;
  private tokenCache: TokenCache;
  private redirectUri: string;

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
        scopes: ['User.Read', 'User.Read.All', 'Directory.Read.All', 'GroupMember.Read.All', 'offline_access'],
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
        scopes: ['User.Read', 'User.Read.All', 'Directory.Read.All', 'GroupMember.Read.All', 'offline_access'],
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
        tenantId: config.azure.tenantId || '',
        username: userId,
        localAccountId: userId
      };

      const response = await this.msalClient.acquireTokenSilent({
        account,
        scopes: ['User.Read', 'User.Read.All', 'Directory.Read.All', 'GroupMember.Read.All']
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

  private async getUserProfilePictureUrl(userId: string): Promise<string | null> {
    try {
      if (!this.graphClient) {
        await this.initializeGraphClient();
      }

      // Try to get the photo metadata first to check if a photo exists
      await this.graphClient!.api(`/users/${userId}/photo`).get();
      
      // If we get here, the photo exists, so return the URL
      return `https://graph.microsoft.com/v1.0/users/${userId}/photo/$value`;
    } catch (error) {
      logger.info(`No profile picture found for user ${userId}`);
      return null;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      if (!this.graphClient) {
        await this.initializeGraphClient();
      }

      logger.info('Starting to fetch all users from Azure AD...');
      const allUsers: User[] = [];
      let nextLink: string | null = '/users';

      // Fetch users with pagination
      while (nextLink) {
        logger.info(`Fetching users page: ${nextLink}`);
        const response: GraphResponse = await this.graphClient!.api(nextLink)
          .select('id,displayName,mail,jobTitle,department,officeLocation,userPrincipalName')
          .filter('accountEnabled eq true')
          .orderby('displayName')
          .get();

        // Map and add users from current page
        const usersWithPhotos = await Promise.all(
          response.value.map(async (user: GraphUser) => {
            const profilePictureUrl = await this.getUserProfilePictureUrl(user.id);
            return this.mapGraphUserToUser(user, profilePictureUrl);
          })
        );
        allUsers.push(...usersWithPhotos);

        // Check if there are more pages
        nextLink = response['@odata.nextLink'] || null;
        if (nextLink) {
          // Extract the relative path from the full URL
          nextLink = new URL(nextLink).pathname + new URL(nextLink).search;
        }

        logger.info(`Fetched ${allUsers.length} users so far...`);
      }

      logger.info(`Completed fetching all users. Total count: ${allUsers.length}`);
      return allUsers;
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

      const profilePictureUrl = await this.getUserProfilePictureUrl(userId);
      return this.mapGraphUserToUser(user, profilePictureUrl);
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

      const profilePictureUrl = await this.getUserProfilePictureUrl(user.id);
      return this.mapGraphUserToUser(user, profilePictureUrl);
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

      const response: GraphResponse = await this.graphClient!.api('/users')
        .filter(`startswith(displayName,'${query}') or startswith(mail,'${query}')`)
        .select('id,displayName,mail,jobTitle,department,officeLocation,userPrincipalName')
        .orderby('displayName')
        .get();

      return await Promise.all(
        response.value.map(async (user: GraphUser) => {
          const profilePictureUrl = await this.getUserProfilePictureUrl(user.id);
          return this.mapGraphUserToUser(user, profilePictureUrl);
        })
      );
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

  private mapGraphUserToUser(graphUser: GraphUser, profilePictureUrl: string | null): User {
    return {
      id: graphUser.id,
      displayName: graphUser.displayName,
      email: graphUser.mail,
      jobTitle: graphUser.jobTitle,
      department: graphUser.department,
      officeLocation: graphUser.officeLocation,
      userPrincipalName: graphUser.userPrincipalName,
      profilePictureUrl
    };
  }
}
