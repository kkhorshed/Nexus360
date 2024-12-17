export const LEAD_SOURCES = [
  'Website',
  'Referral',
  'Social Media',
  'Email Campaign',
  'Trade Show',
  'Cold Call',
  'Other'
] as const;

export const LEAD_STATUSES = [
  'New',
  'Contacted',
  'Qualified',
  'Proposal',
  'Negotiation',
  'Won',
  'Lost'
] as const;

export const TABLE_COLUMNS = [
  { id: 'firstName', label: 'First Name', numeric: false },
  { id: 'lastName', label: 'Last Name', numeric: false },
  { id: 'email', label: 'Email', numeric: false },
  { id: 'phone', label: 'Phone', numeric: false },
  { id: 'company', label: 'Company', numeric: false },
  { id: 'source', label: 'Source', numeric: false },
  { id: 'status', label: 'Status', numeric: false }
];
