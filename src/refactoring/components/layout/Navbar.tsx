import React from 'react';
import Button from '../common/Button';

type NavbarProps = {
  isAdmin: boolean;
  onToggleAdmin: () => void;
  title?: string;
};

const Navbar: React.FC<NavbarProps> = ({
  isAdmin,
  onToggleAdmin,
  title = '쇼핑몰 관리 시스템',
}) => {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Button onClick={onToggleAdmin}>{isAdmin ? '장바구니 페이지로' : '관리자 페이지로'}</Button>
      </div>
    </nav>
  );
};

export default Navbar;
