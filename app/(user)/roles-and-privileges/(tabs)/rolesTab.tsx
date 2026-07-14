'use client';

import { DataTable } from '@/components/ui/data-table';
import { useDataTable } from '@/hooks/useDataTable';
import { useState } from 'react';
import { rolesApi } from '@/lib/roles-api';
import { RoleDetails } from '../(files)/roles/details';
import { CreateRoleModal } from '../(files)/roles/create-role-modal';
import { columns } from '../(files)/roles/table-config';

function RolesTab() {
  const { fetchData } = useDataTable({ api: rolesApi });
  const [reloadKey, setReloadKey] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <DataTable
        title='All Roles'
        columns={columns}
        fetchData={fetchData}
        reloadKey={reloadKey}
        searchPlaceholder='Search roles'
        emptyStateText='No roles yet'
        detailsView='slider'
        detailsSliderWidth='2xl'
        hasActionBtn
        actionBtnText='Create Role'
        actionBtnOnClick={() => setCreateOpen(true)}
        detailsRenderer={(data) => {
          return (
            <RoleDetails
              data={data}
              onUpdate={() => setReloadKey((prev) => prev + 1)}
            />
          );
        }}
      />

      <CreateRoleModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={() => setReloadKey((prev) => prev + 1)}
      />
    </>
  );
}

export default RolesTab;
