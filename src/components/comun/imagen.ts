import type { CSSProperties } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/**
 * URL de una imagen.
 * Las imágenes remotas (Supabase Storage, CDN externas) se sirven directamente desde su CDN
 * para máxima velocidad y fiabilidad sin depender de /_next/image.
 * Para rutas relativas locales, se respeta el basePath si está configurado.
 */
export function img(
  url: string,
  ancho: 256 | 384 | 640 | 750 | 828 | 1080 | 1200 | 1920 | 2048 | 3840 = 1920,
  calidad = 90,
) {
  void ancho;
  void calidad;
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("//")) {
    return url;
  }
  if (basePath && url.startsWith("/") && !url.startsWith(basePath)) {
    return `${basePath}${url}`;
  }
  return url;
}

/**
 * Estilo para una foto que se recorta (object-cover): el punto de interés que eligió Josep en la biblioteca
 * queda visible y el zoom (scale) pivota sobre ese mismo punto. Sin punto, undefined y la foto se recorta por el centro.
 */
export function enfoque(medio: { foco?: { x: number; y: number } | null } | null | undefined): CSSProperties | undefined {
  return medio?.foco
    ? { objectPosition: `${medio.foco.x}% ${medio.foco.y}%`, transformOrigin: `${medio.foco.x}% ${medio.foco.y}%` }
    : undefined;
}
