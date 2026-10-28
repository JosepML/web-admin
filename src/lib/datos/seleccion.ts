// Funciones puras sobre los datos ya cargados. Sin nada de servidor: las pueden usar los componentes de cliente.
import type { Medio, Proyecto, Servicio } from "./tipos";

/**
 * Proyectos de un filtro de Trabajos (o de la página de un servicio):
 * - «todos»: los destacados de Inicio (`destacado_orden`), en ese orden.
 * - un servicio: primero sus destacados (en su orden dentro del servicio) y detrás el resto de sus proyectos.
 */
export function proyectosDe(proyectos: Proyecto[], filtro: string): Proyecto[] {
  if (filtro === "todos") {
    return proyectos.filter((p) => p.destacadoOrden !== null).sort((a, b) => a.destacadoOrden! - b.destacadoOrden!);
  }
  const de = (p: Proyecto) => p.servicios.find((s) => s.slug === filtro);
  return proyectos
    .filter((p) => de(p))
    .sort((a, b) => {
      const sa = de(a)!;
      const sb = de(b)!;
      if (sa.destacado !== sb.destacado) return sa.destacado ? -1 : 1;
      return sa.orden - sb.orden || a.orden - b.orden;
    });
}

/** Fotos de la tarjeta de un servicio en Inicio: su imagen propia primero y, detrás, los pósteres de sus primeros proyectos */
export function imagenesDe(servicio: Servicio, proyectos: Proyecto[], cuantas = 4): string[] {
  const urls = proyectosDe(proyectos, servicio.slug).flatMap((p) => (p.poster ? [p.poster.url] : []));
  return [...(servicio.imagen ? [servicio.imagen.url] : []), ...urls].slice(0, cuantas);
}

/** Las fotos de un proyecto como medios (con su punto de interés), para los fotogramas que se recortan */
export function mediosDeProyecto(p: Proyecto): Medio[] {
  return [p.poster, ...p.galeria.map((g) => g.imagen)].filter((m): m is Medio => !!m);
}

/** Las fotos de las tarjetas de un servicio como medios (la de su tarjeta y la del póster de cada proyecto) */
export function mediosDeServicio(servicio: Servicio, proyectos: Proyecto[]): Medio[] {
  const posters = proyectosDe(proyectos, servicio.slug).flatMap((p) => (p.poster ? [p.poster] : []));
  return [...(servicio.imagen ? [servicio.imagen] : []), ...posters];
}

/** Fotos del carrusel de la cabecera de un servicio: solo las que Josep eligió para ella (independientes de la tarjeta). Si no eligió ninguna, las de la tarjeta */
export function fotosCabeceraDe(servicio: Servicio, proyectos: Proyecto[]): string[] {
  return servicio.fotosCabecera.length ? servicio.fotosCabecera.map((m) => m.url) : imagenesDe(servicio, proyectos);
}

/** Fotogramas de un proyecto para las tarjetas: el póster primero (es la foto que Josep eligió para la tarjeta) y, detrás, el resto de la galería */
export function fotogramas(p: Proyecto, cuantas = 4): string[] {
  const g = p.galeria.map((x) => x.imagen.url);
  const todas = p.poster ? [p.poster.url, ...g.filter((u) => u !== p.poster!.url)] : g;
  return (todas.length > 1 ? todas : p.poster ? [p.poster.url] : g).slice(0, cuantas);
}

/** El premio que se enseña en la tarjeta (laurel): el primero de la lista */
export const laurel = (p: Proyecto) => p.premios[0] ?? null;

/** Fecha AAAA-MM-DD → «13 may 2025» */
export function fechaCorta(iso: string) {
  const [a, m, d] = iso.split("-").map(Number);
  if (!a || !m || !d) return iso;
  return new Date(Date.UTC(a, m - 1, d)).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).replace(".", "");
}

/** Todos los tipos en los que sale un proyecto: el suyo y sus categorías extra */
export function tiposDe(p: Proyecto): string[] {
  return [...(p.tipo ? [p.tipo.slug] : []), ...p.categoriasExtra];
}
