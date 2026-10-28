import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./tipos";

let cliente: ReturnType<typeof createBrowserClient<Database>> | null = null;

/** Cliente de Supabase en el navegador, con la sesión de Josep (la cookie la pone el inicio de sesión). Solo lo usa el
 *  editor para subir archivos directamente al bucket: por una acción de servidor no caben vídeos de 50 MB. */
export function clienteNavegador() {
  cliente ??= createBrowserClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);
  return cliente;
}
