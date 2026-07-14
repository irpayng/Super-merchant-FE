import { Info } from "lucide-react"

interface InfoAlertProps {
  children: React.ReactNode
}

export function InfoAlert({ children }: InfoAlertProps) {
  return (
    <div className="flex items-start gap-2 p-3 rounded-xl bg-secondary dark:bg-primary/10">
      <Info className="h-5 w-5 text-primary flex-shrink-0" />
      <p className="text-primary text-xs">{children}</p>
    </div>
  )
}
