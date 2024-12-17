import { SelectChangeEvent } from '@mui/material';

export interface Company {
  id: number;
  name: string;
  industry: string;
  companyType: string;
  website: string;
  phone: string;
  email: string;
  address?: string;
  description?: string;
}

export interface CompanyFormProps {
  initialData?: Partial<Company> | null;
  onSubmit: (data: Partial<Company>) => Promise<void>;
  onCancel: () => void;
}

export interface CompanyCardProps {
  company: Company;
  onEdit: (company: Company) => void;
}

export type Order = 'asc' | 'desc';

export interface HeadCell {
  id: keyof VisibleColumns;
  label: string;
  sortable?: boolean;
}

export type VisibleColumns = {
  name: boolean;
  industry: boolean;
  companyType: boolean;
  email: boolean;
  phone: boolean;
  website: boolean;
};

export interface CompanyTableProps {
  companies: Company[];
  onEdit: (company: Company) => void;
  page: number;
  rowsPerPage: number;
  order: Order;
  orderBy: keyof Company;
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
