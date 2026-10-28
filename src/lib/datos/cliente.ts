// Lectura de la base de datos para la web pública estática. Solo en el build.
//
// - Cliente de Supabase con la clave pública y SIN sesión: la web pública ve exactamente lo que ve un
//   visitante (la RLS ya filtra lo publicado).
// - En export estático, cada tabla se lee durante la generación de páginas.

import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import type { Database } from "@/lib/supabase/tipos";
export { urlBucket } from "./url";

export type NombreTabla = keyof Database["public"]["Tables"];
export type Fila<T extends NombreTabla> = Database["public"]["Tables"][T]["Row"];

/** Etiqueta de caché de todo el contenido */
export const ETIQUETA_CONTENIDO = "contenido";
/** Etiqueta de caché de una tabla */
export const etiquetaTabla = (tabla: NombreTabla) => `tabla:${tabla}`;

export const REVALIDAR = 60;

// Tablas con borrador y publicado: la RLS ya lo filtra, pero se pide explícitamente para que el resultado
// no dependa de quién lea (y para que el archivo de prueba se comporte igual)
const CON_ESTADO = new Set<NombreTabla>(["servicios", "proyectos", "articulos", "paginas", "clientes", "opiniones", "canales"]);

let supabase: ReturnType<typeof createClient<Database>> | null = null;

function cliente() {
  supabase ??= createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return supabase;
}

async function leer<T extends NombreTabla>(tabla: T): Promise<Fila<T>[]> {
  const prueba = process.env.JM_DATOS_PRUEBA;
  if (prueba) {
    const todo = JSON.parse(await readFile(prueba, "utf8")) as Record<string, Record<string, unknown>[]>;
    const lista = todo[tabla] ?? [];
    return (CON_ESTADO.has(tabla) ? lista.filter((f) => f.estado === "publicado") : lista) as Fila<T>[];
  }
  const consulta = cliente().from(tabla).select("*");
  const { data, error } = await (CON_ESTADO.has(tabla) ? consulta.eq("estado" as never, "publicado" as never) : consulta);
  if (error) throw new Error(`No se pudo leer «${tabla}» de la base de datos: ${error.message}`);
  return (data ?? []) as unknown as Fila<T>[];
}

/** Todas las filas visibles para el público de una tabla. */
export async function filas<T extends NombreTabla>(tabla: T): Promise<Fila<T>[]> {
  return leer(tabla);
}

/** En la web pública estática no hay vista previa con sesión. */
export const enVistaPrevia = async () => false;
