import { Button } from '@/components/ui/button'
import FileUploadField from '@/components/ui/file-upload'
import { Input } from '@/components/ui/input'
import { SelectInput } from '@/components/ui/select-input'
import { TextArea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';


interface DisputeForm {
  referenceId: string;
  disputeReason: string;
  attachment: File | null;
  disputeDetails: string;
}

const RaiseDisputeView = () => {
  const data = {
    referenceId: '123838828828',
    disputeReason: '',
    disputeDetails: '',
    uploadId: null,
    attachment: null,
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DisputeForm>({
    defaultValues: data,
    mode: 'onBlur',
  });

  const disableBtn = false;
  const formValues = watch();


  const onSubmit = (values: DisputeForm) => {

  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='mt-2 space-y-4'>

      <div className='space-y-10'>
        <Input
          label='Reference ID'
          id='referenceId'
          required={false}
          {...register('referenceId', {
            required: 'Reference ID is required',
          })}
          placeholder='Enter reference ID'
          error={errors.referenceId?.message}
        />
        <div>
          <SelectInput
            label='Reason for Dispute'
            placeholder='Choose a reason'
            value={formValues.disputeReason}
            onChange={(value) => setValue('disputeReason', value)}
            options={[
              { value: 'national_id', label: 'Failed Transaction' },
              { value: 'national_ids', label: 'Incorrect Amount' },
              { value: 'national_iddd', label: 'Unauthorized Change' },
            ]}
            error={errors.disputeReason?.message}
          />
        </div>

        <div className="">
          <label
            className='block text-sm font-medium mb-1.5'
            style={{ color: '#344054' }}>
            Details of Dispute
          </label>
          <TextArea
            {...register('disputeDetails', {
              required: 'Dispute details is required',
            })}
            onChange={(e) => setValue?.("disputeDetails", e.target.value)}
            placeholder="Enter more details for this dispute"
            style={{ fontSize: '16px', fontWeight: 400, lineHeight: '24px' }}
            rows={4}
          />

        </div>

        <div className='mt-6'>
          <FileUploadField
            label='Attachment (optional)'
            file={formValues.attachment}
            onChange={(file) => setValue('attachment', file)}
            error={errors.attachment?.message}
          />
        </div>
      </div>

      <div className="flex items-center w-full justify-end space-x-5 pt-8">
        {/* <Button
          type="button"
          variant="secondary"
          onClick={() => { }}>
          Back
        </Button> */}

        <Button
          type='submit'
          disabled={disableBtn}
          variant='login'
          className='w-max'
        >
          Submit Dispute
        </Button>
      </div>
    </form>
  )
}

export default RaiseDisputeView