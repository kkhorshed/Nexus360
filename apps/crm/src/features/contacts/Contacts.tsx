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
  Avatar,
  IconButton,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import RightDrawer from '../../components/common/RightDrawer';
import ContactForm from './ContactForm';
import ContactCard from './ContactCard';
import ViewToggle from '../../components/common/ViewToggle';
import PageWrapper from '../../components/common/PageWrapper';

export default function Contacts() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<any>(null);
  const [view, setView] = useState<'table' | 'card'>('table');

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddClick = () => {
    setEditingContact(null);
    setDrawerOpen(true);
  };

  const handleEditClick = (contact: any) => {
    setEditingContact(contact);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setEditingContact(null);
  };

  const handleSubmit = async (data: any) => {
    // TODO: Implement contact creation/update logic
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
  const contacts = [
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '123-456-7890', company: 'Acme Inc' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', phone: '098-765-4321', company: 'Tech Corp' },
  ];

  const renderTableView = () => (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Company</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar>
                        {getInitials(`${contact.firstName} ${contact.lastName}`)}
                      </Avatar>
                      {`${contact.firstName} ${contact.lastName}`}
                    </Box>
                  </TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell>{contact.company}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleEditClick(contact)}
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
        count={contacts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );

  const renderCardView = () => (
    <Grid container spacing={2}>
      {contacts
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((contact) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={contact.id}>
            <ContactCard
              contact={contact}
              onEdit={handleEditClick}
            />
          </Grid>
        ))}
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 2 }}>
        <TablePagination
          rowsPerPageOptions={[8, 16, 24]}
          component="div"
          count={contacts.length}
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
      title="Contacts"
      description="Manage your contacts"
      actions={
        <Box sx={{ display: 'flex', gap: 2 }}>
          <ViewToggle view={view} onViewChange={setView} />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
          >
            Add Contact
          </Button>
        </Box>
      }
    >
      {view === 'table' ? renderTableView() : renderCardView()}

      <RightDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        title={editingContact ? 'Edit Contact' : 'Add Contact'}
      >
        <ContactForm
          initialData={editingContact}
          onSubmit={handleSubmit}
          onCancel={handleDrawerClose}
        />
      </RightDrawer>
    </PageWrapper>
  );
}
