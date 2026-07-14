import React from 'react';
import AuthHeader from './AuthHeader';
import Image from 'next/image';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import AuthLayoutWrapper from '@/app/(auth)/AuthLayout';

const PasswordResetSuccess = () => {
  const router = useRouter();
  const login = () => {
    router.push('/login');
  };
  return (
    <AuthLayoutWrapper>
      <AuthHeader
        title='Password changed!'
        description='Congratulations. You password has been changed successfully.'
      >
        <div className='ml-[-1rem] mb-[-1rem]'>
          <Image
            src={'/SuccessMessageGIF.gif'}
            width={120}
            height={120}
            alt='Success Icon'
          />
        </div>
      </AuthHeader>

      <Button variant='login' onClick={login} className='mt-4'>
        Login
      </Button>
    </AuthLayoutWrapper>
  );
};

export default PasswordResetSuccess;
