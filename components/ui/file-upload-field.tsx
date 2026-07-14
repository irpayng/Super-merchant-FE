import React, { useState, useRef } from 'react';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect?: (file: File | null, error: string | null) => void;
  maxSize?: number; 
  acceptedFormats?: string[];
  helperText?: string;
  error?: string | null;
  value?: File | null;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  maxSize = 5,
  acceptedFormats = ['.xlsx', '.xls'],
  helperText = 'Excel file should not exceed 5MB',
  error = null,
  value = null,
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    const maxSizeBytes = maxSize * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      return `File size exceeds ${maxSize}MB limit`;
    }

    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (
      acceptedFormats.length > 0 &&
      !acceptedFormats.includes(fileExtension)
    ) {
      return `Only ${acceptedFormats.join(', ')} files are accepted`;
    }

    return null;
  };

  const handleFile = (file: File | null): void => {
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      onFileSelect?.(null, validationError);
      return;
    }

    setSelectedFile(file);
    onFileSelect?.(file, null);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    setSelectedFile(null);
    onFileSelect?.(null, null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleClick = (): void => {
    inputRef.current?.click();
  };

  return (
    <div className='w-full'>
      <div
        className={`relative border-2 border-dashed rounded-lg transition-all cursor-pointer ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : error
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={inputRef}
          type='file'
          className='hidden'
          onChange={handleChange}
          accept={acceptedFormats.join(',')}
        />

        {selectedFile ? (
          <div className='p-8 flex items-center justify-center'>
            <div className='flex items-center gap-4 bg-white rounded-lg p-4 border border-gray-200 w-full max-w-md'>
              <div className='flex-shrink-0'>
                <FileText className='w-10 h-10 text-blue-500' />
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-gray-900 truncate'>
                  {selectedFile.name}
                </p>
                <p className='text-xs text-gray-500'>
                  {formatBytes(selectedFile.size)}
                </p>
              </div>
              <button
                onClick={handleRemove}
                className='flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors'
                type='button'
              >
                <X className='w-5 h-5 text-gray-500' />
              </button>
            </div>
          </div>
        ) : (
          <div className='p-12 text-center'>
            <Upload className='w-12 h-12 mx-auto mb-4 text-gray-400' />
            <p className='text-base font-medium text-gray-900 mb-2'>
              Select a file to upload
            </p>
            <p className='text-sm text-gray-500'>
              Or drag and drop, copy and paste file
            </p>
          </div>
        )}
      </div>

      {helperText && !error && (
        <div className='flex items-center gap-2 mt-3'>
          <AlertCircle className='w-4 h-4 text-gray-500 flex-shrink-0' />
          <p className='text-sm text-gray-600'>{helperText}</p>
        </div>
      )}

      {error && (
        <div className='flex items-center gap-2 mt-3'>
          <AlertCircle className='w-4 h-4 text-red-500 flex-shrink-0' />
          <p className='text-sm text-red-600'>{error}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
