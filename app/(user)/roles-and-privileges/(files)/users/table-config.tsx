import { TableAvatarCell } from '@/components/ui/table-avatar-cell';

export const columns = [
  {
    key: 'admin',
    label: 'Full Name',
    render: (_: any, row: any) => (
      <div className='capitalize'>
        <TableAvatarCell title={row.name} subtitle={row.email} />
      </div>
    ),
    align: 'left',
  },
  {
    key: 'roles',
    label: 'Role Assigned',
    render: (value: any) => value?.map((r: any) => r.name).join(', ') || '-',
  },
  { key: 'created_at', label: 'Date and Time Added', date: true },
];
