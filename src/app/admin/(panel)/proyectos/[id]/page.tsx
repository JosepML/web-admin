import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FormularioProyecto } from "@/components/admin/proyectos/FormularioProyecto";
import { cargarParaEditar } from "@/lib/admin/contenido";
import { exigirAdmin } from "@/lib/admin/sesion";

export const metadata: Metadata = { title: "Proyecto" };

export default async function EditarProyecto({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = await exigirAdmin({ redirigir: `/admin/proyectos/${id}` });
  const [r, { data: tipos }, { data: servicios }] = await Promise.all([
    cargarParaEditar("proyectos", id),
    s.from("tipos_proyecto").select("id, nombre").order("orden"),
    s.from("servicios").select("id, nombre").order("orden"),
  ]);
  if (!r.ok) notFound();
  return (
    <FormularioProyecto
      id={id}
      inicial={r.datos}
      opciones={{
        tipos: (tipos ?? []).map((t) => ({ valor: t.id, nombre: t.nombre })),
        servicios: (servicios ?? []).map((t) => ({ valor: t.id, nombre: t.nombre })),
      }}
    />
  );
}
