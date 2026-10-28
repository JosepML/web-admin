import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { esAdmin } from "@/lib/admin/sesion";
import { rutaSegura } from "@/lib/admin/util";

/** Activa la vista previa (la web entera con los borradores encima) y lleva a `?ruta=` */
export async function GET(req: NextRequest) {
  const ruta = rutaSegura(req.nextUrl.searchParams.get("ruta"));
  if (!(await esAdmin())) redirect(`/admin/entrar?volver=${encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search)}`);
  (await draftMode()).enable();
  redirect(ruta);
}
