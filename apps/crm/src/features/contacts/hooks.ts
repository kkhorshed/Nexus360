import { useState } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { Contact, Order, VisibleColumns } from './types';
import { FilterState, FilterCondition } from '../../components/common/DataFilter';
import { mockContacts } from './data/mockData';

export function useSorting(defaultOrderBy: keyof Contact = 'lastName') {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Contact>(defaultOrderBy);

  const handleRequestSort = (property: keyof Contact) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortContacts = (contacts: Contact[]) => {
    return [...contacts].sort((a, b) => {
      const aValue = String(a[orderBy] || '');
      const bValue = String(b[orderBy] || '');
      
      if (order === 'desc') {
        return bValue.localeCompare(aValue);
      }
      return aValue.localeCompare(bValue);
    });
  };

  return {
    order,
    orderBy,
    handleRequestSort,
    sortContacts,
  };
}

export function useFiltering() {
  const [filters, setFilters] = useState<FilterState>({});
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const handleFilterLoad = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleFilterDrawerToggle = () => {
    setFilterDrawerOpen(!filterDrawerOpen);
  };

  const getFilterConditions = (filterState: FilterState): FilterCondition[] => {
    return Object.entries(filterState).map(([field, value]) => ({
      field,
      operator: 'contains',
      value,
    }));
  };

  const filterContacts = (contacts: Contact[]) => {
    const filterConditions = getFilterConditions(filters);
    
    if (filterConditions.length === 0) return contacts;

    return contacts.filter(contact => 
      filterConditions.every(condition => {
        const fieldValue = String(contact[condition.field as keyof Contact] || '').toLowerCase();
        const searchValue = String(condition.value).toLowerCase();
        return fieldValue.includes(searchValue);
      })
    );
  };

  return {
    filters,
    filterDrawerOpen,
    handleFilterLoad,
    handleFilterDrawerToggle,
    filterContacts,
  };
}

export function usePagination(defaultRowsPerPage = 10) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: SelectChangeEvent<number>) => {
    setRowsPerPage(parseInt(event.target.value.toString(), 10));
    setPage(0);
  };

  return {
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
  };
}

export function useContactsView() {
  const [view, setView] = useState<'table' | 'card'>('table');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const handleAddClick = () => {
    setEditingContact(null);
    setDrawerOpen(true);
  };

  const handleEditClick = (contact: Contact) => {
    setEditingContact(contact);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setEditingContact(null);
  };

  return {
    view,
    setView,
    drawerOpen,
    editingContact,
    handleAddClick,
    handleEditClick,
    handleDrawerClose,
  };
}

export function useColumnVisibility() {
  const [visibleColumns, setVisibleColumns] = useState<VisibleColumns>({
    firstName: true,
    lastName: true,
    email: true,
    phone: true,
    company: true,
    position: true,
    status: true,
  });

  const toggleColumn = (column: keyof VisibleColumns) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const updateVisibleColumns = (columns: VisibleColumns) => {
    setVisibleColumns(columns);
  };

  return {
    visibleColumns,
    toggleColumn,
    updateVisibleColumns,
  };
}

export function useContacts() {
  const sorting = useSorting();
  const filtering = useFiltering();
  const pagination = usePagination();
  const contactsView = useContactsView();
  const columnVisibility = useColumnVisibility();

  const contacts = mockContacts;
  const filteredContacts = filtering.filterContacts(contacts);
  const sortedContacts = sorting.sortContacts(filteredContacts);
  const paginatedContacts = sortedContacts.slice(
    pagination.page * pagination.rowsPerPage,
    pagination.page * pagination.rowsPerPage + pagination.rowsPerPage
  );

  const handleSubmit = async (data: Partial<Contact>) => {
    // TODO: Implement contact creation/update logic
    console.log('Form submitted:', data);
    contactsView.handleDrawerClose();
  };

  return {
    ...sorting,
    ...filtering,
    ...pagination,
    ...contactsView,
    ...columnVisibility,
    contacts: sortedContacts,
    paginatedContacts,
    handleSubmit,
  };
}
