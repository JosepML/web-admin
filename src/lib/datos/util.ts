// Lectura prudente de los campos jsonb: la base de datos valida mucho, pero la web no debe romperse si
// un campo llega vacío o con otra forma.

export const lista = <T = unknown>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
export const textos = (v: unknown): string[] => lista(v).filter((x): x is string => typeof x === "string" && x.trim() !== "");
export const texto = (v: unknown): string => (typeof v === "string" ? v : "");
export const objeto = (v: unknown): Record<string, unknown> => (v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {});
