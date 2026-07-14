'use client'

import { useMemo } from 'react'
import { Modal } from '@/components/ui/modal'
import { Form } from '@/components/ui/form'
import {
  buildTargetRuleFormFields,
  targetRuleSchema,
} from '@/components/targets/table-config'
import { targetRulesApi } from '@/lib/targets-api'

interface SetTargetModalProps {
  open: boolean
  onClose: () => void
  /**
   * Entity to target. The actor_id and role come from this — the form
   * starts in `scope=actor` mode and locks the actor field, so the admin
   * is just picking the period and target amount.
   */
  entity: {
    id: number | string
    name?: string | null
    email?: string | null
    type?: string | null
  } | null
  onSuccess?: () => void
}

/**
 * Inline "Set Target" — opens the standard /targets create form pre-filled
 * with this entity as the actor. Saves the admin from going to /targets and
 * searching the user via `UserSearchInput` just to set one rule.
 *
 * Reuses the targets schema and field builder verbatim so any future change
 * to the target form (new penalty action, new period, etc.) shows up here
 * automatically. The only difference from the /targets New Rule flow is
 * that scope and actor_id come from the entity instead of from the form,
 * which we apply by overriding the form fields with disabled defaults.
 */
export function SetTargetModal({
  open,
  onClose,
  entity,
  onSuccess,
}: SetTargetModalProps) {
  const role: 'agent' | 'aggregator' =
    entity?.type === 'aggregator' || entity?.type === 'super_aggregator'
      ? 'aggregator'
      : 'agent'

  const fields = useMemo(() => {
    // Drop scope + actor_id from the form (we set them from the entity) and
    // optionally lock the role for aggregators since the entity type
    // determines it. For agents/users we leave role editable since admin
    // may want to set an "as-aggregator" rule on a future-promoted user.
    const all = buildTargetRuleFormFields()
    return all.filter((f) => f.name !== 'scope' && f.name !== 'actor_id')
  }, [])

  const defaultValues = useMemo(
    () => ({
      scope: 'actor' as const,
      role,
      period: 'monthly' as const,
      actor_id: entity?.id ? String(entity.id) : '',
      target_amount: '',
      target_count: '',
      channel_filter: 'pos_only' as const,
      penalty: {
        action: 'notify_only' as const,
        consecutive_threshold: 3,
        penalty_amount: '',
        unblock_fee_amount: '',
        aggregator_action: '' as const,
        replacement_aggregator_id: '',
        notify_admin: true,
        notify_aggregator: true,
      },
      enabled: true,
    }),
    [role, entity?.id],
  )

  const handleSubmit = async (data: any) => {
    if (!entity?.id) return
    const payload: any = {
      scope: 'actor',
      role: data.role,
      period: data.period,
      actor_id: Number(entity.id),
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
      payload.penalty.replacement_aggregator_id = Number(
        data.penalty.replacement_aggregator_id,
      )
    }

    await targetRulesApi.createItem(payload)
    onSuccess?.()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title='Set Target'
      size='lg'
      description={
        entity
          ? `Set a per-actor target rule for ${entity.name || entity.email || `User #${entity.id}`}. Defaults to monthly with notify-only penalty.`
          : ''
      }
    >
      <Form
        fields={fields as any}
        schema={targetRuleSchema}
        defaultValues={defaultValues as any}
        onSubmit={handleSubmit}
        submitText='Save target'
      />
    </Modal>
  )
}
