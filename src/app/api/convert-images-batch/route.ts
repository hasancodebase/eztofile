import JSZip from 'jszip';
import sharp from 'sharp';
import { NextRequest, NextResponse } from 'next/server';

function safeBaseName(name: string): string {
  const base = name.replace(/\.[^/.]+$/, '');
  const cleaned = base.replace(/[^\p{L}\p{N}\-_.\s]/gu, '').trim();
  return cleaned.length ? cleaned : 'file';
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    const format = (formData.get('format') as string) || 'webp';
    const quality = parseInt((formData.get('quality') as string) || '85', 10);
    const widthStr = formData.get('width') as string | null;
    const heightStr = formData.get('height') as string | null;
    const fit = ((formData.get('fit') as string) || 'inside') as 'inside' | 'cover' | 'contain';

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const width = widthStr ? Math.max(0, parseInt(widthStr, 10) || 0) : 0;
    const height = heightStr ? Math.max(0, parseInt(heightStr, 10) || 0) : 0;

    const zip = new JSZip();

    await Promise.all(
      files.map(async (file, index) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        let image = sharp(buffer);

        if (width > 0 || height > 0) {
          image = image.resize(width || null, height || null, { fit });
        }

        if (format === 'webp') {
          image = image.webp({ quality });
        } else if (format === 'png') {
          image = image.png();
        } else if (format === 'jpeg' || format === 'jpg') {
          image = image.jpeg({ quality });
        } else if (format === 'avif') {
          image = image.avif({ quality });
        } else {
          image = image.webp({ quality });
        }

        const out = await image.toBuffer();
        const ext = format === 'jpeg' ? 'jpg' : format;
        const base = safeBaseName(file.name || `image-${index + 1}`);
        const filename = `${base}.${ext}`;
        zip.file(filename, out);
      })
    );

    const zipped = await zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' });
    const body = new Uint8Array(zipped);
    return new NextResponse(body, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="eztofile-batch.zip"',
      },
    });
  } catch (error) {
    console.error('Batch conversion error:', error);
    return NextResponse.json(
      { error: 'Failed to process images. Try fewer/smaller files or different options.' },
      { status: 500 }
    );
  }
}

