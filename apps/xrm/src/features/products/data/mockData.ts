import { Product } from '../types';

export const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Enterprise Software',
    category: 'Software',
    sku: 'SW-001',
    price: 999.99,
    stock: 75,
    description: 'Enterprise-grade software solution'
  },
  {
    id: 2,
    name: 'Cloud Storage',
    category: 'Services',
    sku: 'SV-001',
    price: 199.99,
    stock: 15,
    description: 'Secure cloud storage service'
  },
];
