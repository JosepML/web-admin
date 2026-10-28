import { notFound } from "next/navigation";
import { getProyectoD, PROYECTOS } from "../datos";
import { FichaD } from "../FichaD";

export function generateStaticParams() {
  return PROYECTOS.map((p) => ({ slug: p.slug }));
}

export default async function ProyectoD({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const proyecto = getProyectoD(slug);
  if (!proyecto) notFound();
  return <FichaD proyecto={proyecto} />;
}
