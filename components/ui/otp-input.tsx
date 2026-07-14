import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (otp: string) => void;
  onComplete?: (otp: string) => void;
  onResend?: () => void;
  error?: string;
}

const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  value,
  onChange,
  onComplete,
  onResend,
  error,
}) => {
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const otp = value.split('').concat(Array(length - value.length).fill(''));

  // handle typing
  const handleChange = (val: string, index: number) => {
    if (!/^[0-9]?$/.test(val)) return; // only numbers
    const newOtp = [...otp];
    newOtp[index] = val;
    const newOtpStr = newOtp.join('');
    onChange(newOtpStr);

    if (val && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newOtpStr.length === length && !newOtp.includes('')) {
      onComplete?.(newOtpStr);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').slice(0, length);
    if (!/^\d+$/.test(pasted)) return;
    onChange(pasted);
    if (pasted.length === length) onComplete?.(pasted);
  };

  // resend logic
  useEffect(() => {
    if (!canResend && countdown > 0) {
      const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handleResendOTP = () => {
    if (!canResend) return;
    setCountdown(30);
    setCanResend(false);
    onChange('');
    inputsRef.current[0]?.focus();
    onResend?.();
  };

  return (
    <div className='w-full'>
      <div className='flex items-center justify-start gap-2 my-4'>
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el!;
            }}
            type='text'
            inputMode='numeric'
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className={cn(
              'text-center text-base w-10 h-10 border rounded-md outline-none transition-colors',
              'focus:border-[#FC6401] focus:ring-1 focus:ring-[#FC6401]',
              error ? 'border-red-500' : 'border-gray-300'
            )}
          />
        ))}
      </div>

      {error && (
        <p className='text-red-500 text-sm text-center mb-4'>{error}</p>
      )}

      {onResend && (
        <div className='text-center mb-4 flex items-center justify-center underline'>
          <p className='text-sm text-[#868C98] mr-1'>
            Didn&apos;t receive the code?
          </p>
          <Button
            variant='link'
            onClick={handleResendOTP}
            disabled={!canResend}
            className='text-[#E87722]'
          >
            {canResend ? 'Resend OTP' : `Resend in ${countdown}s`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default OtpInput;
