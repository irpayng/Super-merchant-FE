"use client"

import { useState } from "react"
import { CheckCircle, Loader2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "./input"

interface ValidatedInputProps {
  value: string
  onChange: (value: string) => void
  onValidate: (value: string) => Promise<{ success: boolean; name?: string; error?: string }>
  placeholder?: string
  disabled?: boolean
  className?: string
  label?: string
  required?: boolean
}

export function ValidatedInput({
  value,
  onChange,
  onValidate,
  placeholder,
  disabled,
  className,
  label,
  required
}: ValidatedInputProps) {
  const [validating, setValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<{ success: boolean; name?: string; error?: string } | null>(null)

  const handleBlur = async () => {
    if (!value) {
      setValidationResult(null)
      return
    }

    setValidating(true)
    setValidationResult(null)
    
    try {
      const result = await onValidate(value)
      setValidationResult(result)
    } catch (error) {
      setValidationResult({ success: false, error: "Validation failed" })
    } finally {
      setValidating(false)
    }
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block" style={{ color: '#344054', fontSize: '14px', fontWeight: 500, lineHeight: '20px' }}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled || validating}
        error={validationResult?.success === false ? (validationResult.error || "Validation failed") : undefined}
        className={cn(
          "shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] disabled:bg-[#F4F4F4]",
          className
        )}
        style={{ fontSize: '16px', fontWeight: 400, lineHeight: '24px', color: '#000' }}
      />

      {validating && (
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
          <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
          <span className="text-sm text-gray-600">Validating...</span>
        </div>
      )}

      {validationResult?.success && validationResult.name && (
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-sm text-green-600">{validationResult.name}</span>
        </div>
      )}

      {validationResult?.success === false && (
        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-lg">
          <XCircle className="h-4 w-4 text-red-600" />
          <span className="text-sm text-red-600">{validationResult.error || "Validation failed"}</span>
        </div>
      )}
    </div>
  )
}
