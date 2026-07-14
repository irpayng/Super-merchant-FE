import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card } from "./card"
import { formatCurrencyAbbreviated, formatCurrency } from "@/lib/currency"
import { Tooltip } from "./tooltip"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  iconBgColor?: string
  iconColor?: string
  currency?: boolean
  loading?: boolean
  /**
   * Render the value on a single truncated line with a hover {@link Tooltip}
   * showing the full value. Use for free-text values that can overflow the
   * card (e.g. a long version name). Ignored for currency values, which have
   * their own abbreviation + tooltip path.
   */
  truncate?: boolean
  /**
   * Period-over-period percentage change. Renders a small up/down badge next
   * to the value. `null`/`undefined` hides the badge (no baseline to compare).
   */
  change?: number | null
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgColor = "bg-orange-50",
  iconColor = "text-primary",
  currency = false,
  loading = false,
  truncate = false,
  change
}: StatCardProps) {
  if (loading) {
    return (
      <Card className="p-6 rounded-2xl">
        <div className="space-y-4">
          <div className="h-11 w-11 rounded-full animate-pulse bg-muted" />
          <div>
            <div className="h-7 w-24 rounded-md animate-pulse bg-muted mb-2" />
            <div className="h-4 w-32 rounded-md animate-pulse bg-muted" />
          </div>
        </div>
      </Card>
    )
  }

  const numericValue = currency ? (typeof value === 'number' ? value : parseFloat(String(value)) || 0) : null
  const displayValue = currency && numericValue !== null ? formatCurrencyAbbreviated(numericValue) : value
  const fullValue = currency && numericValue !== null ? formatCurrency(numericValue) : null

  // Truncate + tooltip for long free-text values (non-currency). The tooltip
  // surfaces the full string on hover; the line itself never overflows the card.
  const truncated = truncate && !currency && value !== null && value !== undefined && value !== ''

  const showChange = change !== null && change !== undefined && !Number.isNaN(change)
  const changePositive = (change ?? 0) >= 0

  return (
    <Card className="p-6 rounded-2xl">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className={`${iconBgColor} dark:bg-primary/10 p-3 rounded-full w-fit`}>
            <Icon className={`w-5 h-5 ${iconColor} dark:text-primary`} />
          </div>
          {showChange && (
            <span
              className={`flect gap-0.5 text-xs font-medium px-2 py-1 rounded-full ${changePositive
                  ? 'bg-green-50 dark:bg-green-500/10 text-green-600'
                  : 'bg-red-50 dark:bg-red-500/10 text-red-600'
                }`}
            >
              {changePositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {Math.abs(change as number).toFixed(1)}%
            </span>
          )}
        </div>
        <div className="min-w-0">
          {fullValue ? (
            <Tooltip content={fullValue}>
              <p className="text-2xl font-semibold mb-1 break-words cursor-help">{displayValue}</p>
            </Tooltip>
          ) : truncated ? (
            <Tooltip content={String(value)}>
              <p className="text-2xl font-semibold mb-1 truncate cursor-help">{displayValue}</p>
            </Tooltip>
          ) : (
            <p className="text-2xl font-semibold mb-1.5 break-words">{displayValue}</p>
          )}
          <p className="text-sm text-muted-foreground">{title}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </Card>
  )
}