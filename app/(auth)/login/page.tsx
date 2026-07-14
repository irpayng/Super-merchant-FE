'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth-api';
import { setAuthToken } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/password-input';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { loginUser } from '@/app/redux/slices/userSlice';
import useToolkit from '@/hooks/misc/useToolkit';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { dispatch } = useToolkit();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      dispatch(loginUser(data.data));
      setAuthToken(data.data.token);
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-white dark:bg-[#181818] 0 overflow-x-hidden  '>
      <div className='relative w-full min-h-screen '>
        <div className='h-full flex flex-col md:flex-row'>
          <Image
            src='/irpay-bg-Image.jpg'
            alt='Login Banner'
            fill
            className='object-cover'
          />
        </div>

        <div className='absolute inset-0 bg-black/55  z-10' />

        <div className='absolute inset-0 flex items-start justify-center z-20 pt-10 sm:pt-12  sm:px-0'>
          <div className='w-full max-w-[23rem] h-[80vh] sm:h-auto md:max-h-[33rem] bg-white dark:bg-[#18181b] rounded-[20px] px-6 py-5 my-8 sm:my-auto'>
            <div className=''>
              <Image
                src={'/IrpayLogo.svg'}
                alt='Logo'
                width={130}
                height={100}
                className='my-4'
              />

              <h2
                className='text-gray-900 dark:text-foreground'
                style={{
                  fontWeight: 600,
                  fontSize: '20px',
                  lineHeight: '24px',
                  letterSpacing: '0%',
                }}
              >
                Merchant Dashboard Login
              </h2>
              <p className='mt-2 text-gray-400 dark:text-muted-foreground text-sm'>
                Enter your phone number and password
              </p>
            </div>

            <form onSubmit={handleSubmit} className='mt-8 space-y-4'>
              <div className='space-y-4'>
                <Input
                  id='email'
                  type='email'
                  label='Email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='you@company.com'
                />

                <PasswordInput
                  id='password'
                  label='Password'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Enter your password'
                />
              </div>

              <div className='text-left'>
                <a
                  href='/forgot-password'
                  className='text-sm text-gray-900 dark:text-foreground hover:text-[#E87722] underline'
                >
                  Forgot Password?
                </a>
              </div>

              {error && (
                <div className='text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg'>
                  {error}
                </div>
              )}

              <Button
                type='submit'
                disabled={!email || !password || loading}
                variant='login'
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>

              {/* <p className='text-center text-sm text-gray-600 dark:text-muted-foreground'>
                <a
                  href='/register'
                  className='text-gray-900 dark:text-foreground hover:text-[#E87722] underline'
                >
                  Don’t have an account? Create one
                </a>
              </p> */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
