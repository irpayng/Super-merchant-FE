import { TableAvatarCell } from '@/components/ui/table-avatar-cell';

export const columns = [
  { key: 'created_at', label: 'Date and Time', truncate: true },
  {
    key: 'user.name',
    label: 'User',
    render: (_: any, row: any) => (
      <TableAvatarCell
        title={String(row.user?.name || row.admin?.name || row?.admin_name || '-')}
        subtitle={row.user?.email || ''}
      />
    ),
  },
  { key: 'module', label: 'Module' },
  { key: 'action', label: 'Action' },
  { key: 'description', label: 'Description' },
];

export const filters = [
  { name: 'modules', label: 'Module', queryParam: 'module' },
  { name: 'actions', label: 'Action', queryParam: 'action' },
  { name: 'dates' },
];
