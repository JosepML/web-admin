import type { MetadataRoute } from "next";
import { getArticulos } from "@/lib/datos/articulos";
import { getSlugsPaginas } from "@/lib/datos/paginas";
import { getProyectos } from "@/lib/datos/proyectos";
import { getServicios } from "@/lib/datos/servicios";
import { RUTAS, rutaPagina } from "@/lib/rutas";
import { urlAbsoluta } from "@/lib/seo/url";


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [servicios, proyectos, articulos, paginas] = await Promise.all([
    getServicios(),
    getProyectos(),
    getArticulos(),
    getSlugsPaginas(),
  ]);

  const fijas: MetadataRoute.Sitemap = [
    { url: urlAbsoluta(RUTAS.inicio), changeFrequency: "weekly", priority: 1 },
    { url: urlAbsoluta(RUTAS.trabajos), changeFrequency: "weekly", priority: 0.9 },
    { url: urlAbsoluta(RUTAS.recreaciones), changeFrequency: "monthly", priority: 0.8 },
    { url: urlAbsoluta(RUTAS.sobreMi), changeFrequency: "monthly", priority: 0.8 },
    { url: urlAbsoluta(RUTAS.juno), changeFrequency: "monthly", priority: 0.7 },
    { url: urlAbsoluta(RUTAS.blog), changeFrequency: "weekly", priority: 0.8 },
    { url: urlAbsoluta(RUTAS.contacto), changeFrequency: "monthly", priority: 0.8 },
  ];

  const deServicios: MetadataRoute.Sitemap = servicios.map((s) => ({
    url: urlAbsoluta(RUTAS.servicio(s.slug)),
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  // Especialidades de servicio publicadas en `paginas` (p. ej. filmmaker-videoclips -> /servicios/filmmaker/videoclips)
  const deEspecialidades: MetadataRoute.Sitemap = paginas
    .filter((slug) => /^(filmmaker|direccion-de-fotografia|edicion)-.+/.test(slug))
    .map((slug) => ({
      url: urlAbsoluta(rutaPagina(slug)),
      changeFrequency: "monthly",
      priority: 0.75,
    }));

  const deProyectos: MetadataRoute.Sitemap = proyectos.map((p) => ({
    url: urlAbsoluta(RUTAS.proyecto(p.slug)),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const deArticulos: MetadataRoute.Sitemap = articulos.map((a) => ({
    url: urlAbsoluta(RUTAS.articulo(a.slug)),
    lastModified: a.fecha ? new Date(a.fecha) : undefined,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...fijas, ...deServicios, ...deEspecialidades, ...deProyectos, ...deArticulos];
}
