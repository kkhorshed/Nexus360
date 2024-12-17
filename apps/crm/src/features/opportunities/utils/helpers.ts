import { Opportunity } from '../types';

export const getStageColor = (stage: Opportunity['stage']): 'info' | 'warning' | 'success' | 'error' | 'primary' | 'secondary' => {
  switch (stage) {
    case 'Qualification':
      return 'info';
    case 'Needs Analysis':
      return 'primary';
    case 'Proposal':
      return 'secondary';
    case 'Negotiation':
      return 'warning';
    case 'Closed Won':
      return 'success';
    case 'Closed Lost':
      return 'error';
    default:
      return 'info';
  }
};

export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString();
};
