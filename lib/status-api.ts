import { apiRequest, buildQueryString } from './api'

interface Status {
  id: string
  name: string
  code: string
}

interface StatusResponse {
  data: Status[]
  code: number
  message: string
}

export const statusApi = {
  getStatuses: async (category?: 'transaction' | 'kyc' | 'dispute'): Promise<StatusResponse> => {
    const query = category ? `?${buildQueryString({ category })}` : ''
    return apiRequest<StatusResponse>(`/statuses/all${query}`)
  }
}
