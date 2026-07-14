import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
  status: string | { code?: string; name?: string; context?: string }
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusCode = typeof status === 'string' ? status : status?.code || ''
  const statusLower = statusCode.toLowerCase()
  const variant = statusLower === "successful" || statusLower === "success" || statusLower === "completed" ? "success" 
    : statusLower === "pending" ? "warning" 
    : "error"
  
  return <Badge variant={variant}>{statusCode}</Badge>
}
