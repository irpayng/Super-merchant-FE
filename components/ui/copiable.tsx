"use client"

import * as React from "react"
import { Copy, Check } from "lucide-react"
import { Tooltip } from "./tooltip"
import { Button } from "@/components/ui/button"

interface CopiableProps {
  value: string
  className?: string
  truncate?: boolean
}

export function Copiable({ value, className = "", truncate = false }: CopiableProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-2 min-w-0 max-w-full">
      {truncate ? (
        <Tooltip content={<p>{value}</p>}>
          <span className={`truncate block cursor-default ${className}`}>{value}</span>
        </Tooltip>
      ) : (
        <span className={className}>{value}</span>
      )}
      <Button
        onClick={handleCopy}
        variant="text"
        className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <Copy className="h-4 w-4 text-gray-400" />
        )}
      </Button>
    </div>
  )
}
