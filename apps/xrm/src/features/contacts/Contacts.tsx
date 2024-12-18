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
  Tooltip,
  SelectChangeEvent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import RightDrawer from '../../components/common/RightDrawer';
import PageWrapper from '../../components/common/PageWrapper';
import { DataFilter, Column } from '../../components/common/DataFilter';
import { ContactCard, ContactForm } from './components';
import { useContacts } from './hooks';
import { getInitials } from './utils/helpers';
import { Contact } from './types';
import { ROWS_PER_PAGE_OPTIONS, CARD_VIEW_ROWS_PER_PAGE_OPTIONS, TABLE_COLUMNS } from './constants';
import { mockCompanies } from '../companies/data/mockData';

export default function Contacts() {
  const {
    page,
    rowsPerPage,
    drawerOpen,
    editingContact,
    view,
    contacts,
    filters,
    filterDrawerOpen,
    paginatedContacts,
    handleChangePage,
    handleChangeRowsPerPage,
    handleAddClick,
    handleEditClick,
    handleDrawerClose,
    handleSubmit,
    handleFilterDrawerToggle,
    handleFilterLoad,
    setView
  } = useContacts();

  const renderTableView = () => (
    <Paper elevation={2}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {TABLE_COLUMNS.map((column) => (
                <TableCell key={column.id} align={column.align}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedContacts.map((contact: Contact) => (
              <TableRow 
                key={contact.id}
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
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
                <TableCell>{contact.company?.name || ''}</TableCell>
                <TableCell>{contact.position}</TableCell>
                <TableCell>{contact.status}</TableCell>
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
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        component="div"
        count={contacts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={(event) => {
          handleChangeRowsPerPage({
            target: { value: event.target.value }
          } as SelectChangeEvent<number>);
        }}
      />
    </Paper>
  );

  const renderCardView = () => (
    <Grid container spacing={3}>
      {paginatedContacts.map((contact: Contact) => (
        <Grid item xs={12} sm={6} md={4} key={contact.id}>
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
            <ContactCard
              contact={contact}
              onEdit={handleEditClick}
            />
          </Paper>
        </Grid>
      ))}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <TablePagination
            rowsPerPageOptions={CARD_VIEW_ROWS_PER_PAGE_OPTIONS}
            component="div"
            count={contacts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={(event) => {
              handleChangeRowsPerPage({
                target: { value: event.target.value }
              } as SelectChangeEvent<number>);
            }}
          />
        </Box>
      </Grid>
    </Grid>
  );

  return (
    <PageWrapper
      title="Contacts"
      description="Manage your contacts"
      actions={
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Filter contacts">
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
        open={filterDrawerOpen}
        onClose={handleFilterDrawerToggle}
        title="Filter Contacts"
      >
        <DataFilter
          currentFilters={filters}
          onFilterLoad={handleFilterLoad}
          columns={TABLE_COLUMNS as Column[]}
          data={contacts}
          storageKey="contacts-filters"
        />
      </RightDrawer>

      <RightDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        title={editingContact ? 'Edit Contact' : 'Add Contact'}
      >
        <ContactForm
          initialData={editingContact}
          onSubmit={handleSubmit}
          onCancel={handleDrawerClose}
          companies={mockCompanies}
        />
      </RightDrawer>
    </PageWrapper>
  );
}
