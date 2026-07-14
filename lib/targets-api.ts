import { apiRequest, buildQueryString } from './api'
import { BaseApi, ItemResponse, PaginatedResponse } from './base-api'

export interface TargetRule {
  id: number
  reference: string
  scope: 'global' | 'actor'
  role: 'agent' | 'aggregator'
  period: 'daily' | 'weekly' | 'monthly'
  actor_id: number | null
  set_by_role: 'admin' | 'aggregator' | 'system'
  set_by_id: number | null
  /** Volume target in NGN. Null when the rule is purely count-based. */
  target_amount: string | null
  /** Transaction count target. Null when the rule is purely volume-based. */
  target_count: number | null
  /**
   * Which transactions count toward this rule. Defaults to {@code 'pos_only'}
   * server-side because targets exist to push agents to use the POS device
   * they were issued.
   */
  channel_filter: 'pos_only' | 'all' | 'mobile_only'
  penalty: TargetPenalty
  forecast_thresholds: string | null
  enabled: boolean
  effective_from: string
  created_at: string
  updated_at: string
}

export interface TargetPenalty {
  consecutive_threshold?: number
  action?:
    | 'notify_only'
    | 'lock_funds'
    | 'block_pos_with_unblock_fee'
    | 'block_pos_demand_return'
  /** Per-period accrual locked when the consecutive-default window elapses. Required for {@code lock_funds}. */
  penalty_amount?: string | number
  unblock_fee_amount?: string | number
  aggregator_action?: 'notify_only' | 'lock_funds' | 'decommission_with_replacement'
  replacement_aggregator_id?: number | null
  notify_admin?: boolean
  notify_aggregator?: boolean
}

export interface TargetDefault {
  id: number
  reference: string
  actor_id: number
  role: 'agent' | 'aggregator'
  rule_id: number
  period_id: number
  period_type: 'daily' | 'weekly' | 'monthly'
  period_start: string
  period_end: string
  target_amount: string | null
  target_count: number | null
  achieved_amount: string | null
  achieved_count: number | null
  channel_filter: 'pos_only' | 'all' | 'mobile_only' | null
  consecutive_index: number
  aggregator_id_at_close: number | null
  penalty_applied: string | null
  waived_at: string | null
  waiver_id: number | null
  created_at: string
}

export interface PosBlock {
  id: number
  reference: string
  agent_id: number
  aggregator_id: number | null
  terminal_serial: string | null
  rule_id: number | null
  default_id: number | null
  reason: string
  action: string
  unblock_fee_amount: string | null
  status: 'active' | 'cleared' | 'cleared_by_waiver' | 'recovered' | 'force_cleared'
  blocked_at: string
  cleared_at: string | null
  cleared_by_user_id: number | null
  cleared_note: string | null
  payment_tx_reference: string | null
  created_at: string
}

export interface BlockedTerminalRow {
  id: number
  reference: string
  agent_id: number
  aggregator_id: number | null
  terminal_serial: string | null
  reason: string
  action: string
  status: string
  unblock_fee_amount: string | null
  blocked_at: string
  agent_name: string | null
  agent_phone: string | null
  agent_email: string | null
  aggregator_name: string | null
  last_seen_at: string | null
  last_seen_lat: string | null
  last_seen_lng: string | null
  last_seen_battery_pct: number | null
  last_seen_signal: string | null
}

export interface DefaultingUserRow {
  actor_id: number
  role: 'agent' | 'aggregator'
  name: string | null
  first_name: string | null
  last_name: string | null
  email: string | null
  phone_number: string | null
  user_type: string | null
  aggregator_id: number | null
  aggregator_name: string | null
  aggregator_email: string | null
  aggregator_phone: string | null
  /** Resident address, joined from addresses + states + countries. */
  address: string | null
  lga: string | null
  state: string | null
  open_defaults_count: number
  max_consecutive: number
  total_target: string | null
  total_achieved: string | null
  shortfall: string | null
  latest_default_at: string | null
  latest_period_type: 'daily' | 'weekly' | 'monthly' | null
  has_escalated_penalty: boolean
  has_pending_penalty: boolean
  active_blocks: number
  latest_active_block_id: number | null
  has_demand_return: boolean
}

export interface DefaultingUsersStats {
  total_in_default: number
  agents_in_default: number
  aggregators_in_default: number
  defaults_this_month: number
  at_threshold_breach: number
  notify_only: number
  pending_penalties: number
  total_shortfall: string | number
  with_active_blocks: number
  waived_this_month: number
}

export interface RecoveryStats {
  due_for_recovery: number
  blocked_unblock_fee: number
  recovered_total: number
  recovered_this_month: number
  force_cleared_this_month: number
  aging_over_7_days: number
  aging_over_30_days: number
  avg_days_to_recover: number
  aggregators_with_recoveries: number
}

/**
 * Target rules. Backed by tms-report-java's `/targets/rules` controller —
 * GET reads from the local replica DB; POST/PUT/DELETE proxy to target-service.
 */
export class TargetRulesApi extends BaseApi<TargetRule> {
  constructor() {
    super('targets/rules')
  }
}

export const targetRulesApi = new TargetRulesApi()

/**
 * POS blocks (active and historical). The list endpoint accepts
 * {@code agent_id}, {@code aggregator_id}, {@code terminal_serial},
 * {@code status}, and {@code action} as filters so user/aggregator/terminal
 * detail pages can render their own scoped block table.
 */
export class PosBlocksApi extends BaseApi<PosBlock> {
  constructor() {
    super('pos-blocks')
  }
}

export const posBlocksApi = new PosBlocksApi()

export interface BlockedPosStats {
  total_blocks: number
  active_blocks: number
  active_unblock_fee: number
  active_demand_return: number
  blocks_this_month: number
  cleared_this_month: number
  recovered_this_month: number
  force_cleared_this_month: number
  aging_over_7_days: number
  aging_over_30_days: number
  aggregators_with_active_blocks: number
  agents_with_active_blocks: number
  unblock_fees_collected_this_month: string | number
  unblock_fees_collected_total: string | number
  avg_days_to_recover: number
}

/**
 * Blocked-terminals report. Joined query returning the agent + aggregator +
 * last-seen heartbeat alongside the block row. CSV export shares the filters.
 */
export class BlockedTerminalsApi extends BaseApi<BlockedTerminalRow> {
  constructor() {
    super('blocked-terminals')
  }

  // Override to point at the dedicated export endpoint instead of the
  // BaseApi default of `${endpoint}/download`.
  downloadItems = async (params: Record<string, any>) => {
    const { downloadFile } = await import('./api')
    return downloadFile('/blocked-terminals/export.csv', params, 'blocked-terminals')
  }

  /** Aggregate analytics for the standalone Blocked POS admin page. */
  stats = () => apiRequest<BlockedPosStats>('/blocked-terminals/stats')
}

export const blockedTerminalsApi = new BlockedTerminalsApi()

/**
 * Defaulting users — agents/aggregators currently below their target this
 * month. The list is a joined view served by tms-report-java's
 * `/defaulting-users` controller; it includes contact info plus aggregator
 * info so admin can reach out.
 */
export class DefaultingUsersApi extends BaseApi<DefaultingUserRow> {
  constructor() {
    super('defaulting-users')
  }

  // The rows are aggregated keyed on `actor_id`, not a row id — there is no
  // /defaulting-users/{id} endpoint. Suppress getItem so the DataTable
  // doesn't try to follow row clicks into a non-existent resource.
  getItem = undefined as any

  // Custom export endpoint shape (matches BlockedTerminalsApi).
  downloadItems = async (params: Record<string, any>) => {
    const { downloadFile } = await import('./api')
    return downloadFile('/defaulting-users/export.csv', params, 'defaulting-users')
  }

  stats = () => apiRequest<DefaultingUsersStats>('/defaulting-users/stats')
}

export const defaultingUsersApi = new DefaultingUsersApi()

/**
 * Recovery queue — POS devices flagged for physical pickup. Backed by the
 * same `/blocked-terminals` controller as the generic blocked-terminals
 * surface, but pre-filtered to `action=block_pos_demand_return` and surfaced
 * with its own stats endpoint focused on aging and recovery throughput.
 */
export class RecoveryQueueApi extends BaseApi<BlockedTerminalRow> {
  constructor() {
    super('blocked-terminals')
  }

  // BaseApi.getItems is an arrow-function class field, so super.getItems is
  // not callable. Issue the request directly with the forced filter so a
  // user clearing the filter chip can never widen the table to every block.
  getItems = async (params: Record<string, any>) => {
    const query = buildQueryString({ ...params, action: 'block_pos_demand_return' })
    return apiRequest<PaginatedResponse<BlockedTerminalRow>>(`/blocked-terminals?${query}`)
  }

  downloadItems = async (params: Record<string, any>) => {
    const { downloadFile } = await import('./api')
    return downloadFile('/blocked-terminals/export.csv',
      { ...params, action: 'block_pos_demand_return' },
      'recovery-queue')
  }

  stats = () => apiRequest<RecoveryStats>('/blocked-terminals/recovery-stats')
}

export const recoveryQueueApi = new RecoveryQueueApi()

/**
 * One-off ops calls used by the row actions (waive, recover, force-clear)
 * and the manual decommission flow. These are not BaseApi-shaped.
 */
class TargetsOpsApi {
  recoverBlock = (id: number, note: string) =>
    apiRequest(`/pos-blocks/${id}/recover`, { method: 'POST', body: { note } })

  forceClearBlock = (id: number, note: string) =>
    apiRequest(`/pos-blocks/${id}/force-clear`, { method: 'POST', body: { note } })

  waiveDefault = (id: number, reason: string) =>
    apiRequest(`/targets/defaults/${id}/waive`, { method: 'POST', body: { reason } })

  decommissionAggregator = (id: number, replacementId: number, reason: string) =>
    apiRequest(`/aggregators/${id}/decommission`, {
      method: 'POST',
      body: { replacement_aggregator_id: replacementId, reason },
    })

  exportBlockedTerminalsUrl = (params: Record<string, any> = {}) =>
    `/blocked-terminals/export.csv?${buildQueryString(params)}`

  listDefaults = (params: Record<string, any> = {}) =>
    apiRequest<PaginatedResponse<TargetDefault>>(
      `/targets/defaults?${buildQueryString(params)}`,
    )

  listBlocks = (params: Record<string, any> = {}) =>
    apiRequest<PaginatedResponse<PosBlock>>(
      `/pos-blocks?${buildQueryString(params)}`,
    )

  /** Aggregate stats for the targets dashboard hero strip. */
  stats = () => apiRequest<TargetStats>('/targets/stats')
}

export interface TargetStats {
  active_rules: number
  agents_with_targets: number
  compliant_last_period: number
  in_default: number
  defaults_this_month: number
  pending_penalties: number
  waived_this_month: number
  pos_blocks_active: number
  pos_blocks_demand_return: number
  unblock_fees_collected: string | number
  aggregators_decommissioned: number
  target_volume_set: string | number
  target_count_set: string | number
}

export const targetsOpsApi = new TargetsOpsApi()

// Legacy export — keep so any older imports don't break during the refactor.
export const targetsApi = {
  ...targetsOpsApi,
  listRules: (params: Record<string, any> = {}) => targetRulesApi.getItems(params) as Promise<PaginatedResponse<TargetRule>>,
  saveRule: (data: any) => targetRulesApi.createItem(data) as Promise<ItemResponse<TargetRule>>,
  updateRule: (id: number, data: any) => targetRulesApi.updateItem(id, data) as Promise<ItemResponse<TargetRule>>,
  deleteRule: (id: number) => targetRulesApi.deleteItem(id),
  listBlockedTerminals: (params: Record<string, any> = {}) => blockedTerminalsApi.getItems(params) as Promise<PaginatedResponse<BlockedTerminalRow>>,
}
