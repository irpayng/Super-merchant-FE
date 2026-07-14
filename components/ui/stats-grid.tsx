import { ReactNode } from "react"

interface StatsGridProps {
  children: ReactNode
  cols?: 2 | 3 | 4 | 5
}

export function StatsGrid({ children, cols = 5 }: StatsGridProps) {
  const colsClass = {
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5"
  }[cols]

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 ${colsClass} gap-4`}>
      {children}
    </div>
  )
}
