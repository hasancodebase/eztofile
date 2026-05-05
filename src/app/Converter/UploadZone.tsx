'use client';

import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface Props {
  onFileSelect: (file: File) => void;
}

export function UploadZone({ onFileSelect }: Props) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp']
    },
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024, // 20MB limit
    onDrop: (files) => {
      if (files.length > 0) {
        onFileSelect(files[0]);
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      className="glass border-2 border-dashed border-purple-400 hover:border-purple-500 rounded-3xl p-12 text-center cursor-pointer transition-all hover:scale-[1.01]"
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-16 w-16 text-purple-400 mb-6" />
      
      <p className="text-xl font-medium mb-2">
        {isDragActive ? "Drop your image here" : "Drag & drop image or click to upload"}
      </p>
      
      <p className="text-sm text-zinc-400">
        Supports JPG, PNG, WebP • Max 20MB recommended
      </p>
    </div>
  );
}