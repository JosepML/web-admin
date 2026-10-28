const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://oadmqwtnxpbotxcgzaoo.supabase.co").trim().replace(/\/+$/, "");

/** URL pública de un archivo del bucket `medios` (sirve en el servidor y en el navegador) */
export function urlBucket(ruta: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/medios/${ruta.split("/").map(encodeURIComponent).join("/")}`;
}
