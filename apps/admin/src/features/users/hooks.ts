import { useState, useCallback, useEffect } from 'react';
import { User, UserFilters, UserViewState } from './types';

const AUTH_SERVICE_URL = 'http://localhost:3001';

export const useUsers = () => {
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
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.map((user: any) => ({
        ...user,
        roles: user.roles || [],
        status: 'active' // You might want to determine this based on actual user data
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchUsers = useCallback(async (query: string = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${AUTH_SERVICE_URL}/api/users/search?query=${encodeURIComponent(query)}`,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to search users');
      }

      const data = await response.json();
      setUsers(data.map((user: any) => ({
        ...user,
        roles: user.roles || [],
        status: 'active'
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

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

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users: paginatedUsers,
    totalUsers: filteredUsers.length,
    loading,
    error,
    viewState,
    fetchUsers,
    searchUsers,
    handleFilterChange,
    handleSortChange,
    handlePageChange,
    handlePageSizeChange,
    handleViewChange
  };
};

export const useUserRoles = () => {
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${AUTH_SERVICE_URL}/api/roles`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch roles');
      }

      const data = await response.json();
      setRoles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return { roles, loading, error };
};
