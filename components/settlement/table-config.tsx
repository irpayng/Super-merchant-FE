import { z } from 'zod';

export const t1Columns = [
  {
    key: 'merchantId',
    label: 'Merchant ID',
    copiable: true,
  },
  {
    key: 'terminal_id',
    label: 'Terminal ID',
    copiable: true,
  },
  {
    key: 'total_value',
    label: 'Total Value',
  },
  {
    key: 'settled_value',
    label: 'Settled Value',
  },
  {
    key: 'total_volume',
    label: 'Total Volume',
  },
  {
    key: 'charges',
    label: 'Charge',
  },
  { key: 'status', label: 'Status', badge: true },
  {
    key: 'created_at',
    label: 'Date, Time Settled',
    date: true,
    truncate: true,
  },
];

export const instantColumns = [
  {
    key: 'created_at',
    label: 'Date, Time Settled',
    date: true,
    truncate: true,
  },
  { key: 'total_value', label: 'Total Value' },
  { key: 'settled_value', label: 'Settled Value' },
  {
    key: 'merchantId',
    label: 'Total Volume',
  },
  { key: 'charge', label: 'Charge' },
  {
    key: 'terminal_id',
    label: 'Terminal ID',
    copiable: true,
  },
  { key: 'status', label: 'Status', badge: true },

];

export const settlementFilterFields = [
  { name: 'dates', label: 'Date Range', type: 'daterange' as const },
];

export const uploadFormFields = [
  {
    name: 'file' as const,
    label: 'Upload File',
    type: 'file' as const,
    required: true,
    accept: '.xlsx,.xls',
    maxSize: '5MB',
    dragDrop: true,
    placeholder: 'Select a file to upload',
  },
];

export const uploadFormSchema = z.object({
  file: z.any().refine((file) => file !== null && file !== undefined, {
    message: 'File is required',
  }),
});
