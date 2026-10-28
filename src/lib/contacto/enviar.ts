// Envío del formulario de contacto en la web estática: lo guarda en `mensajes` directamente
// usando el cliente anónimo de Supabase (la política RLS permite insertar con estado 'nuevo')
// y avisa a Josep por correo a través de Formspree.

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/tipos";

export type EstadoContacto = { error?: string; ok?: boolean };

const FORMSPREE = "https://formspree.io/f/mrblvlpb";

let supabaseAnon: ReturnType<typeof createClient<Database>> | null = null;
function clienteAnon() {
  supabaseAnon ??= createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
  return supabaseAnon;
}

async function avisarPorCorreo(m: { nombre: string; correo: string; telefono: string; servicio: string; mensaje: string }) {
  try {
    await fetch(FORMSPREE, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _subject: `Web nueva · mensaje de ${m.nombre}`,
        _replyto: m.correo,
        nombre: m.nombre,
        correo: m.correo,
        telefono: m.telefono || "—",
        servicio: m.servicio || "—",
        mensaje: m.mensaje,
      }),
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    // Si falla el correo de aviso, el mensaje de todas formas queda guardado en Supabase
  }
}

export async function enviarContacto(_previo: EstadoContacto, datos: FormData): Promise<EstadoContacto> {
  const texto = (clave: string) => String(datos.get(clave) ?? "").trim();
  const nombre = texto("nombre");
  const correo = texto("correo");
  const telefono = texto("telefono");
  const servicio = texto("servicio").slice(0, 120);
  const mensaje = texto("mensaje");
  const origen = /^[a-z0-9_-]{1,40}$/.test(texto("origen")) ? texto("origen") : "contacto";

  if (nombre.length < 2) return { error: "Dime tu nombre, por favor." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correo)) return { error: "Revisa el correo: parece que le falta algo." };
  if (mensaje.length < 10) return { error: "Cuéntame un poco más sobre tu proyecto (al menos unas líneas)." };
  if (datos.get("acepta") !== "on") return { error: "Necesito que aceptes que guarde tus datos para responderte." };

  const s = clienteAnon();
  const { error } = await s.from("mensajes").insert({
    nombre,
    correo,
    telefono,
    servicio,
    mensaje,
    origen,
    acepta_privacidad: true,
  });

  if (error) {
    if (/limitar_mensajes|demasiados/i.test(error.message)) {
      return { error: "Has enviado varios mensajes hace poco. Espera unos minutos antes de mandar otro." };
    }
    return { error: "No se ha podido enviar el mensaje. Inténtalo de nuevo o escríbeme directamente por WhatsApp." };
  }

  void avisarPorCorreo({ nombre, correo, telefono, servicio, mensaje });
  return { ok: true };
}
