"use client";

import { animate } from "motion/react";
import { useEffect, useState } from "react";

import { CURVA_VIAJE as CURVA_SCROLL } from "@/styles/movimiento";
const DURACION = 1.05;
/** Un gesto que llega justo después de terminar un viaje cuenta como "voy con prisa" */
const MARGEN_PRISA = 450;

/** Escudo de arranque: durante los primeros 4,5 segundos de vida de la página no se evalúa rendimiento */
const TIEMPO_ESCUDO_ARRANQUE = 4500;
/** Margen de calentamiento dentro de cada viaje individual (creación de capas en GPU) */
const CALENTAMIENTO_VIAJE = 350;
/** Umbral de fotograma congelado: 120 ms (menos de 8 FPS / parón evidente de ~7-8 cuadros a 60 Hz) */
const UMBRAL_CONGELACION_MS = 120;

const EVENTO_RENDIMIENTO = "jm-desactivar-scroll-magico";

type Punto = { destino: number; top: number; alto: number; libre: boolean; sub: boolean };

// Un solo viaje a la vez en toda la página (lo comparten la rueda y los botones de salto)
let control: { stop: () => void } | null = null;
let viajando = false;
let finViaje = 0;
let monitorRaf: number | null = null;

// Control adaptativo en memoria (sin persistir en sessionStorage para no bloquear al usuario tras recargar)
let desactivadoEnMemoria = false;
let viajesConCongelacion = 0;
let ultimoViajeCongelado = 0;

/** Comprueba si el dispositivo tiene recursos de hardware extremadamente reducidos (CPU mononúcleo o modo ahorro) */
export function esHardwareModesto(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  try {
    // Únicamente mononúcleo estricto (1 solo hilo)
    if (typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency === 1) {
      return true;
    }
    // Modo ahorro de datos explícito del usuario
    const conn = (navigator as unknown as { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) {
      return true;
    }
  } catch {}
  return false;
}

/** Comprueba si el scroll mágico ha sido desactivado (solo en memoria o por hardware mononúcleo) */
export function scrollMagicoDesactivado(): boolean {
  if (typeof window === "undefined") return false;
  try {
    // Limpieza de cualquier clave residual antigua en sessionStorage
    sessionStorage.removeItem("jm-scroll-magico-rendimiento-v2");
    sessionStorage.removeItem("jm-desactivar-scroll-magico");
  } catch {}
  return desactivadoEnMemoria || esHardwareModesto();
}

/** Desactiva el scroll mágico inmediatamente y activa el modo nativo solo en memoria */
export function desactivarScrollMagico(motivo?: string) {
  if (typeof window === "undefined") return;
  desactivadoEnMemoria = true;
  detenerVigilanciaFPS();
  control?.stop();
  viajando = false;
  if (process.env.NODE_ENV !== "production") {
    console.info(`[Rendimiento] Scroll mágico desactivado en memoria por ${motivo ?? "fluidez"}. Pasando a scroll nativo.`);
  }
  window.dispatchEvent(new CustomEvent(EVENTO_RENDIMIENTO));
}

function iniciarVigilanciaFPS() {
  detenerVigilanciaFPS();

  // Escudo de arranque: si la página lleva menos de 4,5 segundos cargada, no vigilar (se están montando vídeos, fuentes y capas)
  if (performance.now() < TIEMPO_ESCUDO_ARRANQUE) {
    return;
  }

  const inicioViaje = performance.now();
  let ultimo = performance.now();
  let caidasConsecutivas = 0;
  let totalCaidas = 0;
  let primerCuadro = true;

  const ciclo = (ahora: number) => {
    if (!viajando) {
      monitorRaf = null;
      return;
    }

    if (primerCuadro) {
      primerCuadro = false;
      ultimo = ahora;
      monitorRaf = requestAnimationFrame(ciclo);
      return;
    }

    const delta = ahora - ultimo;
    ultimo = ahora;

    // Margen de calentamiento del viaje individual (primeros 350 ms)
    const transcurrido = ahora - inicioViaje;
    if (transcurrido > CALENTAMIENTO_VIAJE && !document.hidden) {
      // Solo cuenta si el cuadro tarda más de 120 ms (congelación grave real)
      if (delta > UMBRAL_CONGELACION_MS) {
        caidasConsecutivas++;
        totalCaidas++;
        // Si este viaje individual experimenta 3 congelaciones consecutivas o más de 5 en total:
        if (caidasConsecutivas >= 3 || totalCaidas >= 5) {
          monitorRaf = null;
          const momento = performance.now();
          // Exigir al menos 2 viajes independientes con congelaciones en menos de 30 segundos
          if (momento - ultimoViajeCongelado < 30000) {
            viajesConCongelacion++;
          } else {
            viajesConCongelacion = 1;
          }
          ultimoViajeCongelado = momento;

          if (viajesConCongelacion >= 2) {
            desactivarScrollMagico("congelaciones reiteradas en múltiples viajes");
          } else {
            // En el primer viaje con problemas, frenar el viaje actual para aliviar al navegador pero sin desactivar el scroll mágico
            control?.stop();
            viajando = false;
          }
          return;
        }
      } else if (delta < 35) {
        caidasConsecutivas = 0;
      }
    }

    monitorRaf = requestAnimationFrame(ciclo);
  };

  monitorRaf = requestAnimationFrame(ciclo);
}

function detenerVigilanciaFPS() {
  if (monitorRaf !== null) {
    cancelAnimationFrame(monitorRaf);
    monitorRaf = null;
  }
}

/**
 * Lleva el scroll a `destino` con la misma curva suave del scroll mágico. Solo los viajes lanzados con la
 * rueda cuentan para detectar prisa (un clic en un botón no).
 */
export function deslizarA(destino: number, instantaneo = false, desdeRueda = false) {
  control?.stop();
  detenerVigilanciaFPS();
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const y = Math.max(0, Math.min(max, Math.round(destino)));
  if (instantaneo) {
    window.scrollTo({ top: y, behavior: "instant" });
    return;
  }
  if (scrollMagicoDesactivado()) {
    // Si el scroll mágico está desactivado por rendimiento, usa el scroll suave nativo del navegador (C++)
    window.scrollTo({ top: y, behavior: "smooth" });
    return;
  }
  viajando = true;
  iniciarVigilanciaFPS();
  control = animate(window.scrollY, y, {
    duration: DURACION,
    ease: CURVA_SCROLL,
    onUpdate: (v) => window.scrollTo({ top: v, behavior: "instant" }),
    onComplete: () => {
      viajando = false;
      detenerVigilanciaFPS();
      finViaje = desdeRueda ? performance.now() : 0;
    },
  });
}

/** Destino para encuadrar un elemento: centrado si cabe en la pantalla, desde arriba si es más alto. */
export function encuadre(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  const top = r.top + window.scrollY;
  return el.offsetHeight <= window.innerHeight + 2 ? top + el.offsetHeight / 2 - window.innerHeight / 2 : top;
}

/** La sección entera que contiene un ancla (`#servicios` está dentro de su bloque), para encuadrarla */
function seccionDe(id: string) {
  const el = id ? document.getElementById(decodeURIComponent(id)) : null;
  return el ? (el.closest<HTMLElement>("[data-bloque]") ?? el) : null;
}

/**
 * Anclas de la misma página (`/#servicios`): en vez del salto del navegador, que deja la sección pegada
 * arriba, la encuadra como el scroll mágico (centrada si cabe). Al llegar desde otra página con un ancla,
 * corrige la posición cuando la página ya está montada.
 */
export function useAnclas(ruta: string) {
  useEffect(() => {
    const clic = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest?.("a[href*='#']") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank") return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
      const el = seccionDe(url.hash.slice(1));
      if (!el) return;
      e.preventDefault();
      history.replaceState(history.state, "", url.hash);
      deslizarA(encuadre(el));
    };
    document.addEventListener("click", clic, true);
    return () => document.removeEventListener("click", clic, true);
  }, []);

  useEffect(() => {
    const id = location.hash.slice(1);
    if (!id) return;
    // Las secciones de más abajo se montan escalonadas: se espera a que estén y se encuadra sin animación
    const t = window.setTimeout(() => {
      const el = seccionDe(id);
      if (el) deslizarA(encuadre(el), true);
    }, 450);
    return () => window.clearTimeout(t);
  }, [ruta]);
}

/**
 * "Scroll mágico" (solo en la portada): con la rueda del ratón, cada gesto lleva con una curva suave al
 * siguiente punto. Puntos:
 * - Cada sección de la portada, centrada en la pantalla (si cabe) o desde su inicio (si es más alta).
 * - Dentro de una sección, los elementos marcados con data-punto (los pasos de "Cómo trabajamos"),
 *   cada uno centrado. Los marcados con data-punto-alto, igual, pero solo si la sección no cabe entera. Si encadenas gestos rápido (uno justo al terminar el viaje anterior), deja de ir
 *   paso a paso y te lleva a la sección siguiente.
 * Reglas para que no moleste: solo responde a la rueda (nunca se mueve solo); en una sección más alta
 * que la pantalla y sin puntos, el scroll es normal hasta su borde; se ignora la inercia del trackpad
 * mientras dura el viaje; se cancela con teclado o clic; apagado en táctil, con "reducir movimiento",
 * con el editor abierto, con un vídeo abierto o si se detecta rendimiento bajo extremo (congelaciones graves).
 */
export function useScrollMagico(activo: boolean) {
  const [desactivado, setDesactivado] = useState(() => scrollMagicoDesactivado());

  useEffect(() => {
    const alDesactivar = () => setDesactivado(true);
    window.addEventListener(EVENTO_RENDIMIENTO, alDesactivar);
    return () => window.removeEventListener(EVENTO_RENDIMIENTO, alDesactivar);
  }, []);

  useEffect(() => {
    if (!activo || desactivado || typeof window === "undefined" || window.innerWidth < 768 || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let ultimoEvento = 0;

    const calcular = (): Punto[] => {
      const vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - vh;
      const lista: Punto[] = [];
      for (const el of document.querySelectorAll<HTMLElement>("main > *")) {
        const top = el.getBoundingClientRect().top + window.scrollY;
        const alto = el.offsetHeight;
        if (alto < 40) continue;
        // data-punto-alto: partes de una sección que solo cuentan como pasos si la sección no cabe en la pantalla
        // (Clientes, que con muchas marcas puede quedar más alta que una pantalla baja)
        const cabeEntera = alto <= vh + 2;
        const subs = el.querySelectorAll<HTMLElement>(cabeEntera ? "[data-punto]" : "[data-punto], [data-punto-alto]");
        if (subs.length) {
          for (const s of subs) {
            const rs = s.getBoundingClientRect();
            lista.push({ destino: rs.top + window.scrollY + rs.height / 2 - vh / 2, top, alto, libre: false, sub: true });
          }
        } else {
          lista.push({ destino: cabeEntera ? top + alto / 2 - vh / 2 : top, top, alto, libre: !cabeEntera, sub: false });
        }
      }
      return lista
        .map((p) => ({ ...p, destino: Math.max(0, Math.min(max, Math.round(p.destino))) }))
        .sort((a, b) => a.destino - b.destino);
    };

    const rueda = (e: WheelEvent) => {
      const ahora = performance.now();
      const enCola = ahora - ultimoEvento < 180;
      ultimoEvento = ahora;

      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // zoom o gesto horizontal
      const objetivo = e.target instanceof Element ? e.target : null;
      if (objetivo?.closest("[data-sin-magia], aside, [aria-modal]")) return;
      if (document.querySelector("[aria-modal]")) return;

      // Durante el viaje, y mientras siga llegando la inercia del gesto que lo lanzó, no se hace nada más
      if (viajando || (enCola && control)) {
        e.preventDefault();
        return;
      }
      control = null;
      const conPrisa = ahora - finViaje < MARGEN_PRISA;

      const y = window.scrollY;
      const vh = window.innerHeight;
      const puntos = calcular();
      const abajo = e.deltaY > 0;

      // Sección alta sin puntos que ocupa la pantalla: scroll normal mientras quede contenido en esa dirección
      const libre = puntos.find((p) => p.libre && p.top <= y + 4 && p.top + p.alto >= y + vh - 4);
      if (libre) {
        if (abajo && libre.top + libre.alto > y + vh + 4) return;
        if (!abajo && libre.top < y - 4) return;
      }

      let siguiente = abajo ? puntos.find((p) => p.destino > y + 6) : [...puntos].reverse().find((p) => p.destino < y - 6);
      // Con prisa dentro de una sección con pasos: salta los pasos que quedan y sale de la sección
      if (siguiente && siguiente.sub && conPrisa) {
        const seccion = siguiente.top;
        siguiente = abajo
          ? puntos.find((p) => p.destino > y + 6 && p.top !== seccion)
          : [...puntos].reverse().find((p) => p.destino < y - 6 && p.top !== seccion);
      }
      if (!siguiente) return;
      e.preventDefault();
      deslizarA(siguiente.destino, false, true);
    };

    // Si el usuario pulsa una tecla o hace clic, se cancela el viaje
    const cancelar = () => {
      control?.stop();
      detenerVigilanciaFPS();
      viajando = false;
    };

    window.addEventListener("wheel", rueda, { passive: false });
    window.addEventListener("keydown", cancelar);
    window.addEventListener("pointerdown", cancelar);
    return () => {
      window.removeEventListener("wheel", rueda);
      window.removeEventListener("keydown", cancelar);
      window.removeEventListener("pointerdown", cancelar);
      detenerVigilanciaFPS();
      control?.stop();
    };
  }, [activo, desactivado]);
}
