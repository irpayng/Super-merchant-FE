'use client';

import * as React from 'react';
import { SafeImage } from '@/components/ui/safe-image';

interface TableAvatarCellProps {
  avatar?: string;
  title: string;
  subtitle?: string;
  imageSrc?: string;
}

export function TableAvatarCell({
  avatar,
  title,
  subtitle,
  imageSrc,
}: TableAvatarCellProps) {
  return (
    <div className='flex items-center gap-4'>
      <SafeImage
        src={"/terminal-icon.png"}
        alt={title}
        width={40}
        height={40}
        className='w-10 h-10 rounded-full object-cover'
        fallback={
          <div className='w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold'>
            {avatar || title?.charAt(0).toUpperCase()}
          </div>
        }
      />
      <div className='text-left'>
        <p className='font-medium'>{title}</p>
        {subtitle && <p className='text-sm text-gray-500'>{subtitle}</p>}
      </div>
    </div>
  );
}
