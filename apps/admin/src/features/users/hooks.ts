import { useState, useCallback } from 'react';
import { User, UserFilters, UserViewState, AppPermission } from './types';
import { useAuth } from '../auth/hooks';

const AUTH_SERVICE_URL = 'http://localhost:3000';

interface ADUser {
  id: string;
  displayName: string;
  email: string;
  jobTitle?: string;
  department?: string;
  officeLocation?: string;
  userPrincipalName: string;
}

const mapADUserToUser = async (adUser: ADUser, headers: HeadersInit): Promise<User> => {
  try {
    // Fetch user groups to map to roles
    const groupsResponse = await fetch(
      `${AUTH_SERVICE_URL}/api/users/${adUser.id}/groups`,
      {
        mode: 'cors',
        headers
      }
    );

    if (!groupsResponse.ok) {
      throw new Error('Failed to fetch user groups');
    }

    const groups = await groupsResponse.json();

    return {
      id: adUser.id,
      displayName: adUser.displayName,
      userPrincipalName: adUser.userPrincipalName,
      jobTitle: adUser.jobTitle,
      department: adUser.department,
      mail: adUser.email,
      roles: groups,
      status: 'active',
      appPermissions: []
    };
  } catch (err) {
    console.error('Error mapping AD user:', err);
    // Return user with minimal data if groups fetch fails
    return {
      id: adUser.id,
      displayName: adUser.displayName,
      userPrincipalName: adUser.userPrincipalName,
      jobTitle: adUser.jobTitle,
      department: adUser.department,
      mail: adUser.email,
      roles: [],
      status: 'active',
      appPermissions: []
    };
  }
};

export const useUsers = () => {
  const { getAuthHeaders, login } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewState, setViewState] = useState<UserViewState>({
    view: 'table',
    filters: {},
    sort: {
      field: 'displayName',
      direction: 'asc'
    },
    pagination: {
      page: 0,
      pageSize: 10
    }
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${AUTH_SERVICE_URL}/api/users`, {
        mode: 'cors',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          login();
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch users');
      }

      const adUsers: ADUser[] = await response.json();
      
      // Handle case where Azure AD is not configured
      if (!Array.isArray(adUsers)) {
        setUsers([]);
        return;
      }

      const mappedUsers = await Promise.all(adUsers.map(user => mapADUserToUser(user, getAuthHeaders())));
      setUsers(mappedUsers);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching users';
      setError(errorMessage);
      console.error('Error fetching users:', err);
      // Set empty array on error to prevent UI from breaking
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders, login]);

  const searchUsers = useCallback(async (query: string = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${AUTH_SERVICE_URL}/api/users/search?query=${encodeURIComponent(query)}`,
        {
          mode: 'cors',
          headers: getAuthHeaders()
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          login();
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to search users');
      }

      const adUsers: ADUser[] = await response.json();
      
      // Handle case where Azure AD is not configured
      if (!Array.isArray(adUsers)) {
        setUsers([]);
        return;
      }

      const mappedUsers = await Promise.all(adUsers.map(user => mapADUserToUser(user, getAuthHeaders())));
      setUsers(mappedUsers);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while searching users';
      setError(errorMessage);
      console.error('Error searching users:', err);
      // Set empty array on error to prevent UI from breaking
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders, login]);

  const updateUserPermissions = useCallback(async (
    userId: string,
    roles: string[],
    appPermissions: AppPermission[]
  ) => {
    try {
      const response = await fetch(`${AUTH_SERVICE_URL}/api/users/${userId}/permissions`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roles, appPermissions })
      });

      if (!response.ok) {
        if (response.status === 401) {
          login();
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update user permissions');
      }

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId
          ? { ...user, roles, appPermissions }
          : user
      ));

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while updating permissions';
      console.error('Error updating user permissions:', err);
      throw new Error(errorMessage);
    }
  }, [getAuthHeaders, login]);

  const updateViewState = useCallback((updates: Partial<UserViewState>) => {
    setViewState(prev => ({ ...prev, ...updates }));
  }, []);

  const handleFilterChange = useCallback((filters: UserFilters) => {
    updateViewState({ filters });
  }, [updateViewState]);

  const handleSortChange = useCallback((field: keyof User) => {
    updateViewState({
      sort: {
        field,
        direction: viewState.sort.field === field && viewState.sort.direction === 'asc' 
          ? 'desc' 
          : 'asc'
      }
    });
  }, [viewState.sort, updateViewState]);

  const handlePageChange = useCallback((page: number) => {
    updateViewState({
      pagination: { ...viewState.pagination, page }
    });
  }, [viewState.pagination, updateViewState]);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    updateViewState({
      pagination: { page: 0, pageSize }
    });
  }, [updateViewState]);

  const handleViewChange = useCallback((view: 'table' | 'grid') => {
    updateViewState({ view });
  }, [updateViewState]);

  // Apply filters and sorting to users
  const filteredUsers = users.filter(user => {
    if (!viewState.filters) return true;
    
    const { search, department, role, status } = viewState.filters;
    
    if (search && !user.displayName.toLowerCase().includes(search.toLowerCase()) &&
        !user.userPrincipalName.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    
    if (department && user.department !== department) return false;
    if (role && !user.roles.includes(role)) return false;
    if (status && user.status !== status) return false;
    
    return true;
  });

  // Apply sorting
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const { field, direction } = viewState.sort;
    const aValue = a[field];
    const bValue = b[field];
    
    if (aValue === bValue) return 0;
    if (aValue === undefined) return 1;
    if (bValue === undefined) return -1;
    
    const comparison = aValue < bValue ? -1 : 1;
    return direction === 'asc' ? comparison : -comparison;
  });

  // Apply pagination
  const { page, pageSize } = viewState.pagination;
  const paginatedUsers = sortedUsers.slice(page * pageSize, (page + 1) * pageSize);

  return {
    users: paginatedUsers,
    totalUsers: filteredUsers.length,
    loading,
    error,
    viewState,
    fetchUsers,
    searchUsers,
    updateUserPermissions,
    handleFilterChange,
    handleSortChange,
    handlePageChange,
    handlePageSizeChange,
    handleViewChange
  };
};
