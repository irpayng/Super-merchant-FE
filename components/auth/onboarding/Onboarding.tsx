import React, { useState } from 'react';
import PersonalDetailsStepForm from './PersonalDetailsStepForm';
import SetPasswordStepForm from './SetPasswordStepForm';
import EmailVerification from './EmailVerification';
import BusinessDetailsStepForm from './BusinessDetailsStepForm';
import TransactionPin from './TransactionPin';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '+234',
    bvn: '',
    otp: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    ownerIdType: '',
    uploadId: null,
    uploadCac: null,
    pin: '',
    confirmPin: '',
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };
  const totalSteps = 5;
  const progressValue = (step / totalSteps) * 100;

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <PersonalDetailsStepForm
            data={formData}
            setFormData={setFormData}
            onNextStep={nextStep}
            progressValue={progressValue}
            onChange={updateFormData}
          />
        );
      case 1:
        return (
          <SetPasswordStepForm
            data={formData}
            setFormData={setFormData}
            onNextStep={nextStep}
            onBack={prevStep}
            progressValue={progressValue}
            onChange={updateFormData}
          />
        );
      case 2:
        return (
          <EmailVerification
            setFormData={setFormData}
            onNextStep={nextStep}
            onBack={prevStep}
            progressValue={progressValue}
            onChange={updateFormData}
          />
        );
      case 3:
        return (
          <TransactionPin
            setFormData={setFormData}
            onNextStep={nextStep}
            onBack={prevStep}
            data={formData}
            progressValue={progressValue}
            onChange={updateFormData}
          />
        );
      case 4:
        return (
          <BusinessDetailsStepForm
            setFormData={setFormData}
            onNextStep={nextStep}
            onBack={prevStep}
            data={formData}
            progressValue={progressValue}
          />
        );

      default:
        return (
          <div>
            {' '}
            <div className='text-left mb-4'>
              <h2
                className='text-gray-900 dark:text-foreground'
                style={{
                  fontWeight: 600,
                  fontSize: '24px',
                  lineHeight: '24px',
                  letterSpacing: '0%',
                }}
              >
                Account created!
              </h2>
              <p className='mt-2 text-gray-400 dark:text-muted-foreground text-sm'>
                Congratulations. You account has been created successfully.
              </p>
            </div>
            <Button
              type='submit'
              variant='login'
              onClick={() => {
                router.push('/dashboard');
              }}
            >
              Continue to Dashboard
            </Button>
          </div>
        );
    }
  };

  return <div>{renderStep()}</div>;
};

export default Onboarding;
