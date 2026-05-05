'use client';

import Image from 'next/image';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pixelsToMm } from '@/lib/image-utils';
import type { ConversionOptions } from './converter-options';

interface Props {
  previewUrl: string | null;
  resultUrl: string | null;
  fileName?: string;
  options: ConversionOptions;
}

export function PreviewPanel({ previewUrl, resultUrl, fileName, options }: Props) {
  const handleDownload = () => {
    if (!resultUrl) return;

    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = `eztofile-${fileName || 'converted'}.${options.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass rounded-3xl p-6 sm:p-8">
      <h3 className="font-display mb-2 text-xl font-bold text-foreground sm:text-2xl">Preview</h3>
      <p className="mb-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
        Your original appears first. After converting, the new picture and a download button show up
        below.
      </p>

      <div className="space-y-10">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Before
          </p>
          {previewUrl ? (
            <div className="relative min-h-[220px] w-full overflow-hidden rounded-2xl border border-border bg-muted/30 shadow-inner">
              <Image
                src={previewUrl}
                alt="Your uploaded picture"
                width={1200}
                height={900}
                unoptimized
                className="h-auto w-full object-contain"
              />
            </div>
          ) : (
            <div className="flex min-h-[220px] items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20 px-4 text-center text-base text-muted-foreground">
              When you add a picture, it will show here.
            </div>
          )}
        </div>

        {resultUrl && (
          <div>
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">After</p>
              <Button
                onClick={handleDownload}
                className="font-display h-12 w-full rounded-xl text-base font-semibold sm:h-14 sm:w-auto sm:px-8 sm:text-lg"
              >
                <Download className="mr-2 size-5" aria-hidden />
                Download picture
              </Button>
            </div>

            <div className="relative min-h-[220px] w-full overflow-hidden rounded-2xl border border-border bg-muted/30 shadow-inner">
              <Image
                src={resultUrl}
                alt="Converted picture"
                width={1200}
                height={900}
                unoptimized
                className="h-auto w-full object-contain"
              />
            </div>

            <div className="mt-5 space-y-2 rounded-2xl border border-border bg-card/80 p-4 text-base leading-relaxed text-foreground shadow-sm sm:p-5">
              <p>
                <span className="font-semibold">Format:</span> {options.format.toUpperCase()}
              </p>
              <p>
                <span className="font-semibold">Quality:</span> {options.quality}%
              </p>
              {options.width && (
                <p>
                  <span className="font-semibold">Width:</span> {options.width} pixels — about{' '}
                  {pixelsToMm(options.width, options.dpi)}&nbsp;mm wide at {options.dpi}&nbsp;DPI
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
