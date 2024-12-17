/**
 * Get the range of items being displayed on the current page
 */
export const getPageRange = (
  page: number,
  rowsPerPage: number,
  totalCount: number
): { start: number; end: number } => {
  const start = page * rowsPerPage + 1;
  const end = Math.min((page + 1) * rowsPerPage, totalCount);
  return { start, end };
};

/**
 * Generic comparator for descending sort
 */
export const descendingComparator = <T>(a: T, b: T, orderBy: keyof T) => {
  const aValue = String(a[orderBy] || '');
  const bValue = String(b[orderBy] || '');
  return bValue.localeCompare(aValue);
};

/**
 * Get comparator function for sorting
 */
export const getComparator = <T extends Record<string, any>>(
  order: 'asc' | 'desc',
  orderBy: keyof T
) => {
  return order === 'desc'
    ? (a: T, b: T) => descendingComparator(a, b, orderBy)
    : (a: T, b: T) => -descendingComparator(a, b, orderBy);
};

/**
 * Apply filters to a dataset
 */
export const applyFilters = <T extends Record<string, any>>(
  data: T[],
  filters: Record<string, string>
): T[] => {
  if (Object.keys(filters).length === 0) return data;

  return data.filter(item => 
    Object.entries(filters).every(([field, value]) => {
      const fieldValue = String(item[field] || '').toLowerCase();
      const searchValue = String(value).toLowerCase();
      return fieldValue.includes(searchValue);
    })
  );
};
