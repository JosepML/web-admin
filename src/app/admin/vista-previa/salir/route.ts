import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { rutaSegura } from "@/lib/admin/util";

/** Sale de la vista previa y vuelve a `?ruta=` (lo que ve un visitante) */
export async function GET(req: NextRequest) {
  (await draftMode()).disable();
  redirect(rutaSegura(req.nextUrl.searchParams.get("ruta")));
}
