"use client";

import { useReducir } from "../_comun/hooks";
import { animate, AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Icono } from "./Iconos";
import { img } from "../_comun/imagen";

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
      viewport={{ once: true, margin: "-80px" }}
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
}: {
  antetitulo?: string;
  titulo: string;
  texto?: string;
  centrado?: boolean;
  className?: string;
}) {
  return (
    <div className={`${centrado ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      {antetitulo && (
        <Revelar>
          <span className="cristal inline-flex rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--d-suave)]">
            {antetitulo}
          </span>
        </Revelar>
      )}
      <Revelar retraso={0.08}>
        <h2 className="mt-5 text-[clamp(2rem,min(5vw,7.4svh),4.4rem)] font-extrabold leading-[1.05] tracking-[-0.04em] [text-wrap:balance]">
          <TituloConAcento texto={titulo} />
        </h2>
      </Revelar>
      {texto && (
        <Revelar retraso={0.16}>
          <p className={`mt-5 max-w-xl text-lg leading-relaxed text-[var(--d-suave)] [text-wrap:pretty] ${centrado ? "mx-auto" : ""}`}>{texto}</p>
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
            <span key={i} className="d-serif d-degradado-acento">
              {t.slice(1, -1)}
            </span>
          ) : (
            <span key={i} className="d-degradado">
              {t}
            </span>
          ),
        )}
      </>
    );
  }
  const i = limpio.lastIndexOf(" ");
  if (i === -1) return <span className="d-degradado">{limpio}</span>;
  const ultima = limpio.slice(i + 1);
  const [, palabra, signos] = ultima.match(/^(.*?)([?!.,:…]*)$/) ?? [, ultima, ""];
  return (
    <>
      <span className="d-degradado">{limpio.slice(0, i)} </span>
      <span className="whitespace-nowrap">
        <span className="d-serif d-degradado-acento">{palabra}</span>
        {signos && <span className="d-degradado">{signos}</span>}
      </span>
    </>
  );
}

/** Número que cuenta hasta su valor al entrar en pantalla. */
export function Contador({ valor, decimales = 0, prefijo = "", sufijo = "" }: { valor: number; decimales?: number; prefijo?: string; sufijo?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const visto = useInView(ref, { once: true, margin: "-60px" });
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

/** Reproductor del reel con sonido, en una ventana de cristal. */
export function ModalVideo({ id, abierto, alCerrar }: { id: string; abierto: boolean; alCerrar: () => void }) {
  useEffect(() => {
    if (!abierto) return;
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && alCerrar();
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [abierto, alCerrar]);

  return (
    <AnimatePresence>
      {abierto && (
        <motion.div
          className="fixed inset-0 z-[95] flex items-center justify-center bg-black/50 p-3 backdrop-blur-xl sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={alCerrar}
          role="dialog"
          aria-modal
          aria-label="Reproductor de vídeo"
        >
          <motion.div
            className="relative aspect-video w-full max-w-6xl overflow-hidden rounded-[28px] border border-white/15 bg-black shadow-2xl"
            initial={{ scale: 0.92, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ duration: 0.5, ease: CURVA }}
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
              title="Vídeo"
            />
          </motion.div>
          <button
            type="button"
            onClick={alCerrar}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur"
            aria-label="Cerrar vídeo"
          >
            <Icono nombre="cerrar" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
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
  activo,
  className = "",
  intervalo = 1600,
  ancho = 1920,
}: {
  imagenes: string[];
  activo: boolean;
  className?: string;
  intervalo?: number;
  /** Ancho de la imagen servida: el de la tarjeta en pantalla, no más (subirla a la GPU cuesta según sus píxeles) */
  ancho?: 640 | 750 | 828 | 1080 | 1200 | 1920 | 3840;
}) {
  const [i, setI] = useState(0);
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
      {imagenes.map((src, n) => (
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
            transform: activo && !reducir ? "scale(1.08)" : "scale(1.01)",
            transitionDuration: `1000ms, ${activo ? 6000 : 1200}ms`,
          }}
        />
      ))}
    </div>
  );
}

/** Aviso para que la llamada final marque el servicio elegido en otra sección. */
export const EVENTO_SERVICIO = "proto-d-servicio";
export function elegirServicio(nombre: string) {
  window.dispatchEvent(new CustomEvent(EVENTO_SERVICIO, { detail: nombre }));
  document.getElementById("llamada")?.scrollIntoView({ behavior: "smooth", block: "start" });
}
