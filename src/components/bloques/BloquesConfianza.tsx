"use client";

import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import type { Bloque, Cliente, Opinion as DatoOpinion } from "@/lib/datos/tipos";
import { lista, objeto, texto } from "@/lib/datos/util";
import { enFilas, useColumnas, useMedia, useReducir } from "../comun/hooks";
import { Enlace } from "../comun/Enlace";
import { img } from "../comun/imagen";
import { Icono } from "../Iconos";
import { useDatos } from "../marco/DatosWeb";
import { Contador, CURVA, Revelar, Titular } from "../piezas";

/** Premios que van en Cifras, en este orden: los ganados y después los podios (las nominaciones y las cifras, solo en su ficha) */
const TIPOS_PREMIO = ["ganado", "podio"];

/**
 * Cifras que cuentan al entrar, premios con laurel (de los proyectos) y canales de YouTube, en un bento
 * de cristal. Las cifras están en los datos del bloque: [{ valor, decimales?, prefijo?, sufijo?, unidad, texto }].
 */
export function BloqueCifras({ bloque }: { bloque: Bloque }) {
  const { proyectos, canales } = useDatos();
  const cifras = lista(bloque.datos.cifras).flatMap((x) => {
    const o = objeto(x);
    return typeof o.valor === "number"
      ? [{ valor: o.valor, decimales: typeof o.decimales === "number" ? o.decimales : 0, prefijo: texto(o.prefijo), sufijo: texto(o.sufijo), unidad: texto(o.unidad), texto: texto(o.texto) }]
      : [];
  });
  const premios = TIPOS_PREMIO.flatMap((tipo) =>
    proyectos.flatMap((p) => p.premios.filter((x) => x.tipo === tipo).map((x) => ({ premio: x.nombre, donde: x.festival, obra: p.titulo }))),
  );
  return (
    <section className="px-4 py-8 sm:px-8 sm:py-24 lg:py-[6svh]">
      <div className="mx-auto w-full max-w-7xl">
        <Titular antetitulo={bloque.datos.antetitulo} titulo={bloque.datos.titulo} />
        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-12 sm:grid-cols-2 lg:mt-[4svh] lg:grid-cols-4 lg:gap-3">
          {cifras.map((c, i) => (
            <Revelar key={`${c.unidad}-${i}`} retraso={i * 0.04}>
              <div data-foco className="cristal flex h-full min-h-[135px] flex-col justify-between gap-2 rounded-[20px] p-4 sm:min-h-[220px] sm:rounded-[32px] sm:p-7 lg:min-h-[min(30svh,260px)]">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--jm-tenue)] sm:text-[11px] sm:tracking-[0.16em]">{c.unidad}</span>
                <div>
                  <p className="jm-degradado whitespace-nowrap text-[clamp(2.3rem,8.5vw,4.8rem)] font-extrabold leading-none tracking-[-0.055em]">
                    <Contador valor={c.valor} decimales={c.decimales} prefijo={c.prefijo} sufijo={c.sufijo} />
                  </p>
                  <p className="mt-1.5 text-xs leading-snug text-[var(--jm-suave)] sm:mt-3 sm:text-sm">{c.texto}</p>
                </div>
              </div>
            </Revelar>
          ))}
          {premios.map((p, i) => (
            <Revelar key={`${p.premio}-${p.obra}`} retraso={0.08 + i * 0.04}>
              <div data-foco className="cristal relative flex h-full min-h-[135px] flex-col justify-between gap-3 overflow-hidden rounded-[20px] p-4 sm:min-h-[200px] sm:gap-6 sm:rounded-[32px] sm:p-7 lg:min-h-[min(30svh,260px)]">
                <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(closest-side,var(--jm-orbe-b),transparent)]" />
                <Icono nombre="laurel" className="h-8 w-8 shrink-0 text-[#e9b45c] sm:h-12 sm:w-12" />
                <div className="relative">
                  <p className="text-lg font-extrabold leading-tight tracking-[-0.03em] sm:text-3xl">{p.premio}</p>
                  {p.donde && <p className="mt-1 text-xs leading-snug text-[var(--jm-suave)] sm:text-sm">{p.donde}</p>}
                  <p className="mt-1.5 text-xs font-semibold text-[var(--jm-acento)] sm:mt-2 sm:text-[15px]">{p.obra}</p>
                </div>
              </div>
            </Revelar>
          ))}
          {/* Canales de YouTube: de ahí vienen muchos de esos años */}
          {canales.map((c, i) => (
            <Revelar key={c.id} retraso={0.16 + i * 0.04} className="col-span-2 sm:col-span-2 lg:col-span-2">
              <div data-foco className="cristal flex h-full items-center gap-3.5 rounded-[20px] p-4 sm:items-start sm:gap-5 sm:rounded-[32px] sm:p-7">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ff0033] text-white shadow-[0_10px_30px_-10px_rgba(255,0,51,0.7)] sm:h-14 sm:w-14 sm:rounded-2xl">
                  <Icono nombre="play" className="ml-0.5 h-4 w-4 sm:h-6 sm:w-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--jm-tenue)] sm:text-[11px] sm:tracking-[0.16em]">Canal de YouTube</p>
                  <p className="mt-0.5 text-base font-bold tracking-[-0.03em] sm:mt-1 sm:text-2xl">{c.nombre}</p>
                  {c.cifra && <p className="text-xs font-semibold text-[var(--jm-texto)] sm:text-sm">{c.cifra}</p>}
                  <p className="mt-1 text-xs leading-relaxed text-[var(--jm-suave)] sm:mt-2 sm:text-sm">{c.texto}</p>
                  {c.url && (
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--jm-acento)] sm:mt-4 sm:gap-1.5 sm:text-sm"
                    >
                      Ver canal
                      <Icono nombre="flecha" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </a>
                  )}
                </div>
              </div>
            </Revelar>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Opiniones en dos filas de tarjetas de cristal que se mueven en sentidos opuestos. */
export function BloqueOpiniones({ bloque }: { bloque: Bloque }) {
  const { opiniones } = useDatos();
  const fila1 = [...opiniones, ...opiniones];
  const fila2 = [...opiniones.slice(2), ...opiniones.slice(0, 2)];
  const fila2Doble = [...fila2, ...fila2];
  // Las filas solo se mueven con la sección en pantalla: fuera de ella no hay animación (ni capa) que mantener
  const ref = useRef<HTMLElement>(null);
  const enPantalla = useInView(ref, { margin: "100px" });
  if (!opiniones.length) return null;

  return (
    <section ref={ref} className="overflow-hidden py-8 sm:py-24 lg:py-[6svh]">
      <div className="px-4 sm:px-8">
        <Titular antetitulo={bloque.datos.antetitulo} titulo={bloque.datos.titulo} centrado />
      </div>
      <div className="jm-marquesina-pausa jm-mascara-lados mt-5 sm:mt-14 flex flex-col gap-2.5 sm:gap-4 lg:mt-[5svh]">
        <div className={`${enPantalla ? "jm-marquesina" : ""} flex w-max gap-2.5 sm:gap-4`} style={{ "--duracion": "70s" } as React.CSSProperties}>
          {fila1.map((o, i) => (
            <Opinion key={`a-${i}`} {...o} />
          ))}
        </div>
        <div className={`${enPantalla ? "jm-marquesina-inversa" : ""} flex w-max gap-2.5 sm:gap-4`} style={{ "--duracion": "80s" } as React.CSSProperties}>
          {fila2Doble.map((o, i) => (
            <Opinion key={`b-${i}`} {...o} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Opinion({ texto, autor: quien, contexto: tipo }: DatoOpinion) {
  return (
    <figure data-foco className="cristal flex w-[250px] shrink-0 flex-col justify-between gap-3 rounded-[18px] p-4 sm:w-[380px] sm:gap-6 sm:rounded-[28px] sm:p-6">
      <blockquote className="text-[13px] font-medium leading-snug tracking-[-0.01em] sm:text-[17px]">
        <span className="mb-1 block text-2xl font-extrabold leading-none text-[var(--jm-acento)] sm:mb-2 sm:text-4xl">“</span>
        {texto}
      </blockquote>
      <figcaption className="flex items-center gap-2.5 text-xs text-[var(--jm-suave)] sm:gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--jm-acento)] to-[var(--jm-calido)] text-[10px] font-bold text-white sm:h-8 sm:w-8 sm:text-[11px]">
          {quien.trim()[0] ?? "“"}
        </span>
        <span className="min-w-0">
          <span className="block truncate font-semibold text-[var(--jm-texto)]">{quien}</span>
          <span className="block truncate text-[11px]">{tipo}</span>
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * Clientes: todas las marcas a la vista a la vez, quietas (logos oficiales monocromos según el tema y,
 * sin logo, el nombre compuesto como marca). Debajo, JUNO Media como apartado secundario: rótulo, marca,
 * una frase en primera persona y las marcas de los proyectos juntos.
 */
export function BloqueClientes({ bloque }: { bloque: Bloque }) {
  const { clientes } = useDatos();
  const principales = clientes.filter((c) => !c.conJuno);
  const juno = clientes.filter((c) => c.conJuno);
  const textoJuno = texto(objeto(bloque.datos.juno).texto);
  // «Así trabajamos»: lleva al artículo sobre la colaboración; sin dirección no sale
  const enlaceJuno = objeto(objeto(bloque.datos.juno).enlace);
  const rejilla = useRef<HTMLDivElement>(null);
  const enPantalla = useInView(rejilla, { amount: 0.4 });
  const reducir = useReducir();
  const sm = useMedia("(min-width: 640px)", true);
  // En móvil se muestran en 4 columnas compactas para que todas quepan en una pantalla en vez de hacer scroll interminable
  const colBase = useColumnas(8);
  const columnas = sm ? colBase : 4;
  // JUNO, más pequeño y con divisores: 6 en ordenador, 3 en móvil
  const colJunoBase = useColumnas(6);
  const columnasJuno = sm ? colJunoBase : 3;

  return (
    <section className="py-8 sm:py-24 lg:py-[6svh]">
      {/* Primera parte, la principal: titular de verdad y todas las marcas a la vista a la vez */}
      <div data-punto-alto>
        <div className="px-4 sm:px-8">
          <Titular antetitulo={bloque.datos.antetitulo} titulo={bloque.datos.titulo} centrado />
        </div>
        <div
          ref={rejilla}
          data-barrido={enPantalla && !reducir ? "" : undefined}
          className="jm-barrido mx-auto mt-5 sm:mt-12 flex max-w-[96rem] flex-col gap-y-1 px-4 sm:px-8 lg:mt-[4.5svh]"
        >
          {enFilas(principales, columnas).map((fila, f) => (
            <div key={f} className="flex justify-center">
              {fila.map((c, k) => {
                const i = f * columnas + k;
                return (
                  <motion.div
                    key={c.id}
                    className="flex h-12 items-center justify-center px-1 text-center sm:h-24 sm:px-2 lg:h-[min(7rem,12svh)]"
                    style={{ width: `${100 / columnas}%` }}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20px" }}
                    transition={{ duration: 0.8, ease: CURVA, delay: i * 0.04 }}
                  >
                    <span className="jm-barrido-marca" style={{ animationDelay: `${(k / Math.max(columnas - 1, 1)) * 1.36 + f * 0.22}s` }}>
                      <Logo cliente={c} grande barrido />
                    </span>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Segunda parte, secundaria dentro de la misma sección: JUNO más pequeño y con menos contraste */}
      {juno.length > 0 && (
        <div data-punto-alto className="mx-auto mt-8 max-w-7xl px-4 text-center sm:mt-14 sm:px-8 lg:mt-[6svh]">
          <Revelar>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--jm-ante)] sm:text-[11px] sm:tracking-[0.28em]">En sinergia con</p>
            <p className="mt-2 text-2xl leading-none tracking-[0.16em] text-[var(--jm-juno)] sm:mt-5 sm:text-4xl">
              <span className="font-extrabold">JUNO</span>
              <span className="ml-[0.3em] font-light">MEDIA</span>
            </p>
            <p className="mx-auto mt-2 max-w-xl text-xs leading-relaxed text-[var(--jm-ante)] [text-wrap:balance] sm:mt-5 sm:text-[15px]">{textoJuno}</p>
            {texto(enlaceJuno.href) && (
              <Enlace
                href={texto(enlaceJuno.href)}
                className="group mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--jm-texto)] transition-colors hover:text-[var(--jm-acento)] sm:mt-5 sm:gap-2 sm:text-sm"
              >
                {texto(enlaceJuno.texto) || "Así trabajamos"}
                <Icono nombre="flecha" className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1 sm:h-4 sm:w-4" />
              </Enlace>
            )}
          </Revelar>
          <Revelar retraso={0.12}>
            <div className="mx-auto mt-5 flex flex-col divide-y divide-[var(--jm-linea)] border-t border-[var(--jm-linea)] sm:mt-8">
              {enFilas(juno, columnasJuno).map((fila, f) => (
                <div key={f} className="flex justify-center divide-x divide-[var(--jm-linea)]">
                  {fila.map((c) => (
                    <div key={c.id} className="flex h-11 items-center justify-center sm:h-16" style={{ width: `${100 / columnasJuno}%` }}>
                      <Logo cliente={c} compacto />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Revelar>
        </div>
      )}
    </section>
  );
}

/**
 * Logo del cliente; si la imagen no carga (enlaces externos que caducan), su nombre en texto.
 * Con `barrido`, la luminancia la pone sobre todo el contenedor del barrido de luz (82 % → 100 %). Un logo es una
 * mancha llena y a la misma opacidad parece más brillante que un nombre en letra fina: por eso los logos van un
 * punto por debajo de los nombres (ver .jm-logo-barrido y .jm-logo-compacto en web.css).
 */
export function Logo({ cliente: c, compacto, grande, barrido }: { cliente: Cliente; compacto?: boolean; grande?: boolean; barrido?: boolean }) {
  const [roto, setRoto] = useState(false);
  const palabraLarga = Math.max(...c.nombre.split(/\s+/).map((p) => p.length)) > 13;
  return (
    <span className={`flex shrink-0 items-center justify-center ${compacto ? "h-10 px-2 sm:h-12 sm:px-3" : grande ? "h-12 sm:h-20" : "h-12 px-4 sm:h-16 sm:px-10"}`}>
      {c.logo && !roto ? (
        <img
          src={img(c.logo.url, 384)}
          alt={c.nombre}
          style={{ height: (c.altoLogo ?? 36) * (grande ? 0.7 : compacto ? 0.5 : 0.8) }}
          className={`jm-logo max-h-7 max-w-[70px] sm:max-h-none sm:max-w-none w-auto object-contain ${barrido ? "jm-logo-barrido" : compacto ? "jm-logo-compacto" : ""}`}
          draggable={false}
          onError={() => setRoto(true)}
        />
      ) : c.estilo === "firma" ? (
        // Artistas: su nombre como firma, en la cursiva de acento
        <span
          className={`jm-serif whitespace-nowrap transition-colors duration-300 hover:text-[var(--jm-texto)] ${compacto ? "text-xl sm:text-3xl text-[var(--jm-medio)]" : `text-2xl sm:text-5xl ${barrido ? "text-[var(--jm-texto)]" : "text-[var(--jm-cliente)]"}`}`}
        >
          {c.nombre}
        </span>
      ) : (
        // Sin logo: el nombre compuesto como marca (versalitas espaciadas), no como etiqueta
        <span
          className={`font-semibold uppercase transition-colors duration-300 hover:text-[var(--jm-texto)] ${
            compacto
              ? "mx-2 max-w-[15ch] text-center text-[10px] leading-snug tracking-[0.14em] sm:mx-5 sm:text-[12px] sm:tracking-[0.18em] [text-wrap:balance] text-[var(--jm-medio)]"
              : grande
                ? // Los nombres largos pueden partirse en dos líneas centradas dentro de su celda; una palabra muy
                  // larga (no se puede partir) va algo más pequeña para no pisar a la de al lado
                  `leading-snug [text-wrap:balance] ${
                    palabraLarga ? "mx-1 text-[10px] tracking-[0.08em] sm:mx-4 sm:text-[15px]" : "mx-1 max-w-[15ch] text-[11px] tracking-[0.12em] sm:mx-4 sm:text-[17px] sm:tracking-[0.16em]"
                  } ${barrido ? "text-[var(--jm-texto)]" : "text-[var(--jm-cliente)]"}`
                : "whitespace-nowrap text-xs tracking-[0.16em] text-[var(--jm-tenue)] sm:text-base sm:tracking-[0.22em]"
          }`}
        >
          {c.nombre}
        </span>
      )}
    </span>
  );
}
