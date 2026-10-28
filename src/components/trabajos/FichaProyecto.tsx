"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { laurel } from "@/lib/datos/seleccion";
import type { Proyecto, Servicio } from "@/lib/datos/tipos";
import { RUTAS } from "@/lib/rutas";
import { useReducir } from "../comun/hooks";
import { enfoque, img } from "../comun/imagen";
import { Enlace } from "../comun/Enlace";
import { SelloJuno } from "../comun/SelloJuno";
import { CABECERA } from "../comun/Transicion";
import { VideoFondo } from "../comun/VideoFondo";
import { Icono } from "../Iconos";
import { CURVA, enLinea, ModalVideo, Revelar, TituloConAcento } from "../piezas";
import { MasVideos } from "./MasVideos";
import { Visor } from "./Visor";

/** Párrafos separados por una línea en blanco */
const parrafos = (t: string) =>
  t
    .split(/\n\s*\n/)
    .map((x) => x.trim())
    .filter(Boolean);

/** Elementos de una lista Markdown («- texto»). Si el texto no es una lista, cada párrafo es un elemento */
const elementos = (t: string) => {
  const lineas = t.split("\n").map((x) => x.trim());
  return lineas.some((x) => x.startsWith("- ")) ? lineas.filter((x) => x.startsWith("- ")).map((x) => x.slice(2).trim()) : parrafos(t);
};

/** Decisiones clave: «- **Título.** texto» → { titulo, texto } */
const decisiones = (t: string) =>
  elementos(t).map((x) => {
    const m = x.match(/^\*\*([^*]+?)\*\*\s*([\s\S]*)$/);
    return m ? { titulo: m[1].replace(/[.:]\s*$/, ""), texto: m[2] } : { titulo: "", texto: x };
  });

/** Fila de la ficha: etiqueta a la izquierda en escritorio y el contenido a la derecha */
function Fila({ etiqueta, children }: { etiqueta: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-5 border-t border-[var(--jm-linea)] pt-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
      <Revelar>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--jm-acento)] lg:pt-2">{etiqueta}</p>
      </Revelar>
      <Revelar retraso={0.06}>{children}</Revelar>
    </div>
  );
}

/**
 * Ficha de un proyecto (/trabajos/[slug]), como la del prototipo D: cabecera con vídeo donde aterriza la
 * imagen de la tarjeta, ficha técnica de cristal, textos en filas de dosier, frase final, fotogramas con
 * visor, invitación con los servicios del proyecto y siguiente proyecto.
 */
export function FichaProyecto({ proyecto: p, siguiente, servicios }: { proyecto: Proyecto; siguiente: Proyecto | null; servicios: Servicio[] }) {
  const reducir = useReducir();
  const [video, setVideo] = useState(false);
  // Vídeo principal propio (alojado fuera de YouTube): hace de «Ver completo» y no se repite en «Más vídeos»
  const principal = p.youtubeId ? undefined : p.videos.find((v) => v.tipo === "archivo" && v.rol === "principal" && v.url);
  const masVideos = principal ? p.videos.filter((v) => v !== principal) : p.videos;
  const [foto, setFoto] = useState<number | null>(null);
  const premio = laurel(p);
  const fotos = p.galeria.map((g) => g.imagen.url);
  const delProyecto = servicios.filter((s) => p.servicios.some((x) => x.slug === s.slug));
  const titulo = (clave: string, porDefecto: string) => p.titulosSeccion[clave] || porDefecto;
  // Solo los datos que existen: una ficha nunca enseña «Pendiente»
  const ficha = (
    [
      ["Año", p.anio ? String(p.anio) : ""],
      ["Tipo", p.tipo?.nombre ?? ""],
      ["Dirección", p.direccion],
      ["Productora", p.productora],
      ["Mi papel", p.papel],
      ["Cámara", p.camara],
    ] as [string, string][]
  ).filter(([, v]) => v.trim());
  const historia = parrafos(p.textos.historia);
  const miPapel = parrafos(p.textos.miPapel);
  const claves = decisiones(p.textos.comoLoHicimos);
  const resultado = elementos(p.textos.elResultado);
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
        <VideoFondo archivo={p.videoPortada?.url ?? p.clip?.url ?? principal?.url} youtubeId={p.youtubeId} inicio={p.youtubeInicio ?? undefined} poster={(p.imagenCabecera ?? p.poster)?.url} foco={enfoque(p.imagenCabecera ?? p.poster)} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />
        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-6 p-6 text-white sm:p-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <motion.div {...entrar(0.25)} className="flex flex-wrap gap-2">
              {p.tipo && (
                <span className="rounded-full border border-white/20 bg-black/35 px-3.5 py-1.5 text-xs font-medium">
                  {p.tipo.nombre}
                  {p.anio ? ` · ${p.anio}` : ""}
                </span>
              )}
              {premio && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/35 px-3.5 py-1.5 text-xs font-medium">
                  <Icono nombre="laurel" className="h-3.5 w-3.5 text-[#ffcf7a]" />
                  {premio.nombre}
                  {premio.festival ? ` · ${premio.festival}` : ""}
                </span>
              )}
              {p.conJuno && <SelloJuno />}
            </motion.div>
            <motion.h1 {...entrar(0.35)} className="mt-4 max-w-4xl pb-[0.06em] text-[clamp(2.5rem,7vw,6.5rem)] font-extrabold leading-[1] tracking-[-0.05em] [text-wrap:balance]">
              {p.titulo}
            </motion.h1>
          </div>
          {(p.youtubeId || principal) && (
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

      {/* Ficha técnica de cristal que monta sobre la cabecera (en móvil va debajo, para no tapar «Ver completo») */}
      {ficha.length > 0 && (
        <motion.section {...entrar(0.6)} className="relative z-10 mx-auto mt-2 max-w-6xl sm:-mt-16 px-4 sm:px-8">
          <dl className={`cristal cristal-fuerte grid grid-cols-2 gap-px overflow-hidden rounded-[32px] sm:grid-cols-3`}>
            {ficha.map(([k, v]) => (
              <div key={k} className="p-5 sm:p-6">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--jm-tenue)]">{k}</dt>
                <dd className="mt-1.5 text-[15px] font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </motion.section>
      )}

      {p.textos.tarjeta && (
        <section className="mx-auto max-w-3xl px-4 pb-16 pt-20 text-center sm:px-8 sm:pt-28">
          <Revelar>
            <p className="text-[clamp(1.1rem,1.6vw,1.35rem)] leading-[1.55] text-[var(--jm-suave)] [text-wrap:balance]">{enLinea(p.textos.tarjeta)}</p>
          </Revelar>
        </section>
      )}

      {/* Más vídeos (making of, versiones, reels): antes del texto, o después si así se marca en el panel */}
      {!p.videosDebajoDelTexto && <MasVideos videos={masVideos} titulo={titulo("mas_videos", "Más vídeos")} arriba={!p.textos.tarjeta} />}

      {/* Cuerpo de la ficha: etiqueta a la izquierda y contenido a la derecha, como un dosier */}
      <section className="px-4 pb-24 sm:px-8">
        <div className="mx-auto max-w-6xl space-y-14">
          {historia.length > 0 && (
            <Fila etiqueta={titulo("historia", "El proyecto")}>
              <div className="space-y-4 text-[17px] leading-[1.65] sm:text-lg [text-wrap:pretty]">
                {historia.map((x) => (
                  <p key={x}>{enLinea(x)}</p>
                ))}
              </div>
            </Fila>
          )}

          {miPapel.length > 0 && (
            <Fila etiqueta={titulo("mi_papel", "Mi papel")}>
              <div className="space-y-4 text-[17px] leading-[1.65] sm:text-lg [text-wrap:pretty]">
                {miPapel.map((x) => (
                  <p key={x}>{enLinea(x)}</p>
                ))}
              </div>
            </Fila>
          )}

          {claves.length > 0 && (
            <Fila etiqueta={titulo("como_lo_hicimos", "Decisiones clave")}>
              <div className="grid gap-3 sm:grid-cols-2">
                {claves.map((d, i) => (
                  <Revelar key={d.titulo + i} retraso={i * 0.06} className="sm:[&:last-child:nth-child(odd)]:col-span-2">
                    <article className="cristal h-full rounded-[28px] p-6 sm:p-7">
                      <span className="text-sm font-semibold tabular-nums text-[var(--jm-acento)]">{String(i + 1).padStart(2, "0")}</span>
                      {d.titulo && <h3 className="mt-3 text-xl font-extrabold leading-[1.2] tracking-[-0.03em]">{d.titulo}</h3>}
                      <p className="mt-2 text-base leading-[1.6] text-[var(--jm-suave)] [text-wrap:pretty]">{enLinea(d.texto)}</p>
                    </article>
                  </Revelar>
                ))}
              </div>
            </Fila>
          )}

          {p.textos.elReto && (
            <Fila etiqueta={titulo("el_reto", "El reto")}>
              <p className="text-[17px] leading-[1.65] sm:text-lg [text-wrap:pretty]">{enLinea(p.textos.elReto)}</p>
            </Fila>
          )}

          {resultado.length > 0 && (
            <Fila etiqueta={titulo("el_resultado", "Resultado")}>
              <ul className="grid gap-3 sm:grid-cols-2">
                {resultado.map((r) => (
                  <li key={r} className="cristal cristal-fuerte flex items-start gap-3 rounded-[24px] p-5 text-[17px] leading-[1.5] sm:text-lg sm:[&:last-child:nth-child(odd)]:col-span-2">
                    <Icono nombre="laurel" className="mt-0.5 h-5 w-5 shrink-0 text-[var(--jm-acento)]" />
                    <span>{enLinea(r)}</span>
                  </li>
                ))}
              </ul>
            </Fila>
          )}
        </div>
      </section>

      {/* Conclusión: frase corta con la parte marcada en cursiva */}
      {p.frase && (
        <section className="mx-auto max-w-5xl px-4 pb-24 text-center sm:px-8">
          <Revelar>
            <p className="text-[clamp(1.7rem,3.6vw,3rem)] font-bold leading-[1.15] tracking-[-0.03em] [text-wrap:balance]">
              <TituloConAcento texto={p.frase} />
            </p>
          </Revelar>
        </section>
      )}

      {p.videosDebajoDelTexto && <MasVideos videos={masVideos} titulo={titulo("mas_videos", "Más vídeos")} />}

      {/* Fotogramas: cuadrícula de miniaturas; al pulsar una se abre el visor a pantalla completa */}
      {fotos.length > 0 && (
        <section className="px-4 pb-24 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <Revelar>
              <h2 className="text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">{titulo("fotogramas", "Fotogramas")}</h2>
            </Revelar>
            <div className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
              {p.galeria.map((g, i) => (
                <Revelar key={g.imagen.id + i} retraso={Math.min(i, 7) * 0.05}>
                  <button
                    type="button"
                    onClick={() => setFoto(i)}
                    className="group relative block aspect-video w-full overflow-hidden rounded-[18px] bg-black"
                    aria-label={`Ver el fotograma ${i + 1} en grande`}
                  >
                    <img
                      src={img(g.imagen.url, 828)}
                      alt={g.pie || g.imagen.alt || `Fotograma de ${p.titulo}`}
                      loading="lazy"
                      decoding="async"
                      style={enfoque(g.imagen)}
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
      )}

      {/* Venta: el servicio que hay detrás de este trabajo */}
      <section className="px-4 sm:px-8">
        <Revelar className="mx-auto max-w-7xl">
          <div className="cristal relative flex flex-col gap-6 overflow-hidden rounded-[40px] p-8 sm:flex-row sm:items-center sm:justify-between sm:p-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,var(--jm-orbe-a),transparent)]" />
            <div className="relative">
              {delProyecto.length > 0 && (
                <p className="flex flex-wrap gap-x-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--jm-acento)]">
                  {delProyecto.map((s, i) => (
                    <span key={s.slug}>
                      {i > 0 && "· "}
                      <Link href={RUTAS.servicio(s.slug)} className="hover:underline">
                        {s.nombre}
                      </Link>
                    </span>
                  ))}
                </p>
              )}
              <h2 className="mt-2 text-3xl font-extrabold leading-[1.1] tracking-[-0.04em] sm:text-4xl">
                <TituloConAcento texto="¿Quieres algo así para tu proyecto?" />
              </h2>
            </div>
            <Link href={RUTAS.contacto} className="boton boton-acento relative self-start px-7 py-3.5 text-sm sm:self-auto">
              Hablemos
              <Icono nombre="flecha" className="h-4 w-4" />
            </Link>
          </div>
        </Revelar>
      </section>

      {/* Siguiente proyecto */}
      {siguiente && (
        <section className="px-4 py-24 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="mb-4 text-sm font-semibold text-[var(--jm-suave)]">Siguiente proyecto</p>
            <Enlace href={RUTAS.proyecto(siguiente.slug)} className="group block">
              <div data-radio data-foco className="relative aspect-[2.39/1] overflow-hidden rounded-[40px] bg-black">
                {siguiente.poster && (
                  <img
                    data-transicion
                    src={img(siguiente.poster.url, 3840)}
                    style={enfoque(siguiente.poster)}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-105"
                  />
                )}
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
      )}

      {p.youtubeId && <ModalVideo id={p.youtubeId} abierto={video} alCerrar={() => setVideo(false)} />}
      {principal && <ModalVideo archivo={principal.url} vertical={!!principal.vertical} abierto={video} alCerrar={() => setVideo(false)} />}
      <Visor fotos={fotos} indice={foto} alCambiar={setFoto} titulo={p.titulo} />
    </main>
  );
}
