import { useState, useMemo } from 'react';
import { Lead, LeadFormData } from './types';
import { initialLeads } from './data/mockData';
import { FilterCondition, applyFilters } from '../../components/common/DataFilter';

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formDrawerOpen, setFormDrawerOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
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

  const handleSubmit = async (formData: LeadFormData) => {
    if (editingLead) {
      // Update existing lead
      const updatedLeads = leads.map(lead => 
        lead.id === editingLead.id ? { ...lead, ...formData } : lead
      );
      setLeads(updatedLeads);
    } else {
      // Add new lead
      const newLead: Lead = {
        ...formData,
        id: Math.max(...leads.map(l => l.id)) + 1
      };
      setLeads([...leads, newLead]);
    }
    handleFormClose();
  };

  const handleFilterChange = (newFilters: Record<string, unknown>) => {
    const conditions: FilterCondition[] = Object.entries(newFilters).map(([field, value]) => ({
      field,
      operator: 'contains',
      value: String(value)
    }));
    setActiveConditions(conditions);
    setPage(0);
  };

  return {
    leads: filteredLeads,
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
  };
};
