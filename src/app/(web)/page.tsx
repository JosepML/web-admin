import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PaginaBloques } from "@/components/bloques/PaginaBloques";
import { getPagina } from "@/lib/datos/paginas";
import { getPaginaConDatos } from "@/lib/datos/web";

// Se pinta en cada visita con los datos de la caché (src/lib/datos/cliente.ts): así la compilación no
// depende de que haya conexión con Supabase, y lo que Josep publica se ve en cuanto se vacía la caché.

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await getPagina("inicio");
  return {
    // absolute: el título de Inicio no lleva el nombre detrás (ya lo incluye)
    title: pagina?.seo.titulo ? { absolute: pagina.seo.titulo } : undefined,
    description: pagina?.seo.descripcion || undefined,
  };
}

export default async function Inicio() {
  const r = await getPaginaConDatos("inicio");
  if (!r) notFound();
  return <PaginaBloques bloques={r.pagina.bloques} datos={r.datos} pagina={{ id: r.pagina.id, slug: r.pagina.slug, titulo: r.pagina.titulo }} />;
}
