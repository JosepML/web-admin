"use client";

// Recortar una imagen de la biblioteca. El recorte se guarda como una imagen nueva (el original puede estar en uso
// y no se toca), con la misma descripción, y a la resolución original: no se pierde calidad.

import { useRef, useState } from "react";
import { useDialogos } from "@/components/admin/Dialogos";
import { img } from "@/components/comun/imagen";
import { cambiarMedio, type MedioBiblioteca } from "@/lib/admin/medios";
import { subirArchivo } from "@/lib/admin/subir";

/** Recorte en fracciones de la imagen (0 a 1), para que no dependa del tamaño en pantalla */
type Caja = { x: number; y: number; w: number; h: number };

const PROPORCIONES: { nombre: string; valor: number | null }[] = [
  { nombre: "Libre", valor: null },
  { nombre: "16:9", valor: 16 / 9 },
  { nombre: "Cine 2.39", valor: 2.39 },
  { nombre: "4:5", valor: 4 / 5 },
  { nombre: "1:1", valor: 1 },
  { nombre: "9:16", valor: 9 / 16 },
];

const MINIMO = 0.05;
const limitar = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** La caja más grande con esa proporción, centrada */
function cajaCentrada(proporcion: number, ancho: number, alto: number): Caja {
  let w = 1;
  let h = (ancho / proporcion) / alto;
  if (h > 1) {
    h = 1;
    w = (alto * proporcion) / ancho;
  }
  return { x: (1 - w) / 2, y: (1 - h) / 2, w, h };
}

export function Recortador({ medio, alTerminar, alCancelar }: { medio: MedioBiblioteca; alTerminar: (nuevo: MedioBiblioteca) => void; alCancelar: () => void }) {
  const { avisar } = useDialogos();
  const ancho = medio.ancho ?? 1600;
  const alto = medio.alto ?? 900;
  const [proporcion, setProporcion] = useState<number | null>(null);
  const [caja, setCaja] = useState<Caja>({ x: 0.05, y: 0.05, w: 0.9, h: 0.9 });
  const [guardando, setGuardando] = useState(false);
  const marco = useRef<HTMLDivElement>(null);
  const arrastre = useRef<{ modo: "mover" | "esquina"; esquina?: string; px: number; py: number; inicio: Caja } | null>(null);

  const elegir = (p: number | null) => {
    setProporcion(p);
    if (p) setCaja(cajaCentrada(p, ancho, alto));
  };

  const empezar = (e: React.PointerEvent, modo: "mover" | "esquina", esquina?: string) => {
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    arrastre.current = { modo, esquina, px: e.clientX, py: e.clientY, inicio: caja };
  };

  const mover = (e: React.PointerEvent) => {
    const a = arrastre.current;
    const r = marco.current?.getBoundingClientRect();
    if (!a || !r) return;
    const dx = (e.clientX - a.px) / r.width;
    const dy = (e.clientY - a.py) / r.height;
    const c = a.inicio;
    if (a.modo === "mover") {
      setCaja({ ...c, x: limitar(c.x + dx, 0, 1 - c.w), y: limitar(c.y + dy, 0, 1 - c.h) });
      return;
    }
    // Esquina: el lado contrario se queda fijo
    const izq = a.esquina!.includes("o");
    const arr = a.esquina!.includes("n");
    const fijoX = izq ? c.x + c.w : c.x;
    const fijoY = arr ? c.y + c.h : c.y;
    let w = limitar(izq ? c.w - dx : c.w + dx, MINIMO, izq ? fijoX : 1 - fijoX);
    let h = limitar(arr ? c.h - dy : c.h + dy, MINIMO, arr ? fijoY : 1 - fijoY);
    if (proporcion) {
      // Manda el ancho; si el alto que sale no cabe, manda el alto
      const hDeW = (w * ancho) / proporcion / alto;
      const maxH = arr ? fijoY : 1 - fijoY;
      if (hDeW <= maxH) h = Math.max(hDeW, MINIMO);
      else {
        h = maxH;
        w = (h * alto * proporcion) / ancho;
      }
    }
    setCaja({ x: izq ? fijoX - w : fijoX, y: arr ? fijoY - h : fijoY, w, h });
  };

  const soltar = () => {
    arrastre.current = null;
  };

  const guardar = async () => {
    setGuardando(true);
    try {
      // La imagen original, entera y sin pasar por el optimizador
      const respuesta = await fetch(medio.url, { mode: "cors" });
      if (!respuesta.ok) throw new Error("descarga");
      const mapa = await createImageBitmap(await respuesta.blob());
      const sx = Math.round(caja.x * mapa.width);
      const sy = Math.round(caja.y * mapa.height);
      const sw = Math.max(1, Math.round(caja.w * mapa.width));
      const sh = Math.max(1, Math.round(caja.h * mapa.height));
      const lienzo = document.createElement("canvas");
      lienzo.width = sw;
      lienzo.height = sh;
      const ctx = lienzo.getContext("2d")!;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(mapa, sx, sy, sw, sh, 0, 0, sw, sh);
      // PNG y WebP se quedan en su formato; lo demás, JPEG a calidad muy alta
      const tipo = medio.mime === "image/png" || medio.mime === "image/webp" ? medio.mime : "image/jpeg";
      const blob = await new Promise<Blob | null>((res) => lienzo.toBlob(res, tipo, 0.95));
      if (!blob) throw new Error("lienzo");
      const base = (medio.titulo || "imagen").replace(/\.[^.]+$/, "");
      const ext = tipo === "image/png" ? "png" : tipo === "image/webp" ? "webp" : "jpg";
      const nuevo = await subirArchivo(new File([blob], `${base}-recorte.${ext}`, { type: tipo }));
      const titulo = `${base} (recorte)`;
      await cambiarMedio(nuevo.id, { titulo, texto_alternativo: medio.alt });
      avisar("Recorte guardado como imagen nueva");
      alTerminar({ ...nuevo, titulo, alt: medio.alt });
    } catch (e) {
      const externa = !medio.url.includes("/storage/v1/");
      avisar(
        e instanceof Error && !["descarga", "lienzo"].includes(e.message) && !(e instanceof TypeError)
          ? e.message
          : externa
            ? "Esta imagen está guardada fuera de tu biblioteca (ImgBB o Imgur) y no se puede recortar hasta que se copie a ella."
            : "No se pudo recortar la imagen. Inténtalo otra vez.",
        "error",
      );
    }
    setGuardando(false);
  };

  const pxW = Math.round(caja.w * ancho);
  const pxH = Math.round(caja.h * alto);

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-wrap justify-center gap-1 rounded-full bg-black/30 p-1">
        {PROPORCIONES.map((p) => (
          <button
            key={p.nombre}
            type="button"
            onClick={() => elegir(p.valor)}
            className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${proporcion === p.valor ? "bg-white/15 text-white" : "text-white/55 hover:text-white/80"}`}
          >
            {p.nombre}
          </button>
        ))}
      </div>
      <div className="flex justify-center">
        <div ref={marco} className="relative touch-none select-none" onPointerMove={mover} onPointerUp={soltar} onPointerCancel={soltar}>
          <img src={img(medio.url, 1080)} alt="" draggable={false} className="block max-h-[52svh] w-auto rounded-[12px]" />
          {/* Lo que queda fuera, oscurecido con la sombra enorme de una caja igual, recortada a la imagen */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[12px]">
            <div
              className="absolute shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]"
              style={{ left: `${caja.x * 100}%`, top: `${caja.y * 100}%`, width: `${caja.w * 100}%`, height: `${caja.h * 100}%` }}
            />
          </div>
          <div
            className="absolute cursor-move rounded-[2px] outline outline-2 outline-white"
            style={{ left: `${caja.x * 100}%`, top: `${caja.y * 100}%`, width: `${caja.w * 100}%`, height: `${caja.h * 100}%` }}
            onPointerDown={(e) => empezar(e, "mover")}
          >
            {/* Tercios */}
            <span className="pointer-events-none absolute inset-y-0 left-1/3 w-px bg-white/35" />
            <span className="pointer-events-none absolute inset-y-0 left-2/3 w-px bg-white/35" />
            <span className="pointer-events-none absolute inset-x-0 top-1/3 h-px bg-white/35" />
            <span className="pointer-events-none absolute inset-x-0 top-2/3 h-px bg-white/35" />
            {["no", "ne", "so", "se"].map((q) => (
              <span
                key={q}
                onPointerDown={(e) => empezar(e, "esquina", q)}
                className={`absolute h-5 w-5 rounded-full border-2 border-white bg-[var(--jm-acento)] shadow ${q.includes("n") ? "-top-2.5" : "-bottom-2.5"} ${q.includes("o") ? "-left-2.5" : "-right-2.5"} ${
                  q === "no" || q === "se" ? "cursor-nwse-resize" : "cursor-nesw-resize"
                }`}
                aria-hidden
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-white/60">
          {pxW} × {pxH} px{pxW < 1920 && pxW < ancho ? " · para pantalla completa conviene al menos 1920 de ancho" : ""}
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={alCancelar} className="boton px-4 py-2 text-sm text-white/70 hover:bg-white/10">
            Cancelar
          </button>
          <button type="button" onClick={guardar} disabled={guardando} className="boton boton-acento px-5 py-2 text-sm disabled:opacity-50">
            {guardando ? "Guardando…" : "Guardar recorte"}
          </button>
        </div>
      </div>
    </div>
  );
}
