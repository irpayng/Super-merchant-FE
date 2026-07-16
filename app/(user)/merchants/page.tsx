'use client'
import { useState } from "react"
import { transactionApi } from "@/lib/transaction-api"
import { useDataTable } from "@/hooks/useDataTable"
import { TransactionDetails } from "@/components/transactions/details"
import { DataTable } from "@/components/ui/data-table"
import { merchantCols, filters } from "./(files)/table-config"
import { useMerchantRowActions } from "./(files)/useMerchantRowActions"

export default function AllMerchants() {
  const [stats, setStats] = useState<any>(null)
  const { rowActions, dialogs, reloadKey } = useMerchantRowActions();
  const { fetchData, fetchDetails } = useDataTable({ api: transactionApi, onStatsUpdate: setStats })


  return (
    <>
      <DataTable
        reloadKey={reloadKey}
        title='All Merchants'
        columns={merchantCols}
        fetchData={fetchData}
        detailsView='page'
        detailsPageUrl={(row) => `/merchants/${encodeURIComponent(row.id)}`}
        emptyStateText="No merchants found"
        emptyStateDescription="Merchant records will appear here."
        filterConfig={filters}
        rowActions={rowActions}
        pageSize={50}
        pagination
      />

      {dialogs}
    </>
  )
}
