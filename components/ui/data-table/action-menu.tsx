import { Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RowAction {
  label: string;
  icon?: any;
  onClick: (row?: any) => void;
  danger?: boolean;
}

interface ActionMenuProps {
  isOpen: boolean;
  position: { top: number; right: number } | null;
  rowActions?: RowAction[];
  currentRow?: any;
  hasViewDetails: boolean;
  hasEdit: boolean;
  hasDelete: boolean;
  onClose: () => void;
  onViewDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ActionMenu({
  isOpen,
  position,
  rowActions,
  currentRow,
  hasViewDetails,
  hasEdit,
  hasDelete,
  onClose,
  onViewDetails,
  onEdit,
  onDelete,
}: ActionMenuProps) {
  if (!isOpen || !position) return null;

  return (
    <>
      <div className='fixed inset-0 z-30' onClick={onClose} />
      <div
        className='fixed w-48 bg-card border border-border rounded-lg shadow-lg z-40 py-1'
        style={{ top: `${position.top}px`, right: `${position.right}px` }}
      >
        {rowActions && rowActions.length > 0 ? (
          rowActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <Button
                key={idx}
                onClick={() => {
                  action.onClick(currentRow);
                  onClose();
                }}
                variant={action.danger ? 'menu-danger' : 'menu'}
                className='flex items-center gap-2'
              >
                {Icon && <Icon className='h-4 w-4' />} {action.label}
              </Button>
            );
          })
        ) : (
          <>
            {hasViewDetails && (
              <Button
                onClick={onViewDetails}
                variant='menu'
                className='flex items-center gap-2'
              >
                <Eye className='h-4 w-4' /> View Details
              </Button>
            )}
            {hasEdit && (
              <Button
                onClick={onEdit}
                variant='menu'
                className='flex items-center gap-2'
              >
                <Edit className='h-4 w-4' /> Edit
              </Button>
            )}
            {hasDelete && (
              <Button
                onClick={onDelete}
                variant='menu-danger'
                className='flex items-center gap-2'
              >
                <Trash2 className='h-4 w-4' /> Delete
              </Button>
            )}
          </>
        )}
      </div>
    </>
  );
}
