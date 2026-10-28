import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PaginaRecreaciones } from "@/components/recreaciones/PaginaRecreaciones";
import { getPagina } from "@/lib/datos/paginas";
import { medio } from "@/lib/datos/medios";
import type { Medio } from "@/lib/datos/tipos";
import { lista, objeto, texto, textos } from "@/lib/datos/util";
import { getPaginaConDatos } from "@/lib/datos/web";

// Datos de la caché en cada visita (ver src/app/(web)/page.tsx)

/**
 * Una comparación: `{ original: { medio, recorte? }, recreacion: { medio, recorte? }, tamano? }`. `recorte` es
 * `[x, y, ancho, alto]` en píxeles de una imagen de `tamano` `[ancho, alto]`: sirve para usar una imagen que
 * ya trae el original y la recreación juntos. Sin las dos imágenes no hay deslizador (la ficha enseña el vídeo).
 */
function comparacion(c: Record<string, unknown>, medios: Record<string, Medio>) {
  const [W, H] = lista<number>(c.tamano);
  const lado = (v: unknown) => {
    const o = objeto(v);
    const imagen = medio(medios, o.medio);
    const [x, y, ancho, alto] = lista<number>(o.recorte);
    const recorte = W && H && ancho && alto ? { x: x / W, y: y / H, ancho: ancho / W, alto: alto / H } : null;
    return imagen ? { imagen, recorte } : null;
  };
  const antes = lado(c.original);
  const despues = lado(c.recreacion);
  if (!antes || !despues) return null;
  const r = objeto(c.recreacion);
  const [, , ancho, alto] = lista<number>(r.recorte);
  const formato = ancho && alto ? ancho / alto : despues.imagen.ancho && despues.imagen.alto ? despues.imagen.ancho / despues.imagen.alto : 16 / 9;
  return { antes, despues, formato };
}

/**
 * La página «recreaciones» (supabase/datos/07-recreaciones.sql) da la cabecera, el SEO, las etiquetas del
 * deslizador, el orden, la pareja original/recreación de cada una y el título de la llamada. Las
 * recreaciones son los proyectos de tipo «recreacion».
 */
async function cargar() {
  const [r, inicio] = await Promise.all([getPaginaConDatos("recreaciones"), getPagina("inicio")]);
  if (!r) return null;
  const d = r.pagina.bloques[0]?.datos ?? {};
  const orden = textos(d.orden);
  const posicion = (slug: string) => (orden.includes(slug) ? orden.indexOf(slug) : orden.length);
  const comparaciones = objeto(d.comparaciones);
  const recreaciones = r.datos.proyectos
    .filter((p) => p.tipo?.slug === "recreacion")
    .sort((a, b) => posicion(a.slug) - posicion(b.slug) || a.orden - b.orden)
    .map((proyecto) => ({ proyecto, comparacion: comparacion(objeto(comparaciones[proyecto.slug]), r.datos.medios) }));
  const deInicio = inicio?.bloques.find((b) => b.tipo === "llamada")?.datos ?? {};
  return {
    ...r,
    cabecera: { antetitulo: texto(d.antetitulo), titulo: texto(d.titulo) || r.pagina.titulo, texto: texto(d.texto) },
    etiquetas: { antes: texto(d.etiquetaAntes) || "Original", despues: texto(d.etiquetaDespues) || "Mi recreación" },
    llamada: { id: "llamada", tipo: "llamada" as const, datos: { ...deInicio, ...(texto(d.llamada) ? { titulo: texto(d.llamada) } : {}) } },
    recreaciones,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const r = await cargar();
  if (!r) return {};
  return { title: r.pagina.seo.titulo ? { absolute: r.pagina.seo.titulo } : r.pagina.titulo, description: r.pagina.seo.descripcion || r.cabecera.texto };
}

export default async function Recreaciones() {
  const r = await cargar();
  if (!r) notFound();
  return <PaginaRecreaciones cabecera={r.cabecera} recreaciones={r.recreaciones} etiquetas={r.etiquetas} llamada={r.llamada} datos={r.datos} />;
}
