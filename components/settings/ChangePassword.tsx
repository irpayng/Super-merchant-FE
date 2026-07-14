'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { passwordHints } from '../auth/onboarding/SetPasswordStepForm';
import { PasswordInput } from '../ui/password-input';
import { Check } from 'lucide-react';

const ChangePassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validHints, setValidHints] = useState<string[]>([]);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const updatedHints = passwordHints.filter((hint) => {
      switch (hint) {
        case 'At least 8 characters in length':
          return password.length >= 8;
        case 'Lower case letters (a-z)':
          return /[a-z]/.test(password);
        case 'Upper case letters (A-Z)':
          return /[A-Z]/.test(password);
        case 'Numbers (0-9)':
          return /\d/.test(password);
        case 'Special characters (!@#$%^&*)':
          return /[!@#$%^&*]/.test(password);
        default:
          return false;
      }
    });

    setValidHints(updatedHints);
    setErrors({
      password:
        updatedHints.length === passwordHints.length || password === ''
          ? undefined
          : 'Password does not meet all requirements',
      confirmPassword:
        confirmPassword === '' || password === confirmPassword
          ? undefined
          : 'Passwords do not match',
    });
    setIsValid(
      updatedHints.length === passwordHints.length &&
        password === confirmPassword
    );
  }, [password, confirmPassword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      console.log('Password changed:', password);
    }
  };

  return (
    <div className='max-w-xl'>
      <form onSubmit={handleSubmit} className='mt-8 space-y-4'>
        <div className='space-y-4'>
          <PasswordInput
            id='password'
            label='Password'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Enter your password'
            error={errors.password}
          />
          <PasswordInput
            id='confirmPassword'
            label='Confirm Password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder='Enter your password'
            error={errors.confirmPassword}
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
                      isValid ? 'bg-[#00A218]' : 'bg-white dark:bg-[#242426]'
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

        <Button type='submit' disabled={!isValid} variant='login'>
          Save changes
        </Button>
      </form>
    </div>
  );
};

export default ChangePassword;
