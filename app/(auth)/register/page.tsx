'use client';
import React from 'react';
import Image from 'next/image';
import Onboarding from '@/components/auth/onboarding/Onboarding';
import OnboardingLayoutContent from '@/components/auth/onboarding/OnboardingLayoutContent';

const Register = () => {
  return (
    <div className='bg-white dark:bg-[#18181B] md:py-4 md:px-4 overflow-hidden min-h-screen'>
      <div className='flex justify-center items-stretch z-20 sm:px-2 py-2'>
        <div className='flex flex-col lg:flex-row justify-between gap-20 w-full sm:mx-0 mx-3'>
          <div className='relative hidden md:flex items-center justify-center rounded-[26px] overflow-hidden flex-1 h-[95vh]'>
            <Image
              src='/irpay-bg-Image.jpg'
              alt='IRPay Background'
              fill
              className='object-cover'
            />
            <div className='absolute inset-0 bg-black/55 md:rounded-[30px] z-10' />
            <div className='relative z-10 w-full hidden lg:block p-10 h-full'>
              <OnboardingLayoutContent />
            </div>
          </div>

          <div className='md:basis-[50%]  w-full'>
            <div className='w-full md:max-w-[80%] bg-white dark:bg-[#18181b] rounded-[20px] px-6 py-5 my-auto shadow-sm p-10 flex flex-col overflow-y-auto'>
              <div className='flex flex-col overflow-y-auto mt-4 space-y-4 pr-1 scrollbar-hide flex-1'>
                <Onboarding />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
