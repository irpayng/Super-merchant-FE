import { apiRequest, uploadFile, buildQueryString } from './api'

export interface AggregatorTerminalRow {
  id: number
  aggregator_id: number
  serial: string
  created_at: string
  /**
   * Agent who currently has the device prepped to their account. Populated
   * via {@code terminals.user_id} once the agent runs the prep flow on the
   * POS — null when the device hasn't been prepped yet.
   */
  agent_id?: number | null
  agent_name?: string | null
  agent_email?: string | null
  agent_phone?: string | null
  locked?: boolean
  last_seen_at?: string | null
}

export interface AggregatorTerminalListResponse {
  data: {
    aggregator_id: number
    total: number
    items: AggregatorTerminalRow[]
  }
  code: number
  message: string
}

export interface AggregatorAgentRow {
  id: number
  email: string | null
  phone_number: string | null
  type: string | null
  name: string | null
  created_at: string | null
  /** Number of POS terminals currently in this agent's custody. */
  terminal_count?: number
  /** Lifetime transaction count for this agent. */
  transaction_count?: number
  /** Lifetime completed transaction volume (NGN). */
  transaction_volume?: number
  /** Most recent transaction timestamp, or null if the agent hasn't transacted. */
  last_transaction_at?: string | null
}

export interface AggregatorAgentListResponse {
  data: {
    aggregator_id: number
    total: number
    items: AggregatorAgentRow[]
  }
  code: number
  message: string
}

export interface AggregatorStats {
  terminals_dispatched: number
  terminals_in_custody: number
  agents_total: number
  active_agents_30d: number
  transactions_total: number
  volume_total: number
  transactions_30d: number
  volume_30d: number
  commission_total: number
  commission_30d: number
}

export interface AggregatorStatsResponse {
  data: AggregatorStats
  code: number
  message: string
}

class AggregatorTerminalApi {
  /** Serials currently dispatched to an aggregator (the pivot, not the children users). */
  list = async (aggregatorId: number | string) => {
    return apiRequest<AggregatorTerminalListResponse>(`/aggregators/${aggregatorId}/terminals`)
  }

  /** Bulk dispatch via CSV/XLSX with a `serial` column. */
  upload = async (aggregatorId: number | string, file: File) => {
    return uploadFile(`/aggregators/${aggregatorId}/terminals/upload`, file)
  }

  /** Reclaim a serial from an aggregator (removes the dispatch record only). */
  unassign = async (aggregatorId: number | string, serial: string) => {
    return apiRequest(`/aggregators/${aggregatorId}/terminals/${encodeURIComponent(serial)}`, {
      method: 'DELETE',
    })
  }

  /** Children of the aggregator — agents whose `parent_id` points at this aggregator. */
  agents = async (aggregatorId: number | string) => {
    return apiRequest<AggregatorAgentListResponse>(`/aggregators/${aggregatorId}/agents`)
  }

  /**
   * Per-aggregator analytics for the detail page. Sources every count locally
   * from the read replica — no extra round-trip to config-service.
   */
  stats = async (aggregatorId: number | string) => {
    return apiRequest<AggregatorStatsResponse>(`/aggregators/${aggregatorId}/stats`)
  }

  /**
   * Paginated cross-aggregator listing for the /aggregator-uploads admin page.
   * Returns the same shape as the rest of the admin tables (`data: items[]`,
   * `meta`, `links`, optional `stats`/`filters`) so it plugs straight into
   * `useDataTable`.
   */
  getItems = async (params: Record<string, any> = {}) => {
    return apiRequest<any>(`/aggregator-uploads?${buildQueryString(params)}`)
  }

  /**
   * Bulk dispatch endpoint that accepts the aggregator id as a form field.
   * Used by the upload modal on the global page so the admin doesn't need
   * to navigate to a per-aggregator URL first.
   */
  uploadGlobal = async (aggregatorId: number | string, file: File) => {
    return uploadFile(`/aggregator-uploads`, file, { aggregator_id: String(aggregatorId) })
  }

  /**
   * Dispatch a single serial without a CSV. Idempotent — re-dispatching the
   * same (serial, aggregator) pair is a no-op; dispatching a serial that
   * already belongs to another aggregator reassigns it.
   */
  assignSingle = async (aggregatorId: number | string, serial: string) => {
    return apiRequest<{ data: any; code: number; message: string }>(
      `/aggregator-uploads/single`,
      {
        method: 'POST',
        body: { aggregator_id: Number(aggregatorId), serial: serial.trim() },
      }
    )
  }
}

export const aggregatorTerminalApi = new AggregatorTerminalApi()
