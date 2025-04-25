
import React, { ReactNode } from 'react';
import Navbar from '../Navbar';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen app-background bg-[var(--rpg-background)]">
      <Navbar />
      <main className="container mx-auto px-4 pt-20 pb-10">
        {children}
      </main>
    </div>
  );
};

export default Layout;
