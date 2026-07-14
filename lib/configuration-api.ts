import { BaseApi, ItemResponse } from './base-api'

export interface Configuration {
  id: string
  module: string
  type: string
  expression: string | Record<string, any>
  value: string
  description: string
  created_at: string
}

class ConfigurationApi extends BaseApi<Configuration> {
  constructor(endpoint: string, subEndpoint?: string) {
    super(subEndpoint ? `${endpoint}/${subEndpoint}` : endpoint)
  }

  getItems = async (params: Record<string, any>) => {
    const { buildQueryString, apiRequest } = await import('./api')
    const query = buildQueryString(params)
    return apiRequest<import('./base-api').PaginatedResponse<Configuration>>(`/configurations?${query}`)
  }
}

export const configurationApi = new ConfigurationApi('configurations')
export const limitApi = new ConfigurationApi('configurations', 'limits')
export const commissionApi = new ConfigurationApi('configurations', 'commissions')
export const chargeApi = new ConfigurationApi('configurations', 'charges')
export const availabilityApi = new ConfigurationApi('configurations', 'availabilities')
export const providerApi = new ConfigurationApi('configurations', 'providers')
