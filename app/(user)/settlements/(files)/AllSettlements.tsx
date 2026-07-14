'use client';

import { DataTable } from '@/components/ui/data-table';
import { userApi } from '@/lib/user-api';
import { useDataTable } from '@/hooks/useDataTable';
import { Upload } from 'lucide-react';
import { instantColumns } from '@/components/settlement/table-config';


export default function AllSettlements() {

  const { fetchData, fetchDetails } = useDataTable({
    api: userApi,
    defaultParams: { type: 'agent' },
  });

  const handleExport = async () => {
    // Implement export functionality here
  };

  return (
    <DataTable
      title='All Settlements'
      columns={instantColumns}
      fetchData={fetchData}
      showActions={false}
      fetchDetails={fetchDetails}
      emptyStateText='No settlements yet'
      searchPlaceholder='Search...'
      emptyStateDescription='Settlement records will appear here.'
      actionBtnText='Upload Settlement File'
      actionBtnIcon={Upload}
      exportData={handleExport}
      filterFields={[
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          options: [
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
          ],
        },
        { name: 'dateRange', label: 'Date Range', type: 'daterange' },
      ]}
    />
  );
}
