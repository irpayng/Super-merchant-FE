import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';

interface OnboardingHeaderProps {
  title: string;
  description: string;
  progressValue?: number;
  showProgress?: boolean;
  step?: {
    current: number;
    total: number;
  };
  showBackBtn?: boolean;
  onBack?: () => void;
}

const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  title,
  description,
  progressValue,
  showProgress = false,
  step,
  onBack,
  showBackBtn,
}) => {
  return (
    <div className='mt-3'>
      <Image src={'/LogowithBorder.svg'} alt='logo' width={140} height={50} />
      {(showBackBtn || !title.includes('Personal')) && (
        <Button
          onClick={onBack}
          variant='activeGhost'
          className='h-12 w-12 flex justify-center items-center rounded-full bg-white dark:bg-[#2a2a2d] dark:text-white shadow-md p-3 mb-3'
        >
          <ArrowLeft />
        </Button>
      )}
      <h2
        className='text-gray-900 dark:text-foreground mt-3'
        style={{
          fontWeight: 600,
          fontSize: '20px',
          lineHeight: '24px',
          letterSpacing: '0%',
        }}
      >
        {title}
      </h2>
      <p className='mt-2 text-gray-400 dark:text-muted-foreground text-sm'>
        {description}
      </p>

      {showProgress && (
        <div className='w-full flex items-center justify-between gap-4'>
          <div className='flex-1'>
            <Progress
              value={progressValue ?? 0}
              className='[&>div]:bg-[#FC6401] transition-all duration-500 ease-in-out'
            />
          </div>
          {step && (
            <p className='text-sm text-[#525866] font-medium whitespace-nowrap'>
              Step {step.current ?? 0} of {step.total ?? 0}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default OnboardingHeader;
