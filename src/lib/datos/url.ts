/** URL pública de un archivo del bucket `medios` (sirve en el servidor y en el navegador) */
export function urlBucket(ruta: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/medios/${ruta.split("/").map(encodeURIComponent).join("/")}`;
}
