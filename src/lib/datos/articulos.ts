import { filas } from "./cliente";
import { getMedios, medio } from "./medios";
import type { Articulo } from "./tipos";

/** Artículos publicados, del más reciente al más antiguo */
export async function getArticulos(): Promise<Articulo[]> {
  const [articulos, categorias, medios] = await Promise.all([filas("articulos"), filas("categorias_articulo"), getMedios()]);
  return articulos
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .map((a) => {
      const c = categorias.find((x) => x.id === a.categoria_id);
      return {
        id: a.id,
        slug: a.slug,
        idAntiguo: a.id_antiguo,
        titulo: a.titulo,
        fecha: a.fecha,
        extracto: a.extracto,
        categoria: c ? { slug: c.slug, nombre: c.nombre } : null,
        imagen: medio(medios, a.imagen_id),
        contenido: a.contenido,
        seo: { titulo: a.seo_titulo, descripcion: a.seo_descripcion },
      };
    });
}

export async function getArticulo(slug: string) {
  return (await getArticulos()).find((a) => a.slug === slug) ?? null;
}
