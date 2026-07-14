export function normalizePaginatedResponse<T extends Record<string, any>>(
  response: { 
    data: T[]
    meta?: { last_page: number; total: number }
    filters?: any
    stats?: any
  },
  limit: number
): { data: T[]; total: number; filters?: Record<string, Array<{ name: string; id: string }>>; stats?: any } {
  return {
    data: response.data,
    total: response.meta?.total ?? response.data.length,
    filters: response.filters,
    stats: response.stats
  }
}
