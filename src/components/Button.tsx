import React, { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`min-w-[44px] min-h-[44px] px-4 py-2 rounded-md ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
