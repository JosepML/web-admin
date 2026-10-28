import type { Metadata } from "next";
import { FormularioAjustes } from "@/components/admin/ajustes/FormularioAjustes";
import { exigirAdmin } from "@/lib/admin/sesion";
import { getAjustes } from "@/lib/datos/ajustes";
import { FOTO_CONTACTO } from "@/lib/contacto/foto";

export const metadata: Metadata = { title: "Ajustes" };

export default async function Ajustes() {
  await exigirAdmin({ redirigir: "/admin/ajustes" });
  const ajustes = await getAjustes();
  return <FormularioAjustes inicial={{ ...ajustes, fotoContacto: ajustes.fotoContacto || FOTO_CONTACTO } as unknown as Record<string, unknown>} />;
}
