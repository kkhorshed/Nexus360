import { useState } from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PageWrapper, { PageSection } from '@/components/common/PageWrapper';

// Mock data - In a real application, this would come from an API
const mockUsers = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'Sales Rep',
    status: 'Active',
    team: 'Enterprise',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    role: 'Sales Manager',
    status: 'Active',
    team: 'Enterprise',
  },
  {
    id: 3,
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    role: 'Sales Rep',
    status: 'Inactive',
    team: 'SMB',
  },
];

export default function UserManagementPage() {
  const [users, setUsers] = useState(mockUsers);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const handleOpenDialog = (user?: any) => {
    setEditingUser(user || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setEditingUser(null);
    setOpenDialog(false);
  };

  const handleSaveUser = (event: React.FormEvent) => {
    event.preventDefault();
    // In a real application, this would make an API call
    handleCloseDialog();
  };

  const handleDeleteUser = (id: number) => {
    // In a real application, this would make an API call
    setUsers(users.filter(user => user.id !== id));
  };

  const actions = (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={() => handleOpenDialog()}
    >
      Add User
    </Button>
  );

  return (
    <PageWrapper 
      title="User Management"
      description="Manage user access and permissions"
      actions={actions}
    >
      <PageSection>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Team</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.team}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.status} 
                      color={user.status === 'Active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(user)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteUser(user.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </PageSection>

      {/* User Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingUser ? 'Edit User' : 'Add User'}
        </DialogTitle>
        <form onSubmit={handleSaveUser}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  defaultValue={editingUser?.name}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  defaultValue={editingUser?.email}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Role"
                  defaultValue={editingUser?.role || 'Sales Rep'}
                  required
                >
                  <MenuItem value="Sales Rep">Sales Rep</MenuItem>
                  <MenuItem value="Sales Manager">Sales Manager</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Team"
                  defaultValue={editingUser?.team || 'Enterprise'}
                  required
                >
                  <MenuItem value="Enterprise">Enterprise</MenuItem>
                  <MenuItem value="SMB">SMB</MenuItem>
                  <MenuItem value="Mid-Market">Mid-Market</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  defaultValue={editingUser?.status || 'Active'}
                  required
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </PageWrapper>
  );
}
