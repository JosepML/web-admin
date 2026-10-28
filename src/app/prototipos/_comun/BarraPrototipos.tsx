"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { setRespetarSistema, useRespetarSistema, useSistemaReduce } from "./hooks";

/**
 * Barra flotante de revisión (no va en la web final): volver al índice y, si Windows tiene
 * desactivados los efectos de animación, elegir entre ver las animaciones o respetar ese ajuste.
 */
export function BarraPrototipos() {
  const ruta = usePathname();
  const sistemaReduce = useSistemaReduce();
  const respetar = useRespetarSistema();
  if (ruta === "/prototipos") return null;

  return (
    <nav
      aria-label="Prototipos"
      className="fixed bottom-4 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/15 bg-black/75 p-1 font-sans text-[11px] text-white/80 shadow-lg backdrop-blur"
    >
      <Link href="/prototipos" className="rounded-full px-3 py-1.5 hover:text-white">
        Índice
      </Link>
      <Link href="/prototipos/d" className="whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-black">
        D · Cristal
      </Link>
      {sistemaReduce && (
        <button
          type="button"
          onClick={() => setRespetarSistema(!respetar)}
          className="whitespace-nowrap rounded-full px-3 py-1.5 hover:text-white"
          title="Windows tiene desactivados los efectos de animación"
        >
          {respetar ? "Animaciones: según Windows" : "Animaciones: sí"}
        </button>
      )}
    </nav>
  );
}
