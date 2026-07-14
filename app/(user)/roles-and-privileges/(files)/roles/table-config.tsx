import { getInitials } from '@/lib/utils/helperFns';

export const columns = [
  {
    key: 'role_name',
    label: 'Role Name',
    render: (_: any, row: any) => (
      <div className='flex items-start'>{row?.name}</div>
    ),
    align: 'left',
  },
  {
    key: 'description',
    label: 'Description',
    render: (_: any, row: any) => (
      <div className='capitalize flex items-start'>
        {row?.description || '-'}
      </div>
    ),
    align: 'left',
  },

  {
    key: 'assigned',
    label: 'Users Assigned',
    align: 'left',
    render: (_: any, row: any) => {
      const hasAdmins = row?.admins?.length > 0;
      const itemAdmins = row?.admins;
      const maxVisible = 3;
      const visiblePeople = itemAdmins?.slice(0, maxVisible);
      const extraCount = itemAdmins?.length - maxVisible;

      return (
        <div className='capitalize flex items-start'>
          {hasAdmins ? (
            <div className='flex items-center'>
              {visiblePeople.map((person: any, index: number) => (
                <div
                  key={person.id}
                  className={`size-10 flex items-center justify-center text-white font-semibold text-sm rounded-full border-2 border-white dark:border-background bg-amber-700 ${index !== 0 ? '-ml-1.5' : ''}`}
                >
                  {getInitials(person.name)}
                </div>
              ))}

              {extraCount > 0 && (
                <div
                  className={`size-12 flex items-center justify-center text-cms-orange-10 dark:text-primary font-semibold text-sm rounded-full border-2 border-white dark:border-background bg-orange-50 dark:bg-primary/10 -ml-1`}
                >
                  +{extraCount}
                </div>
              )}
            </div>
          ) : (
            <div>0</div>
          )}
        </div>
      );
    },
  },
];

// on row click, open side modal that contains privileges on top, and under it, list of all users assigned to that role
