'use client';
import React, { useState } from 'react';
import AuthLayoutWrapper from '../AuthLayout';
import AuthHeader from '@/components/auth/AuthHeader';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { passwordHints } from '@/components/auth/onboarding/SetPasswordStepForm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  PasswordDetailsSchema,
  passwordSchema,
} from '@/components/auth/onboarding/OnboardingValidation';
import { PasswordInput } from '@/components/ui/password-input';
import { Check } from 'lucide-react';
import { resetPassword } from '@/lib/auth-api';
import { useAuthContext } from '@/components/context/authContext/AuthContext';
import PasswordResetSuccess from '@/components/auth/PasswordResetSuccess';

const ResetPassword = () => {
  const [resetSuccessful, setResetSuccessful] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const goToPreviousStep = () => {
    router.back();
  };

  const { state, resetState } = useAuthContext();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<PasswordDetailsSchema>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '', confirmPassword: '' },
    mode: 'onChange',
  });

  const passwordValue = watch('password') || '';

  const validHints = passwordHints.filter((hint) => {
    switch (hint) {
      case 'At least 8 characters in length':
        return passwordValue.length >= 8;
      case 'Lower case letters (a-z)':
        return /[a-z]/.test(passwordValue);
      case 'Upper case letters (A-Z)':
        return /[A-Z]/.test(passwordValue);
      case 'Numbers (0-9)':
        return /\d/.test(passwordValue);
      case 'Special characters (!@#$%^&*)':
        return /[!@#$%^&*]/.test(passwordValue);
      default:
        return false;
    }
  });
  const onSubmit = async (values: PasswordDetailsSchema) => {
    try {
      await resetPassword({
        otp: state.tempOtp,
        newPassword: values.password,
        password_confirmation: values.confirmPassword,
        email: state.resetEmail,
      });
      setResetSuccessful(true);
      resetState();
    } catch (error) {
      setError('Opppsss, something went wrong!');
    }
  };

  return resetSuccessful ? (
    <PasswordResetSuccess />
  ) : (
    <AuthLayoutWrapper>
      <div className=''>
        <AuthHeader
          title='Reset your password'
          description='Please enter your new password to set it up'
          onBack={goToPreviousStep}
        />

        <form onSubmit={handleSubmit(onSubmit)} className='mt-8 space-y-4'>
          <div className='h-[17rem] overflow-y-auto custom-scrollbar mt-4 pr-2'>
            <div className='space-y-4'>
              <PasswordInput
                id='password'
                label='Password'
                required
                {...register('password')}
                placeholder='Enter your password'
                error={errors.password?.message}
              />
              <PasswordInput
                id='confirmPassword'
                label='Confirm Password'
                {...register('confirmPassword')}
                placeholder='Enter your password'
                error={errors.confirmPassword?.message}
              />
            </div>
            <div className='p-4 mt-4 rounded-xl bg-[#F7F7F7] dark:bg-[#1E1E21]'>
              <h3 className='font-medium text-sm mb-3 text-[#1A202C] dark:text-white'>
                Password must contain:
              </h3>
              <div className='flex flex-col gap-2'>
                {passwordHints.map((hint) => {
                  const isValid = validHints.includes(hint);
                  return (
                    <label
                      key={hint}
                      className='flex items-center gap-2 cursor-pointer'
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center transition-all border dark:border-transparent ${
                          isValid
                            ? 'bg-[#00A218]'
                            : 'bg-white dark:bg-[#242426]'
                        }`}
                      >
                        {isValid && <Check className='w-3 h-3 text-white' />}
                      </div>
                      <span className='text-xs text-[#1A202C] dark:text-white'>
                        {hint}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
          <Button type='submit' disabled={!isValid} variant='login'>
            Reset password
          </Button>
        </form>
      </div>
    </AuthLayoutWrapper>
  );
};

export default ResetPassword;
