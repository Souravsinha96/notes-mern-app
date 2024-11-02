import { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react';
import styles from './Button.module.css';

type ButtonProps = {
  children?: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'text' | 'contained' | 'outline';
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  color?: 'primary' | 'secondary' | 'error';
  shape?: 'rounded' | 'square' | 'ellipse';
};
type CustomButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & ButtonProps;

const Button = ({
  onClick,
  children,
  disabled = false,
  size = 'md',
  variant = 'contained',
  startIcon = undefined,
  endIcon = undefined,
  color = 'secondary',
  shape = 'rounded',
  ...props
}: CustomButtonProps) => {
  return (
    <button
      {...props}
      onClick={onClick}
      disabled={disabled}
      className={`${styles.btn} ${styles[size]} ${styles[variant]} ${styles[color]} ${styles[shape]}`}
      aria-disabled={disabled}
    >
      {startIcon}
      {children}
      {endIcon}
    </button>
  );
};
export default Button;
