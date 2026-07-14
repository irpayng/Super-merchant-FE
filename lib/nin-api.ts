import { BaseApi } from './base-api'
import { apiRequest } from './api'

export interface NinVerification {
  id: number
  user_id: number
  email: string | null
  first_name: string
  middle_name: string | null
  last_name: string
  phone_number: string
  date_of_birth: string
  nin: string
  gender: string
  status: {
    name: string
    context: string
    id: number
  }
  image: {
    default: string
    original: string
    thumbnail: string
  }
  created_at: string
}

class NinApi extends BaseApi<NinVerification> {
  constructor() {
    super('nins')
  }

  approveNin = async (id: string) => {
    return apiRequest<{ data: any; code: number; message: string }>(`/nins/${id}/approve`, { method: 'POST' })
  }

  rejectNin = async (id: string, reason?: string) => {
    return apiRequest<{ data: any; code: number; message: string }>(`/nins/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    })
  }
}

export const ninApi = new NinApi()
