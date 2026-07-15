'use client'

import { StatCard } from "@/components/ui/stat-card"
import { Monitor, BatteryWarning, Printer, Clock, ThumbsDown } from "lucide-react"
import { useEffect, useState } from "react"
import { terminalApi, FleetHealthSummary } from "@/lib/terminal-api"

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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
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
        icon={ThumbsDown}
        title="Stale (>24h)"
        value={fmt(summary?.stale_24h)}
        iconBgColor="bg-gray-50"
        iconColor="text-gray-600"
      />
    </div>
  )
}
