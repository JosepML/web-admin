import type { Metadata } from "next";
import { PESTANAS_CONFIANZA } from "@/components/admin/confianza/esquema";
import { ListaContenido } from "@/components/admin/ListaContenido";
import { listar } from "@/lib/admin/contenido";
import { mediosPorId } from "@/lib/admin/medios";
import { exigirAdmin } from "@/lib/admin/sesion";

export const metadata: Metadata = { title: "Clientes" };

const ESTILO: Record<string, string> = { logo: "Con logo", nombre: "Nombre", firma: "Firma" };

export default async function Clientes() {
  await exigirAdmin({ redirigir: "/admin/clientes" });
  const r = await listar("clientes");
  if (!r.ok) return <p className="text-[#ff6b6b]">{r.error}</p>;
  const filas = r.datos.map((c) => ({ c, d: { ...c, ...(c.borrador ?? {}) } }));
  const medios = await mediosPorId(filas.map(({ d }) => d.logo_id as string).filter(Boolean));
  return (
    <ListaContenido
      tabla="clientes"
      titulo="Clientes"
      pestanas={PESTANAS_CONFIANZA}
      base="/admin/clientes"
      grupos={[
        { id: "propios", nombre: "Mis clientes" },
        { id: "juno", nombre: "Clientes de JUNO Media", ayuda: "Salen en el apartado «En sinergia con JUNO Media»" },
      ]}
      crearCon={{ texto: "Nuevo cliente", ayuda: "Escribe su nombre; el logo lo pones después. No sale en la web hasta que lo publiques.", clave: "nombre", etiqueta: "Nombre", placeholder: "Ayuntamiento de l'Alfàs del Pi" }}
      filas={filas.map(({ c, d }) => ({
        id: c.id,
        titulo: String(d.nombre ?? ""),
        detalle: ESTILO[String(d.estilo)] ?? "",
        grupo: d.con_juno ? "juno" : "propios",
        estado: String(c.estado),
        nuevo: !c.publicado_en,
        hayBorrador: c.hayBorrador,
        miniatura: (medios.ok ? medios.datos[String(d.logo_id)] : null) ?? null,
      }))}
    />
  );
}
