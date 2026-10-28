"use client";

import Link from "next/link";
import { abrirConfiguracionCookies } from "@/components/legales/ConsentimientoCookies";
import type { Ajustes } from "@/lib/datos/tipos";
import { RUTAS } from "@/lib/rutas";

/** Pie de todas las páginas: nombre, lo que hace, dónde, enlaces legales y las redes de los ajustes. */
export function Pie({ ajustes }: { ajustes: Ajustes }) {
  const redes = [
    { nombre: "Instagram", url: ajustes.redes.instagram },
    { nombre: "YouTube", url: ajustes.redes.youtube },
    { nombre: "LinkedIn", url: ajustes.redes.linkedin },
  ].filter((r): r is { nombre: string; url: string } => Boolean(r.url));

  return (
    <footer className="px-4 pb-24 pt-10 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 border-t border-[var(--jm-borde)] pt-8 text-sm text-[var(--jm-suave)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span className="font-extrabold text-[var(--jm-texto)]">{ajustes.nombre}</span> · {ajustes.lema}
            {ajustes.ubicacion ? ` · ${ajustes.ubicacion}` : ""}
          </p>
          {redes.length > 0 && (
            <div className="flex gap-5">
              {redes.map((r) => (
                <a key={r.nombre} href={r.url} target="_blank" rel="noreferrer" className="hover:text-[var(--jm-texto)]">
                  {r.nombre}
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[var(--jm-tenue)]">
          <Link href={RUTAS.avisoLegal} className="transition-colors hover:text-[var(--jm-suave)]">
            Aviso legal
          </Link>
          <Link href={RUTAS.privacidad} className="transition-colors hover:text-[var(--jm-suave)]">
            Privacidad
          </Link>
          <Link href={RUTAS.cookies} className="transition-colors hover:text-[var(--jm-suave)]">
            Cookies
          </Link>
          <button
            type="button"
            onClick={abrirConfiguracionCookies}
            className="cursor-pointer transition-colors hover:text-[var(--jm-suave)]"
          >
            Configurar cookies
          </button>
        </div>
      </div>
    </footer>
  );
}
