"use client";

import Link from "next/link";
import { useState } from "react";
import { Enlace } from "../../_comun/Enlace";
import { usePunteroFino } from "../../_comun/hooks";
import { FILMMAKER, getProyectoD, imagenesDe, SERVICIOS, type Bloque, type ServicioD } from "../datos";
import { Icono } from "../Iconos";
import { RAIZ } from "../rutas";
import { Diapositivas, Revelar, Titular } from "../piezas";

/** Desvanece la foto de una tarjeta antes del borde inferior, para que no asome en el suavizado de la esquina */
export const MASCARA_BORDE = "[mask-image:linear-gradient(to_top,transparent,#000_10%)]";

export const ICONOS_SERVICIO: Record<string, string> = { "direccion-de-fotografia": "camara", filmmaker: "claqueta", edicion: "ritmo" };

/**
 * Servicios: tres tarjetas iguales. En reposo, solo el icono y el nombre; al pasar el ratón sube el
 * resto (la frase, para quién y el enlace) con un fundido. En pantallas táctiles se ve todo.
 * Solo cambian transform y opacidad.
 */
export function BloqueServicios({ bloque }: { bloque: Bloque }) {
  return (
    <section id={bloque.id === "servicios" ? "servicios" : undefined} className="px-4 py-24 sm:px-8 sm:py-32 lg:py-[6svh]">
      <div className="mx-auto max-w-7xl">
        <Titular antetitulo={bloque.datos.antetitulo} titulo={bloque.datos.titulo} texto={bloque.datos.texto} />
        <div className="mt-14 grid gap-4 md:grid-cols-3 lg:mt-[5svh]">
          {SERVICIOS.map((s, i) => (
            <Revelar key={s.slug} retraso={i * 0.08}>
              <Tarjeta servicio={s} />
            </Revelar>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Marco común de las tarjetas con foto: recorte con clip-path y el mismo radio (así la imagen, que hace
 * zoom, nunca asoma por debajo de la sombra), degradado por encima y contenido que se revela al pasar el ratón.
 */
function TarjetaFoto({
  imagenes,
  ancho,
  className,
  children,
}: {
  imagenes: string[];
  ancho: 1200 | 1920;
  className: string;
  children: (encima: boolean, fino: boolean) => React.ReactNode;
}) {
  const fino = usePunteroFino();
  const [encima, setEncima] = useState(false);
  return (
    <div
      onPointerEnter={() => setEncima(true)}
      onPointerLeave={() => setEncima(false)}
      className={`group relative isolate h-full overflow-hidden bg-black text-white shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 ${className}`}
      style={{ clipPath: "inset(0 round 36px)", borderRadius: 36 }}
    >
      {/* Máscara: la foto se desvanece del todo antes del borde inferior. Con zoom va en su propia capa y se
          recorta aparte del degradado, así que en el suavizado del borde se colaba 1 px gris de la foto */}
      <Diapositivas
        imagenes={imagenes}
        activo={encima && fino}
        ancho={ancho}
        className={`opacity-80 transition-opacity duration-700 group-hover:opacity-100 ${MASCARA_BORDE}`}
      />
      {/* Negro del todo en el quinto inferior, donde va el texto: si no, lo que hay al pie de la foto (el borde
          de una persiana, el suelo...) se transparentaba como una raya bajo el título */}
      <div className="absolute inset-0 bg-[linear-gradient(to_top,#000_0%,#000_24%,rgba(0,0,0,0.55)_50%,rgba(0,0,0,0.1)_100%)]" />
      {children(encima, fino)}
    </div>
  );
}

/** Lo que se revela al pasar el ratón: oculto y un poco más abajo en reposo (con ratón), visible siempre en táctil. */
function Revelable({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid transition-[grid-template-rows,opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [@media(hover:hover)]:translate-y-3 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:[grid-template-rows:0fr] [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-hover:[grid-template-rows:1fr]">
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}

function Tarjeta({ servicio: s }: { servicio: ServicioD }) {
  return (
    <Link href={`${RAIZ}/servicios/${s.slug}`} className="block">
      <TarjetaFoto imagenes={imagenesDe(s.slug)} ancho={1200} className="aspect-[4/5] md:aspect-[3/4] lg:aspect-auto lg:h-[min(56svh,600px)]">
        {() => (
          <div className="relative flex h-full flex-col justify-between p-7">
            <div className="flex items-start justify-between">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/15">
                <Icono nombre={ICONOS_SERVICIO[s.slug]} className="h-6 w-6" />
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/30 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-rotate-45 group-hover:scale-110">
                <Icono nombre="flecha" className="h-4 w-4" />
              </span>
            </div>
            <div>
              <h3 className="text-[30px] font-bold leading-[1.1] tracking-[-0.03em] [text-wrap:balance]">{s.nombre}</h3>
              {/* Entre el título y el enlace aparecen, al pasar el ratón, la frase y para quién */}
              <Revelable>
                <p className="d-serif mt-2 text-[26px] leading-tight text-[#ffc07a]">{s.frase}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {s.paraQuien.slice(0, 3).map((q) => (
                    <span key={q} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium">
                      {q}
                    </span>
                  ))}
                </div>
              </Revelable>
              {/* Siempre visible: en reposo sube el título para que no quede pegado abajo */}
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white/85 transition-[margin] duration-700 group-hover:mt-6">
                Ver proyectos y cómo trabajo
                <Icono nombre="flecha" className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        )}
      </TarjetaFoto>
    </Link>
  );
}

/**
 * Lo que grabo como filmmaker: la rejilla de servicios de la web antigua (spots, eventos, bodas, redes...)
 * con la estética D. Seis tarjetas con la foto de un trabajo real de cada tipo; en reposo el nombre, al
 * pasar el ratón la frase. Cada una lleva a ese trabajo.
 */
export function BloqueFilmmaker({ bloque }: { bloque: Bloque }) {
  return (
    <section className="px-4 py-24 sm:px-8 sm:py-32 lg:py-[6svh]">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Titular antetitulo={bloque.datos.antetitulo} titulo={bloque.datos.titulo} texto={bloque.datos.texto} />
          <Revelar retraso={0.1}>
            <Link
              href={`${RAIZ}/servicios/filmmaker`}
              className="boton border border-[var(--d-borde)] px-5 py-2.5 text-sm hover:bg-[var(--d-cristal)]"
            >
              Cómo trabajo como filmmaker
              <Icono nombre="flecha" className="h-4 w-4" />
            </Link>
          </Revelar>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-[5svh] lg:grid-cols-3">
          {FILMMAKER.map((f, i) => {
            const p = getProyectoD(f.proyecto);
            if (!p) return null;
            return (
              <Revelar key={f.nombre} retraso={(i % 3) * 0.07 + Math.floor(i / 3) * 0.1}>
                <Enlace href={`${RAIZ}/${p.slug}`} className="block" aria-label={`${f.nombre}: ver ${p.titulo}`}>
                  <TarjetaFoto imagenes={[p.poster]} ancho={1200} className="aspect-[16/10] lg:aspect-auto lg:h-[min(26svh,280px)]">
                    {() => (
                      <div className="relative flex h-full flex-col justify-end p-6">
                        <h3 className="text-2xl font-bold leading-tight tracking-[-0.025em]">{f.nombre}</h3>
                        <Revelable>
                          <p className="mt-1.5 max-w-sm text-[15px] leading-snug text-white/80 [text-wrap:pretty]">{f.texto}</p>
                          <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#ffc07a]">
                            {p.titulo}
                            <Icono nombre="flecha" className="h-3.5 w-3.5" />
                          </span>
                        </Revelable>
                      </div>
                    )}
                  </TarjetaFoto>
                </Enlace>
              </Revelar>
            );
          })}
        </div>
      </div>
    </section>
  );
}
