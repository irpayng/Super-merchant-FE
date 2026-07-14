"use client"

import { useState } from "react"
import { transactionApi } from "@/lib/transaction-api"
import { useDataTable } from "@/hooks/useDataTable"
import { TransactionDetails } from "@/components/transactions/details"
import { DataTable } from "@/components/ui/data-table"
import { txnStatColumns, filters } from "./table-config"


export default function RecentTransactions() {
  const [stats, setStats] = useState<any>(null)
  const { fetchData, fetchDetails } = useDataTable({ api: transactionApi, onStatsUpdate: setStats })

  return (
    <DataTable
      hideRefresh
      hideSearchbar
      columns={txnStatColumns}
      fetchData={fetchData}
      // fetchDetails={fetchDetails}
      // detailsView="slider"
      detailsSliderWidth="2xl"
      detailsRenderer={(data) => (
        <TransactionDetails
          data={data}
        />
      )}
      emptyStateText="No recent transactions"
      emptyStateDescription="Transaction records will appear here."
      filterConfig={filters}
      selectable={false}
      showActions={false}
      hideFilter
      pageSize={5}
      pagination={false}
    />
  )
}
