import { Opportunity } from '../types';

export const initialOpportunities: Opportunity[] = [
  {
    id: 1,
    name: 'Enterprise Software Deal',
    company: 'Acme Inc',
    amount: 50000,
    closeDate: '2024-03-31',
    stage: 'Proposal',
    priority: 'High'
  },
  {
    id: 2,
    name: 'Cloud Services Package',
    company: 'Tech Corp',
    amount: 25000,
    closeDate: '2024-04-15',
    stage: 'Negotiation',
    priority: 'Medium'
  },
  {
    id: 3,
    name: 'Security Solutions',
    company: 'SecureNet',
    amount: 75000,
    closeDate: '2024-05-01',
    stage: 'Qualification',
    priority: 'High'
  },
  {
    id: 4,
    name: 'Data Analytics Platform',
    company: 'DataCo',
    amount: 35000,
    closeDate: '2024-04-30',
    stage: 'Needs Analysis',
    priority: 'Medium'
  }
];
