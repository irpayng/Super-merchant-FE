'use client'

import { useState } from 'react'
import { MonitorX, MoreVertical } from 'lucide-react'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import useDashboardProps from '@/components/context/dashboard-global/useDashboardProps'

export function useMerchantRowActions() {
  const { activeTableRow } = useDashboardProps()
  const { showToast } = useToast()
  const [reloadKey, setReloadKey] = useState(0)
  const [suspendOpen, setSuspendOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function suspendMerchant() {
    console.log('activeTableRow', activeTableRow)

    setIsLoading(true)
    try {
      // await terminalApi.requestPrep("45")
      showToast(`Done`, 'success',)
    } catch {
      // Toast handled by apiRequest
    } finally {
      setIsLoading(false)
    }
  }

  const rowActions: TableRowActionProps[] = [
    {
      label: 'Suspend Merchant',
      icon: MonitorX,
      hidden: (row) => !!row?.locked,
      onClick: (row) => setSuspendOpen(true),
    },
  ]


  const dialogs = (
    <>
      <Dialog
        open={suspendOpen}
        onClose={() => setSuspendOpen(false)}
        title={`Suspend Merchant`}
        description="Are you sure you want to suspend this merchant?"
        confirmText={isLoading ? 'Suspending' : 'Suspend'}
        onConfirm={suspendMerchant}
        variant="warning"
        confirmBg="bg-red-700"
      />
    </>
  )

  return { rowActions, dialogs, reloadKey }
}

export function MerchantActionsMenu({ actions, row }: { actions: TableRowActionProps[]; row: any }) {
  const [open, setOpen] = useState(false)
  const visible = actions.filter((a) => !a.hidden?.(row))
  if (visible.length === 0) return null

  return (
    <div className="relative">

      <Button variant="secondary" onClick={() => setOpen((o) => !o)}>
        <MoreVertical className="h-4 w-4" />
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
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2 
                  ${action.danger ? 'text-destructive' : 'text-foreground'}`}>
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
