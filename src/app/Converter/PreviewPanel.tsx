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
    <div className="glass rounded-3xl p-8">
      <h3 className="font-semibold text-lg mb-6">Live Preview</h3>

      <div className="space-y-10">
        {/* Original Image */}
        <div>
          <p className="uppercase text-xs tracking-widest text-zinc-500 mb-3">ORIGINAL IMAGE</p>
          {previewUrl ? (
            <div className="relative min-h-[240px] w-full overflow-hidden rounded-2xl border border-white/10 shadow-xl">
              <Image
                src={previewUrl}
                alt="Original"
                width={1200}
                height={900}
                unoptimized
                className="h-auto w-full object-contain"
              />
            </div>
          ) : (
            <div className="h-80 bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-500 border border-dashed border-white/20">
              Upload an image to see preview
            </div>
          )}
        </div>

        {/* Converted Image */}
        {resultUrl && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <p className="uppercase text-xs tracking-widest text-emerald-400">CONVERTED RESULT</p>
              <Button onClick={handleDownload} className="bg-emerald-600 hover:bg-emerald-500">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
            
            <div className="relative min-h-[240px] w-full overflow-hidden rounded-2xl border border-white/10 shadow-xl">
              <Image
                src={resultUrl}
                alt="Converted"
                width={1200}
                height={900}
                unoptimized
                className="h-auto w-full object-contain"
              />
            </div>

            <div className="mt-5 text-xs text-zinc-400 space-y-1 bg-black/40 p-4 rounded-2xl">
              <p><strong>Format:</strong> {options.format.toUpperCase()}</p>
              <p><strong>Quality:</strong> {options.quality}%</p>
              {options.width && (
                <p>
                  <strong>Width:</strong> {options.width}px 
                  ({pixelsToMm(options.width, options.dpi)} mm at {options.dpi} DPI)
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}