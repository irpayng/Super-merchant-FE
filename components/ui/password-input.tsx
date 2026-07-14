import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label: string;
}

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(({ className, error, label, id, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className='w-full'>
      {label && (
        <label
          htmlFor={id}
          className='block text-sm font-medium text-gray-700 dark:text-foreground mb-1'
        >
          {label}
        </label>
      )}
      <div className='relative'>
        <input
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          className={cn(
            'w-full px-4 py-3 pr-12 border rounded-lg outline-none transition-colors shadow-xs bg-white dark:bg-input text-foreground [color-scheme:light] dark:[color-scheme:dark]',
            'placeholder:text-gray-300 dark:placeholder:text-gray-500 placeholder:font-normal placeholder:text-sm',
            'focus:border-[#FC6401] focus:outline-none ',
            error ? 'border-red-500' : 'border-[#D0D5DD] dark:border-border',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            className
          )}
          {...props}
        />
        <Button
          type='button'
          onClick={() => setShowPassword(!showPassword)}
          variant='text'
          className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
        >
          {showPassword ? (
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'
              />
            </svg>
          ) : (
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
              />
            </svg>
          )}
        </Button>
      </div>

      {error && (
        <p className='text-xs text-[#F25C5C] font-light mt-1'>{error}</p>
      )}
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';
