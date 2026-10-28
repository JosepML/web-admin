"use client";

import { useState } from "react";
import type { Bloque, DatosWeb, Proyecto } from "@/lib/datos/tipos";
import { RUTAS } from "@/lib/rutas";
import { BloqueLlamada } from "../bloques/BloquesPersonales";
import { enfoque, img } from "../comun/imagen";
import { Enlace } from "../comun/Enlace";
import { Icono } from "../Iconos";
import { ProveedorDatos } from "../marco/DatosWeb";
import { enLinea, ModalVideo, Revelar, Titular } from "../piezas";
import { AntesDespues, type Lado } from "./AntesDespues";

export type Recreacion = { proyecto: Proyecto; comparacion: { antes: Lado; despues: Lado; formato: number } | null };

type Props = {
  cabecera: { antetitulo: string; titulo: string; texto: string };
  recreaciones: Recreacion[];
  etiquetas: { antes: string; despues: string };
  /** Bloque de llamada de Inicio (opciones y nota), con el título propio de esta página */
  llamada: Bloque;
  datos: DatosWeb;
};

/** Elementos de una lista Markdown («- texto»); si no es una lista, cada párrafo */
const elementos = (t: string) => {
  const lineas = t.split("\n").map((x) => x.trim());
  return lineas.some((x) => x.startsWith("- "))
    ? lineas.filter((x) => x.startsWith("- ")).map((x) => x.slice(2).trim())
    : t.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean);
};

/** «**Título.** texto» → { titulo, texto } */
const decision = (x: string) => {
  const m = x.match(/^\*\*([^*]+?)\*\*\s*([\s\S]*)$/);
  return m ? { titulo: m[1].replace(/[.:]\s*$/, ""), texto: m[2] } : { titulo: "", texto: x };
};

/**
 * Página /recreaciones: las recreaciones de planos de cine, cada una con su deslizador
 * «Original / Mi recreación», el vídeo y sus textos, y la llamada al final.
 */
export function PaginaRecreaciones({ cabecera, recreaciones, etiquetas, llamada, datos }: Props) {
  const [video, setVideo] = useState<string | null>(null);
  return (
    <ProveedorDatos datos={datos}>
      <main>
        <section className="px-4 pb-8 pt-32 sm:px-8 sm:pt-40">
          <div className="mx-auto max-w-7xl">
            <Titular nivel={1} antetitulo={cabecera.antetitulo} titulo={cabecera.titulo} texto={cabecera.texto} />
          </div>
        </section>

        <div className="flex flex-col gap-24 px-4 py-16 sm:gap-32 sm:px-8 sm:py-24">
          {recreaciones.map((r, i) => (
            <Ficha key={r.proyecto.slug} r={r} indice={i} etiquetas={etiquetas} alVerVideo={setVideo} />
          ))}
        </div>

        <BloqueLlamada ancla="llamada" bloque={llamada} />
        <ModalVideo id={video ?? ""} abierto={!!video} alCerrar={() => setVideo(null)} />
      </main>
    </ProveedorDatos>
  );
}

function Ficha({ r, indice, etiquetas, alVerVideo }: { r: Recreacion; indice: number; etiquetas: Props["etiquetas"]; alVerVideo: (id: string) => void }) {
  const p = r.proyecto;
  const poster = p.poster ?? p.galeria[0]?.imagen ?? null;
  const titulo = (clave: string, porDefecto: string) => p.titulosSeccion[clave] || porDefecto;
  const claves = elementos(p.textos.comoLoHicimos).map(decision);
  const resultado = elementos(p.textos.elResultado);
  const derecha = indice % 2 === 1;

  return (
    <article
      id={p.slug}
      className={`mx-auto grid w-full max-w-7xl scroll-mt-28 items-start gap-8 lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-0 ${derecha ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]" : "lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]"}`}
    >
      {/* En móvil: título, imagen y textos; en escritorio, la imagen a un lado (alternando) y lo demás al otro */}
      <Revelar className={`lg:row-start-1 ${derecha ? "lg:col-start-1" : "lg:col-start-2"}`}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--jm-acento)]">{String(indice + 1).padStart(2, "0")}</p>
        <h2 className="mt-3 text-[clamp(1.9rem,4vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.04em] [text-wrap:balance]">{p.titulo}</h2>
        {p.textos.tarjeta && <p className="mt-4 text-xl font-medium leading-snug text-[var(--jm-suave)] [text-wrap:pretty]">{enLinea(p.textos.tarjeta)}</p>}
      </Revelar>

      {/* Imagen: el deslizador si están el original y la recreación; si no, el póster del vídeo */}
      <Revelar className={`lg:sticky lg:top-28 lg:row-span-2 lg:row-start-1 ${derecha ? "lg:col-start-2" : "lg:col-start-1"}`}>
        {/* En formatos casi cuadrados, la caja no pasa de la altura de la pantalla */}
        <div
          className="cristal mx-auto overflow-hidden rounded-[28px] p-1.5 sm:rounded-[36px] sm:p-2"
          style={r.comparacion && r.comparacion.formato < 1.2 ? { maxWidth: `calc(78svh * ${r.comparacion.formato})` } : undefined}
        >
          {r.comparacion ? (
            <AntesDespues {...r.comparacion} etiquetaAntes={etiquetas.antes} etiquetaDespues={etiquetas.despues} className="rounded-[22px] sm:rounded-[28px]" />
          ) : (
            poster && (
              <button
                type="button"
                onClick={() => p.youtubeId && alVerVideo(p.youtubeId)}
                className="group relative block aspect-video w-full overflow-hidden rounded-[22px] bg-black sm:rounded-[28px]"
                aria-label={`Ver el vídeo de ${p.titulo}`}
              >
                <img src={img(poster.url, 2048)} alt={poster.alt || p.titulo} style={enfoque(poster)} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-105" />
                {p.youtubeId && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-md transition-transform duration-500 group-hover:scale-110">
                      <Icono nombre="play" className="ml-1 h-5 w-5" />
                    </span>
                  </span>
                )}
              </button>
            )
          )}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          {p.youtubeId && (
            <button type="button" onClick={() => alVerVideo(p.youtubeId!)} className="boton boton-acento px-6 py-3.5 text-sm">
              <Icono nombre="play" className="h-3.5 w-3.5" />
              Ver el vídeo
            </button>
          )}
          <Enlace href={RUTAS.proyecto(p.slug)} className="boton cristal px-6 py-3.5 text-sm">
            Ficha completa
            <Icono nombre="flecha" className="h-4 w-4" />
          </Enlace>
        </div>
      </Revelar>

      <div className={`lg:row-start-2 [&>*:first-child]:mt-0 lg:[&>*:first-child]:mt-9 ${derecha ? "lg:col-start-1" : "lg:col-start-2"}`}>

        {p.textos.historia && (
          <Seccion titulo={titulo("historia", "El proyecto")}>
            {p.textos.historia
              .split(/\n\s*\n/)
              .filter((x) => x.trim())
              .map((x, j) => (
                <p key={j} className="mt-3 text-[17px] leading-relaxed text-[var(--jm-suave)] [text-wrap:pretty] first:mt-0">
                  {enLinea(x.trim())}
                </p>
              ))}
          </Seccion>
        )}

        {claves.length > 0 && (
          <Seccion titulo={titulo("como_lo_hicimos", "Decisiones clave")}>
            <ul className="flex flex-col gap-3">
              {claves.map((c, j) => (
                <li key={j} className="flex gap-3 text-[17px] leading-relaxed">
                  <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--jm-acento)]" />
                  <span className="text-[var(--jm-suave)] [text-wrap:pretty]">
                    {c.titulo && <strong className="font-bold text-[var(--jm-texto)]">{c.titulo}. </strong>}
                    {enLinea(c.texto)}
                  </span>
                </li>
              ))}
            </ul>
          </Seccion>
        )}

        {p.textos.elReto && (
          <Seccion titulo={titulo("el_reto", "El reto")}>
            <p className="text-[17px] leading-relaxed text-[var(--jm-suave)] [text-wrap:pretty]">{enLinea(p.textos.elReto)}</p>
          </Seccion>
        )}

        {resultado.length > 0 && (
          <Seccion titulo={titulo("el_resultado", "Resultado")}>
            <ul className="flex flex-col gap-2">
              {resultado.map((x, j) => (
                <li key={j} className="flex gap-3 text-[17px] font-medium leading-relaxed">
                  <span className="text-[var(--jm-acento)]">✓</span>
                  {enLinea(x)}
                </li>
              ))}
            </ul>
          </Seccion>
        )}
      </div>
    </article>
  );
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <Revelar className="mt-9 border-t border-[var(--jm-linea)] pt-7">
      <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--jm-tenue)]">{titulo}</h3>
      {children}
    </Revelar>
  );
}
