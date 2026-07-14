'use client';

import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & {
    label?: string;
  }
>(({ className, label, ...props }, ref) => {
  const switchEl = (
    <SwitchPrimitives.Root
      className={cn(
        'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full ' +
          'border-2 border-transparent transition-colors focus:outline-none focus:ring-2 ' +
          'focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ' +
          'data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-200',
        className
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          'pointer-events-none block h-5 w-5 rounded-full bg-white shadow transform ' +
            'transition-transform duration-200 ease-in-out ' +
            'data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0'
        )}
      />
    </SwitchPrimitives.Root>
  );

  if (label) {
    return (
      <label className='flex items-center justify-between w-full cursor-pointer select-none'>
        <span className='text-sm font-medium text-foreground'>{label}</span>
        {switchEl}
      </label>
    );
  }

  return switchEl;
});

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
