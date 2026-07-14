'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { apiRequest, buildQueryString } from '@/lib/api'
import { SafeImage } from '@/components/ui/safe-image'

/**
 * A typeahead picker for users backed by the tms-report-java `/users?search=`
 * endpoint. The backend search matches name, email, and phone, so the agent
 * can find someone without knowing the database id (which is what motivated
 * this component — typing a numeric user_id by hand is error-prone).
 *
 * Two surfaces ship from this file:
 *
 *   <UserSearchInput value={id} onChange={setId} />       single-select
 *   <UserSearchMultiInput value={ids} onChange={setIds} /> multi-select
 *
 * Both render the resolved user as a chip with name + email so the operator
 * can see who they actually picked, not just the bare id. They also keep an
 * internal label cache so the chip survives form-state churn (e.g. zod
 * coercion that re-runs on every keystroke).
 */

export interface UserOption {
  /** DB id used by the backend (we expose it as a number, but accept strings on input). */
  value: number
  /** Display label — currently `Name (email)` when both exist, else email. */
  label: string
  /** Sub-text shown beneath the label inside the dropdown (phone). */
  sub?: string
  /**
   * Avatar thumbnail URL. Sourced from the user's BVN photo on the backend
   * (presigned by tms-report-java). Optional — when absent, the dropdown
   * falls back to the first letter of the label on a coloured circle.
   */
  avatar?: string
}

interface BaseProps {
  /**
   * `type=` filter forwarded to `/users` so the picker can be scoped to
   * merchants, agents, aggregators, or all users. Default: no filter (all).
   */
  userType?: 'merchant' | 'agent' | 'aggregator'
  /** Override the placeholder shown when nothing is selected. */
  placeholder?: string
  /** zod/RHF validation message — renders as a red helper line. */
  error?: string
  /** Disable input + dropdown. Selected chips remain visible. */
  disabled?: boolean
  /** Minimum chars before we hit the API. Default 2. */
  minQueryLength?: number
  /** Debounce window in ms. Default 300. */
  debounceMs?: number
  className?: string
}

interface SingleProps extends BaseProps {
  value: number | string | null | undefined
  onChange: (value: number | null) => void
  /** Optional initial label when the parent already knows who the user is (e.g. editing a row). */
  initialLabel?: string
}

interface MultiProps extends BaseProps {
  value: Array<number | string>
  onChange: (value: number[]) => void
  /**
   * Optional initial label map for ids already in `value`. Used when the parent
   * is hydrating an existing selection from a server payload.
   */
  initialLabels?: Record<string, string>
}

/* ------------------------------------------------------------------ *
 *  Internal hooks
 * ------------------------------------------------------------------ */

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = React.useState(value)
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

async function fetchUsers(
  query: string,
  userType?: BaseProps['userType'],
): Promise<UserOption[]> {
  const params: Record<string, any> = { search: query, limit: 15 }
  if (userType) {
    // A super aggregator is an aggregator-class user — they directly acquire
    // agents just like a plain aggregator, so they must surface anywhere an
    // aggregator picker is used. The backend `/users` filter accepts a
    // comma-separated list, so widen the aggregator scope to include them.
    params.type = userType === 'aggregator' ? 'aggregator,super_aggregator' : userType
  }
  try {
    const res = await apiRequest<any>(`/users?${buildQueryString(params)}`)
    const users = res?.data || []
    return users.map((u: any) => {
      const name = (u.name || '').trim()
      const label = name && u.email ? `${name} (${u.email})` : name || u.email || `User #${u.id}`
      return {
        value: Number(u.id),
        label,
        sub: u.phone_number || undefined,
        avatar: u.avatar?.thumbnail || u.avatar?.default || undefined,
      }
    })
  } catch {
    return []
  }
}

function useUserSearch(
  query: string,
  userType: BaseProps['userType'],
  minQueryLength: number,
  debounceMs: number,
) {
  const debounced = useDebouncedValue(query.trim(), debounceMs)
  const [results, setResults] = React.useState<UserOption[]>([])
  const [loading, setLoading] = React.useState(false)
  const reqIdRef = React.useRef(0)

  React.useEffect(() => {
    if (debounced.length < minQueryLength) {
      setResults([])
      setLoading(false)
      return
    }
    const reqId = ++reqIdRef.current
    setLoading(true)
    fetchUsers(debounced, userType).then((res) => {
      // Drop stale responses — a slow request can land after a newer one.
      if (reqId !== reqIdRef.current) return
      setResults(res)
      setLoading(false)
    })
  }, [debounced, userType, minQueryLength])

  return { results, loading }
}

/* ------------------------------------------------------------------ *
 *  Shared dropdown shell
 * ------------------------------------------------------------------ */

interface DropdownProps {
  open: boolean
  loading: boolean
  results: UserOption[]
  query: string
  minQueryLength: number
  onPick: (option: UserOption) => void
  excludeIds?: Set<string>
}

function Dropdown({
  open,
  loading,
  results,
  query,
  minQueryLength,
  onPick,
  excludeIds,
}: DropdownProps) {
  if (!open) return null

  const filtered = excludeIds
    ? results.filter((r) => !excludeIds.has(String(r.value)))
    : results

  const hasMinQuery = query.trim().length >= minQueryLength

  return (
    <div className='absolute z-20 w-full mt-1 bg-white dark:bg-card border border-[#D0D5DD] dark:border-border rounded-lg shadow-lg max-h-60 overflow-auto'>
      {!hasMinQuery ? (
        <div className='px-3 py-2 text-sm text-muted-foreground'>
          Type at least {minQueryLength} characters to search.
        </div>
      ) : loading ? (
        <div className='px-3 py-2 text-sm text-muted-foreground'>Searching…</div>
      ) : filtered.length === 0 ? (
        <div className='px-3 py-2 text-sm text-muted-foreground'>No users found</div>
      ) : (
        filtered.map((opt) => (
          <button
            key={opt.value}
            type='button'
            onMouseDown={(e) => {
              // Prevent the input from losing focus before the click registers.
              e.preventDefault()
              onPick(opt)
            }}
            className='w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-accent text-left'
          >
            <SafeImage
              src={opt.avatar}
              alt={opt.label}
              width={32}
              height={32}
              className='w-8 h-8 rounded-full object-cover shrink-0'
              fallback={
                <div className='w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold shrink-0'>
                  {opt.label.charAt(0).toUpperCase()}
                </div>
              }
            />
            <div className='flex flex-col min-w-0 flex-1'>
              <span className='text-sm text-foreground truncate'>{opt.label}</span>
              {opt.sub && (
                <span className='text-xs text-muted-foreground truncate'>{opt.sub}</span>
              )}
              <span className='text-[11px] text-muted-foreground'>ID: {opt.value}</span>
            </div>
          </button>
        ))
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 *  Single-select
 * ------------------------------------------------------------------ */

export function UserSearchInput({
  value,
  onChange,
  userType,
  placeholder = 'Search by name, email, or phone…',
  error,
  disabled,
  minQueryLength = 2,
  debounceMs = 300,
  className,
  initialLabel,
}: SingleProps) {
  const [query, setQuery] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const [label, setLabel] = React.useState<string | null>(initialLabel ?? null)
  const { results, loading } = useUserSearch(query, userType, minQueryLength, debounceMs)

  // Whenever the parent clears the value (e.g. form reset), drop the chip too.
  React.useEffect(() => {
    if (value === null || value === undefined || value === '') {
      setLabel(null)
    }
  }, [value])

  const selectedId = value === '' || value == null ? null : Number(value)

  const handlePick = (opt: UserOption) => {
    onChange(opt.value)
    setLabel(opt.label)
    setQuery('')
    setOpen(false)
  }

  const handleClear = () => {
    onChange(null)
    setLabel(null)
    setQuery('')
  }

  return (
    <div className={cn('space-y-2', className)}>
      {selectedId != null && (
        <div className='flex flex-wrap gap-2'>
          <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200'>
            {label || `User #${selectedId}`}
            {!disabled && (
              <button
                type='button'
                onClick={handleClear}
                className='ml-0.5 hover:text-orange-900'
                aria-label='Clear selection'
              >
                <X className='h-3 w-3' />
              </button>
            )}
          </span>
        </div>
      )}

      {selectedId == null && (
        <div className='relative'>
          <input
            type='text'
            value={query}
            disabled={disabled}
            placeholder={placeholder}
            onChange={(e) => {
              setQuery(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            className={cn(
              'w-full px-4 py-3 border rounded-lg outline-none transition-colors bg-white dark:bg-input shadow-xs',
              'focus:border-[#FC6401]',
              error ? 'border-red-500' : 'border-[#D0D5DD] dark:border-border',
              'disabled:opacity-50 disabled:cursor-not-allowed',
            )}
            style={{ fontSize: '16px', fontWeight: 400, lineHeight: '24px' }}
          />
          <Dropdown
            open={open}
            loading={loading}
            results={results}
            query={query}
            minQueryLength={minQueryLength}
            onPick={handlePick}
          />
        </div>
      )}

      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 *  Multi-select
 * ------------------------------------------------------------------ */

export function UserSearchMultiInput({
  value,
  onChange,
  userType,
  placeholder = 'Search by name, email, or phone…',
  error,
  disabled,
  minQueryLength = 2,
  debounceMs = 300,
  className,
  initialLabels,
}: MultiProps) {
  const [query, setQuery] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const [labels, setLabels] = React.useState<Record<string, string>>(
    initialLabels ?? {},
  )
  const { results, loading } = useUserSearch(query, userType, minQueryLength, debounceMs)

  const idStrings = React.useMemo(() => value.map(String), [value])
  const excludeIds = React.useMemo(() => new Set(idStrings), [idStrings])

  const handlePick = (opt: UserOption) => {
    const id = opt.value
    if (idStrings.includes(String(id))) return
    onChange([...value.map(Number), id])
    setLabels((prev) => ({ ...prev, [String(id)]: opt.label }))
    setQuery('')
  }

  const handleRemove = (id: string) => {
    onChange(value.filter((v) => String(v) !== id).map(Number))
    setLabels((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  return (
    <div className={cn('space-y-2', className)}>
      {idStrings.length > 0 && (
        <div className='flex flex-wrap gap-2'>
          {idStrings.map((id) => (
            <span
              key={id}
              className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200'
            >
              {labels[id] || `User #${id}`}
              {!disabled && (
                <button
                  type='button'
                  onClick={() => handleRemove(id)}
                  className='ml-0.5 hover:text-orange-900'
                  aria-label={`Remove user ${id}`}
                >
                  <X className='h-3 w-3' />
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      <div className='relative'>
        <input
          type='text'
          value={query}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          className={cn(
            'w-full px-4 py-3 border rounded-lg outline-none transition-colors bg-white dark:bg-input shadow-xs',
            'focus:border-[#FC6401]',
            error ? 'border-red-500' : 'border-[#D0D5DD] dark:border-border',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          )}
          style={{ fontSize: '16px', fontWeight: 400, lineHeight: '24px' }}
        />
        <Dropdown
          open={open}
          loading={loading}
          results={results}
          query={query}
          minQueryLength={minQueryLength}
          onPick={handlePick}
          excludeIds={excludeIds}
        />
      </div>

      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  )
}
