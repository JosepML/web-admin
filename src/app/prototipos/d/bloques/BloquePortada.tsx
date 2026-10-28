"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePantallaAncha, useReducir } from "../../_comun/hooks";
import { VideoFondo } from "../../_comun/VideoFondo";
import { AJUSTES, type Bloque } from "../datos";
import { Icono } from "../Iconos";
import { CURVA, Disponible, ModalVideo } from "../piezas";

const PAPELES = ["director de fotografía", "filmmaker", "editor"];

/**
 * Portada: el reel en una tarjeta redondeada. Ya no se queda fijada: la página baja con el scroll normal
 * y, mientras se va, la tarjeta se aleja un poco y el texto sube y se funde. La siguiente sección entra
 * en cuanto empiezas a bajar.
 */
export function BloquePortada({ bloque }: { bloque: Bloque }) {
  const { antetitulo, titulo, texto } = bloque.datos;
  const ref = useRef<HTMLElement>(null);
  const reducir = useReducir();
  const ancha = usePantallaAncha();
  const anima = ancha && !reducir;
  const [reel, setReel] = useState(false);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Solo transform y opacidad, que no recalculan nada al hacer scroll
  const escala = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const yTexto = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const opTexto = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const opPista = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  const palabras = titulo.trim().split(/\s+/);

  return (
    <section ref={ref} className="relative">
      <div className="relative h-svh min-h-[600px] p-2 sm:p-3">
        <motion.div
          className="relative h-full w-full overflow-hidden rounded-[28px] bg-black [will-change:transform] sm:rounded-[36px]"
          style={anima ? { scale: escala } : undefined}
        >
          {/* El reel provisional es panorámico con bandas negras y subtítulos dentro: se recorta más para ocultarlos */}
          <VideoFondo id={AJUSTES.reel.youtubeId} inicio={AJUSTES.reel.inicio} poster={AJUSTES.reel.poster} escala={1.45} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_85%,rgba(229,9,20,0.2),transparent_60%)]" />

          {/* Texto principal */}
          <motion.div
            className="absolute inset-x-0 bottom-0 z-10 px-5 pb-20 text-white sm:px-12 sm:pb-24"
            style={anima ? { y: yTexto, opacity: opTexto } : undefined}
          >
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8, ease: CURVA }}>
              <Disponible className="!border-white/20 !bg-white/10 text-white" />
            </motion.div>
            {antetitulo && (
              <motion.p
                className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 sm:text-[13px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.8 }}
              >
                {antetitulo}
              </motion.p>
            )}
            <h1 className="mt-3 max-w-6xl text-[clamp(2.9rem,9.5vw,9rem)] font-extrabold leading-[0.95] tracking-[-0.05em]">
              {palabras.map((p, i) => {
                const ultima = i === palabras.length - 1;
                const [, palabra, signos] = ultima ? (p.match(/^(.*?)([?!.,:…]*)$/) ?? [, p, ""]) : [, p, ""];
                return (
                  <motion.span
                    key={`${p}-${i}`}
                    className="mr-[0.22em] inline-block pb-[0.08em]"
                    initial={{ opacity: 0, y: reducir ? 0 : 40, filter: reducir ? "none" : "blur(12px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.45 + i * 0.09, duration: 1, ease: CURVA }}
                  >
                    {ultima ? (
                      <>
                        <span className="d-serif bg-gradient-to-r from-[#ff5a4d] to-[#ffb36b] bg-clip-text pr-[0.12em] text-[1.06em] font-normal tracking-[-0.02em] text-transparent">
                          {palabra}
                        </span>
                        {/* El relleno evita que se corte la cursiva; el margen negativo pega el punto a la palabra */}
                        {signos && <span className="-ml-[0.1em]">{signos}</span>}
                      </>
                    ) : (
                      p
                    )}
                  </motion.span>
                );
              })}
            </h1>

            <div className="mt-7 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <motion.div
                className="max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.9, ease: CURVA }}
              >
                {/* "Soy" en la letra base, discreto; la palabra que rota en la cursiva artística, más grande */}
                <p className="flex items-baseline gap-[0.3em] text-[clamp(1.6rem,2.6vw,2.4rem)] font-bold leading-none tracking-[-0.03em] text-white">
                  Soy <PalabraRotatoria palabras={PAPELES} />
                </p>
                {texto && <p className="mt-3 max-w-lg text-[17px] leading-[1.6] text-white/80 [text-wrap:pretty] sm:text-lg">{texto}</p>}
              </motion.div>

              <motion.div
                className="flex flex-wrap items-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.05, duration: 0.9, ease: CURVA }}
              >
                <button
                  type="button"
                  onClick={() => setReel(true)}
                  className="boton border border-white/25 bg-white/10 px-5 py-3.5 text-sm text-white backdrop-blur-xl hover:bg-white/20"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-black">
                    <Icono nombre="play" className="ml-0.5 h-3 w-3" />
                  </span>
                  Ver reel
                </button>
                <Link href="#trabajos" className="boton border border-white/25 bg-white/10 px-6 py-3.5 text-sm text-white backdrop-blur-xl hover:bg-white/20">
                  Ver trabajos
                </Link>
                <Link href="#llamada" className="boton boton-acento px-6 py-3.5 text-sm">
                  Hablemos
                  <Icono nombre="flecha" className="h-4 w-4" />
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Indicador de scroll: una línea fina por la que baja una luz */}
          <motion.a
            href="#servicios"
            aria-label="Bajar"
            style={{ opacity: opPista }}
            className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-white/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 1 }}
          >
            <span className="relative h-10 w-px overflow-hidden bg-white/25">
              {!reducir && (
                <motion.span
                  className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-transparent via-white to-transparent"
                  animate={{ y: [-16, 40] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
                />
              )}
            </span>
            Desliza
          </motion.a>
        </motion.div>
      </div>
      <ModalVideo id={AJUSTES.reel.youtubeId} abierto={reel} alCerrar={() => setReel(false)} />
    </section>
  );
}

/**
 * Palabra que cambia con un fundido cruzado lento: la nueva sube un poco y se enfoca mientras la otra
 * se va. Todas las palabras ocupan la misma celda (invisibles) para que la línea no cambie de ancho.
 */
function PalabraRotatoria({ palabras }: { palabras: string[] }) {
  const [i, setI] = useState(0);
  const reducir = useReducir();

  useEffect(() => {
    const t = window.setInterval(() => setI((n) => (n + 1) % palabras.length), 3400);
    return () => window.clearInterval(t);
  }, [palabras.length]);

  return (
    <span className="d-serif relative inline-grid text-[1.24em] leading-none font-normal tracking-[-0.01em]">
      {palabras.map((p) => (
        <span key={p} className="invisible whitespace-nowrap pr-[0.1em] [grid-area:1/1]" aria-hidden>
          {p}
        </span>
      ))}
      <AnimatePresence initial={false}>
        <motion.span
          key={palabras[i]}
          className="whitespace-nowrap bg-gradient-to-r from-[#ff3b30] via-[#ff6a4d] to-[#ffb36b] bg-clip-text pb-[0.1em] pr-[0.1em] text-transparent [filter:drop-shadow(0_0_18px_rgba(255,80,60,0.35))] [grid-area:1/1]"
          initial={{ opacity: 0, y: reducir ? 0 : "0.35em", filter: reducir ? "none" : "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.1, ease: CURVA, delay: 0.25 } }}
          exit={{ opacity: 0, y: reducir ? 0 : "-0.3em", filter: reducir ? "none" : "blur(6px)", transition: { duration: 0.8, ease: CURVA } }}
        >
          {palabras[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
