'use client'

import { useState } from 'react'
import {
  Lock,
  Unlock,
  RefreshCw,
  HandCoins,
  Network,
  Banknote,
  Target,
  MoreVertical,
} from 'lucide-react'
import { Modal, ModalFooter } from '@/components/ui/modal'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AmountInput } from '@/components/ui/amount-input'
import { useToast } from '@/components/ui/toast'
import { UserSearchInput } from '@/components/shared/user-search-input'
import { SetTargetModal } from '@/components/shared/set-target-modal'
import { terminalApi } from '@/lib/terminal-api'
import { posLeaseApi } from '@/lib/pos-lease-api'
import { aggregatorTerminalApi } from '@/lib/aggregator-terminal-api'
import { leaseFeeApi } from '@/lib/lease-fee-api'

/**
 * Common row-action shape used by every admin surface that lists terminals.
 * Keep it permissive (`id` may arrive as string or number from the API,
 * `locked` may be undefined on older list payloads, `user`/`user_id` only
 * populated on the terminals listing + detail page) so callers don't need
 * to do type acrobatics in their column definitions.
 */
export interface TerminalRowLike {
  id: string | number
  serial: string
  locked?: boolean
  user_id?: number | null
  user?: { id: number; name?: string | null; email?: string | null } | null
}

/** A single entry in the terminal actions menu (DataTable + detail page). */
export interface TerminalRowAction {
  label: string
  icon?: any
  danger?: boolean
  hidden?: (row?: TerminalRowLike) => boolean
  onClick: (row?: TerminalRowLike) => void
}

/**
 * Resolve the agent/user bound to a terminal row. Prefers the nested `user`
 * object (terminals listing + detail page payloads) and falls back to a bare
 * `user_id`. Returns null for unmapped terminals — the user-scoped actions
 * (set lease fee, set target) hide themselves when this is null.
 */
function rowUser(row?: TerminalRowLike | null) {
  if (!row) return null
  if (row.user?.id) {
    return { id: Number(row.user.id), name: row.user.name ?? null, email: row.user.email ?? null }
  }
  if (row.user_id) return { id: Number(row.user_id), name: null, email: null }
  return null
}

/**
 * Hook that owns the modal state for every per-terminal admin action and
 * returns:
 *
 *  - A {@code rowActions} array shaped for the {@code <DataTable />} contract
 *    (and the {@link TerminalActionsMenu} below), so the same list of actions
 *    can be dropped onto any terminals table or the standalone detail page.
 *  - A {@code dialogs} React node that renders the modals/dialogs. Mount it
 *    once at the bottom of the page; it's invisible until an action is fired.
 *  - A {@code reloadKey} integer that bumps after a successful Lock/Unlock so
 *    the calling table (or detail page) can refetch. The other actions
 *    (prep, waive, attach, lease fee, target) don't change terminal list
 *    data, so they don't bump it.
 *
 * Actions exposed:
 *  - Prep / Lock / Unlock        — always, serial/id based
 *  - Waive lease                 — always, serial based
 *  - Attach to aggregator        — always, serial based
 *  - Set lease fee (agent scope) — only when the terminal is mapped to a user
 *  - Set target (agent scope)    — only when the terminal is mapped to a user
 *
 * Centralising this keeps the wording on the dialogs and the toast messages
 * consistent across the user-devices tab, the terminals listing page, and
 * the standalone terminal detail page.
 */
export function useTerminalRowActions() {
  const { showToast } = useToast()

  const [reloadKey, setReloadKey] = useState(0)

  // Prep / Lock / Unlock.
  const [lockTarget, setLockTarget] = useState<TerminalRowLike | null>(null)
  const [lockMessage, setLockMessage] = useState('')
  const [lockSubmitting, setLockSubmitting] = useState(false)
  const [unlockTarget, setUnlockTarget] = useState<TerminalRowLike | null>(null)
  const [unlockSubmitting, setUnlockSubmitting] = useState(false)
  const [prepTarget, setPrepTarget] = useState<TerminalRowLike | null>(null)
  const [prepSubmitting, setPrepSubmitting] = useState(false)

  // Waive lease.
  const [waiveTarget, setWaiveTarget] = useState<TerminalRowLike | null>(null)
  const [waiveReason, setWaiveReason] = useState('')
  const [waiveSubmitting, setWaiveSubmitting] = useState(false)

  // Attach to aggregator.
  const [attachTarget, setAttachTarget] = useState<TerminalRowLike | null>(null)
  const [attachAggregatorId, setAttachAggregatorId] = useState<number | null>(null)
  const [attachSubmitting, setAttachSubmitting] = useState(false)

  // Set lease fee (agent scope on the mapped user).
  const [feeTarget, setFeeTarget] = useState<TerminalRowLike | null>(null)
  const [feeValue, setFeeValue] = useState('')
  const [feeDescription, setFeeDescription] = useState('')
  const [feeSubmitting, setFeeSubmitting] = useState(false)

  // Set target — reuses the shared SetTargetModal.
  const [targetEntity, setTargetEntity] = useState<{
    id: number
    name?: string | null
    email?: string | null
    type?: string | null
  } | null>(null)

  async function submitLock() {
    if (!lockTarget) return
    if (!lockMessage.trim()) {
      showToast('Please enter a reason — this is shown to the agent.', 'error')
      return
    }
    setLockSubmitting(true)
    try {
      await terminalApi.lock(lockTarget.id, lockMessage.trim())
      showToast(`Terminal ${lockTarget.serial} locked.`, 'success')
      setLockTarget(null)
      setLockMessage('')
      setReloadKey((k) => k + 1)
    } catch {
      // Toast handled by apiRequest
    } finally {
      setLockSubmitting(false)
    }
  }

  async function submitUnlock() {
    if (!unlockTarget) return
    setUnlockSubmitting(true)
    try {
      await terminalApi.unlock(unlockTarget.id)
      showToast(`Terminal ${unlockTarget.serial} unlocked.`, 'success')
      setUnlockTarget(null)
      setReloadKey((k) => k + 1)
    } catch {
      // Toast handled by apiRequest
    } finally {
      setUnlockSubmitting(false)
    }
  }

  async function submitPrep() {
    if (!prepTarget) return
    setPrepSubmitting(true)
    try {
      await terminalApi.requestPrep(prepTarget.id)
      showToast(
        `Re-prep requested on ${prepTarget.serial}. The device will download fresh keys shortly.`,
        'success',
      )
      setPrepTarget(null)
    } catch {
      // Toast handled by apiRequest
    } finally {
      setPrepSubmitting(false)
    }
  }

  async function submitWaive() {
    if (!waiveTarget) return
    if (!waiveReason.trim()) {
      showToast('Please enter a reason for the waiver.', 'error')
      return
    }
    setWaiveSubmitting(true)
    try {
      // Pass the mapped user when we know it so the server can pre-create a
      // waiver even if the agent hasn't tried to pay yet; otherwise the
      // backend resolves user_id from the existing lease record for the serial.
      const u = rowUser(waiveTarget)
      await posLeaseApi.waive(waiveTarget.serial, waiveReason.trim(), u?.id)
      showToast(`Lease on ${waiveTarget.serial} waived.`, 'success')
      setWaiveTarget(null)
      setWaiveReason('')
    } catch {
      // Toast handled by apiRequest
    } finally {
      setWaiveSubmitting(false)
    }
  }

  async function submitAttach() {
    if (!attachTarget) return
    if (!attachAggregatorId) {
      showToast('Pick an aggregator first.', 'error')
      return
    }
    setAttachSubmitting(true)
    try {
      // assignSingle is idempotent and fires the backend auto success-toast
      // ("Serial NXXX dispatched"), so we don't add a contextual one here.
      await aggregatorTerminalApi.assignSingle(attachAggregatorId, attachTarget.serial)
      setAttachTarget(null)
      setAttachAggregatorId(null)
    } catch {
      // Toast handled by apiRequest
    } finally {
      setAttachSubmitting(false)
    }
  }

  async function submitFee() {
    if (!feeTarget) return
    const u = rowUser(feeTarget)
    if (!u) return
    if (!feeValue.trim()) {
      showToast('Enter a fee amount.', 'error')
      return
    }
    setFeeSubmitting(true)
    try {
      // Agent-scoped fee on the mapped user — overrides the aggregator/global
      // baseline for this account. The backend auto success-toast fires.
      await leaseFeeApi.createItem({
        scope: 'agent',
        user: String(u.id),
        value: feeValue.trim(),
        description: feeDescription.trim(),
      })
      setFeeTarget(null)
      setFeeValue('')
      setFeeDescription('')
    } catch {
      // Toast handled by apiRequest
    } finally {
      setFeeSubmitting(false)
    }
  }

  const rowActions: TerminalRowAction[] = [
    {
      label: 'Prep',
      icon: RefreshCw,
      // Locked devices can't accept fresh keys — config-service rejects the
      // request. Hide the button so admins don't try.
      hidden: (row) => !!row?.locked,
      onClick: (row) => row && setPrepTarget(row),
    },
    {
      label: 'Lock',
      icon: Lock,
      danger: true,
      hidden: (row) => !!row?.locked,
      onClick: (row) => row && setLockTarget(row),
    },
    {
      label: 'Unlock',
      icon: Unlock,
      hidden: (row) => !row?.locked,
      onClick: (row) => row && setUnlockTarget(row),
    },
    {
      label: 'Waive lease',
      icon: HandCoins,
      onClick: (row) => row && setWaiveTarget(row),
    },
    {
      label: 'Attach to aggregator',
      icon: Network,
      onClick: (row) => {
        if (!row) return
        setAttachAggregatorId(null)
        setAttachTarget(row)
      },
    },
    {
      label: 'Set lease fee',
      icon: Banknote,
      // User-scoped — only meaningful for a mapped terminal.
      hidden: (row) => !rowUser(row),
      onClick: (row) => {
        if (!row || !rowUser(row)) return
        setFeeValue('')
        setFeeDescription('')
        setFeeTarget(row)
      },
    },
    {
      label: 'Set target',
      icon: Target,
      hidden: (row) => !rowUser(row),
      onClick: (row) => {
        const u = rowUser(row)
        if (!u) return
        setTargetEntity({ id: u.id, name: u.name, email: u.email, type: 'agent' })
      },
    },
  ]

  const feeUser = rowUser(feeTarget)

  const dialogs = (
    <>
      <Modal
        open={!!lockTarget}
        onClose={() => {
          setLockTarget(null)
          setLockMessage('')
        }}
        title={`Lock terminal ${lockTarget?.serial ?? ''}`}
        description="The message you enter is shown on the device's block screen. The agent cannot transact again until you clear the lock."
        footer={
          <ModalFooter
            cancelText="Cancel"
            submitText="Lock terminal"
            submitVariant="danger"
            loading={lockSubmitting}
            disabled={!lockMessage.trim()}
            onCancel={() => {
              setLockTarget(null)
              setLockMessage('')
            }}
            onSubmit={submitLock}
          />
        }
      >
        <textarea
          className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Reason shown to the agent (e.g. Suspected fraud — please contact support)."
          value={lockMessage}
          maxLength={500}
          onChange={(e) => setLockMessage(e.target.value)}
        />
        <p className="mt-1 text-xs text-muted-foreground">{lockMessage.length}/500</p>
      </Modal>

      <Dialog
        open={!!unlockTarget}
        onClose={() => setUnlockTarget(null)}
        title={`Unlock terminal ${unlockTarget?.serial ?? ''}?`}
        description="The agent will be able to take transactions again on this device."
        confirmText={unlockSubmitting ? 'Unlocking…' : 'Unlock'}
        onConfirm={submitUnlock}
        variant="success"
      />

      <Dialog
        open={!!prepTarget}
        onClose={() => setPrepTarget(null)}
        title={`Re-prep terminal ${prepTarget?.serial ?? ''}?`}
        description="The device will download a fresh TMK/TPK pair and re-inject them in the background. The agent doesn't need to do anything — useful after a key rotation or when card transactions start failing on stale keys."
        confirmText={prepSubmitting ? 'Sending…' : 'Request prep'}
        onConfirm={submitPrep}
        variant="success"
      />

      <Modal
        open={!!waiveTarget}
        onClose={() => {
          setWaiveTarget(null)
          setWaiveReason('')
        }}
        title={`Waive lease on ${waiveTarget?.serial ?? ''}`}
        description="Mark the lease for this device as waived without charging the agent. The lease lock screen disappears immediately."
        footer={
          <ModalFooter
            cancelText="Cancel"
            submitText={waiveSubmitting ? 'Waiving…' : 'Waive lease'}
            submitVariant="success"
            loading={waiveSubmitting}
            disabled={!waiveReason.trim()}
            onCancel={() => {
              setWaiveTarget(null)
              setWaiveReason('')
            }}
            onSubmit={submitWaive}
          />
        }
      >
        <textarea
          className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Why are we waiving this lease?"
          value={waiveReason}
          maxLength={500}
          onChange={(e) => setWaiveReason(e.target.value)}
        />
        <p className="mt-1 text-xs text-muted-foreground">{waiveReason.length}/500</p>
      </Modal>

      <Modal
        open={!!attachTarget}
        onClose={() => {
          setAttachTarget(null)
          setAttachAggregatorId(null)
        }}
        title={`Attach ${attachTarget?.serial ?? ''} to an aggregator`}
        description="Dispatch this serial to an aggregator. Re-attaching the same pair is a no-op; an existing dispatch on another aggregator is reassigned."
        footer={
          <ModalFooter
            cancelText="Cancel"
            submitText={attachSubmitting ? 'Attaching…' : 'Attach'}
            loading={attachSubmitting}
            disabled={!attachAggregatorId || attachSubmitting}
            onCancel={() => {
              setAttachTarget(null)
              setAttachAggregatorId(null)
            }}
            onSubmit={submitAttach}
          />
        }
      >
        <div>
          <label className="text-sm font-medium mb-1 block">Aggregator</label>
          <UserSearchInput
            value={attachAggregatorId}
            onChange={setAttachAggregatorId}
            userType="aggregator"
            placeholder="Search aggregator by name, email, or phone…"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Only users with type “aggregator” are listed.
          </p>
        </div>
      </Modal>

      <Modal
        open={!!feeTarget}
        onClose={() => {
          setFeeTarget(null)
          setFeeValue('')
          setFeeDescription('')
        }}
        title={`Set lease fee for ${feeTarget?.serial ?? ''}`}
        description={
          feeUser
            ? `Sets an agent-scoped lease fee for ${feeUser.name || feeUser.email || `User #${feeUser.id}`}. This overrides the aggregator and global baseline for this account.`
            : ''
        }
        footer={
          <ModalFooter
            cancelText="Cancel"
            submitText={feeSubmitting ? 'Saving…' : 'Save fee'}
            submitVariant="success"
            loading={feeSubmitting}
            disabled={!feeValue.trim() || feeSubmitting}
            onCancel={() => {
              setFeeTarget(null)
              setFeeValue('')
              setFeeDescription('')
            }}
            onSubmit={submitFee}
          />
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Lease Fee (₦)</label>
            <AmountInput
              mode="currency"
              value={feeValue}
              onChange={setFeeValue}
              placeholder="e.g. 15000"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Flat amount paid to lease the device. Not a percentage.
            </p>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Description</label>
            <textarea
              className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Optional note (e.g. why this agent has a custom fee)"
              value={feeDescription}
              maxLength={255}
              onChange={(e) => setFeeDescription(e.target.value)}
            />
          </div>
        </div>
      </Modal>

      <SetTargetModal
        open={!!targetEntity}
        onClose={() => setTargetEntity(null)}
        entity={targetEntity}
      />
    </>
  )

  return { rowActions, dialogs, reloadKey }
}

/**
 * Renders the terminal {@code rowActions} as a self-contained dropdown menu.
 *
 * The DataTable already renders {@code rowActions} in its per-row kebab menu,
 * so this is for surfaces without a DataTable row — primarily the standalone
 * terminal detail page header. Pass the same {@code rowActions} from
 * {@link useTerminalRowActions} and the terminal as {@code row}; mount the
 * hook's {@code dialogs} node alongside it.
 */
export function TerminalActionsMenu({
  actions,
  row,
}: {
  actions: TerminalRowAction[]
  row: TerminalRowLike
}) {
  const [open, setOpen] = useState(false)
  const visible = actions.filter((a) => !a.hidden?.(row))
  if (visible.length === 0) return null

  return (
    <div className="relative">
      <Button variant="secondary" onClick={() => setOpen((o) => !o)}>
        <MoreVertical className="h-4 w-4" /> Actions
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-[9999]" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 bg-card border border-border rounded-lg shadow-lg z-[10000] py-1 min-w-[220px]">
            {visible.map((action, index) => {
              const Icon = action.icon
              return (
                <button
                  key={index}
                  onClick={() => {
                    setOpen(false)
                    action.onClick(row)
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2 ${
                    action.danger ? 'text-destructive' : 'text-foreground'
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {action.label}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
