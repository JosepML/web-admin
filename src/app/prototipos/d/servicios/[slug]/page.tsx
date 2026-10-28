import { notFound } from "next/navigation";
import { getServicioD, SERVICIOS } from "../../datos";
import { PaginaServicio } from "../PaginaServicio";

export function generateStaticParams() {
  return SERVICIOS.map((s) => ({ slug: s.slug }));
}

export default async function ServicioD({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const servicio = getServicioD(slug);
  if (!servicio) notFound();
  return <PaginaServicio servicio={servicio} />;
}
