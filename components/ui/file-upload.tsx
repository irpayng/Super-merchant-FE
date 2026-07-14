'use client';

import React, { useRef } from 'react';
import {
  FileText,
  FileImage,
  Upload,
  Trash2,
  FileWarning,
  CircleAlert,
} from 'lucide-react';

interface FileUploadFieldProps {
  label: string;
  hint?: string;
  file: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}

const getFileExtension = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toUpperCase();
  if (ext === 'JPG' || ext === 'JPEG') return 'JPG';
  if (ext === 'PNG') return 'PNG';
  if (ext === 'PDF') return 'PDF';
  return 'FILE';
};

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  hint = 'Document should be either PDF, PNG or JPG',
  file,
  onChange,
  error,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const fileExt = file ? getFileExtension(file.name) : null;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    onChange(selectedFile);
  };

  const removeFile = () => {
    onChange(null);
  };

  return (
    <div className='mt-6'>
      <p className='font-medium text-sm text-[#0A0D14] dark:text-white mb-1'>
        {label}
      </p>

      {hint && (
        <div className='flex items-center justify-start gap-2 text-[10px] sm:text-xs text-[#868C98] mb-2 bg-[#F7F7F7] rounded-lg h-10 px-3 '>
          <CircleAlert className='w-4 h-4' />
          <span>{hint}</span>
        </div>
      )}

      {file ? (
        <div className='flex items-center justify-between p-3 border rounded-lg bg-[#FAFAFA] dark:bg-[#2a2a2d]'>
          <div className='flex items-center gap-3'>
            {file ? (
              <div className='h-8 w-8 rounded-md flex items-center justify-center bg-[#FC6401]/10 text-[#FC6401] font-semibold text-xs'>
                {fileExt}
              </div>
            ) : (
              <Upload className='w-5 h-5 text-[#868C98]' />
            )}
            <div>
              <p className='text-xs sm:text-sm font-medium text-[#1A202C] dark:text-white'>
                {file.name}
              </p>
              <p className='text-xs text-[#868C98]'>
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <button
            type='button'
            onClick={removeFile}
            className='text-red-500 hover:text-red-600 transition'
          >
            <Trash2 className='w-5 h-5' />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className='border border-dashed border-[#E3E5E5] dark:border-[#333335] rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer text-sm text-[#868C98] hover:bg-[#FFF9F5] dark:hover:bg-[#333335]/50 transition'
        >
          <Upload className='w-5 h-5 mb-2' />
          Choose a file to upload
          <input
            type='file'
            accept='.pdf,.png,.jpg,.jpeg'
            ref={inputRef}
            className='hidden'
            onChange={handleFileSelect}
          />
        </div>
      )}

      {error && <p className='text-red-500 text-xs mt-1'>{error}</p>}
    </div>
  );
};

export default FileUploadField;
