// Reduce las fotos en el navegador justo antes de subirlas a Supabase, para que el bucket `medios` no se llene de
// originales de 5-8 MB (el consumo de tráfico del plan gratuito se disparó por eso).
//
// - JPG y PNG sin transparencia → JPG de calidad alta, lado máximo 2400 px (nunca se amplía).
// - PNG con transparencia (logos) → se conserva la transparencia (WebP de calidad alta, o PNG si no mejora).
// - GIF, SVG, WebP, AVIF, vídeo y PDF no se tocan.
// - Si el resultado no pesa menos que el original y no hizo falta reducir la medida, se sube el original.

export const LADO_MAXIMO = 2400;
export const CALIDAD_JPG = 0.86;
export const CALIDAD_WEBP = 0.9;

const CLAVE_ORIGINAL = "jm-subir-original";

/** Interruptor «Subir original sin comprimir» (se recuerda en este navegador) */
export function subirOriginal(): boolean {
  try {
    return localStorage.getItem(CLAVE_ORIGINAL) === "1";
  } catch {
    return false;
  }
}
export function fijarSubirOriginal(valor: boolean) {
  try {
    if (valor) localStorage.setItem(CLAVE_ORIGINAL, "1");
    else localStorage.removeItem(CLAVE_ORIGINAL);
  } catch {
    /* sin almacenamiento: el interruptor solo vale para esta carga */
  }
}

export type Resultado = { archivo: File; antes: number; despues: number; reducida: boolean };

function aBlob(lienzo: HTMLCanvasElement, tipo: string, calidad?: number) {
  return new Promise<Blob | null>((res) => lienzo.toBlob(res, tipo, calidad));
}

async function cargar(archivo: File): Promise<ImageBitmap | null> {
  try {
    // from-image respeta la orientación EXIF de las fotos de cámara y móvil
    return await createImageBitmap(archivo, { imageOrientation: "from-image" });
  } catch {
    return null;
  }
}

function tieneTransparencia(ctx: CanvasRenderingContext2D, ancho: number, alto: number) {
  const datos = ctx.getImageData(0, 0, ancho, alto).data;
  for (let i = 3; i < datos.length; i += 4) if (datos[i] < 255) return true;
  return false;
}

const sinExtension = (nombre: string) => nombre.replace(/\.[^.]+$/, "");

/** Devuelve el archivo a subir (el mismo si no hay nada que ganar) */
export async function comprimirImagen(archivo: File): Promise<Resultado> {
  const igual: Resultado = { archivo, antes: archivo.size, despues: archivo.size, reducida: false };
  if (archivo.type !== "image/jpeg" && archivo.type !== "image/png") return igual;
  if (subirOriginal()) return igual;

  const mapa = await cargar(archivo);
  if (!mapa) return igual;
  try {
    const escala = Math.min(1, LADO_MAXIMO / Math.max(mapa.width, mapa.height));
    const ancho = Math.max(1, Math.round(mapa.width * escala));
    const alto = Math.max(1, Math.round(mapa.height * escala));
    const lienzo = document.createElement("canvas");
    lienzo.width = ancho;
    lienzo.height = alto;
    const ctx = lienzo.getContext("2d", { willReadFrequently: archivo.type === "image/png" });
    if (!ctx) return igual;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(mapa, 0, 0, ancho, alto);

    let blob: Blob | null = null;
    let tipo = "image/jpeg";
    let ext = "jpg";
    if (archivo.type === "image/png" && tieneTransparencia(ctx, ancho, alto)) {
      // Logos y recortes con transparencia: WebP con alfa; si el navegador no lo crea (devuelve PNG), se queda PNG
      const webp = await aBlob(lienzo, "image/webp", CALIDAD_WEBP);
      if (webp && webp.type === "image/webp") {
        blob = webp;
        tipo = "image/webp";
        ext = "webp";
      } else {
        blob = await aBlob(lienzo, "image/png");
        tipo = "image/png";
        ext = "png";
      }
    } else {
      blob = await aBlob(lienzo, "image/jpeg", CALIDAD_JPG);
    }
    if (!blob) return igual;

    // Sin reducir la medida y sin ganar al menos un 10 %: mejor el original (no se recomprime por nada)
    if (escala === 1 && blob.size > archivo.size * 0.9) return igual;
    // Reducida de medida pero más pesada que el original (raro): también el original
    if (blob.size >= archivo.size) return igual;

    const nombre = `${sinExtension(archivo.name)}.${ext}`;
    return { archivo: new File([blob], nombre, { type: tipo }), antes: archivo.size, despues: blob.size, reducida: true };
  } finally {
    mapa.close();
  }
}

/** «6,2 MB» / «240 KB» */
export function pesoLegible(bytes: number) {
  return bytes >= 1048576 ? `${(bytes / 1048576).toFixed(1).replace(".", ",")} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
