"use client";

import { animate, AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { fotogramas, laurel, mediosDeProyecto, proyectosDe, tiposDe } from "@/lib/datos/seleccion";
import type { Bloque, Proyecto } from "@/lib/datos/tipos";
import { RUTAS } from "@/lib/rutas";
import { CURVA_VIAJE } from "@/styles/movimiento";
import { Enlace } from "../comun/Enlace";
import { SelloJuno } from "../comun/SelloJuno";
import { usePunteroFino, useReducir } from "../comun/hooks";
import { enfoque, img } from "../comun/imagen";
import { Icono } from "../Iconos";
import { useDatos } from "../marco/DatosWeb";
import { CURVA, Diapositivas, Revelar, Titular } from "../piezas";
import { lista } from "@/lib/datos/util";
import { useEditando } from "../edicion/contexto";
import { RejillaVideos } from "../trabajos/MasVideos";
import { Visor } from "../trabajos/Visor";
import { MASCARA_BORDE } from "./BloqueServicios";

/**
 * Trabajos: carrusel de tarjeta protagonista sobre scroll horizontal nativo con ajuste (scroll-snap).
 * El navegador mueve las tarjetas en el compositor, así que el avance va fluido; antes un carrusel hecho
 * a mano animaba con JavaScript la pista y siete tarjetas en cada fotograma, con un fondo desenfocado
 * a pantalla completa, y daba tirones.
 * - La tarjeta activa (centrada) se detecta por la posición del scroll; las vecinas se atenúan y encogen
 *   con una transición CSS que solo se dispara cuando cambia la activa.
 * - Flechas, puntos y clic en una vecina hacen scroll suave nativo; con el ratón también se arrastra.
 * - El fondo se tiñe con el fotograma de la activa: una imagen diminuta ampliada (se ve desenfocada sin
 *   usar filtros) con un fundido de opacidad.
 * - Al cambiar de filtro: altura fija, la lista se funde y la nueva entra escalonada desde la primera.
 */
export function BloqueTrabajos({ bloque, ancla }: { bloque: Bloque; ancla?: string }) {
  // Con tipos elegidos (páginas de cada especialidad), todos los proyectos de esos tipos en rejilla
  const tipos = lista(bloque.datos.tipos).filter((t): t is string => typeof t === "string");
  // Proyectos elegidos a mano, en su orden: mandan sobre el origen y los tipos
  const elegidos = lista(bloque.datos.proyectos).filter((t): t is string => typeof t === "string");
  if (elegidos.length) return <RejillaTipos bloque={bloque} cumple={(p) => elegidos.includes(p.id)} orden={elegidos} ancla={ancla} />;
  // Con origen «juno» (página de JUNO Media), los proyectos hechos con JUNO Media: los siete primeros, que son muchos
  if (bloque.datos.origen === "juno") return <RejillaTipos bloque={bloque} cumple={(p) => p.conJuno} maximo={7} ancla={ancla} />;
  return tipos.length ? (
    <RejillaTipos bloque={bloque} cumple={(p) => tiposDe(p).some((t) => tipos.includes(t))} ancla={ancla} />
  ) : (
    <Destacados bloque={bloque} ancla={ancla} />
  );
}

/**
 * Todos los proyectos publicados de unos tipos (los videoclips, las bodas...). Con varios, el primero va en grande,
 * a lo ancho, y el resto en rejilla. Con uno solo, la especialidad no se queda en una tarjeta suelta: el proyecto
 * en grande, un mosaico con las fotos de su galería (sin repetir las que ya salen en la página) que se abren en
 * grande, y sus «Más vídeos».
 */
function RejillaTipos({ bloque, cumple, maximo, orden, ancla }: { bloque: Bloque; cumple: (p: Proyecto) => boolean; maximo?: number; orden?: string[]; ancla?: string }) {
  const { proyectos } = useDatos();
  const editando = useEditando();
  const de = proyectos.filter(cumple).slice(0, maximo);
  if (orden) de.sort((a, b) => orden.indexOf(a.id) - orden.indexOf(b.id));
  if (!de.length && !editando) return null;
  const [primero, ...resto] = de;
  return (
    <section id={ancla} className="px-4 py-8 sm:px-8 sm:py-24 lg:py-[5svh]">
      <div className="mx-auto max-w-7xl">
        <Titular antetitulo={bloque.datos.antetitulo} titulo={bloque.datos.titulo} texto={bloque.datos.texto} />
        {!de.length && <p className="mt-8 text-[var(--jm-suave)]">Todavía no hay proyectos publicados de este tipo.</p>}
        {primero && (
          <Revelar className="mt-5 sm:mt-10 lg:mt-[4svh]">
            <ProyectoAncho proyecto={primero} />
          </Revelar>
        )}
        {resto.length > 0 && (
          <div className={`mt-3 grid grid-cols-2 gap-2.5 sm:mt-4 sm:gap-4 md:grid-cols-2 ${resto.length % 3 === 0 ? "lg:grid-cols-3" : ""}`}>
            {resto.map((p, i) => (
              <Revelar key={p.slug} retraso={(i % 3) * 0.08}>
                <TarjetaProyecto proyecto={p} />
              </Revelar>
            ))}
          </div>
        )}
        {primero && !resto.length && <Mosaico proyecto={primero} />}
        {primero && !resto.length && primero.videos.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-extrabold tracking-[-0.035em] sm:text-3xl">{primero.titulosSeccion.mas_videos || "Más vídeos"}</h3>
            <div className="mt-6">
              <RejillaVideos videos={primero.videos} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/** Un proyecto a lo ancho, en formato cine: la portada crece hasta la cabecera de su ficha al entrar */
function ProyectoAncho({ proyecto: p }: { proyecto: Proyecto }) {
  const premio = laurel(p);
  return (
    <Enlace href={RUTAS.proyecto(p.slug)} className="group block" aria-label={`Ver ${p.titulo}`} draggable={false}>
      <div data-radio data-foco className="relative aspect-[16/10] overflow-hidden rounded-[24px] bg-black shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] sm:aspect-[2.2/1] sm:rounded-[36px]">
        {p.poster && (
          <img
            data-transicion
            src={img(p.poster.url, 3840)}
            style={enfoque(p.poster)}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04]"
          />
        )}
        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
        {premio && (
          <span className="absolute left-5 top-5 z-[3] inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/45 px-3 py-1.5 text-[11px] font-medium text-white">
            <Icono nombre="laurel" className="h-2.5 w-2.5 text-[#ffcf7a] sm:h-3.5 sm:w-3.5" />
            {premio.nombre}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 z-[3] flex items-end justify-between gap-4 p-4 text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.45)] sm:gap-6 sm:p-10">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/65">{[p.tipo?.nombre, p.anio].filter(Boolean).join(" · ")}</p>
              {p.conJuno && <SelloJuno pequeno enTarjeta className="-my-1 hidden shrink-0 sm:inline-flex" />}
            </div>
            <h3 className="mt-1 pb-[0.06em] text-xl font-extrabold leading-[1.04] tracking-[-0.045em] sm:mt-2 sm:text-5xl">{p.titulo}</h3>
            {p.papel && <p className="mt-2 text-sm text-white/75 sm:text-base">{p.papel}</p>}
            {p.textos.tarjeta && <p className="mt-3 hidden max-w-xl text-[15px] leading-snug text-white/70 [text-wrap:pretty] md:block">{p.textos.tarjeta}</p>}
          </div>
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/15 backdrop-blur-xl transition-transform duration-500 group-hover:scale-110">
            <Icono nombre="flecha" className="h-5 w-5" />
          </span>
        </div>
      </div>
    </Enlace>
  );
}

/**
 * Las fotos de la galería de un proyecto en mosaico: una grande y las demás alrededor. Deja fuera la portada (ya
 * está en la tarjeta) y las que la página usa en otro sitio (la cabecera). Cada foto se abre en el visor.
 */
function Mosaico({ proyecto: p }: { proyecto: Proyecto }) {
  const { medios } = useDatos();
  const [foto, setFoto] = useState<number | null>(null);
  const todas = p.galeria.map((g) => g.imagen).filter((m) => m.id !== p.poster?.id && !medios[m.id]);
  // 5 llenan cuatro columnas (la grande ocupa dos por dos); 3 o 4, tres columnas con la grande y dos
  const n = todas.length >= 5 ? 5 : todas.length >= 3 ? 3 : todas.length;
  const fotos = todas.slice(0, n);
  if (!fotos.length) return null;
  const columnas = n === 5 ? "md:grid-cols-4" : n === 3 ? "md:grid-cols-3" : n === 2 ? "md:grid-cols-2" : "";
  return (
    <>
      <div className={`mt-4 grid auto-rows-[150px] grid-cols-2 gap-4 sm:auto-rows-[200px] lg:auto-rows-[230px] ${columnas}`}>
        {fotos.map((m, i) => (
          <Revelar key={m.id} retraso={i * 0.06} className={i === 0 && n >= 3 ? "col-span-2 row-span-2" : n <= 2 ? "col-span-2 md:col-span-1 row-span-2" : ""}>
            <button
              type="button"
              onClick={() => setFoto(i)}
              aria-label={`Ver la foto ${i + 1} de ${p.titulo} en grande`}
              className="group relative block h-full w-full overflow-hidden rounded-[28px] bg-black"
            >
              <img
                src={img(m.url, i === 0 ? 1920 : 1080)}
                style={enfoque(m)}
                alt={m.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.05]"
              />
              <span className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
            </button>
          </Revelar>
        ))}
      </div>
      <Visor fotos={fotos.map((m) => m.url)} indice={foto} alCambiar={setFoto} titulo={p.titulo} />
    </>
  );
}

/** Los destacados de Inicio en el carrusel, con filtro por servicio */
function Destacados({ bloque, ancla }: { bloque: Bloque; ancla?: string }) {
  const { servicios, proyectos } = useDatos();
  const [filtro, setFiltro] = useState("todos");
  const [fondo, setFondo] = useState<string | null>(null);
  // Un filtro por servicio, solo si tiene proyectos
  const filtros = [
    { slug: "todos", nombre: "Todos" },
    ...servicios.filter((s) => proyectosDe(proyectos, s.slug).length).map((s) => ({ slug: s.slug, nombre: s.nombre })),
  ];

  return (
    <section id={ancla} className="relative overflow-hidden py-8 sm:py-24 lg:py-[5svh]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <AnimatePresence initial={false}>
          {fondo && (
            <motion.img
              key={fondo}
              src={img(fondo, 256)}
              alt=""
              // A un octavo del tamaño con un desenfoque pequeño y ampliada ×8: se ve muy difuminada pero el
              // desenfoque se calcula sobre 64 veces menos píxeles, y solo una vez por cambio de tarjeta
              className="absolute left-1/2 top-1/2 h-[12.5%] w-[12.5%] object-cover blur-[6px] [transform:translate(-50%,-50%)_scale(8.6)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: CURVA }}
            />
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--jm-fondo)] via-transparent to-[var(--jm-fondo)]" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col gap-3 px-4 sm:gap-6 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
        <Titular antetitulo={bloque.datos.antetitulo} titulo={bloque.datos.titulo} />
        <Revelar retraso={0.15}>
          <div className="cristal sin-barra flex w-fit max-w-full gap-0.5 overflow-x-auto rounded-full p-1 sm:gap-1" role="tablist" aria-label="Filtrar por servicio">
            {filtros.map((f) => (
              <button
                key={f.slug}
                type="button"
                role="tab"
                aria-selected={filtro === f.slug}
                onClick={() => setFiltro(f.slug)}
                className={`relative whitespace-nowrap rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors duration-300 sm:px-4 sm:py-2 sm:text-[13px] ${
                  filtro === f.slug ? "text-white" : "text-[var(--jm-suave)] hover:text-[var(--jm-texto)]"
                }`}
              >
                {filtro === f.slug && (
                  <motion.span
                    layoutId="jm-filtro"
                    className="absolute inset-0 rounded-full bg-[var(--jm-acento)] shadow-[0_6px_20px_-6px_rgba(229,9,20,0.7)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32, mass: 0.8 }}
                  />
                )}
                <span className="relative">{f.slug === "direccion-de-fotografia" ? (<><span className="sm:hidden">Fotografía</span><span className="hidden sm:inline">{f.nombre}</span></>) : f.nombre}</span>
              </button>
            ))}
          </div>
        </Revelar>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <Carrusel
          key={filtro}
          proyectos={proyectosDe(proyectos, filtro)}
          alCambiar={setFondo}
          pie={
            <Enlace
              href={filtro === "todos" ? RUTAS.trabajos : RUTAS.servicio(filtro)}
              className="hidden items-center gap-1.5 text-sm font-semibold text-[var(--jm-suave)] transition-colors hover:text-[var(--jm-texto)] sm:inline-flex"
            >
              {filtro === "todos" ? "Ver todos los trabajos" : `Todo lo de ${filtros.find((f) => f.slug === filtro)?.nombre.toLowerCase()}`}
              <Icono nombre="flecha" className="h-4 w-4" />
            </Enlace>
          }
        />
      </AnimatePresence>

    </section>
  );
}

function useAncho(ref: React.RefObject<HTMLElement | null>) {
  const [ancho, setAncho] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const medir = () => setAncho(el.clientWidth);
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return ancho;
}

function Carrusel({
  proyectos,
  alCambiar,
  pie,
}: {
  proyectos: Proyecto[];
  alCambiar: (poster: string | null) => void;
  /** Enlace a los trabajos por servicio: va en la fila de los puntos y las flechas, no en una fila propia */
  pie: React.ReactNode;
}) {
  const pista = useRef<HTMLDivElement>(null);
  const ancho = useAncho(pista);
  const reducir = useReducir();
  const movil = ancho > 0 && ancho < 640;
  // En ordenador la sección entera (titular, tarjeta y controles) cabe en una pantalla, también en
  // portátiles con el escalado de Windows al 150 % (unos 630 px de alto): la tarjeta, como mucho el 46 %
  const altoVentana = typeof window === "undefined" ? 900 : window.innerHeight;
  // Tarjetas verticales y más estrechas: en pantalla ancha se ven la central y casi dos vecinas por lado
  const W = movil ? Math.round(ancho * 0.68) : Math.min(ancho * 0.22, 440, altoVentana * 0.46 * (3 / 4));
  const gap = movil ? 12 : 24;
  const paso = W + gap;
  const alto = W * (4 / 3);
  const lado = Math.max(0, (ancho - W) / 2);

  const [activa, setActiva] = useState(0);
  const pendiente = useRef(0);
  const arrastre = useArrastre(pista);

  // Tarjeta activa según la posición del scroll (como mucho una vez por fotograma)
  const alHacerScroll = useCallback(() => {
    if (pendiente.current) return;
    pendiente.current = requestAnimationFrame(() => {
      pendiente.current = 0;
      const el = pista.current;
      if (!el || !paso) return;
      const n = Math.max(0, Math.min(proyectos.length - 1, Math.round(el.scrollLeft / paso)));
      setActiva((a) => (a === n ? a : n));
    });
  }, [paso, proyectos.length]);

  // Avance con flechas, puntos o clic en una vecina: un deslizamiento propio de 0,6 s con curva suave (el
  // "smooth" del navegador resultaba brusco). El ajuste nativo se aparta durante el viaje y vuelve al final.
  const viaje = useRef<{ stop: () => void } | null>(null);
  const ir = useCallback(
    (n: number) => {
      const el = pista.current;
      if (!el) return;
      const destino = Math.max(0, Math.min(proyectos.length - 1, n)) * paso;
      viaje.current?.stop();
      if (reducir) {
        el.scrollLeft = destino;
        return;
      }
      el.style.scrollSnapType = "none";
      viaje.current = animate(el.scrollLeft, destino, {
        duration: 0.6,
        ease: CURVA_VIAJE,
        onUpdate: (v) => {
          el.scrollLeft = v;
        },
        onComplete: () => {
          el.style.scrollSnapType = "";
        },
      });
    },
    [paso, proyectos.length, reducir],
  );

  useEffect(() => () => cancelAnimationFrame(pendiente.current), []);

  useEffect(() => {
    if (proyectos[activa]) alCambiar(proyectos[activa].poster?.url ?? null);
  }, [activa, proyectos, alCambiar]);

  return (
    <motion.div
      className="relative mt-4 sm:mt-12 lg:mt-[4svh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3 } }}
      exit={{ opacity: 0, transition: { duration: 0.22 } }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") ir(activa + 1);
        if (e.key === "ArrowLeft") ir(activa - 1);
      }}
    >
      {/* Altura fija: nada se recoloca al cambiar de filtro */}
      <div
        ref={pista}
        onScroll={alHacerScroll}
        {...arrastre}
        className="sin-barra flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain py-1"
        style={{ gap, paddingInline: lado, scrollPaddingInline: lado, height: alto ? alto + 8 : undefined }}
      >
        {proyectos.map((p, j) => (
          <div
            key={p.slug}
            className="shrink-0 snap-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ width: W, height: alto, transform: `scale(${j === activa ? 1 : 0.86})` }}
            onClickCapture={(e) => {
              // Pulsar una vecina la trae al centro; solo la activa abre el proyecto
              if (j !== activa) {
                e.preventDefault();
                e.stopPropagation();
                ir(j);
              }
            }}
          >
            <motion.div
              className="h-full"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: CURVA, delay: 0.08 + Math.min(j, 4) * 0.07 }}
            >
              <TarjetaCarrusel proyecto={p} activa={j === activa} compacta={W < 300} />
            </motion.div>
          </div>
        ))}
      </div>

      {/* Indicador y flechas */}
      <div className="relative mx-auto mt-4 sm:mt-8 flex max-w-7xl items-center justify-between gap-6 px-4 sm:px-8 lg:mt-[2.5svh]">
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Proyectos">
          {proyectos.map((p, j) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => ir(j)}
              aria-label={p.titulo}
              aria-selected={j === activa}
              role="tab"
              className="relative h-2 py-3 transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ width: j === activa ? 28 : 8 }}
            >
              <span
                className={`absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full transition-colors duration-500 ${
                  j === activa ? "bg-[var(--jm-acento)]" : "bg-[var(--jm-borde)]"
                }`}
              />
            </button>
          ))}
        </div>
        {pie}
        <div className="flex gap-2">
          {([-1, 1] as const).map((dir) => {
            const apagada = dir === -1 ? activa === 0 : activa === proyectos.length - 1;
            return (
              <button
                key={dir}
                type="button"
                onClick={() => ir(activa + dir)}
                disabled={apagada}
                aria-label={dir === -1 ? "Trabajo anterior" : "Trabajo siguiente"}
                className="cristal flex h-12 w-12 items-center justify-center rounded-full transition-[opacity,transform] duration-300 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
              >
                <Icono nombre={dir === -1 ? "izquierda" : "derecha"} className="h-5 w-5" />
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Arrastrar el carrusel con el ratón (con el dedo y el trackpad ya lo hace el navegador). Al soltar, un
 * pequeño empujón con la velocidad del gesto y el ajuste nativo lo deja centrado en una tarjeta.
 * Si se ha arrastrado, el clic no abre la tarjeta.
 */
function useArrastre(pista: React.RefObject<HTMLDivElement | null>) {
  const fino = usePunteroFino();
  const estado = useRef({ x: 0, inicio: 0, activo: false, movido: false, ultimoX: 0, ultimoT: 0, velocidad: 0 });

  if (!fino) return {};
  return {
    onPointerDown: (e: React.PointerEvent) => {
      if (e.pointerType !== "mouse" || !pista.current) return;
      const t = performance.now();
      estado.current = { x: e.clientX, inicio: pista.current.scrollLeft, activo: true, movido: false, ultimoX: e.clientX, ultimoT: t, velocidad: 0 };
    },
    onPointerMove: (e: React.PointerEvent) => {
      const s = estado.current;
      const el = pista.current;
      if (!s.activo || !el) return;
      const dx = e.clientX - s.x;
      if (!s.movido && Math.abs(dx) > 6) {
        s.movido = true;
        el.setPointerCapture(e.pointerId);
        el.style.scrollSnapType = "none";
      }
      if (!s.movido) return;
      el.scrollLeft = s.inicio - dx;
      const t = performance.now();
      if (t > s.ultimoT) s.velocidad = (e.clientX - s.ultimoX) / (t - s.ultimoT);
      s.ultimoX = e.clientX;
      s.ultimoT = t;
    },
    onPointerUp: () => {
      const el = pista.current;
      const s = estado.current;
      s.activo = false;
      if (!el || !s.movido) return;
      const empuje = Math.max(-700, Math.min(700, -s.velocidad * 260));
      el.style.scrollSnapType = "";
      el.scrollBy({ left: empuje, behavior: "smooth" });
    },
    onClickCapture: (e: React.MouseEvent) => {
      if (estado.current.movido) {
        e.preventDefault();
        e.stopPropagation();
        estado.current.movido = false;
      }
    },
  };
}

/** `compacta`: tarjeta estrecha (pantallas bajas): menos margen, título más pequeño y solo tipo y año arriba */
function TarjetaCarrusel({ proyecto: p, activa, compacta }: { proyecto: Proyecto; activa: boolean; compacta: boolean }) {
  const fino = usePunteroFino();
  const [encima, setEncima] = useState(false);
  const premio = laurel(p);

  return (
    <Enlace
      href={RUTAS.proyecto(p.slug)}
      onPointerEnter={() => setEncima(true)}
      onPointerLeave={() => setEncima(false)}
      className="group block h-full"
      aria-label={`Ver ${p.titulo}`}
      draggable={false}
      tabIndex={activa ? 0 : -1}
    >
      {/* Sombra fija (no se anima) y radio fijo: al escalar la tarjeta no hay que repintar nada */}
      <div data-radio className="relative h-full overflow-hidden rounded-[32px] bg-black shadow-[0_30px_60px_-36px_rgba(0,0,0,0.75)]">
        <Diapositivas imagenes={fotogramas(p)} medios={mediosDeProyecto(p)} activo={activa && encima && fino} className={MASCARA_BORDE} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
        {/* Las vecinas se apagan con un velo negro y no con opacidad: sobre el fondo claro la opacidad las
            dejaba lechosas. El velo es más denso en oscuro (--d-velo-vecina) para que se parezcan */}
        <div
          className="absolute inset-0 z-[4] bg-black transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ opacity: activa ? 0 : "var(--jm-velo-vecina)" }}
        />
        {premio && (
          <span className="absolute left-5 top-5 z-[3] inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/45 px-3 py-1.5 text-[11px] font-medium text-white">
            <Icono nombre="laurel" className="h-2.5 w-2.5 text-[#ffcf7a] sm:h-3.5 sm:w-3.5" />
            {premio.nombre}
          </span>
        )}
        <div className={`absolute inset-x-0 bottom-0 z-[3] flex items-end justify-between text-white ${compacta ? "gap-3 p-5" : "gap-4 p-6 sm:p-8"}`}>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
              {[p.tipo?.nombre, p.anio, compacta ? null : p.papel].filter(Boolean).join(" · ")}
            </p>
            <h3 className={`mt-2 font-bold leading-tight tracking-[-0.025em] [text-wrap:balance] ${compacta ? "text-lg" : "text-2xl"}`}>{p.titulo}</h3>
          </div>
          <span
            className={`flex shrink-0 ${compacta ? "h-10 w-10" : "h-12 w-12"} items-center justify-center rounded-full border border-white/25 bg-white/10 transition-[opacity,transform] duration-500 group-hover:scale-110`}
            style={{ opacity: activa ? 1 : 0 }}
          >
            <Icono nombre="flecha" className="h-5 w-5 -rotate-45" />
          </span>
        </div>
      </div>
    </Enlace>
  );
}

/** Tarjeta de proyecto para rejillas (páginas de servicio). */
export function TarjetaProyecto({ proyecto: p }: { proyecto: Proyecto }) {
  const fino = usePunteroFino();
  const [encima, setEncima] = useState(false);
  const premio = laurel(p);

  return (
    <Enlace
      href={RUTAS.proyecto(p.slug)}
      onPointerEnter={() => setEncima(true)}
      onPointerLeave={() => setEncima(false)}
      className="group block"
      aria-label={`Ver ${p.titulo}`}
      draggable={false}
    >
      <div
        data-radio
        data-foco
        className="relative aspect-[16/10] overflow-hidden rounded-[16px] bg-black shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] sm:aspect-[3/2] sm:rounded-[32px]"
      >
        <Diapositivas imagenes={fotogramas(p)} medios={mediosDeProyecto(p)} activo={encima && fino} ancho={1200} className={MASCARA_BORDE} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent" />

        {premio && (
          <span className="absolute left-2 top-2 z-[3] inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/45 px-2 py-0.5 text-[9px] font-medium text-white sm:left-4 sm:top-4 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-[11px]">
            <Icono nombre="laurel" className="h-2.5 w-2.5 text-[#ffcf7a] sm:h-3.5 sm:w-3.5" />
            {premio.nombre}
          </span>
        )}
        {p.conJuno && <SelloJuno pequeno enTarjeta className="absolute right-2 top-2 z-[3] origin-top-right scale-75 sm:hidden" />}
        <span className="absolute right-4 top-4 z-[3] hidden h-10 w-10 translate-y-1 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:flex">
          <Icono nombre="flecha" className="h-4 w-4 -rotate-45" />
        </span>

        <div className="absolute inset-x-2 bottom-2 z-[3] rounded-[14px] border border-white/15 bg-black/65 p-2 text-white transition-transform duration-500 group-hover:-translate-y-1 sm:inset-x-3 sm:bottom-3 sm:rounded-[24px] sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="truncate text-[9px] font-medium uppercase tracking-[0.1em] text-white/60 sm:text-[11px] sm:tracking-[0.14em]">{[p.tipo?.nombre, p.anio].filter(Boolean).join(" · ")}</p>
            {p.conJuno && <SelloJuno pequeno enTarjeta className="-my-1 hidden shrink-0 sm:inline-flex" />}
          </div>
          <h3 className="mt-0.5 truncate text-xs font-bold leading-tight tracking-[-0.02em] sm:mt-1 sm:text-2xl">{p.titulo}</h3>
          {/* El cargo no ocupa línea hasta que se pasa el ratón: la fila se abre despacio y el texto aparece con ella */}
          {p.papel && (
            <div className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:grid-rows-[1fr] group-hover:opacity-100">
              <p className="min-h-0 overflow-hidden text-sm text-white/70">
                <span className="block pt-1">{p.papel}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </Enlace>
  );
}
