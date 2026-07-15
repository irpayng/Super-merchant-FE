"use client"

import { useState } from "react"
import { transactionApi } from "@/lib/transaction-api"
import { useDataTable } from "@/hooks/useDataTable"
import { filters } from "@/components/transactions/table-config"
import { DataTable } from "@/components/ui/data-table"
import { detailedTxnColumns } from "./table-config"

export default function TransactionsTable() {
  const [stats, setStats] = useState<any>(null)

  const { fetchData, fetchDetails, handleExport } = useDataTable({
    api: transactionApi,
    onStatsUpdate: setStats
  })

  return (
    <>

      <DataTable
        // title="Transactions"
        columns={detailedTxnColumns}
        fetchData={fetchData}
        fetchDetails={fetchDetails}
        searchPlaceholder="Search..."
        emptyStateText="No transactions yet"
        emptyStateDescription="Transaction records will appear here."
        filterConfig={filters}
        selectable={true}
        showActions={false}
        exportData={handleExport}
      />
    </>
  )
}
