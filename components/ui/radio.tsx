import * as React from "react"
import { cn } from "@/lib/utils"

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, ...props }, ref) => {
    if (label) {
      return (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            ref={ref}
            type="radio"
            className={cn("w-4 h-4 cursor-pointer", className)}
            {...props}
          />
          <span className="text-sm">{label}</span>
        </label>
      )
    }

    return (
      <input
        ref={ref}
        type="radio"
        className={cn("w-4 h-4 cursor-pointer", className)}
        {...props}
      />
    )
  }
)

Radio.displayName = "Radio"
