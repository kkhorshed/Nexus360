export type FilterOperator = 'equals' | 'contains' | 'startsWith' | 'endsWith';

export type FilterCondition = {
  field: string;
  operator: FilterOperator;
  value: string;
};

export type FilterState = {
  [key: string]: string;
};

export type SavedFilter = {
  id: string;
  name: string;
  filters: FilterState;
  conditions: FilterCondition[];
  isDefault: boolean;
};

export type Column = {
  id: string;
  label: string;
  numeric?: boolean;
};

export const FILTER_OPERATORS: { value: FilterOperator; label: string }[] = [
  { value: 'equals', label: 'Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'startsWith', label: 'Starts with' },
  { value: 'endsWith', label: 'Ends with' },
];

export interface DataFilterProps {
  currentFilters: FilterState;
  onFilterLoad: (filters: FilterState) => void;
  columns: Column[];
  data: any[];
  storageKey: string; // Key for localStorage to keep filters separate for different pages
}
