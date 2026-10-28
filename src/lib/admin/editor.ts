"use server";

import { esAdmin } from "./sesion";
import { createClient } from "@/lib/supabase/server";

/** Lo que necesita la pastilla «Editar página» al cargar: si quien mira es Josep y si hay cambios sin publicar */
export async function estadoEditor(paginaId: string): Promise<{ admin: boolean; hayBorrador: boolean }> {
  if (!(await esAdmin())) return { admin: false, hayBorrador: false };
  const supabase = await createClient();
  const { data } = await supabase.from("borradores").select("fila_id").eq("tabla", "paginas").eq("fila_id", paginaId).maybeSingle();
  return { admin: true, hayBorrador: !!data };
}
