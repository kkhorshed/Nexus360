import { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  IconButton,
  Chip,
  Avatar,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import RightDrawer from '../../../components/common/RightDrawer';
import ViewToggle from '../../../components/common/ViewToggle';
import PageWrapper from '../../../components/common/PageWrapper';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Pending';
  lastLogin: string;
}

export default function UserManagement() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [view, setView] = useState<'table' | 'card'>('table');

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddClick = () => {
    setEditingUser(null);
    setDrawerOpen(true);
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = async (data: any) => {
    // TODO: Implement user creation/update logic
    console.log('Form submitted:', data);
    handleDrawerClose();
  };

  const getStatusColor = (status: User['status']): 'success' | 'error' | 'warning' => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'error';
      case 'Pending':
        return 'warning';
      default:
        return 'warning';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  // Dummy data for demonstration
  const users: User[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      role: 'Administrator',
      status: 'Active',
      lastLogin: '2023-12-25 10:30 AM'
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      role: 'User',
      status: 'Pending',
      lastLogin: '2023-12-24 03:45 PM'
    },
  ];

  const renderTableView = () => (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Login</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar>
                        {getInitials(`${user.firstName} ${user.lastName}`)}
                      </Avatar>
                      {`${user.firstName} ${user.lastName}`}
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip label={user.role} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.status}
                      size="small"
                      color={getStatusColor(user.status)}
                    />
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleEditClick(user)}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );

  const renderCardView = () => (
    <Grid container spacing={2}>
      {users
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((user) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 56, height: 56 }}>
                  {getInitials(`${user.firstName} ${user.lastName}`)}
                </Avatar>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ fontWeight: 'bold' }}>{`${user.firstName} ${user.lastName}`}</Box>
                  <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>{user.email}</Box>
                </Box>
                <Chip label={user.role} size="small" sx={{ mt: 1 }} />
                <Chip
                  label={user.status}
                  size="small"
                  color={getStatusColor(user.status)}
                  sx={{ mt: 1 }}
                />
                <Box sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 1 }}>
                  Last Login: {user.lastLogin}
                </Box>
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => handleEditClick(user)}
                  sx={{ mt: 1 }}
                >
                  Edit
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 2 }}>
        <TablePagination
          rowsPerPageOptions={[8, 16, 24]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Grid>
  );

  return (
    <PageWrapper
      title="User Management"
      description="Manage system users and their permissions"
      actions={
        <Box sx={{ display: 'flex', gap: 2 }}>
          <ViewToggle view={view} onViewChange={setView} />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
          >
            Add User
          </Button>
        </Box>
      }
    >
      {view === 'table' ? renderTableView() : renderCardView()}
      <RightDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        title={editingUser ? 'Edit User' : 'Add User'}
      >
        {/* TODO: Implement UserForm component */}
        <Box p={2}>User Form Placeholder</Box>
      </RightDrawer>
    </PageWrapper>
  );
}
