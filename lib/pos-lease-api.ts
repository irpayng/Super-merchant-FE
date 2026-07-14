import { apiRequest, buildQueryString } from './api'

export interface PosLease {
  id: number
  reference: string
  user_id: number
  user_name: string | null
  serial: string
  amount: string
  aggregator_id: number | null
  aggregator_share: string | null
  payment_method: string
  payment_channel: string
  status_code: 'pending' | 'completed' | 'failed' | 'waived' | 'revoked'
  transaction_reference: string | null
  waived_by_admin_id: number | null
  waiver_reason: string | null
  failure_reason: string | null
  created_at: string
  updated_at: string
  completed_at: string | null
}

export interface PosLeaseListResponse {
  data: {
    items: PosLease[]
    total: number
    page: number
    limit: number
  }
  code: number
  message: string
}

export interface PosLeaseFilters {
  user_id?: number | string
  serial?: string
  status_code?: PosLease['status_code']
  page?: number
  limit?: number
}

class PosLeaseApi {
  /**
   * Paginated listing. Filters by any combination of user_id, serial, and
   * status_code.
   */
  list = async (params: PosLeaseFilters = {}) => {
    // Spring's @RequestParam maps query string params from the path. The
    // tms-report-java endpoint uses `/pos-leases?...` so it shares the
    // same shape as other list endpoints.
    return apiRequest<PosLeaseListResponse>(`/pos-leases?${buildQueryString(params)}`)
  }

  /** Admin override — flip a (user, serial) lease to waived. The user_id is
   * resolved server-side from the existing lease record for the serial; the
   * frontend only needs to supply it explicitly when triggering the waive
   * from a context that doesn't already have a lease row (e.g. pre-creating
   * a waiver for a device the agent hasn't tried to pay for yet — currently
   * not exposed in the UI).
   */
  waive = async (serial: string, reason: string, userId?: number) => {
    return apiRequest('/pos-leases/waive', {
      method: 'POST',
      body: { serial, reason, ...(userId ? { user_id: userId } : {}) },
      // Caller fires its own contextual toast ("Lease waived") so the
      // generic auto toast from the backend message would just stack
      // on top.
      suppressToast: true,
    })
  }

  /** Undo a waiver. */
  revokeWaiver = async (userId: number, serial: string, reason?: string) => {
    const qs = reason ? `?reason=${encodeURIComponent(reason)}` : ''
    return apiRequest(`/pos-leases/waive/${userId}/${encodeURIComponent(serial)}${qs}`, {
      method: 'DELETE',
    })
  }
}

export const posLeaseApi = new PosLeaseApi()
