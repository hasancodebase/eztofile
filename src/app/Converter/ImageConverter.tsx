'use client';

import { useState, useCallback } from 'react';
import { UploadZone } from './UploadZone';
import { OptionsPanel } from './OptionsPanel';
import { PreviewPanel } from './PreviewPanel';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import confetti from 'canvas-confetti';
import type { ConversionOptions } from './converter-options';

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

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
    setResultUrl(null);
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

      if (!prefersReducedMotion()) {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.65 },
        });
      }
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      alert(message);
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1500);
    }
  };

  return (
    <section aria-labelledby="converter-heading" className="space-y-4">
      <div className="text-center lg:text-left">
        <h2 id="converter-heading" className="font-display text-2xl font-bold text-foreground sm:text-3xl">
          Picture converter
        </h2>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted-foreground lg:mx-0 lg:max-w-none">
          Upload one image, adjust the settings with the sliders and menus, then convert. Your file
          stays on this page until you download it.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
        <div className="space-y-6">
          <UploadZone onFileSelect={handleFileSelect} />

          <OptionsPanel options={options} setOptions={setOptions} />

          <Button
            onClick={handleConvert}
            disabled={!file || loading}
            aria-busy={loading}
            className="font-display h-14 w-full rounded-2xl text-lg font-semibold shadow-md sm:h-16 sm:text-xl"
          >
            {loading ? 'Working on your picture…' : 'Convert picture'}
          </Button>

          {loading && (
            <div className="space-y-2">
              <Progress value={progress} className="h-3 rounded-full md:h-3.5" />
              <p className="text-center text-sm text-muted-foreground">This usually takes a few seconds.</p>
            </div>
          )}
        </div>

        <PreviewPanel
          previewUrl={previewUrl}
          resultUrl={resultUrl}
          fileName={file?.name}
          options={options}
        />
      </div>
    </section>
  );
}
