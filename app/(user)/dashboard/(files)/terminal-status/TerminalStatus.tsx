"use client"

import { useState } from "react"
import { terminalApi } from "@/lib/terminal-api"
import { useDataTable } from "@/hooks/useDataTable"
import { TransactionDetails } from "@/components/transactions/details"
import { DataTable } from "@/components/ui/data-table"
import { terminalStatColumns, filters } from "./table-config"


export default function TerminalStatus() {
  const [stats, setStats] = useState<any>(null)
  // const { fetchData, fetchDetails } = useDataTable({ api: transactionApi, onStatsUpdate: setStats })

  const { fetchData, handleUpload } = useDataTable({
    api: terminalApi,
  })

  return (
    <DataTable
      hideRefresh
      hideSearchbar
      columns={terminalStatColumns}
      fetchData={fetchData}
      // fetchDetails={fetchDetails}
      detailsView={undefined}
      detailsSliderWidth="2xl"
      detailsRenderer={(data) => (
        <TransactionDetails
          data={data}
        />
      )}
      emptyStateText="No terminals yet"
      emptyStateDescription="Terminal records will appear here."
      selectable={false}
      showActions={false}
      pageSize={5}
      hideFilter
      pagination={false}
    />
  )
}
