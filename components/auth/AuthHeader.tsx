import React from 'react';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';

interface AuthHeaderProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  onBack?: () => void;
  showBackBtn?: boolean;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  description,
  children,
  onBack,
  showBackBtn,
}) => {
  return (
    <div className='flex flex-col gap-2.5 mt-2'>
      <Image src='/LogowithBorder.svg' alt='logo' width={140} height={50} />

      {(showBackBtn ||
        (!title.includes('Login') &&
          !title.includes('Verify') &&
          !title.includes('Password'))) && (
        <Button
          onClick={onBack}
          variant='activeGhost'
          className='h-12 w-12 flex justify-center items-center rounded-full bg-white dark:bg-[#2a2a2d] dark:text-white shadow-md p-3'
        >
          <ArrowLeft />
        </Button>
      )}
      {children}

      <h2
        className='text-gray-900 dark:text-foreground mt-2'
        style={{
          fontWeight: 600,
          fontSize: '20px',
          lineHeight: '24px',
          letterSpacing: '0%',
        }}
      >
        {title}
      </h2>
      <p className='mt-2 text-gray-400 dark:text-muted-foreground text-sm'>
        {description}
      </p>
    </div>
  );
};

export default AuthHeader;
