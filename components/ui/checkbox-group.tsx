'use client';

import { Checkbox } from './checkbox';

interface CheckboxGroupProps {
  options: Array<{ id: string; name: string }>;
  value: string[];
  onChange: (value: string[]) => void;
}

export function CheckboxGroup({ options, value, onChange }: CheckboxGroupProps) {
  return (
    <div className='border border-[#D0D5DD] dark:border-border rounded-lg p-4 space-y-3'>
      {options.map((option) => (
        <Checkbox
          key={option.id}
          checked={value.includes(option.id)}
          onChange={(e) => {
            if (e.target.checked) {
              onChange([...value, option.id]);
            } else {
              onChange(value.filter((id) => id !== option.id));
            }
          }}
          label={option.name}
        />
      ))}
    </div>
  );
}
