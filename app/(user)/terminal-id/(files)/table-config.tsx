import { z } from 'zod';

export const uploadFormSchema = z.object({
  file: z.any().refine((file) => file !== null && file !== undefined, {
    message: 'File is required',
  }),
});

export const uploadFormFields = [
  {
    name: 'file' as const,
    label: 'Upload File',
    type: 'file' as const,
    required: true,
    accept: '.xlsx,.xls,.csv',
    maxSize: '5MB',
    dragDrop: true,
    placeholder: 'Select a file to upload',
  },
];

export const addFormSchema = z.object({
  terminal_id: z.string().min(1, 'Terminal ID is required'),
  merchant_id: z.string().optional(),
});

export const addFormFields = [
  {
    name: 'terminal_id' as const,
    label: 'Terminal ID',
    type: 'text' as const,
    required: true,
    placeholder: 'e.g. 2IRC0001',
  },
  {
    name: 'merchant_id' as const,
    label: 'Merchant ID',
    type: 'text' as const,
    placeholder: 'e.g. 2IRC0425SL00001',
  },
];

// Edit-processor modal (per-TID). The value is a comma/space separated list of
// provider codes; blank clears the scope so the TID is usable by any processor.
export const processorFormSchema = z.object({
  processor: z.string().optional(),
});

export const processorFormFields = [
  {
    name: 'processor' as const,
    label: 'Processor scope',
    type: 'text' as const,
    placeholder: 'e.g. nibss,upsl,interswitch — leave blank for Any',
  },
];

export const columns = [
  { key: 'terminal_id', label: 'Terminal ID', copiable: true },
  { key: 'merchant_id', label: 'Merchant ID', copiable: true },
  { key: 'merchant_name', label: 'Merchant Name' },
  { key: 'bank_acc_no', label: 'Account Number', copiable: true },
  {
    key: 'internal',
    label: 'Internal',
    render: (value: boolean) => (value ? 'Yes' : 'No'),
  },
  {
    key: 'processor',
    label: 'Processor',
    render: (value: string | null) => (value ? value : 'Any'),
  },
  { key: 'created_at', label: 'Created At', truncate: true },
];

export const filterFields = [
  {
    name: 'terminal_id',
    label: 'Terminal ID',
    type: 'text' as const,
    placeholder: 'Enter terminal ID',
  },
  {
    name: 'merchant_id',
    label: 'Merchant ID',
    type: 'text' as const,
    placeholder: 'Enter merchant ID',
  },
  {
    name: 'internal',
    label: 'Internal',
    type: 'select' as const,
    options: [
      { label: 'All', value: '' },
      { label: 'Internal', value: 'true' },
      { label: 'External', value: 'false' },
    ],
  },
  {
    name: 'dates',
    label: 'Date Range',
    type: 'daterange' as const,
  },
];
