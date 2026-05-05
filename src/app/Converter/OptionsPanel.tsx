'use client';

import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ConversionOptions } from './converter-options';

interface Props {
  options: ConversionOptions;
  setOptions: (options: ConversionOptions) => void;
}

export function OptionsPanel({ options, setOptions }: Props) {
  return (
    <div className="glass space-y-10 rounded-3xl p-6 sm:p-8">
      <div>
        <Label className="font-display mb-2 block text-base font-semibold text-foreground">
          Convert to
        </Label>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          Pick the new file type you want to download.
        </p>
        <div className="mb-4 grid grid-cols-3 gap-2">
          {(['webp', 'png', 'jpeg'] as const).map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => setOptions({ ...options, format: fmt })}
              className={[
                'rounded-xl border px-3 py-3 text-sm font-semibold shadow-sm transition-colors',
                'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/60',
                options.format === fmt
                  ? 'border-transparent bg-primary text-primary-foreground'
                  : 'border-border bg-card text-foreground hover:bg-muted',
              ].join(' ')}
            >
              {fmt.toUpperCase()}
            </button>
          ))}
        </div>
        <Select
          value={options.format}
          onValueChange={(value) =>
            setOptions({ ...options, format: value as ConversionOptions['format'] })
          }
        >
          <SelectTrigger className="h-auto min-h-12 w-full rounded-xl border-border bg-card py-3 text-base shadow-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="webp" className="text-base">
              WebP — smaller files, good for the web
            </SelectItem>
            <SelectItem value="png" className="text-base">
              PNG — crisp graphics and screenshots
            </SelectItem>
            <SelectItem value="jpeg" className="text-base">
              JPEG — classic photos, wide compatibility
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="font-display mb-2 block text-base font-semibold text-foreground">
          How wide should the picture be?
        </Label>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          Leave the slider at the start to keep the original width. Move it right to shrink — handy
          for email or faster loading pages.
        </p>
        <Slider
          value={[options.width || 0]}
          onValueChange={([value]) =>
            setOptions({
              ...options,
              width: value > 0 ? value : undefined,
            })
          }
          max={4000}
          step={10}
          className="mb-3 py-1"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Original size</span>
          <span className="font-medium text-foreground">
            {options.width ? `${options.width} pixels wide` : 'Not changing width'}
          </span>
        </div>
      </div>

      <div>
        <Label className="font-display mb-2 block text-base font-semibold text-foreground">
          Print detail (DPI)
        </Label>
        <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
          This helps show width in millimetres in the preview. 300 is a safe choice for home
          printing; 72 is typical for screens.
        </p>
        <Select
          value={options.dpi.toString()}
          onValueChange={(v) => setOptions({ ...options, dpi: parseInt(v, 10) })}
        >
          <SelectTrigger className="h-auto min-h-12 w-full rounded-xl border-border bg-card py-3 text-base shadow-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="72" className="text-base">
              72 — phones and computer screens
            </SelectItem>
            <SelectItem value="150" className="text-base">
              150 — everyday printing
            </SelectItem>
            <SelectItem value="300" className="text-base">
              300 — sharp photos and documents
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="font-display mb-2 block text-base font-semibold text-foreground">
          Quality: {options.quality}%
        </Label>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          Higher keeps more detail and a larger file. Lower saves space — fine for small previews.
        </p>
        <Slider
          value={[options.quality]}
          onValueChange={([q]) => setOptions({ ...options, quality: q })}
          max={100}
          step={5}
          className="py-1"
        />
      </div>
    </div>
  );
}
