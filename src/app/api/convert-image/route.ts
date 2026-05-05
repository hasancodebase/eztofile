import sharp from 'sharp';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const format = (formData.get('format') as string) || 'webp';
    const widthStr = formData.get('width') as string | null;
    const quality = parseInt((formData.get('quality') as string) || '85', 10);

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let image = sharp(buffer);

    if (widthStr) {
      const width = parseInt(widthStr, 10);
      if (width > 0) {
        image = image.resize(width, null, { fit: 'inside' });
      }
    }

    if (format === 'webp') {
      image = image.webp({ quality });
    } else if (format === 'png') {
      image = image.png();
    } else {
      image = image.jpeg({ quality });
    }

    const outputBuffer = await image.toBuffer();

    const contentType =
      format === 'webp' ? 'image/webp' : format === 'png' ? 'image/png' : 'image/jpeg';

    const body = new Uint8Array(outputBuffer);
    return new NextResponse(body, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="eztofile-converted.${format}"`,
      },
    });
  } catch (error) {
    console.error('Conversion error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process image. Try a smaller file or different options.',
      },
      { status: 500 }
    );
  }
}
