import { Banknote, BriefcaseBusiness, ThumbsDown, ChartNoAxesColumn, Users } from "lucide-react"
import { StatCard } from "@/components/ui/stat-card"
import { StatsGrid } from "@/components/ui/stats-grid"

interface TransactionStatsProps {
  stats?: {
    total?: { count: number; total: string | number; percentage: number }
    completed?: { count: number; total: string | number; percentage: number }
    processing?: { count: number; total: string | number; percentage: number }
    failed?: { count: number; total: string | number; percentage: number }
    reversed?: { count: number; total: string | number; percentage: number }
  }
  loading?: boolean
}

export function TransactionStats({ stats, loading: loadingProp }: TransactionStatsProps) {
  const loading = loadingProp ?? !stats

  const statCards = [
    {
      title: "Total Merchants",
      value: stats?.total?.count || 0,
      icon: Users,
      iconBgColor: "bg-orange-50",
      iconColor: "text-orange-600"
    },
    {
      title: "Total Sales Volume",
      value: stats?.total?.count || 0,
      icon: ChartNoAxesColumn,
      iconBgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      title: "Total Sales Value",
      value: stats?.completed?.total || 0,
      icon: Banknote,
      iconBgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      title: "Total Settled Amount",
      value: stats?.failed?.total || 0,
      icon: BriefcaseBusiness,
      iconBgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      title: "Total Pending Settlements",
      value: stats?.processing?.total || 0,
      icon: ThumbsDown,
      iconBgColor: "bg-yellow-50",
      iconColor: "text-yellow-600"
    },
  ]

  return (
    <StatsGrid cols={5}>
      {statCards.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          iconBgColor={stat.iconBgColor}
          iconColor={stat.iconColor}
          loading={loading}
        />
      ))}
    </StatsGrid>
  )
}
