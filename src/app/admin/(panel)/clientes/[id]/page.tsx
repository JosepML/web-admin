import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FormularioCliente } from "@/components/admin/confianza/Formularios";
import { cargarParaEditar } from "@/lib/admin/contenido";
import { exigirAdmin } from "@/lib/admin/sesion";

export const metadata: Metadata = { title: "Cliente" };

export default async function Editar({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await exigirAdmin({ redirigir: `/admin/clientes/${id}` });
  const r = await cargarParaEditar("clientes", id);
  if (!r.ok) notFound();
  return <FormularioCliente id={id} inicial={r.datos} />;
}
