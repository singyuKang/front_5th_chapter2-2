import React from 'react';

type ButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
};

const Button: React.FC<ButtonProps> = ({ onClick, children, variant = 'primary' }) => {
  const styles = {
    primary: 'bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100',
    secondary: 'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500',
  };

  return (
    <button onClick={onClick} className={styles[variant]}>
      {children}
    </button>
  );
};

export default Button;
