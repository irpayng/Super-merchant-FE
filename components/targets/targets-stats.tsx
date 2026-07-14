'use client'

import { useEffect, useState } from 'react'
import {
  AlertTriangle,
  Ban,
  Banknote,
  CheckCircle2,
  Hourglass,
  ShieldCheck,
  ShieldOff,
  Target,
  TrendingDown,
  TrendingUp,
  UserMinus,
  Users,
} from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { StatsGrid } from '@/components/ui/stats-grid'
import { targetsOpsApi, TargetStats } from '@/lib/targets-api'

/**
 * Hero strip for the Activity Targets page. Loads /targets/stats once on
 * mount; caller can re-trigger via the {@code refreshKey} prop (bumped after
 * a rule create/edit/delete so the live counts catch up).
 *
 * Each card carries one number — sum-of-set, compliant agents, defaults,
 * unblock-fee collections, etc. Currency cards format as NGN; everything
 * else as a count.
 */
export function TargetsStats({ refreshKey = 0 }: { refreshKey?: number }) {
  const [stats, setStats] = useState<TargetStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    targetsOpsApi
      .stats()
      .then((data) => {
        if (mounted) {
          setStats(data)
          setLoading(false)
        }
      })
      .catch(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [refreshKey])

  if (loading) {
    return (
      <StatsGrid cols={4}>
        {Array.from({ length: 8 }).map((_, i) => (
          <StatCard key={i} title='' value='' icon={Target} loading />
        ))}
      </StatsGrid>
    )
  }

  if (!stats) return null

  return (
    <StatsGrid cols={4}>
      <StatCard
        title='Active rules'
        value={stats.active_rules}
        icon={ShieldCheck}
        iconBgColor='bg-blue-50'
        iconColor='text-blue-600'
      />
      <StatCard
        title='Agents with targets'
        value={stats.agents_with_targets}
        icon={Users}
        iconBgColor='bg-orange-50'
        iconColor='text-primary'
      />
      <StatCard
        title='Target volume set'
        value={stats.target_volume_set}
        icon={Target}
        iconBgColor='bg-purple-50'
        iconColor='text-purple-600'
        currency
      />
      <StatCard
        title='Target txns set'
        value={stats.target_count_set ?? 0}
        icon={Target}
        iconBgColor='bg-indigo-50'
        iconColor='text-indigo-600'
        subtitle='Across all enabled rules'
      />
      <StatCard
        title='Compliant (last period)'
        value={stats.compliant_last_period}
        icon={CheckCircle2}
        iconBgColor='bg-green-50'
        iconColor='text-green-600'
      />
      <StatCard
        title='In default this month'
        value={stats.in_default}
        icon={TrendingDown}
        iconBgColor='bg-red-50'
        iconColor='text-red-600'
      />
      <StatCard
        title='Defaults this month'
        value={stats.defaults_this_month}
        icon={AlertTriangle}
        iconBgColor='bg-amber-50'
        iconColor='text-amber-600'
        subtitle={`${stats.waived_this_month} waived · ${stats.pending_penalties} pending penalty`}
      />
      <StatCard
        title='POS blocked'
        value={stats.pos_blocks_active}
        icon={ShieldOff}
        iconBgColor='bg-red-50'
        iconColor='text-red-600'
        subtitle={
          stats.pos_blocks_demand_return > 0
            ? `${stats.pos_blocks_demand_return} demand-return`
            : undefined
        }
      />
      <StatCard
        title='Unblock fees collected'
        value={stats.unblock_fees_collected}
        icon={Banknote}
        iconBgColor='bg-green-50'
        iconColor='text-green-600'
        currency
      />
      <StatCard
        title='Aggregators decommissioned'
        value={stats.aggregators_decommissioned}
        icon={UserMinus}
        iconBgColor='bg-rose-50'
        iconColor='text-rose-600'
      />
      <StatCard
        title='Pending penalties'
        value={stats.pending_penalties}
        icon={Hourglass}
        iconBgColor='bg-yellow-50'
        iconColor='text-yellow-600'
      />
      <StatCard
        title='Waivers this month'
        value={stats.waived_this_month}
        icon={Ban}
        iconBgColor='bg-slate-50'
        iconColor='text-slate-600'
      />
      <StatCard
        title='Compliance rate'
        value={
          stats.agents_with_targets > 0
            ? `${Math.round((stats.compliant_last_period / stats.agents_with_targets) * 100)}%`
            : '—'
        }
        icon={TrendingUp}
        iconBgColor='bg-teal-50'
        iconColor='text-teal-600'
      />
    </StatsGrid>
  )
}
