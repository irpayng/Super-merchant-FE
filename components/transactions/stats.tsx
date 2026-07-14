import { Package, CircleArrowDown, Timer, CircleArrowUp } from "lucide-react"
import { StatCard } from "@/components/ui/stat-card"
import { StatsGrid } from "@/components/ui/stats-grid"

interface TransactionStatsProps {
  stats?: {
    total?: { count: number; total: number; percentage: number }
    completed?: { count: number; total: number; percentage: number }
    processing?: { count: number; total: number; percentage: number }
    failed?: { count: number; total: number; percentage: number }
    reversed?: { count: number; total: number; percentage: number }
  }
}
// 
export function TransactionStats({ stats }: TransactionStatsProps) {
  const statCards = [
    {
      title: "Total Transactions",
      value: stats?.total?.total || 0,
      icon: Package,
      iconBgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      title: "Total Approved",
      value: stats?.completed?.total || 0,
      icon: CircleArrowDown,
      iconBgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      title: "Total Declined",
      value: stats?.failed?.total || 0,
      icon: CircleArrowUp,
      iconBgColor: "bg-red-50",
      iconColor: "text-red-600"
    },
    {
      title: "Pending Transactions",
      value: stats?.processing?.total || 0,
      icon: Timer,
      iconBgColor: "bg-orange-50",
      iconColor: "text-orange-600"
    }
  ]

  return (
    <StatsGrid cols={4}>
      {statCards.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          iconBgColor={stat.iconBgColor}
          iconColor={stat.iconColor}
          currency={true}
        />
      ))}
    </StatsGrid>
  )
}
