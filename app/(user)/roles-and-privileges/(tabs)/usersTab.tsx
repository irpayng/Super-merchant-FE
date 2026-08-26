'use client';

import { DataTable } from '@/components/ui/data-table';
import { Dialog } from '@/components/ui/dialog';
import { CheckboxGroup } from '@/components/ui/checkbox-group';
import { adminApi } from '@/lib/admin-api';
import { useDataTable } from '@/hooks/useDataTable';
import { useState } from 'react';
import { z } from 'zod';
import { UserPlus, UserMinus, ShieldBan, Edit2Icon } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { isLocalEnv } from '@/lib/utils/helperFns';
import usePermissions from '@/hooks/misc/permissions/usePermissions';
import useToolkit from '@/hooks/misc/useToolkit';
import useDashboardProps from '@/components/context/dashboard-global/useDashboardProps';
import { Input } from '@/components/ui/input';
import OptionalView from '@/components/misc/OptionalView';
import { columns } from '../(files)/users/table-config';

export default function UsersTab() {
  const [aggregatorSelected, setAggregatorSelected] = useState(false);

  const createFormSchema = (filters: any) =>
    z
      .object({
        name: z.string().min(1, 'Name is required'),
        email: z
          .string()
          .min(1, 'Email is required')
          .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address')
          .refine(
            (val) =>
              isLocalEnv || aggregatorSelected
                ? val
                : val.toLowerCase().endsWith('@irpay.ng'),
            {
              message: 'Provide an official IRPAY Email',
            },
          ),
        phone_number: z
          .string()
          .trim()
          .refine((val) => /^\d{11}$/.test(val), {
            message: 'Phone number must be exactly 11 digits (numbers only)',
          }),
        roles: z
          .array(z.string())
          .optional()
          .refine((val) => val && val.length > 0, {
            message: 'At least one role is required',
          }),
        password: z
          .string()
          .min(8, 'Password must be at least 8 characters')
          .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
          .regex(/[0-9]/, 'Password must contain at least one number')
          .regex(
            /[^A-Za-z0-9]/,
            'Password must contain at least one special character',
          ),
        password_confirmation: z.string(),
      })
      .refine((data) => data.password === data.password_confirmation, {
        message: "Passwords don't match",
        path: ['password_confirmation'],
      })
      .superRefine((data, ctx) => {
        const roles = data.roles;
        const aggregatorInvolved = roles?.includes('3');

        const hasSuperAgent = roles?.some((roleId) => {
          const role = filters?.roles?.find((r: any) => r.id === roleId);
          return role?.name === 'Super Agent';
        });

        if (aggregatorInvolved) {
          setAggregatorSelected(true);
        } else {
          setAggregatorSelected(false);
        }

        if (
          !isLocalEnv &&
          !hasSuperAgent &&
          !aggregatorInvolved &&
          !data.email.toLowerCase().endsWith('@irpay.ng')
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Provide an official IRPAY Email',
            path: ['email'],
          });
        }
      });
  // .refine(
  //   (data) => {
  //     const hasSuperAgent = data.roles?.some((roleId) => {
  //       const role = filters?.roles?.find((r: any) => r.id === roleId);
  //       return role?.name === 'Super Agent';
  //     });
  //     return isLocalEnv ? true : hasSuperAgent || data.email.toLowerCase().endsWith('@irpay.ng');
  //   },
  //   {
  //     message: 'Provide an official IRPAY Email',
  //     path: ['email'],
  //   }
  // );

  const [filters, setFilters] = useState<any>({});
  const { fetchData } = useDataTable({
    api: adminApi,
    onFiltersUpdate: setFilters,
  });
  const [reloadKey, setReloadKey] = useState(0);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  const [unassignDialogOpen, setUnassignDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const { showToast } = useToast();

  const { activeTableRow } = useDashboardProps();
  const { isPortalAdmin } = usePermissions();
  const { userEmail } = useToolkit();
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [adminDetails, setAdminDetails] = useState({
    phone_number: '',
    email: '',
  });
  const [editFormError, setEditFormError] = useState('');

  const isSeparateEmail = userEmail !== activeTableRow?.email;
  const adminIsActive = activeTableRow?.status === 'active';

  const rowActions = [
    {
      label: 'Assign Role',
      icon: UserPlus,
      onClick: (row: any) => {
        setSelectedAdmin(row);
        setSelectedRoles(row.roles.map((r: any) => r.id) || []);
        setAssignDialogOpen(true);
      },
    },
    {
      label: 'Unassign Role',
      icon: UserMinus,
      onClick: (row: any) => {
        if (row?.roles?.length === 0) {
          showToast('This user currently has no roles assigned', 'error');
        } else {
          setSelectedAdmin(row);
          setSelectedRoles(row.roles.map((r: any) => r.id) || []);
          setUnassignDialogOpen(true);
        }
      },
    },
    ...(isPortalAdmin && isSeparateEmail
      ? [
          {
            label: adminIsActive ? 'Block' : 'Unblock',
            icon: ShieldBan,
            onClick: async (row: any) => {
              const path = adminIsActive ? 'block' : 'unblock';
              const toastMsg = adminIsActive
                ? `Admin blocked`
                : `Admin unblocked`;

              try {
                const data = await adminApi.toggleStatus(row?.id, path);
                showToast(toastMsg, 'success');
                setReloadKey((prev) => prev + 1);
              } catch (error: any) {
                showToast(error.message || 'Failed to perform action', 'error');
              }
            },
          },
        ]
      : []),
    ...(isPortalAdmin
      ? [
          {
            label: 'Update Information',
            icon: Edit2Icon,
            onClick: async (row: any) => {
              setAdminDetails({ phone_number: '', email: row?.email || '' });
              setEditFormError('');
              setSelectedAdmin(row);
              setEditFormOpen(true);
            },
          },
        ]
      : []),
  ];

  return (
    <>
      <DataTable
        title='Users'
        description='Enter the details required to add a new user'
        columns={columns}
        fetchData={fetchData}
        createData={async (data, options) => {
          await adminApi.createItem(data, options);
        }}
        rowActions={rowActions}
        reloadKey={reloadKey}
        formFields={(filters) => [
          {
            name: 'name' as const,
            label: 'Full Name',
            type: 'text' as const,
            placeholder: 'Enter full name',
            required: true,
          },
          {
            name: 'email' as const,
            label: 'Work Email Address',
            type: 'email' as const,
            placeholder: 'Enter email address',
            required: true,
          },
          {
            name: 'phone_number' as const,
            label: 'Phone Number',
            type: 'text' as const,
            placeholder: 'Enter phone number',
            required: true,
          },
          {
            name: 'roles' as const,
            label: 'Roles',
            type: 'checkbox-group' as const,
            required: true,
            options:
              filters?.roles?.map((r: any) => ({
                label: r.name,
                value: r.id,
              })) || [],
          },
        ]}
        formSchema={createFormSchema(filters)}
        createButtonText='Add New User'
        searchPlaceholder='Search users by Name, & Roles...'
        emptyStateText='No users yet'
        emptyStateDescription='User records will appear here.'
      />

      <Dialog
        open={assignDialogOpen}
        onClose={() => setAssignDialogOpen(false)}
        onConfirm={async () => {
          try {
            await adminApi.assignRole(selectedAdmin?.id, selectedRoles);
            showToast('Roles assigned successfully', 'success');
            setReloadKey((prev) => prev + 1);
          } catch (error: any) {
            showToast(error.message || 'Failed to assign roles', 'error');
          }
        }}
        title='Assign Role'
        description={`Select the roles you want to assign to ${
          selectedAdmin?.name || 'this admin'
        }`}
        confirmText='Assign'
        variant='success'
      >
        <CheckboxGroup
          options={filters?.roles || []}
          value={selectedRoles}
          onChange={setSelectedRoles}
        />
      </Dialog>

      <Dialog
        open={unassignDialogOpen}
        onClose={() => setUnassignDialogOpen(false)}
        onConfirm={async () => {
          try {
            await adminApi.unassignRole(selectedAdmin?.id, selectedRoles);
            showToast('Roles unassigned successfully', 'success');
            setReloadKey((prev) => prev + 1);
          } catch (error: any) {
            showToast(error.message || 'Failed to unassign roles', 'error');
          }
        }}
        title='Unassign Role'
        description={`Select the roles you want to unassign from ${
          selectedAdmin?.name || 'this admin'
        }`}
        confirmText='Unassign'
        variant='danger'
      >
        <CheckboxGroup
          options={filters?.roles || []}
          value={selectedRoles}
          onChange={setSelectedRoles}
        />
      </Dialog>

      <Dialog
        open={editFormOpen}
        onClose={() => setEditFormOpen(false)}
        onConfirm={async () => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

          if (
            adminDetails?.phone_number &&
            adminDetails.phone_number.length !== 11
          ) {
            setEditFormError('Phone number must be 11 digits');
          } else if (
            adminDetails?.email &&
            !emailRegex.test(adminDetails.email)
          ) {
            setEditFormError('Please enter a valid email address');
          } else {
            const payload: any = {
              name: selectedAdmin?.name,
            };
            if (adminDetails.phone_number) {
              payload.phone_number = adminDetails.phone_number;
            }
            if (adminDetails.email) {
              payload.email = adminDetails.email;
            }
            setEditFormError('');
            try {
              await adminApi.updateInformation(selectedAdmin?.id, payload);
              showToast('Details updated successfully', 'success');
              setReloadKey((prev) => prev + 1);
            } catch (error: any) {
              showToast(error.message || 'Failed to update details', 'error');
            }
          }
        }}
        title='Update User Information'
        description='Modify the details of this user and save changes'
        confirmText='Update'
        variant='warning'
      >
        <div className='space-y-4'>
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700 dark:text-foreground mb-1'
            >
              Name
            </label>
            <Input disabled value={selectedAdmin?.name} />
          </div>

          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700 dark:text-foreground mb-1'
            >
              Email
            </label>
            <Input
              type='email'
              placeholder='Enter email address'
              value={adminDetails.email}
              onChange={(e: any) => {
                setAdminDetails({
                  ...adminDetails,
                  email: e.target.value,
                });
                setEditFormError('');
              }}
            />
          </div>

          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700 dark:text-foreground mb-1'
            >
              Phone Number
            </label>
            <Input
              min={11}
              max={11}
              value={adminDetails.phone_number}
              onChange={(e: any) => {
                setAdminDetails({
                  ...adminDetails,
                  phone_number: e.target.value,
                });
                if (adminDetails.phone_number?.length === 11) {
                  setEditFormError('');
                }
              }}
            />
          </div>

          <OptionalView condition={editFormError?.length > 0}>
            <div className='text-sm text-red-500'>{editFormError}</div>
          </OptionalView>
        </div>
      </Dialog>
    </>
  );
}
