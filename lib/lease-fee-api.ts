import { BaseApi, ItemResponse } from './base-api'

/**
 * POS lease fee configuration. Backed by tms-report-java's
 * `/configurations/pos-lease-fees` controller, which reads the `fee/pos-lease`
 * rows from the replica DB and proxies writes to config-service.
 *
 * Three scopes, resolved by config-service with agent > aggregator > global
 * precedence at lease time:
 *   • global   — the baseline fee (null expression)
 *   • aggregator — a fee set on an aggregator; cascades to all its downliners
 *   • agent      — a fee set on a specific agent; overrides both above
 *
 * The aggregator/agent distinction is presentational — both serialize to a
 * single-key `{"user": "<id>"}` expression on the backend, and the resolver
 * applies an aggregator's fee to its downliners automatically.
 */
export interface LeaseFeeConfig {
  id: string
  module: string
  type: string
  expression: { user?: string } | null
  value: string
  description: string
  created_at: string
}

class LeaseFeeApi extends BaseApi<LeaseFeeConfig> {
  constructor() {
    super('configurations')
  }

  getItems = async (params: Record<string, any> = {}) => {
    const { apiRequest, buildQueryString } = await import('./api')
    return apiRequest<any>(`/configurations/pos-lease-fees?${buildQueryString(params)}`)
  }

  createItem = async (data: any, options?: { suppressToast?: boolean }) => {
    const { apiRequest } = await import('./api')
    return apiRequest<ItemResponse<LeaseFeeConfig>>('/configurations/pos-lease-fees', {
      method: 'POST',
      body: data,
      suppressToast: options?.suppressToast,
    })
  }

  updateItem = async (id: string | number, data: any) => {
    const { apiRequest } = await import('./api')
    return apiRequest<ItemResponse<LeaseFeeConfig>>(`/configurations/pos-lease-fees/${id}`, {
      method: 'PUT',
      body: data,
    })
  }

  deleteItem = async (id: string | number) => {
    const { apiRequest } = await import('./api')
    return apiRequest(`/configurations/${id}`, { method: 'DELETE' })
  }
}

export const leaseFeeApi = new LeaseFeeApi()
