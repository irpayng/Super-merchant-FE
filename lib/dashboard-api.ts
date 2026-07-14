import { apiRequest } from './api'

export interface TransactionStatBucket {
  count: number
  total: number
  percentage: number
}

export interface DashboardData {
  period: {
    start: string
    end: string
  }
  stats: {
    total_processed_value: number
    total_transactions: number
    total_merchants: number
    total_terminals: number
    total_tids: number
  }
  transaction_stats: {
    total: TransactionStatBucket
    completed: TransactionStatBucket
    failed: TransactionStatBucket
    processing: TransactionStatBucket
    reversed: TransactionStatBucket
  }
  deltas: {
    processed_value: number
    transactions: number
  }
  transaction_health: {
    total_count: number
    completed_count: number
    failed_count: number
    processing_count: number
    reversed_count: number
    success_rate: number
    failure_rate: number
    reversal_rate: number
    pending_value: number
    stuck_count: number
  }
  terminals: {
    total: number
    assigned_tids: number
    transacting: number
  }
  charts: {
    transactions_trend: {
      categories: string[]
      series: Array<{
        name: string
        data: number[]
      }>
    }
    product_types: Array<{
      id: number
      name: string
      total: number
    }>
  }
  top_terminals: Array<{
    terminal_serial: string
    count: number
    total: number
  }>
  alerts: Array<{
    type: string
    details: string
    date: string | null
  }>
}

export async function getDashboardData(params?: {
  start_date?: string
  end_date?: string
}): Promise<DashboardData> {
  const query = new URLSearchParams()
  if (params?.start_date) query.set('start_date', params.start_date)
  if (params?.end_date) query.set('end_date', params.end_date)
  const qs = query.toString()
  return apiRequest<DashboardData>(`/dashboard${qs ? `?${qs}` : ''}`)
}
