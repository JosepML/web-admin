import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FormularioArticulo } from "@/components/admin/articulos/FormularioArticulo";
import { cargarParaEditar } from "@/lib/admin/contenido";
import { exigirAdmin } from "@/lib/admin/sesion";

export const metadata: Metadata = { title: "Artículo" };

export default async function EditarArticulo({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = await exigirAdmin({ redirigir: `/admin/articulos/${id}` });
  const [r, { data: categorias }] = await Promise.all([cargarParaEditar("articulos", id), s.from("categorias_articulo").select("id, nombre").order("orden")]);
  if (!r.ok) notFound();
  return <FormularioArticulo id={id} inicial={r.datos} opciones={{ categorias: (categorias ?? []).map((c) => ({ valor: c.id, nombre: c.nombre })) }} />;
}
