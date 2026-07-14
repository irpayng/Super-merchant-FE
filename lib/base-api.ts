import { apiRequest, buildQueryString, downloadFile } from './api'

export interface PaginatedResponse<T> {
  data: T[]
  links: { first: string; last: string; prev: string | null; next: string | null }
  meta: {
    current_page: number
    from: number
    last_page: number
    per_page: number
    to: number
    total: number
  }
  filters?: any
  stats?: any
  roles?: Array<{ name: string; id: string }>
  code: number
  message: string
}

export interface ItemResponse<T> {
  data: T
  code: number
  message: string
}

export class BaseApi<T> {
  constructor(protected endpoint: string) {}

  getItems = async (params: Record<string, any>) => {
    const query = buildQueryString(params)
    return apiRequest<PaginatedResponse<T>>(`/${this.endpoint}?${query}`)
  }

  getItem = async (id: string) => {
    return apiRequest<ItemResponse<T>>(`/${this.endpoint}/${id}`)
  }

  createItem = async (data: any, options?: { suppressToast?: boolean }) => {
    return apiRequest<ItemResponse<T>>(`/${this.endpoint}`, { method: 'POST', body: data, suppressToast: options?.suppressToast })
  }

  updateItem = async (id: string | number, data: any) => {
    return apiRequest<ItemResponse<T>>(`/${this.endpoint}/${id}`, { method: 'PUT', body: data })
  }

  deleteItem = async (id: string | number) => {
    return apiRequest(`/${this.endpoint}/${id}`, { method: 'DELETE' })
  }

  downloadItems = async (params: Record<string, any>) => {
    return downloadFile(`/${this.endpoint}/download`, params, this.endpoint)
  }
}
