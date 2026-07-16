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

export const columns = [
  { key: 'serial', label: 'Serial Number', copiable: true, align: 'left' },
  { key: 'make', label: 'Make' },
  { key: 'model', label: 'Model' },
  { key: 'os', label: 'OS' },
  {
    key: 'user',
    label: 'Mapped To',
    render: (_: unknown, row: Record<string, any>) =>
      row?.user ? (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{row.user.name}</span>
          {row.user.email && (
            <span className="text-xs text-muted-foreground">{row.user.email}</span>
          )}
        </div>
      ) : (
        <span className="text-xs text-muted-foreground">Unmapped</span>
      ),
  },
  {
    key: 'locked',
    label: 'Status',
    render: (_: unknown, row: Record<string, any>) =>
      row?.locked ? (
        <span className="rounded-full bg-cms-red-10 px-2 py-1 text-xs font-medium text-cms-red-20">
          Locked
        </span>
      ) : (
        <span className="rounded-full bg-cms-green-10 px-2 py-1 text-xs font-medium text-cms-green-20">
          Active
        </span>
      ),
  },

  { key: 'created_at', label: 'Created At', date: true },

];

/**
 * Filter sidebar shown to admins on the Terminals page.
 *
 * <p>Identity filters (make / OS / dates) hit columns on the {@code terminals}
 * table directly. Health filters (network type / battery / printer status /
 * stale) match against the most recent {@code terminal_metrics} row per
 * serial via the LATERAL join in
 * {@code TerminalRepository.findFiltered}.
 */
export const filterFields = [
  {
    name: 'mapped',
    label: 'Mapping',
    type: 'select' as const,
    options: [
      { label: 'Mapped to a user', value: 'true' },
      { label: 'Not mapped', value: 'false' },
    ],
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Locked', value: 'locked' },
    ],
  },
  {
    name: 'make',
    label: 'Make',
    type: 'select' as const,
    options: [
      { label: 'NEXGO', value: 'NEXGO' },
      { label: 'PAX', value: 'PAX' },
    ],
  },
  {
    name: 'os',
    label: 'Operating System',
    type: 'select' as const,
    options: [
      { label: 'Android', value: 'android' },
      { label: 'iOS', value: 'ios' },
    ],
  },
  {
    name: 'network_type',
    label: 'Network',
    type: 'select' as const,
    options: [
      { label: 'Wi-Fi', value: 'wifi' },
      { label: 'Cellular', value: 'cellular' },
      { label: 'Ethernet', value: 'ethernet' },
      { label: 'Offline', value: 'none' },
    ],
  },
  {
    name: 'battery_below',
    label: 'Battery below (%)',
    type: 'select' as const,
    options: [
      { label: '<10%', value: '10' },
      { label: '<20%', value: '20' },
      { label: '<40%', value: '40' },
      { label: '<60%', value: '60' },
    ],
  },
  {
    name: 'printer_status',
    label: 'Printer Status',
    type: 'select' as const,
    options: [
      { label: 'Ready (0)', value: '0' },
      { label: 'Out of paper (1)', value: '1' },
      { label: 'Overheating (2)', value: '2' },
    ],
  },
  {
    name: 'stale',
    label: 'No check-in for',
    type: 'select' as const,
    options: [
      { label: '> 1 hour', value: '1' },
      { label: '> 6 hours', value: '6' },
      { label: '> 24 hours', value: '24' },
      { label: '> 7 days', value: '168' },
    ],
  },
  {
    name: 'dates',
    label: 'Date range',
    type: 'daterange' as const,
  },
];

/** Backwards-compat export — older callers used `filters` for the legacy stub. */
export const filters = filterFields;
