import { TableAvatarCell } from '@/components/ui/table-avatar-cell';
import { Bell, MinusCircle, Ban, Plus } from 'lucide-react';

export const columns = (type: 'user' | 'agent' | 'merchant') => [
  {
    key: type,
    label: type === 'merchant' ? 'Merchant Name' : 'Full Name',
    render: (_: any, row: any) => (
      <TableAvatarCell
        imageSrc={row.avatar?.thumbnail}
        title={row.name}
        subtitle={row.email}
      />
    ),
    align: 'left',
  },
  {
    key: 'phone_number',
    label: type === 'merchant' ? 'Contact Details' : 'Phone Number',
  },
  { key: 'type', label: 'Type' },
  { key: 'tier.name', label: 'Tier' },
];

export const createUserRowActions = (
  type: 'user' | 'agent' | 'merchant',
  handlers: {
    onNotification: () => void;
    onStatement?: () => void;
    onCredit?: () => void;
    onDebit?: () => void;
    onPND?: () => void;
    onRemovePND?: () => void;
    onSuspend?: () => void;
  }
) => {
  const actions = [
    {
      label: 'Send Notification',
      icon: Bell,
      onClick: handlers.onNotification,
    },
  ];

  if (handlers.onCredit) {
    actions.push({
      label: 'Manual Credit',
      icon: Plus,
      onClick: handlers.onCredit,
    });
  }

  if (handlers.onDebit) {
    actions.push({
      label: 'Manual Debit',
      icon: MinusCircle,
      onClick: handlers.onDebit,
    });
  }

  if (handlers.onPND) {
    actions.push({ label: 'Apply PND', icon: Ban, onClick: handlers.onPND });
  }

  if (handlers.onRemovePND) {
    actions.push({
      label: 'Remove PND',
      icon: Ban,
      onClick: handlers.onRemovePND,
    });
  }

  if (handlers.onSuspend) {
    actions.push({
      label: `Suspend ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      icon: Ban,
      onClick: handlers.onSuspend,
    });
  }

  return actions;
};

export const userFilterFields = [
  { name: 'status', label: 'Status', type: 'select' as const },
  { name: 'dates', label: 'Date Range', type: 'daterange' as const },
];
