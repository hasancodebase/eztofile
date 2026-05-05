'use client';

import { useState } from 'react';
import ImageConverter from '@/app/Converter/ImageConverter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, Sparkles, SlidersHorizontal, PartyPopper, ArrowRight } from 'lucide-react';
import type { ConversionOptions } from '@/app/Converter/converter-options';

export default function Home() {
  const [activeTab, setActiveTab] = useState('images');
  const [imagePreset, setImagePreset] = useState<ConversionOptions['format']>('webp');

  return (
    <div className="surface-page text-foreground">
      <div className="px-4 pb-12 pt-20 text-center sm:px-6 sm:pt-24 md:pb-16">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur-sm">
          <Sparkles className="size-4 text-primary" aria-hidden />
          <span>No signup · Works in your browser</span>
        </div>

        <h1 className="font-display mx-auto mb-5 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          <span className="gradient-text">Eztofile</span>
        </h1>

        <p className="mx-auto mb-4 max-w-2xl text-lg font-medium leading-relaxed text-foreground sm:text-xl md:text-2xl">
          Change picture size and file type in a few clicks. Built to feel calm, clear, and easy for
          everyone.
        </p>

        <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Ready now: JPG/PNG/WebP → WebP/PNG/JPG · Documents: coming soon
        </p>

        <ol className="mx-auto mt-10 grid max-w-3xl gap-4 text-left sm:grid-cols-3 sm:gap-6">
          <li className="glass flex gap-3 rounded-2xl p-4 sm:flex-col sm:items-center sm:text-center">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Upload className="size-5" aria-hidden />
            </span>
            <span>
              <span className="font-display block text-base font-bold text-foreground">1. Add a photo</span>
              <span className="mt-1 block text-sm leading-snug text-muted-foreground">
                Drag in or tap to choose a file from your device.
              </span>
            </span>
          </li>
          <li className="glass flex gap-3 rounded-2xl p-4 sm:flex-col sm:items-center sm:text-center">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <SlidersHorizontal className="size-5" aria-hidden />
            </span>
            <span>
              <span className="font-display block text-base font-bold text-foreground">2. Pick options</span>
              <span className="mt-1 block text-sm leading-snug text-muted-foreground">
                Format, width, and quality — labels explain each choice.
              </span>
            </span>
          </li>
          <li className="glass flex gap-3 rounded-2xl p-4 sm:flex-col sm:items-center sm:text-center">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <PartyPopper className="size-5" aria-hidden />
            </span>
            <span>
              <span className="font-display block text-base font-bold text-foreground">3. Get your file</span>
              <span className="mt-1 block text-sm leading-snug text-muted-foreground">
                Convert, preview, then download when you are happy.
              </span>
            </span>
          </li>
        </ol>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 md:pb-28">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="glass mx-auto mb-10 grid h-auto w-full max-w-lg grid-cols-2 gap-1 rounded-2xl p-1.5 sm:mb-12 sm:max-w-xl">
            <TabsTrigger
              value="images"
              className="font-display min-h-14 rounded-xl px-3 py-3 text-base font-semibold data-active:bg-primary data-active:text-primary-foreground data-active:shadow-md sm:min-h-16 sm:text-lg"
            >
              <Upload className="mr-2 size-5 shrink-0" aria-hidden />
              Pictures
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="font-display min-h-14 rounded-xl px-3 py-3 text-base font-semibold data-active:bg-primary data-active:text-primary-foreground data-active:shadow-md sm:min-h-16 sm:text-lg"
            >
              <FileText className="mr-2 size-5 shrink-0" aria-hidden />
              Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="images" className="mt-2 outline-none">
            <div className="mb-8 grid gap-4 lg:grid-cols-2">
              <div className="glass rounded-3xl p-6 sm:p-8">
                <h3 className="font-display text-xl font-bold text-foreground sm:text-2xl">
                  Popular image conversions
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Tap one to pre-select the output format, then upload your image.
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    { from: 'JPG', to: 'WEBP', fmt: 'webp' as const },
                    { from: 'PNG', to: 'WEBP', fmt: 'webp' as const },
                    { from: 'WEBP', to: 'JPG', fmt: 'jpeg' as const },
                    { from: 'PNG', to: 'JPG', fmt: 'jpeg' as const },
                  ].map((p) => (
                    <button
                      key={`${p.from}-${p.to}`}
                      type="button"
                      onClick={() => setImagePreset(p.fmt)}
                      className={[
                        'group rounded-2xl border bg-card px-4 py-4 text-left shadow-sm transition-colors',
                        'hover:bg-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/60',
                        imagePreset === p.fmt ? 'border-primary/40' : 'border-border',
                      ].join(' ')}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-display text-base font-bold text-foreground">
                          {p.from} <ArrowRight className="mx-1 inline size-4 text-muted-foreground" aria-hidden /> {p.to}
                        </div>
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                          Ready
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        Output will be <span className="font-semibold text-foreground">{p.to}</span>.
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass rounded-3xl p-6 sm:p-8">
                <h3 className="font-display text-xl font-bold text-foreground sm:text-2xl">
                  Coming soon
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  These are planned next. They are shown here so users know what Eztofile will support.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    { title: 'PNG → Vector (SVG)', note: 'Planned' },
                    { title: 'JPG → PNG', note: 'Planned' },
                    { title: 'HEIC → JPG', note: 'Planned' },
                    { title: 'Batch convert', note: 'Planned' },
                  ].map((x) => (
                    <div
                      key={x.title}
                      className="rounded-2xl border border-border bg-card/60 px-4 py-4 text-left opacity-70"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-display text-base font-bold text-foreground">{x.title}</div>
                        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                          {x.note}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        Not available yet.
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div id="converter" className="scroll-mt-28">
              <ImageConverter key={imagePreset} defaultFormat={imagePreset} />
            </div>
          </TabsContent>

          <TabsContent value="documents" className="outline-none">
            <div className="glass mx-auto max-w-4xl rounded-3xl px-6 py-10 sm:px-10 sm:py-14">
              <div className="text-center">
                <h2 className="font-display mb-3 text-3xl font-bold text-foreground sm:text-4xl">
                  Document converter (coming soon)
                </h2>
                <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  We’re adding document tools next. Below are the planned conversions so it’s obvious what you’ll be able to do.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { title: 'PDF → Word', desc: 'Turn a PDF into an editable document' },
                  { title: 'Word → PDF', desc: 'Create a clean PDF for sharing/printing' },
                  { title: 'Text → PDF', desc: 'Paste text and download as a PDF' },
                  { title: 'PDF → Text', desc: 'Extract readable text from a PDF' },
                  { title: 'Excel → PDF', desc: 'Export spreadsheets to PDF' },
                  { title: 'Images → PDF', desc: 'Combine images into a single PDF' },
                ].map((d) => (
                  <div
                    key={d.title}
                    className="rounded-2xl border border-border bg-card/70 p-5 opacity-75"
                    aria-disabled="true"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-display text-base font-bold text-foreground">{d.title}</div>
                      <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                        Soon
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
