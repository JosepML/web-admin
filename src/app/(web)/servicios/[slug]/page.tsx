import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLdServicio } from "@/components/seo/JsonLd";
import { PaginaServicio } from "@/components/servicios/PaginaServicio";
import { getPaginaConDatos } from "@/lib/datos/web";
import { getServicios } from "@/lib/datos/servicios";
import { sinAcento } from "@/lib/seo/url";

export const dynamicParams = false;

export async function generateStaticParams() {
  const servicios = await getServicios();
  return servicios.map((s) => ({ slug: s.slug }));
}

type Props = { params: Promise<{ slug: string }> };

/** Los datos de la web (los mismos que lee Inicio) y el servicio pedido */
async function cargar(slug: string) {
  const r = await getPaginaConDatos("inicio");
  const servicio = r?.datos.servicios.find((s) => s.slug === slug);
  return r && servicio ? { ...r, servicio } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = await cargar((await params).slug);
  if (!r) return {};
  const s = r.servicio;
  return {
    title: s.seo.titulo ? { absolute: s.seo.titulo } : sinAcento(s.nombre),
    description: sinAcento(s.seo.descripcion || s.resumen),
    openGraph: s.imagen ? { images: [s.imagen.url] } : undefined,
  };
}

export default async function Servicio({ params }: Props) {
  const r = await cargar((await params).slug);
  if (!r) notFound();
  const llamada = r.pagina.bloques.find((b) => b.tipo === "llamada") ?? null;
  // En Filmmaker, las tarjetas de sus especialidades (solo si llevan a su página)
  const filmmaker = r.pagina.bloques.find((b) => b.tipo === "filmmaker" && Array.isArray(b.datos.piezas) && b.datos.piezas.some((x) => typeof x === "object" && x && "href" in x && x.href));
  const especialidades = r.servicio.slug === "filmmaker" ? (filmmaker ?? null) : null;
  return (
    <>
      <JsonLdServicio servicio={r.servicio} ajustes={r.datos.ajustes} />
      <PaginaServicio servicio={r.servicio} datos={r.datos} llamada={llamada} especialidades={especialidades} />
    </>
  );
}
