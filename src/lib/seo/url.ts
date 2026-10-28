// Dirección base de la web para metadatos, OpenGraph, Schema.org y sitemap.
// Al lanzar (fase 7), se define NEXT_PUBLIC_SITE_URL en el entorno de producción.
export const URL_SITIO = (process.env.NEXT_PUBLIC_SITE_URL || "https://josepmira.com").replace(/\/+$/, "");

export function urlAbsoluta(ruta = "/") {
  if (/^https?:\/\//i.test(ruta)) return ruta;
  return `${URL_SITIO}${ruta.startsWith("/") ? ruta : `/${ruta}`}`;
}

/** Quita los asteriscos de acento (*palabra*) de los titulares para descripciones y Schema.org */
export function sinAcento(texto?: string | null) {
  return (texto ?? "").replace(/\*/g, "").trim();
}
