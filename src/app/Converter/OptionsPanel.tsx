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
    <div className="glass rounded-3xl p-8 mt-8 space-y-8">
      {/* Output Format */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Output Format</Label>
        <Select 
          value={options.format} 
          onValueChange={(value) =>
            setOptions({ ...options, format: value as ConversionOptions['format'] })
          }
        >
          <SelectTrigger className="bg-zinc-900">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="webp">WebP (Best for web - smaller size)</SelectItem>
            <SelectItem value="png">PNG (High quality)</SelectItem>
            <SelectItem value="jpeg">JPEG</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Width Resize */}
      <div>
        <Label className="text-sm font-medium mb-3 block">
          Width (pixels) - Leave empty for original size
        </Label>
        <Slider 
          value={[options.width || 0]} 
          onValueChange={([value]) => setOptions({ 
            ...options, 
            width: value > 0 ? value : undefined 
          })}
          max={4000} 
          step={10}
          className="mb-2"
        />
        <div className="flex justify-between text-xs text-zinc-400">
          <span>Original</span>
          <span>{options.width ? `${options.width}px` : ''}</span>
        </div>
      </div>

      {/* DPI Selector */}
      <div>
        <Label className="text-sm font-medium mb-2 block">DPI (for mm conversion)</Label>
        <Select 
          value={options.dpi.toString()} 
          onValueChange={(v) => setOptions({ ...options, dpi: parseInt(v) })}
        >
          <SelectTrigger className="bg-zinc-900">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="72">72 DPI (Screen/Web)</SelectItem>
            <SelectItem value="150">150 DPI (Standard Print)</SelectItem>
            <SelectItem value="300">300 DPI (High Quality Print)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quality Slider */}
      <div>
        <Label className="text-sm font-medium mb-3 block">
          Quality: {options.quality}%
        </Label>
        <Slider 
          value={[options.quality]} 
          onValueChange={([q]) => setOptions({ ...options, quality: q })}
          max={100} 
          step={5}
        />
      </div>
    </div>
  );
}