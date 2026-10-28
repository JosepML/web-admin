"use client";

import { useRef, useState } from "react";
import { img } from "./imagen";

type Props = {
  imagen: string;
  antes?: string;
  despues?: string;
  className?: string;
};

/**
 * Deslizador antes/después. En el prototipo simula el LOG plano frente al etalonaje
 * con la misma imagen; en la web final llevará las dos imágenes reales.
 */
export function AntesDespues({ imagen, antes = "LOG", despues = "Etalonaje", className = "" }: Props) {
  const [pos, setPos] = useState(50);
  const caja = useRef<HTMLDivElement>(null);

  const mover = (clientX: number) => {
    const r = caja.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div
      ref={caja}
      className={`relative aspect-[2.39/1] touch-pan-y select-none overflow-hidden ${className}`}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        mover(e.clientX);
      }}
      onPointerMove={(e) => e.buttons === 1 && mover(e.clientX)}
    >
      <img src={img(imagen, 3840)} alt="Fotograma después del etalonaje" className="absolute inset-0 h-full w-full object-cover" />
      <img
        src={img(imagen, 3840)}
        alt="El mismo fotograma en LOG, antes del color"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)`, filter: "saturate(0.25) contrast(0.62) brightness(1.18)" }}
      />
      <div className="absolute inset-y-0 w-px bg-white/80" style={{ left: `${pos}%` }}>
        <span className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-black/40 text-[10px] text-white backdrop-blur">
          ⟷
        </span>
      </div>
      <span className="absolute left-3 top-3 text-[10px] uppercase tracking-[0.3em] text-white/80">{antes}</span>
      <span className="absolute right-3 top-3 text-[10px] uppercase tracking-[0.3em] text-white/80">{despues}</span>
      <input
        type="range"
        min={0}
        max={100}
        value={Math.round(pos)}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Comparar antes y después del color"
        className="absolute inset-x-0 bottom-0 h-8 w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
