"use client"

import { Copy, Check } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface CodeBlockProps {
  content: string | object
}

export function CodeBlock({ content }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const formattedContent = typeof content === 'string' 
    ? (() => {
        try {
          return JSON.stringify(JSON.parse(content), null, 2)
        } catch {
          return content
        }
      })()
    : JSON.stringify(content, null, 2)

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative bg-black text-white p-4 rounded-lg font-mono text-xs overflow-x-auto group">
      <Button
        onClick={handleCopy}
        variant="text"
        className="absolute top-2 right-2 p-2 hover:bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        title="Copy to clipboard"
      >
        {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
      </Button>
      <pre>{formattedContent}</pre>
    </div>
  )
}
