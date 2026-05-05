'use client';

import { useDropzone } from 'react-dropzone';
import { ImagePlus } from 'lucide-react';

interface Props {
  onFileSelect: (file: File) => void;
}

export function UploadZone({ onFileSelect }: Props) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp'],
    },
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024,
    onDrop: (files) => {
      if (files.length > 0) {
        onFileSelect(files[0]);
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      className="glass cursor-pointer rounded-3xl border-2 border-dashed border-primary/40 p-8 text-center outline-none transition-colors hover:border-primary hover:bg-primary/5 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-ring/60 sm:p-12"
    >
      <input {...getInputProps()} aria-label="Choose an image from your device" />
      <span className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-primary/15 text-primary sm:size-20">
        <ImagePlus className="size-9 sm:size-10" aria-hidden />
      </span>

      <p className="font-display text-lg font-semibold text-foreground sm:text-xl">
        {isDragActive ? 'Drop your picture here' : 'Tap here or drag a picture into this box'}
      </p>

      <p className="mt-3 text-base leading-relaxed text-muted-foreground">
        JPG, PNG, or WebP · One file at a time · Up to about 20&nbsp;MB
      </p>
    </div>
  );
}
