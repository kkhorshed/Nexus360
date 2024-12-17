import { useState, useMemo } from 'react';
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
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import RightDrawer from '../../components/common/RightDrawer';
import LeadForm from './LeadForm';
import LeadCard from './LeadCard';
import PageWrapper from '../../components/common/PageWrapper';
import { DataFilter, FilterState, FilterCondition, applyFilters } from '../../components/common/DataFilter';
import { Lead } from './types';

type ViewType = 'table' | 'card';

const columns = [
  { id: 'firstName', label: 'First Name', numeric: false },
  { id: 'lastName', label: 'Last Name', numeric: false },
  { id: 'email', label: 'Email', numeric: false },
  { id: 'phone', label: 'Phone', numeric: false },
  { id: 'company', label: 'Company', numeric: false },
  { id: 'source', label: 'Source', numeric: false },
  { id: 'status', label: 'Status', numeric: false },
];

// Sample data
const initialLeads: Lead[] = [
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
  // ... rest of the sample data
];

export default function Leads() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formDrawerOpen, setFormDrawerOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [view, setView] = useState<ViewType>('table');
  const [leads] = useState<Lead[]>(initialLeads);
  const [filters, setFilters] = useState<FilterState>({});
  const [activeConditions, setActiveConditions] = useState<FilterCondition[]>([]);

  const filteredLeads = useMemo(() => {
    return applyFilters(leads, activeConditions, (lead, field) => {
      const value = lead[field as keyof Lead];
      return value !== undefined ? String(value) : '';
    });
  }, [leads, activeConditions]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddClick = () => {
    setEditingLead(null);
    setFormDrawerOpen(true);
  };

  const handleEditClick = (lead: Lead) => {
    setEditingLead(lead);
    setFormDrawerOpen(true);
  };

  const handleFormClose = () => {
    setFormDrawerOpen(false);
    setEditingLead(null);
  };

  const handleSubmit = async (data: Partial<Lead>) => {
    // TODO: Implement lead creation/update logic
    console.log('Form submitted:', data);
    handleFormClose();
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(0);
    setFilterDrawerOpen(false);
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

  const getSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case 'website':
        return '🌐';
      case 'referral':
        return '👥';
      case 'trade show':
        return '🎪';
      case 'linkedin':
        return '💼';
      case 'email campaign':
        return '📧';
      case 'cold call':
        return '📞';
      case 'partner':
        return '🤝';
      case 'webinar':
        return '🎥';
      default:
        return '📌';
    }
  };

  const renderTableView = () => (
    <Paper 
      elevation={2}
      sx={{
        transition: 'box-shadow 0.2s ease-in-out',
        '&:hover': {
          boxShadow: (theme) => theme.shadows[4],
        },
      }}
    >
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
            {filteredLeads
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((lead: Lead) => (
                <TableRow 
                  key={lead.id}
                  sx={{
                    transition: 'background-color 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {getInitials(`${lead.firstName} ${lead.lastName}`)}
                      </Avatar>
                      <Typography>
                        {`${lead.firstName} ${lead.lastName}`}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{lead.email}</Typography>
                      <Typography variant="body2" color="text.secondary">{lead.phone}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{lead.company}</TableCell>
                  <TableCell>
                    <Chip 
                      icon={<Typography sx={{ fontSize: '1.2rem', mr: -1 }}>{getSourceIcon(lead.source)}</Typography>}
                      label={lead.source} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={lead.status}
                      size="small"
                      color={getStatusColor(lead.status)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit lead">
                      <IconButton
                        size="small"
                        onClick={() => handleEditClick(lead)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredLeads.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );

  const renderCardView = () => (
    <Grid container spacing={3}>
      {filteredLeads
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((lead: Lead) => (
          <Grid item xs={12} sm={6} md={4} key={lead.id}>
            <Paper 
              elevation={2}
              sx={{
                height: '100%',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => theme.shadows[8],
                },
              }}
            >
              <LeadCard
                lead={lead}
                onEdit={handleEditClick}
              />
            </Paper>
          </Grid>
        ))}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <TablePagination
            rowsPerPageOptions={[8, 16, 24]}
            component="div"
            count={filteredLeads.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Grid>
    </Grid>
  );

  return (
    <PageWrapper
      title="Leads"
      description="Track and manage your sales leads through their lifecycle"
      actions={
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Filter leads">
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setFilterDrawerOpen(true)}
              color={Object.keys(filters).length > 0 ? "primary" : "inherit"}
            >
              Filters {Object.keys(filters).length > 0 && `(${Object.keys(filters).length})`}
            </Button>
          </Tooltip>
          <Tooltip title={view === 'table' ? 'Switch to card view' : 'Switch to table view'}>
            <Button
              variant="outlined"
              onClick={() => setView(view === 'table' ? 'card' : 'table')}
            >
              {view === 'table' ? <ViewModuleIcon /> : <ViewListIcon />}
            </Button>
          </Tooltip>
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
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        title="Filter Leads"
      >
        <DataFilter
          currentFilters={filters}
          onFilterLoad={handleFilterChange}
          columns={columns}
          data={leads}
          storageKey="leadTableFilters"
        />
      </RightDrawer>

      <RightDrawer
        open={formDrawerOpen}
        onClose={handleFormClose}
        title={editingLead ? 'Edit Lead' : 'Add Lead'}
      >
        <LeadForm
          initialData={editingLead}
          onSubmit={handleSubmit}
          onCancel={handleFormClose}
        />
      </RightDrawer>
    </PageWrapper>
  );
}
