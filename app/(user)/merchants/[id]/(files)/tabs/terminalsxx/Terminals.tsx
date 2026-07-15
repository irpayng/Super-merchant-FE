import { DataTable } from "@/components/ui/data-table"
import { columns, filters, } from "./table-config"
import { terminalApi } from "@/lib/terminal-api"
import { useDataTable } from "@/hooks/useDataTable"
import React from 'react'
import { TerminalDetails } from "./TerminalDetails"

const AgentTerminals = () => {
  const { fetchData, fetchDetails } = useDataTable({
    api: terminalApi,
    onUploadSuccess: () => { }
  })


  return (
    <div>
      <DataTable
        title="Terminals"
        columns={columns}
        fetchData={fetchData}
        fetchDetails={fetchDetails}
        detailsView="slider"
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

export default AgentTerminals