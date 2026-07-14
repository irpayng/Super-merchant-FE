import { BaseApi } from './base-api'
import { apiRequest, buildQueryString } from './api'

export interface ClientRequest {
  id: string
  reference: string
  user: { name: string; id: string } | null
  provider: { name: string; id: string }
  source_ip: string
  url: string
  status: string
  duration: string
  created_at: string
}

export interface ClientRequestStats {
  total_calls: number
  successful_calls: number
  failed_calls: number
  timeout_calls: number
  average_response_time: number
}

export interface ClientRequestChartData {
  categories: string[]
  series: any[]
}

class ClientRequestApi extends BaseApi<ClientRequest> {
  getStatusChart = async (params?: Record<string, any>) => {
    const query = params ? buildQueryString(params) : ''
    return apiRequest<ClientRequestChartData>(`/client-requests/charts/status${query ? `?${query}` : ''}`)
  }

  getProvidersChart = async (params?: Record<string, any>) => {
    const query = params ? buildQueryString(params) : ''
    return apiRequest<ClientRequestChartData>(`/client-requests/charts/providers${query ? `?${query}` : ''}`)
  }
}

class ClientRequestProvidersApi extends BaseApi<any> {}

export const clientRequestApi = new ClientRequestApi('client-requests')
export const clientRequestProvidersApi = new ClientRequestProvidersApi('client-requests/providers')
