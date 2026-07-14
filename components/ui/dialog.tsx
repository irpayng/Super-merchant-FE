'use client';

import * as React from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from './button';
import { Modal } from './modal';
import { TextArea } from './textarea';
import { Input } from './input';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (password?: string) => void | Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'success' | 'warning';
  showInput?: boolean;
  inputLabel?: string;
  inputPlaceholder?: string;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  children?: React.ReactNode;
  requirePassword?: boolean;
}

export function Dialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  showInput = false,
  inputLabel,
  inputPlaceholder,
  inputValue = '',
  onInputChange,
  children,
  requirePassword,
}: DialogProps) {
  const [loading, setLoading] = React.useState(false);
  const [password, setPassword] = React.useState("")

  const icons = {
    danger: <XCircle className='h-6 w-6' />,
    success: <CheckCircle className='h-6 w-6' />,
    warning: <AlertCircle className='h-6 w-6' />,
  };

  const iconBgColors = {
    danger: 'bg-red-50',
    success: 'bg-green-50',
    warning: 'bg-orange-50',
  };

  const iconColors = {
    danger: 'text-red-600',
    success: 'text-green-600',
    warning: 'text-orange-600',
  };

  const buttonVariants = {
    danger: 'danger' as const,
    success: 'success' as const,
    warning: 'theme' as const,
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(password);
      onClose();
    } catch (error) {
      console.error('Dialog action failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} size='md' showCloseButton={false}>
      <div className='space-y-4'>
        <div
          className={`w-12 h-12 rounded-full ${iconBgColors[variant]} ${iconColors[variant]} flex items-center justify-center`}
          onClick={onClose}
        >
          {icons[variant]}
        </div>

        <div>
          <h3 className='text-lg font-semibold mb-2'>{title}</h3>
          <p className='text-gray-600 dark:text-gray-400 text-sm'>{description}</p>
        </div>

        {children ? (
          <div className='space-y-2'>
            {inputLabel && (
              <label
                className='block text-sm font-medium'
                style={{ color: '#344054' }}
              >
                {inputLabel}
              </label>
            )}
            {children}
          </div>
        ) : showInput ? (
          <div className='space-y-2'>
            {inputLabel && (
              <label
                className='block text-sm font-medium'
                style={{ color: '#344054' }}
              >
                {inputLabel}
              </label>
            )}
            <TextArea
              value={inputValue}
              onChange={(e) => onInputChange?.(e.target.value)}
              placeholder={inputPlaceholder}
              style={{ fontSize: '16px', fontWeight: 400, lineHeight: '24px' }}
              rows={4}
            />

            {requirePassword && (
              <div className='py-4'>
                <label className="block text-sm font-medium mb-2" style={{ color: '#344054' }}>
                  Enter your account password to authorize this action  <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  type="text"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}
          </div>
        ) : null}

        <div className='flex gap-4 pt-2'>
          <Button
            variant='secondary'
            onClick={onClose}
            disabled={loading}
            className='flex-1'
          >
            {cancelText}
          </Button>
          <Button
            variant={buttonVariants[variant]}
            onClick={handleConfirm}
            loading={loading}
            autoFocus
            disabled={requirePassword && password?.length < 5}
            className='flex-1'
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
