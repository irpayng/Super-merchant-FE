'use client'
import { Card } from '@/components/ui/card'
import LinkBtn from '@/components/misc/LinkBtn'
import { DashboardData } from '@/lib/dashboard-api'
import { useState } from "react"
import { transactionApi } from "@/lib/transaction-api"
import { useDataTable } from "@/hooks/useDataTable"
import { TransactionDetails } from "@/components/transactions/details"
import { DataTable } from "@/components/ui/data-table"
import { txnStatColumns, filters } from "./table-config"

interface RecentTransactionsProps {
  alerts?: DashboardData['alerts']
}

function formatAlertDate(date: string | null): string {
  if (!date) return ''
  try {
    const d = new Date(date)
    const now = new Date()
    const isToday = d.toDateString() === now.toDateString()
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    return isToday ? `Today, ${time}` : `${d.toLocaleDateString()}, ${time}`
  } catch {
    return ''
  }
}

export default function RecentTransactions({ alerts }: RecentTransactionsProps) {
  const [stats, setStats] = useState<any>(null)
  const { fetchData, fetchDetails } = useDataTable({ api: transactionApi, onStatsUpdate: setStats })


  return (
    <Card className="p-6 w-full">

      <div className="flex items-center justify-between mb-7">
        <p className="font-semibold text-lg dark:text-white">
          Recent Transactions
        </p>
        <LinkBtn route="/transactions" text="View all" />
      </div>

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
        pageSize={10}
        pagination={false}
      />

    </Card>
  )
}
