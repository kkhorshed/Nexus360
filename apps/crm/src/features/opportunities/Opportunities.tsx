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
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import TableViewIcon from '@mui/icons-material/TableView';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewKanbanIcon from '@mui/icons-material/ViewColumn';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import RightDrawer from '../../components/common/RightDrawer';
import OpportunityForm from './OpportunityForm';
import OpportunityCard from './OpportunityCard';
import KanbanBoard from './KanbanBoard';
import PageWrapper from '../../components/common/PageWrapper';

interface Opportunity {
  id: number;
  name: string;
  company: string;
  amount: number;
  closeDate: string;
  stage: 'Qualification' | 'Needs Analysis' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  priority: 'High' | 'Medium' | 'Low';
}

type ViewType = 'table' | 'card' | 'kanban';

const initialOpportunities: Opportunity[] = [
  {
    id: 1,
    name: 'Enterprise Software Deal',
    company: 'Acme Inc',
    amount: 50000,
    closeDate: '2024-03-31',
    stage: 'Proposal',
    priority: 'High'
  },
  {
    id: 2,
    name: 'Cloud Services Package',
    company: 'Tech Corp',
    amount: 25000,
    closeDate: '2024-04-15',
    stage: 'Negotiation',
    priority: 'Medium'
  },
  {
    id: 3,
    name: 'Security Solutions',
    company: 'SecureNet',
    amount: 75000,
    closeDate: '2024-05-01',
    stage: 'Qualification',
    priority: 'High'
  },
  {
    id: 4,
    name: 'Data Analytics Platform',
    company: 'DataCo',
    amount: 35000,
    closeDate: '2024-04-30',
    stage: 'Needs Analysis',
    priority: 'Medium'
  }
];

export default function Opportunities() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);
  const [view, setView] = useState<ViewType>('kanban');
  const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities);

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

  const handleSubmit = async (data: any) => {
    // TODO: Implement opportunity creation/update logic
    console.log('Form submitted:', data);
    handleDrawerClose();
  };

  const handleViewChange = (_event: React.MouseEvent<HTMLElement>, newView: ViewType | null) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const handleOpportunityUpdate = (updatedOpportunity: Opportunity) => {
    console.log('Updating opportunity:', updatedOpportunity);
    setOpportunities(prevOpportunities => 
      prevOpportunities.map(opp => 
        opp.id === updatedOpportunity.id ? { ...opp, ...updatedOpportunity } : opp
      )
    );
  };

  const getStageColor = (stage: Opportunity['stage']): 'info' | 'warning' | 'success' | 'error' | 'primary' | 'secondary' => {
    switch (stage) {
      case 'Qualification':
        return 'info';
      case 'Needs Analysis':
        return 'primary';
      case 'Proposal':
        return 'secondary';
      case 'Negotiation':
        return 'warning';
      case 'Closed Won':
        return 'success';
      case 'Closed Lost':
        return 'error';
      default:
        return 'info';
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const renderTableView = () => (
    <Paper>
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
                <TableRow key={opportunity.id}>
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
                    <IconButton
                      size="small"
                      onClick={() => handleEditClick(opportunity)}
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
        count={opportunities.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );

  const renderCardView = () => (
    <Grid container spacing={2}>
      {opportunities
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((opportunity) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={opportunity.id}>
            <OpportunityCard
              opportunity={opportunity}
              onEdit={handleEditClick}
              index={0} // Index is required for drag and drop but not used in card view
            />
          </Grid>
        ))}
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 2 }}>
        <TablePagination
          rowsPerPageOptions={[8, 16, 24]}
          component="div"
          count={opportunities.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
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
        <Box sx={{ display: 'flex', gap: 2 }}>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            size="small"
          >
            <ToggleButton value="table">
              <TableViewIcon />
            </ToggleButton>
            <ToggleButton value="card">
              <ViewModuleIcon />
            </ToggleButton>
            <ToggleButton value="kanban">
              <ViewKanbanIcon />
            </ToggleButton>
          </ToggleButtonGroup>
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
