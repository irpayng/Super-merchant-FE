import * as React from "react"
import { cn } from "@/lib/utils"

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          className={cn(
            "w-full px-4 py-3 border rounded-lg outline-none transition-colors resize-none shadow-xs bg-white dark:bg-input text-foreground",
            "placeholder:text-gray-300 dark:placeholder:text-gray-500 placeholder:font-normal placeholder:text-sm",
            "focus:border-[#FC6401] focus:outline-none",
            error ? "border-red-500" : "border-[#D0D5DD] dark:border-border",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className
          )}
          {...props}
        />
      </div>
    )
  }
)

TextArea.displayName = "TextArea"
