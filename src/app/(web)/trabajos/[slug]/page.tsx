import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { JsonLdProyecto } from "@/components/seo/JsonLd";
import { FichaProyecto } from "@/components/trabajos/FichaProyecto";
import { getProyectos } from "@/lib/datos/proyectos";
import { getServicios } from "@/lib/datos/servicios";
import { RUTAS } from "@/lib/rutas";
import { sinAcento } from "@/lib/seo/url";

export const dynamicParams = false;

export async function generateStaticParams() {
  const proyectos = await getProyectos();
  const slugs = new Set<string>();
  for (const p of proyectos) {
    if (p.slug) slugs.add(p.slug);
    if (p.idAntiguo) slugs.add(p.idAntiguo);
  }
  return Array.from(slugs).map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const proyectos = await getProyectos();
  const p = proyectos.find((x) => x.slug === slug) ?? proyectos.find((x) => x.idAntiguo === slug);
  if (!p) return {};
  return {
    title: p.seo.titulo ? { absolute: p.seo.titulo } : sinAcento(p.titulo),
    description: sinAcento(p.seo.descripcion || p.textos.tarjeta) || undefined,
    openGraph: p.poster ? { images: [p.poster.url] } : undefined,
  };
}

export default async function Proyecto({ params }: Props) {
  const { slug } = await params;
  const [proyectos, servicios] = await Promise.all([getProyectos(), getServicios()]);
  const i = proyectos.findIndex((x) => x.slug === slug);
  if (i < 0) {
    // Si alguien entra con el id de la web antigua (`id_antiguo`), redirige de forma permanente a su slug actual
    const antiguo = proyectos.find((x) => x.idAntiguo === slug);
    if (antiguo) permanentRedirect(RUTAS.proyecto(antiguo.slug));
    notFound();
  }
  // El siguiente en el orden de Trabajos, y del último se vuelve al primero
  const siguiente = proyectos.length > 1 ? proyectos[(i + 1) % proyectos.length] : null;
  return (
    <>
      <JsonLdProyecto proyecto={proyectos[i]} />
      <FichaProyecto proyecto={proyectos[i]} siguiente={siguiente} servicios={servicios} />
    </>
  );
}
