'use client'

import Link from 'next/link'
import * as React from 'react'

interface EntityLinkProps {
  /**
   * Destination href. When falsy, the component renders the label as plain
   * text (no link) — useful when the parent doesn't have an id to link to,
   * e.g. an anonymous transaction or a not-yet-prepped device.
   */
  href: string | null | undefined
  /** Visible text. Falls back to a placeholder when both label and fallback are blank. */
  label?: string | number | null
  /**
   * Final fallback shown when both label and href are unusable. Defaults to
   * em-dash so dense tables don't look broken.
   */
  fallback?: React.ReactNode
  className?: string
}

/**
 * Single source of truth for inline entity hyperlinks across the admin app.
 * Use this anywhere a column or detail field shows the name/email/serial of
 * something that has a detail page (users, aggregators, terminals, admins).
 *
 *   <EntityLink href={`/users/${row.user_id}`} label={row.user_name} />
 *
 * Two design points worth knowing:
 *
 * - Calls {@code stopPropagation} on click so a row-level click handler
 *   (DataTable's slider/details opener) doesn't fire when the cell is
 *   clicked. Without this, clicking a user link in a transactions row
 *   simultaneously opens the txn slider and navigates away.
 * - When {@code href} is falsy, renders the label as plain text. Saves
 *   every caller from having to write a ternary.
 */
export function EntityLink({ href, label, fallback = '—', className }: EntityLinkProps) {
  const display =
    label !== null && label !== undefined && String(label).trim() !== ''
      ? label
      : null

  if (!href) {
    return (
      <span className={className ?? 'text-sm text-muted-foreground'}>
        {display ?? fallback}
      </span>
    )
  }

  return (
    <Link
      href={href}
      onClick={(e) => e.stopPropagation()}
      className={
        className ?? 'text-primary hover:underline'
      }
    >
      {display ?? href}
    </Link>
  )
}

/**
 * Builds the user-detail URL the /users page uses (slug + id). Mirrors
 * `app/(dashboard)/users/page.tsx::detailsPageUrl`. Centralising the slug
 * convention so we don't drift if it ever changes.
 */
export function userDetailHref(user: {
  id: number | string
  name?: string | null
  email?: string | null
}): string {
  const slug = (user.name || user.email || '')
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
  return `/users/${encodeURIComponent(slug)}-${user.id}`
}
