"use server";

// Mensajes del formulario de contacto: Josep los lee, los marca (nuevo, respondido, cerrado) y apunta notas.

import { exigirAdmin } from "./sesion";
import type { Resultado } from "./tipos";

export type EstadoMensaje = "nuevo" | "respondido" | "cerrado";

const mensaje = (e: unknown) => (e instanceof Error ? e.message : String(e));

export async function cambiarMensaje(id: string, cambios: { estado?: EstadoMensaje; notas?: string }): Promise<Resultado<null>> {
  try {
    const s = await exigirAdmin();
    const { error } = await s.from("mensajes").update(cambios).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true, datos: null };
  } catch (e) {
    return { ok: false, error: mensaje(e) };
  }
}

export async function borrarMensaje(id: string): Promise<Resultado<null>> {
  try {
    const s = await exigirAdmin();
    const { error } = await s.from("mensajes").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true, datos: null };
  } catch (e) {
    return { ok: false, error: mensaje(e) };
  }
}
