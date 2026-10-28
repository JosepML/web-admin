import type { Metadata } from "next";
import { Mensajes } from "@/components/admin/mensajes/Mensajes";
import { exigirAdmin } from "@/lib/admin/sesion";

export const metadata: Metadata = { title: "Mensajes" };

export default async function PaginaMensajes() {
  const s = await exigirAdmin({ redirigir: "/admin/mensajes" });
  const { data, error } = await s.from("mensajes").select("*").order("creado_en", { ascending: false });
  if (error) return <p className="text-[#ff6b6b]">{error.message}</p>;
  return (
    <Mensajes
      inicial={(data ?? []).map((m) => ({
        id: m.id,
        nombre: m.nombre,
        correo: m.correo,
        telefono: m.telefono,
        servicio: m.servicio,
        mensaje: m.mensaje,
        origen: m.origen,
        estado: m.estado,
        notas: m.notas,
        creadoEn: m.creado_en,
      }))}
    />
  );
}
