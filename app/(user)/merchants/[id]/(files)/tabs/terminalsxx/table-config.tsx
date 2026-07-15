import { z } from 'zod';

export const uploadFormSchema = z.object({
  file: z.any().refine((file) => file !== null && file !== undefined, {
    message: 'File is required',
  }),
});

export const uploadFormFields = [
  {
    name: 'file' as const,
    label: 'Upload File',
    type: 'file' as const,
    required: true,
    accept: '.xlsx,.xls,.csv',
    maxSize: '5MB',
    dragDrop: true,
    placeholder: 'Select a file to upload',
  },
];

// export const columns = [
//   { key: 'serial', label: 'Serial Number', copiable: true, align: 'left' },
//   { key: 'make', label: 'Make' },
//   { key: 'model', label: 'Model' },
//   { key: 'os', label: 'OS' },
//   { key: 'created_at', label: 'Created At', truncate: true },
// ];

export const columns = [
  {
    key: 'terminalId',
    label: 'Terminal ID',
    copiable: true,
  },
  { key: 'merchantId', label: 'Merchant ID', copiable: true },
  { key: 'terminalLocation', label: 'Terminal Location', truncate: true },
  { key: 'status', label: 'Status', badge: true },
  { key: 'lastSeen', label: 'Last Seen' },
  { key: 'actions', label: 'Actions' },
];

// export const detailPageColumns = [
//   { key: 'serial', label: 'Serial Number', copiable: true, align: 'left' },
//   { key: 'make', label: 'Make' },
//   { key: 'model', label: 'Model' },
//   { key: 'os', label: 'OS' },
//   { key: 'created_at', label: 'Created At', truncate: true },
// ];

export const filters = [
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
];

export const terminalData = [
  {
    terminalId: '22334455',
    merchantId: '309020020909029292',
    status: 'Active',
    lastSeen: '2023-03-12T12:30:00',
    printerStatus: 'Printer OK',
    network: 'GPRS',
    type: 'PAX',
    model: 'D210',
    serialNumber: '5C912690',
    software: '7.9.05',
    terminalLocation: '24, Alfred Street Ikoyi Lagos',
    mapCoordinates: {
      latitude: 6.453182,
      longitude: 3.439075,
    },
  },
  {
    terminalId: '88771234',
    merchantId: '309020020909055512',
    status: 'Inactive',
    lastSeen: '2023-03-10T16:15:00',
    printerStatus: 'Paper Low',
    network: '4G',
    type: 'PAX',
    model: 'A920',
    serialNumber: '7F113820',
    software: '8.1.12',
    terminalLocation: '15, Cameron Road Ikoyi Lagos',
    mapCoordinates: {
      latitude: 6.451002,
      longitude: 3.436411,
    },
  },
  {
    terminalId: '55119002',
    merchantId: '309020020909078821',
    status: 'Active',
    lastSeen: '2023-03-12T09:42:00',
    printerStatus: 'Printer OK',
    network: 'GPRS',
    type: 'PAX',
    model: 'S90',
    serialNumber: '9A441276',
    software: '6.5.02',
    terminalLocation: '8, Herbert Macaulay Way Yaba Lagos',
    mapCoordinates: {
      latitude: 6.508473,
      longitude: 3.384081,
    },
  },
  {
    terminalId: '77443322',
    merchantId: '309020020909066642',
    status: 'Offline',
    lastSeen: '2023-03-11T19:00:00',
    printerStatus: 'Printer Error',
    network: '3G',
    type: 'PAX',
    model: 'D230',
    serialNumber: '4C722810',
    software: '7.4.10',
    terminalLocation: '102, Admiralty Way Lekki Phase 1 Lagos',
    mapCoordinates: {
      latitude: 6.449746,
      longitude: 3.484375,
    },
  },
  {
    terminalId: '11229944',
    merchantId: '309020020909044201',
    status: 'Active',
    lastSeen: '2023-03-12T14:00:00',
    printerStatus: 'Printer OK',
    network: '4G',
    type: 'PAX',
    model: 'A80',
    serialNumber: '3B221190',
    software: '8.0.33',
    terminalLocation: '77, Broad Street Lagos Island',
    mapCoordinates: {
      latitude: 6.454215,
      longitude: 3.395732,
    },
  },
];
