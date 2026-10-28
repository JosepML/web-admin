"use server";

import { revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ETIQUETA_CONTENIDO, etiquetaTabla, type NombreTabla } from "./cliente";

/**
 * Vacía la caché de la web pública para que se vea lo recién publicado. La llama el panel justo después
 * de rpc('publicar') (tarea D). Con `tablas`, solo esas; sin nada, todo el contenido.
 * Solo el administrador: si no, cualquiera podría vaciar la caché a voluntad.
 */
export async function revalidarContenido(tablas?: NombreTabla[]) {
  const supabase = await createClient();
  const { data: esAdmin } = await supabase.rpc("es_admin");
  if (!esAdmin) throw new Error("Solo el administrador puede publicar");
  if (!tablas?.length) revalidateTag(ETIQUETA_CONTENIDO);
  else for (const t of tablas) revalidateTag(etiquetaTabla(t));
}
