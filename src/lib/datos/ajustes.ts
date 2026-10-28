import { filas } from "./cliente";
import type { Ajustes } from "./tipos";

/** Valores por defecto: la web nunca se queda sin nombre ni contacto aunque falte la fila */
const PREDETERMINADOS: Ajustes = {
  nombre: "Josep Mira Lozano",
  lema: "Dirección de fotografía, filmmaker y edición",
  correo: "josep.mira@gmail.com",
  whatsapp: "34618867115",
  disponible: true,
  ubicacion: "Alicante",
  redes: {},
};

/** Ajustes generales de la web (fila `sitio` de la tabla `ajustes`) */
export async function getAjustes(): Promise<Ajustes> {
  const fila = (await filas("ajustes")).find((f) => f.clave === "sitio");
  const valor = (fila?.valor ?? {}) as Partial<Ajustes>;
  return { ...PREDETERMINADOS, ...valor, redes: { ...PREDETERMINADOS.redes, ...(valor.redes ?? {}) } };
}
