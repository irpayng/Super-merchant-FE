'use client';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { DataTable } from '@/components/ui/data-table';
import { Dialog } from '@/components/ui/dialog';
import { TableAvatarCell } from '@/components/ui/table-avatar-cell';
import { Plus, Save, Trash, Download, Upload, Check } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';

export default function DemoPage() {
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSize, setModalSize] = useState<
    'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
  >('md');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogVariant, setDialogVariant] = useState<
    'danger' | 'success' | 'warning'
  >('danger');
  const [rejectReason, setRejectReason] = useState('');

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <>
      <div>
        <h2 className='text-xl font-semibold mb-4'>All Button Variants</h2>
        <div className='space-y-4'>
          <div>
            <h3 className='text-sm font-medium mb-2 text-gray-600'>
              Primary Variants
            </h3>
            <div className='flex flex-wrap gap-4'>
              <Button variant='primary'>Primary</Button>
              <Button variant='secondary'>Secondary</Button>
              <Button variant='danger'>Danger</Button>
              <Button variant='success'>Success</Button>
              <Button variant='theme'>Theme</Button>
            </div>
          </div>

          <div>
            <h3 className='text-sm font-medium mb-2 text-gray-600'>
              Outline & Ghost
            </h3>
            <div className='flex flex-wrap gap-4'>
              <Button variant='outline'>Outline</Button>
              <Button variant='ghost'>Ghost</Button>
            </div>
          </div>

          <div>
            <h3 className='text-sm font-medium mb-2 text-gray-600'>
              Menu Variants
            </h3>
            <div className='w-64 bg-white border rounded-lg p-1'>
              <Button variant='menu'>Menu Item</Button>
              <Button variant='menu-danger'>Delete Item</Button>
            </div>
          </div>

          <div>
            <h3 className='text-sm font-medium mb-2 text-gray-600'>
              Icon Variants
            </h3>
            <div className='flex flex-wrap gap-4 items-center'>
              <Button variant='icon'>
                <Plus className='h-4 w-4' />
              </Button>
              <Button variant='icon-bordered'>
                <Save className='h-4 w-4' />
              </Button>
            </div>
          </div>

          <div>
            <h3 className='text-sm font-medium mb-2 text-gray-600'>
              Text & Link
            </h3>
            <div className='flex flex-wrap gap-4 items-center'>
              <Button variant='text'>Text Button</Button>
              <Button variant='link'>Link Button</Button>
            </div>
          </div>

          <div>
            <h3 className='text-sm font-medium mb-2 text-gray-600'>
              Filter & Pagination
            </h3>
            <div className='flex flex-wrap gap-4 items-center'>
              <Button variant='filter'>Last 7 days ▾</Button>
              <Button variant='pagination'>Previous</Button>
              <Button variant='pagination'>Next</Button>
            </div>
          </div>

          <div>
            <h3 className='text-sm font-medium mb-2 text-gray-600'>
              Navigation & Toggle
            </h3>
            <div className='space-y-2 w-64'>
              <Button variant='nav'>Navigation Item</Button>
              <Button variant='toggle'>
                <Plus className='h-4 w-4' />
              </Button>
            </div>
          </div>

          <div>
            <h3 className='text-sm font-medium mb-2 text-gray-600'>
              Special Variants
            </h3>
            <div className='flex flex-wrap gap-4 items-center'>
              <Button variant='login'>Login Button</Button>
              <div className='bg-gray-800 p-4 rounded'>
                <Button variant='close'>×</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className='text-xl font-semibold mb-4'>With Icons</h2>
        <div className='flex flex-wrap gap-4'>
          <Button variant='theme' icon={Plus}>
            Add New Agent
          </Button>
          <Button icon={Plus}>Add Item</Button>
          <Button variant='secondary' icon={Save}>
            Save Draft
          </Button>
          <Button variant='danger' icon={Trash}>
            Delete
          </Button>
          <Button variant='success' icon={Check}>
            Approve
          </Button>
          <Button variant='secondary' icon={Download}>
            Download
          </Button>
          <Button icon={Upload}>Upload</Button>
        </div>
      </div>

      <div>
        <h2 className='text-xl font-semibold mb-4'>Loading State</h2>
        <div className='flex flex-wrap gap-4'>
          <Button loading onClick={handleClick}>
            Loading...
          </Button>
          <Button variant='secondary' loading>
            Processing
          </Button>
          <Button variant='danger' loading>
            Deleting...
          </Button>
          <Button loading={loading} onClick={handleClick}>
            Click to Load
          </Button>
        </div>
      </div>

      <div>
        <h2 className='text-xl font-semibold mb-4'>Disabled State</h2>
        <div className='flex flex-wrap gap-4'>
          <Button disabled>Disabled Primary</Button>
          <Button variant='secondary' disabled>
            Disabled Secondary
          </Button>
          <Button variant='danger' disabled icon={Trash}>
            Disabled Danger
          </Button>
        </div>
      </div>

      <div>
        <h2 className='text-xl font-semibold mb-4'>Sizes (Custom)</h2>
        <div className='flex flex-wrap items-center gap-4'>
          <Button className='px-3 py-1 text-xs'>Small</Button>
          <Button>Default</Button>
          <Button className='px-6 py-3 text-base'>Large</Button>
        </div>
      </div>

      <div>
        <h2 className='text-xl font-semibold mb-4'>Form Component</h2>
        <Card className='max-w-md p-6'>
          <Form
            title='Contact Information'
            description='Please fill in your details below'
            fields={[
              {
                name: 'name',
                label: 'Full Name',
                placeholder: 'Enter your name',
                required: true,
              },
              {
                name: 'email',
                label: 'Email',
                type: 'email',
                placeholder: 'Enter your email',
                required: true,
              },
              {
                name: 'phone',
                label: 'Phone Number',
                type: 'tel',
                placeholder: 'Enter phone number',
              },
              {
                name: 'country',
                label: 'Country (Searchable)',
                type: 'select',
                searchable: true,
                placeholder: 'Search country',
                options: [
                  { label: 'Nigeria', value: 'ng' },
                  { label: 'Ghana', value: 'gh' },
                  { label: 'Kenya', value: 'ke' },
                  { label: 'South Africa', value: 'za' },
                  { label: 'Egypt', value: 'eg' },
                ],
              },
              {
                name: 'state',
                label: 'State',
                type: 'select',
                placeholder: 'Search state',
                options: [
                  { label: 'Nigeria', value: 'ng' },
                  { label: 'Ghana', value: 'gh' },
                  { label: 'Kenya', value: 'ke' },
                  { label: 'South Africa', value: 'za' },
                  { label: 'Egypt', value: 'eg' },
                ],
              },
              {
                name: 'gender',
                label: 'Gender',
                type: 'radio',
                options: [
                  { label: 'Male', value: 'male' },
                  { label: 'Female', value: 'female' },
                ],
              },

              {
                name: 'terms',
                label: 'Terms',
                type: 'checkbox',
                placeholder: 'I agree to the terms and conditions',
              },
              {
                name: 'attachment',
                label: 'Attachment (optional)',
                type: 'file',
                dragDrop: true,
                maxSize: '5MB',
                accept: 'image/*,.pdf,.doc,.docx',
              },
              {
                name: 'document',
                label: 'Document Upload',
                type: 'file',
                placeholder: 'Click to upload document',
                accept: '.pdf,.doc,.docx',
              },
              {
                name: 'message',
                label: 'Message',
                type: 'textarea',
                placeholder: 'Enter your message',
              },
            ]}
            schema={z.object({
              name: z.string().min(2, 'Name must be at least 2 characters'),
              email: z.string().email('Invalid email address'),
              phone: z.string().optional(),
              country: z.string().optional(),
              gender: z.string().optional(),
              terms: z.boolean().optional(),
              newsletter: z.boolean().optional(),
              attachment: z.any().optional(),
              document: z.any().optional(),
              message: z.string().optional(),
            })}
            onSubmit={async (data) => {
              console.log('Form submitted:', data);
              await new Promise((resolve) => setTimeout(resolve, 1000));

              // Simulate backend validation error
              if (data.email.includes('test')) {
                throw new Error('Email address already exists in our system');
              }

              alert('Form submitted successfully!');
            }}
            submitText='Submit Form'
          />
        </Card>
      </div>

      <div>
        <h2 className='text-xl font-semibold mb-4'>Modal Component</h2>
        <div className='flex flex-wrap gap-4'>
          <Button
            onClick={() => {
              setModalSize('sm');
              setModalOpen(true);
            }}
          >
            Small
          </Button>
          <Button
            onClick={() => {
              setModalSize('md');
              setModalOpen(true);
            }}
          >
            Medium
          </Button>
          <Button
            onClick={() => {
              setModalSize('lg');
              setModalOpen(true);
            }}
          >
            Large
          </Button>
          <Button
            onClick={() => {
              setModalSize('xl');
              setModalOpen(true);
            }}
          >
            XL
          </Button>
          <Button
            onClick={() => {
              setModalSize('2xl');
              setModalOpen(true);
            }}
          >
            2XL
          </Button>
          <Button
            onClick={() => {
              setModalSize('3xl');
              setModalOpen(true);
            }}
          >
            3XL (Details)
          </Button>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title='Modal Title'
        description='This is a modal description'
        size={modalSize}
      >
        <div className='space-y-4'>
          <p>
            This is the modal content. You can put any content here including
            forms, tables, or other components.
          </p>
          <div className='flex gap-4 justify-end'>
            <Button variant='secondary' onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant='theme' onClick={() => setModalOpen(false)}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>

      <div>
        <h2 className='text-xl font-semibold mb-4'>Dialog Component</h2>
        <div className='flex flex-wrap gap-4'>
          <Button
            variant='danger'
            onClick={() => {
              setDialogVariant('danger');
              setDialogOpen(true);
            }}
          >
            Delete Dialog
          </Button>
          <Button
            variant='success'
            onClick={() => {
              setDialogVariant('success');
              setDialogOpen(true);
            }}
          >
            Approve Dialog
          </Button>
          <Button
            variant='theme'
            onClick={() => {
              setDialogVariant('warning');
              setDialogOpen(true);
            }}
          >
            Warning Dialog
          </Button>
        </div>
      </div>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          alert('Action confirmed!');
        }}
        title={
          dialogVariant === 'danger'
            ? "Remove 'Matthew Alika'"
            : dialogVariant === 'success'
            ? 'Approve NIN'
            : 'Warning'
        }
        description={
          dialogVariant === 'danger'
            ? 'Are you sure you want to delete this user? This action cannot be undone.'
            : dialogVariant === 'success'
            ? 'Are you sure you want to approve this NIN'
            : 'This action requires your attention'
        }
        confirmText={
          dialogVariant === 'danger'
            ? 'Remove'
            : dialogVariant === 'success'
            ? 'Approve'
            : 'Continue'
        }
        variant={dialogVariant}
        showInput={dialogVariant === 'warning'}
        inputLabel='Reason for rejection'
        inputPlaceholder='Enter a reason for rejection...'
        inputValue={rejectReason}
        onInputChange={setRejectReason}
      />

      <div>
        <h2 className='text-xl font-semibold mb-4'>Data Table Component</h2>
        <Card className='p-6'>
          <DataTable
            title='Wallet Management'
            columns={[
              { key: 'walletId', label: 'Wallet ID', copiable: true },
              {
                key: 'user',
                label: 'Agent',
                render: (_, row) => (
                  <TableAvatarCell
                    avatar={row.user.avatar}
                    title={row.user.name}
                    subtitle={row.user.email}
                  />
                ),
              },
              { key: 'balance', label: 'Wallet Balance', currency: 'long' },
              { key: 'lastFunding', label: 'Last Funding' },
              { key: 'status', label: 'Status', badge: true },
            ]}
            fetchData={async ({ page, limit, search }) => {
              await new Promise((resolve) => setTimeout(resolve, 500));
              const allData = [
                {
                  id: '1',
                  walletId: '0123239ABCD',
                  user: {
                    avatar: 'M',
                    name: 'Matthew Alika',
                    email: 'matthew@irpay.ng',
                  },
                  balance: '0.00',
                  commission: '0.00',
                  settlement: '0.00',
                  lastFunding: 'N/A',
                  status: 'Active',
                },
                {
                  id: '2',
                  walletId: '0456789EFGH',
                  user: {
                    avatar: 'P',
                    name: 'Peter Griffin',
                    email: 'peter@irpay.ng',
                  },
                  balance: '15000.50',
                  commission: '250.00',
                  settlement: '14750.50',
                  lastFunding: 'Mar 15, 2024',
                  status: 'Active',
                },
                {
                  id: '3',
                  walletId: '0789012IJKL',
                  user: {
                    avatar: 'R',
                    name: 'Roy Unachukwu',
                    email: 'roy@irpay.ng',
                  },
                  balance: '5000.00',
                  commission: '100.00',
                  settlement: '4900.00',
                  lastFunding: 'Mar 10, 2024',
                  status: 'Inactive',
                },
                {
                  id: '4',
                  walletId: '0123456MNOP',
                  user: {
                    avatar: 'D',
                    name: 'Demi Wilkinson',
                    email: 'demi@irpay.ng',
                  },
                  balance: '25000.00',
                  commission: '500.00',
                  settlement: '24500.00',
                  lastFunding: 'Mar 20, 2024',
                  status: 'Active',
                },
                {
                  id: '5',
                  walletId: '0789123QRST',
                  user: {
                    avatar: 'O',
                    name: 'Orlando Diggs',
                    email: 'orlando@irpay.ng',
                  },
                  balance: '12000.00',
                  commission: '300.00',
                  settlement: '11700.00',
                  lastFunding: 'Mar 18, 2024',
                  status: 'Active',
                },
                {
                  id: '6',
                  walletId: '0456123UVWX',
                  user: {
                    avatar: 'A',
                    name: 'Adeola James',
                    email: 'adeola@irpay.ng',
                  },
                  balance: '8000.00',
                  commission: '150.00',
                  settlement: '7850.00',
                  lastFunding: 'Mar 12, 2024',
                  status: 'Active',
                },
                {
                  id: '7',
                  walletId: '0789456YZAB',
                  user: {
                    avatar: 'C',
                    name: 'Chidi Okafor',
                    email: 'chidi@irpay.ng',
                  },
                  balance: '3000.00',
                  commission: '80.00',
                  settlement: '2920.00',
                  lastFunding: 'Mar 8, 2024',
                  status: 'Inactive',
                },
                {
                  id: '8',
                  walletId: '0123789CDEF',
                  user: {
                    avatar: 'F',
                    name: 'Funke Adeyemi',
                    email: 'funke@irpay.ng',
                  },
                  balance: '18000.00',
                  commission: '400.00',
                  settlement: '17600.00',
                  lastFunding: 'Mar 22, 2024',
                  status: 'Active',
                },
                {
                  id: '9',
                  walletId: '0456789GHIJ',
                  user: {
                    avatar: 'T',
                    name: 'Tunde Bakare',
                    email: 'tunde@irpay.ng',
                  },
                  balance: '9500.00',
                  commission: '200.00',
                  settlement: '9300.00',
                  lastFunding: 'Mar 16, 2024',
                  status: 'Active',
                },
                {
                  id: '10',
                  walletId: '0789012KLMN',
                  user: {
                    avatar: 'N',
                    name: 'Ngozi Eze',
                    email: 'ngozi@irpay.ng',
                  },
                  balance: '6000.00',
                  commission: '120.00',
                  settlement: '5880.00',
                  lastFunding: 'Mar 14, 2024',
                  status: 'Active',
                },
                {
                  id: '11',
                  walletId: '0123456OPQR',
                  user: {
                    avatar: 'B',
                    name: 'Bola Tinubu',
                    email: 'bola@irpay.ng',
                  },
                  balance: '2000.00',
                  commission: '50.00',
                  settlement: '1950.00',
                  lastFunding: 'Mar 5, 2024',
                  status: 'Inactive',
                },
                {
                  id: '12',
                  walletId: '0456789STUV',
                  user: {
                    avatar: 'E',
                    name: 'Emeka Obi',
                    email: 'emeka@irpay.ng',
                  },
                  balance: '22000.00',
                  commission: '450.00',
                  settlement: '21550.00',
                  lastFunding: 'Mar 21, 2024',
                  status: 'Active',
                },
              ];
              const filtered = search
                ? allData.filter((d) =>
                    d.walletId.toLowerCase().includes(search.toLowerCase())
                  )
                : allData;
              // Return empty for demo: return { data: [], total: 0 }
              return {
                data: filtered.slice((page - 1) * limit, page * limit),
                total: filtered.length,
              };
            }}
            bulkDelete={async (ids) => {
              await new Promise((resolve) => setTimeout(resolve, 1000));
              console.log('Deleting:', ids);
              alert(`Deleted ${ids.length} items`);
            }}
            createData={async (data) => {
              await new Promise((resolve) => setTimeout(resolve, 1000));
              console.log('Created:', data);
            }}
            updateData={async (id, data) => {
              await new Promise((resolve) => setTimeout(resolve, 1000));
              console.log('Updated:', id, data);
              alert('Item updated successfully');
            }}
            deleteData={async (id) => {
              await new Promise((resolve) => setTimeout(resolve, 1000));
              console.log('Deleted:', id);
              alert('Item deleted successfully');
            }}
            fetchDetails={async (id) => {
              await new Promise((resolve) => setTimeout(resolve, 1000));
              return {
                id,
                details: 'Full details for item ' + id,
                timestamp: new Date().toISOString(),
              };
            }}
            exportData={async () => {
              await new Promise((resolve) => setTimeout(resolve, 2000));
              alert('Data exported successfully!');
            }}
            formFields={[
              { name: 'action', label: 'Action', required: true },
              { name: 'entity', label: 'Entity', required: true },
              { name: 'description', label: 'Description', type: 'textarea' },
            ]}
            formSchema={z.object({
              action: z.string().min(1, 'Action is required'),
              entity: z.string().min(1, 'Entity is required'),
              description: z.string().optional(),
            })}
            createButtonText='Add Log'
            emptyStateText='No transactions yet'
            emptyStateDescription="Once the agent starts making transactions, they'd appear here."
            detailsView='slider'
            filterFields={[
              {
                name: 'status',
                label: 'Status',
                type: 'select',
                options: [
                  { label: 'Active', value: 'active' },
                  { label: 'Inactive', value: 'inactive' },
                ],
              },
              { name: 'dateRange', label: 'Date Range', type: 'daterange' },
            ]}
          />
        </Card>
      </div>
    </>
  );
}
