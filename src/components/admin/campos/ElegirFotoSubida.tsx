"use client";

// Antes de subir fotos nuevas, se elige el punto de interés de cada una (una detrás de otra). Se guarda con la
// foto. Se puede dejar sin punto (centro) o cancelar la subida entera.

import { useEffect, useMemo, useState } from "react";
import { SelectorPunto, VistasRecorte, type Foco } from "../biblioteca/PuntoDeInteres";

export function ElegirFotoSubida({ archivos, alTerminar }: { archivos: File[]; alTerminar: (focos: Foco[] | null) => void }) {
  const [paso, setPaso] = useState(0);
  const [elegidos, setElegidos] = useState<Foco[]>([]);
  const [actual, setActual] = useState<Foco>(null);
  const archivo = archivos[paso];
  const url = useMemo(() => URL.createObjectURL(archivo), [archivo]);
  useEffect(() => () => URL.revokeObjectURL(url), [url]);

  const seguir = (foco: Foco) => {
    const lista = [...elegidos, foco];
    if (paso + 1 >= archivos.length) return alTerminar(lista);
    setElegidos(lista);
    setPaso(paso + 1);
    setActual(null);
  };

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && alTerminar(null);
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [alTerminar]);

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-2 backdrop-blur-sm sm:items-center sm:p-6" onClick={() => alTerminar(null)}>
      <div role="dialog" aria-label="Punto de interés" onClick={(e) => e.stopPropagation()} className="cristal cristal-fuerte flex max-h-[92svh] w-full max-w-2xl flex-col gap-4 overflow-y-auto rounded-[32px] p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold tracking-[-0.03em]">Punto de interés</h2>
            <p className="mt-1 text-xs text-[var(--jm-tenue)]">
              {paso + 1} de {archivos.length} · {archivo.name}
            </p>
          </div>
          <button type="button" onClick={() => alTerminar(null)} className="text-xs font-semibold text-[var(--jm-suave)] underline-offset-4 hover:underline">
            Cancelar subida
          </button>
        </div>
        <p className="text-sm text-[var(--jm-suave)]">Pulsa o arrastra sobre la foto. Es lo que se verá al recortarla para tarjetas y portadas.</p>
        <SelectorPunto src={url} valor={actual} alCambiar={setActual} />
        <VistasRecorte src={url} foco={actual} />
        <div className="mt-auto flex flex-wrap justify-end gap-2 pt-2">
          <button type="button" onClick={() => seguir(null)} className="boton boton-suave px-4 py-2.5 text-sm">
            Sin punto (centro)
          </button>
          <button type="button" onClick={() => seguir(actual)} disabled={!actual} className="boton boton-acento px-5 py-2.5 text-sm disabled:opacity-40">
            {paso + 1 === archivos.length ? "Subir" : "Siguiente"}
          </button>
        </div>
      </div>
    </div>
  );
}
