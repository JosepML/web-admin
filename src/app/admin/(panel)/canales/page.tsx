import type { Metadata } from "next";
import { PESTANAS_CONFIANZA } from "@/components/admin/confianza/esquema";
import { ListaContenido } from "@/components/admin/ListaContenido";
import { listar } from "@/lib/admin/contenido";
import { exigirAdmin } from "@/lib/admin/sesion";

export const metadata: Metadata = { title: "Canales de YouTube" };

export default async function Canales() {
  await exigirAdmin({ redirigir: "/admin/canales" });
  const r = await listar("canales");
  if (!r.ok) return <p className="text-[#ff6b6b]">{r.error}</p>;
  return (
    <ListaContenido
      tabla="canales"
      titulo="Canales de YouTube"
      pestanas={PESTANAS_CONFIANZA}
      base="/admin/canales"
      crearCon={{ texto: "Nuevo canal", ayuda: "Escribe su nombre; lo demás lo rellenas después.", clave: "nombre", etiqueta: "Nombre del canal", placeholder: "Del Fan Para el Fan" }}
      filas={r.datos.map((c) => {
        const d = { ...c, ...(c.borrador ?? {}) };
        return {
          id: c.id,
          titulo: String(d.nombre ?? ""),
          detalle: [d.cifra, d.url ? "" : "Sin enlace"].filter(Boolean).join(" · "),
          estado: String(c.estado),
          nuevo: !c.publicado_en,
          hayBorrador: c.hayBorrador,
        };
      })}
    />
  );
}
