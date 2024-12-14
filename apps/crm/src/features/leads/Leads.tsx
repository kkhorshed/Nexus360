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
import RightDrawer from '../../components/common/RightDrawer';
import LeadForm from './LeadForm';
import LeadCard from './LeadCard';
import ViewToggle from '../../components/common/ViewToggle';
import PageWrapper from '../../components/common/PageWrapper';

interface Lead {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
}

export default function Leads() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [view, setView] = useState<'table' | 'card'>('table');

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddClick = () => {
    setEditingLead(null);
    setDrawerOpen(true);
  };

  const handleEditClick = (lead: Lead) => {
    setEditingLead(lead);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setEditingLead(null);
  };

  const handleSubmit = async (data: any) => {
    // TODO: Implement lead creation/update logic
    console.log('Form submitted:', data);
    handleDrawerClose();
  };

  const getStatusColor = (status: Lead['status']): 'info' | 'warning' | 'success' | 'error' => {
    switch (status) {
      case 'New':
        return 'info';
      case 'Contacted':
      case 'Qualified':
        return 'warning';
      case 'Proposal':
      case 'Negotiation':
        return 'info';
      case 'Won':
        return 'success';
      case 'Lost':
        return 'error';
      default:
        return 'info';
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
  const leads: Lead[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      company: 'Acme Inc',
      source: 'Website',
      status: 'New'
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      phone: '098-765-4321',
      company: 'Tech Corp',
      source: 'Referral',
      status: 'Qualified'
    },
  ];

  const renderTableView = () => (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leads
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar>
                        {getInitials(`${lead.firstName} ${lead.lastName}`)}
                      </Avatar>
                      {`${lead.firstName} ${lead.lastName}`}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      {lead.email}<br />
                      {lead.phone}
                    </Box>
                  </TableCell>
                  <TableCell>{lead.company}</TableCell>
                  <TableCell>
                    <Chip label={lead.source} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={lead.status}
                      size="small"
                      color={getStatusColor(lead.status)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleEditClick(lead)}
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
        count={leads.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );

  const renderCardView = () => (
    <Grid container spacing={2}>
      {leads
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((lead) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={lead.id}>
            <LeadCard
              lead={lead}
              onEdit={handleEditClick}
            />
          </Grid>
        ))}
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 2 }}>
        <TablePagination
          rowsPerPageOptions={[8, 16, 24]}
          component="div"
          count={leads.length}
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
      title="Leads"
      description="Manage your leads"
      actions={
        <Box sx={{ display: 'flex', gap: 2 }}>
          <ViewToggle view={view} onViewChange={setView} />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
          >
            Add Lead
          </Button>
        </Box>
      }
    >
      {view === 'table' ? renderTableView() : renderCardView()}

      <RightDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        title={editingLead ? 'Edit Lead' : 'Add Lead'}
      >
        <LeadForm
          initialData={editingLead}
          onSubmit={handleSubmit}
          onCancel={handleDrawerClose}
        />
      </RightDrawer>
    </PageWrapper>
  );
}
