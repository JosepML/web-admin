import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FormularioServicio } from "@/components/admin/servicios/FormularioServicio";
import { cargarParaEditar } from "@/lib/admin/contenido";
import { exigirAdmin } from "@/lib/admin/sesion";

export const metadata: Metadata = { title: "Servicio" };

export default async function EditarServicio({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await exigirAdmin({ redirigir: `/admin/servicios/${id}` });
  const r = await cargarParaEditar("servicios", id);
  if (!r.ok) notFound();
  return <FormularioServicio id={id} inicial={r.datos} />;
}
