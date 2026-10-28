/** Solo rutas de esta web: nunca una dirección externa que alguien meta en un enlace (?volver=, ?ruta=) */
export function rutaSegura(ruta: string | null | undefined, porDefecto = "/") {
  return ruta && ruta.startsWith("/") && !ruta.startsWith("//") && !ruta.startsWith("/\\") ? ruta : porDefecto;
}
