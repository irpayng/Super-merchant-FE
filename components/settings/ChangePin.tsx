import React, { useEffect, useState } from 'react';
import OtpInput from '../ui/otp-input';
import { Button } from '../ui/button';

const ChangePin = () => {
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [errors, setErrors] = useState<{
    oldPin?: string;
    newPin?: string;
    confirmPin?: string;
  }>({});
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const updatedErrors: typeof errors = {};

    if (oldPin && oldPin.length !== 4) {
      updatedErrors.oldPin = 'PIN must be 4 digits';
    }

    if (newPin && newPin.length !== 4) {
      updatedErrors.newPin = 'PIN must be 4 digits';
    }

    if (confirmPin && confirmPin.length !== 4) {
      updatedErrors.confirmPin = 'PIN must be 4 digits';
    } else if (newPin && confirmPin && newPin !== confirmPin) {
      updatedErrors.confirmPin = 'PINs do not match';
    }

    setErrors(updatedErrors);

    setIsValid(
      oldPin.length === 4 &&
        newPin.length === 4 &&
        confirmPin.length === 4 &&
        newPin === confirmPin
    );
  }, [oldPin, newPin, confirmPin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      console.log('PIN changed:', { oldPin, newPin });
    }
  };

  return (
    <div className='max-w-xl'>
      <form onSubmit={handleSubmit} className='mt-8 space-y-4'>
        <div className='mt-3'>
          <p className='text-sm font-medium text-[#1A202C] dark:text-white'>
            Old PIN
          </p>
          <OtpInput
            length={4}
            value={oldPin}
            onChange={setOldPin}
            error={errors.oldPin}
          />
        </div>
        <div className='mt-3'>
          <p className='text-sm font-medium text-[#1A202C] dark:text-white'>
            New PIN
          </p>
          <OtpInput
            length={4}
            value={newPin}
            onChange={setNewPin}
            error={errors.newPin}
          />
        </div>
        <div>
          <p className='text-sm font-medium text-[#1A202C] dark:text-white'>
            Confirm PIN
          </p>
          <OtpInput
            length={4}
            value={confirmPin}
            onChange={setConfirmPin}
            error={errors.confirmPin}
          />
        </div>
        <Button type='submit' disabled={!isValid} variant='login'>
          Save changes
        </Button>
      </form>
    </div>
  );
};

export default ChangePin;
