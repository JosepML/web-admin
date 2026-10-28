"use server";

import type { Medio } from "@/lib/datos/tipos";
import { revalidarContenido } from "@/lib/datos/revalidar";
import { urlBucket } from "@/lib/datos/url";
import { exigirAdmin } from "./sesion";
import type { Resultado } from "./tipos";

export type MedioBiblioteca = Medio & { titulo: string; creadoEn: string; bytes: number | null; mime: string; carpetaId: string | null };

/** Carpeta de la biblioteca: agrupa archivos (una por proyecto, por ejemplo) */
export type Carpeta = { id: string; nombre: string };

type FilaMedio = {
  id: string;
  ruta: string | null;
  url_origen: string | null;
  tipo: Medio["tipo"];
  texto_alternativo: string;
  titulo: string;
  ancho: number | null;
  alto: number | null;
  foco_x: number | null;
  foco_y: number | null;
  bytes: number | null;
  carpeta_id: string | null;
  mime: string;
  creado_en: string;
};

function aMedio(f: FilaMedio): MedioBiblioteca {
  return {
    id: f.id,
    url: f.ruta ? urlBucket(f.ruta) : (f.url_origen ?? ""),
    tipo: f.tipo,
    alt: f.texto_alternativo,
    ancho: f.ancho,
    alto: f.alto,
    foco: f.foco_x != null && f.foco_y != null ? { x: f.foco_x, y: f.foco_y } : null,
    titulo: f.titulo,
    creadoEn: f.creado_en,
    bytes: f.bytes,
    mime: f.mime,
    carpetaId: f.carpeta_id,
  };
}

const mensaje = (e: unknown) => (e instanceof Error ? e.message : String(e));

/** Toda la biblioteca, lo último primero (para el selector de imágenes) */
export async function listarMedios(): Promise<Resultado<MedioBiblioteca[]>> {
  try {
    const s = await exigirAdmin();
    const { data, error } = await s.from("medios").select("*").order("creado_en", { ascending: false });
    if (error) throw new Error(error.message);
    return { ok: true, datos: (data as FilaMedio[]).map(aMedio) };
  } catch (e) {
    return { ok: false, error: mensaje(e) };
  }
}

/** Medios por id (el editor los necesita para pintar lo que se acaba de elegir) */
export async function mediosPorId(ids: string[]): Promise<Resultado<Record<string, MedioBiblioteca>>> {
  try {
    if (!ids.length) return { ok: true, datos: {} };
    const s = await exigirAdmin();
    const { data, error } = await s.from("medios").select("*").in("id", ids);
    if (error) throw new Error(error.message);
    return { ok: true, datos: Object.fromEntries((data as FilaMedio[]).map((f) => [f.id, aMedio(f)])) };
  } catch (e) {
    return { ok: false, error: mensaje(e) };
  }
}

export type DatosSubida = {
  ruta: string;
  tipo: Medio["tipo"];
  mime: string;
  bytes: number;
  ancho: number | null;
  alto: number | null;
  duracion: number | null;
  titulo: string;
  /** Punto de interés elegido al subir (vacío = centro) */
  foco?: { x: number; y: number } | null;
};

/** Da de alta en la biblioteca un archivo que el navegador acaba de subir al bucket */
export async function registrarMedio(d: DatosSubida): Promise<Resultado<MedioBiblioteca>> {
  try {
    const s = await exigirAdmin();
    const { data, error } = await s
      .from("medios")
      .insert({ ruta: d.ruta, tipo: d.tipo, mime: d.mime, bytes: d.bytes, ancho: d.ancho, alto: d.alto, duracion: d.duracion, titulo: d.titulo, foco_x: d.foco?.x ?? null, foco_y: d.foco?.y ?? null })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    // La web lee la biblioteca desde la caché: sin esto, lo recién subido no se vería al publicar
    await revalidarContenido(["medios"]);
    return { ok: true, datos: aMedio(data as FilaMedio) };
  } catch (e) {
    return { ok: false, error: mensaje(e) };
  }
}

/** Texto alternativo (lo que lee un lector de pantalla y Google) */
export async function cambiarTextoAlternativo(id: string, texto: string): Promise<Resultado<null>> {
  try {
    const s = await exigirAdmin();
    const { error } = await s.from("medios").update({ texto_alternativo: texto }).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true, datos: null };
  } catch (e) {
    return { ok: false, error: mensaje(e) };
  }
}

/** Punto de interés de una foto (% desde la izquierda y desde arriba), o null para volver al centro */
export async function cambiarFoco(id: string, foco: { x: number; y: number } | null): Promise<Resultado<null>> {
  try {
    const s = await exigirAdmin();
    const x = foco ? Math.round(Math.min(100, Math.max(0, foco.x)) * 10) / 10 : null;
    const y = foco ? Math.round(Math.min(100, Math.max(0, foco.y)) * 10) / 10 : null;
    const { data: actual, error } = await s.from("medios").update({ foco_x: x, foco_y: y }).eq("id", id).select("ancho, alto, bytes, url_origen").single();
    if (error) throw new Error(error.message);
    // Si la misma foto existe duplicada en otra carpeta de la biblioteca, sincroniza también su punto de interés
    if (actual?.ancho && actual?.alto) {
      const { data: iguales } = await s.from("medios").select("id").eq("ancho", actual.ancho).eq("alto", actual.alto);
      if (iguales && iguales.length === 2) {
        await s.from("medios").update({ foco_x: x, foco_y: y }).in("id", iguales.map((m) => m.id));
      }
    }
    await revalidarContenido(["medios"]);
    return { ok: true, datos: null };
  } catch (e) {
    return { ok: false, error: mensaje(e) };
  }
}

/** Título y texto alternativo de un archivo de la biblioteca */
export async function cambiarMedio(id: string, cambios: { titulo?: string; texto_alternativo?: string }): Promise<Resultado<null>> {
  try {
    const s = await exigirAdmin();
    const { error } = await s.from("medios").update(cambios).eq("id", id);
    if (error) throw new Error(error.message);
    await revalidarContenido(["medios"]);
    return { ok: true, datos: null };
  } catch (e) {
    return { ok: false, error: mensaje(e) };
  }
}

export type Uso = { donde: string; href: string };

const UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
const idsEn = (v: unknown) => new Set((JSON.stringify(v ?? null).match(UUID) ?? []).map((x) => x.toLowerCase()));

/**
 * Dónde se usa cada archivo: fichas, artículos, servicios, clientes, páginas y cambios sin publicar.
 * Se calcula buscando su id en todo el contenido (las galerías y los bloques los guardan dentro de jsonb).
 */
export async function usosDeMedios(): Promise<Resultado<Record<string, Uso[]>>> {
  try {
    const s = await exigirAdmin();
    const [proyectos, articulos, servicios, clientes, paginas, bloques, borradores] = await Promise.all([
      s.from("proyectos").select("id, titulo, imagen_id, clip_id, video_portada_id, galeria, detras_de_camaras, videos"),
      s.from("articulos").select("id, titulo, imagen_id, contenido"),
      s.from("servicios").select("id, nombre, imagen_id"),
      s.from("clientes").select("id, nombre, logo_id"),
      s.from("paginas").select("id, slug, titulo, imagen_id"),
      s.from("bloques").select("pagina_id, datos"),
      s.from("borradores").select("tabla, fila_id, datos"),
    ]);
    const error = [proyectos, articulos, servicios, clientes, paginas, bloques, borradores].find((r) => r.error)?.error;
    if (error) throw new Error(error.message);

    const usos: Record<string, Uso[]> = {};
    const anotar = (fila: unknown, uso: Uso) => {
      for (const id of idsEn(fila)) {
        const lista = (usos[id] ??= []);
        if (!lista.some((u) => u.href === uso.href && u.donde === uso.donde)) lista.push(uso);
      }
    };
    const rutaPagina = (slug: string) => `${slug === "inicio" ? "/" : `/${slug}`}?editar=1`;
    const nombres: Record<string, Record<string, Uso>> = { proyectos: {}, articulos: {}, servicios: {}, clientes: {}, paginas: {} };

    for (const { id, ...f } of proyectos.data ?? []) anotar(f, (nombres.proyectos[id] = { donde: `Proyecto «${f.titulo}»`, href: `/admin/proyectos/${id}` }));
    for (const { id, ...f } of articulos.data ?? []) anotar(f, (nombres.articulos[id] = { donde: `Artículo «${f.titulo}»`, href: `/admin/articulos/${id}` }));
    for (const { id, ...f } of servicios.data ?? []) anotar(f, (nombres.servicios[id] = { donde: `Servicio «${f.nombre}»`, href: `/admin/servicios/${id}` }));
    for (const { id, ...f } of clientes.data ?? []) anotar(f, (nombres.clientes[id] = { donde: `Cliente «${f.nombre}»`, href: `/admin/clientes/${id}` }));
    for (const { id, ...f } of paginas.data ?? []) {
      nombres.paginas[id] = { donde: `Página «${f.titulo || f.slug}»`, href: rutaPagina(f.slug) };
      if (f.imagen_id) anotar(f.imagen_id, nombres.paginas[id]);
    }
    for (const b of bloques.data ?? []) if (nombres.paginas[b.pagina_id]) anotar(b.datos, nombres.paginas[b.pagina_id]);
    for (const b of borradores.data ?? []) {
      const de = nombres[b.tabla]?.[b.fila_id];
      if (de) anotar(b.datos, { donde: `${de.donde} (sin publicar)`, href: de.href });
    }
    return { ok: true, datos: usos };
  } catch (e) {
    return { ok: false, error: mensaje(e) };
  }
}

/** Carpetas de la biblioteca, por nombre */
export async function listarCarpetas(): Promise<Resultado<Carpeta[]>> {
  try {
    const s = await exigirAdmin();
    const { data, error } = await s.from("carpetas").select("id, nombre").order("nombre");
    if (error) throw new Error(error.message);
    return { ok: true, datos: data ?? [] };
  } catch (e) {
    return { ok: false, error: mensaje(e) };
  }
}

/** Crea una carpeta vacía */
export async function crearCarpeta(nombre: string): Promise<Resultado<Carpeta>> {
  try {
    const limpio = nombre.trim().slice(0, 120);
    if (!limpio) throw new Error("La carpeta necesita un nombre.");
    const s = await exigirAdmin();
    const { data, error } = await s.from("carpetas").insert({ nombre: limpio }).select("id, nombre").single();
    if (error) throw new Error(error.message);
    return { ok: true, datos: data };
  } catch (e) {
    return { ok: false, error: mensaje(e) };
  }
}

/** Cambia el nombre de una carpeta */
export async function renombrarCarpeta(id: string, nombre: string): Promise<Resultado<null>> {
  try {
    const limpio = nombre.trim().slice(0, 120);
    if (!limpio) throw new Error("La carpeta necesita un nombre.");
    const s = await exigirAdmin();
    const { error } = await s.from("carpetas").update({ nombre: limpio }).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true, datos: null };
  } catch (e) {
    return { ok: false, error: mensaje(e) };
  }
}

/** Borra una carpeta. Sus archivos no se borran: se quedan sin carpeta. */
export async function borrarCarpeta(id: string): Promise<Resultado<null>> {
  try {
    const s = await exigirAdmin();
    const { error } = await s.from("carpetas").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true, datos: null };
  } catch (e) {
    return { ok: false, error: mensaje(e) };
  }
}

/** Mete uno o varios archivos en una carpeta, o los saca de la suya (null) */
export async function moverMedios(ids: string[], carpetaId: string | null): Promise<Resultado<null>> {
  try {
    if (!ids.length) return { ok: true, datos: null };
    const s = await exigirAdmin();
    const { error } = await s.from("medios").update({ carpeta_id: carpetaId }).in("id", ids);
    if (error) throw new Error(error.message);
    return { ok: true, datos: null };
  } catch (e) {
    return { ok: false, error: mensaje(e) };
  }
}

/** Borra un archivo de la biblioteca y del almacenamiento. La base no deja si se usa en algún sitio. */
export async function borrarMedio(id: string): Promise<Resultado<null>> {
  try {
    const s = await exigirAdmin();
    const { data: fila } = await s.from("medios").select("ruta").eq("id", id).single();
    const { error } = await s.from("medios").delete().eq("id", id);
    if (error) {
      if (error.code === "23503") throw new Error("Este archivo es la imagen principal de algo (un proyecto, un artículo, un servicio o un cliente). Quítalo de ahí antes de borrarlo.");
      throw new Error(error.message);
    }
    // El archivo, después: si esto fallara, solo queda un archivo huérfano en el almacenamiento
    if (fila?.ruta) await s.storage.from("medios").remove([fila.ruta]);
    await revalidarContenido(["medios"]);
    return { ok: true, datos: null };
  } catch (e) {
    return { ok: false, error: mensaje(e) };
  }
}
