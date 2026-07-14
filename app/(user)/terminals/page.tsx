'use client';

import { DataTable } from '@/components/ui/data-table';
import { Modal, ModalFooter } from '@/components/ui/modal';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import {
  columns,
  filterFields,
  uploadFormFields,
  uploadFormSchema,
} from './(files)/table-config';
import { useTerminalRowActions } from './(files)/terminal-row-actions';
import { terminalApi } from '@/lib/terminal-api';
import { useDataTable } from '@/hooks/useDataTable';
import { TerminalStatsCards } from './(files)/stats-cards';
import { useState } from 'react';
import { Upload, Download, RefreshCcw } from 'lucide-react';

export default function TerminalsPage() {
  const { showToast } = useToast();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [backfillOpen, setBackfillOpen] = useState(false);
  const [backfillSubmitting, setBackfillSubmitting] = useState(false);
  const { rowActions, dialogs, reloadKey } = useTerminalRowActions();
  const { fetchData, handleUpload } = useDataTable({
    api: terminalApi,
    onUploadSuccess: () => {
      setUploadModalOpen(false);
    },
  });

  async function runBackfill() {
    if (backfillSubmitting) return;
    setBackfillSubmitting(true);
    try {
      const res = await terminalApi.backfillDeviceAccounts();
      const count = res?.data?.reference ?? '0';
      showToast(
        `Backfill triggered — ${count} terminal-mapped events emitted.`,
        'success',
      );
      setBackfillOpen(false);
    } catch {
      // Toast handled by apiRequest
    } finally {
      setBackfillSubmitting(false);
    }
  }

  return (
    <>
      <TerminalStatsCards />
      <DataTable
        key={reloadKey}
        title='Terminals'
        columns={columns}
        fetchData={fetchData}
        // Click a row → standalone /terminals/{serial} page where the metrics
        // history can use a full DataTable and the location map gets enough
        // breathing room. Slug is the serial because it's stable, unique,
        // and matches what the device sends.
        detailsView='page'
        detailsPageUrl={(row) => `/terminals/${encodeURIComponent(row.serial)}`}
        searchPlaceholder='Search by serial, make, or model...'
        emptyStateText='No terminals yet'
        emptyStateDescription='Terminal records will appear here.'
        filterFields={filterFields}
        rowActions={rowActions}
        headerActions={
          <div className='flex gap-2'>
            <Button
              variant='outline'
              icon={RefreshCcw}
              onClick={() => setBackfillOpen(true)}
              title='Re-emit terminal-mapped events for every terminal currently bound to a user. Used to provision per-POS-device virtual accounts for terminals mapped before the device-VA feature shipped. Idempotent.'
            >
              Backfill device accounts
            </Button>
            <Button
              variant='outline'
              icon={Download}
              onClick={() => terminalApi.downloadSample()}
            >
              Download Sample
            </Button>
            <Button
              variant='theme'
              icon={Upload}
              onClick={() => setUploadModalOpen(true)}
            >
              Upload Serials
            </Button>
          </div>
        }
      />

      <Modal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title='Upload Serials'
        size='lg'
      >
        <Form
          fields={uploadFormFields}
          schema={uploadFormSchema}
          onSubmit={(data) =>
            handleUpload!(
              data.file,
              'uploadSerials',
              'Serials uploaded successfully',
            )
          }
          submitText='Upload'
          description='Excel file should not exceed 5MB'
        />
      </Modal>

      {/*
        Bypassing the shared <Dialog> here because it submits via an HTML
        <form id="dialog-confirm-form"> linked to the footer button by id —
        on Chromium, the first click on a freshly-mounted form-outside-button
        link sometimes only focuses the button, dropping the request silently.
        Backfill takes 5-15s (33 provider API calls), so the missed first
        click is very visible. Driving the submit from a direct onClick on
        the footer button avoids the entire form-id indirection.
      */}
      <Modal
        open={backfillOpen}
        onClose={() => (backfillSubmitting ? null : setBackfillOpen(false))}
        size='md'
        showCloseButton={false}
        footer={
          <ModalFooter
            cancelText='Cancel'
            submitText={backfillSubmitting ? 'Running…' : 'Run backfill'}
            submitVariant='success'
            loading={backfillSubmitting}
            onCancel={() => setBackfillOpen(false)}
            onSubmit={runBackfill}
          />
        }
      >
        <h3 className='text-lg font-semibold mb-2'>
          Backfill per-device virtual accounts?
        </h3>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          Re-emits terminal-mapped events for every terminal currently bound to
          a user. virtual-account-service then provisions a dedicated VA per
          active provider for each device. This is idempotent — safe to run any
          number of times.
        </p>
      </Modal>

      {dialogs}
    </>
  );
}
