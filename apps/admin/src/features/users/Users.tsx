import React, { useState, useMemo } from 'react';
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  Paper,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  ViewList as TableIcon,
  ViewModule as GridIcon,
  Sync as SyncIcon,
} from '@mui/icons-material';
import PageWrapper from '../../components/common/PageWrapper';
import DataFilter, { FilterOption } from '../../components/common/DataFilter';
import { useUsers } from './hooks';
import { useColumnVisibility } from './hooks/useColumnVisibility';
import { useSorting } from './hooks/useSorting';
import { useAuth } from '../auth/hooks';
import { UserTable, ColumnPicker, UserStats } from './components';

const filterOptions: FilterOption[] = [
  {
    field: 'department',
    label: 'Department',
    type: 'select',
    options: [
      { value: 'Engineering', label: 'Engineering' },
      { value: 'Sales', label: 'Sales' },
      { value: 'Marketing', label: 'Marketing' },
      { value: 'HR', label: 'HR' },
      { value: 'Product', label: 'Product' },
      { value: 'IT', label: 'IT' },
      { value: 'Design', label: 'Design' }
    ]
  },
  {
    field: 'status',
    label: 'Status',
    type: 'radio',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' }
    ]
  }
];

const Users: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const {
    users,
    allUsers,
    totalUsers,
    loading,
    viewState,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    handleViewChange,
    searchUsers,
    syncUsers
  } = useUsers();

  const { visibleColumns, toggleColumn } = useColumnVisibility();
  const { order, orderBy, handleRequestSort, sortUsers } = useSorting();

  const [searchTerm, setSearchTerm] = useState('');
  const [syncLoading, setSyncLoading] = useState(false);

  const lastSyncTime = useMemo(() => {
    if (!allUsers.length) return undefined;
    return allUsers
      .map(user => user.lastSyncAt)
      .filter(Boolean)
      .sort((a, b) => new Date(b!).getTime() - new Date(a!).getTime())[0];
  }, [allUsers]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    searchUsers(value);
  };

  const handleSyncUsers = async () => {
    setSyncLoading(true);
    try {
      await syncUsers();
    } finally {
      setSyncLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const sortedUsers = sortUsers(users);

  return (
    <PageWrapper
      title="Users"
      description="View user accounts and permissions"
      actions={
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <DataFilter
            options={filterOptions}
            activeFilters={viewState.filters}
            onFilterChange={handleFilterChange}
          />
          <Button
            variant="outlined"
            startIcon={viewState.view === 'table' ? <GridIcon /> : <TableIcon />}
            onClick={() => handleViewChange(viewState.view === 'table' ? 'grid' : 'table')}
          >
            {viewState.view === 'table' ? 'Grid View' : 'Table View'}
          </Button>
          {viewState.view === 'table' && (
            <ColumnPicker
              visibleColumns={visibleColumns}
              onColumnToggle={toggleColumn}
            />
          )}
          <Tooltip title="Sync users from Azure AD">
            <Button
              variant="contained"
              startIcon={syncLoading ? <CircularProgress size={20} color="inherit" /> : <SyncIcon />}
              onClick={handleSyncUsers}
              disabled={loading || syncLoading}
            >
              {syncLoading ? 'Syncing...' : 'Sync Users'}
            </Button>
          </Tooltip>
        </Box>
      }
    >
      <UserStats 
        users={allUsers}
        isLoading={loading}
        lastSyncTime={lastSyncTime}
      />

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
      </Box>

      <Paper elevation={2}>
        <UserTable
          users={sortedUsers}
          page={viewState.pagination.page}
          rowsPerPage={viewState.pagination.pageSize}
          order={order}
          orderBy={orderBy}
          visibleColumns={visibleColumns}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handlePageSizeChange}
          onRequestSort={handleRequestSort}
          isLoading={loading}
          totalCount={totalUsers}
        />
      </Paper>
    </PageWrapper>
  );
};

export default Users;
