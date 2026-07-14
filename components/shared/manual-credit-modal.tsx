import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { InfoAlert } from '@/components/ui/info-alert';
import { useState, useEffect } from 'react';
import { manualCreditApi, manualDebitApi } from '@/lib/manual-credit-api';
import useDashboardProps from '../context/dashboard-global/useDashboardProps';
import { SelectInput } from '../ui/select-input';

interface ManualCreditModalProps {
  open: boolean;
  onClose: () => void;
  type: 'credit' | 'debit';
  userEmail?: string;
  entityType?: 'user' | 'agent' | 'merchant';
}

export function ManualCreditModal({
  open,
  onClose,
  type,
  userEmail,
  entityType = 'user',
}: ManualCreditModalProps) {
  const [step, setStep] = useState<'form' | 'confirm'>('form');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    beneficiary: '',
    wallet_type: 'default',
    provider_id: '4',
    password: '',
  });
  const { activeTableRow } = useDashboardProps();

  useEffect(() => {
    if (activeTableRow && activeTableRow?.email?.length > 0) {
      setFormData((prev) => ({ ...prev, beneficiary: activeTableRow?.email }));
    }
  }, [activeTableRow]);

  const [confirmData, setConfirmData] = useState<any>(null);

  const handleInitialize = async () => {
    setLoading(true);
    try {
      const api = type === 'debit' ? manualDebitApi : manualCreditApi;
      const response = await api.initialize(formData);
      setConfirmData(response.data);
      setStep('confirm');
    } catch (error) {
      console.error('Initialize failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const api = type === 'debit' ? manualDebitApi : manualCreditApi;
      await api.complete({ reference: confirmData.reference });
      onClose();
      setStep('form');
      setFormData({
        amount: '',
        beneficiary: userEmail || '',
        wallet_type: 'default',
        provider_id: '4',
        password: '',
      });
      setConfirmData(null);
    } catch (error) {
      console.error('Complete failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setStep('form');
    setFormData({
      amount: '',
      beneficiary: userEmail || '',
      wallet_type: 'default',
      provider_id: '4',
      password: '',
    });
    setConfirmData(null);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={type === 'credit' ? 'Manual Credit' : 'Manual Debit'}
      size='lg'
    >
      {step === 'form' ? (
        <div className='space-y-4'>
          <InfoAlert>
            This action will {type} the amount{' '}
            {type === 'credit' ? 'to' : 'from'} the {entityType}&apos;s wallet.
          </InfoAlert>

          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium mb-2 text-[#344054] dark:text-foreground'>
                Amount <span className='text-red-500'>*</span>
              </label>
              <Input
                type='text'
                currency
                placeholder='0.00'
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-2 text-[#344054] dark:text-foreground'>
                Beneficiary Email <span className='text-red-500'>*</span>
              </label>
              <Input
                type='email'
                placeholder='Enter email'
                value={formData.beneficiary}
                onChange={(e) =>
                  setFormData({ ...formData, beneficiary: e.target.value })
                }
              />
            </div>

            <div>
              <SelectInput
                label='Wallet Type'
                value={formData.wallet_type}
                onChange={(val: string) =>
                  setFormData({ ...formData, wallet_type: val })
                }
                options={[
                  { label: 'Default', value: 'default' },
                  { label: 'Commission', value: 'commission' },
                ]}
                placeholder='Select wallet type'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-2 text-[#344054] dark:text-foreground'>
                Provider ID <span className='text-red-500'>*</span>
              </label>
              <Input
                type='text'
                placeholder='Enter provider ID'
                value={formData.provider_id}
                onChange={(e) =>
                  setFormData({ ...formData, provider_id: e.target.value })
                }
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-2 text-[#344054] dark:text-foreground'>
                Enter your account password to authorize this action{' '}
                <span className='text-red-500'>*</span>
              </label>
              <Input
                required
                type='text'
                placeholder='Enter password'
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </div>

          <div className='flex gap-4 pt-2'>
            <Button
              variant='secondary'
              onClick={handleClose}
              className='flex-1'
            >
              Cancel
            </Button>
            <Button
              variant='theme'
              onClick={handleInitialize}
              loading={loading}
              disabled={
                !formData.amount ||
                !formData.beneficiary ||
                !formData.wallet_type ||
                !formData.provider_id ||
                formData.password?.length < 3
              }
              className='flex-1'
            >
              Continue
            </Button>
          </div>
        </div>
      ) : (
        <div className='space-y-4'>
          <InfoAlert>
            Please review the details below before confirming the transaction.
          </InfoAlert>

          <div className='space-y-3 p-4 border border-border rounded-lg'>
            <div className='flex justify-between'>
              <span className='text-sm text-gray-600'>Beneficiary</span>
              <span className='text-sm font-medium'>
                {confirmData?.beneficiary_name}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-gray-600'>Email</span>
              <span className='text-sm font-medium'>
                {confirmData?.beneficiary}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-gray-600'>Wallet Type</span>
              <span className='text-sm font-medium capitalize'>
                {confirmData?.wallet_type}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-gray-600'>Amount</span>
              <span className='text-sm font-medium'>
                ₦{confirmData?.amount?.toLocaleString()}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-gray-600'>Amount to Receive</span>
              <span className='text-sm font-medium'>
                ₦{confirmData?.amount_to_received?.toLocaleString()}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-gray-600'>Service Charge</span>
              <span className='text-sm font-medium'>
                ₦{confirmData?.service_charge?.toLocaleString()}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-gray-600'>VAT</span>
              <span className='text-sm font-medium'>
                ₦{confirmData?.vat?.toLocaleString()}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-gray-600'>Reference</span>
              <span className='text-sm font-medium font-mono'>
                {confirmData?.reference}
              </span>
            </div>
          </div>

          <div className='flex gap-4 pt-2'>
            <Button
              variant='secondary'
              onClick={() => setStep('form')}
              disabled={loading}
              className='flex-1'
            >
              Back
            </Button>
            <Button
              variant='success'
              onClick={handleComplete}
              loading={loading}
              className='flex-1'
            >
              Confirm
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
