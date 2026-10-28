"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { useReducir } from "../../_comun/hooks";
import { ICONOS_SERVICIO } from "../bloques/BloqueServicios";
import { TarjetaProyecto } from "../bloques/BloqueTrabajos";
import { BloqueLlamada, Pie } from "../bloques/BloquesPersonales";
import { imagenesDe, proyectosDe, SERVICIOS, type ServicioD } from "../datos";
import { Icono } from "../Iconos";
import { RAIZ } from "../rutas";
import { CURVA, Diapositivas, Revelar, Titular } from "../piezas";
import { img } from "../../_comun/imagen";

const TITULO_MIRADA: Record<string, string> = {
  "direccion-de-fotografia": "Decido qué siente quien mira",
  filmmaker: "Con tu equipo, o de principio a fin",
  edicion: "Monto con el ritmo por dentro",
};

/**
 * Página de un servicio (en la web final, /servicios/<slug>): qué hago, cómo lo veo, para quién,
 * sus proyectos, cómo trabajamos, preguntas frecuentes y la llamada con el servicio ya marcado.
 */
export function PaginaServicio({ servicio: s }: { servicio: ServicioD }) {
  const reducir = useReducir();
  const proyectos = proyectosDe(s.slug);
  const otros = SERVICIOS.filter((x) => x.slug !== s.slug);
  const entrar = (retraso: number) => ({
    initial: { opacity: 0, y: reducir ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: retraso, duration: 0.9, ease: CURVA },
  });

  return (
    <main>
      <header className="relative m-2 h-[82svh] min-h-[560px] overflow-hidden rounded-[28px] bg-black sm:m-3 sm:rounded-[40px]">
        <Diapositivas imagenes={imagenesDe(s.slug)} activo intervalo={3800} ancho={3840} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/30" />
        <div className="absolute inset-x-0 bottom-0 z-10 p-6 pb-10 text-white sm:p-12 sm:pb-14">
          <motion.div {...entrar(0.15)} className="flex items-center gap-3">
            <Link href={`${RAIZ}#servicios`} className="rounded-full border border-white/20 bg-black/35 px-3.5 py-1.5 text-xs font-medium hover:bg-black/50">
              ← Servicios
            </Link>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/15">
              <Icono nombre={ICONOS_SERVICIO[s.slug]} className="h-5 w-5" />
            </span>
          </motion.div>
          <motion.h1
            {...entrar(0.25)}
            className="mt-5 max-w-4xl pb-[0.06em] text-[clamp(2.6rem,8vw,7rem)] font-extrabold leading-[1] tracking-[-0.05em] [text-wrap:balance]"
          >
            {s.nombre}
          </motion.h1>
          <motion.p {...entrar(0.35)} className="mt-3 text-xl font-medium text-[#ffb36b] sm:text-2xl">
            {s.frase}
          </motion.p>
          <motion.div {...entrar(0.45)} className="mt-7 flex flex-wrap gap-3">
            <a href="#proyectos" className="boton border border-white/25 bg-white/10 px-6 py-3.5 text-sm text-white backdrop-blur-xl hover:bg-white/20">
              Ver proyectos
            </a>
            <a href="#llamada" className="boton boton-acento px-6 py-3.5 text-sm">
              Hablemos de tu proyecto
              <Icono nombre="flecha" className="h-4 w-4" />
            </a>
          </motion.div>
        </div>
      </header>

      {/* Mi mirada */}
      <section className="px-4 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <Titular antetitulo="Mi mirada" titulo={TITULO_MIRADA[s.slug] ?? s.nombre} />
          <div className="flex flex-col gap-6">
            {s.mirada.map((parrafo, i) => (
              <Revelar key={i} retraso={i * 0.08}>
                <p className={`leading-[1.65] [text-wrap:pretty] ${i === 0 ? "text-xl font-medium sm:text-2xl" : "text-lg text-[var(--d-suave)]"}`}>{parrafo}</p>
              </Revelar>
            ))}
          </div>
        </div>
      </section>

      {/* Lo que aporto y con quién trabajo */}
      <section className="px-4 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-3 lg:grid-cols-[1.3fr_1fr]">
          <Revelar>
            <div data-foco className="cristal h-full rounded-[36px] p-8 sm:p-10">
              <h2 className="text-2xl font-bold tracking-[-0.03em]">Lo que aporto</h2>
              <ul className="mt-6 flex flex-col gap-4">
                {s.aporto.map((a) => (
                  <li key={a} className="flex gap-3 text-[17px] leading-snug">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--d-acento)] text-[11px] font-bold text-white">✓</span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </Revelar>
          <Revelar retraso={0.1}>
            <div data-foco className="cristal flex h-full flex-col rounded-[36px] p-8 sm:p-10">
              <h2 className="text-2xl font-bold tracking-[-0.03em]">Con quién trabajo</h2>
              <p className="mt-5 text-[17px] leading-relaxed text-[var(--d-suave)] [text-wrap:pretty]">{s.conQuien}</p>
              <div className="mt-auto flex flex-wrap gap-2 pt-8">
                {s.paraQuien.map((q) => (
                  <span key={q} className="rounded-full border border-[var(--d-borde)] bg-[var(--d-cristal)] px-4 py-2 text-sm font-medium">
                    {q}
                  </span>
                ))}
              </div>
            </div>
          </Revelar>
        </div>
      </section>

      {/* Proyectos de este servicio */}
      <section id="proyectos" className="px-4 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <Titular antetitulo="Proyectos" titulo={`${s.nombre} en la práctica`} />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {proyectos.map((p, i) => (
              <Revelar key={p.slug} retraso={(i % 3) * 0.06}>
                <TarjetaProyecto proyecto={p} />
              </Revelar>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo trabajamos */}
      <section className="px-4 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <Titular antetitulo="Cómo trabajamos" titulo="Paso a paso, y siempre contigo" />
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {s.pasos.map((p, i) => (
              <Revelar key={p.titulo} retraso={i * 0.07}>
                <div data-foco className="cristal h-full rounded-[32px] p-7">
                  <span className="text-sm font-bold text-[var(--d-acento)]">0{i + 1}</span>
                  <h3 className="mt-3 text-2xl font-bold tracking-[-0.03em]">{p.titulo}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-[var(--d-suave)] [text-wrap:pretty]">{p.texto}</p>
                </div>
              </Revelar>
            ))}
          </div>
        </div>
      </section>

      {/* Preguntas frecuentes */}
      <section className="px-4 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <Titular antetitulo="Preguntas frecuentes" titulo="Lo que suelen preguntarme" />
          <Revelar>
            <Preguntas preguntas={s.preguntas} />
          </Revelar>
        </div>
      </section>

      <BloqueLlamada
        bloque={{ id: "llamada", tipo: "llamada", visible: true, datos: { titulo: s.llamada, texto: "Cuéntamela. Me encantará escucharla y pensar cómo llevarla a la pantalla." } }}
        preseleccion={[s.nombre]}
      />

      {/* Otros servicios */}
      <section className="px-4 pb-12 pt-8 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-2">
          {otros.map((o) => (
            <Link key={o.slug} href={`${RAIZ}/servicios/${o.slug}`} className="group relative block h-56 overflow-hidden rounded-[32px] bg-black">
              <img src={img(imagenesDe(o.slug)[0], 1200)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-[1.4s] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-black/10" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-7 text-white">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">Otro servicio</p>
                  <p className="mt-1 text-3xl font-extrabold tracking-[-0.04em]">{o.nombre}</p>
                </div>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/25 bg-black/35 transition-transform duration-500 group-hover:translate-x-1">
                  <Icono nombre="flecha" className="h-5 w-5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Pie />
    </main>
  );
}

function Preguntas({ preguntas }: { preguntas: { p: string; r: string }[] }) {
  const [abierta, setAbierta] = useState<number | null>(0);
  return (
    <div className="flex flex-col gap-2">
      {preguntas.map((q, i) => {
        const si = abierta === i;
        return (
          <div key={q.p} className="cristal overflow-hidden rounded-[24px]">
            <button
              type="button"
              onClick={() => setAbierta(si ? null : i)}
              aria-expanded={si}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-[17px] font-semibold tracking-[-0.01em]"
            >
              {q.p}
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--d-borde)] transition-transform duration-500" style={{ transform: si ? "rotate(45deg)" : "none" }}>
                <Icono nombre="mas" className="h-4 w-4" />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {si && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: CURVA }}
                >
                  <p className="px-6 pb-6 text-[16px] leading-relaxed text-[var(--d-suave)] [text-wrap:pretty]">{q.r}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
