'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useState } from 'react';
import DashboardContext from '@/components/context/dashboard-global/DashboardContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTableRow, setActiveTableRow] = useState<any>(null);
  const [detailsSliderOpen, setDetailsSliderOpen] = useState<boolean>(false);

  return (
    <DashboardContext.Provider
      value={{
        activeTableRow,
        setActiveTableRow,
        detailsSliderOpen,
        setDetailsSliderOpen,
      }}
    >
      <div className='flex h-screen'>
        <Sidebar
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={() => setIsMobileMenuOpen(false)}
        />
        <div className='flex-1 flex flex-col overflow-hidden'>
          <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
          <main className='flex-1 overflow-y-auto bg-[#F9FAFB] dark:bg-muted p-4 space-y-4'>
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </DashboardContext.Provider>
  );
}
