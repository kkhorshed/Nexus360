import { useState } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { Company, Order, VisibleColumns } from './types';
import { FilterState, FilterCondition } from '../../components/common/DataFilter';

export function useSorting(defaultOrderBy: keyof Company = 'name') {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Company>(defaultOrderBy);

  const handleRequestSort = (property: keyof Company) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortCompanies = (companies: Company[]) => {
    return [...companies].sort((a, b) => {
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
    sortCompanies,
  };
}

export function useFiltering() {
  const [filters, setFilters] = useState<FilterState>({});

  const handleFilterLoad = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const getFilterConditions = (filterState: FilterState): FilterCondition[] => {
    return Object.entries(filterState).map(([field, value]) => ({
      field,
      operator: 'contains',
      value,
    }));
  };

  const filterCompanies = (companies: Company[]) => {
    const filterConditions = getFilterConditions(filters);
    
    if (filterConditions.length === 0) return companies;

    return companies.filter(company => 
      filterConditions.every(condition => {
        const fieldValue = String(company[condition.field as keyof Company] || '').toLowerCase();
        const searchValue = String(condition.value).toLowerCase();
        return fieldValue.includes(searchValue);
      })
    );
  };

  return {
    filters,
    handleFilterLoad,
    filterCompanies,
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

export function useCompaniesView() {
  const [view, setView] = useState<'table' | 'card'>('table');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const handleAddClick = () => {
    setEditingCompany(null);
    setDrawerOpen(true);
  };

  const handleEditClick = (company: Company) => {
    setEditingCompany(company);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setEditingCompany(null);
  };

  return {
    view,
    setView,
    drawerOpen,
    editingCompany,
    handleAddClick,
    handleEditClick,
    handleDrawerClose,
  };
}

export function useColumnVisibility() {
  const [visibleColumns, setVisibleColumns] = useState<VisibleColumns>({
    name: true,
    industry: true,
    companyType: true,
    email: true,
    phone: true,
    website: true,
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
