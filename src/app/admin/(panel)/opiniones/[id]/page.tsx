import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FormularioOpinion } from "@/components/admin/confianza/Formularios";
import { cargarParaEditar } from "@/lib/admin/contenido";
import { exigirAdmin } from "@/lib/admin/sesion";

export const metadata: Metadata = { title: "Opinión" };

export default async function Editar({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = await exigirAdmin({ redirigir: `/admin/opiniones/${id}` });
  const [r, { data: proyectos }] = await Promise.all([cargarParaEditar("opiniones", id), s.from("proyectos").select("id, titulo").order("orden")]);
  if (!r.ok) notFound();
  return <FormularioOpinion id={id} inicial={r.datos} opciones={{ proyectos: (proyectos ?? []).map((p) => ({ valor: p.id, nombre: p.titulo })) }} />;
}
