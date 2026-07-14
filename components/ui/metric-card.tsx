import { formatCurrency, formatCurrencyAbbreviated } from "@/lib/currency"
import Link from "next/link"
import { Tooltip } from "./tooltip"

interface MetricCardProps {
  label: string
  value: string | number
  change?: {
    value: string
    isPositive: boolean
  }
  color?: string
  currency?: boolean
  href?: string
}

export function MetricCard({ 
  label, 
  value, 
  color = "text-foreground",
  currency = false,
  href
}: MetricCardProps) {
  const displayValue = currency && typeof value === 'number' ? formatCurrencyAbbreviated(value) : value
  const fullValue = currency && typeof value === 'number' ? formatCurrency(value) : null
  
  const content = (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="flex items-end justify-between gap-2">
        {fullValue ? (
          <Tooltip content={fullValue}>
            <p className={`text-2xl font-semibold ${color} cursor-help`}>{displayValue}</p>
          </Tooltip>
        ) : (
          <p className={`text-2xl font-semibold ${color}`}>{displayValue}</p>
        )}
      </div>
    </div>
  )
  
  if (href) {
    return (
      <Link href={href} className="px-4 first:pl-0 last:pr-0 cursor-pointer hover:opacity-80 transition-opacity">
        {content}
      </Link>
    )
  }
  
  return (
    <div className="px-4 first:pl-0 last:pr-0">
      {content}
    </div>
  )
}