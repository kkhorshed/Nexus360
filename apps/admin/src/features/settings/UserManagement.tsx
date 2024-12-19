import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import PageWrapper, { PageSection } from '../../components/common/PageWrapper';

interface User {
  id: string;
  email: string;
  display_name: string;
  department?: string;
  job_title?: string;
  is_active: boolean;
}

interface Application {
  id: number;
  name: string;
  display_name: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedApp, setSelectedApp] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchApplications();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/auth/applications');
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const fetchRoles = async (appId: string) => {
    try {
      const response = await fetch(`/api/auth/applications/${appId}/roles`);
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/auth/users/search?query=${searchQuery}`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (userId: string) => {
    try {
      await fetch(`/api/auth/users/${userId}/sync`, { method: 'POST' });
      await fetchUsers();
    } catch (error) {
      console.error('Error syncing user:', error);
    }
  };

  const handleStatusToggle = async (userId: string, currentStatus: boolean) => {
    try {
      const endpoint = currentStatus ? 'deactivate' : 'reactivate';
      await fetch(`/api/auth/users/${userId}/${endpoint}`, { method: 'POST' });
      await fetchUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const handleAppChange = (event: SelectChangeEvent) => {
    setSelectedApp(event.target.value);
    setSelectedRole('');
    if (event.target.value) {
      fetchRoles(event.target.value);
    } else {
      setRoles([]);
    }
  };

  const handleRoleChange = (event: SelectChangeEvent) => {
    setSelectedRole(event.target.value);
  };

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedApp || !selectedRole) return;

    try {
      await fetch(`/api/auth/users/${selectedUser.id}/roles/${selectedRole}`, {
        method: 'POST',
      });
      setDialogOpen(false);
      await fetchUsers();
    } catch (error) {
      console.error('Error assigning role:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageWrapper
      title="User Management"
      description="Manage users and their permissions"
      breadcrumbs={[
        { text: 'Settings', href: '/settings' },
        { text: 'User Management' }
      ]}
    >
      <PageSection>
        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <TextField
            label="Search Users"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            sx={{ flexGrow: 1 }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            startIcon={<RefreshIcon />}
          >
            Refresh
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.display_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.department || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.is_active ? 'Active' : 'Inactive'}
                          color={user.is_active ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleSync(user.id)}
                          title="Sync with Azure AD"
                        >
                          <RefreshIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            setSelectedUser(user);
                            setDialogOpen(true);
                          }}
                          title="Manage Permissions"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleStatusToggle(user.id, user.is_active)}
                          title={user.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {user.is_active ? <BlockIcon /> : <CheckCircleIcon />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </TableContainer>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>
            Manage Permissions - {selectedUser?.display_name}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Application</InputLabel>
                <Select value={selectedApp} onChange={handleAppChange}>
                  <MenuItem value="">
                    <em>Select an application</em>
                  </MenuItem>
                  {applications.map((app) => (
                    <MenuItem key={app.id} value={app.id}>
                      {app.display_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={selectedRole}
                  onChange={handleRoleChange}
                  disabled={!selectedApp}
                >
                  <MenuItem value="">
                    <em>Select a role</em>
                  </MenuItem>
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleAssignRole}
              variant="contained"
              disabled={!selectedApp || !selectedRole}
            >
              Assign Role
            </Button>
          </DialogActions>
        </Dialog>
      </PageSection>
    </PageWrapper>
  );
};

export default UserManagement;
