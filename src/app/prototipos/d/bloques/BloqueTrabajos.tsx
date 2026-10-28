"use client";

import { animate, AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Enlace } from "../../_comun/Enlace";
import { usePunteroFino, useReducir } from "../../_comun/hooks";
import { proyectosDe, SERVICIOS, type Bloque, type ProyectoD } from "../datos";
import { Icono } from "../Iconos";
import { RAIZ } from "../rutas";
import { CURVA, Diapositivas, Revelar, Titular } from "../piezas";
import { img } from "../../_comun/imagen";
import { MASCARA_BORDE } from "./BloqueServicios";
import { CURVA_VIAJE } from "@/styles/movimiento";

const FILTROS = [{ slug: "todos", nombre: "Todos" }, ...SERVICIOS.map((s) => ({ slug: s.slug, nombre: s.nombre }))];

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
export function BloqueTrabajos({ bloque }: { bloque: Bloque }) {
  const [filtro, setFiltro] = useState("todos");
  const [fondo, setFondo] = useState<string | null>(null);

  return (
    <section id={bloque.id === "trabajos" ? "trabajos" : undefined} className="relative overflow-hidden py-20 sm:py-24 lg:py-[5svh]">
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
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--d-fondo)] via-transparent to-[var(--d-fondo)]" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
        <Titular antetitulo={bloque.datos.antetitulo} titulo={bloque.datos.titulo} />
        <Revelar retraso={0.15}>
          <div className="cristal sin-barra flex max-w-full gap-1 overflow-x-auto rounded-full p-1" role="tablist" aria-label="Filtrar por servicio">
            {FILTROS.map((f) => (
              <button
                key={f.slug}
                type="button"
                role="tab"
                aria-selected={filtro === f.slug}
                onClick={() => setFiltro(f.slug)}
                className={`relative whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-300 ${
                  filtro === f.slug ? "text-white" : "text-[var(--d-suave)] hover:text-[var(--d-texto)]"
                }`}
              >
                {filtro === f.slug && (
                  <motion.span
                    layoutId="d-filtro"
                    className="absolute inset-0 rounded-full bg-[var(--d-acento)] shadow-[0_6px_20px_-6px_rgba(229,9,20,0.7)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32, mass: 0.8 }}
                  />
                )}
                <span className="relative">{f.nombre}</span>
              </button>
            ))}
          </div>
        </Revelar>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <Carrusel
          key={filtro}
          proyectos={proyectosDe(filtro)}
          alCambiar={setFondo}
          pie={
            <Enlace
              href={filtro === "todos" ? `${RAIZ}/servicios/${SERVICIOS[0].slug}` : `${RAIZ}/servicios/${filtro}`}
              className="hidden items-center gap-1.5 text-sm font-semibold text-[var(--d-suave)] transition-colors hover:text-[var(--d-texto)] sm:inline-flex"
            >
              {filtro === "todos" ? "Ver los trabajos por servicio" : `Todo lo de ${FILTROS.find((f) => f.slug === filtro)?.nombre.toLowerCase()}`}
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
  proyectos: ProyectoD[];
  alCambiar: (poster: string) => void;
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
  const W = movil ? ancho * 0.78 : Math.min(ancho * 0.22, 440, altoVentana * 0.46 * (3 / 4));
  const gap = movil ? 14 : 24;
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
    if (proyectos[activa]) alCambiar(proyectos[activa].poster);
  }, [activa, proyectos, alCambiar]);

  return (
    <motion.div
      className="relative mt-12 lg:mt-[4svh]"
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
      <div className="relative mx-auto mt-8 flex max-w-7xl items-center justify-between gap-6 px-4 sm:px-8 lg:mt-[2.5svh]">
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
                  j === activa ? "bg-[var(--d-acento)]" : "bg-[var(--d-borde)]"
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
function TarjetaCarrusel({ proyecto: p, activa, compacta }: { proyecto: ProyectoD; activa: boolean; compacta: boolean }) {
  const fino = usePunteroFino();
  const [encima, setEncima] = useState(false);

  return (
    <Enlace
      href={`${RAIZ}/${p.slug}`}
      onPointerEnter={() => setEncima(true)}
      onPointerLeave={() => setEncima(false)}
      className="group block h-full"
      aria-label={`Ver ${p.titulo}`}
      draggable={false}
      tabIndex={activa ? 0 : -1}
    >
      {/* Sombra fija (no se anima) y radio fijo: al escalar la tarjeta no hay que repintar nada */}
      <div data-radio className="relative h-full overflow-hidden rounded-[32px] bg-black shadow-[0_30px_60px_-36px_rgba(0,0,0,0.75)]">
        <Diapositivas imagenes={p.fotogramas.length > 1 ? p.fotogramas : [p.poster]} activo={activa && encima && fino} className={MASCARA_BORDE} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
        {/* Las vecinas se apagan con un velo negro y no con opacidad: sobre el fondo claro la opacidad las
            dejaba lechosas. El velo es más denso en oscuro (--d-velo-vecina) para que se parezcan */}
        <div
          className="absolute inset-0 z-[4] bg-black transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ opacity: activa ? 0 : "var(--d-velo-vecina)" }}
        />
        {p.laurel && (
          <span className="absolute left-5 top-5 z-[3] inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/45 px-3 py-1.5 text-[11px] font-medium text-white">
            <Icono nombre="laurel" className="h-3.5 w-3.5 text-[#ffcf7a]" />
            {p.laurel.premio}
          </span>
        )}
        <div className={`absolute inset-x-0 bottom-0 z-[3] flex items-end justify-between text-white ${compacta ? "gap-3 p-5" : "gap-4 p-6 sm:p-8"}`}>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
              {p.tipo}
              {p.anio ? ` · ${p.anio}` : ""}
              {compacta ? "" : ` · ${p.papel}`}
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
export function TarjetaProyecto({ proyecto: p }: { proyecto: ProyectoD }) {
  const fino = usePunteroFino();
  const [encima, setEncima] = useState(false);

  return (
    <Enlace
      href={`${RAIZ}/${p.slug}`}
      onPointerEnter={() => setEncima(true)}
      onPointerLeave={() => setEncima(false)}
      className="group block"
      aria-label={`Ver ${p.titulo}`}
      draggable={false}
    >
      <div
        data-radio
        data-foco
        className="relative aspect-[4/5] overflow-hidden rounded-[32px] bg-black shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] sm:aspect-[3/2]"
      >
        <Diapositivas imagenes={p.fotogramas.length > 1 ? p.fotogramas : [p.poster]} activo={encima && fino} ancho={1200} className={MASCARA_BORDE} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent" />

        {p.laurel && (
          <span className="absolute left-4 top-4 z-[3] inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/45 px-3 py-1.5 text-[11px] font-medium text-white">
            <Icono nombre="laurel" className="h-3.5 w-3.5 text-[#ffcf7a]" />
            {p.laurel.premio}
          </span>
        )}
        <span className="absolute right-4 top-4 z-[3] flex h-10 w-10 translate-y-1 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <Icono nombre="flecha" className="h-4 w-4 -rotate-45" />
        </span>

        <div className="absolute inset-x-3 bottom-3 z-[3] rounded-[24px] border border-white/15 bg-black/60 p-4 text-white transition-transform duration-500 group-hover:-translate-y-1 sm:p-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/60">
            {p.tipo}
            {p.anio ? ` · ${p.anio}` : ""}
          </p>
          <h3 className="mt-1 text-xl font-bold leading-tight tracking-[-0.025em] sm:text-2xl">{p.titulo}</h3>
          <p className="mt-1 text-sm text-white/70">{p.papel}</p>
        </div>
      </div>
    </Enlace>
  );
}
