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

function inferInputFormat(file: File | null): string | null {
  if (!file) return null;
  const type = file.type?.toLowerCase() || '';
  if (type.includes('jpeg')) return 'JPG';
  if (type.includes('png')) return 'PNG';
  if (type.includes('webp')) return 'WEBP';
  const name = file.name?.toLowerCase() || '';
  if (name.endsWith('.jpg') || name.endsWith('.jpeg')) return 'JPG';
  if (name.endsWith('.png')) return 'PNG';
  if (name.endsWith('.webp')) return 'WEBP';
  return null;
}

export default function ImageConverter({
  defaultFormat = 'webp',
}: {
  defaultFormat?: ConversionOptions['format'];
}) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [options, setOptions] = useState<ConversionOptions>({
    format: defaultFormat,
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
        <h2
          id="converter-heading"
          className="font-display text-2xl font-bold text-foreground sm:text-3xl"
        >
          Image converter
        </h2>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted-foreground lg:mx-0 lg:max-w-none">
          Choose an image, then convert it to WebP, PNG, or JPG. Everything stays in your browser
          until you download.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground lg:justify-start">
          <span className="rounded-full border border-border bg-card px-3 py-1.5 shadow-sm">
            {file ? (
              <>
                <span className="font-semibold text-foreground">
                  {inferInputFormat(file) || 'Image'}
                </span>{' '}
                →{' '}
                <span className="font-semibold text-foreground">{options.format.toUpperCase()}</span>
              </>
            ) : (
              <>Select a file to see “From → To”</>
            )}
          </span>
          {file?.name ? (
            <span className="truncate rounded-full border border-border bg-card px-3 py-1.5 shadow-sm max-w-[min(520px,90vw)]">
              <span className="font-medium text-foreground">File:</span> {file.name}
            </span>
          ) : null}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
        <div className="space-y-6">
          <UploadZone onFileSelect={handleFileSelect} />

          <OptionsPanel options={options} setOptions={setOptions} />

          <Button
            onClick={handleConvert}
            disabled={!file || loading}
            aria-busy={loading}
            className="font-display h-14 w-full rounded-2xl text-lg font-semibold shadow-md sm:h-16 sm:text-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 text-white hover:from-sky-600 hover:via-indigo-600 hover:to-fuchsia-600"
          >
            {loading ? 'Converting…' : `Convert to ${options.format.toUpperCase()}`}
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
