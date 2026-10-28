"use server";

// Ajustes generales de la web (fila `sitio` de `ajustes`): cambian al momento, sin borrador.

import { revalidarContenido } from "@/lib/datos/revalidar";
import { exigirAdmin } from "./sesion";
import type { Resultado } from "./tipos";

export async function guardarAjustes(valor: Record<string, unknown>): Promise<Resultado<null>> {
  try {
    const s = await exigirAdmin();
    const { error } = await s.from("ajustes").upsert({ clave: "sitio", valor: valor as never }, { onConflict: "clave" });
    if (error) throw new Error(error.message);
    await revalidarContenido(["ajustes"]);
    return { ok: true, datos: null };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
