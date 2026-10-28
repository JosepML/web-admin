// Subida de archivos desde el navegador: el archivo va directo al bucket `medios` (con la sesión de Josep) y
// después se da de alta en la biblioteca con registrarMedio(). Así no pasa por el servidor de la web, que tiene
// un límite de tamaño muy por debajo de un vídeo.

import { clienteNavegador } from "@/lib/supabase/navegador";
import { registrarMedio, type MedioBiblioteca } from "./medios";

/** Lo que admite el bucket (plan/esquema.md, «Seguridad»): imágenes, mp4/webm y pdf, hasta 50 MB */
export const ACEPTA = "image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml,video/mp4,video/webm,application/pdf";
const MAXIMO = 50 * 1024 * 1024;

/** "Mi Foto Final (2).JPG" → "mi-foto-final-2.jpg" */
function nombreLimpio(nombre: string) {
  const punto = nombre.lastIndexOf(".");
  const ext = punto > 0 ? nombre.slice(punto + 1).toLowerCase() : "";
  const base = (punto > 0 ? nombre.slice(0, punto) : nombre)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  return `${base || "archivo"}${ext ? `.${ext}` : ""}`;
}

function medidas(archivo: File): Promise<{ ancho: number | null; alto: number | null; duracion: number | null }> {
  const url = URL.createObjectURL(archivo);
  const fin = <T,>(v: T) => {
    URL.revokeObjectURL(url);
    return v;
  };
  return new Promise((resolver) => {
    if (archivo.type.startsWith("image/")) {
      const i = new Image();
      i.onload = () => resolver(fin({ ancho: i.naturalWidth || null, alto: i.naturalHeight || null, duracion: null }));
      i.onerror = () => resolver(fin({ ancho: null, alto: null, duracion: null }));
      i.src = url;
    } else if (archivo.type.startsWith("video/")) {
      const v = document.createElement("video");
      v.preload = "metadata";
      v.onloadedmetadata = () => resolver(fin({ ancho: v.videoWidth || null, alto: v.videoHeight || null, duracion: Number.isFinite(v.duration) ? Math.round(v.duration * 10) / 10 : null }));
      v.onerror = () => resolver(fin({ ancho: null, alto: null, duracion: null }));
      v.src = url;
    } else resolver(fin({ ancho: null, alto: null, duracion: null }));
  });
}

/** Sube un archivo y lo deja en la biblioteca. Lanza un Error con un mensaje para Josep si algo falla. */
export async function subirArchivo(archivo: File, foco: { x: number; y: number } | null = null): Promise<MedioBiblioteca> {
  if (!ACEPTA.split(",").includes(archivo.type)) throw new Error(`«${archivo.name}» no es una imagen, un vídeo mp4/webm ni un pdf.`);
  if (archivo.size > MAXIMO) throw new Error(`«${archivo.name}» pesa ${(archivo.size / 1048576).toFixed(0)} MB; el máximo es 50 MB.`);
  const ahora = new Date();
  const ruta = `subidas/${ahora.getFullYear()}/${String(ahora.getMonth() + 1).padStart(2, "0")}/${crypto.randomUUID().slice(0, 8)}-${nombreLimpio(archivo.name)}`;
  const [{ error }, m] = await Promise.all([
    clienteNavegador().storage.from("medios").upload(ruta, archivo, { contentType: archivo.type, cacheControl: "31536000" }),
    medidas(archivo),
  ]);
  if (error) throw new Error(/row-level|unauthorized|jwt/i.test(error.message) ? "Tu sesión ha caducado: vuelve a entrar para subir archivos." : `No se pudo subir «${archivo.name}»: ${error.message}`);
  const tipo = archivo.type.startsWith("image/") ? "imagen" : archivo.type.startsWith("video/") ? "video" : "documento";
  const r = await registrarMedio({ ruta, tipo, mime: archivo.type, bytes: archivo.size, ...m, titulo: archivo.name.replace(/\.[^.]+$/, ""), foco });
  if (!r.ok) throw new Error(r.error);
  return r.datos;
}
