import { BaseApi } from './base-api'
import { apiRequest } from './api'

export interface Funding {
  id: string
  reference: string
  funder: string | null
  amount: number
  provider: {
    id: string
    code: string
    name: string
  }
  status: {
    code: string
    name: string
    context: string
    description: string | null
    id: string
  }
  log: string | null
  created_at: string
}

class FundingApi extends BaseApi<Funding> {
  constructor() {
    super('fundings')
  }

  reverseFunding = async (id: string, data: { reason: string; password: string }, options?: { suppressToast?: boolean }) => {
    return apiRequest(`/${this.endpoint}/${id}/reverse`, { method: 'PATCH', body: data as any, suppressToast: options?.suppressToast })
  }
}

export const fundingApi = new FundingApi()
