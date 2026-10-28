"use client";

// Punto de interés de una foto: lo que tiene que quedar visible cuando la foto se recorta a un formato (tarjeta,
// portada, cabecera). Se marca pulsando o arrastrando sobre la foto. Lo usan la biblioteca (guarda al soltar) y la
// subida de fotos nuevas (se guarda con la foto). Abajo se ve cómo queda en un 16:9 y en un 4:5.

import { useRef, useState } from "react";
import { enfoque, img } from "@/components/comun/imagen";
import { useDialogos } from "@/components/admin/Dialogos";
import { cambiarFoco, type MedioBiblioteca } from "@/lib/admin/medios";

export type Foco = { x: number; y: number } | null;

const limitar = (v: number) => Math.min(100, Math.max(0, v));

/** La foto con su punto: se pulsa o se arrastra. `alCambiar` avisa mientras se mueve y `alSoltar` al terminar */
export function SelectorPunto({ src, valor, alCambiar, alSoltar }: { src: string; valor: Foco; alCambiar: (p: Foco) => void; alSoltar?: (p: Foco) => void }) {
  const [arrastrando, setArrastrando] = useState(false);
  const marco = useRef<HTMLDivElement>(null);

  const enFoto = (e: React.PointerEvent): { x: number; y: number } | null => {
    const r = marco.current?.getBoundingClientRect();
    if (!r || !r.width) return null;
    return { x: limitar(((e.clientX - r.left) / r.width) * 100), y: limitar(((e.clientY - r.top) / r.height) * 100) };
  };

  const empezar = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setArrastrando(true);
    const p = enFoto(e);
    if (p) alCambiar(p);
  };

  const mover = (e: React.PointerEvent) => {
    if (!arrastrando) return;
    const p = enFoto(e);
    if (p) alCambiar(p);
  };

  const soltar = (e: React.PointerEvent) => {
    if (!arrastrando) return;
    setArrastrando(false);
    const p = enFoto(e);
    if (p) {
      alCambiar(p);
      alSoltar?.(p);
    }
  };

  return (
    <div
      ref={marco}
      className="relative mx-auto w-fit max-w-full cursor-crosshair touch-none select-none overflow-hidden rounded-[14px] ring-1 ring-[var(--jm-borde)]"
      onPointerDown={empezar}
      onPointerMove={mover}
      onPointerUp={soltar}
      onPointerCancel={() => setArrastrando(false)}
    >
      <img src={src} alt="" draggable={false} className="block h-auto max-h-[55svh] max-w-full" />
      {valor && (
        <span
          className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[var(--jm-acento)] shadow-[0_0_0_4px_rgba(0,0,0,0.25)]"
          style={{ left: `${valor.x}%`, top: `${valor.y}%` }}
        />
      )}
    </div>
  );
}

/** Dónde queda el punto en un 16:9 y en un 4:5, como lo recortan las tarjetas y las portadas */
export function VistasRecorte({ src, foco }: { src: string; foco: Foco }) {
  return (
    <div className="mt-3 grid grid-cols-2 gap-3">
      {[
        { nombre: "16:9", clase: "aspect-[16/9]" },
        { nombre: "4:5", clase: "aspect-[4/5]" },
      ].map((v) => (
        <figure key={v.nombre} className="min-w-0">
          <div className={`${v.clase} overflow-hidden rounded-[12px] ring-1 ring-[var(--jm-borde)]`}>
            <img src={src} alt="" draggable={false} className="h-full w-full object-cover" style={enfoque({ foco })} />
          </div>
          <figcaption className="mt-1 text-center text-[11px] text-[var(--jm-tenue)]">{v.nombre}</figcaption>
        </figure>
      ))}
    </div>
  );
}

export function PuntoDeInteres({ medio, alCambiar }: { medio: MedioBiblioteca; alCambiar: (c: Partial<MedioBiblioteca>) => void }) {
  const { avisar } = useDialogos();
  const [foco, setFoco] = useState<Foco>(medio.foco ?? null);

  const guardar = async (nuevo: Foco) => {
    const r = await cambiarFoco(medio.id, nuevo);
    if (!r.ok) return avisar(r.error, "error");
    alCambiar({ foco: nuevo });
  };

  const centrar = async () => {
    setFoco(null);
    const r = await cambiarFoco(medio.id, null);
    if (!r.ok) return avisar(r.error, "error");
    alCambiar({ foco: null });
    avisar("Foto centrada");
  };

  return (
    <div className="block">
      <div className="flex items-center justify-between gap-3">
        <span className="campo-etiqueta">Punto de interés</span>
        {foco && (
          <button type="button" onClick={centrar} className="text-xs font-semibold text-[var(--jm-suave)] underline-offset-4 hover:underline">
            Centrar
          </button>
        )}
      </div>
      <div className="mt-1.5">
        <SelectorPunto src={img(medio.url, 640)} valor={foco} alCambiar={setFoco} alSoltar={guardar} />
      </div>
      <p className="campo-ayuda">Pulsa o arrastra sobre la foto. Es lo que se ve al recortarla para tarjetas, portadas y cabeceras.</p>
      <VistasRecorte src={img(medio.url, 640)} foco={foco} />
    </div>
  );
}
