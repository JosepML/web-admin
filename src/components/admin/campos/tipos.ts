// Descripción de los campos de un formulario: el editor de la web (bloques) y el panel (proyectos, y lo que
// añadan las tareas S14 a S16) pintan sus formularios a partir de estas listas con <Campos>.

export type Opcion = { valor: string; nombre: string };

type Base = {
  /** Nombre del campo en los datos. En `lista` y `grupo`, la clave del subobjeto */
  clave: string;
  etiqueta: string;
  ayuda?: string;
  /** Ocupa media fila en pantallas anchas (dos campos cortos lado a lado) */
  medio?: boolean;
  /** Solo se enseña cuando otro campo del mismo nivel vale uno de estos valores (las partes de un bloque) */
  si?: { clave: string; valores: string[] };
};

export type Campo =
  | (Base & { tipo: "texto"; placeholder?: string })
  /** Markdown básico: párrafos con línea en blanco, **negrita**, *cursiva* */
  | (Base & { tipo: "largo"; filas?: number; placeholder?: string })
  | (Base & { tipo: "numero"; min?: number; max?: number; paso?: number; placeholder?: string })
  | (Base & { tipo: "interruptor" })
  /** `obligatorio`: sin la opción vacía (columnas que no admiten nada) */
  | (Base & { tipo: "seleccion"; opciones: Opcion[] | "tipos" | "categorias"; vacio?: string; obligatorio?: boolean })
  /** Enlace https. Vacío se guarda como null (las columnas de enlace no admiten texto vacío) */
  | (Base & { tipo: "enlace"; placeholder?: string })
  /** Fecha (AAAA-MM-DD) */
  | (Base & { tipo: "fecha" })
  /** Cuerpo de un artículo: editor visual que guarda el documento { type: "doc", content } */
  | (Base & { tipo: "documento" })
  /** Vista previa de cómo sale en Google. Lee otros campos: no tiene valor propio */
  | (Base & { tipo: "google"; prefijo: string; titulo: string; descripcion: string; respaldoTitulo?: string; respaldoDescripcion?: string })
  /** Varios a la vez (lista de ids): los servicios de un proyecto */
  | (Base & { tipo: "multiple"; opciones: Opcion[] | "servicios" | "tipos" })
  /** Un proyecto (su id) */
  | (Base & { tipo: "proyecto" })
  /** Varios proyectos en el orden que se elija: lista de ids */
  | (Base & { tipo: "proyectos" })
  /** Un archivo de la biblioteca (su id). `acepta`: qué se puede elegir */
  | (Base & { tipo: "medio"; acepta?: "imagen" | "video" | "todo" })
  /** Lista ordenada de imágenes con pie: [{ medio, pie }] */
  | (Base & { tipo: "galeria" })
  /** Enlace o id de YouTube → se guarda el id de 11 caracteres */
  | (Base & { tipo: "youtube" })
  /** Lista de vídeos extra de un proyecto: [{ tipo, id | url | medio, titulo }] */
  | (Base & { tipo: "videos" })
  /** Lista de frases sueltas: ["director de fotografía", ...] */
  | (Base & { tipo: "textos"; placeholder?: string; nuevo?: string; largo?: boolean })
  /** Lista ordenada de objetos con sus campos. `titulo`: clave que da nombre a cada elemento en la lista */
  | (Base & { tipo: "lista"; campos: Campo[]; nuevo: Record<string, unknown>; titulo?: string; elemento?: string })
  /** Objeto con sus campos ({ texto, href }...) */
  | (Base & { tipo: "grupo"; campos: Campo[] })
  /** Dirección en la web: minúsculas, números y guiones. `prefijo`: la ruta que va delante */
  | (Base & { tipo: "slug"; prefijo: string; desde?: string })
  /** Solo texto de ayuda, sin valor (avisos dentro de un formulario) */
  | (Base & { tipo: "nota" });

/** Lo que algunos campos necesitan para sus opciones (se carga una vez por formulario) */
export type OpcionesFormulario = {
  proyectos?: Opcion[];
  servicios?: Opcion[];
  tipos?: Opcion[];
  categorias?: Opcion[];
};

export type Ruta = (string | number)[];

/** Valor en una ruta de un objeto (`["pasos", 0, "titulo"]`) */
export function valorEn(obj: unknown, ruta: Ruta): unknown {
  let v: unknown = obj;
  for (const k of ruta) {
    if (v == null || typeof v !== "object") return undefined;
    v = (v as Record<string | number, unknown>)[k];
  }
  return v;
}

/** Copia del objeto con el valor cambiado en la ruta (sin tocar el original) */
export function conValor<T>(obj: T, ruta: Ruta, valor: unknown): T {
  if (!ruta.length) return valor as T;
  const [k, ...resto] = ruta;
  const actual = (obj ?? (typeof k === "number" ? [] : {})) as Record<string | number, unknown> | unknown[];
  const hijo = conValor((actual as Record<string | number, unknown>)[k], resto, valor);
  if (Array.isArray(actual)) {
    const copia = [...actual];
    copia[k as number] = hijo;
    return copia as T;
  }
  const copia = { ...(actual as Record<string, unknown>) };
  if (hijo === undefined) delete copia[k as string];
  else copia[k as string] = hijo;
  return copia as T;
}

/** Id de YouTube a partir de un enlace (watch, youtu.be, shorts, embed) o del propio id. null si no lo es. */
export function idYoutube(texto: string): string | null {
  const t = texto.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(t)) return t;
  const m = t.match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/|\/live\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

/** "Sin Tiempo: el corto" → "sin-tiempo-el-corto" */
export function aSlug(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Todos los ids con forma de uuid dentro de un valor (para saber qué medios hay que cargar) */
export function uuidsEn(v: unknown, acc = new Set<string>()): Set<string> {
  if (typeof v === "string") {
    if (UUID.test(v)) acc.add(v);
  } else if (Array.isArray(v)) v.forEach((x) => uuidsEn(x, acc));
  else if (v && typeof v === "object") Object.values(v).forEach((x) => uuidsEn(x, acc));
  return acc;
}
