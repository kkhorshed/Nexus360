import { Lead } from '../types';

export const initialLeads: Lead[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    company: 'Acme Inc',
    source: 'Website',
    status: 'New'
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    phone: '234-567-8901',
    company: 'Tech Corp',
    source: 'Referral',
    status: 'Contacted'
  },
  {
    id: 3,
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike@example.com',
    phone: '345-678-9012',
    company: 'Global Solutions',
    source: 'Trade Show',
    status: 'Qualified'
  }
];
