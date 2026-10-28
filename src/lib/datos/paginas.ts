import { filas } from "./cliente";
import { getMedios, medio } from "./medios";
import type { DatosBloque, Medio, Pagina } from "./tipos";

/** Una página (Inicio, Sobre mí...) con sus bloques visibles en orden. null si no existe o no está publicada. */
export async function getPagina(slug: string): Promise<Pagina | null> {
  const [paginas, bloques, medios] = await Promise.all([filas("paginas"), filas("bloques"), getMedios()]);
  const p = paginas.find((x) => x.slug === slug);
  if (!p) return null;
  return {
    id: p.id,
    slug: p.slug,
    titulo: p.titulo,
    imagen: medio(medios, p.imagen_id),
    seo: { titulo: p.seo_titulo, descripcion: p.seo_descripcion },
    bloques: bloques
      .filter((b) => b.pagina_id === p.id && b.visible)
      .sort((a, b) => a.orden - b.orden)
      .map((b) => ({ id: b.id, tipo: b.tipo, datos: (b.datos ?? {}) as DatosBloque })),
  };
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Los medios que citan los bloques (cualquier id de `medios` dentro de `datos`, a cualquier profundidad) */
export function mediosDeBloques(pagina: Pagina, medios: Record<string, Medio>) {
  const usados: Record<string, Medio> = {};
  const recorrer = (v: unknown) => {
    if (typeof v === "string") {
      if (UUID.test(v) && medios[v]) usados[v] = medios[v];
    } else if (Array.isArray(v)) v.forEach(recorrer);
    else if (v && typeof v === "object") Object.values(v).forEach(recorrer);
  };
  pagina.bloques.forEach((b) => recorrer(b.datos));
  return usados;
}

/** Slugs de todas las páginas publicadas (para el sitemap) */
export async function getSlugsPaginas(): Promise<string[]> {
  const paginas = await filas("paginas");
  return paginas.map((p) => p.slug);
}
