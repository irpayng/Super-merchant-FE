import { BaseApi } from './base-api'
import { uploadFile, apiRequest, downloadFile } from './api'

export interface Terminal {
  id: string
  serial: string
  make: string
  model?: string
  os: string
  user_id?: number | null
  user?: { id: number; name: string; email: string } | null
  locked?: boolean
  created_at: string
}

export interface TerminalMetric {
  id: number
  terminal_id: number
  serial: string
  model?: string | null
  vendor?: string | null
  os_version?: string | null
  sdk_version?: string | null
  firmware_version?: string | null
  kernel_version?: string | null
  app_version?: string | null
  battery_pct?: number | null
  battery_temp_c?: number | null
  battery_voltage_mv?: number | null
  battery_plugged?: boolean | null
  battery_health?: string | null
  ram_total_bytes?: number | null
  ram_avail_bytes?: number | null
  storage_total_bytes?: number | null
  storage_avail_bytes?: number | null
  network_type?: string | null
  signal_strength?: number | null
  carrier_name?: string | null
  printer_status?: number | null
  uptime_ms?: number | null
  boot_count?: number | null
  latitude?: number | null
  longitude?: number | null
  location_accuracy_m?: number | null
  location_at?: string | null
  location_permission?: boolean | null
  location_services_enabled?: boolean | null
  raw_payload?: Record<string, unknown> | null
  collected_at: string
  created_at: string
}

export interface FleetHealthSummary {
  reporting: number
  low_battery: number
  printer_not_ready: number
  stale_24h: number
}

export interface TerminalVirtualAccount {
  account_name: string | null
  account_number: string | null
  bank_name: string | null
  bank_code: string | null
  single_use: boolean
  created_at: string | null
}

class TerminalApi extends BaseApi<Terminal> {
  constructor() {
    super('terminals')
  }

  uploadSerials = async (file: File) => {
    return uploadFile('/terminals', file)
  }

  unmap = async (id: string) => {
    return apiRequest(`/terminals/${id}/unmap`, { method: 'PATCH' })
  }

  downloadSample = async () => {
    return downloadFile('/terminals/download-sample', {}, 'terminals-sample')
  }

  // ── Device Metrics ────────────────────────────────────────

  latestMetrics = async (serial: string) => {
    return apiRequest<{ data: TerminalMetric }>(`/terminals/${serial}/metrics/latest`)
  }

  metricsHistory = async (serial: string, params: { from?: string; to?: string; page?: number; limit?: number } = {}) => {
    const search = new URLSearchParams()
    if (params.from) search.set('from', params.from)
    if (params.to) search.set('to', params.to)
    if (params.page) search.set('page', String(params.page))
    if (params.limit) search.set('limit', String(params.limit))
    const qs = search.toString()
    return apiRequest<{ data: TerminalMetric[]; meta: Record<string, unknown> }>(
      `/terminals/${serial}/metrics${qs ? `?${qs}` : ''}`,
    )
  }

  fleetHealth = async () => {
    return apiRequest<{ data: FleetHealthSummary }>('/terminals/metrics/fleet-health')
  }

  /**
   * Per-POS-device virtual accounts provisioned for this terminal (one VA per
   * active funding provider). Backed by the replicated virtual_accounts rows
   * with purpose='pos-device' and purpose_reference=<serial>.
   */
  virtualAccounts = async (serial: string) => {
    return apiRequest<{ data: TerminalVirtualAccount[] }>(`/terminals/${encodeURIComponent(serial)}/virtual-accounts`)
  }

  /**
   * Look up a terminal by serial. The list endpoint already filters via
   * search; we just take the first match. Used by the standalone detail
   * page so the URL slug is human-meaningful.
   */
  getBySerial = async (serial: string) => {
    return apiRequest<{ data: Terminal[] }>(`/terminals?search=${encodeURIComponent(serial)}&limit=1`)
  }

  /**
   * Lock a terminal with a reason message. The POS polls the per-serial
   * status endpoint and renders a contact-support block screen until the
   * lock is cleared.
   */
  lock = async (id: string | number, message: string) => {
    // suppressToast — the calling UI surfaces a contextual toast (with the
    // serial); we don't want the generic backend message to fire alongside.
    return apiRequest<{ data: any }>(`/terminals/${id}/lock`, {
      method: 'POST',
      body: { message },
      suppressToast: true,
    })
  }

  /**
   * Clear an existing lock so the device can resume taking transactions.
   */
  unlock = async (id: string | number) => {
    // suppressToast — see note on lock().
    return apiRequest<{ data: any }>(`/terminals/${id}/unlock`, {
      method: 'POST',
      suppressToast: true,
    })
  }

  /**
   * Remotely re-prep a terminal. Pushes an MQTT signal to the device so it
   * downloads a fresh TMK/TPK pair and re-injects them into the secure pin
   * pad in the background. The agent doesn't have to do anything — useful
   * after a key rotation or when a device is stuck on stale keys.
   */
  requestPrep = async (id: string | number) => {
    // suppressToast — UI surfaces a contextual toast with the serial.
    return apiRequest<{ data: { serial: string; delivered: boolean } }>(
      `/terminals/${id}/request-prep`,
      {
        method: 'POST',
        suppressToast: true,
      },
    )
  }

  /**
   * Backfill per-POS-device virtual accounts. Re-emits a `terminal-mapped`
   * event for every terminal currently bound to a user so virtual-account
   * provisions a dedicated VA per active provider. Idempotent.
   *
   * Optional filters: `user_id` (single agent's terminals), `limit` (cap rows
   * per call for paging a large fleet).
   */
  backfillDeviceAccounts = async (
    filters: { user_id?: number; limit?: number } = {},
  ) => {
    return apiRequest<{ data: { message: string; reference: string } }>(
      '/terminals/backfill-device-accounts',
      {
        method: 'POST',
        body: filters,
        suppressToast: true,
      },
    )
  }
}

export const terminalApi = new TerminalApi()
