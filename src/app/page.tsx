'use client';

import { useState } from 'react';
import ImageConverter from '@/app/Converter/ImageConverter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('images');

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
      <div className="pt-24 pb-16 text-center px-6">
        <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full mb-6">
          <span className="text-xs font-medium tracking-widest text-purple-400">FREE & FAST</span>
        </div>

        <h1 className="text-7xl font-bold tracking-tighter mb-6 gradient-text">Eztofile</h1>

        <p className="text-3xl text-zinc-300 max-w-3xl mx-auto leading-tight">
          Beautiful file conversions.
          <br />
          Resize images • Convert formats • Pixels to mm
        </p>

        <p className="mt-6 text-zinc-500 text-lg">
          JPG ↔ WebP • PNG to WebP • DOCX to PDF • Free to use
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-24">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12 glass rounded-3xl p-1.5">
            <TabsTrigger
              value="images"
              className="rounded-2xl data-[state=active]:bg-white data-[state=active]:text-black py-3 text-base"
            >
              <Upload className="mr-2 h-5 w-5" /> Images
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="rounded-2xl data-[state=active]:bg-white data-[state=active]:text-black py-3 text-base"
            >
              <FileText className="mr-2 h-5 w-5" /> Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="images" className="mt-4">
            <ImageConverter />
          </TabsContent>

          <TabsContent value="documents">
            <div className="glass rounded-3xl p-16 text-center max-w-2xl mx-auto">
              <h2 className="text-4xl font-semibold mb-6">Document Converter</h2>
              <p className="text-xl text-zinc-400 mb-8">DOCX ↔ PDF • Excel to PDF • PDF to Word</p>
              <p className="text-sm text-zinc-500">
                Basic version is in progress.
                <br />
                Image converter is fully working now.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
