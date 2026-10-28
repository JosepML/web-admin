import { filas, urlBucket, type Fila } from "./cliente";
import type { Medio } from "./tipos";

function aMedio(f: Fila<"medios">, todas: Fila<"medios">[]): Medio | null {
  const url = f.ruta ? urlBucket(f.ruta) : f.url_origen;
  if (!url) return null;
  let fx = f.foco_x;
  let fy = f.foco_y;
  // Si una foto está duplicada en la biblioteca (por ejemplo, subida en dos carpetas) y el punto de interés
  // se marcó en la otra copia, lo hereda para que ambas recorten igual en la web.
  if (fx == null || fy == null) {
    const gemelo = todas.find(
      (o) =>
        o.id !== f.id &&
        o.foco_x != null &&
        o.foco_y != null &&
        ((f.url_origen && o.url_origen === f.url_origen) ||
          (f.bytes && o.bytes === f.bytes) ||
          (f.ancho && f.alto && o.ancho === f.ancho && o.alto === f.alto && todas.filter((x) => x.ancho === f.ancho && x.alto === f.alto).length === 2)),
    );
    if (gemelo) {
      fx = gemelo.foco_x;
      fy = gemelo.foco_y;
    }
  }
  const foco = fx != null && fy != null ? { x: fx, y: fy } : null;
  return { id: f.id, url, tipo: f.tipo, alt: f.texto_alternativo, ancho: f.ancho, alto: f.alto, foco };
}

/** Biblioteca de medios por id, con la URL resuelta (bucket si ya está subido; si no, la URL de origen) */
export async function getMedios(): Promise<Record<string, Medio>> {
  const todas = await filas("medios");
  const lista: Record<string, Medio> = {};
  for (const f of todas) {
    const m = aMedio(f, todas);
    if (m) lista[f.id] = m;
  }
  return lista;
}

/** Busca un medio por id; null si no hay id o no existe */
export function medio(medios: Record<string, Medio>, id: unknown): Medio | null {
  return typeof id === "string" && id ? (medios[id] ?? null) : null;
}

/** Lista `[{ medio, pie }]` de la base de datos → imágenes con pie (las que no existen se descartan) */
export function listaMedios(medios: Record<string, Medio>, lista: unknown) {
  if (!Array.isArray(lista)) return [];
  return lista.flatMap((e) => {
    const m = medio(medios, (e as { medio?: unknown })?.medio);
    return m ? [{ imagen: m, pie: String((e as { pie?: unknown }).pie ?? "") }] : [];
  });
}
