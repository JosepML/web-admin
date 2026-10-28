/**
 * URL de una imagen redimensionada por el optimizador de Next (ver images en next.config.ts), en
 * WebP/AVIF. Las URL que no son externas se devuelven tal cual.
 * Calidad 90 y anchos de al menos el doble de lo que se ve en pantalla (pantallas 2x): con calidad 75 y
 * anchos justos las fotos perdían nitidez, y la calidad de imagen manda en esta web.
 * Anchos válidos: los de Next por defecto (256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840).
 */
export function img(url: string, ancho: 256 | 384 | 640 | 750 | 828 | 1080 | 1200 | 1920 | 2048 | 3840 = 1920, calidad = 90) {
  if (!url.startsWith("http")) return url;
  return `/_next/image?url=${encodeURIComponent(url)}&w=${ancho}&q=${calidad}`;
}
