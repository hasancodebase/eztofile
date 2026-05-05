export function pixelsToMm(pixels: number, dpi: number): number {
  return Math.round((pixels * 25.4) / dpi * 100) / 100;
}

export function mmToPixels(mm: number, dpi: number): number {
  return Math.round((mm * dpi) / 25.4);
}