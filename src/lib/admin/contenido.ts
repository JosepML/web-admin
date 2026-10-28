"use server";

// Acciones del panel y del editor sobre las tablas con borrador y publicado (proyectos, páginas, servicios,
// artículos, clientes, opiniones y canales). Siguen el contrato de plan/esquema.md («Cómo se usa desde la app»):
// lo que Josep escribe se autoguarda en `borradores` y solo llega a la web al pulsar Publicar.
//
// Las acciones nunca lanzan errores hacia el navegador (en producción Next los cambia por un mensaje genérico):
// devuelven { error } con un texto que Josep entiende.

import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidarContenido } from "@/lib/datos/revalidar";
import type { NombreTabla } from "@/lib/datos/cliente";
import { exigirAdmin } from "./sesion";
import { TABLAS_CONTENIDO, type Resultado, type TablaContenido } from "./tipos";

type Generica = Record<string, unknown>;

/** Cliente sin tipos estrictos: las acciones son genéricas por tabla (la RLS y los triggers validan en la base) */
async function db(): Promise<SupabaseClient> {
  return (await exigirAdmin()) as unknown as SupabaseClient;
}

function comprobarTabla(tabla: string): asserts tabla is TablaContenido {
  if (!TABLAS_CONTENIDO.includes(tabla as TablaContenido)) throw new Error(`Tabla no editable: ${tabla}`);
}

/** Tablas de la caché que cambian al publicar en `tabla` */
function afectadas(tabla: TablaContenido): NombreTabla[] {
  if (tabla === "paginas") return ["paginas", "bloques"];
  if (tabla === "proyectos") return ["proyectos", "proyecto_servicios"];
  return [tabla];
}

/** Envuelve una acción: errores de la base → { error } legible */
async function intentar<T>(fn: () => Promise<T>): Promise<Resultado<T>> {
  try {
    return { ok: true, datos: await fn() };
  } catch (e) {
    return { ok: false, error: traducirError(e) };
  }
}

function traducirError(e: unknown): string {
  const m = e instanceof Error ? e.message : typeof e === "object" && e && "message" in e ? String((e as { message: unknown }).message) : String(e);
  if (/duplicate key.*slug/i.test(m)) return "Ya hay otro con esa dirección (slug). Cambia el slug.";
  if (/proyectos_youtube_id_check|youtube_id/i.test(m)) return "El vídeo de YouTube no es válido: pega el enlace completo o el id de 11 caracteres.";
  if (/slug_check|_slug/i.test(m) && /check/i.test(m)) return "La dirección (slug) solo admite minúsculas, números y guiones.";
  if (/anio/i.test(m) && /check/i.test(m)) return "El año tiene que estar entre 1990 y 2100.";
  if (/JWT|sesión ha caducado|not authenticated/i.test(m)) return "Tu sesión ha caducado. Vuelve a entrar.";
  if (/fetch failed|ECONNREFUSED|ENOTFOUND/i.test(m)) return "No hay conexión con la base de datos. Revisa internet y vuelve a probar.";
  return m;
}

const lanzar = (error: { message: string } | null) => {
  if (error) throw new Error(error.message);
};

// ---- Leer -----------------------------------------------------------------------------------------

export type ParaEditar = {
  fila: Generica;
  /** Lo autoguardado sin publicar (solo los campos cambiados; las listas, completas). null si no hay cambios */
  borrador: Generica | null;
  /** Lo publicado que no vive en la fila: servicios de un proyecto, bloques de una página */
  extras: Generica;
  actualizadoEn: string | null;
};

/** Una fila con su borrador y sus extras, para abrir el formulario o el editor */
export async function cargarParaEditar(tabla: TablaContenido, id: string): Promise<Resultado<ParaEditar>> {
  return intentar(async () => {
    comprobarTabla(tabla);
    const s = await db();
    const [{ data: fila, error }, { data: b }] = await Promise.all([
      s.from(tabla).select("*").eq("id", id).single(),
      s.from("borradores").select("datos, actualizado_en").eq("tabla", tabla).eq("fila_id", id).maybeSingle(),
    ]);
    lanzar(error);
    const extras: Generica = {};
    if (tabla === "proyectos") {
      const { data } = await s.from("proyecto_servicios").select("servicio_id, orden").eq("proyecto_id", id).order("servicio_id");
      extras.servicios = (data ?? []).map((x) => x.servicio_id);
    }
    if (tabla === "paginas") {
      const { data } = await s.from("bloques").select("id, tipo, visible, datos, orden").eq("pagina_id", id).order("orden");
      extras.bloques = (data ?? []).map(({ id, tipo, visible, datos }) => ({ id, tipo, visible, datos }));
    }
    return { fila: fila as Generica, borrador: (b?.datos as Generica) ?? null, extras, actualizadoEn: (b?.actualizado_en as string) ?? null };
  });
}

export type FilaLista = Generica & { id: string; hayBorrador: boolean; borrador: Generica | null };

/** Todas las filas de una tabla (también las ocultas y las nuevas), en su orden, marcando las que tienen cambios */
export async function listar(tabla: TablaContenido): Promise<Resultado<FilaLista[]>> {
  return intentar(async () => {
    comprobarTabla(tabla);
    const s = await db();
    const conOrden = tabla !== "articulos" && tabla !== "paginas";
    const consulta = s.from(tabla).select("*");
    const [{ data, error }, { data: bs }] = await Promise.all([
      conOrden ? consulta.order("orden") : tabla === "articulos" ? consulta.order("fecha", { ascending: false }) : consulta.order("creado_en", { ascending: false }),
      s.from("borradores").select("fila_id, datos").eq("tabla", tabla),
    ]);
    lanzar(error);
    const cambios = new Map((bs ?? []).map((b) => [b.fila_id as string, b.datos as Generica]));
    return (data ?? []).map((f) => ({ ...(f as Generica), id: f.id as string, hayBorrador: cambios.has(f.id), borrador: cambios.get(f.id) ?? null }));
  });
}

// ---- Borrador, publicar y descartar ---------------------------------------------------------------

/** Autoguardado: sustituye el borrador entero (el editor manda todos los campos cambiados desde lo publicado) */
export async function guardarBorrador(tabla: TablaContenido, id: string, datos: Generica): Promise<Resultado<{ guardadoEn: string }>> {
  return intentar(async () => {
    comprobarTabla(tabla);
    const s = await db();
    if (!Object.keys(datos).length) {
      // Sin cambios respecto a lo publicado: el borrador sobra
      lanzar((await s.rpc("descartar", { p_tabla: tabla, p_id: id })).error);
    } else {
      const { error } = await s.from("borradores").upsert({ tabla, fila_id: id, datos }, { onConflict: "tabla,fila_id" });
      lanzar(error);
    }
    return { guardadoEn: new Date().toISOString() };
  });
}

/** Publica el borrador (y la fila, si era nueva) y vacía la caché de la web para que se vea al momento */
export async function publicar(tabla: TablaContenido, id: string): Promise<Resultado<null>> {
  return intentar(async () => {
    comprobarTabla(tabla);
    const s = await db();
    lanzar((await s.rpc("publicar", { p_tabla: tabla, p_id: id })).error);
    await revalidarContenido(afectadas(tabla));
    return null;
  });
}

/** Tira los cambios sin publicar: vuelve a lo que se ve en la web */
export async function descartar(tabla: TablaContenido, id: string): Promise<Resultado<null>> {
  return intentar(async () => {
    comprobarTabla(tabla);
    lanzar((await (await db()).rpc("descartar", { p_tabla: tabla, p_id: id })).error);
    return null;
  });
}

// ---- Acciones de lista (al instante, sin borrador) ------------------------------------------------

/** Crea una fila nueva sin publicar. `valores`: lo mínimo (slug, título...). Devuelve su id. */
export async function crear(tabla: TablaContenido, valores: Generica): Promise<Resultado<{ id: string }>> {
  return intentar(async () => {
    comprobarTabla(tabla);
    const s = await db();
    let orden: number | undefined;
    if (tabla !== "articulos" && tabla !== "paginas") {
      // Las nuevas, primero: así Josep la ve arriba en la lista y en Trabajos
      const { data } = await s.from(tabla).select("orden").order("orden").limit(1);
      orden = ((data?.[0]?.orden as number | undefined) ?? 1) - 1;
    }
    const { data, error } = await s
      .from(tabla)
      .insert({ ...valores, estado: "borrador", ...(orden !== undefined ? { orden } : {}) })
      .select("id")
      .single();
    lanzar(error);
    await revalidarContenido(afectadas(tabla));
    return { id: data!.id as string };
  });
}

/** Columnas que no se copian al duplicar (las pone la base o son únicas) */
const NO_COPIAR = new Set(["id", "grupo", "estado", "publicado_en", "creado_en", "actualizado_en", "id_antiguo", "destacado_orden"]);

/** Copia una fila (con sus cambios sin publicar) como nueva y sin publicar. Devuelve el id de la copia. */
export async function duplicar(tabla: TablaContenido, id: string): Promise<Resultado<{ id: string }>> {
  return intentar(async () => {
    comprobarTabla(tabla);
    const s = await db();
    const r = await cargarParaEditar(tabla, id);
    if (!r.ok) throw new Error(r.error);
    const { fila, borrador, extras } = r.datos;
    const todo: Generica = { ...fila, ...(borrador ?? {}) };
    const copia = Object.fromEntries(Object.entries(todo).filter(([k]) => !NO_COPIAR.has(k) && k in fila));
    if ("slug" in fila) {
      const base = String(copia.slug ?? "copia").replace(/-copia(-\d+)?$/, "");
      copia.slug = await slugLibre(s, tabla, `${base}-copia`);
    }
    if (typeof copia.titulo === "string") copia.titulo = `${copia.titulo} (copia)`;
    if (typeof copia.nombre === "string" && tabla !== "clientes") copia.nombre = `${copia.nombre} (copia)`;
    copia.orden = typeof fila.orden === "number" ? fila.orden : undefined;
    const { data, error } = await s.from(tabla).insert({ ...copia, estado: "borrador" }).select("id").single();
    lanzar(error);
    const nuevo = data!.id as string;
    // Lo que no vive en la fila viaja en el borrador de la copia (los bloques, con ids nuevos)
    const servicios = (borrador?.servicios ?? extras.servicios) as unknown;
    const bloques = (borrador?.bloques ?? extras.bloques) as Generica[] | undefined;
    const extrasCopia: Generica = {};
    if (tabla === "proyectos" && Array.isArray(servicios)) extrasCopia.servicios = servicios;
    if (tabla === "paginas" && Array.isArray(bloques)) extrasCopia.bloques = bloques.map((b) => ({ ...b, id: crypto.randomUUID() }));
    if (Object.keys(extrasCopia).length) {
      lanzar((await s.from("borradores").insert({ tabla, fila_id: nuevo, datos: extrasCopia })).error);
    }
    await revalidarContenido(afectadas(tabla));
    return { id: nuevo };
  });
}

async function slugLibre(s: SupabaseClient, tabla: TablaContenido, deseado: string) {
  const { data } = await s.from(tabla).select("slug").like("slug", `${deseado}%`);
  const usados = new Set((data ?? []).map((x) => x.slug as string));
  if (!usados.has(deseado)) return deseado;
  for (let n = 2; ; n++) if (!usados.has(`${deseado}-${n}`)) return `${deseado}-${n}`;
}

/** Ocultar (vuelve a borrador: deja de verse en la web) o volver a mostrar algo que ya se publicó */
export async function cambiarVisible(tabla: TablaContenido, id: string, visible: boolean): Promise<Resultado<null>> {
  return intentar(async () => {
    comprobarTabla(tabla);
    const s = await db();
    if (visible) {
      const { data } = await s.from(tabla).select("publicado_en").eq("id", id).single();
      // Algo que nunca se ha publicado se muestra publicándolo (con su borrador)
      if (!data?.publicado_en) {
        lanzar((await s.rpc("publicar", { p_tabla: tabla, p_id: id })).error);
        await revalidarContenido(afectadas(tabla));
        return null;
      }
    }
    lanzar((await s.from(tabla).update({ estado: visible ? "publicado" : "borrador" }).eq("id", id)).error);
    await revalidarContenido(afectadas(tabla));
    return null;
  });
}

/** Nuevo orden de una lista (los ids en el orden que se ven) */
export async function reordenar(tabla: TablaContenido, ids: string[]): Promise<Resultado<null>> {
  return intentar(async () => {
    comprobarTabla(tabla);
    const s = await db();
    const resultados = await Promise.all(ids.map((id, orden) => s.from(tabla).update({ orden }).eq("id", id)));
    lanzar(resultados.find((r) => r.error)?.error ?? null);
    await revalidarContenido(afectadas(tabla));
    return null;
  });
}

/**
 * Orden de los proyectos dentro de un servicio (Filmmaker, Dirección de fotografía, Edición), de primero a último.
 * Es el orden real de esa página y de su filtro en Trabajos: el listado manda, así que se quita lo «destacado»
 * por servicio (que hasta ahora ponía unos delante de otros).
 */
export async function ordenarPorServicio(servicioId: string, proyectoIds: string[]): Promise<Resultado<null>> {
  return intentar(async () => {
    const s = await db();
    const resultados = await Promise.all(
      proyectoIds.map((id, i) => s.from("proyecto_servicios").update({ orden: i + 1, destacado: false }).eq("servicio_id", servicioId).eq("proyecto_id", id)),
    );
    lanzar(resultados.find((r) => r.error)?.error ?? null);
    await revalidarContenido(["proyectos", "proyecto_servicios"]);
    return null;
  });
}

/** Campos que se cambian al momento desde la lista, sin pasar por el borrador */
const AL_INSTANTE: Partial<Record<TablaContenido, string[]>> = { proyectos: ["destacado_orden"] };

export async function cambiarAlInstante(tabla: TablaContenido, cambios: { id: string; campo: string; valor: unknown }[]): Promise<Resultado<null>> {
  return intentar(async () => {
    comprobarTabla(tabla);
    if (cambios.some((c) => !AL_INSTANTE[tabla]?.includes(c.campo))) throw new Error("Ese campo se cambia desde el formulario");
    const s = await db();
    const resultados = await Promise.all(cambios.map((c) => s.from(tabla).update({ [c.campo]: c.valor }).eq("id", c.id)));
    lanzar(resultados.find((r) => r.error)?.error ?? null);
    await revalidarContenido(afectadas(tabla));
    return null;
  });
}

/** Borra para siempre. Solo lo que no se ve en la web (nuevo u oculto), para que no haya sustos. */
export async function borrar(tabla: TablaContenido, id: string): Promise<Resultado<null>> {
  return intentar(async () => {
    comprobarTabla(tabla);
    const s = await db();
    const { data } = await s.from(tabla).select("estado").eq("id", id).single();
    if (data?.estado === "publicado") throw new Error("Primero ocúltalo; después ya se puede borrar.");
    lanzar((await s.from(tabla).delete().eq("id", id)).error);
    await revalidarContenido(afectadas(tabla));
    return null;
  });
}

// ---- Historial ------------------------------------------------------------------------------------

export type Revision = { id: string; creadoEn: string; datos: Generica };

/** Versiones publicadas antes (las 30 últimas), de la más reciente a la más antigua */
export async function revisiones(tabla: TablaContenido, id: string): Promise<Resultado<Revision[]>> {
  return intentar(async () => {
    comprobarTabla(tabla);
    const { data, error } = await (await db())
      .from("revisiones")
      .select("id, creado_en, datos")
      .eq("tabla", tabla)
      .eq("fila_id", id)
      .order("creado_en", { ascending: false });
    lanzar(error);
    return (data ?? []).map((r) => ({ id: r.id as string, creadoEn: r.creado_en as string, datos: r.datos as Generica }));
  });
}

/** Lleva una versión anterior al borrador (sin publicar: Josep la revisa y publica) */
export async function restaurar(revision: string): Promise<Resultado<null>> {
  return intentar(async () => {
    lanzar((await (await db()).rpc("restaurar_revision", { p_revision: revision })).error);
    return null;
  });
}
