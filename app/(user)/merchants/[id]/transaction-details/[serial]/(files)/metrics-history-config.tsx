'use client'

import { TerminalMetric } from '@/lib/terminal-api'

/**
 * Columns for the per-terminal metrics-history DataTable.
 *
 * <p>The "Location" cell prints lat,lon to 4 decimals (~11m precision) plus
 * accuracy when present so the operator can spot a drift or a stuck cache
 * without opening every row. Battery / network / printer use plain text
 * formatters here (instead of Badges) so the DataTable's CSV export and
 * sort behave sensibly.
 */
export const metricsHistoryColumns = [
  { key: 'created_at', label: 'Reported At', date: true },
  {
    key: 'battery_pct',
    label: 'Battery',
    render: (_: unknown, row: TerminalMetric) => {
      if (row.battery_pct == null) return '—'
      const temp = row.battery_temp_c != null ? ` · ${row.battery_temp_c}°C` : ''
      const plug = row.battery_plugged ? ' · plugged' : ''
      return `${row.battery_pct}%${plug}${temp}`
    },
  },
  {
    key: 'network_type',
    label: 'Network',
    render: (_: unknown, row: TerminalMetric) => {
      if (!row.network_type || row.network_type === 'none') return 'offline'
      return row.carrier_name ? `${row.network_type} · ${row.carrier_name}` : row.network_type
    },
  },
  {
    key: 'signal_strength',
    label: 'Signal',
    render: (_: unknown, row: TerminalMetric) =>
      row.signal_strength != null ? `${row.signal_strength} dBm` : '—',
  },
  {
    key: 'printer_status',
    label: 'Printer',
    render: (_: unknown, row: TerminalMetric) => {
      if (row.printer_status == null) return '—'
      return row.printer_status === 0 ? 'ready' : `code ${row.printer_status}`
    },
  },
  { key: 'app_version', label: 'App' },
  { key: 'firmware_version', label: 'Firmware' },
  {
    key: 'location',
    label: 'Location',
    render: (_: unknown, row: TerminalMetric) => {
      if (row.latitude == null || row.longitude == null) return '—'
      const acc = row.location_accuracy_m != null ? ` · ±${Math.round(row.location_accuracy_m)}m` : ''
      return `${row.latitude.toFixed(4)}, ${row.longitude.toFixed(4)}${acc}`
    },
  },
  {
    key: 'storage_avail_bytes',
    label: 'Storage Free',
    render: (_: unknown, row: TerminalMetric) => formatBytes(row.storage_avail_bytes),
  },
  {
    key: 'ram_avail_bytes',
    label: 'RAM Free',
    render: (_: unknown, row: TerminalMetric) => formatBytes(row.ram_avail_bytes),
  },
]

function formatBytes(bytes: number | null | undefined): string {
  if (bytes == null) return '—'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let value = bytes
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit++
  }
  return `${value.toFixed(value < 10 ? 1 : 0)} ${units[unit]}`
}
