import { Company, VisibleColumns } from '../types';

export const isVisibleColumn = (
  columnId: string,
  visibleColumns: VisibleColumns
): columnId is keyof VisibleColumns => {
  return columnId in visibleColumns;
};

export const formatWebsiteUrl = (url: string): string => {
  return url.startsWith('http') ? url : `https://${url}`;
};

export const getPageRange = (
  page: number,
  rowsPerPage: number,
  totalCount: number
): { start: number; end: number } => {
  const start = page * rowsPerPage + 1;
  const end = Math.min((page + 1) * rowsPerPage, totalCount);
  return { start, end };
};

export const descendingComparator = <T>(a: T, b: T, orderBy: keyof T) => {
  const aValue = String(a[orderBy] || '');
  const bValue = String(b[orderBy] || '');
  return bValue.localeCompare(aValue);
};

export const getComparator = (
  order: 'asc' | 'desc',
  orderBy: keyof Company
) => {
  return order === 'desc'
    ? (a: Company, b: Company) => descendingComparator(a, b, orderBy)
    : (a: Company, b: Company) => -descendingComparator(a, b, orderBy);
};

export const applyFilters = (
  companies: Company[],
  filters: Record<string, string>
): Company[] => {
  if (Object.keys(filters).length === 0) return companies;

  return companies.filter(company => 
    Object.entries(filters).every(([field, value]) => {
      const fieldValue = String(company[field as keyof Company] || '').toLowerCase();
      const searchValue = String(value).toLowerCase();
      return fieldValue.includes(searchValue);
    })
  );
};
