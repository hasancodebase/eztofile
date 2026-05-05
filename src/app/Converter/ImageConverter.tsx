'use client';

import { useState, useCallback } from 'react';
import { UploadZone } from './UploadZone';
import { OptionsPanel } from './OptionsPanel';
import { PreviewPanel } from './PreviewPanel';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import confetti from 'canvas-confetti';
import type { ConversionOptions } from './converter-options';

export default function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [options, setOptions] = useState<ConversionOptions>({
    format: 'webp',
    dpi: 300,
    quality: 85,
  });

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    setResultUrl(null); // Reset previous result
  }, []);

  const handleConvert = async () => {
    if (!file) return;

    setLoading(true);
    setProgress(10);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('format', options.format);
    if (options.width) formData.append('width', options.width.toString());
    formData.append('dpi', options.dpi.toString());
    formData.append('quality', options.quality.toString());

    try {
      const res = await fetch('/api/convert-image', {
        method: 'POST',
        body: formData,
      });

      setProgress(60);

      if (!res.ok) {
        let message = 'Conversion failed';
        try {
          const err = await res.json();
          if (err?.error && typeof err.error === 'string') message = err.error;
        } catch {
          /* non-JSON error body */
        }
        throw new Error(message);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setProgress(100);

      // Celebration effect
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });

    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Failed to convert image. Please try again.';
      alert(message);
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1500);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Left Side - Upload + Options */}
      <div className="space-y-6">
        <UploadZone onFileSelect={handleFileSelect} />

        <OptionsPanel options={options} setOptions={setOptions} />

        <Button 
          onClick={handleConvert} 
          disabled={!file || loading}
          className="w-full h-14 text-lg font-medium bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Converting...' : 'Convert & Download'}
        </Button>

        {loading && (
          <Progress value={progress} className="h-2" />
        )}
      </div>

      {/* Right Side - Preview */}
      <PreviewPanel 
        previewUrl={previewUrl} 
        resultUrl={resultUrl} 
        fileName={file?.name} 
        options={options} 
      />
    </div>
  );
}