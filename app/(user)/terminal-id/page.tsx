'use client';

import { DataTable } from '@/components/ui/data-table';
import { Modal } from '@/components/ui/modal';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  columns,
  filterFields,
  uploadFormFields,
  uploadFormSchema,
  processorFormFields,
  processorFormSchema,
  addFormFields,
  addFormSchema,
} from './(files)/table-config';
import { TerminalId, terminalIdApi } from '@/lib/terminal-id-api';
import { useDataTable } from '@/hooks/useDataTable';
import { TerminalIdDetails } from '@/components/terminal-ids/details';
import { useState } from 'react';
import {
  Upload,
  Download,
  RefreshCw,
  Cpu,
  Plus,
  Trash2,
  Edit2,
} from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';

const CSV_HEADER_MAP: Record<string, string> = {
  terminal_id: 'terminalId',
  merchant_id: 'merchantId',
};

function buildSingleTidCsv(data: Record<string, any>): File {
  const keys = Object.keys(CSV_HEADER_MAP);
  const headers = keys.map((k) => CSV_HEADER_MAP[k]);
  const values = keys.map((k) =>
    String(data[k] ?? '')
      .replace(/,/g, ' ')
      .trim(),
  );
  const csv = `${headers.join(',')}\n${values.join(',')}\n`;
  return new File([csv], 'terminal-id.csv', { type: 'text/csv' });
}

export default function TerminalIdsPage() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [removeTidDialogOpen, setRemoveTidDialogOpen] = useState(false);
  const [addTerminalIdModalOpen, setAddTerminalIdModalOpen] = useState(false);
  const [editRow, setEditRow] = useState<Record<string, any> | null>(null);
  const [processorRow, setProcessorRow] = useState<TerminalId | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const { fetchData, fetchDetails, handleUpload } = useDataTable({
    api: terminalIdApi,
    onUploadSuccess: () => {
      setUploadModalOpen(false);
      setReloadKey((k) => k + 1);
    },
  });

  const handleUploadSubmit = async (data: {
    file: File;
    internal?: boolean;
    processor?: string;
  }) => {
    await handleUpload!(
      data.file,
      'uploadTerminalIds',
      'Terminal IDs uploaded successfully',
      { internal: data.internal || false, processor: data.processor || '' },
    );
  };

  const handleToggleInternal = async (row: TerminalId) => {
    await terminalIdApi.toggleInternal(row.id);
    setReloadKey((k) => k + 1);
  };

  const handleSetProcessor = async (data: { processor?: string }) => {
    if (!processorRow) return;
    await terminalIdApi.setProcessor(processorRow.id, data.processor || '');
    setProcessorRow(null);
    setReloadKey((k) => k + 1);
  };

  const handleAddSubmit = async (data: Record<string, any>) => {
    if (editRow) {
      await terminalIdApi.updateItem(editRow.id, data);
      setEditRow(null);
      setAddTerminalIdModalOpen(false);
      setReloadKey((k) => k + 1);
      return;
    }

    const file = buildSingleTidCsv(data);
    await terminalIdApi.uploadTerminalIds(file);
    setAddTerminalIdModalOpen(false);
    setReloadKey((k) => k + 1);
  };

  const handleEdit = async (row: any) => {
    setAddTerminalIdModalOpen(true);
    try {
      const res = await terminalIdApi.getItem(row.id);

      console.log('res', res);
      setEditRow(res.data);
      setAddTerminalIdModalOpen(true);
    } catch (error) {
      console.error('Error fetching terminal ID details:', error);
    }
  };

  return (
    <>
      <DataTable
        title='Terminal IDs'
        columns={columns}
        fetchData={fetchData}
        fetchDetails={fetchDetails}
        deleteData={async (id, options) => {
          await terminalIdApi.deleteItem(id, options);
        }}
        detailsView='slider'
        detailsSliderWidth='xl'
        detailsRenderer={(data) => (
          <TerminalIdDetails data={data} onClose={() => {}} />
        )}
        searchPlaceholder='Search...'
        emptyStateText='No terminal IDs yet'
        emptyStateDescription='Terminal ID records will appear here.'
        filterFields={filterFields}
        selectable={true}
        reloadKey={reloadKey}
        rowActions={[
          {
            label: 'Toggle Internal',
            icon: RefreshCw,
            onClick: handleToggleInternal,
          },
          {
            label: 'Set Processor',
            icon: Cpu,
            onClick: (row: TerminalId) => setProcessorRow(row),
          },
          {
            label: 'Edit Details',
            icon: Edit2,
            onClick: (row: TerminalId) => {
              handleEdit(row);
            },
          },
          {
            label: 'Remove Terminal',
            icon: Trash2,
            onClick: () => setRemoveTidDialogOpen(true),
          },
        ]}
        headerActions={
          <div className='flex gap-2'>
            <Button
              variant='outline'
              icon={Download}
              onClick={() => terminalIdApi.downloadSample()}
            >
              Download Sample
            </Button>
            <Button
              variant='outline'
              icon={Plus}
              onClick={() => setAddTerminalIdModalOpen(true)}
            >
              Add Terminal ID
            </Button>
            <Button
              variant='theme'
              icon={Upload}
              onClick={() => setUploadModalOpen(true)}
            >
              Upload Terminal IDs
            </Button>
          </div>
        }
      />

      <Modal
        open={addTerminalIdModalOpen}
        onClose={() => setAddTerminalIdModalOpen(false)}
        title='Add Terminal ID'
        size='md'
      >
        <Form
          key={editRow?.id}
          fields={addFormFields}
          schema={addFormSchema}
          defaultValues={editRow || undefined}
          onSubmit={handleAddSubmit}
          submitText={editRow ? 'Update' : 'Create'}
        />
      </Modal>

      <Dialog
        open={removeTidDialogOpen}
        onClose={() => {
          setRemoveTidDialogOpen(false);
        }}
        onConfirm={async () => {}}
        title='Remove Terminal ID'
        description={`Are you sure you want to remove this terminal ID? This action cannot be undone. ?`}
        confirmText='Remove'
        variant='danger'
      />

      <Modal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title='Upload Terminal IDs'
        size='lg'
      >
        <Form
          fields={uploadFormFields}
          schema={uploadFormSchema}
          onSubmit={handleUploadSubmit}
          submitText='Upload'
          description='Excel file should not exceed 5MB'
        />
      </Modal>

      <Modal
        open={!!processorRow}
        onClose={() => setProcessorRow(null)}
        title='Set Processor'
        size='md'
      >
        <Form
          key={processorRow?.id}
          fields={processorFormFields}
          schema={processorFormSchema}
          defaultValues={{ processor: processorRow?.processor ?? '' }}
          onSubmit={handleSetProcessor}
          submitText='Save'
          showReset={false}
          description={`Scope the internal TID ${processorRow?.terminal_id ?? ''} to one or more card processors. Comma-separated (e.g. nibss,upsl,interswitch). Leave blank to make it usable by any processor.`}
        />
      </Modal>
    </>
  );
}
