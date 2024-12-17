export const FILTER_COLUMNS = [
  { id: 'name', label: 'Company Name' },
  { id: 'industry', label: 'Industry' },
  { id: 'companyType', label: 'Type' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
  { id: 'website', label: 'Website' },
];

export const TABLE_HEAD_CELLS = [
  { id: 'name', label: 'Company Name', sortable: true },
  { id: 'industry', label: 'Industry', sortable: true },
  { id: 'companyType', label: 'Type', sortable: true },
  { id: 'email', label: 'Contact' },
  { id: 'phone', label: 'Phone' },
  { id: 'website', label: 'Website', sortable: true },
];

export const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50];

export const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Manufacturing',
  'Retail',
  'Education',
  'Environmental',
  'Construction',
  'Marketing',
  'Research & Development',
  'Energy',
  'Food & Beverage',
  'Other'
] as const;

export const COMPANY_TYPES = [
  'Corporation',
  'LLC',
  'Partnership',
  'Sole Proprietorship',
  'Non-Profit',
  'B Corporation',
  'Other'
] as const;
