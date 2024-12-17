import { Contact } from '../types';

export const mockContacts: Contact[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    company: 'Acme Inc',
    position: 'Software Engineer',
    status: 'Active'
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    phone: '098-765-4321',
    company: 'Tech Corp',
    position: 'Product Manager',
    status: 'Active'
  },
  {
    id: 3,
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike@example.com',
    phone: '555-123-4567',
    company: 'Innovation Labs',
    position: 'CTO',
    status: 'Active'
  },
  {
    id: 4,
    firstName: 'Sarah',
    lastName: 'Williams',
    email: 'sarah@example.com',
    phone: '777-888-9999',
    company: 'Digital Solutions',
    position: 'Sales Director',
    status: 'Active'
  }
];
