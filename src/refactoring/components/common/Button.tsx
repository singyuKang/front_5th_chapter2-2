import React from 'react';

type ButtonProps = {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'default';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  dataTestId?: string;
};

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  variant = 'primary',
  disabled = false,
  className = '',
  type = 'button',
  dataTestId = '',
}) => {
  const baseStyles = 'px-4 py-2 rounded focus:outline-none transition-colors';

  const variantStyles = {
    primary: 'bg-white text-blue-600 hover:bg-blue-100',
    secondary: 'bg-blue-600 text-white hover:bg-blue-500',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    success: 'bg-green-500 text-white hover:bg-green-600',
    default: '',
  };

  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${disabledStyles} ${className}`;

  return (
    <button
      data-testid={dataTestId}
      type={type}
      onClick={onClick}
      className={combinedClassName}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
