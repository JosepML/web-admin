import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PaginaBloques } from "@/components/bloques/PaginaBloques";
import { getPagina } from "@/lib/datos/paginas";
import { getPaginaConDatos } from "@/lib/datos/web";

// Datos de la caché en cada visita (ver src/app/(web)/page.tsx)

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await getPagina("sobre-mi");
  return {
    title: pagina?.seo.titulo ? { absolute: pagina.seo.titulo } : "Sobre mí",
    description: pagina?.seo.descripcion || undefined,
  };
}

/** Sobre mí: una página de bloques que Josep edita como Inicio (plan/contenido/sobre-mi.md) */
export default async function SobreMi() {
  const r = await getPaginaConDatos("sobre-mi");
  if (!r) notFound();
  // El menú fijo tapa el principio: la primera sección baja lo que mide
  return (
    <div className="pt-16 sm:pt-20">
      {/* Los bloques llevan h2; el h1 de la página (para buscadores y lectores de pantalla) es su título */}
      <h1 className="sr-only">{r.pagina.titulo}</h1>
      <PaginaBloques bloques={r.pagina.bloques} datos={r.datos} pagina={{ id: r.pagina.id, slug: r.pagina.slug, titulo: r.pagina.titulo }} />
    </div>
  );
}
