'use client';

import { useState } from 'react';
import ImageConverter from '@/app/Converter/ImageConverter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, Sparkles, SlidersHorizontal, PartyPopper } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('images');

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
          Photos: JPG, PNG, or WebP · Up to about 20&nbsp;MB · Documents: more formats coming soon
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
            <ImageConverter />
          </TabsContent>

          <TabsContent value="documents" className="outline-none">
            <div className="glass mx-auto max-w-2xl rounded-3xl px-6 py-12 text-center sm:px-10 sm:py-16">
              <h2 className="font-display mb-4 text-3xl font-bold text-foreground sm:text-4xl">
                Documents are on the way
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
                We are preparing simple ways to work with PDFs, Word files, and spreadsheets — the
                same large buttons and plain language you see here.
              </p>
              <p className="text-base text-muted-foreground">
                For now, the picture tools below are ready to use anytime.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
