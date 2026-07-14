'use client';

import { userApi } from '@/lib/user-api';
import { useDataTable } from '@/hooks/useDataTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import FileUpload from '@/components/ui/file-upload-field';
import { Button } from '@/components/ui/button';
import SettlementsOverview from './(files)/SettlementsOverview';
import AllSettlements from './(files)/AllSettlements';

const tabs = [
  { value: 'settlements_overview', label: 'Settlements Overview' },
  { value: 'allSettlements', label: 'All Settlements' },
];

export default function SettlementsPage() {
  const [activeTab, setActiveTab] = useState('settlements_overview');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileSelect = (
    selectedFile: File | null,
    error: string | null
  ) => {
    setFile(selectedFile);
    setFileError(error);
  };

  const handleUpload = async (
    file: File,
    type: string,
    successMessage: string
  ) => {
    console.log('Uploading file:', file, type, successMessage);
  };

  return (
    <>
      <div className='mt-8'>
        <Tabs defaultValue={activeTab} className='w-full'>
          <TabsList className='bg-transparent font-medium text-sm flex gap-4'>
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-1 py-1 cursor-pointer bg-transparent 
                  ${activeTab === tab.value
                    ? 'text-cms-orange-10 border-b-2 border-b-cms-orange-10 rounded-none'
                    : 'text-cms-gray-10'
                  }`}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className='pt-4'>
            <TabsContent value='settlements_overview'>
              <SettlementsOverview />
            </TabsContent>

            <TabsContent value='allSettlements'>
              <AllSettlements />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <Modal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title='Upload Terminal to Merchant Configuration '
        size='lg'
      >
        <FileUpload
          onFileSelect={handleFileSelect}
          maxSize={5}
          acceptedFormats={['.xlsx', '.xls']}
          helperText='Excel file should not exceed 5MB'
          error={fileError}
          value={file}
        />
        <div className='flex gap-4 justify-end'>
          <Button variant='secondary' onClick={() => setUploadModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant='theme'
            onClick={() => {
              setUploadModalOpen(false);
              handleUpload(
                new File([], ''),
                'allSettlements',
                'File uploaded successfully'
              );
            }}
          >
            Upload
          </Button>
        </div>
      </Modal>
    </>
  );
}
