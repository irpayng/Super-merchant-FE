'use client'

import { HeaderCard } from '@/components/ui/header-card'

interface TerminalDetailsProps {
  data: any
  onClose: () => void
  useSlider?: boolean
  onUnmap?: () => void
}

/**
 * Compact terminal-summary card embedded inside other entity detail pages
 * (merchants, users). The full per-terminal view — including the GPS map
 * and metrics history — lives at {@code /terminals/[serial]} and should be
 * navigated to from there.
 *
 * <p>This component is intentionally light: it does NOT fetch metrics or
 * render the location map. Embedding pages that show a list of a user's
 * terminals would otherwise issue N parallel metric fetches per render.
 */
export function TerminalDetails({ data }: TerminalDetailsProps) {
  return (
    <HeaderCard
      title='Terminal Details'
      fields={[
        { label: 'Serial Number', value: data.serial, copiable: true },
        { label: 'Make', value: data.make },
        { label: 'Model', value: data.model ?? '—' },
        { label: 'OS', value: data.os },
        { label: 'Created At', value: data.created_at },
      ]}
    />
  )
}
