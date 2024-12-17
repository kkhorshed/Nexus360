export interface Lead {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
  [key: string]: string | number; // Add index signature for DataFilter compatibility
}
