'use client';

import { Search, Bell, LogOut, Menu, Moon, Sun, Monitor } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { clearAuthToken } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/components/theme-provider';
import { logoutUser } from '@/app/redux/slices/userSlice';
import useToolkit from '@/hooks/misc/useToolkit';

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { dispatch } = useToolkit();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    dispatch(logoutUser());
    clearAuthToken();
    router.push('/login');
  };

  const getPageTitle = () => {
    if (pathname === '/') return 'Dashboard';
    if (pathname === '/compliance/bvn-verification') return 'BVN Verification';
    if (pathname === '/compliance/nin-verification') return 'NIN Verification';
    if (pathname === '/compliance/address-verification')
      return 'Address Verification';
    if (pathname === '/compliance/cac-verification') return 'CAC Verification';
    const segments = pathname.split('/').filter(Boolean);
    return segments[segments.length - 1]
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <header className='h-16 bg-white dark:bg-card flex items-center justify-between px-6 border-b dark:border-border'>
      <div className='flex items-center gap-4 min-w-0 flex-1'>
        <Button
          onClick={onMenuClick}
          variant='icon'
          className='md:hidden flex-shrink-0'
        >
          <Menu className='w-5 h-5' />
        </Button>
        <h1 className='font-semibold text-2xl truncate min-w-0'>
          {getPageTitle()}
        </h1>
      </div>

      <div className='flex items-center gap-4'>
        <div className='relative hidden sm:block'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10' />
          <Input
            type='text'
            placeholder='Search...'
            className='pl-10 pr-4 py-2 w-64 text-sm'
          />
        </div>

        <Button variant='icon' className='relative p-0'>
          <Bell className='w-5 h-5' />
          <span className='absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-xs rounded-full flex items-center justify-center'>
            3
          </span>
        </Button>

        <Button onClick={toggleTheme} variant='icon' title='Toggle theme'>
          {theme === 'dark' ? (
            <Sun className='w-5 h-5' />
          ) : theme === 'system' ? (
            <Monitor className='w-5 h-5' />
          ) : (
            <Moon className='w-5 h-5' />
          )}
        </Button>

        <div className='flex items-center gap-2'>
          <div className='w-8 h-8 bg-gray-200 rounded-full' />
        </div>

        <Button onClick={handleLogout} variant='icon' title='Logout'>
          <LogOut className='w-5 h-5' />
        </Button>
      </div>
    </header>
  );
}
