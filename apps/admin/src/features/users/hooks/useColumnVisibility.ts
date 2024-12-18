import { useState, useCallback } from 'react';

const DEFAULT_VISIBLE_COLUMNS = {
  displayName: true,
  userPrincipalName: true,
  department: true,
  jobTitle: true,
  officeLocation: true,
  roles: true,
  appPermissions: true,
  status: true,
  lastSyncAt: true,
  createdAt: true,
  updatedAt: true,
};

export function useColumnVisibility() {
  const [visibleColumns, setVisibleColumns] = useState(DEFAULT_VISIBLE_COLUMNS);

  const toggleColumn = useCallback((columnId: string) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnId]: !prev[columnId as keyof typeof DEFAULT_VISIBLE_COLUMNS],
    }));
  }, []);

  return {
    visibleColumns,
    toggleColumn,
  };
}
