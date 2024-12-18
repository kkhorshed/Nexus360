import { Button as MuiButton } from '@mui/material';
import { ButtonProps } from '../../types';

export const Button = ({
  children,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  disabled = false,
  className,
  style,
  onClick,
  ...props
}: ButtonProps) => {
  return (
    <MuiButton
      variant={variant}
      color={color}
      size={size}
      disabled={disabled}
      className={className}
      style={style}
      onClick={onClick}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
