import React, { ReactNode } from 'react';
import Image from 'next/image';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayoutWrapper = ({ children }: AuthLayoutProps) => {
  return (
    <div className='bg-white dark:bg-[#181818]  0 overflow-x-hidden'>
      <div className='relative w-full min-h-screen sm:p-4'>
        <div className='h-full flex flex-col md:flex-row'>
          <Image
            src='/irpay-bg-Image.jpg'
            alt='Background'
            fill
            className='object-cover z-0'
          />
          <div className='absolute inset-0 bg-black/55 z-10' />

          <div className='absolute inset-0 flex items-start justify-center z-20 pt-10 sm:pt-12 px-4 sm:px-0'>
            <div
              className='w-full max-w-[23rem] min-[70vh] h-fit sm:h-auto md:max-h-fit bg-white dark:bg-[#18181b] rounded-[20px]  px-6 py-5
              sm:my-auto'
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayoutWrapper;
