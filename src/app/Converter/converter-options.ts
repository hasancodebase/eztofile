export interface ConversionOptions {
  format: 'webp' | 'png' | 'jpeg' | 'avif';
  width?: number;
  height?: number;
  fit?: 'inside' | 'cover' | 'contain';
  dpi: number;
  quality: number;
}
