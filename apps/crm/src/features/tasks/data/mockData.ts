import { Task } from '../types';

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Complete Project Proposal',
    description: 'Draft and finalize the project proposal for the new client',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2024-01-20',
    assignedTo: 'John Doe'
  },
  {
    id: '2',
    title: 'Client Meeting',
    description: 'Prepare and conduct meeting with client to discuss requirements',
    status: 'todo',
    priority: 'medium',
    dueDate: '2024-01-25',
    assignedTo: 'Jane Smith'
  },
  {
    id: '3',
    title: 'Code Review',
    description: 'Review and provide feedback on team\'s code submissions',
    status: 'completed',
    priority: 'low',
    dueDate: '2024-01-15',
    assignedTo: 'Mike Johnson'
  }
];
