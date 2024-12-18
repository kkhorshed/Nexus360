export interface User {
  id: string;
  displayName: string;
  email: string | null;
  givenName?: string | null;
  surname?: string | null;
  jobTitle: string | null;
  department: string | null;
  officeLocation: string | null;
  userPrincipalName: string;
  isActive?: boolean;
  lastSyncAt?: Date;
  profilePictureUrl?: string | null;
}

export interface GraphUser {
  id: string;
  displayName: string;
  mail: string | null;
  givenName?: string | null;
  surname?: string | null;
  jobTitle: string | null;
  department: string | null;
  officeLocation: string | null;
  userPrincipalName: string;
}

export interface UserSearchParams {
  query: string;
  limit?: number;
  department?: string;
}

export interface SyncResult {
  total: number;
  updated: number;
  failed: number;
}
