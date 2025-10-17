'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAppStore } from '@/context/store';

interface PhotoUploadProps {
  readonly albumId: string;
  readonly onUploadComplete?: () => void;
}

export default function PhotoUpload({ albumId, onUploadComplete }: PhotoUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<{ [key: string]: number }>({});
  const { addPhoto, setError } = useAppStore();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      const fileId = `${file.name}-${Date.now()}`;
      setUploadingFiles(prev => ({ ...prev, [fileId]: 0 }));

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('albumId', albumId);

        const response = await fetch('/api/photos/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Upload failed');
        }

        const result = await response.json();
        
        // Add photo to store
        addPhoto({
          id: result.photo.id,
          url: result.photo.url,
          thumbnailUrl: result.photo.thumbnailUrl,
          caption: result.photo.caption || '',
          tags: result.photo.tags || [],
          metadata: result.photo.metadata,
          order: result.photo.order || 0,
          createdAt: new Date().toISOString(),
        });

        setUploadingFiles(prev => {
          const updated = { ...prev };
          delete updated[fileId];
          return updated;
        });

        onUploadComplete?.();

      } catch (error) {
        console.error('Upload error:', error);
        setError(error instanceof Error ? error.message : 'Upload failed');
        setUploadingFiles(prev => {
          const updated = { ...prev };
          delete updated[fileId];
          return updated;
        });
      }
    }
  }, [albumId, addPhoto, setError, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: true,
  });

  const uploadingCount = Object.keys(uploadingFiles).length;

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <svg 
              className="w-12 h-12 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
              />
            </svg>
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              {isDragActive ? 'Drop the photos here' : 'Upload photos'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Drag and drop your photos here, or click to browse
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Supports JPEG, PNG, GIF, WebP (max 10MB each)
            </p>
          </div>
        </div>
      </div>

      {uploadingCount > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-gray-900">
            Uploading {uploadingCount} photo{uploadingCount > 1 ? 's' : ''}...
          </p>
          
          {Object.entries(uploadingFiles).map(([fileId, progress]) => (
            <div key={fileId} className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
