"use client"

import { useState } from "react"
import { transactionApi } from "@/lib/transaction-api"
import { useDataTable } from "@/hooks/useDataTable"
import { filters, transferColumns } from "@/app/(user)/dashboard/(files)/terminal-status/table-config"
import { TransactionDetails } from "@/components/transactions/details"
import { TransactionReceipt } from "@/components/transactions/receipt"
import { TransactionLog } from "@/components/transactions/log"
import { TransactionIsoLogs } from "@/components/transactions/iso-logs"
import { TransactionHttpLogs } from "@/components/transactions/http-logs"
import { TransactionPipelines } from "@/components/transactions/pipelines"
import { DataTable } from "@/components/ui/data-table"
import { Slider } from "@/components/ui/slider"


export default function TransferTransactionsTable() {
  const [receiptModalOpen, setReceiptModalOpen] = useState(false)
  const [logSliderOpen, setLogSliderOpen] = useState(false)
  const [isoLogsSliderOpen, setIsoLogsSliderOpen] = useState(false)
  const [httpLogsSliderOpen, setHttpLogsSliderOpen] = useState(false)
  const [pipelinesSliderOpen, setPipelinesSliderOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)

  const { fetchData, fetchDetails, handleExport } = useDataTable({
    api: transactionApi,
    onStatsUpdate: setStats
  })

  return (
    <>
      <DataTable
        title="Bank Transfer Transactions"
        columns={transferColumns}
        fetchData={fetchData}
        fetchDetails={fetchDetails}
        detailsView="slider"
        detailsSliderWidth="3xl"
        detailsRenderer={(data) => (
          <TransactionDetails
            data={data}
            onViewReceipt={() => {
              setSelectedTransaction(data)
              setReceiptModalOpen(true)
            }}
            onViewLog={() => {
              setSelectedTransaction(data)
              setLogSliderOpen(true)
            }}
            onViewIsoLogs={() => {
              setSelectedTransaction(data)
              setIsoLogsSliderOpen(true)
            }}
            onViewHttpLogs={() => {
              setSelectedTransaction(data)
              setHttpLogsSliderOpen(true)
            }}
            onViewPipelines={() => {
              setSelectedTransaction(data)
              setPipelinesSliderOpen(true)
            }}
          />
        )}
        searchPlaceholder="Search..."
        emptyStateText="No transactions yet"
        emptyStateDescription="Transaction records will appear here."
        filterConfig={filters}
        selectable={true}
        showActions={false}
        exportData={handleExport}
      />

      {selectedTransaction && (
        <TransactionReceipt
          open={receiptModalOpen}
          onClose={() => setReceiptModalOpen(false)}
          data={selectedTransaction}
        />
      )}

      <Slider
        open={logSliderOpen}
        onClose={() => setLogSliderOpen(false)}
        title="API Log Details"
        width="xl"
      >
        {selectedTransaction && <TransactionLog data={selectedTransaction} />}
      </Slider>

      <Slider
        open={isoLogsSliderOpen}
        onClose={() => setIsoLogsSliderOpen(false)}
        title="ISO Log Details"
        width="xl"
      >
        {selectedTransaction && <TransactionIsoLogs data={selectedTransaction} />}
      </Slider>

      <Slider
        open={httpLogsSliderOpen}
        onClose={() => setHttpLogsSliderOpen(false)}
        title="HTTP Log Details"
        width="xl"
      >
        {selectedTransaction && <TransactionHttpLogs data={selectedTransaction} />}
      </Slider>

      <Slider
        open={pipelinesSliderOpen}
        onClose={() => setPipelinesSliderOpen(false)}
        title="Pipeline Details"
        width="xl"
      >
        {selectedTransaction && <TransactionPipelines data={selectedTransaction} />}
      </Slider>

    </>
  )
}
