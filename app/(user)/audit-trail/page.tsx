'use client';

import { columns, filters } from '@/app/(user)/audit-trail/(files)/table-config';
import { auditLogApi } from '@/lib/audit-log-api';
import { useDataTable } from '@/hooks/useDataTable';
import { DataTable } from '@/components/ui/data-table';
import { AuditLogDetails } from '@/app/(user)/audit-trail/(files)/details';

function AuditTrailPage() {
  const { fetchData, fetchDetails, handleExport } = useDataTable({
    api: auditLogApi,
  });

  return (
    <DataTable
      title='Audit Logs'
      columns={columns}
      fetchData={fetchData}
      fetchDetails={fetchDetails}
      detailsRenderer={(data) => <AuditLogDetails data={data} />}
      detailsView='slider'
      detailsSliderWidth='2xl'
      searchPlaceholder='Search...'
      emptyStateText='No audit logs yet'
      emptyStateDescription='Audit log records will appear here.'
      filterConfig={filters}
      selectable={false}
      showActions={false}
      showSnippetOnRowClick
      exportData={handleExport}
      buildFilterFields={(apiFilters) => [
        {
          name: 'actions',
          label: 'Action',
          type: 'select' as const,
          queryParam: 'action',
          placeholder: 'All actions',
          // keep it searchable if the FilterField supports it
          searchable: true,
          options: (apiFilters?.actions || []).map((a) => ({
            label: a.name,
            value: a.id,
          })),
        },
        {
          name: 'dates',
          label: 'Date',
          type: 'daterange' as const,
        },
      ]}
    />
  );
}

export default AuditTrailPage;
