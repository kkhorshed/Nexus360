// Base interfaces
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface BaseResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// User related types
export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export type UserRole = 'admin' | 'user' | 'manager';

// Deal related types
export interface Deal extends BaseEntity {
  name: string;
  value: number;
  stage: DealStage;
  probability: number;
  expectedCloseDate: string;
  ownerId: string;
  companyId: string;
}

export type DealStage = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';

// Product related types
export interface Product extends BaseEntity {
  name: string;
  description: string;
  price: number;
  category: string;
  status: 'active' | 'inactive';
}

// Form related types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date' | 'textarea';
  required?: boolean;
  options?: Array<{
    label: string;
    value: string | number;
  }>;
}

// Table related types
export interface TableColumn<T> {
  key: keyof T;
  title: string;
  render?: (value: any, record: T) => React.ReactNode;
  sortable?: boolean;
  width?: string | number;
}

// API related types
export interface PaginatedResponse<T> extends BaseResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface QueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}
