'use client';

import React, { useState } from 'react';
import AuthLayoutWrapper from '../AuthLayout';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/components/context/authContext/AuthContext';
import { forgotPassword, verifyOtp } from '@/lib/auth-api';
import AuthHeader from '@/components/auth/AuthHeader';
import OtpInput from '@/components/ui/otp-input';
import { Button } from '@/components/ui/button';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { state, setState, resetState } = useAuthContext();
  const router = useRouter();
  const goToPreviousStep = () => {
    router.back();
  };

  const resendOtp = async () => {
    const data = await forgotPassword(state.resetEmail);
    return data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await verifyOtp({ otp, email: state.resetEmail });
      router.push('/reset-password');
      setState({
        tempOtp: otp,
        otpVerified: true,
      });
      return data;
    } catch (err) {
      setError('Invalid credential');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayoutWrapper>
      <AuthHeader
        title='Enter 6-digit OTP'
        description='Please the OTP that was sent to your phone number'
        onBack={goToPreviousStep}
      />

      <OtpInput
        length={6}
        value={otp}
        onChange={setOtp}
        error={error}
        onResend={resendOtp}
      />

      <Button
        type='submit'
        disabled={otp.length !== 6}
        onClick={handleSubmit}
        variant='login'
      >
        Verify
      </Button>
    </AuthLayoutWrapper>
  );
};

export default VerifyOtp;
