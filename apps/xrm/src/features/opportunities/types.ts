export interface Opportunity {
  id: number;
  name: string;
  company: string;
  amount: number;
  closeDate: string;
  stage: 'Qualification' | 'Needs Analysis' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  priority: 'High' | 'Medium' | 'Low';
}

export type ViewType = 'table' | 'card' | 'kanban';
