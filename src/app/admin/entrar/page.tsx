import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { esAdmin } from "@/lib/admin/sesion";
import { rutaSegura } from "@/lib/admin/util";
import { FormularioEntrar } from "@/components/admin/FormularioEntrar";

export const metadata: Metadata = { title: "Entrar" };

export default async function Entrar({ searchParams }: { searchParams: Promise<{ volver?: string }> }) {
  const volver = rutaSegura((await searchParams).volver, "/admin");
  if (await esAdmin()) redirect(volver);
  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-16">
      <FormularioEntrar volver={volver} />
    </main>
  );
}
