import * as React from 'react';
import { Loader2, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'success'
    | 'theme'
    | 'outline'
    | 'ghost'
    | 'menu'
    | 'menu-danger'
    | 'filter'
    | 'icon'
    | 'link'
    | 'close'
    | 'icon-bordered'
    | 'text'
    | 'nav'
    | 'pagination'
    | 'toggle'
    | 'login'
    | 'tab'
    | 'primaryBtn'
    | 'inActiveBtn'
    | 'activeGhost';
  loading?: boolean;
  icon?: LucideIcon | string;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      loading = false,
      icon: Icon,
      children,
      className,
      disabled,
      autoFocus,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary: 'bg-black text-white hover:bg-gray-800 focus:ring-gray-400',
      secondary:
        'bg-white dark:bg-card text-black dark:text-foreground border border-[#F1F1F1] dark:border-border hover:bg-gray-50 dark:hover:bg-accent focus:ring-gray-300',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-300',
      success:
        'bg-green-600 text-white hover:bg-green-700 focus:ring-green-300',
      theme:
        'bg-[#FC6401] text-white border border-[#FC6401] hover:bg-[#e35a01] shadow-[0_4px_12px_0_rgba(252,100,1,0.3)] focus:ring-[#FC6401]/40',
      outline:
        'border border-gray-300 dark:border-border hover:bg-gray-50 dark:hover:bg-accent focus:ring-gray-300',
      ghost: 'border border-gray-300 hover:bg-gray-50 focus:ring-gray-300',
      menu: 'w-full text-left text-sm hover:bg-accent justify-start focus:ring-gray-300',
      'menu-danger':
        'w-full text-left text-sm hover:bg-accent text-red-600 justify-start focus:ring-red-300',
      filter:
        'text-sm text-gray-600 dark:text-muted-foreground border border-gray-300 dark:border-border rounded-lg px-3 py-1 bg-white dark:bg-card hover:bg-gray-50 dark:hover:bg-accent focus:ring-gray-300',
      icon: 'p-2 hover:bg-gray-100 dark:hover:bg-accent rounded-lg focus:ring-gray-300',
      link: 'text-sm text-[#FC6401] hover:underline p-0 focus:ring-[#FC6401]/40',
      close:
        'text-white flex-shrink-0 p-0 hover:opacity-80 focus:ring-white/50',
      'icon-bordered':
        'p-2 hover:bg-gray-100 dark:hover:bg-accent rounded-lg border border-[#F1F1F1] dark:border-border bg-white dark:bg-card focus:ring-gray-300',
      text: 'p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0 p-0 focus:ring-gray-300',
      nav: 'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-secondary focus:ring-gray-300',
      pagination:
        'px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-gray-300',
      toggle: 'p-2 rounded-lg hover:bg-secondary border focus:ring-gray-300',
      login:
        'w-full py-3 px-4 bg-[#E8C4A8] hover:bg-[#E8B898]  enabled:bg-[#FC6401] enabled:text-white enabled:hover:bg-[#e35a01] text-gray-800 font-medium rounded-lg transition-colors focus:ring-[#E8C4A8]',
      tab: 'px-4 py-3 text-sm font-medium hover:text-[#FC6401] focus:ring-0 focus:ring-offset-0 rounded-none',
      primaryBtn:
        'bg-[#FC6401] text-white hover:bg-[#E35A01] focus:ring-[#FC6401]/40',
      inActiveBtn: 'bg-[#FED4B9] text-white cursor-not-allowed opacity-60',
      activeGhost: 'bg-transparent',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        autoFocus={autoFocus}
        className={cn(
          'inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-1',
          variant === 'theme' ? 'rounded-lg' : 'rounded-md',
          variants[variant],
          className
        )}
        {...props}
      >
        {loading && <Loader2 className='h-4 w-4 animate-spin' />}
        {!loading && Icon && typeof Icon === 'string' && (
          <Image
            src={Icon}
            alt='icon'
            width={16}
            height={16}
            className='h-6 w-6 invert'
          />
        )}
        {!loading && typeof Icon !== 'string' && Icon && (
          <Icon className='h-4 w-4' />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
