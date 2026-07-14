import React from 'react';
import OnboardingHeader from './OnboardingHeader';
import OtpInput from '@/components/ui/otp-input';
import { useForm } from 'react-hook-form';
import {
  transactionPinSchema,
  TransactionPinSchema,
} from './OnboardingValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';

interface Props {
  onNextStep: () => void;
  onBack: () => void;
  data: {
    pin: string;
    confirmPin: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  progressValue: number;
  onChange: (data: Partial<Props['data']>) => void;
}

const TransactionPin: React.FC<Props> = ({
  onNextStep,
  onBack,
  data,
  setFormData,
  progressValue,
  onChange,
}) => {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<TransactionPinSchema>({
    resolver: zodResolver(transactionPinSchema),
    mode: 'onChange',
    defaultValues: { pin: '', confirmPin: '' },
  });
  const pinValue = watch('pin');
  const confirmPinValue = watch('confirmPin');

  const onSubmit = (values: TransactionPinSchema) => {
    console.log('val', values);
    onChange(values);
    setFormData(values);
    onNextStep();
  };

  return (
    <div>
      <OnboardingHeader
        title='Create transaction PIN'
        description='Please enter your PIN to authorise this transaction'
        progressValue={progressValue}
        showProgress
        step={{ current: 3, total: 4 }}
        onBack={onBack}
      />

      <form onSubmit={handleSubmit(onSubmit)} className='mt-8 space-y-4'>
        <div className='mt-3'>
          <p className='text-sm font-medium text-[#1A202C] dark:text-white'>
            Enter PIN
          </p>
          <OtpInput
            length={4}
            value={pinValue || ''}
            onChange={(val: string) =>
              setValue('pin', val, { shouldValidate: true })
            }
            error={errors.pin?.message}
          />
        </div>
        <div>
          <p className='text-sm font-medium text-[#1A202C] dark:text-white'>
            Confirm PIN
          </p>
          <OtpInput
            length={4}
            value={confirmPinValue || ''}
            onChange={(val: string) =>
              setValue('confirmPin', val, { shouldValidate: true })
            }
            error={errors.confirmPin?.message}
          />
        </div>
        <Button type='submit' disabled={!isValid} variant='login'>
          Continue
        </Button>
      </form>
    </div>
  );
};

export default TransactionPin;
