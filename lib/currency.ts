export function formatCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return '₦0.00'
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(numValue)) return '₦0.00'
  return `₦${numValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatCurrencyAbbreviated(value: number): string {
  const absValue = Math.abs(value)
  const sign = value < 0 ? '-' : ''
  if (absValue >= 1000000000000) return `${sign}₦${(absValue / 1000000000000).toFixed(1)}T`
  if (absValue >= 1000000000) return `${sign}₦${(absValue / 1000000000).toFixed(1)}B`
  if (absValue >= 1000000) return `${sign}₦${(absValue / 1000000).toFixed(1)}M`
  if (absValue >= 1000) return `${sign}₦${(absValue / 1000).toFixed(0)}k`
  return formatCurrency(value)
}
