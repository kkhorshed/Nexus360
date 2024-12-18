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
import { useState } from 'react';
import RightDrawer from '../../components/common/RightDrawer';
import { DataFilter } from '../../components/common/DataFilter';
import PageWrapper from '../../components/common/PageWrapper';
import { LeadCard, LeadForm } from './components';
import { TABLE_COLUMNS } from './constants';
import { useLeads } from './hooks';
import { getInitials, getStatusColor, getSourceIcon } from './utils/helpers';
import { Lead } from './types';
import { initialLeads } from './data/mockData';

type ViewType = 'table' | 'card';

export default function Leads() {
  const [view, setView] = useState<ViewType>('table');
  const {
    leads,
    page,
    rowsPerPage,
    formDrawerOpen,
    filterDrawerOpen,
    editingLead,
    handleChangePage,
    handleChangeRowsPerPage,
    handleAddClick,
    handleEditClick,
    handleFormClose,
    handleSubmit,
    handleFilterChange,
    setFilterDrawerOpen
  } = useLeads();

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
            {leads
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
        count={leads.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );

  const renderCardView = () => (
    <Grid container spacing={3}>
      {leads
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
            count={leads.length}
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
              color={leads.length < initialLeads.length ? "primary" : "inherit"}
            >
              Filters {leads.length < initialLeads.length && `(${leads.length}/${initialLeads.length})`}
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
          currentFilters={{}}
          onFilterLoad={handleFilterChange}
          columns={TABLE_COLUMNS}
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
