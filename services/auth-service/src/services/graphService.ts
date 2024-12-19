import { Client } from '@microsoft/microsoft-graph-client';
import { GraphUser, User } from '../types/user';
import { logger } from '../utils/logger';
import { GraphAPIError, UserNotFoundError } from '../errors/customErrors';
import { AuthenticationService } from './authenticationService';

export class GraphService {
  private graphClient: Client | null = null;
  private authService: AuthenticationService;

  constructor(authService: AuthenticationService) {
    this.authService = authService;
  }

  private async initializeGraphClient(): Promise<void> {
    try {
      logger.info('Initializing Graph client...');
      const accessToken = await this.authService.getClientCredentialsToken();
      
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

  private createAuthenticatedClient(accessToken: string): Client {
    return Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      }
    });
  }

  async getUserProfilePhoto(userId: string): Promise<ArrayBuffer> {
    try {
      if (!this.graphClient) {
        await this.initializeGraphClient();
      }

      // First try to get the photo metadata to confirm it exists and get the supported size
      const metadata = await this.graphClient!.api(`/users/${userId}/photo`)
        .get();

      logger.info('Retrieved photo metadata:', metadata);

      // Get the photo binary data at 120x120 size (good balance of quality and performance)
      const response = await this.graphClient!.api(`/users/${userId}/photos/120x120/$value`)
        .get();

      return response;
    } catch (error: any) {
      logger.error(`Error fetching profile photo for user ${userId}:`, error);
      throw error;
    }
  }

  private async getUserProfilePictureUrl(userId: string): Promise<string | null> {
    try {
      if (!this.graphClient) {
        await this.initializeGraphClient();
      }

      // First try to get the photo metadata to confirm it exists
      await this.graphClient!.api(`/users/${userId}/photo`)
        .get();

      // If we get here, the photo exists and is accessible
      // Return the full URL to our auth service endpoint
      return `http://localhost:3001/api/users/${userId}/photo`;
    } catch (error: any) {
      // Check if the error is specifically about no photo existing
      if (error.statusCode === 404) {
        logger.info(`No profile picture found for user ${userId}`);
        return null;
      }

      // For other errors, log them but still return null to avoid breaking the app
      logger.error(`Error fetching profile picture for user ${userId}:`, error);
      return null;
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

      // Map users and fetch profile pictures in parallel
      const usersWithPhotos = await Promise.all(
        response.value.map(async (user: GraphUser) => {
          const profilePictureUrl = await this.getUserProfilePictureUrl(user.id);
          return this.mapGraphUserToUser(user, profilePictureUrl);
        })
      );

      return usersWithPhotos;
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
      const client = this.createAuthenticatedClient(accessToken);

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

      const response = await this.graphClient!.api('/users')
        .filter(`startswith(displayName,'${query}') or startswith(mail,'${query}')`)
        .select('id,displayName,mail,jobTitle,department,officeLocation,userPrincipalName')
        .top(50)
        .get();

      // Map users and fetch profile pictures in parallel
      const usersWithPhotos = await Promise.all(
        response.value.map(async (user: GraphUser) => {
          const profilePictureUrl = await this.getUserProfilePictureUrl(user.id);
          return this.mapGraphUserToUser(user, profilePictureUrl);
        })
      );

      return usersWithPhotos;
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
