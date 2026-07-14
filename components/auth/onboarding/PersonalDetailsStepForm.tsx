'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PhoneInput from '@/components/ui/phone-input';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  personalDetailsSchema,
  PersonalDetailsSchema,
} from './OnboardingValidation';
import OnboardingHeader from './OnboardingHeader';
import { CircleAlert } from 'lucide-react';

interface Props {
  onNextStep: () => void;
  data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    bvn: string;
    countryCode: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  progressValue: number;
  onChange: (data: Partial<Props['data']>) => void;
}

const PersonalDetailsStepForm: React.FC<Props> = ({
  onNextStep,
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
  } = useForm<PersonalDetailsSchema>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: data,
    mode: 'onChange',
  });

  const onSubmit = (values: PersonalDetailsSchema) => {
    onChange(values);
    onNextStep();
  };

  return (
    <div>
      <OnboardingHeader
        title='Personal details'
        description='Please enter the details below to register'
        progressValue={progressValue}
        showProgress
        step={{ current: 1, total: 4 }}
      />
      <form onSubmit={handleSubmit(onSubmit)} className='mt-8 space-y-4'>
        <div className='space-y-4'>
          <Input
            label='First Name'
            id='firstName'
            {...register('firstName')}
            placeholder='Enter your first name'
            error={errors.firstName?.message}
          />
          <Input
            label='Last Name'
            id='lastName'
            {...register('lastName')}
            placeholder='Enter your last name'
            error={errors.lastName?.message}
          />
          <Input
            label='Email'
            type='email'
            id='email'
            placeholder='Enter your email'
            {...register('email')}
            error={errors.email?.message}
          />
          <PhoneInput
            text='Phone Number'
            value={data.phone}
            countryCode={data.countryCode || '+234'}
            onChange={(phone) =>
              setValue('phone', phone, { shouldValidate: true })
            }
            onCountryChange={(code) =>
              setValue('countryCode', code, { shouldValidate: true })
            }
            error={errors.phone?.message}
            disabled
          />
          <div>
            <Input
              id='bvn'
              label='BVN'
              placeholder='Enter your BVN'
              error={errors.bvn?.message}
              {...register('bvn')}
            />
            <div className='flex items-center justify-start gap-2 text-[10px] sm:text-xs text-[#868C98] mb-2 bg-[#F7F7F7] rounded-lg h-10 px-3 mt-2 '>
              <CircleAlert className='w-4 h-4' />
              <span>Forgot your BVN? Dial *565*0#</span>
            </div>
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

export default PersonalDetailsStepForm;
