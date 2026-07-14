'use client'

import { StatCard } from "@/components/ui/stat-card"
import { Monitor, BatteryWarning, Printer, Clock } from "lucide-react"
import { useEffect, useState } from "react"
import { terminalApi, FleetHealthSummary } from "@/lib/terminal-api"

/**
 * Fleet-health summary backed by the read replica in tms-report-java. Falls
 * back to zero values when the {@code terminal_metrics} table is not yet
 * replicated (fresh deploy).
 */
export function TerminalStatsCards() {
  const [summary, setSummary] = useState<FleetHealthSummary | null>(null)

  useEffect(() => {
    let cancelled = false
    terminalApi.fleetHealth()
      .then((res) => {
        if (cancelled) return
        const data = (res as { data?: FleetHealthSummary } | null)?.data ?? null
        setSummary(data)
      })
      .catch(() => {
        // Silent — the cards collapse to em-dash placeholders below
      })
    return () => {
      cancelled = true
    }
  }, [])

  const fmt = (value: number | undefined) => (value == null ? '—' : String(value))

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard
        icon={Monitor}
        title="Reporting Devices"
        value={fmt(summary?.reporting)}
      />
      <StatCard
        icon={BatteryWarning}
        title="Low Battery (<20%)"
        value={fmt(summary?.low_battery)}
        iconBgColor="bg-red-50"
        iconColor="text-red-600"
      />
      <StatCard
        icon={Printer}
        title="Printer Not Ready"
        value={fmt(summary?.printer_not_ready)}
        iconBgColor="bg-amber-50"
        iconColor="text-amber-600"
      />
      <StatCard
        icon={Clock}
        title="Stale (>24h)"
        value={fmt(summary?.stale_24h)}
        iconBgColor="bg-gray-50"
        iconColor="text-gray-600"
      />
    </div>
  )
}
