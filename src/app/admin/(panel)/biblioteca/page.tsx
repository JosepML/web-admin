import type { Metadata } from "next";
import { Biblioteca } from "@/components/admin/biblioteca/Biblioteca";
import { listarCarpetas, listarMedios, usosDeMedios } from "@/lib/admin/medios";
import { exigirAdmin } from "@/lib/admin/sesion";

export const metadata: Metadata = { title: "Biblioteca" };

export default async function PaginaBiblioteca() {
  await exigirAdmin({ redirigir: "/admin/biblioteca" });
  const [medios, usos, carpetas] = await Promise.all([listarMedios(), usosDeMedios(), listarCarpetas()]);
  if (!medios.ok) return <p className="text-[#ff6b6b]">{medios.error}</p>;
  return <Biblioteca medios={medios.datos} usos={usos.ok ? usos.datos : {}} carpetas={carpetas.ok ? carpetas.datos : []} />;
}
