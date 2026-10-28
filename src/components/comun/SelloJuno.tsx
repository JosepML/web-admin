"use client";

import { useRouter } from "next/navigation";
import { RUTAS } from "@/lib/rutas";

/**
 * Marca de los proyectos hechos bajo el sello de JUNO Media (`proyectos.con_juno`). Dice «con»: Josep trabaja
 * en sinergia con JUNO Media, no forma parte de ella. Va sobre imagen, así que siempre en blanco. Lleva a la
 * página que explica la colaboración (/juno-media). Dentro de una tarjeta que ya es un enlace no puede haber otro
 * enlace, así que ahí es un botón que navega sin abrir la tarjeta.
 */
export function SelloJuno({ pequeno, className = "", enTarjeta }: { pequeno?: boolean; className?: string; enTarjeta?: boolean }) {
  const router = useRouter();
  const clases = `inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/20 transition-colors hover:border-white/50 hover:bg-black/60 ${pequeno ? "bg-black/45 px-2.5 py-1 text-[10px] leading-none" : "bg-black/35 px-3.5 py-1.5 text-xs"} text-white ${className}`;
  const marca = (
    <>
      <span className="font-medium text-white/65">con</span>
      <span className="tracking-[0.14em]">
        <span className="font-extrabold">JUNO</span>
        <span className="ml-[0.3em] font-light">MEDIA</span>
      </span>
    </>
  );
  if (enTarjeta) {
    return (
      <span
        role="link"
        tabIndex={0}
        aria-label="Cómo trabajo con JUNO Media"
        className={`cursor-pointer ${clases}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          router.push(RUTAS.juno);
        }}
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;
          e.preventDefault();
          e.stopPropagation();
          router.push(RUTAS.juno);
        }}
      >
        {marca}
      </span>
    );
  }
  return (
    <a href={RUTAS.juno} aria-label="Cómo trabajo con JUNO Media" className={clases}>
      {marca}
    </a>
  );
}
