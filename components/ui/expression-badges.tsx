import { Badge } from "./badge"
import { toSentenceCase } from "@/lib/utils"

interface ExpressionBadgesProps {
  value: any
}

export function ExpressionBadges({ value }: ExpressionBadgesProps) {
  if (!value || value === null) return <span>_</span>
  
  if (typeof value === 'string') return <span>{value}</span>
  
  if (typeof value === 'object') {
    return (
      <div className="flex flex-wrap gap-1">
        {Object.entries(value).map(([key, val]) => (
          <Badge key={key} variant="info">
            {toSentenceCase(key)}: {String(val)}
          </Badge>
        ))}
      </div>
    )
  }
  
  return <span>{String(value)}</span>
}
