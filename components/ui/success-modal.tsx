'use client';
import React from 'react';
import Image from 'next/image';
import { Modal } from './modal';
import { Button } from './button';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

const SuccessModal = ({ open, onClose, title, description }: DialogProps) => {
  return (
    <Modal open={open} onClose={onClose} size='md' showCloseButton={false}>
      <div className='space-y-4'>
        <div className='ml-[-1rem] mb-[-1rem]'>
          <Image
            src={'/SuccessMessageGIF.gif'}
            width={120}
            height={120}
            alt='Success Icon'
          />
        </div>

        <div>
          <h3 className='text-lg font-semibold mb-2'>{title}</h3>
          <p className='text-gray-600 dark:text-gray-400 text-sm'>
            {description}
          </p>
        </div>

        <div className='flex gap-4 pt-2'>
          <Button variant='login' onClick={onClose} className='flex-1'>
            Okay
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SuccessModal;
