import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Search as SearchIcon,
  ViewList as TableIcon,
  ViewModule as GridIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  Key as KeyIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { DataTable } from '@nexus360/ui';
import PageWrapper from '../../components/common/PageWrapper';
import DataFilter, { FilterOption } from '../../components/common/DataFilter';
import { useUsers } from './hooks';
import { useAuth } from '../auth/hooks';
import { User, Column, AppPermission } from './types';
import ManageUserPermissionsDialog from './ManageUserPermissionsDialog';

const filterOptions: FilterOption[] = [
  {
    field: 'department',
    label: 'Department',
    type: 'select',
    options: [
      { value: 'Engineering', label: 'Engineering' },
      { value: 'Sales', label: 'Sales' },
      { value: 'Marketing', label: 'Marketing' },
      { value: 'HR', label: 'HR' }
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

const columns: Column<User>[] = [
  {
    key: 'displayName',
    title: 'Name',
    width: 170,
    render: (value, user) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar sx={{ width: 32, height: 32 }}>
          {user.displayName.charAt(0)}
        </Avatar>
        {value}
      </Box>
    )
  },
  {
    key: 'userPrincipalName',
    title: 'Email',
    width: 200
  },
  {
    key: 'department',
    title: 'Department',
    width: 130
  },
  {
    key: 'jobTitle',
    title: 'Job Title',
    width: 130
  },
  {
    key: 'roles',
    title: 'Roles',
    width: 170,
    render: (roles: string[]) => (
      <Box>
        {roles.map((role) => (
          <Chip
            key={role}
            label={role}
            size="small"
            sx={{ mr: 0.5, mb: 0.5 }}
          />
        ))}
      </Box>
    )
  },
  {
    key: 'appPermissions',
    title: 'Apps',
    width: 170,
    render: (permissions: AppPermission[]) => (
      <Box>
        {permissions
          .filter((p: AppPermission) => p.hasAccess)
          .map((p: AppPermission) => (
            <Chip
              key={p.appId}
              label={p.appName}
              size="small"
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          ))}
      </Box>
    )
  },
  {
    key: 'status',
    title: 'Status',
    width: 100,
    align: 'center',
    render: (status: string) => (
      <Chip
        label={status}
        color={status === 'active' ? 'success' : 'error'}
        size="small"
      />
    )
  }
];

const Users: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const {
    users,
    totalUsers,
    loading,
    viewState,
    updateUserPermissions,
    handleFilterChange,
    handleSortChange,
    handlePageChange,
    handlePageSizeChange,
    handleViewChange,
    searchUsers,
    fetchUsers
  } = useUsers();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    searchUsers(value);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setSelectedUser(user);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setSelectedUser(null);
    setAnchorEl(null);
  };

  const handleManagePermissions = () => {
    setPermissionsDialogOpen(true);
    handleMenuClose();
  };

  const handlePermissionsDialogClose = () => {
    setPermissionsDialogOpen(false);
    setSelectedUser(null);
  };

  const handlePermissionsSave = async (
    userId: string,
    roles: string[],
    appPermissions: AppPermission[]
  ) => {
    await updateUserPermissions(userId, roles, appPermissions);
  };

  const renderGridView = () => (
    <Grid container spacing={2}>
      {users.map((user) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ width: 40, height: 40, mr: 1 }}>
                  {user.displayName.charAt(0)}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ fontWeight: 500 }}>{user.displayName}</Box>
                  <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                    {user.jobTitle}
                  </Box>
                </Box>
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuOpen(e, user)}
                >
                  <MoreIcon />
                </IconButton>
              </Box>
              <Box sx={{ mb: 1 }}>
                <Box sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                  Email
                </Box>
                {user.userPrincipalName}
              </Box>
              <Box sx={{ mb: 1 }}>
                <Box sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                  Department
                </Box>
                {user.department || 'N/A'}
              </Box>
              <Box sx={{ mb: 1 }}>
                <Box sx={{ color: 'text.secondary', fontSize: '0.75rem', mb: 0.5 }}>
                  Roles
                </Box>
                {user.roles.map((role) => (
                  <Chip
                    key={role}
                    label={role}
                    size="small"
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                ))}
              </Box>
              <Box sx={{ mb: 1 }}>
                <Box sx={{ color: 'text.secondary', fontSize: '0.75rem', mb: 0.5 }}>
                  Apps
                </Box>
                {user.appPermissions
                  .filter((p: AppPermission) => p.hasAccess)
                  .map((p: AppPermission) => (
                    <Chip
                      key={p.appId}
                      label={p.appName}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Chip
                  label={user.status}
                  color={user.status === 'active' ? 'success' : 'error'}
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <PageWrapper
      title="Users"
      description="Manage user accounts and permissions"
      actions={
        <>
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
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={fetchUsers}
            disabled={loading}
          >
            Fetch Users
          </Button>
        </>
      }
    >
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

      {viewState.view === 'table' ? (
        <DataTable
          columns={columns}
          data={users}
          loading={loading}
          onRowClick={(user) => handleMenuOpen(null as any, user)}
          pagination={{
            current: viewState.pagination.page + 1,
            pageSize: viewState.pagination.pageSize,
            total: totalUsers,
            onChange: (page, pageSize) => {
              handlePageChange(page - 1);
              handlePageSizeChange(pageSize);
            }
          }}
        />
      ) : (
        renderGridView()
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleManagePermissions}>
          <ListItemIcon>
            <KeyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Manage Permissions</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <BlockIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Disable Account</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      <ManageUserPermissionsDialog
        open={permissionsDialogOpen}
        user={selectedUser}
        onClose={handlePermissionsDialogClose}
        onSave={handlePermissionsSave}
      />
    </PageWrapper>
  );
};

export default Users;
