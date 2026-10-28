"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Medio } from "@/lib/datos/tipos";
import { useReducir } from "../comun/hooks";
import { enfoque, img } from "../comun/imagen";

/** Una imagen del deslizador. `recorte` (fracciones de 0 a 1) toma solo una parte: así una comparación
 *  ya montada (original y recreación en la misma imagen) sirve para los dos lados. */
export type Lado = { imagen: Medio; recorte: { x: number; y: number; ancho: number; alto: number } | null };

type Props = {
  antes: Lado;
  despues: Lado;
  /** Ancho / alto de la caja */
  formato: number;
  etiquetaAntes: string;
  etiquetaDespues: string;
  className?: string;
};

/** Imagen que llena la caja; con recorte, se amplía y se desplaza para que solo se vea esa parte */
function Imagen({ lado, alt, estilo }: { lado: Lado; alt: string; estilo?: React.CSSProperties }) {
  const r = lado.recorte;
  const posicion: React.CSSProperties = r
    ? { width: `${100 / r.ancho}%`, height: `${100 / r.alto}%`, left: `${(-r.x / r.ancho) * 100}%`, top: `${(-r.y / r.alto) * 100}%`, maxWidth: "none" }
    : { inset: 0, width: "100%", height: "100%" };
  return (
    <div className="absolute inset-0 overflow-hidden" style={estilo}>
      <img src={img(lado.imagen.url, 2048)} alt={alt} loading="lazy" decoding="async" draggable={false} className={`absolute ${r ? "" : "object-cover"}`} style={r ? posicion : { ...posicion, ...enfoque(lado.imagen) }} />
    </div>
  );
}

/**
 * Deslizador antes/después con dos imágenes reales (el fotograma original y el de la recreación).
 * Al entrar en pantalla se mueve una vez, despacio, para que se vea que se puede arrastrar.
 */
export function AntesDespues({ antes, despues, formato, etiquetaAntes, etiquetaDespues, className = "" }: Props) {
  const reducir = useReducir();
  const [pos, setPos] = useState(50);
  const caja = useRef<HTMLDivElement>(null);
  const tocado = useRef(false);
  const visto = useInView(caja, { once: true, margin: "-25% 0px" });

  useEffect(() => {
    if (!visto || reducir) return;
    const a = animate(50, [50, 28, 64, 50], {
      duration: 3.2,
      ease: "easeInOut",
      delay: 0.4,
      onUpdate: (v) => !tocado.current && setPos(v),
    });
    return () => a.stop();
  }, [visto, reducir]);

  const mover = (clientX: number) => {
    const r = caja.current?.getBoundingClientRect();
    if (!r) return;
    tocado.current = true;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div
      ref={caja}
      style={{ aspectRatio: formato }}
      className={`relative cursor-ew-resize touch-pan-y select-none overflow-hidden bg-black ${className}`}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        mover(e.clientX);
      }}
      onPointerMove={(e) => e.buttons === 1 && mover(e.clientX)}
    >
      <Imagen lado={despues} alt={despues.imagen.alt || etiquetaDespues} />
      <Imagen lado={antes} alt={antes.imagen.alt || etiquetaAntes} estilo={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} />
      <div className="pointer-events-none absolute inset-y-0 w-px bg-white/85 shadow-[0_0_12px_rgba(0,0,0,0.5)]" style={{ left: `${pos}%` }}>
        <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-black/35 text-sm text-white backdrop-blur-md">
          ⟷
        </span>
      </div>
      <span className="pointer-events-none absolute left-3 top-3 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md sm:left-4 sm:top-4">
        {etiquetaAntes}
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md sm:right-4 sm:top-4">
        {etiquetaDespues}
      </span>
      <input
        type="range"
        min={0}
        max={100}
        value={Math.round(pos)}
        onChange={(e) => {
          tocado.current = true;
          setPos(Number(e.target.value));
        }}
        aria-label={`Comparar ${etiquetaAntes.toLowerCase()} y ${etiquetaDespues.toLowerCase()}`}
        className="absolute inset-x-0 bottom-0 h-10 w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
