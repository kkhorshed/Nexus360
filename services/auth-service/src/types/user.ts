export interface User {
  id: string;
  displayName: string;
  email: string | null;
  jobTitle: string | null;
  department: string | null;
  officeLocation: string | null;
  userPrincipalName: string;
}

export interface GraphUser {
  id: string;
  displayName: string;
  mail: string | null;
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
