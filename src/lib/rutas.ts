// Direcciones de la web pública, en un solo sitio. Si cambia una ruta, se cambia aquí.
export const RUTAS = {
  inicio: "/",
  trabajos: "/trabajos",
  proyecto: (slug: string) => `/trabajos/${slug}`,
  servicio: (slug: string) => `/servicios/${slug}`,
  recreaciones: "/recreaciones",
  sobreMi: "/sobre-mi",
  juno: "/juno-media",
  blog: "/blog",
  articulo: (slug: string) => `/blog/${slug}`,
  contacto: "/contacto",
  gracias: "/gracias",
  avisoLegal: "/aviso-legal",
  privacidad: "/privacidad",
  cookies: "/cookies",
} as const;

/** Las páginas de cada especialidad de un servicio («filmmaker-videoclips») viven bajo él: /servicios/filmmaker/videoclips */
const ESPECIALIDAD = /^(filmmaker|direccion-de-fotografia|edicion)-(.+)$/;

/** Dirección pública de una página de `paginas` según su slug */
export function rutaPagina(slug: string) {
  if (slug === "inicio") return RUTAS.inicio;
  const m = slug.match(ESPECIALIDAD);
  if (m) return `${RUTAS.servicio(m[1])}/${m[2]}`;
  return `/${slug}`;
}

/** Slug de la página de una especialidad a partir de su dirección */
export const slugEspecialidad = (servicio: string, especialidad: string) => `${servicio}-${especialidad}`;
