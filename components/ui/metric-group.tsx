import { ReactNode } from "react"

interface MetricGroupProps {
  title: string
  action?: ReactNode
  children: ReactNode
}

export function MetricGroup({ title, action, children }: MetricGroupProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-medium text-foreground" style={{ letterSpacing: '-0.304px', lineHeight: '32px' }}>{title}</h2>
        {action}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 divide-x-0 sm:divide-x">
        {children}
      </div>
    </div>
  )
}