import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PaginaBloques } from "@/components/bloques/PaginaBloques";
import { Icono } from "@/components/Iconos";
import { getPagina, getSlugsPaginas } from "@/lib/datos/paginas";
import { getPaginaConDatos } from "@/lib/datos/web";
import { RUTAS, slugEspecialidad } from "@/lib/rutas";

export const dynamicParams = false;

export async function generateStaticParams() {
  const paginas = await getSlugsPaginas();
  const params: { slug: string; especialidad: string }[] = [];
  for (const p of paginas) {
    const m = p.match(/^(filmmaker|direccion-de-fotografia|edicion)-(.+)$/);
    if (m) {
      params.push({ slug: m[1], especialidad: m[2] });
    }
  }
  return params;
}

type Props = { params: Promise<{ slug: string; especialidad: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, especialidad } = await params;
  const pagina = await getPagina(slugEspecialidad(slug, especialidad));
  if (!pagina) return {};
  return {
    title: pagina.seo.titulo ? { absolute: pagina.seo.titulo } : pagina.titulo,
    description: pagina.seo.descripcion || undefined,
  };
}

/**
 * Una especialidad de un servicio (/servicios/filmmaker/videoclips): página de bloques «filmmaker-videoclips»
 * que cuenta cómo trabajo ese tipo de encargo y enseña todos sus proyectos. Se edita en su sitio como Inicio.
 */
export default async function Especialidad({ params }: Props) {
  const { slug, especialidad } = await params;
  const r = await getPaginaConDatos(slugEspecialidad(slug, especialidad));
  if (!r) notFound();
  const servicio = r.datos.servicios.find((s) => s.slug === slug);
  return (
    <div className="pt-20 sm:pt-24">
      {servicio && (
        <div className="mx-auto max-w-5xl px-4 sm:px-8">
          <Link href={RUTAS.servicio(slug)} className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--jm-suave)] transition-colors hover:text-[var(--jm-texto)]">
            <Icono nombre="izquierda" className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-0.5" />
            {servicio.nombre}
          </Link>
        </div>
      )}
      <h1 className="sr-only">{r.pagina.titulo}</h1>
      <PaginaBloques bloques={r.pagina.bloques} datos={r.datos} pagina={{ id: r.pagina.id, slug: r.pagina.slug, titulo: r.pagina.titulo }} />
    </div>
  );
}
