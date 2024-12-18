import { useState, useCallback, useEffect } from 'react';
import { User, UserFilters, UserViewState, AppPermission, SyncResult } from './types';
import { useAuth } from '../auth/hooks';

const AUTH_SERVICE_URL = 'http://localhost:3000';

interface DBUser {
  id: string;
  displayName: string;
  userPrincipalName: string;
  jobTitle: string | null;
  department: string | null;
  officeLocation: string | null;
  email: string;
  isActive: boolean;
  lastSyncAt: string;
  roles?: string[];
  appPermissions?: AppPermission[];
  profilePictureUrl?: string | null;
}

const mapDBUserToUser = (dbUser: DBUser): User => {
  return {
    id: dbUser.id,
    displayName: dbUser.displayName,
    userPrincipalName: dbUser.userPrincipalName || dbUser.email,
    jobTitle: dbUser.jobTitle || undefined,
    department: dbUser.department || undefined,
    officeLocation: dbUser.officeLocation || undefined,
    mail: dbUser.email,
    roles: dbUser.roles || [],
    status: dbUser.isActive ? 'active' : 'inactive',
    lastSyncAt: dbUser.lastSyncAt,
    appPermissions: dbUser.appPermissions || [],
    profilePictureUrl: dbUser.profilePictureUrl || null
  };
};

export const useUsers = () => {
  const { getAuthHeaders, login } = useAuth();
  const [allUsers, setAllUsers] = useState<User[]>([]);
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
      pageSize: 25
    }
  });

  // Automatic periodic sync (every 5 minutes)
  useEffect(() => {
    const syncUsers = async () => {
      try {
        await handleSync();
      } catch (error) {
        console.error('Auto-sync failed:', error);
      }
    };

    syncUsers();
    const intervalId = setInterval(syncUsers, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleSync = async () => {
    setLoading(true);
    setError(null);
    try {
      const syncResponse = await fetch(`${AUTH_SERVICE_URL}/api/users/sync`, {
        method: 'POST',
        mode: 'cors',
        headers: getAuthHeaders()
      });

      if (!syncResponse.ok) {
        if (syncResponse.status === 401) {
          login();
          return;
        }
        const errorData = await syncResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to sync users');
      }

      const syncResult: SyncResult = await syncResponse.json();

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

      const dbUsers: DBUser[] = await response.json();
      const mappedUsers = dbUsers.map(mapDBUserToUser);
      setAllUsers(mappedUsers);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while syncing users';
      setError(errorMessage);
      console.error('Error syncing users:', err);
    } finally {
      setLoading(false);
    }
  };

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

      const dbUsers: DBUser[] = await response.json();
      const mappedUsers = dbUsers.map(mapDBUserToUser);
      setAllUsers(mappedUsers);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while searching users';
      setError(errorMessage);
      console.error('Error searching users:', err);
      setAllUsers([]);
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

      setAllUsers(prev => prev.map(user => 
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
  const filteredUsers = allUsers.filter(user => {
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
    const aValue = a[field] ?? '';  // Use nullish coalescing to handle null/undefined
    const bValue = b[field] ?? '';  // Convert null/undefined to empty string
    
    // Handle special cases for non-string comparisons
    if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
      return direction === 'asc' ? (aValue === bValue ? 0 : aValue ? 1 : -1) : (aValue === bValue ? 0 : aValue ? -1 : 1);
    }

    // Convert to strings for comparison
    const aString = String(aValue).toLowerCase();
    const bString = String(bValue).toLowerCase();
    
    const comparison = aString.localeCompare(bString);
    return direction === 'asc' ? comparison : -comparison;
  });

  // Get total count before pagination
  const totalCount = sortedUsers.length;

  // Apply pagination
  const { page, pageSize } = viewState.pagination;
  const paginatedUsers = sortedUsers.slice(page * pageSize, (page + 1) * pageSize);

  return {
    users: paginatedUsers,
    allUsers, // Expose the full dataset for stats
    totalUsers: totalCount,
    loading,
    error,
    viewState,
    syncUsers: handleSync,
    searchUsers,
    updateUserPermissions,
    handleFilterChange,
    handleSortChange,
    handlePageChange,
    handlePageSizeChange,
    handleViewChange
  };
};
