'use client'

import { Card } from '@/components/ui/card'
import LinkBtn from '@/components/misc/LinkBtn'
import { TransactionStats } from './TransactionStats'
import { DashboardData } from '@/lib/dashboard-api'

interface BusinessOverviewProps {
  stats?: DashboardData['transaction_stats']
  loading?: boolean
}

export default function BusinessOverview({ stats, loading }: BusinessOverviewProps) {

  return (
    <Card className="p-6">

      <div className="">

        <div className="flex items-center justify-between mb-4">
          <p className="font-semibold text-lg dark:text-white">
            Business Overview
          </p>
          <LinkBtn route="/dashboard" text="See all" />
        </div>

        <TransactionStats stats={stats} loading={loading} />

      </div>
    </Card>

  )
}
