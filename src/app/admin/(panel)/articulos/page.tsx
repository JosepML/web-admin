import type { Metadata } from "next";
import { ListaContenido } from "@/components/admin/ListaContenido";
import { listar } from "@/lib/admin/contenido";
import { mediosPorId } from "@/lib/admin/medios";
import { exigirAdmin } from "@/lib/admin/sesion";
import { RUTAS } from "@/lib/rutas";

export const metadata: Metadata = { title: "Artículos" };

const fecha = (v: unknown) => (typeof v === "string" && v ? new Date(`${v.slice(0, 10)}T12:00:00`).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }) : "");

export default async function Articulos() {
  const s = await exigirAdmin({ redirigir: "/admin/articulos" });
  const [r, { data: categorias }] = await Promise.all([listar("articulos"), s.from("categorias_articulo").select("id, nombre")]);
  if (!r.ok) return <p className="text-[#ff6b6b]">{r.error}</p>;
  const filas = r.datos.map((a) => ({ a, d: { ...a, ...(a.borrador ?? {}) } }));
  const medios = await mediosPorId(filas.map(({ d }) => d.imagen_id as string).filter(Boolean));
  return (
    <ListaContenido
      tabla="articulos"
      titulo="Artículos"
      base="/admin/articulos"
      ordenable={false}
      buscarTexto="Buscar por título o categoría"
      crearCon={{ texto: "Nuevo artículo", ayuda: "Empieza por el título. Lo demás lo rellenas después; no se ve en el blog hasta que lo publiques.", clave: "titulo", etiqueta: "Título", placeholder: "Cómo ilumino una escena de noche", slug: { prefijo: "/blog/" } }}
      filas={filas.map(({ a, d }) => ({
        id: a.id,
        titulo: String(d.titulo ?? ""),
        detalle: [fecha(d.fecha), (categorias ?? []).find((c) => c.id === d.categoria_id)?.nombre].filter(Boolean).join(" · "),
        estado: String(a.estado),
        nuevo: !a.publicado_en,
        hayBorrador: a.hayBorrador,
        miniatura: (medios.ok ? medios.datos[String(d.imagen_id)] : null) ?? null,
        ruta: a.slug ? RUTAS.articulo(String(a.slug)) : null,
      }))}
    />
  );
}
