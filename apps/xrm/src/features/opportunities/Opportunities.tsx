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
  Grid,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewKanbanIcon from '@mui/icons-material/ViewColumn';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

import RightDrawer from '../../components/common/RightDrawer';
import PageWrapper from '../../components/common/PageWrapper';
import { DataFilter, FilterState } from '../../components/common/DataFilter';
import { OpportunityCard, OpportunityForm, KanbanBoard } from './components';
import { Opportunity, ViewType } from './types';
import { COLUMNS, ROWS_PER_PAGE_OPTIONS, CARD_VIEW_ROWS_PER_PAGE_OPTIONS } from './constants';
import { formatAmount, formatDate, getStageColor } from './utils/helpers';
import { initialOpportunities } from './data/mockData';

export default function Opportunities() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);
  const [view, setView] = useState<ViewType>('kanban');
  const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities);
  const [filters, setFilters] = useState<FilterState>({});

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddClick = () => {
    setEditingOpportunity(null);
    setDrawerOpen(true);
  };

  const handleEditClick = (opportunity: Opportunity) => {
    setEditingOpportunity(opportunity);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setEditingOpportunity(null);
  };

  const handleSubmit = async (data: Partial<Opportunity>) => {
    // TODO: Implement opportunity creation/update logic
    console.log('Form submitted:', data);
    handleDrawerClose();
  };

  const handleFilterDrawerToggle = () => {
    setFilterDrawerOpen(!filterDrawerOpen);
  };

  const handleFilterLoad = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(0);
    setFilterDrawerOpen(false);
  };

  const handleViewChange = (newView: ViewType) => {
    setView(newView);
  };

  const handleOpportunityUpdate = (updatedOpportunity: Opportunity) => {
    setOpportunities(prevOpportunities => 
      prevOpportunities.map(opp => 
        opp.id === updatedOpportunity.id ? { ...opp, ...updatedOpportunity } : opp
      )
    );
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
              <TableCell>Opportunity</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Close Date</TableCell>
              <TableCell>Stage</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {opportunities
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((opportunity) => (
                <TableRow 
                  key={opportunity.id}
                  sx={{
                    transition: 'background-color 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MonetizationOnIcon color="action" />
                      {opportunity.name}
                    </Box>
                  </TableCell>
                  <TableCell>{opportunity.company}</TableCell>
                  <TableCell>{formatAmount(opportunity.amount)}</TableCell>
                  <TableCell>{formatDate(opportunity.closeDate)}</TableCell>
                  <TableCell>
                    <Chip
                      label={opportunity.stage}
                      size="small"
                      color={getStageColor(opportunity.stage)}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={opportunity.priority}
                      size="small"
                      color={opportunity.priority === 'High' ? 'error' : 
                             opportunity.priority === 'Medium' ? 'warning' : 'info'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit opportunity">
                      <IconButton
                        size="small"
                        onClick={() => handleEditClick(opportunity)}
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
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        component="div"
        count={opportunities.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );

  const renderCardView = () => (
    <Grid container spacing={3}>
      {opportunities
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((opportunity) => (
          <Grid item xs={12} sm={6} md={4} key={opportunity.id}>
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
              <OpportunityCard
                opportunity={opportunity}
                onEdit={handleEditClick}
                index={0}
                columnId="card-view"
              />
            </Paper>
          </Grid>
        ))}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <TablePagination
            rowsPerPageOptions={CARD_VIEW_ROWS_PER_PAGE_OPTIONS}
            component="div"
            count={opportunities.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Grid>
    </Grid>
  );

  const renderKanbanView = () => (
    <KanbanBoard
      opportunities={opportunities}
      onEdit={handleOpportunityUpdate}
    />
  );

  const renderView = () => {
    switch (view) {
      case 'card':
        return renderCardView();
      case 'kanban':
        return renderKanbanView();
      default:
        return renderTableView();
    }
  };

  return (
    <PageWrapper
      title="Opportunities"
      description="Manage your sales opportunities"
      actions={
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Filter opportunities">
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={handleFilterDrawerToggle}
              color={Object.keys(filters).length > 0 ? "primary" : "inherit"}
            >
              Filters {Object.keys(filters).length > 0 && `(${Object.keys(filters).length})`}
            </Button>
          </Tooltip>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Switch to table view">
              <Button
                variant="outlined"
                onClick={() => handleViewChange('table')}
                color={view === 'table' ? "primary" : "inherit"}
              >
                <ViewListIcon />
              </Button>
            </Tooltip>
            <Tooltip title="Switch to card view">
              <Button
                variant="outlined"
                onClick={() => handleViewChange('card')}
                color={view === 'card' ? "primary" : "inherit"}
              >
                <ViewModuleIcon />
              </Button>
            </Tooltip>
            <Tooltip title="Switch to kanban view">
              <Button
                variant="outlined"
                onClick={() => handleViewChange('kanban')}
                color={view === 'kanban' ? "primary" : "inherit"}
              >
                <ViewKanbanIcon />
              </Button>
            </Tooltip>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
          >
            Add Opportunity
          </Button>
        </Box>
      }
    >
      {renderView()}

      <RightDrawer
        open={filterDrawerOpen}
        onClose={handleFilterDrawerToggle}
        title="Filter Opportunities"
      >
        <DataFilter
          currentFilters={filters}
          onFilterLoad={handleFilterLoad}
          columns={COLUMNS}
          data={opportunities}
          storageKey="opportunities-filters"
        />
      </RightDrawer>

      <RightDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        title={editingOpportunity ? 'Edit Opportunity' : 'Add Opportunity'}
      >
        <OpportunityForm
          initialData={editingOpportunity}
          onSubmit={handleSubmit}
          onCancel={handleDrawerClose}
        />
      </RightDrawer>
    </PageWrapper>
  );
}
