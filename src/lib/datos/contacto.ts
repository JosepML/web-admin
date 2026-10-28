import { FOTO_CONTACTO } from "../contacto/foto";
import { getAjustes } from "./ajustes";
import { getMedios, medio } from "./medios";
import type { Medio } from "./tipos";

export { FOTO_CONTACTO };

/** La que se elige en Ajustes → «Foto de Contacto»; si no hay o no existe, la de por defecto y, al final, la que se pase de reserva */
export async function getFotoContacto(reserva: Medio | null): Promise<Medio | null> {
  const [ajustes, medios] = await Promise.all([getAjustes(), getMedios()]);
  return medio(medios, ajustes.fotoContacto) ?? medio(medios, FOTO_CONTACTO) ?? reserva;
}
