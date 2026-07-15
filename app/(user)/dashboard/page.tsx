'use client'
import BusinessOverview from './(files)/BusinessOverview'
import Recents from './(files)/Recents'
import Header from './(files)/Header'
import { Suspense, useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { type DashboardData, getDashboardData } from '@/lib/dashboard-api'
import RecentTransactions from './(files)/recent-transactions/RecentTransactions'

const today = () => new Date().toISOString().split('T')[0]
const thirtyDaysAgo = () => {
  const d = new Date()
  d.setDate(d.getDate() - 30)
  return d.toISOString().split('T')[0]
}

function DashboardContent() {
  const searchParams = useSearchParams()
  const startDate = searchParams.get('startDate') || thirtyDaysAgo()
  const endDate = searchParams.get('endDate') || today()

  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getDashboardData({
        start_date: startDate,
        end_date: endDate,
      })
      setData(res)
    } catch (e) {
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [startDate, endDate])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="space-y-6">
      <Header />
      <BusinessOverview stats={data?.transaction_stats} loading={loading} />
      <Recents />
      <RecentTransactions alerts={data?.alerts} />
    </div>
  )
}

export default function UserHomepage() {
  return (
    <Suspense fallback={<div className="p-6">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
