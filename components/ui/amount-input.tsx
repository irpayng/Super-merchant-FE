'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type AmountMode = 'currency' | 'percentage';

interface AmountInputProps {
  /** 'currency' prepends ₦, 'percentage' prepends %. */
  mode?: AmountMode;
  /** Raw numeric value as a string (no commas, no sign). */
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  /** Upper bound for percentage mode (default 100). Ignored for currency. */
  max?: number;
  /** Override the prefix symbol for currency mode. Defaults to ₦. */
  currencySymbol?: string;
}

/**
 * AmountInput
 *
 * Single reusable input for monetary and percentage fields. Both modes share
 * identical shell styling and prepend their sign (₦ or %) on the left so the
 * fields line up visually inside the same form.
 *
 * The value passed out via onChange is always the raw number as a string (e.g.
 * "1500.5"), never comma-formatted, so it's safe to send to the API directly.
 */
export function AmountInput({
  mode = 'currency',
  value,
  onChange,
  placeholder,
  disabled,
  error,
  className,
  max,
  currencySymbol = '₦',
}: AmountInputProps) {
  const symbol = mode === 'percentage' ? '%' : currencySymbol;
  const upperBound = mode === 'percentage' ? max ?? 100 : undefined;

  const formatDisplay = React.useCallback(
    (raw: string) => {
      if (!raw) return '';
      if (mode === 'currency') {
        const [intPart, decPart] = raw.split('.');
        const intFormatted = intPart ? Number(intPart).toLocaleString() : '0';
        return decPart !== undefined ? `${intFormatted}.${decPart}` : intFormatted;
      }
      return raw;
    },
    [mode],
  );

  const [displayValue, setDisplayValue] = React.useState<string>(() => formatDisplay(String(value ?? '')));

  // Sync display value when the canonical value changes externally (e.g. form reset).
  React.useEffect(() => {
    const raw = String(value ?? '');
    const reformatted = formatDisplay(raw);
    setDisplayValue((prev) => (prev === reformatted ? prev : reformatted));
  }, [value, formatDisplay]);

  const sanitize = (input: string): string => {
    // Keep digits and a single decimal point. Strip the symbol and anything else.
    const cleaned = input.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    let raw = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : cleaned;

    if (mode === 'percentage') {
      // Cap decimals to 2 for percentages.
      const [intPart, decPart] = raw.split('.');
      if (decPart !== undefined) {
        raw = `${intPart}.${decPart.slice(0, 2)}`;
      }
      if (upperBound !== undefined && raw !== '' && raw !== '.') {
        const num = parseFloat(raw);
        if (!isNaN(num) && num > upperBound) {
          raw = String(upperBound);
        }
      }
    }

    return raw;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = sanitize(e.target.value);
    setDisplayValue(formatDisplay(raw));
    onChange(raw);
  };

  return (
    <div className={cn('w-full', className)}>
      <div className='relative'>
        <span
          className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500'
          style={{ fontSize: '16px', fontWeight: 400 }}
        >
          {symbol}
        </span>
        <input
          type='text'
          inputMode='decimal'
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full py-3 pl-10 pr-4 border rounded-lg outline-none transition-colors shadow-xs bg-white dark:bg-input text-foreground',
            'placeholder:text-gray-300 dark:placeholder:text-gray-500 placeholder:font-normal placeholder:text-sm',
            'focus:border-[#FC6401] focus:outline-none',
            error ? 'border-red-500' : 'border-[#D0D5DD] dark:border-border',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          )}
          style={{ fontSize: '16px', fontWeight: 400, lineHeight: '24px' }}
        />
      </div>
      {error && <p className='text-sm text-red-500 mt-1'>{error}</p>}
    </div>
  );
}
