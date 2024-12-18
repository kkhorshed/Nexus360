import { useState, useCallback } from 'react';
import { User } from '../types';

export function useSorting() {
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof User>('displayName');

  const handleRequestSort = useCallback((property: keyof User) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }, [order, orderBy]);

  const sortUsers = useCallback((users: User[]) => {
    return [...users].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if (!aValue || !bValue) return 0;

      const comparison = aValue < bValue ? -1 : 1;
      return order === 'desc' ? -comparison : comparison;
    });
  }, [order, orderBy]);

  return {
    order,
    orderBy,
    handleRequestSort,
    sortUsers,
  };
}
