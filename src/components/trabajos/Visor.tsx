"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { marcarVideoAbierto, useReducir } from "../comun/hooks";
import { img } from "../comun/imagen";
import { Icono } from "../Iconos";
import { CURVA } from "../piezas";

/**
 * Visor de fotogramas a pantalla completa: fondo oscuro, flechas, teclado (← → y Esc), deslizar con el
 * dedo y cierre con fundido. La foto se sirve a 3840 px; la siguiente y la anterior se precargan para
 * que el paso sea inmediato.
 */
export function Visor({
  fotos,
  indice,
  alCambiar,
  titulo,
}: {
  fotos: string[];
  indice: number | null;
  alCambiar: (i: number | null) => void;
  titulo: string;
}) {
  const reducir = useReducir();
  const abierto = indice !== null;
  // Sentido del último paso, para que la foto entre por el lado correcto
  const [sentido, setSentido] = useState(1);
  const ir = (dir: number) => {
    if (indice === null) return;
    setSentido(dir);
    alCambiar((indice + dir + fotos.length) % fotos.length);
  };

  useEffect(() => {
    if (!abierto) return;
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") alCambiar(null);
      if (e.key === "ArrowRight") ir(1);
      if (e.key === "ArrowLeft") ir(-1);
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  });

  // Sin scroll de la página detrás, y la página parada (vídeo de la cabecera, orbes) mientras se ven las fotos
  useEffect(() => {
    if (!abierto) return;
    marcarVideoAbierto(true);
    const antes = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      marcarVideoAbierto(false);
      document.documentElement.style.overflow = antes;
    };
  }, [abierto]);

  // Va a la raíz de la web, por encima del menú
  const [raiz, setRaiz] = useState<HTMLElement | null>(null);
  useEffect(() => setRaiz(document.querySelector<HTMLElement>(".jm-raiz") ?? document.body), []);

  // Precarga de las vecinas
  useEffect(() => {
    if (indice === null || fotos.length < 2) return;
    for (const d of [1, -1]) {
      const i = new Image();
      i.src = img(fotos[(indice + d + fotos.length) % fotos.length], 3840);
    }
  }, [indice, fotos]);

  const desplazamiento = reducir ? 0 : 60;
  if (!raiz) return null;

  return createPortal(
    <AnimatePresence>
      {abierto && (
        <motion.div
          role="dialog"
          aria-modal
          aria-label={`Fotogramas de ${titulo}`}
          className="fixed inset-0 z-[120] bg-[#050506]/[0.96]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: CURVA }}
          onClick={() => alCambiar(null)}
        >
          <div className="absolute inset-0 flex items-center justify-center p-4 sm:px-24 sm:py-16">
            <AnimatePresence initial={false} custom={sentido} mode="popLayout">
              <motion.img
                key={fotos[indice]}
                src={img(fotos[indice], 3840)}
                alt={`Fotograma ${indice + 1} de ${titulo}`}
                draggable={false}
                className="max-h-full max-w-full select-none rounded-[14px] object-contain shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]"
                custom={sentido}
                variants={{
                  entra: (s: number) => ({ opacity: 0, x: s * desplazamiento, scale: 0.98 }),
                  quieta: { opacity: 1, x: 0, scale: 1 },
                  sale: (s: number) => ({ opacity: 0, x: -s * desplazamiento, scale: 0.98 }),
                }}
                initial="entra"
                animate="quieta"
                exit="sale"
                transition={{ duration: 0.45, ease: CURVA }}
                onClick={(e) => e.stopPropagation()}
                // Deslizar con el dedo (o arrastrar con el ratón) para pasar
                drag={fotos.length > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.5}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60 || info.velocity.x < -400) ir(1);
                  else if (info.offset.x > 60 || info.velocity.x > 400) ir(-1);
                }}
              />
            </AnimatePresence>
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-4 text-white sm:p-6">
            <span className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold tabular-nums tracking-wide">
              {indice + 1} / {fotos.length}
            </span>
            <button
              type="button"
              aria-label="Cerrar"
              onClick={() => alCambiar(null)}
              className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 transition-[background-color,transform] duration-300 hover:scale-105 hover:bg-white/20"
            >
              <Icono nombre="cerrar" className="h-5 w-5" />
            </button>
          </div>

          {fotos.length > 1 &&
            ([-1, 1] as const).map((dir) => (
              <button
                key={dir}
                type="button"
                aria-label={dir === -1 ? "Fotograma anterior" : "Fotograma siguiente"}
                onClick={(e) => {
                  e.stopPropagation();
                  ir(dir);
                }}
                className={`absolute top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-[background-color,transform] duration-300 hover:scale-105 hover:bg-white/20 sm:flex ${
                  dir === -1 ? "left-6" : "right-6"
                }`}
              >
                <Icono nombre={dir === -1 ? "izquierda" : "derecha"} className="h-5 w-5" />
              </button>
            ))}
        </motion.div>
      )}
    </AnimatePresence>,
    raiz,
  );
}
