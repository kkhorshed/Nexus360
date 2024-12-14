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
  Avatar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import RightDrawer from '../../../components/common/RightDrawer';
import PageWrapper from '../../../components/common/PageWrapper';

interface TeamMember {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: string;
}

export default function TeamManagement() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddClick = () => {
    setEditingMember(null);
    setDrawerOpen(true);
  };

  const handleEditClick = (member: TeamMember) => {
    setEditingMember(member);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setEditingMember(null);
  };

  const handleSubmit = async (data: any) => {
    // TODO: Implement team member creation/update logic
    console.log('Form submitted:', data);
    handleDrawerClose();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  // Dummy data for demonstration
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      role: 'Manager',
      department: 'Sales'
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      role: 'Team Lead',
      department: 'Marketing'
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
              <TableCell>Department</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teamMembers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar>
                        {getInitials(`${member.firstName} ${member.lastName}`)}
                      </Avatar>
                      {`${member.firstName} ${member.lastName}`}
                    </Box>
                  </TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>{member.department}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleEditClick(member)}
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
        count={teamMembers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );

  return (
    <PageWrapper
      title="Team Management"
      description="Manage your team members and their roles"
      actions={
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Add Team Member
        </Button>
      }
    >
      {renderTableView()}

      <RightDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        title={editingMember ? 'Edit Team Member' : 'Add Team Member'}
      >
        {/* TODO: Implement TeamMemberForm component */}
        <Box p={2}>Team Member Form Placeholder</Box>
      </RightDrawer>
    </PageWrapper>
  );
}
