export const ROWS_PER_PAGE_OPTIONS = [5, 10, 25];
export const CARD_VIEW_ROWS_PER_PAGE_OPTIONS = [8, 16, 24];

export const CONTACT_STATUS_OPTIONS = [
  'Active',
  'Inactive',
  'Lead',
  'Customer',
  'Partner'
] as const;

interface TableColumn {
  id: string;
  label: string;
  align?: 'left' | 'right' | 'center';
}

export const TABLE_COLUMNS: readonly TableColumn[] = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'phone', label: 'Phone', align: 'left' },
  { id: 'company', label: 'Company', align: 'left' },
  { id: 'position', label: 'Position', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'actions', label: 'Actions', align: 'right' }
] as const;

export const INITIAL_ROWS_PER_PAGE = 10;
export const INITIAL_PAGE = 0;
export const INITIAL_VIEW = 'table' as const;
