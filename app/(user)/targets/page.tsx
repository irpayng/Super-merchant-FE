'use client'

import { useState } from 'react'
import { DataTable } from '@/components/ui/data-table'
import { useDataTable } from '@/hooks/useDataTable'
import {
  columns,
  targetRuleSchema,
  buildTargetRuleFormFields,
  transformRuleDefaults,
} from '@/components/targets/table-config'
import { TargetsStats } from '@/components/targets/targets-stats'
import { targetRulesApi } from '@/lib/targets-api'

const SCOPE_OPTIONS = [
  { label: 'Global baseline', value: 'global' },
  { label: 'Per-actor override', value: 'actor' },
]

const ROLE_OPTIONS = [
  { label: 'Agent', value: 'agent' },
  { label: 'Aggregator', value: 'aggregator' },
]

const PERIOD_OPTIONS = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
]

const SET_BY_OPTIONS = [
  { label: 'Admin', value: 'admin' },
  { label: 'Aggregator', value: 'aggregator' },
  { label: 'System', value: 'system' },
]

const CHANNEL_FILTER_OPTIONS = [
  { label: 'POS only', value: 'pos_only' },
  { label: 'All channels', value: 'all' },
  { label: 'Mobile only', value: 'mobile_only' },
]

const ENABLED_OPTIONS = [
  { label: 'Active', value: 'true' },
  { label: 'Disabled', value: 'false' },
]

const filterFields = [
  { name: 'scope', label: 'Scope', type: 'select' as const, options: SCOPE_OPTIONS, placeholder: 'Filter by scope' },
  { name: 'role', label: 'Role', type: 'select' as const, options: ROLE_OPTIONS, placeholder: 'Filter by role' },
  { name: 'period', label: 'Period', type: 'select' as const, options: PERIOD_OPTIONS, placeholder: 'Filter by period' },
  { name: 'set_by_role', label: 'Set by', type: 'select' as const, options: SET_BY_OPTIONS, placeholder: 'Filter by setter' },
  { name: 'channel_filter', label: 'Counts', type: 'select' as const, options: CHANNEL_FILTER_OPTIONS, placeholder: 'Filter by channel' },
  { name: 'enabled', label: 'Status', type: 'select' as const, options: ENABLED_OPTIONS, placeholder: 'Filter by status' },
  { name: 'dates', label: 'Date Range', type: 'daterange' as const },
]

/**
 * Activity Targets administration. Lists every rule (global baselines and
 * per-actor overrides) and lets admin create/edit/delete from the standard
 * DataTable shell — same shape as Limits, Charges, Commission, etc.
 */
export default function TargetsPage() {
  const { fetchData } = useDataTable({ api: targetRulesApi })
  const [statsKey, setStatsKey] = useState(0)
  const bumpStats = () => setStatsKey((k) => k + 1)

  return (
    <div className='space-y-6'>
      <TargetsStats refreshKey={statsKey} />
      <DataTable
        title='Activity Targets'
        columns={columns}
        fetchData={fetchData}
        createData={async (data) => {
          await targetRulesApi.createItem(buildPayload(data))
          bumpStats()
        }}
        updateData={async (id, data) => {
          await targetRulesApi.updateItem(id, buildPayload(data))
          bumpStats()
        }}
        deleteData={async (id) => {
          await targetRulesApi.deleteItem(id)
          bumpStats()
        }}
        formFields={buildTargetRuleFormFields}
        formSchema={targetRuleSchema}
        transformEditData={transformRuleDefaults}
        createButtonText='New Rule'
        searchPlaceholder='Search rules...'
        emptyStateText='No rules yet'
        emptyStateDescription='Global baselines and per-actor overrides will appear here once admin sets them.'
        selectable={true}
        filterFields={filterFields}
      />
    </div>
  )
}

/**
 * Reshape the form's flat-ish payload into the API contract. Numeric strings
 * back to numbers; empty optional fields stripped so the backend doesn't
 * receive `''` where it expects `null` or undefined.
 */
function buildPayload(data: any) {
  const payload: any = {
    scope: data.scope,
    role: data.role,
    period: data.period,
    enabled: !!data.enabled,
    set_by_role: 'admin',
    channel_filter: data.channel_filter || 'pos_only',
    penalty: {
      action: data.penalty?.action || 'notify_only',
      consecutive_threshold: Number(data.penalty?.consecutive_threshold ?? 3),
      notify_admin: data.penalty?.notify_admin ?? true,
      notify_aggregator: data.penalty?.notify_aggregator ?? true,
    },
  }
  if (data.target_amount !== '' && data.target_amount != null && Number(data.target_amount) > 0) {
    payload.target_amount = Number(data.target_amount)
  }
  if (data.target_count !== '' && data.target_count != null && Number(data.target_count) > 0) {
    payload.target_count = Number(data.target_count)
  }
  if (data.scope === 'actor' && data.actor_id) {
    payload.actor_id = Number(data.actor_id)
  }
  if (data.penalty?.action === 'lock_funds' && data.penalty?.penalty_amount) {
    payload.penalty.penalty_amount = Number(data.penalty.penalty_amount)
  }
  if (
    data.penalty?.action === 'block_pos_with_unblock_fee' &&
    data.penalty?.unblock_fee_amount
  ) {
    payload.penalty.unblock_fee_amount = Number(data.penalty.unblock_fee_amount)
  }
  if (data.penalty?.aggregator_action) {
    payload.penalty.aggregator_action = data.penalty.aggregator_action
    if (data.penalty.aggregator_action === 'lock_funds' && data.penalty?.penalty_amount) {
      payload.penalty.penalty_amount = Number(data.penalty.penalty_amount)
    }
  }
  if (data.penalty?.replacement_aggregator_id) {
    payload.penalty.replacement_aggregator_id = Number(data.penalty.replacement_aggregator_id)
  }
  return payload
}
