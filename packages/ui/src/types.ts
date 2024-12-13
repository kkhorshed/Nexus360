import { ReactNode } from 'react';

// Common Props
export interface BaseProps {
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
}

// Layout Props
export interface PageWrapperProps extends BaseProps {
  title: string;
  breadcrumbs?: { label: string; path: string }[];
}

export interface LayoutElementsProps extends BaseProps {
  sidebar?: boolean;
  header?: boolean;
  footer?: boolean;
}

// Data Display Props
export interface DataCardProps extends BaseProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}

export interface DataTableProps<T> extends BaseProps {
  data: T[];
  columns: {
    key: keyof T;
    title: string;
    render?: (value: T[keyof T], record: T) => ReactNode;
  }[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
}

// UI Element Props
export interface UIElementProps extends BaseProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

// Route Props
export interface PrivateRouteProps extends BaseProps {
  requiredRoles?: string[];
  redirectPath?: string;
}
