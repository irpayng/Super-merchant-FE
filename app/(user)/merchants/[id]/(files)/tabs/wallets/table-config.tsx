import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/currency';
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

export const walletColumns = [
  { key: 'serial', label: 'Wallet ID', copiable: true, align: 'left' },

  {
    key: 'balance',
    label: 'Wallet Balance',
    align: 'left',
    render: (_: any, row: any) => (
      <div className="capitalize">
        {formatCurrency('123458')}
      </div>
    ),
  },

  {
    key: 'commission',
    label: 'Commissions',
    align: 'left',
    render: (_: any, row: any) => (
      <div className="capitalize">
        {formatCurrency('123458')}
      </div>
    ),
  },

  {
    key: 'settlements',
    label: 'Settlements',
    align: 'left',
    render: (_: any, row: any) => (
      <div className="capitalize">
        {formatCurrency('123458')}
      </div>
    ),
  },

  { key: 'created_at', label: 'Last Funding', truncate: true },
  {
    key: 'status',
    label: 'Status',
    align: 'left',
    render: (_: any, row: any) => (
      <div className="capitalize">
        <Badge variant='success'>Active</Badge>
      </div>
    ),
  },
];

// export const detailPageColumns = [
//   { key: 'serial', label: 'Serial Number', copiable: true, align: 'left' },
//   { key: 'make', label: 'Make' },
//   { key: 'model', label: 'Model' },
//   { key: 'os', label: 'OS' },
//   { key: 'created_at', label: 'Created At', truncate: true },
// ];

export const filters = [{ name: 'make' }, { name: 'os' }, { name: 'dates' }];
