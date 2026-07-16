'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Unlink,
  BatteryCharging,
  Wifi,
  WifiOff,
  Printer,
  AlertTriangle,
  Landmark,
} from 'lucide-react';
import {
  terminalApi,
  Terminal,
  TerminalMetric,
  TerminalVirtualAccount,
} from '@/lib/terminal-api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copiable } from '@/components/ui/copiable';
import { Dialog } from '@/components/ui/dialog';
import { DataTable } from '@/components/ui/data-table';
import { metricsHistoryColumns } from './(files)/metrics-history-config';
import {
  useTerminalRowActions,
  TerminalActionsMenu,
  TerminalRowLike,
} from './(files)/terminal-row-actions';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import CardTransactionsTable from '@/app/(user)/transactions/(components)/card/CardTransactionsTable';

/**
 * Standalone terminal detail page.
 *
 * Replaces the previous slider-based detail view so the metrics history can
 * use the project's standard {@link DataTable} (sorting, pagination, search,
 * date filters) and the location map gets enough breathing room to render at
 * a useful size.
 *
 * The slug is the terminal serial — it's stable, human-readable, and unique.
 */

const tabs = [
  { value: 'metrics_history', label: 'Metrics History' },
  { value: 'transaction_history', label: 'Transaction History' },
];

export default function TerminalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname()
  const serial = decodeURIComponent(String(params?.serial ?? ''));

  const terminalTransactionsRoute = `/merchants/${params?.id}?active_tab=terminals`

  const [terminal, setTerminal] = useState<Terminal | null>(null);
  const [latest, setLatest] = useState<TerminalMetric | null>(null);
  const [latestLoaded, setLatestLoaded] = useState(false);
  const [terminalLoaded, setTerminalLoaded] = useState(false);
  const [virtualAccounts, setVirtualAccounts] = useState<
    TerminalVirtualAccount[]
  >([]);
  const [vaLoaded, setVaLoaded] = useState(false);
  const [unmapDialogOpen, setUnmapDialogOpen] = useState(false);

  const { rowActions, dialogs, reloadKey } = useTerminalRowActions();

  const [activeTab, setActiveTab] = useState('metrics_history');

  // Load the terminal by serial. Re-runs when reloadKey bumps (after a
  // lock/unlock) so the header status and actions reflect the new state.
  useEffect(() => {
    if (!serial) return;
    let cancelled = false;
    terminalApi
      .getBySerial(serial)
      .then((res) => {
        if (cancelled) return;
        const row = (res as { data?: Terminal[] } | null)?.data?.[0] ?? null;
        setTerminal(row);
      })
      .catch(() => {
        // Empty terminal state below handles the not-found case.
      })
      .finally(() => {
        if (!cancelled) setTerminalLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [serial, reloadKey]);

  // Load the latest metric snapshot.
  useEffect(() => {
    if (!serial) return;
    let cancelled = false;
    terminalApi
      .latestMetrics(serial)
      .then((res) => {
        if (cancelled) return;
        const row = (res as { data?: TerminalMetric } | null)?.data ?? null;
        setLatest(row);
      })
      .catch(() => {
        // 404 = device has not reported yet — surfaced in the location card.
      })
      .finally(() => {
        if (!cancelled) setLatestLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [serial]);

  // Load the per-device virtual accounts.
  useEffect(() => {
    if (!serial) return;
    let cancelled = false;
    terminalApi
      .virtualAccounts(serial)
      .then((res) => {
        if (cancelled) return;
        setVirtualAccounts(
          (res as { data?: TerminalVirtualAccount[] } | null)?.data ?? [],
        );
      })
      .catch(() => {
        // Leave empty — the card renders an empty state.
      })
      .finally(() => {
        if (!cancelled) setVaLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [serial]);

  // Paged history — DataTable drives this directly.
  const fetchHistory = useCallback(
    async (params: any) => {
      const response = await terminalApi.metricsHistory(serial, {
        page: params.page,
        limit: params.limit,
        from: params.filters?.from,
        to: params.filters?.to,
      });
      const meta = (response as any)?.meta ?? {};
      return {
        data: (response as { data?: TerminalMetric[] } | null)?.data ?? [],
        total: meta.total ?? 0,
        currentPage: meta.current_page ?? 1,
        lastPage: meta.last_page ?? 1,
        perPage: meta.per_page ?? params.limit ?? 25,
      };
    },
    [serial],
  );

  const handleUnmap = async () => {
    if (!terminal) return;
    await terminalApi.unmap(String(terminal.id));
    setUnmapDialogOpen(false);
    router.push(terminalTransactionsRoute);
  };

  const isMapped = Boolean(terminal?.user_id || terminal?.user);

  if (!serial) {
    return (
      <p className='text-sm text-muted-foreground p-6'>
        Missing terminal serial.
      </p>
    );
  }

  if (!terminalLoaded) {
    return <TerminalDetailSkeleton />;
  }

  if (!terminal) {
    return (
      <div className='space-y-4'>
        <Button variant='ghost' onClick={() => router.push(terminalTransactionsRoute)}>
          <ArrowLeft className='h-4 w-4 mr-2' /> Back to Terminals
        </Button>
        <p className='text-sm text-muted-foreground p-6'>Terminal not found.</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='flect gap-3'>
          <Button variant='ghost' onClick={() => router.push(terminalTransactionsRoute)}>
            <ArrowLeft className='h-4 w-4' />
          </Button>
          <div>
            <h1 className='text-2xl font-semibold'>{terminal.serial}</h1>
            <p className='text-sm text-muted-foreground'>
              {terminal.make}
              {terminal.model ? ` · ${terminal.model}` : ''} · {terminal.os}
            </p>
          </div>
        </div>
        <div className='flect gap-2'>
          {isMapped && (
            <Button
              variant='danger'
              icon={Unlink}
              onClick={() => setUnmapDialogOpen(true)}
            >
              Unmap Terminal
            </Button>
          )}
          <TerminalActionsMenu
            actions={rowActions}
            row={terminal as unknown as TerminalRowLike}
          />
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch'>
        <Card className='p-6 lg:col-span-2 flex flex-col'>
          <TerminalSnapshotBody metric={latest} loaded={latestLoaded} />
        </Card>

        <Card className='p-6 flex flex-col'>
          <TerminalSummaryBody terminal={terminal} />
        </Card>
      </div>

      <TerminalVirtualAccountsCard
        accounts={virtualAccounts}
        loaded={vaLoaded}
      />

      <TerminalLocationCard metric={latest} loaded={latestLoaded} />

      <div className='mt-8'>
        <div className='border-b border-border mb-0'>
          <div className='flex gap-0'>
            {tabs.map((tab) => (
              <Button
                key={tab.value}
                variant='tab'
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  'border-b-2',
                  activeTab === tab.value
                    ? 'border-[#FC6401] text-[#FC6401]'
                    : 'border-transparent text-muted-foreground',
                )}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        <div className='mt-4'>
          {activeTab === 'metrics_history' && (
            <DataTable
              title='Metrics History'
              columns={metricsHistoryColumns}
              fetchData={fetchHistory}
              searchPlaceholder='Search…'
              emptyStateText='No history yet'
              emptyStateDescription='Snapshots from the device will land here every minute.'
              hideSearchbar
              pageSize={25}
            />
          )}

          {activeTab === 'transaction_history' && <CardTransactionsTable />}
        </div>
      </div>

      <Dialog
        open={unmapDialogOpen}
        onClose={() => setUnmapDialogOpen(false)}
        onConfirm={handleUnmap}
        title='Unmap Terminal'
        description={`Are you sure you want to unmap terminal ${terminal.serial}?`}
        confirmText='Unmap'
        variant='danger'
      />

      {dialogs}
    </div>
  );
}

// ── Cards ──────────────────────────────────────────────────

function TerminalVirtualAccountsCard({
  accounts,
  loaded,
}: {
  accounts: TerminalVirtualAccount[];
  loaded: boolean;
}) {
  return (
    <Card className='p-6'>
      <div className='flex items-center justify-between mb-4'>
        <p className='text-base font-semibold'>Virtual Accounts</p>
        {loaded && accounts.length > 0 && (
          <p className='text-xs text-muted-foreground'>
            {accounts.length} account{accounts.length === 1 ? '' : 's'}
          </p>
        )}
      </div>

      {!loaded ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className='h-24 rounded-lg' />
          ))}
        </div>
      ) : accounts.length === 0 ? (
        <p className='text-sm text-muted-foreground'>
          No virtual accounts are provisioned for this device.
        </p>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
          {accounts.map((va) => (
            <div
              key={`${va.bank_code}-${va.account_number}`}
              className='rounded-lg border border-border p-4 flex flex-col gap-2'
            >
              <div className='flect gap-2'>
                <Landmark className='h-4 w-4 text-muted-foreground' />
                <span className='text-sm font-medium text-foreground'>
                  {va.bank_name ?? '—'}
                </span>
                {va.single_use && <Badge variant='warning'>single-use</Badge>}
              </div>
              <Copiable
                value={va.account_number ?? '—'}
                className='text-lg font-semibold'
              />
              <p className='text-xs text-muted-foreground truncate'>
                {va.account_name ?? '—'}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function TerminalLocationCard({
  metric,
  loaded,
}: {
  metric: TerminalMetric | null;
  loaded: boolean;
}) {
  const lat = metric?.latitude ?? null;
  const lon = metric?.longitude ?? null;

  if (!loaded) {
    return (
      <Card className='p-6'>
        <p className='text-base font-semibold mb-4'>Terminal Location</p>
        <Skeleton className='w-full h-[420px] rounded-lg' />
      </Card>
    );
  }

  if (lat == null || lon == null) {
    const reasons: string[] = [];
    if (metric?.location_permission === false)
      reasons.push('location permission is not granted on the device');
    if (metric?.location_services_enabled === false)
      reasons.push('OS-level location services are turned off');
    const detail =
      reasons.length > 0
        ? ` Diagnosed: ${reasons.join(' and ')}.`
        : ' Locations refresh every minute once the agent has location permission enabled.';
    return (
      <Card className='p-6'>
        <p className='text-base font-semibold mb-4'>Terminal Location</p>
        <p className='text-sm text-muted-foreground'>
          The device has not reported a GPS fix yet.{detail}
        </p>
      </Card>
    );
  }

  // 0.005° ≈ 550m at the equator — compact bbox centred on the marker.
  const latDelta = 0.005;
  const lonDelta = 0.005;
  const bbox = `${lon - lonDelta},${lat - latDelta},${lon + lonDelta},${lat + latDelta}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
  const accuracySuffix = metric?.location_accuracy_m
    ? ` · ±${Math.round(metric.location_accuracy_m)}m`
    : '';
  const capturedSuffix = metric?.location_at
    ? ` · ${formatRelative(metric.location_at)}`
    : metric?.created_at
      ? ` · ${formatRelative(metric.created_at)}`
      : '';

  return (
    <Card className='p-6'>
      <div className='flex items-center justify-between mb-4'>
        <p className='text-base font-semibold'>Terminal Location</p>
        <p className='text-xs text-muted-foreground'>
          {lat.toFixed(5)}, {lon.toFixed(5)}
          {accuracySuffix}
          {capturedSuffix}
        </p>
      </div>
      <div className='w-full h-[420px] rounded-lg overflow-hidden border border-border'>
        <iframe
          width='100%'
          height='100%'
          style={{ border: 0 }}
          src={src}
          allowFullScreen
        />
      </div>
    </Card>
  );
}

function TerminalSummaryBody({ terminal }: { terminal: Terminal }) {
  const mappedUser = terminal.user;
  const userHref = mappedUser
    ? `/users/${encodeURIComponent((mappedUser.name || mappedUser.email || '').toLowerCase().replace(/\s+/g, '-'))}-${mappedUser.id}`
    : null;

  return (
    <>
      <p className='text-base font-semibold mb-4'>Terminal Details</p>

      <div className='space-y-3 text-sm flex-1'>
        <Field label='Serial Number' value={terminal.serial} copiable />
        <Field label='Make' value={terminal.make ?? '—'} />
        <Field label='Model' value={terminal.model ?? '—'} />
        <Field label='OS' value={terminal.os ?? '—'} />
        <Field label='Created At' value={terminal.created_at} />

        <div className='border-t border-border my-3' />
        {mappedUser ? (
          <>
            <div className='flex justify-between gap-3 min-w-0'>
              <span className='text-muted-foreground flex-shrink-0'>
                Mapped To
              </span>
              {userHref ? (
                <Link
                  href={userHref}
                  className='font-medium text-primary hover:underline truncate'
                >
                  {mappedUser.name}
                </Link>
              ) : (
                <span className='font-medium text-foreground truncate'>
                  {mappedUser.name}
                </span>
              )}
            </div>
            <Field label='Email' value={mappedUser.email} copiable />
          </>
        ) : (
          <Field label='Mapped To' value='Unmapped' />
        )}
      </div>
    </>
  );
}

function Field({
  label,
  value,
  copiable,
}: {
  label: string;
  value: string;
  copiable?: boolean;
}) {
  return (
    <div className='flex justify-between gap-3 min-w-0'>
      <span className='text-muted-foreground flex-shrink-0'>{label}</span>
      {copiable ? (
        <Copiable value={value} truncate />
      ) : (
        <span className='font-medium text-foreground truncate'>{value}</span>
      )}
    </div>
  );
}

function TerminalSnapshotBody({
  metric,
  loaded,
}: {
  metric: TerminalMetric | null;
  loaded: boolean;
}) {
  if (!loaded) {
    return (
      <>
        <p className='text-base font-semibold mb-4'>Device Snapshot</p>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4 flex-1'>
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className='space-y-2'>
              <Skeleton className='h-3 w-20' />
              <Skeleton className='h-5 w-24' />
            </div>
          ))}
        </div>
      </>
    );
  }

  if (!metric) {
    return (
      <>
        <p className='text-base font-semibold mb-4'>Device Snapshot</p>
        <p className='text-sm text-muted-foreground flex-1'>
          This device has not reported any metrics yet.
        </p>
      </>
    );
  }

  return (
    <>
      <div className='flex items-center justify-between mb-4'>
        <p className='text-base font-semibold'>Device Snapshot</p>
        <p className='text-xs text-muted-foreground'>
          Reported {formatRelative(metric.created_at)}
        </p>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 gap-4 text-sm flex-1'>
        <Stat label='Battery' value={<BatteryBadge metric={metric} />} />
        <Stat label='Network' value={<NetworkBadge metric={metric} />} />
        <Stat
          label='Printer'
          value={<PrinterBadge status={metric.printer_status} />}
        />
        <Stat label='OS Version' value={metric.os_version ?? '—'} />
        <Stat label='Firmware' value={metric.firmware_version ?? '—'} />
        <Stat label='App Version' value={metric.app_version ?? '—'} />
        <Stat
          label='RAM Available'
          value={`${formatBytes(metric.ram_avail_bytes)} / ${formatBytes(metric.ram_total_bytes)}`}
        />
        <Stat
          label='Storage Available'
          value={`${formatBytes(metric.storage_avail_bytes)} / ${formatBytes(metric.storage_total_bytes)}`}
        />
        <Stat label='Uptime' value={formatUptime(metric.uptime_ms)} />
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className='text-xs text-muted-foreground mb-1'>{label}</p>
      <div className='font-medium text-foreground'>{value}</div>
    </div>
  );
}

// ── Badges (shared with the older slider component) ─────

function BatteryBadge({ metric }: { metric: TerminalMetric }) {
  if (metric.battery_pct == null)
    return <span className='text-muted-foreground'>—</span>;
  const tone: 'error' | 'warning' | 'success' =
    metric.battery_pct < 20
      ? 'error'
      : metric.battery_pct < 40
        ? 'warning'
        : 'success';
  const tempSuffix =
    metric.battery_temp_c != null ? ` · ${metric.battery_temp_c}°C` : '';
  return (
    <Badge variant={tone}>
      <BatteryCharging className='h-3 w-3 mr-1 inline' />
      {metric.battery_pct}%{metric.battery_plugged ? ' · plugged' : ''}
      {tempSuffix}
    </Badge>
  );
}

function NetworkBadge({ metric }: { metric: TerminalMetric }) {
  const offline = metric.network_type === 'none' || !metric.network_type;
  if (offline) {
    return (
      <Badge variant='error'>
        <WifiOff className='h-3 w-3 mr-1 inline' /> offline
      </Badge>
    );
  }
  return (
    <Badge variant='success'>
      <Wifi className='h-3 w-3 mr-1 inline' />
      {metric.network_type}
      {metric.carrier_name ? ` · ${metric.carrier_name}` : ''}
    </Badge>
  );
}

function PrinterBadge({ status }: { status: number | null | undefined }) {
  if (status == null) return <span className='text-muted-foreground'>—</span>;
  if (status === 0) {
    return (
      <Badge variant='success'>
        <Printer className='h-3 w-3 mr-1 inline' /> ready
      </Badge>
    );
  }
  return (
    <Badge variant='error'>
      <AlertTriangle className='h-3 w-3 mr-1 inline' /> not ready (code {status}
      )
    </Badge>
  );
}

// ── Formatters ─────────────────────────────────────────────

function formatBytes(bytes: number | null | undefined): string {
  if (bytes == null) return '—';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  return `${value.toFixed(value < 10 ? 1 : 0)} ${units[unit]}`;
}

function formatUptime(ms: number | null | undefined): string {
  if (ms == null) return '—';
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function formatRelative(iso: string): string {
  try {
    const then = new Date(iso).getTime();
    const diff = Date.now() - then;
    if (Number.isNaN(diff)) return iso;
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  } catch {
    return iso;
  }
}

// ── Page-level skeleton ────────────────────────────────────

/**
 * Mirrors the live page layout (header row, snapshot + summary cards, map,
 * metrics table) so the page does not pop in. Used while the initial
 * terminal fetch is in flight; the snapshot/location cards swap to their own
 * shimmer states once the terminal is loaded but the latest metric is still
 * pending.
 */
function TerminalDetailSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='flect gap-3'>
          <Skeleton className='h-9 w-9 rounded-md' />
          <div className='space-y-2'>
            <Skeleton className='h-7 w-48' />
            <Skeleton className='h-4 w-56' />
          </div>
        </div>
        <Skeleton className='h-10 w-36 rounded-md' />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch'>
        <Card className='p-6 lg:col-span-2 flex flex-col'>
          <Skeleton className='h-5 w-40 mb-4' />
          <div className='grid grid-cols-2 md:grid-cols-3 gap-4 flex-1'>
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className='space-y-2'>
                <Skeleton className='h-3 w-20' />
                <Skeleton className='h-5 w-24' />
              </div>
            ))}
          </div>
        </Card>

        <Card className='p-6 flex flex-col'>
          <Skeleton className='h-5 w-36 mb-4' />
          <div className='space-y-3 flex-1'>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className='flex justify-between gap-3'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-4 w-32' />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className='p-6'>
        <div className='flex items-center justify-between mb-4'>
          <Skeleton className='h-5 w-40' />
          <Skeleton className='h-3 w-48' />
        </div>
        <Skeleton className='w-full h-[420px] rounded-lg' />
      </Card>

      <Card className='p-6'>
        <Skeleton className='h-5 w-36 mb-4' />
        <div className='space-y-3'>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className='flex items-center gap-3'>
              <Skeleton className='h-4 flex-1' />
              <Skeleton className='h-4 w-20' />
              <Skeleton className='h-4 w-24' />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
