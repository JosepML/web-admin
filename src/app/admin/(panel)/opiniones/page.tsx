import type { Metadata } from "next";
import { PESTANAS_CONFIANZA } from "@/components/admin/confianza/esquema";
import { ListaContenido } from "@/components/admin/ListaContenido";
import { listar } from "@/lib/admin/contenido";
import { exigirAdmin } from "@/lib/admin/sesion";

export const metadata: Metadata = { title: "Opiniones" };

export default async function Opiniones() {
  await exigirAdmin({ redirigir: "/admin/opiniones" });
  const r = await listar("opiniones");
  if (!r.ok) return <p className="text-[#ff6b6b]">{r.error}</p>;
  return (
    <ListaContenido
      tabla="opiniones"
      titulo="Opiniones"
      pestanas={PESTANAS_CONFIANZA}
      base="/admin/opiniones"
      crearCon={{ texto: "Nueva opinión", ayuda: "Empieza por quién la dice; el texto lo pegas después. No sale en la web hasta que la publiques.", clave: "autor", etiqueta: "Quién", placeholder: "Laura y Dani" }}
      filas={r.datos.map((o) => {
        const d = { ...o, ...(o.borrador ?? {}) };
        const texto = String(d.texto ?? "").replace(/\*/g, "");
        return {
          id: o.id,
          titulo: texto ? `«${texto.length > 110 ? `${texto.slice(0, 110).trim()}…` : texto}»` : "",
          detalle: [d.autor, d.contexto].filter(Boolean).join(" · "),
          estado: String(o.estado),
          nuevo: !o.publicado_en,
          hayBorrador: o.hayBorrador,
        };
      })}
    />
  );
}
