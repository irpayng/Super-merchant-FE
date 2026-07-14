'use client';

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { FieldValues, Path, PathValue } from 'react-hook-form';

interface Option {
  value: string | number;
  label: string;
  left?: React.ReactNode;
}

interface SelectFieldProps<T extends FieldValues = any> {
  label?: string;
  value?: PathValue<T, Path<T>> | '';
  onChange?: (value: string) => void;
  options: Option[];
  placeholder?: string;
  error?: string | null;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  name?: Path<T>;
}

export const SelectInput: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  error,
  disabled = false,
  required = false,
  className,
  name,
}) => {
  const [internalValue, setInternalValue] = React.useState(value);
  React.useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (val: string) => {
    setInternalValue(val);
    if (onChange) {
      const eventLike = {
        target: { name, value: val },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      (onChange as any)(eventLike);
    }
  };

  return (
    <div className='w-full relative'>
      {label && (
        <label className='block text-sm font-medium text-gray-700 dark:text-foreground mb-1'>
          {label} {required && <span className='text-red-500'>*</span>}
        </label>
      )}

      <Select
        value={internalValue}
        onValueChange={(val) => {
          setInternalValue(val);
          onChange?.(val);
        }}
        disabled={!!disabled}
      >
        <SelectTrigger
          className={cn(
            'w-full py-3 px-4 border rounded-lg outline-none transition-colors shadow-xs bg-white dark:bg-input text-foreground [color-scheme:light] dark:[color-scheme:dark]',
            'text-sm placeholder:text-[#868C98] dark:placeholder:text-gray-500 font-normal leading-[1.25rem]',
            'flex items-center gap-2 truncate',
            'focus:border-[#FC6401] focus:outline-none',
            error ? 'border-red-500' : 'border-[#D0D5DD] dark:border-border',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'min-h-[50px]',
            className
          )}
        >
          <SelectValue
            placeholder={placeholder}
            className='text-sm leading-[16px] text-[#868C98] dark:text-gray-500'
          />
        </SelectTrigger>

        <SelectContent className='z-[9999] bg-popover ...' position='popper'>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={String(opt.value)}>
              <div className='flex items-center gap-2'>
                {opt.left && <span className='flex-shrink-0'>{opt.left}</span>}
                <span>{opt.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && (
        <p className='text-xs text-[#F25C5C] font-light mt-1'>{error}</p>
      )}
    </div>
  );
};
