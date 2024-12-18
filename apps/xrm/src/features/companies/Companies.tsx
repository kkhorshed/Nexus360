import { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Paper,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import RightDrawer from '../../components/common/RightDrawer';
import PageWrapper from '../../components/common/PageWrapper';
import { DataFilter } from '../../components/common/DataFilter';
import { 
  CompanyCard,
  CompanyForm,
  CompanyTable,
  ColumnPicker,
  PageControls,
} from './components';
import { Company } from './types';
import { FILTER_COLUMNS } from './constants';
import { mockCompanies } from './data/mockData';
import {
  useSorting,
  useFiltering,
  usePagination,
  useCompaniesView,
  useColumnVisibility,
} from './hooks';

export default function Companies() {
  const [isLoading, setIsLoading] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  
  const {
    view,
    setView,
    drawerOpen,
    editingCompany,
    handleAddClick,
    handleEditClick,
    handleDrawerClose,
  } = useCompaniesView();

  const {
    order,
    orderBy,
    handleRequestSort,
    sortCompanies,
  } = useSorting();

  const {
    filters,
    handleFilterLoad,
    filterCompanies,
  } = useFiltering();

  const {
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
  } = usePagination();

  const {
    visibleColumns,
    toggleColumn,
  } = useColumnVisibility();

  const handleFilterDrawerToggle = () => {
    setFilterDrawerOpen(!filterDrawerOpen);
  };

  const handleSubmit = async (data: Partial<Company>) => {
    try {
      setIsLoading(true);
      // TODO: Implement company creation/update logic
      console.log('Form submitted:', data);
      handleDrawerClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters and sorting
  const filteredCompanies = filterCompanies(mockCompanies);
  const sortedCompanies = sortCompanies(filteredCompanies);

  const renderCardView = () => (
    <Grid container spacing={3}>
      {sortedCompanies
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((company) => (
          <Grid item xs={12} sm={6} md={4} key={company.id}>
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
              <CompanyCard
                company={company}
                onEdit={handleEditClick}
              />
            </Paper>
          </Grid>
        ))}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <PageControls
            count={sortedCompanies.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Grid>
    </Grid>
  );

  return (
    <PageWrapper
      title="Companies"
      description="Manage your companies"
      actions={
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Filter companies">
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={handleFilterDrawerToggle}
              color={Object.keys(filters).length > 0 ? "primary" : "inherit"}
            >
              Filters {Object.keys(filters).length > 0 && `(${Object.keys(filters).length})`}
            </Button>
          </Tooltip>
          <Tooltip title={view === 'card' ? 'Switch to table view' : 'Switch to card view'}>
            <Button
              variant="outlined"
              onClick={() => setView(view === 'card' ? 'table' : 'card')}
            >
              {view === 'card' ? <ViewListIcon /> : <ViewModuleIcon />}
            </Button>
          </Tooltip>
          {view === 'table' && (
            <ColumnPicker
              visibleColumns={visibleColumns}
              onColumnToggle={toggleColumn}
            />
          )}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
            disabled={isLoading}
          >
            Add Company
          </Button>
        </Box>
      }
    >
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : view === 'table' ? (
        <Paper elevation={2}>
          <CompanyTable
            companies={sortedCompanies}
            onEdit={handleEditClick}
            page={page}
            rowsPerPage={rowsPerPage}
            order={order}
            orderBy={orderBy}
            visibleColumns={visibleColumns}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            onRequestSort={handleRequestSort}
          />
        </Paper>
      ) : (
        renderCardView()
      )}

      <RightDrawer
        open={filterDrawerOpen}
        onClose={handleFilterDrawerToggle}
        title="Filter Companies"
      >
        <DataFilter
          currentFilters={filters}
          onFilterLoad={handleFilterLoad}
          columns={FILTER_COLUMNS}
          data={mockCompanies}
          storageKey="companies-filters"
        />
      </RightDrawer>

      <RightDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        title={editingCompany ? 'Edit Company' : 'Add Company'}
      >
        <CompanyForm
          initialData={editingCompany}
          onSubmit={handleSubmit}
          onCancel={handleDrawerClose}
        />
      </RightDrawer>
    </PageWrapper>
  );
}
