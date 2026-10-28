import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EditorCabecera } from "@/components/admin/paginas/EditorCabecera";
import { OrdenSecciones } from "@/components/admin/paginas/OrdenSecciones";
import { cargarParaEditar } from "@/lib/admin/contenido";
import { exigirAdmin } from "@/lib/admin/sesion";
import { rutaPagina } from "@/lib/rutas";

export const metadata: Metadata = { title: "Página" };

/** Las páginas con plantilla propia: su contenido sale de los proyectos y solo se edita la cabecera */
const CON_PLANTILLA = new Set(["trabajos", "recreaciones"]);

export default async function EditarPagina({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sesion = await exigirAdmin({ redirigir: `/admin/paginas/${id}` });
  const [r, { data: proyectos }, { data: tipos }] = await Promise.all([
    cargarParaEditar("paginas", id),
    sesion.from("proyectos").select("id, titulo").order("orden"),
    sesion.from("tipos_proyecto").select("slug, nombre").order("orden"),
  ]);
  if (!r.ok) notFound();
  const slug = String(r.datos.fila.slug ?? "");
  const ruta = rutaPagina(slug);
  if (CON_PLANTILLA.has(slug)) return <EditorCabecera id={id} slug={slug} ruta={ruta} inicial={r.datos} />;
  return (
    <OrdenSecciones
      id={id} titulo={String(r.datos.fila.titulo || slug)}
      ruta={ruta}
      inicial={r.datos}
      opciones={{
        proyectos: (proyectos ?? []).map((p) => ({ valor: p.id, nombre: p.titulo })),
        tipos: (tipos ?? []).map((t) => ({ valor: t.slug, nombre: t.nombre })),
      }}
    />
  );
}
