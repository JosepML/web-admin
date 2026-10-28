"use client";

import { marcarVideoAbierto, useReducir } from "./comun/hooks";
import { animate, AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icono } from "./Iconos";
import { enfoque, img } from "./comun/imagen";
import type { Medio } from "@/lib/datos/tipos";
import { Editable, useEditando } from "./edicion/contexto";

export { CURVA } from "@/styles/movimiento";
import { CURVA } from "@/styles/movimiento";

/** Aparece al entrar en pantalla: fundido, leve subida y desenfoque que se aclara. */
export function Revelar({
  children,
  retraso = 0,
  className = "",
  y = 28,
}: {
  children: React.ReactNode;
  retraso?: number;
  className?: string;
  y?: number;
}) {
  const reducir = useReducir();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reducir ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15px" }}
      transition={{ duration: 0.9, delay: retraso, ease: CURVA }}
    >
      {children}
    </motion.div>
  );
}

/** Antetítulo en píldora + titular grande. La última palabra puede ir en serif cursiva. */
export function Titular({
  antetitulo,
  titulo,
  texto,
  centrado,
  className = "",
  nivel = 2,
}: {
  antetitulo?: string;
  titulo?: string;
  texto?: string;
  centrado?: boolean;
  className?: string;
  /** h1 en la cabecera de una página; h2 (por defecto) en las secciones */
  nivel?: 1 | 2;
}) {
  const Encabezado = nivel === 1 ? "h1" : "h2";
  // En el modo «Editar página» los campos de un bloque se editan en su sitio (antetitulo, titulo y texto de sus
  // datos) y los vacíos se enseñan para poder rellenarlos
  const editando = useEditando();
  return (
    <div className={`${centrado ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      {(antetitulo || editando) && (
        <Revelar>
          <span className="cristal inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--jm-suave)] sm:px-3.5 sm:py-1.5 sm:text-[11px]">
            <Editable campo="antetitulo" valor={antetitulo} vacio="Antetítulo">
              {antetitulo}
            </Editable>
          </span>
        </Revelar>
      )}
      <Revelar retraso={0.08}>
        <Encabezado className="mt-2.5 text-[clamp(1.65rem,6.5vw,2.2rem)] font-extrabold leading-[1.06] tracking-[-0.04em] [text-wrap:balance] sm:mt-5 sm:text-[clamp(2rem,min(5vw,7.4svh),4.4rem)] sm:leading-[1.05]">
          <Editable campo="titulo" valor={titulo} vacio="Título">
            <TituloConAcento texto={titulo ?? ""} />
          </Editable>
        </Encabezado>
      </Revelar>
      {(texto || (editando && texto !== undefined)) && (
        <Revelar retraso={0.16}>
          <div className={`mt-2 max-w-xl text-[13.5px] leading-snug text-[var(--jm-suave)] [text-wrap:pretty] sm:mt-5 sm:text-lg sm:leading-relaxed ${centrado ? "mx-auto" : ""}`}>
            <Editable campo="texto" valor={texto} multilinea bloqueHtml vacio="Texto">
              <Parrafos texto={texto ?? ""} />
            </Editable>
          </div>
        </Revelar>
      )}
    </div>
  );
}

/**
 * Doble tipografía: la parte marcada con *asteriscos* va en serif cursiva con degradado cálido (es la única
 * cursiva de la web). Sin marcas, se acentúa la última palabra. Marca la idea entera («*blanco y negro*»),
 * no media expresión. Los signos de cierre (?, ., !) quedan fuera de la cursiva para que no se tuerzan.
 */
export function TituloConAcento({ texto }: { texto: string }) {
  const limpio = texto.trim();
  if (/\*[^*]+\*/.test(limpio)) {
    return (
      <>
        {limpio.split(/(\*[^*]+\*)/g).filter(Boolean).map((t, i) =>
          t.startsWith("*") ? (
            <span key={i} className="jm-serif jm-degradado-acento">
              {t.slice(1, -1)}
            </span>
          ) : (
            <span key={i} className="jm-degradado">
              {t}
            </span>
          ),
        )}
      </>
    );
  }
  const i = limpio.lastIndexOf(" ");
  if (i === -1) return <span className="jm-degradado">{limpio}</span>;
  const ultima = limpio.slice(i + 1);
  const [, palabra, signos] = ultima.match(/^(.*?)([?!.,:…]*)$/) ?? [, ultima, ""];
  return (
    <>
      <span className="jm-degradado">{limpio.slice(0, i)} </span>
      <span className="whitespace-nowrap">
        <span className="jm-serif jm-degradado-acento">{palabra}</span>
        {signos && <span className="jm-degradado">{signos}</span>}
      </span>
    </>
  );
}

/**
 * Texto de la base de datos en Markdown básico: párrafos separados por una línea en blanco, **negrita** y
 * *cursiva*. Sin HTML: nada de lo guardado se inyecta tal cual en la página.
 */
export function Parrafos({ texto, className = "" }: { texto: string; className?: string }) {
  const parrafos = texto.trim().split(/\n\s*\n/).filter(Boolean);
  if (parrafos.length === 1) return <p className={className}>{enLinea(parrafos[0])}</p>;
  return (
    <div className={className}>
      {parrafos.map((p, i) => (
        <p key={i} className={i ? "mt-4" : ""}>
          {enLinea(p)}
        </p>
      ))}
    </div>
  );
}

/** **negrita** y *cursiva* dentro de una línea; los saltos simples se respetan */
export function enLinea(t: string): React.ReactNode[] {
  return t.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\n)/g).filter(Boolean).map((trozo, i) => {
    if (trozo === "\n") return <br key={i} />;
    if (trozo.startsWith("**") && trozo.endsWith("**")) return <strong key={i}>{trozo.slice(2, -2)}</strong>;
    if (trozo.startsWith("*") && trozo.endsWith("*") && trozo.length > 2) return <em key={i}>{trozo.slice(1, -1)}</em>;
    return trozo;
  });
}

/** Número que cuenta hasta su valor al entrar en pantalla. */
export function Contador({ valor, decimales = 0, prefijo = "", sufijo = "" }: { valor: number; decimales?: number; prefijo?: string; sufijo?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const visto = useInView(ref, { once: true, margin: "0px" });
  const reducir = useReducir();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!visto) return;
    if (reducir) {
      setN(valor);
      return;
    }
    const c = animate(0, valor, { duration: 1.8, ease: CURVA, onUpdate: setN });
    return () => c.stop();
  }, [visto, valor, reducir]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefijo}
      {n.toLocaleString("es-ES", { minimumFractionDigits: decimales, maximumFractionDigits: decimales })}
      {sufijo}
    </span>
  );
}

/**
 * Reproductor con sonido en una ventana grande. Por defecto, un vídeo de YouTube (`id`); con `src`, otra página
 * de reproductor (el embed de Instagram) y con `archivo`, un vídeo propio. `vertical` para Shorts y reels.
 */
export function ModalVideo({
  id,
  src,
  archivo,
  vertical,
  abierto,
  alCerrar,
}: {
  id?: string;
  src?: string;
  archivo?: string;
  vertical?: boolean;
  abierto: boolean;
  alCerrar: () => void;
}) {
  useEffect(() => {
    if (!abierto) return;
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && alCerrar();
    window.addEventListener("keydown", tecla);
    // Toda la potencia para el vídeo: la página de detrás se para (vídeos de fondo y animaciones) y no se mueve
    marcarVideoAbierto(true);
    const html = document.documentElement;
    const antes = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", tecla);
      marcarVideoAbierto(false);
      html.style.overflow = antes;
    };
  }, [abierto, alCerrar]);

  // La ventana va al nivel de la raíz de la web (fuera del contenido, que tiene su propio z-index) para quedar
  // también por encima del menú
  const [raiz, setRaiz] = useState<HTMLElement | null>(null);
  useEffect(() => setRaiz(document.querySelector<HTMLElement>(".jm-raiz") ?? document.body), []);
  if (!raiz) return null;

  return createPortal(
    <AnimatePresence>
      {abierto && (
        <motion.div
          // Sin desenfoque de fondo: un desenfoque a pantalla completa se recalcula en cada fotograma de lo que
          // tiene detrás (el vídeo de la cabecera, los orbes) y hacía que el vídeo fuera a tirones
          className="fixed inset-0 z-[120] flex items-center justify-center bg-[rgba(4,4,6,0.9)] p-3 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={alCerrar}
          role="dialog"
          aria-modal
          aria-label="Reproductor de vídeo"
        >
          <motion.div
            className={`relative overflow-hidden rounded-[28px] border border-white/15 bg-black shadow-2xl ${
              vertical ? "aspect-[9/16] w-[min(100%,calc(min(86svh,860px)*0.5625))]" : "aspect-video w-full max-w-6xl"
            }`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: CURVA }}
            onClick={(e) => e.stopPropagation()}
          >
            {archivo ? (
              <video className="absolute inset-0 h-full w-full bg-black object-contain" src={archivo} autoPlay controls playsInline />
            ) : (
              <iframe
                className="absolute inset-0 h-full w-full"
                src={src ?? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
                title="Vídeo"
              />
            )}
          </motion.div>
          <button
            type="button"
            onClick={alCerrar}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Cerrar vídeo"
          >
            <Icono nombre="cerrar" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>,
    raiz,
  );
}

/** Chip con punto verde que late: "Disponible para nuevos proyectos". */
export function Disponible({ className = "" }: { className?: string }) {
  return (
    <span className={`cristal inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium ${className}`}>
      <span className="latido h-2 w-2 rounded-full bg-[#34c759]" />
      Disponible para nuevos proyectos
    </span>
  );
}

/**
 * Fotogramas que se funden uno tras otro mientras `activo` (al pasar el ratón), con un zoom muy lento.
 * Sustituye a los clips de YouTube al pasar el ratón: cada clip cargaba un reproductor entero y daba tirones.
 * En la web final aquí irá el clip propio en mp4.
 */
export function Diapositivas({
  imagenes,
  medios,
  activo,
  className = "",
  intervalo = 1600,
  ancho = 1920,
}: {
  imagenes: string[];
  /** Las fotos de `imagenes` como medios, para aplicar su punto de interés al recortarlas */
  medios?: Medio[];
  activo: boolean;
  className?: string;
  intervalo?: number;
  /** Ancho de la imagen servida: el de la tarjeta en pantalla, no más (subirla a la GPU cuesta según sus píxeles) */
  ancho?: 640 | 750 | 828 | 1080 | 1200 | 1920 | 3840;
}) {
  const [i, setI] = useState(0);
  const [haActivado, setHaActivado] = useState(false);
  useEffect(() => {
    if (activo && !haActivado) setHaActivado(true);
  }, [activo, haActivado]);
  const reducir = useReducir();

  useEffect(() => {
    if (!activo || imagenes.length < 2 || reducir) {
      setI(0);
      return;
    }
    const t = window.setInterval(() => setI((n) => (n + 1) % imagenes.length), intervalo);
    return () => window.clearInterval(t);
  }, [activo, imagenes.length, intervalo, reducir]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {(haActivado ? imagenes : imagenes.slice(0, 1)).map((src, n) => {
        // Cada foto tiene su propio zoom: solo la que se ve crece, desde cero, durante su turno. Las demás vuelven
        // a su escala mínima al salir, así que al volver a verse empiezan otra vez
        const zoom = n === i && activo && !reducir;
        const foco = enfoque(medios?.find((m) => m.url === src));
        return (
          <img
            key={src}
            src={img(src, ancho)}
            alt=""
            data-transicion={n === 0 ? "" : undefined}
            draggable={false}
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              opacity: n === i ? 1 : 0,
              // Escala base de 1.1: recorta las franjas negras que algunas fotos traen de origen, también sin zoom
              ...foco,
              transform: zoom ? "scale(1.18)" : "scale(1.1)",
              // El zoom va lineal y dura lo que la foto sigue visible, para no frenarse antes del cambio. Al salir,
              // el zoom vuelve a escala base solo cuando la foto ya se ha desvanecido (sin que se vea desinflarse)
              transitionDuration: `1000ms, ${zoom ? intervalo + 1000 : 0}ms`,
              transitionDelay: zoom ? "0ms" : "0ms, 1000ms",
              transitionTimingFunction: `cubic-bezier(0.22,1,0.36,1), linear`,
            }}
          />
        );
      })}
    </div>
  );
}

/** Aviso para que la llamada final marque el servicio elegido en otra sección. */
export const EVENTO_SERVICIO = "jm-servicio";
export function elegirServicio(nombre: string) {
  window.dispatchEvent(new CustomEvent(EVENTO_SERVICIO, { detail: nombre }));
  document.getElementById("llamada")?.scrollIntoView({ behavior: "smooth", block: "start" });
}
