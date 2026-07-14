'use client'

import { Card } from '@/components/ui/card'
import LinkBtn from '@/components/misc/LinkBtn'
import { ChevronRight, CircleAlert } from 'lucide-react'
import { DashboardData } from '@/lib/dashboard-api'

interface ActiveAlertsProps {
  alerts?: DashboardData['alerts']
}

function formatAlertDate(date: string | null): string {
  if (!date) return ''
  try {
    const d = new Date(date)
    const now = new Date()
    const isToday = d.toDateString() === now.toDateString()
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    return isToday ? `Today, ${time}` : `${d.toLocaleDateString()}, ${time}`
  } catch {
    return ''
  }
}

export default function ActiveAlerts({ alerts }: ActiveAlertsProps) {
  const items = alerts && alerts.length > 0 ? alerts : null

  return (
    <Card className="p-6 w-full">

      <div className="flex items-center justify-between mb-7">
        <p className="font-semibold text-lg dark:text-white">
          Active Alerts
        </p>
        <LinkBtn route="/dashboard" text="View all" />
      </div>

      {!items ? (
        <p className="text-muted-foreground text-sm">No active alerts</p>
      ) : (
        <div className="space-y-7">
          {items.map((item, idx) => (
            <div key={idx} className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">

              <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                <div className={`bg-red-50 dark:bg-primary/10 p-2.5 sm:p-3 rounded-full shrink-0`}>
                  <CircleAlert className={`w-4 h-4 sm:w-5 sm:h-5 text-red-500 dark:text-primary`} />
                </div>

                <p className="font-medium text-sm sm:text-base truncate">{item.details}</p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 pl-10 sm:pl-0">
                <div className="font-medium text-xs sm:text-sm text-muted-foreground">
                  {formatAlertDate(item.date)}
                </div>

                <button>
                  <ChevronRight className='text-gray-500' size={18} />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </Card>
  )
}
