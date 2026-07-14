"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SliderProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  width?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl"
  headerActions?: React.ReactNode
}

export function Slider({ open, onClose, title, children, width = "2xl", headerActions }: SliderProps) {
  const widthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl"
  }
  const [isVisible, setIsVisible] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
      setTimeout(() => setIsVisible(true), 10)
    } else {
      setIsVisible(false)
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [open])

  if (!open || !mounted) return null

  return createPortal(
    <>
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose} 
      />
      <div 
        className={`fixed right-0 top-0 h-full w-full ${widthClasses[width]} bg-card shadow-xl z-[45] overflow-y-auto transition-transform duration-300 ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <div className="flex items-center gap-2">
            {headerActions}
            <Button onClick={onClose} variant="icon">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="p-6 space-y-4">{children}</div>
      </div>
    </>,
    document.body
  )
}
