"use client";

import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { useReducir } from "../../_comun/hooks";
import { CANALES, CLIENTES, JUNO, OPINIONES, type Bloque, type ClienteD } from "../datos";
import { Icono } from "../Iconos";
import { Contador, CURVA, Revelar, Titular } from "../piezas";

const CIFRAS = [
  { valor: 9, prefijo: "+", sufijo: "", unidad: "años", texto: "contando historias: primero en YouTube, después en el set" },
  { valor: 1.39, decimales: 2, sufijo: " M", unidad: "visualizaciones", texto: "del EP Oscuridad, de Adrián Muñoz" },
];

const PREMIOS = [
  { premio: "Mejor fotografía", donde: "On Duty International Film Festival", obra: "El Cirujano" },
  { premio: "Podio", donde: "ESCAC Dreammakers Contest 2024", obra: "Y el año que viene, ¿qué?" },
];

/** Cifras que cuentan al entrar y premios con laurel, en un bento de cristal. */
export function BloqueCifras({ bloque }: { bloque: Bloque }) {
  return (
    <section className="px-4 py-24 sm:px-8 sm:py-32 lg:py-[6svh]">
      <div className="mx-auto max-w-7xl">
        <Titular antetitulo={bloque.datos.antetitulo} titulo={bloque.datos.titulo} />
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:mt-[4svh] lg:grid-cols-4">
          {CIFRAS.map((c, i) => (
            <Revelar key={c.unidad} retraso={i * 0.08}>
              <div data-foco className="cristal flex h-full min-h-[220px] flex-col justify-between rounded-[32px] p-7 lg:min-h-[min(30svh,260px)]">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--d-tenue)]">{c.unidad}</span>
                <div>
                  <p className="d-degradado whitespace-nowrap text-[clamp(2.8rem,min(4.6vw,9svh),4.8rem)] font-extrabold leading-none tracking-[-0.055em]">
                    <Contador valor={c.valor} decimales={c.decimales} prefijo={c.prefijo} sufijo={c.sufijo} />
                  </p>
                  <p className="mt-3 text-sm text-[var(--d-suave)]">{c.texto}</p>
                </div>
              </div>
            </Revelar>
          ))}
          {PREMIOS.map((p, i) => (
            <Revelar key={p.premio} retraso={0.16 + i * 0.08}>
              <div data-foco className="cristal relative flex h-full min-h-[200px] flex-col justify-between gap-6 overflow-hidden rounded-[32px] p-7 lg:min-h-[min(30svh,260px)]">
                <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(closest-side,var(--d-orbe-b),transparent)]" />
                <Icono nombre="laurel" className="h-12 w-12 shrink-0 text-[#e9b45c]" />
                <div className="relative">
                  <p className="text-2xl font-extrabold leading-tight tracking-[-0.03em] sm:text-3xl">{p.premio}</p>
                  <p className="mt-1 text-sm text-[var(--d-suave)]">{p.donde}</p>
                  <p className="mt-2 text-[15px] font-semibold text-[var(--d-acento)]">{p.obra}</p>
                </div>
              </div>
            </Revelar>
          ))}
          {/* Canales de YouTube: de ahí vienen muchos de esos años. Las cifras de suscriptores, cuando Josep las pase */}
          {CANALES.map((c, i) => (
            <Revelar key={c.nombre} retraso={0.3 + i * 0.08} className="sm:col-span-2 lg:col-span-2">
              <div data-foco className="cristal flex h-full items-start gap-5 rounded-[32px] p-7">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#ff0033] text-white shadow-[0_10px_30px_-10px_rgba(255,0,51,0.7)]">
                  <Icono nombre="play" className="ml-0.5 h-6 w-6" />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--d-tenue)]">Canal de YouTube</p>
                  <p className="mt-1 text-2xl font-bold tracking-[-0.03em]">{c.nombre}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--d-suave)]">{c.texto}</p>
                  {c.url ? (
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--d-acento)]"
                    >
                      Ver canal
                      <Icono nombre="flecha" className="h-4 w-4" />
                    </a>
                  ) : (
                    <p className="mt-4 text-xs text-[var(--d-tenue)]">Enlace pendiente</p>
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
  const fila1 = [...OPINIONES, ...OPINIONES];
  const fila2 = [...OPINIONES.slice(2), ...OPINIONES.slice(0, 2)];
  const fila2Doble = [...fila2, ...fila2];
  // Las filas solo se mueven con la sección en pantalla: fuera de ella no hay animación (ni capa) que mantener
  const ref = useRef<HTMLElement>(null);
  const enPantalla = useInView(ref, { margin: "100px" });

  return (
    <section ref={ref} className="overflow-hidden py-24 sm:py-32 lg:py-[6svh]">
      <div className="px-4 sm:px-8">
        <Titular antetitulo={bloque.datos.antetitulo} titulo={bloque.datos.titulo} centrado />
      </div>
      <div className="d-marquesina-pausa d-mascara-lados mt-14 flex flex-col gap-4 lg:mt-[5svh]">
        <div className={`${enPantalla ? "d-marquesina" : ""} flex w-max gap-4`} style={{ "--duracion": "70s" } as React.CSSProperties}>
          {fila1.map((o, i) => (
            <Opinion key={`a-${i}`} {...o} />
          ))}
        </div>
        <div className={`${enPantalla ? "d-marquesina-inversa" : ""} flex w-max gap-4`} style={{ "--duracion": "80s" } as React.CSSProperties}>
          {fila2Doble.map((o, i) => (
            <Opinion key={`b-${i}`} {...o} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Opinion({ texto, quien, tipo }: { texto: string; quien: string; tipo: string }) {
  return (
    <figure data-foco className="cristal flex w-[320px] shrink-0 flex-col justify-between gap-6 rounded-[28px] p-6 sm:w-[380px]">
      <blockquote className="text-[17px] font-medium leading-snug tracking-[-0.01em]">
        <span className="mb-2 block text-4xl font-extrabold leading-none text-[var(--d-acento)]">“</span>
        {texto}
      </blockquote>
      <figcaption className="flex items-center gap-3 text-xs text-[var(--d-suave)]">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[var(--d-acento)] to-[var(--d-calido)] text-[11px] font-bold text-white">
          {quien[0]}
        </span>
        <span>
          <span className="block font-semibold text-[var(--d-texto)]">{quien}</span>
          {tipo}
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
  const rejilla = useRef<HTMLDivElement>(null);
  const enPantalla = useInView(rejilla, { amount: 0.4 });
  const reducir = useReducir();
  return (
    <section className="py-20 sm:py-28 lg:py-[6svh]">
      {/* Primera parte, la principal: titular de verdad y todas las marcas a la vista a la vez */}
      <div className="px-4 sm:px-8">
        <Titular antetitulo="Clientes" titulo={bloque.datos.titulo} centrado />
      </div>
      {/* Sin marquesina: todas las marcas quietas y visibles, Disney y Star Wars primero. Entran escalonadas
          una sola vez y, mientras la sección está en pantalla, un barrido de luz suave las recorre en
          diagonal cada pocos segundos (ver .d-barrido en cristal.css) */}
      <div
        ref={rejilla}
        data-barrido={enPantalla && !reducir ? "" : undefined}
        className="d-barrido mx-auto mt-12 grid max-w-6xl grid-cols-2 gap-y-2 px-4 sm:grid-cols-3 sm:px-8 lg:mt-[5svh] lg:grid-cols-5"
      >
        {CLIENTES.map((c, i) => (
          <motion.div
            key={c.nombre}
            className="flex h-24 items-center justify-center px-3 text-center lg:h-28"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: CURVA, delay: i * 0.05 }}
          >
            {/* El barrido sube la opacidad de cada marca por turnos: columna (de izquierda a derecha) y fila (un
                poco después la de abajo), así la luz cruza la rejilla en una diagonal leve */}
            <span className="d-barrido-marca" style={{ animationDelay: `${(i % 5) * 0.34 + Math.floor(i / 5) * 0.22}s` }}>
              <Logo cliente={c} grande barrido />
            </span>
          </motion.div>
        ))}
      </div>

      {/* Segunda parte, secundaria dentro de la misma sección: JUNO más pequeño y con menos contraste */}
      <div className="mx-auto mt-14 max-w-5xl px-4 text-center sm:px-8 lg:mt-[6svh]">
        <Revelar>
          {/* Dos líneas separadas: el rótulo pequeño arriba y la marca debajo, con aire entre ambas */}
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--d-ante)]">En sinergia con</p>
          <p className="mt-5 text-3xl leading-none tracking-[0.16em] text-[var(--d-juno)] sm:text-4xl">
            <span className="font-extrabold">JUNO</span>
            <span className="ml-[0.3em] font-light">MEDIA</span>
          </p>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-[var(--d-ante)] [text-wrap:balance]">{JUNO.texto}</p>
        </Revelar>
        <Revelar retraso={0.12}>
          {/* Las marcas en fila, separadas por líneas finas: nada de etiquetas */}
          <div className="mx-auto mt-8 grid grid-cols-2 border-y border-[var(--d-linea)] md:grid-cols-5 md:divide-x md:divide-[var(--d-linea)]">
            {JUNO.clientes.map((c) => (
              <div key={c.nombre} className="flex h-16 items-center justify-center">
                <Logo cliente={c} compacto />
              </div>
            ))}
          </div>
        </Revelar>
      </div>
    </section>
  );
}

/**
 * Logo del cliente; si la imagen no carga (enlaces externos que caducan), su nombre en texto.
 * Con `barrido` va a tono pleno y la luminancia la pone el contenedor del barrido de luz (82 % → 100 %).
 */
function Logo({ cliente: c, compacto, grande, barrido }: { cliente: ClienteD; compacto?: boolean; grande?: boolean; barrido?: boolean }) {
  const [roto, setRoto] = useState(false);
  return (
    <span className={`flex shrink-0 items-center justify-center ${compacto ? "h-12 px-3" : grande ? "h-20" : "h-16 px-10 sm:px-14"}`}>
      {c.logo && !roto ? (
        <img
          src={c.logo}
          alt={c.nombre}
          style={{ height: (c.alto ?? 36) * (grande ? 0.85 : compacto ? 0.6 : 1) }}
          className={`d-logo w-auto object-contain ${barrido ? "!opacity-100" : ""}`}
          draggable={false}
          onError={() => setRoto(true)}
        />
      ) : c.estilo === "firma" ? (
        // Artistas: su nombre como firma, en la cursiva de acento
        <span
          className={`d-serif whitespace-nowrap transition-colors duration-300 hover:text-[var(--d-texto)] ${compacto ? "text-3xl text-[var(--d-medio)]" : `text-5xl ${barrido ? "text-[var(--d-texto)]" : "text-[var(--d-cliente)]"}`}`}
        >
          {c.nombre}
        </span>
      ) : (
        // Sin logo: el nombre compuesto como marca (versalitas espaciadas), no como etiqueta
        <span
          className={`font-semibold uppercase transition-colors duration-300 hover:text-[var(--d-texto)] ${
            compacto
              ? "whitespace-nowrap text-[12px] tracking-[0.18em] text-[var(--d-medio)]"
              : grande
                ? // Los nombres largos pueden partirse en dos líneas centradas dentro de su celda
                  `max-w-[15ch] text-[15px] leading-snug tracking-[0.16em] [text-wrap:balance] sm:text-[17px] ${barrido ? "text-[var(--d-texto)]" : "text-[var(--d-cliente)]"}`
                : "whitespace-nowrap text-[15px] tracking-[0.22em] text-[var(--d-tenue)] sm:text-base"
          }`}
        >
          {c.nombre}
        </span>
      )}
    </span>
  );
}
