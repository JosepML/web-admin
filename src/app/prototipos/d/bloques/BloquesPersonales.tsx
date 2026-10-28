"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePunteroFino, useReducir } from "../../_comun/hooks";
import { AJUSTES, ARTICULOS, PASOS, SERVICIOS, type Bloque } from "../datos";
import { Icono } from "../Iconos";
import { Disponible, EVENTO_SERVICIO, Revelar, Titular, TituloConAcento } from "../piezas";
import { img } from "../../_comun/imagen";


/**
 * Cómo trabajo: los cuatro pasos a la vez, en una fila de tarjetas de cristal (dos columnas en tableta,
 * una en móvil). Al llegar, una línea fina se traza de izquierda a derecha y las tarjetas entran
 * escalonadas; al pasar el ratón, la tarjeta se ilumina. Encaja con el scroll normal: se ve de un vistazo.
 */
export function BloqueProceso({ bloque }: { bloque: Bloque }) {
  return (
    <section className="px-4 py-24 sm:px-8 sm:py-32 lg:py-[6svh]">
      <div className="mx-auto max-w-7xl">
        <Titular antetitulo={bloque.datos.antetitulo} titulo={bloque.datos.titulo} />
        <div className="relative mt-14 lg:mt-[6svh]">
          <ol className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {PASOS.map((p, i) => (
              <Revelar key={p.titulo} retraso={0.15 + i * 0.12}>
                <li data-foco className="cristal group h-full rounded-[32px] p-7 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 lg:p-8">
                  <span className="relative flex h-[2.6rem] w-[2.6rem] items-center justify-center rounded-full bg-[var(--d-acento)] text-sm font-bold text-white shadow-[0_8px_24px_-8px_rgba(229,9,20,0.7)]">
                    0{i + 1}
                  </span>
                  <h3 className="mt-6 text-3xl font-extrabold tracking-[-0.035em]">{p.titulo}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-[var(--d-suave)] transition-colors duration-500 [text-wrap:pretty] group-hover:text-[var(--d-texto)]">
                    {p.texto}
                  </p>
                </li>
              </Revelar>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

const PAPELES = ["Director de fotografía", "Filmmaker", "Editor", "Operador de cámara", "Gaffer", "Realizador"];

/** Sobre mí: retrato que se inclina con el ratón y se desplaza con el scroll, y texto personal. */
export function BloqueSobreMi({ bloque }: { bloque: Bloque }) {
  const { antetitulo, titulo, texto, imagen } = bloque.datos;
  const ref = useRef<HTMLElement>(null);
  const reducir = useReducir();
  const fino = usePunteroFino();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Antes la foto subía y bajaba con el scroll y se cortaba la cabeza: ahora solo un zoom muy leve,
  // anclado arriba para que la cabeza quede siempre dentro
  const escalaImg = useTransform(scrollYProgress, [0, 1], [1.08, 1]);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 18 });
  const sry = useSpring(ry, { stiffness: 150, damping: 18 });

  return (
    <section ref={ref} id={bloque.id === "sobre-mi" ? "sobre-mi" : undefined} className="scroll-mt-24 px-4 py-24 sm:px-8 sm:py-32 lg:py-[6svh]">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Revelar>
          <div style={{ perspective: 1200 }}>
            <motion.div
              className="relative mx-auto aspect-[4/5] overflow-hidden rounded-[44px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] lg:h-[min(76svh,720px)]"
              style={{ rotateX: srx, rotateY: sry }}
              onPointerMove={(e) => {
                if (!fino || reducir) return;
                const r = e.currentTarget.getBoundingClientRect();
                ry.set(((e.clientX - r.left) / r.width - 0.5) * 10);
                rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
              }}
              onPointerLeave={() => {
                rx.set(0);
                ry.set(0);
              }}
            >
              {imagen && (
                <motion.img
                  src={img(imagen, 1920)}
                  alt="Josep Mira Lozano en un rodaje"
                  className="absolute inset-0 h-full w-full origin-top object-cover object-[50%_0%] [will-change:transform]"
                  style={{ scale: reducir ? 1 : escalaImg }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/20 bg-black/35 px-3.5 py-1.5 text-xs font-medium text-white">+9 años · Alicante</span>
              </div>
            </motion.div>
          </div>
        </Revelar>

        <div>
          <Titular antetitulo={antetitulo} titulo={titulo} />
          {texto && (
            <Revelar retraso={0.15}>
              <p className="mt-6 text-lg leading-relaxed text-[var(--d-suave)] [text-wrap:pretty] sm:text-xl">{texto}</p>
            </Revelar>
          )}
          <Revelar retraso={0.22}>
            <p className="mt-6 border-l-2 border-[var(--d-acento)] pl-4 text-xl font-semibold leading-snug tracking-[-0.02em] text-[var(--d-texto)]">
              La cámara se convierte en la extensión de mi mirada.
            </p>
          </Revelar>
          <Revelar retraso={0.28}>
            <div className="mt-8 flex flex-wrap gap-2">
              {PAPELES.map((p) => (
                <span key={p} className="cristal rounded-full px-4 py-2 text-sm font-medium">
                  {p}
                </span>
              ))}
            </div>
          </Revelar>
          <Revelar retraso={0.34}>
            <span className="boton mt-8 border border-[var(--d-borde)] px-6 py-3 text-sm hover:bg-[var(--d-cristal)]">
              Conóceme mejor
              <Icono nombre="flecha" className="h-4 w-4" />
            </span>
          </Revelar>
        </div>
      </div>
    </section>
  );
}

/** Últimos artículos: el contenido que Josep crea desde el panel aparece aquí solo. */
export function BloqueBlog({ bloque }: { bloque: Bloque }) {
  return (
    <section id={bloque.id === "blog" ? "blog" : undefined} className="scroll-mt-24 px-4 py-24 sm:px-8 sm:py-32 lg:py-[6svh]">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <Titular antetitulo={bloque.datos.antetitulo} titulo={bloque.datos.titulo} />
          <Revelar>
            <span className="boton border border-[var(--d-borde)] px-5 py-2.5 text-sm hover:bg-[var(--d-cristal)]">
              Todos los artículos
              <Icono nombre="flecha" className="h-4 w-4" />
            </span>
          </Revelar>
        </div>
        <div className={`mt-12 grid gap-3 ${ARTICULOS.length < 3 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
          {ARTICULOS.map((a, i) => (
            <Revelar key={a.slug} retraso={i * 0.08}>
              <article data-foco className="cristal group flex h-full cursor-pointer flex-col overflow-hidden rounded-[32px] transition-transform duration-500 hover:-translate-y-1.5">
                <div className="relative aspect-[16/9] overflow-hidden bg-black">
                  <img
                    src={img(a.imagen, 828)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <span className="cristal absolute left-5 top-5 rounded-full px-3 py-1 text-[11px] font-semibold">{a.categoria}</span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs text-[var(--d-tenue)]">{a.fecha}</p>
                  <h3 className="mt-2 text-xl font-extrabold leading-snug tracking-[-0.03em]">{a.titulo}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--d-suave)]">{a.resumen}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--d-acento)]">
                    Leer
                    <Icono nombre="flecha" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </article>
            </Revelar>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Sección libre: lo que Josep quiera contar, creada desde el panel. */
export function BloqueTexto({ bloque }: { bloque: Bloque }) {
  const { antetitulo, titulo, texto, imagen } = bloque.datos;
  return (
    <section className="px-4 py-20 sm:px-8">
      <Revelar className="mx-auto max-w-5xl">
        <div data-foco className="cristal grid gap-8 overflow-hidden rounded-[40px] p-8 sm:p-12 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            {antetitulo && <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--d-acento)]">{antetitulo}</span>}
            <h2 className="mt-3 text-4xl font-extrabold leading-[1.08] tracking-[-0.04em] [text-wrap:balance] sm:text-5xl">
              <TituloConAcento texto={titulo} />
            </h2>
            {texto && <p className="mt-5 whitespace-pre-line text-lg leading-relaxed text-[var(--d-suave)]">{texto}</p>}
          </div>
          {imagen ? (
            <img src={img(imagen, 1920)} alt="" className="aspect-[4/3] w-full rounded-[28px] object-cover" />
          ) : (
            <div className="relative hidden aspect-[4/3] overflow-hidden rounded-[28px] md:block">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,var(--d-orbe-a),transparent_60%),radial-gradient(circle_at_70%_70%,var(--d-orbe-b),transparent_60%)]" />
            </div>
          )}
        </div>
      </Revelar>
    </section>
  );
}

const TIPOS = ["Videoclip", "Cortometraje", "Spot", "Evento", "Boda", "Redes sociales"];

/** Llamada final: invitación personal a escribir, con lo que tienes en mente marcado en chips. */
export function BloqueLlamada({ bloque, preseleccion = [] }: { bloque: Bloque; preseleccion?: string[] }) {
  const [elegidos, setElegidos] = useState<string[]>(preseleccion);

  useEffect(() => {
    const elegir = (e: Event) => {
      const nombre = (e as CustomEvent<string>).detail;
      setElegidos((l) => (l.includes(nombre) ? l : [...l, nombre]));
    };
    window.addEventListener(EVENTO_SERVICIO, elegir);
    return () => window.removeEventListener(EVENTO_SERVICIO, elegir);
  }, []);

  const alternar = (t: string) => setElegidos((l) => (l.includes(t) ? l.filter((x) => x !== t) : [...l, t]));
  const asunto = elegidos.length ? `Proyecto: ${elegidos.join(", ")}` : "Tengo una historia que contar";
  const mensajeWa = `Hola, Josep. ${elegidos.length ? `Tengo en mente: ${elegidos.join(", ")}. ` : ""}Me gustaría contarte mi proyecto.`;

  return (
    <section id={bloque.id === "llamada" ? "llamada" : undefined} className="scroll-mt-24 px-3 py-16 sm:px-6 sm:py-24 lg:py-[5svh]">
      <Revelar>
        <div className="cristal relative mx-auto max-w-7xl overflow-hidden rounded-[48px] px-6 py-16 text-center sm:px-12 sm:py-24 lg:py-[6svh]">
          <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[radial-gradient(closest-side,var(--d-orbe-a),transparent)]" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[radial-gradient(closest-side,var(--d-orbe-b),transparent)]" />
          <div className="relative">
            <Disponible />
            <h2 className="mx-auto mt-6 max-w-4xl text-[clamp(2.4rem,min(6.5vw,9svh),6rem)] font-extrabold leading-[1.02] tracking-[-0.05em] [text-wrap:balance]">
              <TituloConAcento texto={bloque.datos.titulo} />
            </h2>
            {bloque.datos.texto && <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[var(--d-suave)] sm:text-xl">{bloque.datos.texto}</p>}

            <p className="mt-10 text-sm font-semibold lg:mt-[4svh]">¿Qué tienes en mente?</p>
            <div className="mx-auto mt-4 flex max-w-3xl flex-wrap justify-center gap-2">
              {[...SERVICIOS.map((s) => s.nombre), ...TIPOS].map((t) => {
                const si = elegidos.includes(t);
                return (
                  <motion.button
                    key={t}
                    type="button"
                    onClick={() => alternar(t)}
                    whileTap={{ scale: 0.94 }}
                    aria-pressed={si}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                      si ? "border-transparent bg-[var(--d-acento)] text-white" : "border-[var(--d-borde)] bg-[var(--d-cristal)] hover:border-[var(--d-acento)]"
                    }`}
                  >
                    {si && "✓ "}
                    {t}
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row lg:mt-[4svh]">
              <a href={`mailto:${AJUSTES.correo}?subject=${encodeURIComponent(asunto)}`} className="boton boton-acento px-8 py-4 text-base">
                <Icono nombre="correo" className="h-5 w-5" />
                Escríbeme
              </a>
              <a
                href={`https://wa.me/${AJUSTES.whatsapp}?text=${encodeURIComponent(mensajeWa)}`}
                target="_blank"
                rel="noreferrer"
                className="boton border border-[var(--d-borde)] bg-[var(--d-cristal)] px-8 py-4 text-base hover:border-[#25d366]"
              >
                <Icono nombre="whatsapp" className="h-5 w-5 text-[#25d366]" />
                WhatsApp
              </a>
            </div>
            {/* Ancho de lectura acotado y centrado: así no queda bajo el índice lateral desplegado en pantallas estrechas */}
            <p className="mx-auto mt-6 max-w-md text-xs leading-relaxed text-[var(--d-tenue)] [text-wrap:balance]">
              Te respondo personalmente, normalmente en menos de 24 horas. En la web final habrá también un formulario corto que
              se guarda en tu panel.
            </p>
          </div>
        </div>
      </Revelar>
    </section>
  );
}

export function Pie() {
  return (
    <footer className="px-4 pb-24 pt-10 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 border-t border-[var(--d-borde)] pt-8 text-sm text-[var(--d-suave)] sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="font-extrabold text-[var(--d-texto)]">Josep Mira Lozano</span> · Dirección de fotografía, filmmaker y edición · Alicante
        </p>
        <div className="flex gap-5">
          <Link href="https://www.instagram.com/josepmiralozano/" className="hover:text-[var(--d-texto)]">
            Instagram
          </Link>
          <Link href="https://www.youtube.com/channel/UCtyNSF1X0pNPxp5fhwu1NUA" className="hover:text-[var(--d-texto)]">
            YouTube
          </Link>
          <Link href="https://www.linkedin.com/in/josep-mira-lozano-a70798214/" className="hover:text-[var(--d-texto)]">
            LinkedIn
          </Link>
        </div>
      </div>
    </footer>
  );
}
