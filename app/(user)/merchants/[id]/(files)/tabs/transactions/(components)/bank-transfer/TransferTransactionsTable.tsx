"use client"

import { useState } from "react"
import { transactionApi } from "@/lib/transaction-api"
import { useDataTable } from "@/hooks/useDataTable"
import { filters, transferColumns } from "@/app/(user)/dashboard/(files)/terminal-status/table-config"
import { TransactionDetails } from "@/components/transactions/details"
import { TransactionReceipt } from "@/components/transactions/receipt"
import { DataTable } from "@/components/ui/data-table"
import { Slider } from "@/components/ui/slider"
import RaiseDisputeView from "../RaiseDisputeView"


export default function TransferTransactionsTable() {
  const [receiptModalOpen, setReceiptModalOpen] = useState(false)
  const [disputeModalOpen, setDisputeModalOpen] = useState(false)
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
        detailsRenderer={(data) => {
          setSelectedTransaction(data)

          return (
            <TransactionDetails
              hideLogsBtn
              hidePipelineBtn
              hideDefaultRcptBtn
              data={data}
              onRaiseDispute={() => setDisputeModalOpen(true)}
              onViewCustomerReceipt={() => setReceiptModalOpen(true)}
              onViewMerchantReceipt={() => setReceiptModalOpen(true)}
              onViewReceipt={() => {
                setReceiptModalOpen(true)
              }}
            />
          )
        }}
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
        open={disputeModalOpen}
        onClose={() => setDisputeModalOpen(false)}
        title="Raise a Dispute"
        width="md">
        <RaiseDisputeView />
      </Slider>
    </>
  )
}
