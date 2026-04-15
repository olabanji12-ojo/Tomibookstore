// Button — components/ui/Button.tsx
// TODO: Build reusable button primitive

import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
  children: ReactNode;
}

const Button = ({ variant = 'primary', children, ...props }: ButtonProps) => {
  return <button {...props}>{children}</button>;
};

export default Button;
