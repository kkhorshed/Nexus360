import { SelectChangeEvent } from '@mui/material';
import { Company } from '../companies/types';

export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyId: number;
  company?: Company;
  position: string;
  status: string;
}

export interface ContactFormProps {
  initialData?: Partial<Contact> | null;
  onSubmit: (data: Partial<Contact>) => Promise<void>;
  onCancel: () => void;
}

export interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
}

export type Order = 'asc' | 'desc';

export interface HeadCell {
  id: keyof VisibleColumns;
  label: string;
  sortable?: boolean;
}

export type VisibleColumns = {
  firstName: boolean;
  lastName: boolean;
  email: boolean;
  phone: boolean;
  company: boolean;
  position: boolean;
  status: boolean;
};

export interface ContactTableProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  page: number;
  rowsPerPage: number;
  order: Order;
  orderBy: keyof Contact;
  visibleColumns: VisibleColumns;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: SelectChangeEvent<number>) => void;
  onRequestSort: (property: keyof VisibleColumns) => void;
}

export interface ColumnPickerProps {
  visibleColumns: VisibleColumns;
  onColumnToggle: (column: keyof VisibleColumns) => void;
}

export interface PageControlsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: SelectChangeEvent<number>) => void;
}
