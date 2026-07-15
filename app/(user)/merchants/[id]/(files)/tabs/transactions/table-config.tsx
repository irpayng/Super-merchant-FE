import { TableAvatarCell } from '@/components/ui/table-avatar-cell';
import { Bell, MinusCircle, Ban, Plus } from 'lucide-react';

export const columns = [
  {
    key: 'type',
    label: 'Merchant Name',
    render: (_: any, row: any) => (
      <TableAvatarCell
        imageSrc={row.avatar?.thumbnail}
        title={row.name || "Shoprite"}
        subtitle={row.email}
      />
    ),
    align: 'left',
  },
  {
    key: 'merchant_id',
    label: 'Merchant ID',
    copiable: true,
  },
  {
    key: 'contact_details',
    label: 'Contact Eetails',
  },
  { key: 'status', label: 'Status', badge: true },
  { key: 'location', label: 'Location' },
  { key: "created_at", label: "Registration Date", date: true, truncate: true },
];

export const detailedTxnColumns = [
  {
    key: 'rrn',
    label: 'RRN',
    copiable: true,
  },
  {
    key: 'amount',
    label: 'Amount',
  },
  {
    key: 'type',
    label: 'Type',
  },
  {
    key: 'sender',
    label: 'Sender',
  },
  { key: 'status', label: 'Status', badge: true },
  { key: "created_at", label: "Date & Time", date: true, truncate: true },
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


export const getAgentRowActions = (
  onNotification: () => void,
  onCredit: () => void,
  onDebit: () => void,
  onPND: () => void,
  onRemovePND: () => void
) => createUserRowActions('agent', {
  onNotification,
  onCredit,
  onDebit,
  onPND,
  onRemovePND
})

export const agentFilterFields = userFilterFields
