'use client';

import * as React from 'react';
import {
  useForm,
  FieldValues,
  Path,
  Resolver,
  PathValue,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Input } from './input';
import { PasswordInput } from './password-input';
import { TextArea } from './textarea';
import { Checkbox } from './checkbox';
import { CheckboxGroup } from './checkbox-group';
import { Radio } from './radio';
import { X, FileText, Trash2, Upload } from 'lucide-react';
import { SelectInput } from './select-input';
import OtpInput from './otp-input';

interface FormField<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type?:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'tel'
    | 'textarea'
    | 'select'
    | 'radio'
    | 'checkbox'
    | 'file'
    | 'checkbox-group'
    | 'custom'
    | 'currency'
    | 'pin';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: { label: string; value: string | number; group?: string }[];
  accept?: string;
  maxSize?: string;
  dragDrop?: boolean;
  searchable?: boolean;
  onSearch?: (
    query: string
  ) => Promise<{ label: string; value: string | number }[]>;
  render?: (props: {
    value: any;
    onChange: (value: any) => void;
    error?: string;
  }) => React.ReactNode;
  helperText?: string | React.ReactNode;
  pinLength?: number;
  onResendOtp?: () => void;
}

interface FormProps<T extends FieldValues> {
  fields: FormField<T>[];
  schema: z.ZodType<T, any, any>;
  onSubmit: (
    data: T,
    options?: { suppressToast?: boolean }
  ) => Promise<void> | void;
  defaultValues?: Partial<T>;
  submitText?: string;
  showReset?: boolean;
  className?: string;
  title?: string;
  description?: string;
  suppressToast?: boolean;
  helperText?: string | React.ReactNode;
  pinLength?: number;
  onResendOtp?: () => void;
}

export function Form<T extends FieldValues>({
  fields,
  schema,
  onSubmit,
  defaultValues,
  submitText = 'Submit',
  showReset = true,
  className,
  title,
  description,
  suppressToast = true,
  helperText,
  pinLength,
  onResendOtp,
}: FormProps<T>) {
  const form = useForm<T>({
    resolver: zodResolver(schema as any) as Resolver<T>,
    defaultValues: defaultValues as any,
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [apiError, setApiError] = React.useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = React.useState<
    Record<string, File | null>
  >({});
  const [dragActive, setDragActive] = React.useState<Record<string, boolean>>(
    {}
  );
  const [selectOpen, setSelectOpen] = React.useState<Record<string, boolean>>(
    {}
  );
  const [searchQuery, setSearchQuery] = React.useState<Record<string, string>>(
    {}
  );
  const [searchResults, setSearchResults] = React.useState<
    Record<string, { label: string; value: string | number }[]>
  >({});
  const [isSearching, setIsSearching] = React.useState<Record<string, boolean>>(
    {}
  );

  const handleSubmit = async (data: T) => {
    setIsSubmitting(true);
    setApiError(null);
    try {
      await onSubmit(data, { suppressToast });
    } catch (error: any) {
      setApiError(error.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className={cn('space-y-4', className)}
    >
      {title && (
        <div className='space-y-1 mb-6'>
          <h3
            style={{
              color: '#1A202C',
              fontSize: '18px',
              fontWeight: 500,
              lineHeight: '28px',
            }}
          >
            {title}
          </h3>
          {description && (
            <p
              style={{
                color: '#475467',
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: '20px',
              }}
            >
              {description}
            </p>
          )}
        </div>
      )}
      {apiError && (
        <div className='p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm flex items-start justify-between gap-2'>
          <span>{apiError}</span>
          <Button
            type='button'
            onClick={() => setApiError(null)}
            variant='text'
            className='text-red-600 hover:text-red-800 flex-shrink-0 p-0'
          >
            <X className='h-4 w-4' />
          </Button>
        </div>
      )}

      {fields.map((field, index) => (
        <div key={`${field.name} ${index}`} className='space-y-2'>
          {field.type !== 'custom' && (
            <label
              htmlFor={field.name}
              className='block text-gray-700 dark:text-foreground text-sm font-medium leading-5'
            >
              {field.label}
              {field.required && <span className='text-red-500 ml-1'>*</span>}
            </label>
          )}

          {field.type === 'custom' && field.render ? (
            field.render({
              value: form.watch(field.name),
              onChange: (value) => form.setValue(field.name, value),
              error: form.formState.errors[field.name]?.message as string,
            })
          ) : field.type === 'textarea' ? (
            <TextArea
              id={field.name}
              {...form.register(field.name)}
              placeholder={field.placeholder}
              disabled={field.disabled}
              error={form.formState.errors[field.name]?.message as string}
              className='shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] disabled:bg-[#F4F4F4]'
              style={{ fontSize: '16px', fontWeight: 400, lineHeight: '24px' }}
              rows={4}
            />
          ) : field.type === 'select' ? (
            field.searchable ? (
              <div className='relative'>
                <Input
                  type='text'
                  placeholder={field.placeholder || 'Search...'}
                  value={searchQuery[field.name] || ''}
                  disabled={field.disabled}
                  error={form.formState.errors[field.name]?.message as string}
                  className='shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] disabled:bg-[#F4F4F4] '
                  style={{
                    fontSize: '16px',
                    fontWeight: 400,
                    lineHeight: '24px',
                  }}
                  onFocus={() =>
                    setSelectOpen((prev) => ({ ...prev, [field.name]: true }))
                  }
                  onBlur={() =>
                    setTimeout(
                      () =>
                        setSelectOpen((prev) => ({
                          ...prev,
                          [field.name]: false,
                        })),
                      200
                    )
                  }
                  onChange={async (e) => {
                    const query = e.target.value;
                    setSearchQuery((prev) => ({
                      ...prev,
                      [field.name]: query,
                    }));

                    if (field.onSearch) {
                      setIsSearching((prev) => ({
                        ...prev,
                        [field.name]: true,
                      }));
                      const results = await field.onSearch(query);
                      setSearchResults((prev) => ({
                        ...prev,
                        [field.name]: results,
                      }));
                      setIsSearching((prev) => ({
                        ...prev,
                        [field.name]: false,
                      }));
                    } else {
                      const filtered =
                        field.options?.filter((opt) =>
                          opt.label.toLowerCase().includes(query.toLowerCase())
                        ) || [];
                      setSearchResults((prev) => ({
                        ...prev,
                        [field.name]: filtered,
                      }));
                    }
                  }}
                />
                {selectOpen[field.name] && (
                  <div className='absolute z-10 w-full mt-1 bg-white border border-[#D0D5DD] rounded-lg shadow-lg max-h-60 overflow-auto'>
                    {isSearching[field.name] ? (
                      <div className='px-3 py-2 text-sm text-gray-500'>
                        Searching...
                      </div>
                    ) : (searchResults[field.name] || field.options || [])
                        .length > 0 ? (
                      (searchResults[field.name] || field.options || []).map(
                        (option) => (
                          <div
                            key={option.value}
                            className='px-3 py-2 hover:bg-gray-50 cursor-pointer text-foreground'
                            style={{
                              fontSize: '16px',
                              fontWeight: 400,
                              lineHeight: '24px',
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              form.setValue(field.name, option.value as any);
                              setSearchQuery((prev) => ({
                                ...prev,
                                [field.name]: option.label,
                              }));
                              setSelectOpen((prev) => ({
                                ...prev,
                                [field.name]: false,
                              }));
                            }}
                          >
                            {option.label}
                          </div>
                        )
                      )
                    ) : (
                      <div className='px-3 py-2 text-sm text-gray-500'>
                        No results found
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <SelectInput
                name={field.name}
                label=''
                value={form.watch(field.name as Path<T>) ?? ''}
                onChange={(val: string) =>
                  form.setValue(
                    field.name as Path<T>,
                    val as PathValue<T, Path<T>>,
                    { shouldValidate: true }
                  )
                }
                disabled={field.disabled}
                options={field.options ?? []}
                placeholder={field.placeholder || 'Select an option'}
              />
            )
          ) : field.type === 'radio' ? (
            <div className='space-y-2'>
              {field.options?.map((option) => (
                <Radio
                  key={option.value}
                  {...form.register(field.name)}
                  value={option.value}
                  disabled={field.disabled}
                  label={option.label}
                />
              ))}
            </div>
          ) : field.type === 'file' ? (
            <div>
              <input
                id={field.name}
                type='file'
                accept={field.accept}
                disabled={field.disabled}
                className='hidden'
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setUploadedFiles((prev) => ({ ...prev, [field.name]: file }));
                  form.setValue(field.name, file as any);
                }}
              />
              {!uploadedFiles[field.name] ? (
                field.dragDrop ? (
                  <div
                    onDragEnter={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDragActive((prev) => ({
                        ...prev,
                        [field.name]: true,
                      }));
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDragActive((prev) => ({
                        ...prev,
                        [field.name]: false,
                      }));
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDragActive((prev) => ({
                        ...prev,
                        [field.name]: false,
                      }));
                      const file = e.dataTransfer.files?.[0] || null;
                      setUploadedFiles((prev) => ({
                        ...prev,
                        [field.name]: file,
                      }));
                      form.setValue(field.name, file as any);
                    }}
                    className={cn(
                      'w-full px-4 py-8 border border-dashed rounded-lg cursor-pointer transition-colors',
                      dragActive[field.name]
                        ? 'bg-gray-100 dark:bg-accent border-[#FC6401]'
                        : 'hover:bg-gray-50 dark:hover:bg-accent bg-[#FAFAFA] dark:bg-input'
                    )}
                    style={{ borderColor: '#EEE' }}
                    onClick={() => document.getElementById(field.name)?.click()}
                  >
                    <div className='flex flex-col items-center gap-2'>
                      <Upload className='h-10 w-10 text-gray-400' />
                      <div className='text-center'>
                        <span
                          className='text-foreground'
                          style={{
                            fontSize: '14px',
                            fontWeight: 400,
                            lineHeight: '16px',
                          }}
                        >
                          Drag and drop file or{' '}
                        </span>
                        <span
                          style={{
                            color: '#FC6401',
                            fontSize: '14px',
                            fontWeight: 400,
                            lineHeight: '16px',
                          }}
                        >
                          browse
                        </span>
                      </div>
                      {field.maxSize && (
                        <p className='text-xs text-gray-500 mt-1'>
                          Maximum file size: {field.maxSize}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor={field.name}
                    className='block w-full px-4 py-6 border border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-accent bg-[#FAFAFA] dark:bg-input'
                    style={{ borderColor: '#EEE' }}
                  >
                    <div
                      className='text-center text-foreground'
                      style={{
                        fontSize: '14px',
                        fontWeight: 400,
                        lineHeight: '16px',
                      }}
                    >
                      {field.placeholder || 'Click to upload file'}
                    </div>
                  </label>
                )
              ) : (
                <div
                  className='flex items-center gap-4 p-3 border border-dashed rounded-lg bg-[#FAFAFA] dark:bg-input'
                  style={{ borderColor: '#EEE' }}
                >
                  <FileText className='h-8 w-8 text-orange-500' />
                  <div className='flex-1'>
                    <p
                      className='text-[#101828] dark:text-foreground'
                      style={{
                        fontSize: '14px',
                        fontWeight: 400,
                        lineHeight: '16px',
                        marginBottom: '6px',
                      }}
                    >
                      {uploadedFiles[field.name]?.name}
                    </p>
                    <p className='text-gray-500 text-xs'>
                      {(uploadedFiles[field.name]?.size! / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <Button
                    type='button'
                    onClick={() => {
                      setUploadedFiles((prev) => ({
                        ...prev,
                        [field.name]: null,
                      }));
                      form.setValue(field.name, null as any);
                    }}
                    variant='text'
                    className='text-red-500 hover:text-red-700 p-0'
                  >
                    <Trash2 className='h-5 w-5' />
                  </Button>
                </div>
              )}
            </div>
          ) : field.type === 'checkbox-group' ? (
            <div className='space-y-4'>
              {Object.entries(
                field.options?.reduce((acc, option) => {
                  const group = option.group || '';
                  if (!acc[group]) acc[group] = [];
                  acc[group].push(option);
                  return acc;
                }, {} as Record<string, typeof field.options>) || {}
              ).map(([group, options]) => (
                <div key={group || 'ungrouped'}>
                  {group && (
                    <div className='bg-[#F9FAFB] dark:bg-muted px-4 py-3 rounded-lg mb-3'>
                      <h4
                        className='font-medium'
                        style={{
                          fontSize: '16px',
                          lineHeight: '24px',
                          color: '#000',
                        }}
                      >
                        {group}
                      </h4>
                    </div>
                  )}
                  <CheckboxGroup
                    options={
                      options?.map((opt) => ({
                        id: String(opt.value),
                        name: opt.label,
                      })) || []
                    }
                    value={form.watch(field.name) || []}
                    onChange={(value) =>
                      form.setValue(field.name, value as any)
                    }
                  />
                </div>
              ))}
            </div>
          ) : field.type === 'checkbox' ? (
            <Checkbox
              {...form.register(field.name)}
              disabled={field.disabled}
              label={field.placeholder}
              className='text-[#FC6401] border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#FC6401]'
              style={{ accentColor: '#FC6401' }}
            />
          ) : field.type === 'currency' ? (
            <Input
              id={field.name}
              type='text'
              currency
              value={form.watch(field.name) || ''}
              placeholder={field.placeholder}
              disabled={field.disabled}
              onChange={(e) => form.setValue(field.name, e.target.value as any)}
              error={form.formState.errors[field.name]?.message as string}
              className='shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] disabled:bg-[#F4F4F4] '
              style={{ fontSize: '16px', fontWeight: 400, lineHeight: '24px' }}
            />
          ) : field.type === 'password' ? (
            <PasswordInput
              id={field.name}
              {...form.register(field.name)}
              placeholder={field.placeholder}
              label=''
              disabled={field.disabled}
              error={form.formState.errors[field.name]?.message as string}
              className='shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] disabled:bg-[#F4F4F4] '
              style={{ fontSize: '16px', fontWeight: 400, lineHeight: '24px' }}
            />
          ) : field.type === 'pin' ? (
            <OtpInput
              length={pinLength}
              value={form.watch(field.name as Path<T>) || ''}
              onChange={(value) =>
                form.setValue(
                  field.name as Path<T>,
                  value as PathValue<T, Path<T>>,
                  {
                    shouldValidate: true,
                  }
                )
              }
              onComplete={(otp) => {
                console.log('OTP complete:', otp);
              }}
              onResend={onResendOtp}
              error={form.formState.errors[field.name]?.message as string}
            />
          ) : (
            <Input
              id={field.name}
              type={field.type || 'text'}
              {...form.register(field.name)}
              placeholder={field.placeholder}
              disabled={field.disabled}
              className='shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] disabled:bg-[#F4F4F4] '
              style={{ fontSize: '16px', fontWeight: 400, lineHeight: '24px' }}
            />
          )}

          {field.helperText && (
            <p className='text-sm text-[#374151] mt-1'>{field.helperText}</p>
          )}

          {form.formState.errors[field.name] && (
            <p className='text-sm text-red-500'>
              {form.formState.errors[field.name]?.message as string}
            </p>
          )}
        </div>
      ))}

      <div className='flex gap-4 pt-2'>
        <Button type='submit' variant='theme' loading={isSubmitting}>
          {submitText}
        </Button>
        {showReset && (
          <Button
            type='button'
            variant='secondary'
            onClick={() => {
              form.reset();
              setUploadedFiles({});
            }}
            disabled={isSubmitting}
          >
            Reset
          </Button>
        )}
      </div>
    </form>
  );
}
