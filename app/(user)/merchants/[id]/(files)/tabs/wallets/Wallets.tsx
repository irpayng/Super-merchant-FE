import { DataTable } from "@/components/ui/data-table"
import { filters, } from "@/components/terminals/table-config"
import { terminalApi } from "@/lib/terminal-api"
import { useDataTable } from "@/hooks/useDataTable"
import { TerminalDetails } from "@/components/terminals/details"
import React from 'react'
import { walletColumns } from "./table-config"

const Wallets = () => {
  const { fetchData, fetchDetails } = useDataTable({
    api: terminalApi,
    onUploadSuccess: () => { }
  })


  return (
    <div>
      <DataTable
        title="Wallets"
        columns={walletColumns}
        fetchData={fetchData}
        fetchDetails={fetchDetails}
        // detailsView="slider"
        detailsSliderWidth="xl"
        detailsRenderer={(data) => <TerminalDetails data={data} onClose={() => { }} />}
        searchPlaceholder="Search..."
        emptyStateText="No terminals yet"
        emptyStateDescription="Terminal records will appear here."
        filterConfig={filters}
      />
    </div>
  )
}

export default Wallets