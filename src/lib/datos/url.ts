const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://oadmqwtnxpbotxcgzaoo.supabase.co").trim().replace(/\/+$/, "");

/** URL pública de un archivo del bucket `medios` (sirve en el servidor y en el navegador) */
export function urlBucket(ruta: string) {
  if (!ruta) return "";
  const limpia = ruta.replace(/^\/+/, "");
  return `${SUPABASE_URL}/storage/v1/object/public/medios/${limpia.split("/").map((p) => encodeURIComponent(decodeURIComponent(p))).join("/")}`;
}
