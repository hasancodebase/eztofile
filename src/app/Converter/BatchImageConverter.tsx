'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import {
  Download,
  Images,
  Trash2,
  CheckSquare,
  Square,
  Settings2,
  Sparkles,
} from 'lucide-react';
import type { ConversionOptions } from './converter-options';

type BatchItem = {
  id: string;
  file: File;
  previewUrl: string;
  selected: boolean;
};

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function toIntOrUndef(v: string): number | undefined {
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function formatLabel(fmt: ConversionOptions['format']) {
  if (fmt === 'jpeg') return 'JPG';
  return fmt.toUpperCase();
}

export default function BatchImageConverter() {
  const [items, setItems] = useState<BatchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState<string>('Add images to start.');

  const [options, setOptions] = useState<ConversionOptions>({
    format: 'webp',
    dpi: 300,
    quality: 85,
    fit: 'inside',
  });

  const selectedCount = useMemo(() => items.filter((x) => x.selected).length, [items]);
  const allSelected = items.length > 0 && selectedCount === items.length;

  const onDrop = useCallback((files: File[]) => {
    if (!files.length) return;
    setItems((prev) => {
      const next = [...prev];
      for (const f of files) {
        const url = URL.createObjectURL(f);
        next.push({ id: uid(), file: f, previewUrl: url, selected: true });
      }
      return next;
    });
    setStatusText(`${files.length} file(s) added. Choose settings, then Process.`);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.avif'] },
    maxSize: 25 * 1024 * 1024,
    onDrop,
  });

  useEffect(() => {
    return () => {
      for (const it of items) URL.revokeObjectURL(it.previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleAll = () => {
    setItems((prev) => prev.map((x) => ({ ...x, selected: !allSelected })));
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const item = prev.find((x) => x.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((x) => x.id !== id);
    });
  };

  const clearAll = () => {
    setItems((prev) => {
      for (const it of prev) URL.revokeObjectURL(it.previewUrl);
      return [];
    });
    setStatusText('Cleared. Add images to start again.');
  };

  const processBatch = async () => {
    const selected = items.filter((x) => x.selected);
    if (selected.length === 0) return;

    setLoading(true);
    setProgress(8);
    setStatusText(`Processing ${selected.length} file(s)…`);

    const fd = new FormData();
    for (const it of selected) fd.append('files', it.file);
    fd.append('format', options.format);
    fd.append('quality', String(clamp(options.quality, 1, 100)));
    if (options.width) fd.append('width', String(options.width));
    if (options.height) fd.append('height', String(options.height));
    fd.append('fit', options.fit || 'inside');

    try {
      const res = await fetch('/api/convert-images-batch', { method: 'POST', body: fd });
      setProgress(65);

      if (!res.ok) {
        let message = 'Batch processing failed';
        try {
          const err = await res.json();
          if (err?.error && typeof err.error === 'string') message = err.error;
        } catch {
          /* ignore */
        }
        throw new Error(message);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'eztofile-batch.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
      setProgress(100);
      setStatusText(`Done! Downloaded a ZIP with ${selected.length} converted file(s).`);
    } catch (e: unknown) {
      console.error(e);
      const msg = e instanceof Error ? e.message : 'Something went wrong. Please try again.';
      alert(msg);
      setStatusText('Error. Try fewer files or smaller images.');
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1400);
    }
  };

  return (
    <section aria-labelledby="batch-heading" className="space-y-4">
      <div className="text-center lg:text-left">
        <h2 id="batch-heading" className="font-display text-2xl font-bold text-foreground sm:text-3xl">
          Batch processing
        </h2>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted-foreground lg:max-w-none">
          Convert many images at once. Choose settings once, process selected files, and download a ZIP.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[420px_1fr] lg:gap-8">
        {/* Settings column */}
        <div className="space-y-4">
          <div className="glass rounded-3xl p-6 sm:p-7">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <Settings2 className="size-5" aria-hidden />
              </span>
              <div>
                <div className="font-display text-lg font-bold text-foreground">Bulk settings</div>
                <div className="text-sm text-muted-foreground">Applies to all selected files</div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <Label className="font-display mb-2 block text-base font-semibold text-foreground">
                  Output format
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {(['jpeg', 'png', 'webp', 'avif'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setOptions((o) => ({ ...o, format: fmt }))}
                      className={[
                        'rounded-xl border px-3 py-3 text-sm font-semibold shadow-sm transition-colors',
                        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/60',
                        options.format === fmt
                          ? 'border-transparent bg-primary text-primary-foreground'
                          : 'border-border bg-card text-foreground hover:bg-muted',
                      ].join(' ')}
                    >
                      {formatLabel(fmt)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="font-display mb-2 block text-base font-semibold text-foreground">
                  Compression quality: {options.quality}%
                </Label>
                <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                  Higher keeps more detail. Lower makes smaller files.
                </p>
                <Slider
                  value={[options.quality]}
                  onValueChange={([q]) => setOptions((o) => ({ ...o, quality: q }))}
                  max={100}
                  step={5}
                  className="py-1"
                />
              </div>

              <div>
                <Label className="font-display mb-2 block text-base font-semibold text-foreground">
                  Dimensions (optional)
                </Label>
                <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                  Leave empty to keep original size. Use width or height (or both).
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-border bg-card px-4 py-3 shadow-sm">
                    <div className="text-xs font-semibold text-muted-foreground">Width</div>
                    <input
                      inputMode="numeric"
                      type="number"
                      min={0}
                      placeholder="Auto"
                      value={options.width ?? ''}
                      onChange={(e) => setOptions((o) => ({ ...o, width: toIntOrUndef(e.target.value) }))}
                      className="mt-1 w-full bg-transparent text-base font-semibold text-foreground outline-none"
                    />
                  </div>
                  <div className="rounded-2xl border border-border bg-card px-4 py-3 shadow-sm">
                    <div className="text-xs font-semibold text-muted-foreground">Height</div>
                    <input
                      inputMode="numeric"
                      type="number"
                      min={0}
                      placeholder="Auto"
                      value={options.height ?? ''}
                      onChange={(e) => setOptions((o) => ({ ...o, height: toIntOrUndef(e.target.value) }))}
                      className="mt-1 w-full bg-transparent text-base font-semibold text-foreground outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={processBatch}
            disabled={loading || selectedCount === 0}
            aria-busy={loading}
            className="font-display h-14 w-full rounded-2xl text-lg font-semibold shadow-md bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 text-white hover:from-sky-600 hover:via-indigo-600 hover:to-fuchsia-600"
          >
            <Download className="mr-2 size-5" aria-hidden />
            {loading ? 'Processing…' : `Process ${selectedCount || 0} file(s) → ZIP`}
          </Button>

          {loading && (
            <div className="space-y-2">
              <Progress value={progress} className="h-3 rounded-full" />
              <p className="text-center text-sm text-muted-foreground">{statusText}</p>
            </div>
          )}

          {!loading && (
            <div className="glass rounded-3xl p-5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary" aria-hidden />
                <span>{statusText}</span>
              </div>
            </div>
          )}
        </div>

        {/* Files column */}
        <div className="space-y-4">
          <div
            {...getRootProps()}
            className="glass cursor-pointer rounded-3xl border-2 border-dashed border-primary/35 p-6 text-center outline-none transition-colors hover:border-primary hover:bg-primary/5 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-ring/60 sm:p-10"
          >
            <input {...getInputProps()} aria-label="Add images for batch processing" />
            <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-primary/15 text-primary sm:size-16">
              <Images className="size-7 sm:size-8" aria-hidden />
            </div>
            <p className="font-display text-lg font-semibold text-foreground sm:text-xl">
              {isDragActive ? 'Drop files here' : 'Add multiple images (drag or click)'}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
              JPG, PNG, WebP, AVIF · Select which ones to process · Download as ZIP
            </p>
          </div>

          <div className="glass rounded-3xl p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm">
                <button
                  type="button"
                  onClick={toggleAll}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 font-semibold text-foreground shadow-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/60"
                >
                  {allSelected ? <CheckSquare className="size-4" aria-hidden /> : <Square className="size-4" aria-hidden />}
                  {allSelected ? 'Unselect all' : 'Select all'}
                </button>
                <span className="text-muted-foreground">
                  {selectedCount}/{items.length} selected
                </span>
              </div>

              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground shadow-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/60 disabled:opacity-50"
                disabled={items.length === 0}
              >
                <Trash2 className="size-4" aria-hidden />
                Clear
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.length === 0 ? (
                <div className="col-span-full rounded-2xl border border-border bg-card/60 p-6 text-center text-sm text-muted-foreground">
                  Add images to see them here. Then select which ones to process.
                </div>
              ) : (
                items.map((it) => (
                  <div key={it.id} className="rounded-2xl border border-border bg-card/70 p-3 shadow-sm">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <label className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                        <input
                          type="checkbox"
                          checked={it.selected}
                          onChange={() =>
                            setItems((prev) =>
                              prev.map((x) => (x.id === it.id ? { ...x, selected: !x.selected } : x))
                            )
                          }
                          className="size-4 accent-[color:var(--primary)]"
                        />
                        Select
                      </label>
                      <button
                        type="button"
                        onClick={() => removeItem(it.id)}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                        aria-label={`Remove ${it.file.name}`}
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </button>
                    </div>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted/20">
                      <Image
                        src={it.previewUrl}
                        alt={it.file.name}
                        width={900}
                        height={675}
                        unoptimized
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="mt-2 truncate text-xs font-medium text-muted-foreground" title={it.file.name}>
                      {it.file.name}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

