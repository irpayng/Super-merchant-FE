import * as React from "react"
import { cn } from "@/lib/utils"

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    if (label) {
      return (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            ref={ref}
            type="checkbox"
            className={cn("w-5 h-5 cursor-pointer rounded border-2 border-gray-300 text-[#FC6401] focus:ring-2 focus:ring-[#FC6401] focus:ring-offset-0", className)}
            style={{ accentColor: '#FC6401' }}
            {...props}
          />
          <span className="text-base">{label}</span>
        </label>
      )
    }

    return (
      <input
        ref={ref}
        type="checkbox"
        className={cn("w-5 h-5 cursor-pointer rounded border-2 border-gray-300 text-[#FC6401] focus:ring-2 focus:ring-[#FC6401] focus:ring-offset-0", className)}
        style={{ accentColor: '#FC6401' }}
        {...props}
      />
    )
  }
)

Checkbox.displayName = "Checkbox"
