'use client';
import React, { useState } from 'react';
import AuthLayoutWrapper from '../AuthLayout';
import AuthHeader from '@/components/auth/AuthHeader';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { forgotPassword } from '@/lib/auth-api';
import { useAuthContext } from '@/components/context/authContext/AuthContext';

const ForgotPassword = () => {
  const { state, setState, resetState } = useAuthContext();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const goToPreviousStep = () => {
    router.back();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await forgotPassword(email);
      router.push('/verify-otp');
      setState({
        resetEmail: email,
        otpVerified: false,
      });
      return data;
    } catch (err) {
      setError('Invalid email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AuthLayoutWrapper>
        <AuthHeader
          title='Forgot password'
          description='To reset your password, enter your phone number'
          onBack={goToPreviousStep}
        />

        <div className='space-y-6 mt-4'>
          <Input
            id='email'
            type='email'
            label='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='you@company.com'
            error={error}
            required
          />
          <Button
            type='submit'
            disabled={!email || loading}
            variant='login'
            onClick={handleSubmit}
          >
            {loading ? 'Loading...' : 'Continue'}
          </Button>
        </div>
      </AuthLayoutWrapper>
    </div>
  );
};

export default ForgotPassword;
