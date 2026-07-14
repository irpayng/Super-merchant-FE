'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { navigation, iconMap, type NavItem } from '@/lib/navigation';
import { useState, useEffect } from 'react';
import { startProgress } from '@/components/progress-bar';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function NavItemComponent({
  item,
  isCompact,
  onLinkClick,
  onClick,
  activeId,
}: {
  item: NavItem;
  isCompact?: boolean;
  onLinkClick?: () => void;
  onClick?: (id: string) => void;
  activeId?: string;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const Icon = iconMap[item.icon as keyof typeof iconMap];

  const isLocalMode = Boolean(onClick);
  const isRouteMode = !isLocalMode;

  const isRouteActive =
    (isRouteMode && pathname === item.url) ||
    (item.url && pathname.startsWith(item.url + '/'));
  const isLocalActive = isLocalMode && activeId === item.id;

  const isActive = isRouteActive || isLocalActive;

  if (isCompact) {
    return (
      <Link
        href={item.url || '#'}
        onClick={() => {
          startProgress();
          onLinkClick?.();
        }}
        className={`flex items-center justify-center p-3 rounded-lg ${
          isActive
            ? 'bg-secondary text-primary dark:bg-primary/10'
            : 'hover:bg-secondary dark:hover:bg-accent text-foreground dark:text-muted-foreground'
        }`}
        title={item.name}
      >
        {Icon && <Icon className='w-5 h-5' />}
      </Link>
    );
  }

  if (item.children) {
    return (
      <div>
        <Button onClick={() => setIsOpen(!isOpen)} variant='nav'>
          <span className='flex items-center gap-4'>
            {Icon && <Icon className='w-4 h-4' />}
            {item.name}
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </Button>
        {isOpen && item.children.length > 0 && (
          <div className='ml-4 mt-1 space-y-1'>
            {item.children.map((child, idx) => (
              <NavItemComponent
                key={idx}
                item={child}
                isCompact={isCompact}
                onLinkClick={onLinkClick}
                onClick={onClick}
                activeId={activeId}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const sharedClasses = `flex items-center gap-4 px-3 py-2 rounded-lg text-sm ${
    isActive
      ? 'bg-secondary text-primary dark:bg-primary/10'
      : 'hover:bg-secondary dark:hover:bg-accent text-foreground dark:text-muted-foreground'
  }`;

  if (onClick) {
    return (
      <button
        type='button'
        onClick={() => item.id && onClick(item.id)}
        className={sharedClasses}
      >
        {Icon && <Icon className='w-4 h-4' />}
        {item.name}
      </button>
    );
  }

  return (
    <Link
      href={item.url || '#'}
      onClick={() => {
        startProgress();
        onLinkClick?.();
      }}
      className={`flex items-center gap-4 px-3 py-2 rounded-lg text-sm ${
        isActive
          ? 'bg-secondary text-primary dark:bg-primary/10'
          : 'hover:bg-secondary dark:hover:bg-accent text-foreground dark:text-muted-foreground'
      }`}
    >
      {Icon && <Icon className='w-4 h-4' />}
      {item.name}
    </Link>
  );
}

export function Sidebar({
  isMobileOpen,
  onMobileClose,
}: {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}) {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved !== null) setIsCompact(saved === 'true');
  }, []);

  const toggleCompact = () => {
    const newState = !isCompact;
    setIsCompact(newState);
    localStorage.setItem('sidebar-collapsed', String(newState));
  };

  const handleLinkClick = () => {
    if (onMobileClose) onMobileClose();
  };

  const sidebarContent = (
    <>
      <div className='h-16 px-4 flex items-center justify-between'>
        {isCompact ? (
          <div className='w-8 h-8 bg-primary rounded flex items-center justify-center mx-auto'>
            <span className='text-white font-bold text-sm'>IR</span>
          </div>
        ) : (
          <>
            <div className='flex items-center gap-2'>
              <Link href='/dashboard'>
                <Image
                  src='/IrpayLogo.svg'
                  alt='Logo'
                  width={100}
                  height={100}
                />
              </Link>
            </div>
            <Button
              onClick={toggleCompact}
              variant='toggle'
              className='hidden md:block'
            >
              <ChevronLeft className='w-4 h-4' />
            </Button>
          </>
        )}
      </div>

      {isCompact && (
        <div className='px-4 pb-4 hidden md:block'>
          <Button
            onClick={toggleCompact}
            variant='toggle'
            className='w-full flex items-center justify-center'
          >
            <ChevronRight className='w-4 h-4' />
          </Button>
        </div>
      )}

      <nav className='flex-1 overflow-y-auto p-4'>
        {isCompact ? (
          <div className='space-y-2'>
            {navigation
              .flatMap((section) => section.items)
              .map((item, idx) => (
                <NavItemComponent
                  key={idx}
                  item={item}
                  isCompact={isCompact}
                  onLinkClick={handleLinkClick}
                />
              ))}
          </div>
        ) : (
          <div className='space-y-4'>
            {navigation.map((section, idx) => (
              <div key={idx}>
                <p className='text-xs text-muted-foreground mb-2'>
                  {section.title}
                </p>
                <div className='space-y-1'>
                  {section.items.map((item, itemIdx) => (
                    <NavItemComponent
                      key={itemIdx}
                      item={item}
                      isCompact={isCompact}
                      onLinkClick={handleLinkClick}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-40 md:hidden'
          onClick={onMobileClose}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-60 bg-card z-50 transform transition-transform md:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex ${
          isCompact ? 'w-20' : 'w-60'
        } bg-card border-r border-border h-screen flex-col transition-all`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

function OldSidebarReturn() {
  return <aside className='hidden'></aside>;
}
