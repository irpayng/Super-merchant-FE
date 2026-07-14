import React, { useState } from 'react';
import OnboardingHeader from './OnboardingHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import FileUploadField from '@/components/ui/file-upload';
import { useForm } from 'react-hook-form';
import { SelectInput } from '@/components/ui/select-input';

interface BusinessDetailsForm {
  businessName: string;
  ownerIdType: string;
  uploadId: File | null;
  uploadCac: File | null;
}
interface Props {
  onNextStep: () => void;
  onBack: () => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  progressValue: number;
  data: {
    businessName: string;
    ownerIdType: string;
    uploadId: File | null;
    uploadCac: File | null;
  };
}

const BusinessDetailsStepForm: React.FC<Props> = ({
  onNextStep,
  onBack,
  setFormData,
  progressValue,
  data = {
    businessName: '',
    ownerIdType: '',
    uploadId: null,
    uploadCac: null,
  },
}) => {
  const [businessName, setBusinessName] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BusinessDetailsForm>({
    defaultValues: data,
    mode: 'onBlur',
  });

  const onSubmit = (values: BusinessDetailsForm) => {
    setFormData((prev: any) => ({ ...prev, ...values }));
    onNextStep();
  };

  const formValues = watch();

  return (
    <div>
      <OnboardingHeader
        title='Business details & documents'
        description='Please enter your business information to complete registration'
        progressValue={progressValue}
        showProgress
        step={{ current: 4, total: 4 }}
        onBack={onBack}
      />

      <form onSubmit={handleSubmit(onSubmit)} className='mt-8 space-y-4'>
        <div className='space-y-4'>
          <Input
            label='Business Name'
            id='businessName'
            required
            {...register('businessName', {
              required: 'Business name is required',
            })}
            placeholder='Enter your business name'
            error={errors.businessName?.message}
          />
          <div>
            <SelectInput
              label='ID Type'
              placeholder='Choose ID type'
              value={formValues.ownerIdType}
              onChange={(value) => setValue('ownerIdType', value)}
              options={[
                { value: 'national_id', label: 'National ID' },
                { value: 'drivers_license', label: 'Driver’s License' },
                { value: 'passport', label: 'International Passport' },
                { value: 'voters_card', label: 'Voter’s Card' },
              ]}
              error={errors.ownerIdType?.message}
            />
          </div>

          <div className='mt-6'>
            <FileUploadField
              label='Upload ID'
              file={formValues.uploadId}
              onChange={(file) => setValue('uploadId', file)}
              error={errors.uploadId?.message}
            />
          </div>

          <div className='mt-6'>
            <FileUploadField
              label='Upload CAC'
              file={formValues.uploadCac}
              onChange={(file) => setValue('uploadCac', file)}
              error={errors.uploadCac?.message}
            />
          </div>
        </div>

        <Button
          type='submit'
          disabled={
            !formValues.businessName ||
            !formValues.ownerIdType ||
            !formValues.uploadId ||
            !formValues.uploadCac
          }
          variant='login'
        >
          Complete
        </Button>
      </form>
    </div>
  );
};

export default BusinessDetailsStepForm;
