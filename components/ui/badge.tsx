import * as React from "react"
import { Tooltip } from "./tooltip"

interface BadgeProps {
  children: React.ReactNode
  variant?: "success" | "warning" | "error" | "info" | "default" | "auto"
  value?: any
}

export function Badge({ children, variant = "default", value }: BadgeProps) {
  let finalVariant = variant
  let displayValue = children
  let description = ""

  // Auto-detect variant from value if variant is "auto"
  if (variant === "auto" && value !== undefined) {
    const code = typeof value === 'string' ? value : value?.code || ''
    const name = typeof value === 'string' ? value : value?.name || code
    if (typeof value === 'object' && value?.description) {
      description = value.description
    }
    displayValue = name
    
    const lowerCode = String(code).toLowerCase()
    if (lowerCode === "successful" || lowerCode === "success" || lowerCode === "active" || lowerCode === "completed") {
      finalVariant = "success"
    } else if (lowerCode === "pending" || lowerCode === "processing") {
      finalVariant = "warning"
    } else if (lowerCode === "failed" || lowerCode === "error" || lowerCode === "inactive" || lowerCode === "reversed") {
      finalVariant = "error"
    } else {
      finalVariant = "default"
    }
  }

  const styles = {
    success: { background: "rgba(16, 185, 129, 0.08)", color: "#10B981" },
    warning: { background: "rgba(245, 158, 11, 0.08)", color: "#F59E0B" },
    error: { background: "rgba(239, 68, 68, 0.08)", color: "#EF4444" },
    info: { background: "rgba(59, 130, 246, 0.08)", color: "#3B82F6" },
    default: { background: "rgba(107, 114, 128, 0.08)", color: "#6B7280" },
    auto: { background: "rgba(107, 114, 128, 0.08)", color: "#6B7280" }
  }

  const badge = (
    <span
      style={{
        ...styles[finalVariant],
        padding: "4px 12px",
        borderRadius: "16px",
        fontSize: "12px",
        fontWeight: 500,
        lineHeight: "18px",
        display: "inline-block"
      }}
    >
      {displayValue}
    </span>
  )

  if (description && description.trim()) {
    return <Tooltip content={description}>{badge}</Tooltip>
  }

  return badge
}
