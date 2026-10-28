import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FormularioCanal } from "@/components/admin/confianza/Formularios";
import { cargarParaEditar } from "@/lib/admin/contenido";
import { exigirAdmin } from "@/lib/admin/sesion";

export const metadata: Metadata = { title: "Canal" };

export default async function Editar({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await exigirAdmin({ redirigir: `/admin/canales/${id}` });
  const r = await cargarParaEditar("canales", id);
  if (!r.ok) notFound();
  return <FormularioCanal id={id} inicial={r.datos} />;
}
