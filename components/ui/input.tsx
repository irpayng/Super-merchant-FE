import * as React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  currency?: boolean;
  currencySymbol?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      error,
      currency,
      currencySymbol = '₦',
      onChange,
      value,
      label,
      ...props
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = React.useState('');
    const internalRef = React.useRef<HTMLInputElement>(null);
    const inputRef = (ref as React.RefObject<HTMLInputElement>) || internalRef;

    React.useEffect(() => {
      if (currency && value !== undefined && value !== null) {
        const numValue =
          typeof value === 'number'
            ? value
            : parseFloat(String(value).replace(/,/g, ''));
        setDisplayValue(isNaN(numValue) ? '' : numValue.toLocaleString());
      } else if (!currency) {
        setDisplayValue(String(value || ''));
      }
    }, [value, currency]);

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (currency && onChange) {
        const rawValue = e.target.value.replace(/[^0-9]/g, '');
        const numericValue = rawValue ? parseFloat(rawValue) : '';
        const formatted = rawValue ? parseInt(rawValue).toLocaleString() : '';
        setDisplayValue(formatted);
        const syntheticEvent = {
          ...e,
          target: { ...e.target, value: numericValue },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      } else if (onChange) {
        onChange(e);
      }
    };

    return (
      <div className='w-full relative'>
        {label && (
          <label className='block text-sm font-medium text-gray-700 dark:text-foreground mb-1'>
            {label}
          </label>
        )}

        {currency && (
          <span
            className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500'
            style={{ fontSize: '16px', fontWeight: 400 }}
          >
            {currencySymbol}
          </span>
        )}

        <input
          ref={inputRef}
          className={cn(
            'w-full py-3 border rounded-lg outline-none transition-colors shadow-xs bg-white dark:bg-input text-foreground [color-scheme:light] dark:[color-scheme:dark]',
            currency ? 'pl-10 pr-4' : 'px-4',
            'placeholder:text-gray-300 dark:placeholder:text-gray-500 placeholder:font-normal placeholder:text-sm',
            'focus:border-[#FC6401] focus:outline-none',
            error ? 'border-red-500' : 'border-[#D0D5DD] dark:border-border',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            className
          )}
          value={currency ? displayValue : value}
          onChange={handleCurrencyChange}
          {...props}
        />

        {error && (
          <p className='text-xs text-[#F25C5C] font-light mt-1'>{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
