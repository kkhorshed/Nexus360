import { ReactNode } from 'react';

// Common prop types
export interface BaseProps {
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
}

// Button props
export interface ButtonProps extends BaseProps {
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

// Input props
export interface InputProps extends BaseProps {
  type?: 'text' | 'password' | 'email' | 'number';
  value?: string | number;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

// Card props
export interface CardProps extends BaseProps {
  elevation?: number;
  variant?: 'outlined' | 'elevation';
}

// Typography props
export interface TypographyProps extends BaseProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'subtitle1' | 'subtitle2';
  component?: React.ElementType;
  color?: string;
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
}
