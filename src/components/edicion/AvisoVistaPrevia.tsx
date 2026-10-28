"use client";

import { usePathname } from "next/navigation";
import { Icono } from "../Iconos";

/** Pastilla fija mientras Josep ve la web con los cambios sin publicar (vista previa) */
export function AvisoVistaPrevia() {
  const ruta = usePathname();
  return (
    <div className="cristal cristal-fuerte fixed bottom-4 left-4 z-[70] flex items-center gap-2 rounded-full py-1.5 pl-4 pr-1.5 text-[13px] sm:bottom-5 sm:left-5">
      <span className="h-2 w-2 rounded-full bg-[var(--jm-calido)]" />
      <span className="font-medium">Vista previa: con lo no publicado</span>
      {/* Enlace normal (no de Next): la ruta de salida es del servidor y tiene que recargar la página */}
      <a href={`/admin/vista-previa/salir?ruta=${encodeURIComponent(ruta)}`} className="boton boton-suave px-3 py-1.5 text-xs">
        <Icono nombre="cerrar" className="h-3.5 w-3.5" />
        Salir
      </a>
    </div>
  );
}
