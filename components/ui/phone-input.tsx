'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@radix-ui/react-label';
import { Input } from './input';

interface PhoneInputGroupProps {
  value: string;
  countryCode: string;
  onChange: (value: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onCountryChange: (value: string) => void;
  error?: string | null;
  disabled?: boolean;
  text?: string;
}

const PhoneInput = ({
  value,
  countryCode,
  onChange,
  onCountryChange,
  error,
  disabled = false,
  text,
  onBlur,
}: PhoneInputGroupProps) => {
  const [localError, setLocalError] = useState<string | null>(error || null);

  const validatePhoneNumber = (phone: string) => {
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 10)
      return 'Phone number must be at least 10 digits';
    if (digitsOnly.length > 11) return 'Phone number cannot exceed 11 digits';
    return null;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filteredValue = e.target.value.replace(/[^\d\s\-\(\)]/g, '');
    onChange(filteredValue);
    setLocalError(null);
    const validationError = validatePhoneNumber(filteredValue);
    if (validationError) setLocalError(validationError);
  };

  const handlePhoneBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const validationError = validatePhoneNumber(value);
    setLocalError(validationError);

    if (onBlur) onBlur(e);
  };

  return (
    <div className='w-full'>
      {text && <Label className='text-sm mb-1'>{text}</Label>}

      <div
        className={`flex items-stretch w-full border rounded-lg overflow-hidden ${
          localError ? 'border-red-500' : 'border-[#D0D5DD] dark:border-border'
        }`}
      >
        <Select
          onValueChange={onCountryChange}
          value={countryCode}
          disabled={disabled}
        >
          <SelectTrigger className='flex items-center justify-center gap-1 px-2 border-none bg-white dark:bg-input dark:text-foreground h-full min-h-[48px] w-[90px] min-w-[100px]'>
            <Image src='/nigeria.svg' alt='Nigeria' width={18} height={14} />
            <SelectValue />
          </SelectTrigger>

          <SelectContent className='dark:bg-input dark:text-foreground dark:border-border'>
            <SelectItem value='+234'>+234</SelectItem>
            <SelectItem value='+1' disabled>
              +1
            </SelectItem>
            <SelectItem value='+44' disabled>
              +44
            </SelectItem>
            <SelectItem value='+91' disabled>
              +91
            </SelectItem>
          </SelectContent>
        </Select>

        <div className='border-l border-[#D0D5DD] dark:border-border' />

        <Input
          type='tel'
          className='flex-1 h-full rounded-none border-none px-4 py-3 text-sm placeholder:text-gray-300 dark:placeholder:text-gray-500'
          placeholder='0000-000-000'
          value={value}
          onChange={handlePhoneChange}
          onBlur={handlePhoneBlur}
          //   disabled={disabled}
        />
      </div>

      {localError && (
        <p className='text-xs text-red-500 font-light mt-1'>{localError}</p>
      )}
    </div>
  );
};

export default PhoneInput;
