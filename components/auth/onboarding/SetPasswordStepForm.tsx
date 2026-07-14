import { Button } from '@/components/ui/button';
import React from 'react';
import OnboardingHeader from './OnboardingHeader';
import { PasswordDetailsSchema, passwordSchema } from './OnboardingValidation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PasswordInput } from '@/components/ui/password-input';
import { Check } from 'lucide-react';

export const passwordHints = [
  'At least 8 characters in length',
  'Lower case letters (a-z)',
  'Upper case letters (A-Z)',
  'Numbers (0-9)',
  'Special characters (!@#$%^&*)',
];

interface Props {
  onBack: () => void;
  onNextStep: () => void;
  data: {
    password: string;
    confirmPassword: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  progressValue: number;
  onChange: (data: Partial<Props['data']>) => void;
}

const SetPasswordStepForm: React.FC<Props> = ({
  onNextStep,
  onBack,
  data,
  setFormData,
  progressValue,
  onChange,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<PasswordDetailsSchema>({
    resolver: zodResolver(passwordSchema),
    defaultValues: data,
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

  const onSubmit = (values: PasswordDetailsSchema) => {
    onChange(values);
    onNextStep();
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };
  return (
    <div>
      <OnboardingHeader
        title='Create a secure password'
        description='Enter a secure password to protect your account'
        progressValue={progressValue}
        showProgress
        step={{ current: 2, total: 4 }}
        onBack={onBack}
      />
      <form onSubmit={handleSubmit(onSubmit)} className='mt-8 space-y-4'>
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
          Continue
        </Button>
        <p className='text-center text-sm text-gray-600 dark:text-muted-foreground'>
          <a
            href='/login'
            className='text-gray-900 dark:text-foreground hover:text-[#E87722] underline'
          >
            Already have an account? Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default SetPasswordStepForm;
