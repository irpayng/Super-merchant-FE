import { z } from 'zod'
import { UserSearchInput } from '@/components/shared/user-search-input'

const SCOPE_TONES: Record<string, { bg: string; text: string }> = {
  global: { bg: 'bg-cms-gray-20 dark:bg-cms-gray-20/20', text: 'text-cms-gray-10' },
  actor: { bg: 'bg-cms-green-10 dark:bg-cms-green-10/20', text: 'text-cms-green-20' },
}

const ROLE_LABELS: Record<string, string> = {
  agent: 'Agent',
  aggregator: 'Aggregator',
}

const PERIOD_LABELS: Record<string, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
}

const ACTION_LABELS: Record<string, string> = {
  notify_only: 'Notify only',
  lock_funds: 'Lock funds',
  block_pos_with_unblock_fee: 'Block POS — unblock fee',
  block_pos_demand_return: 'Block POS — demand return',
}

const CHANNEL_FILTER_LABELS: Record<string, string> = {
  pos_only: 'POS only',
  all: 'All channels',
  mobile_only: 'Mobile only',
}

const AGG_ACTION_LABELS: Record<string, string> = {
  notify_only: 'Notify only',
  lock_funds: 'Lock funds',
  decommission_with_replacement: 'Decommission',
}

export const columns = [
  {
    key: 'scope',
    label: 'Scope',
    render: (value: any, row: any) => {
      const tone = SCOPE_TONES[value] || SCOPE_TONES.global
      return (
        <div className='space-y-1'>
          <span className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium capitalize ${tone.bg} ${tone.text}`}>
            {value}
          </span>
          {value === 'actor' && row?.actor_id && (
            <div className='text-xs text-muted-foreground'>actor #{row.actor_id}</div>
          )}
        </div>
      )
    },
  },
  {
    key: 'role',
    label: 'Role',
    render: (value: any) => ROLE_LABELS[value] || value,
  },
  {
    key: 'period',
    label: 'Period',
    render: (value: any) => PERIOD_LABELS[value] || value,
  },
  {
    key: 'target_amount',
    label: 'Target',
    render: (_value: any, row: any) => {
      const hasAmount = row?.target_amount != null && Number(row.target_amount) > 0
      const hasCount = row?.target_count != null && Number(row.target_count) > 0
      if (!hasAmount && !hasCount) {
        return <span className='text-xs text-muted-foreground'>—</span>
      }
      return (
        <div className='space-y-0.5'>
          {hasAmount && (
            <div className='text-sm'>
              ₦{Number(row.target_amount).toLocaleString()}
            </div>
          )}
          {hasCount && (
            <div className='text-xs text-muted-foreground'>
              {Number(row.target_count).toLocaleString()} txn{Number(row.target_count) === 1 ? '' : 's'}
            </div>
          )}
        </div>
      )
    },
  },
  {
    key: 'channel_filter',
    label: 'Counts',
    render: (value: any) => {
      const filter = value || 'pos_only'
      const label = CHANNEL_FILTER_LABELS[filter] || filter
      const tone =
        filter === 'pos_only'
          ? 'bg-cms-green-10 dark:bg-cms-green-10/20 text-cms-green-20'
          : 'bg-cms-gray-20 dark:bg-cms-gray-20/20 text-cms-gray-10'
      return (
        <span className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium ${tone}`}>
          {label}
        </span>
      )
    },
  },
  {
    key: 'penalty',
    label: 'Action',
    render: (value: any) => {
      const action = value?.action || 'notify_only'
      return (
        <div className='space-y-0.5'>
          <div className='text-sm'>{ACTION_LABELS[action] || action}</div>
          <div className='text-xs text-muted-foreground'>
            after {value?.consecutive_threshold ?? 3} consecutive
            {value?.penalty_amount && <> · lock ₦{Number(value.penalty_amount).toLocaleString()}/period</>}
            {value?.unblock_fee_amount && <> · fee ₦{Number(value.unblock_fee_amount).toLocaleString()}</>}
            {value?.aggregator_action && <> · agg {AGG_ACTION_LABELS[value.aggregator_action]}</>}
          </div>
        </div>
      )
    },
  },
  {
    key: 'set_by_role',
    label: 'Set by',
    render: (value: any) => {
      if (value === 'aggregator') {
        return (
          <span className='inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium bg-cms-orange-10 dark:bg-cms-orange-10/20 text-cms-orange-20'>
            Aggregator
          </span>
        )
      }
      return <span className='text-sm capitalize'>{value || 'admin'}</span>
    },
  },
  {
    key: 'enabled',
    label: 'Status',
    badge: (value: any): 'success' | 'default' => (value ? 'success' : 'default'),
    render: (value: any) => (value ? 'Active' : 'Disabled'),
  },
  { key: 'created_at', label: 'Created At', date: true },
]

const penaltySchema = z
  .object({
    action: z
      .enum([
        'notify_only',
        'lock_funds',
        'block_pos_with_unblock_fee',
        'block_pos_demand_return',
      ])
      .default('notify_only'),
    consecutive_threshold: z
      .union([z.string(), z.number()])
      .transform((v) => (typeof v === 'string' ? Number(v) : v))
      .pipe(z.number().int().min(1, 'Threshold must be at least 1')),
    penalty_amount: z
      .union([z.string(), z.number(), z.undefined(), z.null()])
      .optional(),
    unblock_fee_amount: z
      .union([z.string(), z.number(), z.undefined(), z.null()])
      .optional(),
    aggregator_action: z
      .enum(['', 'notify_only', 'lock_funds', 'decommission_with_replacement'])
      .optional()
      .or(z.literal('')),
    replacement_aggregator_id: z
      .union([z.string(), z.number(), z.undefined(), z.null()])
      .optional(),
    notify_admin: z.boolean().optional().default(true),
    notify_aggregator: z.boolean().optional().default(true),
  })
  .superRefine((val, ctx) => {
    if (val.action === 'lock_funds') {
      const amt = val.penalty_amount
      if (amt === undefined || amt === null || amt === '' || Number(amt) <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['penalty_amount'],
          message: 'Penalty per period is required for lock funds',
        })
      }
    }
    if (val.action === 'block_pos_with_unblock_fee') {
      const fee = val.unblock_fee_amount
      if (fee === undefined || fee === null || fee === '' || Number(fee) <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['unblock_fee_amount'],
          message: 'Unblock fee is required for this action',
        })
      }
    }
    if (val.aggregator_action === 'lock_funds') {
      const amt = val.penalty_amount
      if (amt === undefined || amt === null || amt === '' || Number(amt) <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['penalty_amount'],
          message: 'Penalty per period is required for aggregator lock funds',
        })
      }
    }
    if (val.aggregator_action === 'decommission_with_replacement') {
      const rep = val.replacement_aggregator_id
      if (rep === undefined || rep === null || rep === '' || Number(rep) <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['replacement_aggregator_id'],
          message: 'Replacement aggregator ID is required',
        })
      }
    }
  })

export const targetRuleSchema = z
  .object({
    scope: z.enum(['global', 'actor']).default('global'),
    role: z.enum(['agent', 'aggregator']).default('agent'),
    period: z.enum(['daily', 'weekly', 'monthly']).default('monthly'),
    actor_id: z
      .union([z.string(), z.number(), z.null(), z.undefined()])
      .optional(),
    target_amount: z
      .union([z.string(), z.number(), z.null(), z.undefined()])
      .optional(),
    target_count: z
      .union([z.string(), z.number(), z.null(), z.undefined()])
      .optional(),
    channel_filter: z.enum(['pos_only', 'all', 'mobile_only']).default('pos_only'),
    penalty: penaltySchema,
    enabled: z.boolean().optional().default(true),
  })
  .superRefine((val, ctx) => {
    const hasAmount =
      val.target_amount !== '' &&
      val.target_amount !== undefined &&
      val.target_amount !== null &&
      Number(val.target_amount) > 0
    const hasCount =
      val.target_count !== '' &&
      val.target_count !== undefined &&
      val.target_count !== null &&
      Number(val.target_count) > 0
    if (!hasAmount && !hasCount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['target_amount'],
        message: 'Set a volume target, a transaction count target, or both',
      })
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['target_count'],
        message: 'Set a volume target, a transaction count target, or both',
      })
    }
    if (val.target_amount !== '' && val.target_amount != null && Number(val.target_amount) < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['target_amount'],
        message: 'Volume target cannot be negative',
      })
    }
    if (val.target_count !== '' && val.target_count != null && Number(val.target_count) < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['target_count'],
        message: 'Transaction count cannot be negative',
      })
    }
  })

/**
 * Map an existing rule into the form's editable shape. Most fields pass
 * through; we just normalize numbers into strings for the inputs.
 */
export const transformRuleDefaults = (row: any) => {
  if (!row) return {}
  return {
    ...row,
    actor_id: row.actor_id == null ? '' : String(row.actor_id),
    target_amount: row.target_amount == null ? '' : String(row.target_amount),
    target_count: row.target_count == null ? '' : String(row.target_count),
    channel_filter: row.channel_filter || 'pos_only',
    penalty: {
      action: row.penalty?.action ?? 'notify_only',
      consecutive_threshold: row.penalty?.consecutive_threshold ?? 3,
      penalty_amount:
        row.penalty?.penalty_amount == null ? '' : String(row.penalty.penalty_amount),
      unblock_fee_amount:
        row.penalty?.unblock_fee_amount == null ? '' : String(row.penalty.unblock_fee_amount),
      aggregator_action: row.penalty?.aggregator_action ?? '',
      replacement_aggregator_id:
        row.penalty?.replacement_aggregator_id == null
          ? ''
          : String(row.penalty.replacement_aggregator_id),
      notify_admin: row.penalty?.notify_admin ?? true,
      notify_aggregator: row.penalty?.notify_aggregator ?? true,
    },
    enabled: row.enabled ?? true,
  }
}

export const buildTargetRuleFormFields = () => [
  {
    name: 'scope',
    label: 'Scope',
    type: 'select' as const,
    placeholder: 'Select scope',
    options: [
      { label: 'Global baseline', value: 'global' },
      { label: 'Per-actor override', value: 'actor' },
    ],
  },
  {
    name: 'role',
    label: 'Applies to',
    type: 'select' as const,
    placeholder: 'Select role',
    options: [
      { label: 'Agent', value: 'agent' },
      { label: 'Aggregator', value: 'aggregator' },
    ],
  },
  {
    name: 'period',
    label: 'Period',
    type: 'select' as const,
    placeholder: 'Select period',
    options: [
      { label: 'Daily', value: 'daily' },
      { label: 'Weekly', value: 'weekly' },
      { label: 'Monthly', value: 'monthly' },
    ],
  },
  {
    name: 'actor_id',
    label: 'Actor',
    type: 'custom' as const,
    visibleWhen: (values: any) => values.scope === 'actor',
    render: ({ value, onChange, error, values }: any) => (
      <UserSearchInput
        value={value === '' || value == null ? null : value}
        onChange={(id) => onChange(id ?? '')}
        userType={values?.role === 'aggregator' ? 'aggregator' : 'agent'}
        placeholder='Search by name, email, or phone…'
        error={error}
      />
    ),
  },
  {
    name: 'target_amount',
    label: 'Volume target (₦ per period)',
    type: 'currency' as const,
    placeholder: 'Optional — leave blank for count-only goals',
  },
  {
    name: 'target_count',
    label: 'Transaction count target (per period)',
    type: 'number' as const,
    placeholder: 'Optional — e.g. 12 txns/day',
  },
  {
    name: 'channel_filter',
    label: 'Counts which transactions',
    type: 'select' as const,
    placeholder: 'Select channel filter',
    options: [
      { label: 'POS only (default — counts transactions done on the POS device)', value: 'pos_only' },
      { label: 'All channels (POS + mobile + API)', value: 'all' },
      { label: 'Mobile only (excludes POS)', value: 'mobile_only' },
    ],
  },
  {
    name: 'penalty.action',
    label: 'Penalty action',
    type: 'select' as const,
    placeholder: 'Select action',
    options: [
      { label: 'Notify only', value: 'notify_only' },
      { label: 'Lock funds (recommended)', value: 'lock_funds' },
      { label: 'Block POS — unblock fee', value: 'block_pos_with_unblock_fee' },
      { label: 'Block POS — demand return', value: 'block_pos_demand_return' },
    ],
  },
  {
    name: 'penalty.consecutive_threshold',
    label: 'Consecutive threshold',
    type: 'number' as const,
    placeholder: 'Default 3',
  },
  {
    name: 'penalty.penalty_amount',
    label: 'Penalty per period',
    type: 'currency' as const,
    placeholder: 'Amount accrued per defaulted period, locked when the window elapses',
    visibleWhen: (values: any) =>
      values.penalty?.action === 'lock_funds' ||
      values.penalty?.aggregator_action === 'lock_funds',
  },
  {
    name: 'penalty.unblock_fee_amount',
    label: 'Unblock fee',
    type: 'currency' as const,
    placeholder: 'Fee charged to clear the penalty',
    visibleWhen: (values: any) =>
      values.penalty?.action === 'block_pos_with_unblock_fee',
  },
  {
    name: 'penalty.aggregator_action',
    label: 'Aggregator action',
    type: 'select' as const,
    placeholder: '(none)',
    visibleWhen: (values: any) => values.role === 'aggregator' && values.period === 'monthly',
    options: [
      { label: '(none)', value: '' },
      { label: 'Notify only', value: 'notify_only' },
      { label: 'Lock funds', value: 'lock_funds' },
      { label: 'Decommission with replacement', value: 'decommission_with_replacement' },
    ],
  },
  {
    name: 'penalty.replacement_aggregator_id',
    label: 'Replacement aggregator ID',
    type: 'number' as const,
    placeholder: 'User ID to receive the downstream',
    visibleWhen: (values: any) =>
      values.role === 'aggregator' && values.penalty?.aggregator_action === 'decommission_with_replacement',
  },
  {
    name: 'enabled',
    label: 'Enabled',
    type: 'checkbox' as const,
  },
]
