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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import BusinessIcon from '@mui/icons-material/Business';
import RightDrawer from '../../components/common/RightDrawer';
import CompanyForm from './CompanyForm';
import CompanyCard from './CompanyCard';
import ViewToggle from '../../components/common/ViewToggle';
import PageWrapper from '../../components/common/PageWrapper';

export default function Companies() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any>(null);
  const [view, setView] = useState<'table' | 'card'>('table');

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddClick = () => {
    setEditingCompany(null);
    setDrawerOpen(true);
  };

  const handleEditClick = (company: any) => {
    setEditingCompany(company);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setEditingCompany(null);
  };

  const handleSubmit = async (data: any) => {
    // TODO: Implement company creation/update logic
    console.log('Form submitted:', data);
    handleDrawerClose();
  };

  // Dummy data for demonstration
  const companies = [
    { 
      id: 1, 
      name: 'Acme Inc', 
      industry: 'Technology',
      companyType: 'Corporation',
      website: 'www.acme.com',
      phone: '123-456-7890',
      email: 'contact@acme.com'
    },
    { 
      id: 2, 
      name: 'Tech Corp', 
      industry: 'Manufacturing',
      companyType: 'LLC',
      website: 'www.techcorp.com',
      phone: '098-765-4321',
      email: 'info@techcorp.com'
    },
  ];

  const renderTableView = () => (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company Name</TableCell>
              <TableCell>Industry</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Website</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((company) => (
                <TableRow key={company.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BusinessIcon color="action" />
                      {company.name}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={company.industry} size="small" />
                  </TableCell>
                  <TableCell>{company.companyType}</TableCell>
                  <TableCell>
                    <Box>
                      {company.email}<br />
                      {company.phone}
                    </Box>
                  </TableCell>
                  <TableCell>{company.website}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleEditClick(company)}
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
        count={companies.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );

  const renderCardView = () => (
    <Grid container spacing={2}>
      {companies
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((company) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={company.id}>
            <CompanyCard
              company={company}
              onEdit={handleEditClick}
            />
          </Grid>
        ))}
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 2 }}>
        <TablePagination
          rowsPerPageOptions={[8, 16, 24]}
          component="div"
          count={companies.length}
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
      title="Companies"
      description="Manage your companies"
      actions={
        <Box sx={{ display: 'flex', gap: 2 }}>
          <ViewToggle view={view} onViewChange={setView} />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
          >
            Add Company
          </Button>
        </Box>
      }
    >
      {view === 'table' ? renderTableView() : renderCardView()}

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
