import { Lead } from '../types';

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

export const getStatusColor = (status: Lead['status']): 'info' | 'warning' | 'success' | 'error' => {
  switch (status) {
    case 'New':
      return 'info';
    case 'Contacted':
    case 'Qualified':
      return 'warning';
    case 'Proposal':
    case 'Negotiation':
      return 'info';
    case 'Won':
      return 'success';
    case 'Lost':
      return 'error';
    default:
      return 'info';
  }
};

export const getSourceIcon = (source: string): string => {
  switch (source.toLowerCase()) {
    case 'website':
      return '🌐';
    case 'referral':
      return '👥';
    case 'trade show':
      return '🎪';
    case 'linkedin':
      return '💼';
    case 'email campaign':
      return '📧';
    case 'cold call':
      return '📞';
    case 'partner':
      return '🤝';
    case 'webinar':
      return '🎥';
    default:
      return '📌';
  }
};
