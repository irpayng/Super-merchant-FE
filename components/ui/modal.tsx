'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface ModalFooterProps {
  /** Text for the secondary (left) button. Defaults to "Cancel" */
  cancelText?: string;
  /** Text for the primary (right) button. Defaults to "Submit" */
  submitText?: string;
  /** Variant for the primary button. Defaults to "theme" */
  submitVariant?: 'theme' | 'danger' | 'success' | 'primary';
  /** Whether the primary button shows a loading spinner */
  loading?: boolean;
  /** Whether the primary button is disabled */
  disabled?: boolean;
  /** Handler for the secondary button click. Falls back to modal onClose */
  onCancel?: () => void;
  /** Handler for the primary button click */
  onSubmit?: () => void;
  /** If set, the primary button becomes type="submit" with this form ID */
  formId?: string;
  /** Hide the cancel/secondary button */
  hideCancelButton?: boolean;
}

export function ModalFooter({
  cancelText = 'Cancel',
  submitText = 'Submit',
  submitVariant = 'theme',
  loading = false,
  disabled = false,
  onCancel,
  onSubmit,
  formId,
  hideCancelButton = false,
}: ModalFooterProps) {
  return (
    <div className='flex gap-4'>
      {!hideCancelButton && (
        <Button
          type='button'
          variant='secondary'
          onClick={onCancel}
          disabled={loading}
          className='flex-1'
        >
          {cancelText}
        </Button>
      )}
      <Button
        type={formId ? 'submit' : 'button'}
        form={formId}
        variant={submitVariant}
        onClick={formId ? undefined : onSubmit}
        loading={loading}
        disabled={disabled}
        className='flex-1'
      >
        {submitText}
      </Button>
    </div>
  );
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  children: React.ReactNode;
  footer?: React.ReactNode;
  showCloseButton?: boolean;
  closeOnOverlay?: boolean;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  size = 'md',
  children,
  footer,
  showCloseButton = true,
  closeOnOverlay = true,
}: ModalProps) {
  const sizes = {
    sm: 'min-w-[384px] max-w-sm',
    md: 'min-w-[448px] max-w-md',
    lg: 'min-w-[512px] max-w-lg',
    xl: 'min-w-[576px] max-w-xl',
    '2xl': 'min-w-[672px] max-w-2xl',
    '3xl': 'w-full h-full md:max-w-4xl md:h-auto md:rounded-xl',
    full: 'max-w-full mx-4',
  };

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-[60] flex justify-center m-0',
        size === '3xl' ? 'items-stretch md:items-center' : 'items-center',
      )}
      style={{ margin: 0 }}
    >
      <div
        className='absolute inset-0 bg-black/50'
        onClick={closeOnOverlay ? onClose : undefined}
      />
      <div
        className={cn(
          'relative bg-white dark:bg-card shadow-lg flex flex-col max-h-[90vh]',
          size === '3xl' ? 'rounded-none md:rounded-xl' : 'rounded-xl',
          sizes[size],
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className='flex items-center justify-between p-6 border-b border-[#F1F1F1] dark:border-border flex-shrink-0'>
            <div>
              {title && (
                <h2 className='text-foreground text-lg font-medium leading-7'>
                  {title}
                </h2>
              )}
              {description && (
                <p className='text-muted-foreground text-sm font-normal leading-5 mt-1'>
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <Button
                onClick={onClose}
                variant='text'
                className='text-gray-400 hover:text-gray-600 transition-colors p-0'
              >
                <X className='h-5 w-5' />
              </Button>
            )}
          </div>
        )}

        {/* Scrollable Content */}
        <div className='p-6 space-y-4 overflow-y-auto flex-1'>{children}</div>

        {/* Fixed Footer */}
        {footer && (
          <div className='p-6 border-t border-[#F1F1F1] dark:border-border flex-shrink-0'>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
