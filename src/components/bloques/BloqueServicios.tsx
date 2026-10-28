"use client";

import Link from "next/link";
import { useState } from "react";
import { imagenesDe, mediosDeServicio } from "@/lib/datos/seleccion";
import type { Bloque, Medio, Servicio } from "@/lib/datos/tipos";
import { lista, objeto, texto } from "@/lib/datos/util";
import { RUTAS } from "@/lib/rutas";
import { Enlace } from "../comun/Enlace";
import { usePunteroFino } from "../comun/hooks";
import { Icono } from "../Iconos";
import { useDatos } from "../marco/DatosWeb";
import { Diapositivas, Revelar, Titular } from "../piezas";

/** Desvanece la foto de una tarjeta antes del borde inferior, para que no asome en el suavizado de la esquina */
export const MASCARA_BORDE = "[mask-image:linear-gradient(to_top,transparent,#000_10%)]";

/** Icono de cada servicio por su slug; uno nuevo creado desde el panel lleva la cámara */
export const ICONOS_SERVICIO: Record<string, string> = { "direccion-de-fotografia": "camara", filmmaker: "claqueta", edicion: "ritmo" };

/**
 * Servicios: en escritorio, tres tarjetas verticales con revelación al pasar el ratón.
 * En móvil, tres banners panorámicos amplios que dejan ver bien la fotografía de fondo y caben juntos en una pantalla.
 */
export function BloqueServicios({ bloque, ancla }: { bloque: Bloque; ancla?: string }) {
  const { servicios, proyectos } = useDatos();
  const [servicioActivo, setServicioActivo] = useState<string | null>(null);
  return (
    <section id={ancla} className="flex min-h-[100svh] flex-col justify-center px-4 py-6 sm:px-8 sm:py-24 lg:py-[6svh]">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center">
        <Titular antetitulo={bloque.datos.antetitulo} titulo={bloque.datos.titulo} texto={bloque.datos.texto} />
        <div className="mt-4 grid gap-3 sm:mt-12 sm:gap-4 md:grid-cols-3 lg:mt-[5svh]">
          {servicios.map((s, i) => (
            <Revelar key={s.slug} retraso={i * 0.08}>
              <Tarjeta
                servicio={s}
                imagenes={imagenesDe(s, proyectos)}
                medios={mediosDeServicio(s, proyectos)}
                activoMovil={servicioActivo === s.slug}
                alActivarMovil={() => setServicioActivo(s.slug)}
              />
            </Revelar>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Marco común de las tarjetas con foto: recorte con clip-path adaptable a móvil y escritorio,
 * degradado por encima y contenido que se revela.
 */
function TarjetaFoto({
  imagenes,
  medios,
  ancho,
  className,
  suave = false,
  activoMovil = false,
  children,
}: {
  imagenes: string[];
  medios?: Medio[];
  ancho: 1200 | 1920;
  className: string;
  /** Tarjetas apaisadas (filmmaker): la foto a todo color y la sombra solo al pie; se oscurece al pasar el ratón,
   *  cuando aparece la frase */
  suave?: boolean;
  activoMovil?: boolean;
  children: (encima: boolean, fino: boolean) => React.ReactNode;
}) {
  const fino = usePunteroFino();
  const [encima, setEncima] = useState(false);
  return (
    <div
      onPointerEnter={() => setEncima(true)}
      onPointerLeave={() => setEncima(false)}
      className={`group relative isolate overflow-hidden rounded-[22px] bg-black text-white shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 [clip-path:inset(0_round_22px)] md:rounded-[36px] md:[clip-path:inset(0_round_36px)] ${className}`}
    >
      {/* Máscara: la foto se desvanece del todo antes del borde inferior */}
      <Diapositivas
        imagenes={imagenes}
        medios={medios}
        activo={(encima && fino) || (!fino && activoMovil)}
        ancho={ancho}
        className={`${suave ? "" : "opacity-95 transition-opacity duration-700 group-hover:opacity-100"} ${MASCARA_BORDE}`}
      />
      {/* Degradados de contraste para legibilidad de títulos */}
      {suave ? (
        <>
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.35)_38%,transparent_68%)]" />
          <div className={`absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.45)_45%,rgba(0,0,0,0.1)_100%)] transition-opacity duration-700 ${activoMovil ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-[linear-gradient(to_top,#000_0%,rgba(0,0,0,0.88)_16%,rgba(0,0,0,0.38)_42%,rgba(0,0,0,0.08)_65%,transparent_85%)]" />
          <div className={`absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.6)_40%,transparent_75%)] transition-opacity duration-500 ${activoMovil ? "opacity-100" : "opacity-0"}`} />
        </>
      )}
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

function Tarjeta({
  servicio: s,
  imagenes,
  medios,
  activoMovil = false,
  alActivarMovil,
}: {
  servicio: Servicio;
  imagenes: string[];
  medios?: Medio[];
  activoMovil?: boolean;
  alActivarMovil?: () => void;
}) {
  const fino = usePunteroFino();

  const alPulsar = (e: React.MouseEvent) => {
    // Si pulsa directamente la flecha de la esquina, navega al instante
    const target = e.target as HTMLElement | null;
    if (target?.closest("[data-enlace-directo]")) return;

    // En pantallas táctiles: el primer toque activa el servicio para mostrar el subtexto
    // y mantenerlo visible; el segundo toque navega a la página del servicio
    if (!fino && !activoMovil) {
      e.preventDefault();
      alActivarMovil?.();
    }
  };

  return (
    <Link
      href={RUTAS.servicio(s.slug)}
      onClick={alPulsar}
      onTouchStart={() => {
        if (!fino && !activoMovil) alActivarMovil?.();
      }}
      className="block"
    >
      <TarjetaFoto
        imagenes={imagenes}
        medios={medios}
        ancho={1920}
        activoMovil={activoMovil}
        className="jm-banner-servicio w-full"
      >
        {() => (
          <>
            {/* Versión móvil (< md): banner panorámico amplio. Al tocarlo o poner el dedo encima, revela el subtexto y se mantiene */}
            <div className="relative flex h-full flex-col justify-between p-4 sm:p-5 md:hidden">
              <div className="flex items-start justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-black/35 backdrop-blur-sm">
                  <Icono nombre={ICONOS_SERVICIO[s.slug] ?? "camara"} className="h-4 w-4" />
                </span>
                <span
                  data-enlace-directo
                  aria-label={`Ver servicio ${s.nombre}`}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/35 backdrop-blur-sm transition-all duration-500 ${
                    activoMovil ? "border-[#ffc07a]/60 bg-[#ffc07a]/20 text-[#ffc07a] -rotate-45 scale-110 shadow-[0_0_15px_rgba(255,192,122,0.3)]" : ""
                  }`}
                >
                  <Icono nombre="flecha" className="h-4 w-4" />
                </span>
              </div>
              <div className="[text-shadow:0_2px_16px_rgba(0,0,0,0.65)]">
                <h3 className="text-xl font-extrabold leading-tight tracking-[-0.025em]">{s.nombre}</h3>
                <div
                  className={`grid transition-[grid-template-rows,opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    activoMovil
                      ? "grid-rows-[1fr] opacity-100 translate-y-0 mt-1.5"
                      : "grid-rows-[0fr] opacity-0 translate-y-2 mt-0 pointer-events-none"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="jm-serif text-[15px] sm:text-base leading-snug text-[#ffc07a]">{s.frase}</p>
                    <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-white/90">
                      Ver proyectos y cómo trabajo
                      <Icono nombre="flecha" className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Versión escritorio (>= md): tarjeta vertical cinematográfica completa */}
            <div className="relative hidden h-full flex-col justify-between p-7 md:flex">
              <div className="flex items-start justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/15">
                  <Icono nombre={ICONOS_SERVICIO[s.slug] ?? "camara"} className="h-6 w-6" />
                </span>
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/30 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-rotate-45 group-hover:scale-110">
                  <Icono nombre="flecha" className="h-4 w-4" />
                </span>
              </div>
              <div>
                <h3 className="text-[30px] font-bold leading-[1.1] tracking-[-0.03em] [text-wrap:balance]">{s.nombre}</h3>
                {/* Entre el título y el enlace aparecen, al pasar el ratón, la frase y para quién */}
                <Revelable>
                  <p className="jm-serif mt-2 text-[26px] leading-tight text-[#ffc07a]">{s.frase}</p>
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
          </>
        )}
      </TarjetaFoto>
    </Link>
  );
}

/**
 * Lo que grabo como filmmaker: la rejilla de servicios de la web antigua (spots, eventos, bodas, redes...).
 * En móvil se organiza en 2 columnas compactas con cabecera ajustada para que quepan las 6 tarjetas en una pantalla.
 */
export function BloqueFilmmaker({ bloque }: { bloque: Bloque }) {
  const { proyectos, medios } = useDatos();
  const piezas = lista(bloque.datos.piezas).flatMap((x) => {
    const o = objeto(x);
    const p = proyectos.find((y) => y.id === o.proyecto || y.slug === o.proyecto);
    const m = typeof o.imagen === "string" ? medios[o.imagen] : undefined;
    const medio = m ? (m.foco || !p?.poster?.foco ? m : { ...m, foco: p.poster.foco }) : p?.poster;
    const href = texto(o.href);
    return p || href ? [{ nombre: texto(o.nombre), texto: texto(o.texto), proyecto: p, href, foto: medio?.url, medio }] : [];
  });
  const enlace = objeto(bloque.datos.enlace);
  return (
    <section className="px-4 py-8 sm:px-8 sm:py-24 lg:py-[6svh]">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-3 sm:gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Titular antetitulo={bloque.datos.antetitulo} titulo={bloque.datos.titulo} texto={bloque.datos.texto} />
          {texto(enlace.href) && (
            <Revelar retraso={0.1}>
              <Link
                href={texto(enlace.href)}
                className="boton w-fit border border-[var(--jm-borde)] px-4 py-2 text-xs hover:bg-[var(--jm-cristal)] sm:px-5 sm:py-2.5 sm:text-sm"
              >
                {texto(enlace.texto) || "Ver más"}
                <Icono nombre="flecha" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Link>
            </Revelar>
          )}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-12 sm:gap-3 lg:mt-[5svh] lg:grid-cols-3">
          {piezas.map(({ proyecto: p, ...f }, i) => {
            return (
              <Revelar key={`${f.nombre}-${i}`} retraso={(i % 3) * 0.06}>
                <Enlace href={f.href || RUTAS.proyecto(p!.slug)} fundido={!!f.href} className="block" aria-label={f.href ? `${f.nombre}: cómo trabajo y proyectos` : `${f.nombre}: ver ${p?.titulo}`}>
                  <TarjetaFoto suave imagenes={f.foto ? [f.foto] : []} medios={f.medio ? [f.medio] : undefined} ancho={1200} className="aspect-[16/11] sm:aspect-[16/10] lg:aspect-auto lg:h-[min(26svh,280px)]">
                    {() => (
                      <div className="relative flex h-full flex-col justify-end p-3 sm:p-6 [text-shadow:0_2px_18px_rgba(0,0,0,0.55)]">
                        <h3 className="text-[13.5px] font-bold leading-tight tracking-[-0.02em] sm:text-2xl">{f.nombre}</h3>
                        <div className="hidden sm:block">
                          <Revelable>
                            <p className="mt-0.5 line-clamp-2 max-w-sm text-[11px] leading-snug text-white/80 [text-wrap:pretty] sm:mt-1.5 sm:line-clamp-none sm:text-[15px]">{f.texto}</p>
                            <span className="mt-1.5 inline-flex items-center gap-1 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-[#ffc07a] sm:mt-3 sm:gap-1.5 sm:text-xs">
                              {f.href ? `Ver ${f.nombre.toLowerCase()}` : p?.titulo}
                              <Icono nombre="flecha" className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
                            </span>
                          </Revelable>
                        </div>
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
