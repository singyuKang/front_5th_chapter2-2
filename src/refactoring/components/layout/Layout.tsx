import React from 'react';
import Navbar from './Navbar';

type LayoutProps = {
  children: React.ReactNode;
  isAdmin: boolean;
  onToggleAdmin: () => void;
};

const Layout: React.FC<LayoutProps> = ({ children, isAdmin, onToggleAdmin }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar isAdmin={isAdmin} onToggleAdmin={onToggleAdmin} />
      <main className="container mx-auto mt-6">{children}</main>
    </div>
  );
};

export default Layout;
