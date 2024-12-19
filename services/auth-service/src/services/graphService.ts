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
      const client = this.createAuthenticatedClient(accessToken);

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
