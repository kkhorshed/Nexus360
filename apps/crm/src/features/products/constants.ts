import { Column } from './types';

export const COLUMNS: Column[] = [
  { id: 'name', label: 'Product Name', numeric: false },
  { id: 'category', label: 'Category', numeric: false },
  { id: 'sku', label: 'SKU', numeric: false },
  { id: 'price', label: 'Price', numeric: true },
  { id: 'stock', label: 'Stock Level', numeric: true },
];

export const PRODUCT_CATEGORIES = [
  'Software',
  'Hardware',
  'Services',
  'Consulting',
  'Support',
  'Training',
  'Other'
];

export const ROWS_PER_PAGE_OPTIONS = [5, 10, 25];
export const CARD_VIEW_ROWS_PER_PAGE_OPTIONS = [8, 16, 24];
