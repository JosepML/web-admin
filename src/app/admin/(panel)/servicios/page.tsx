import type { Metadata } from "next";
import { ListaContenido } from "@/components/admin/ListaContenido";
import { listar } from "@/lib/admin/contenido";
import { mediosPorId } from "@/lib/admin/medios";
import { exigirAdmin } from "@/lib/admin/sesion";
import { RUTAS } from "@/lib/rutas";

export const metadata: Metadata = { title: "Servicios" };

export default async function Servicios() {
  await exigirAdmin({ redirigir: "/admin/servicios" });
  const r = await listar("servicios");
  if (!r.ok) return <p className="text-[#ff6b6b]">{r.error}</p>;
  const filas = r.datos.map((s) => ({ s, d: { ...s, ...(s.borrador ?? {}) } }));
  const medios = await mediosPorId(filas.map(({ d }) => d.imagen_id as string).filter(Boolean));
  return (
    <ListaContenido
      tabla="servicios"
      titulo="Servicios"
      descripcion="Cada uno tiene su página y su tarjeta en Inicio"
      base="/admin/servicios"
      crearCon={{ texto: "Nuevo servicio", ayuda: "Tendrá su propia página. No se ve en la web hasta que lo publiques.", clave: "nombre", etiqueta: "Nombre", placeholder: "Fotografía de producto", slug: { prefijo: "/servicios/" } }}
      filas={filas.map(({ s, d }) => ({
        id: s.id,
        titulo: String(d.nombre ?? ""),
        detalle: String(d.frase ?? ""),
        estado: String(s.estado),
        nuevo: !s.publicado_en,
        hayBorrador: s.hayBorrador,
        miniatura: (medios.ok ? medios.datos[String(d.imagen_id)] : null) ?? null,
        ruta: s.slug ? RUTAS.servicio(String(s.slug)) : null,
      }))}
    />
  );
}
