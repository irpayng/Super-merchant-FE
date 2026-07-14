import React, { useState } from 'react';
import OnboardingHeader from './OnboardingHeader';
import OtpInput from '@/components/ui/otp-input';
import { Button } from '@/components/ui/button';

interface Props {
  onBack: () => void;
  onNextStep: () => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  progressValue: number;
  onChange: (data: Partial<{ otp: string }>) => void;
}
const EmailVerification: React.FC<Props> = ({
  onNextStep,
  onBack,
  setFormData,
  progressValue,
  onChange,
}) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    onChange({ otp });
    setFormData(otp);
    onNextStep();
  };

  return (
    <div>
      <OnboardingHeader
        title='Verify email address'
        description='Please the OTP that was sent to your email address'
        progressValue={progressValue}
        showProgress
        step={{ current: 3, total: 4 }}
        onBack={onBack}
      />

      <OtpInput
        length={4}
        value={otp}
        onChange={setOtp}
        error={error}
        onResend={() => {}}
      />

      <Button
        type='submit'
        disabled={otp.length !== 4}
        onClick={handleSubmit}
        variant='login'
      >
        Verify
      </Button>
    </div>
  );
};

export default EmailVerification;
