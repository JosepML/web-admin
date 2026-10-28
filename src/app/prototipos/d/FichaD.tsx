"use client";

import { useReducir } from "../_comun/hooks";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { Enlace } from "../_comun/Enlace";
import { CABECERA } from "../_comun/Transicion";
import { VideoFondo } from "../_comun/VideoFondo";
import { fichaTecnicaD, PROYECTOS, SERVICIOS, type ProyectoD } from "./datos";
import { Icono } from "./Iconos";
import { Pie } from "./bloques/BloquesPersonales";
import { RAIZ } from "./rutas";
import { CURVA, ModalVideo, Revelar, TituloConAcento } from "./piezas";
import { Visor } from "./Visor";
import { img } from "../_comun/imagen";
import { TEXTOS } from "./textos";

/** Negrita **así** y cursiva *así* dentro de un texto de proyecto */
function Inline({ texto }: { texto: string }) {
  return (
    <>
      {texto.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((t, i) =>
        t.startsWith("**") ? <strong key={i}>{t.slice(2, -2)}</strong> : t.startsWith("*") && t.length > 2 ? <em key={i}>{t.slice(1, -1)}</em> : t,
      )}
    </>
  );
}

/** Fila de la ficha: etiqueta a la izquierda en escritorio y el contenido a la derecha */
function Bloque({ etiqueta, children }: { etiqueta: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-5 border-t border-[var(--d-linea)] pt-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
      <Revelar>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--d-acento)] lg:pt-2">{etiqueta}</p>
      </Revelar>
      <Revelar retraso={0.06}>{children}</Revelar>
    </div>
  );
}

export function FichaD({ proyecto: p }: { proyecto: ProyectoD }) {
  const reducir = useReducir();
  const [video, setVideo] = useState(false);
  const [foto, setFoto] = useState<number | null>(null);
  const siguiente = PROYECTOS[(PROYECTOS.findIndex((x) => x.slug === p.slug) + 1) % PROYECTOS.length];
  const servicios = SERVICIOS.filter((s) => p.servicios.includes(s.slug));
  const textos = TEXTOS[p.slug];
  const entrar = (retraso: number) => ({
    initial: { opacity: 0, y: reducir ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: retraso, duration: 0.9, ease: CURVA },
  });

  return (
    <main>
      {/* La imagen de la tarjeta aterriza exactamente aquí (ver CABECERA en la transición) */}
      <header
        className="relative overflow-hidden bg-black"
        style={{
          margin: CABECERA.margen,
          height: `calc(${CABECERA.alto * 100}svh - ${CABECERA.margen}px)`,
          borderRadius: CABECERA.radio,
        }}
      >
        <VideoFondo id={p.youtubeId} inicio={p.inicioClip} poster={p.poster} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />
        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-6 p-6 text-white sm:p-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <motion.div {...entrar(0.25)} className="flex flex-wrap gap-2">
              <span className="rounded-full border border-white/20 bg-black/35 px-3.5 py-1.5 text-xs font-medium">
                {p.tipo}
                {p.anio ? ` · ${p.anio}` : ""}
              </span>
              {p.laurel && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/35 px-3.5 py-1.5 text-xs font-medium">
                  <Icono nombre="laurel" className="h-3.5 w-3.5 text-[#ffcf7a]" />
                  {p.laurel.premio} · {p.laurel.festival}
                </span>
              )}
            </motion.div>
            <motion.h1 {...entrar(0.35)} className="mt-4 max-w-4xl pb-[0.06em] text-[clamp(2.5rem,7vw,6.5rem)] font-extrabold leading-[1] tracking-[-0.05em] [text-wrap:balance]">
              {p.titulo}
            </motion.h1>
          </div>
          {p.youtubeId && (
          <motion.button
            {...entrar(0.5)}
            type="button"
            onClick={() => setVideo(true)}
            className="boton self-start border border-white/25 bg-white/15 px-6 py-3.5 text-sm text-white backdrop-blur-xl hover:bg-white/25 lg:self-auto"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-black">
              <Icono nombre="play" className="ml-0.5 h-3 w-3" />
            </span>
            Ver completo
          </motion.button>
          )}
        </div>
      </header>

      {/* Ficha técnica de cristal que monta sobre la cabecera */}
      <motion.section {...entrar(0.6)} className="relative z-10 mx-auto -mt-16 max-w-6xl px-4 sm:px-8">
        <dl className="cristal cristal-fuerte grid grid-cols-2 gap-px overflow-hidden rounded-[32px] sm:grid-cols-3">
          {fichaTecnicaD(p).map(([k, v]) => (
            <div key={k} className="p-5 sm:p-6">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--d-tenue)]">{k}</dt>
              <dd className={`mt-1.5 text-[15px] font-semibold ${v === "Pendiente" ? "text-[var(--d-tenue)]" : ""}`}>{v}</dd>
            </div>
          ))}
        </dl>
      </motion.section>

      <section className="mx-auto max-w-3xl px-4 pb-16 pt-20 text-center sm:px-8 sm:pt-28">
        <Revelar>
          <p className="text-[clamp(1.1rem,1.6vw,1.35rem)] leading-[1.55] text-[var(--d-suave)] [text-wrap:balance]">
            {textos ? <Inline texto={textos.tarjeta} /> : p.frase}
          </p>
        </Revelar>
      </section>

      {/* Cuerpo de la ficha: etiqueta a la izquierda y contenido a la derecha, como un dosier */}
      {textos && (
        <section className="px-4 pb-24 sm:px-8">
          <div className="mx-auto max-w-6xl space-y-14">
            {textos.proyecto.length > 0 && (
              <Bloque etiqueta="El proyecto">
                <div className="space-y-4 text-[17px] leading-[1.65] sm:text-lg [text-wrap:pretty]">
                  {textos.proyecto.map((x) => (
                    <p key={x}>
                      <Inline texto={x} />
                    </p>
                  ))}
                </div>
              </Bloque>
            )}

            {textos.decisiones.length > 0 && (
              <Bloque etiqueta="Decisiones clave">
                <div className="grid gap-3 sm:grid-cols-2">
                  {textos.decisiones.map((d, i) => (
                    <Revelar key={d.titulo + i} retraso={i * 0.06} className="sm:[&:last-child:nth-child(odd)]:col-span-2">
                      <article className="cristal h-full rounded-[28px] p-6 sm:p-7">
                        <span className="text-sm font-semibold tabular-nums text-[var(--d-acento)]">{String(i + 1).padStart(2, "0")}</span>
                        {d.titulo && <h3 className="mt-3 text-xl font-extrabold leading-[1.2] tracking-[-0.03em]">{d.titulo}</h3>}
                        <p className="mt-2 text-base leading-[1.6] text-[var(--d-suave)] [text-wrap:pretty]">
                          <Inline texto={d.texto} />
                        </p>
                      </article>
                    </Revelar>
                  ))}
                </div>
              </Bloque>
            )}

            {textos.reto && (
              <Bloque etiqueta="El reto">
                <p className="text-[17px] leading-[1.65] sm:text-lg [text-wrap:pretty]">
                  <Inline texto={textos.reto} />
                </p>
              </Bloque>
            )}

            {textos.resultado.length > 0 && (
              <Bloque etiqueta="Resultado">
                <ul className="grid gap-3 sm:grid-cols-2">
                  {textos.resultado.map((r) => (
                    <li key={r} className="cristal cristal-fuerte sm:[&:last-child:nth-child(odd)]:col-span-2 flex items-start gap-3 rounded-[24px] p-5 text-[17px] leading-[1.5] sm:text-lg">
                      <Icono nombre="laurel" className="mt-0.5 h-5 w-5 shrink-0 text-[var(--d-acento)]" />
                      <span>
                        <Inline texto={r} />
                      </span>
                    </li>
                  ))}
                </ul>
              </Bloque>
            )}
          </div>
        </section>
      )}

      {/* Conclusión: frase corta con la última palabra en cursiva */}
      <section className="mx-auto max-w-5xl px-4 pb-24 text-center sm:px-8">
        <Revelar>
          <p className="text-[clamp(1.7rem,3.6vw,3rem)] font-bold leading-[1.15] tracking-[-0.03em] [text-wrap:balance]">
            <TituloConAcento texto={p.frase} />
          </p>
        </Revelar>
      </section>

      {/* Fotogramas: cuadrícula de miniaturas; al pulsar una se abre el visor a pantalla completa */}
      <section className="px-4 pb-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <Revelar>
            <h2 className="text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">Fotogramas</h2>
          </Revelar>
          <div className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
            {p.fotogramas.map((f, i) => (
              <Revelar key={f} retraso={Math.min(i, 7) * 0.05}>
                <button
                  type="button"
                  onClick={() => setFoto(i)}
                  className="group relative block aspect-video w-full overflow-hidden rounded-[18px] bg-black"
                  aria-label={`Ver el fotograma ${i + 1} en grande`}
                >
                  <img
                    src={img(f, 828)}
                    alt={`Fotograma de ${p.titulo}`}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition-[opacity,background-color] duration-300 group-hover:bg-black/25 group-hover:opacity-100">
                    <Icono nombre="ampliar" className="h-6 w-6" />
                  </span>
                </button>
              </Revelar>
            ))}
          </div>
        </div>
      </section>

      {/* Venta: el servicio que hay detrás de este trabajo */}
      <section className="px-4 sm:px-8">
        <Revelar className="mx-auto max-w-7xl">
          <div className="cristal relative flex flex-col gap-6 overflow-hidden rounded-[40px] p-8 sm:flex-row sm:items-center sm:justify-between sm:p-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,var(--d-orbe-a),transparent)]" />
            <div className="relative">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--d-acento)]">
                {servicios.map((s) => s.nombre).join(" · ")}
              </p>
              <h2 className="mt-2 text-3xl font-extrabold leading-[1.1] tracking-[-0.04em] sm:text-4xl">
                <TituloConAcento texto="¿Quieres algo así para tu proyecto?" />
              </h2>
            </div>
            <Link href={`${RAIZ}#llamada`} className="boton boton-acento relative self-start px-7 py-3.5 text-sm sm:self-auto">
              Hablemos
              <Icono nombre="flecha" className="h-4 w-4" />
            </Link>
          </div>
        </Revelar>
      </section>

      {/* Siguiente proyecto */}
      <section className="px-4 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-semibold text-[var(--d-suave)]">Siguiente proyecto</p>
          <Enlace href={`${RAIZ}/${siguiente.slug}`} className="group block">
            <div data-radio data-foco className="relative aspect-[2.39/1] overflow-hidden rounded-[40px] bg-black">
              <img
                data-transicion
                src={img(siguiente.poster, 3840)}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 z-[3] flex items-end justify-between gap-4 p-6 text-white sm:p-10">
                <h3 className="pb-[0.06em] text-3xl font-extrabold leading-[1.05] tracking-[-0.045em] sm:text-6xl">{siguiente.titulo}</h3>
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/15 backdrop-blur-xl transition-transform duration-500 group-hover:scale-110">
                  <Icono nombre="flecha" className="h-5 w-5" />
                </span>
              </div>
            </div>
          </Enlace>
        </div>
      </section>

      <Pie />
      {p.youtubeId && <ModalVideo id={p.youtubeId} abierto={video} alCerrar={() => setVideo(false)} />}

      <Visor fotos={p.fotogramas} indice={foto} alCambiar={setFoto} titulo={p.titulo} />
    </main>
  );
}
