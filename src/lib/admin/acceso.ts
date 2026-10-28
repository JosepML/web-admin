"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { rutaSegura } from "./util";

export type EstadoEntrar = { error?: string; correo?: string };

/** Inicio de sesión de /admin/entrar. La cookie de sesión la guarda el cliente de servidor de Supabase. */
export async function entrar(_previo: EstadoEntrar, datos: FormData): Promise<EstadoEntrar> {
  const correo = String(datos.get("correo") ?? "").trim();
  const clave = String(datos.get("clave") ?? "");
  if (!correo || !clave) return { error: "Escribe tu correo y tu contraseña.", correo };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: correo, password: clave });
  if (error) {
    const mensaje = /invalid login credentials/i.test(error.message)
      ? "El correo o la contraseña no son correctos."
      : /rate limit|too many/i.test(error.message)
        ? "Demasiados intentos seguidos. Espera un minuto y vuelve a probar."
        : `No se pudo entrar: ${error.message}`;
    return { error: mensaje, correo };
  }
  const { data: admin } = await supabase.rpc("es_admin");
  if (admin !== true) {
    await supabase.auth.signOut();
    return { error: "Esta cuenta no tiene permiso para editar la web.", correo };
  }
  redirect(rutaSegura(String(datos.get("volver") ?? ""), "/admin"));
}

/** Cierra la sesión y vuelve a la web */
export async function salir() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
