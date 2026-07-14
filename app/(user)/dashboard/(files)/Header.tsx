'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

const INTERVAL_OPTIONS = [
  { label: 'Today', value: 'daily' },
  { label: 'Last 7 days', value: 'weekly' },
  { label: '30 days', value: '30d' },
  { label: 'One year', value: 'oneY' },
  { label: 'Custom', value: 'customy' },
]


const today = () => new Date().toISOString().split('T')[0]
const thirtyDaysAgo = () => {
  const d = new Date()
  d.setDate(d.getDate() - 30)
  return d.toISOString().split('T')[0]
}

export default function Header() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const startDate = searchParams.get('startDate') || thirtyDaysAgo()
  const endDate = searchParams.get('endDate') || today()
  const interval = searchParams.get('interval') || 'daily'
  const [loading, setLoading] = useState(true)

  function changeInterval(newInterval: string) {
    const params = new URLSearchParams({ startDate, endDate, interval: newInterval })
    router.push(`?${params.toString()}`)
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5">

        <div>
          <p className="text-lg lg:text-2xl font-bold mb-1 dark:text-white">
            Good morning 👋🏽
          </p>
          <p className="text-sm sm:text-lg text-black/60 dark:text-white/60">
            Here's how your business is doing today
          </p>
        </div>

        <div className="inline-flex flex-wrap rounded-lg border border-border overflow-hidden">
          {INTERVAL_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => changeInterval(opt.value)}
              className={cn(
                'px-3 py-2 text-xs sm:px-4 sm:text-sm font-medium transition-colors',
                interval === opt.value
                  ? 'bg-[#FC6401] text-white'
                  : 'bg-white dark:bg-card text-muted-foreground hover:bg-accent dark:hover:bg-accent'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}
