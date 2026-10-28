import { redirect } from "next/navigation";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/** ¿Hay sesión y es el administrador? Una consulta por petición aunque se pregunte varias veces. */
export const esAdmin = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase.rpc("es_admin");
  return data === true;
});

/**
 * Cliente de Supabase con la sesión de Josep para el panel y el editor. Si quien llama no es el administrador,
 * lanza un error (acciones) o, con `redirigir`, lleva a /admin/entrar (páginas). La RLS lo vuelve a comprobar
 * en la base: esto solo da un mensaje claro y evita consultas inútiles.
 */
export async function exigirAdmin(opciones: { redirigir?: string } = {}) {
  if (!(await esAdmin())) {
    if (opciones.redirigir !== undefined) redirect(`/admin/entrar?volver=${encodeURIComponent(opciones.redirigir)}`);
    throw new Error("Tu sesión ha caducado. Vuelve a entrar en /admin/entrar.");
  }
  return createClient();
}
