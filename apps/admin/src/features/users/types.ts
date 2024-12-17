export interface User {
  id: string;
  displayName: string;
  userPrincipalName: string;
  jobTitle?: string;
  department?: string;
  mail?: string;
  roles: string[];
  status: 'active' | 'inactive';
  lastLogin?: string;
}

export interface UserFormData {
  displayName: string;
  userPrincipalName: string;
  jobTitle?: string;
  department?: string;
  roles: string[];
}

export interface UserFilters {
  search?: string;
  department?: string;
  role?: string;
  status?: 'active' | 'inactive';
}

export interface Column<T> {
  key: keyof T;
  title: string;
  width?: string | number;
  align?: 'right' | 'left' | 'center';
  render?: (value: any, record: T) => React.ReactNode;
}

export interface UserViewState {
  view: 'table' | 'grid';
  filters: UserFilters;
  sort: {
    field: keyof User;
    direction: 'asc' | 'desc';
  };
  pagination: {
    page: number;
    pageSize: number;
  };
}
