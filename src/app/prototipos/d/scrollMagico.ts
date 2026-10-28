"use client";

import { animate } from "motion/react";
import { useEffect } from "react";

import { CURVA_VIAJE as CURVA_SCROLL } from "@/styles/movimiento";
const DURACION = 1.05;
/** Un gesto que llega justo después de terminar un viaje cuenta como "voy con prisa" */
const MARGEN_PRISA = 450;

type Punto = { destino: number; top: number; alto: number; libre: boolean; sub: boolean };

// Un solo viaje a la vez en toda la página (lo comparten la rueda y los botones de salto)
let control: { stop: () => void } | null = null;
let viajando = false;
let finViaje = 0;

/**
 * Lleva el scroll a `destino` con la misma curva suave del scroll mágico. Solo los viajes lanzados con la
 * rueda cuentan para detectar prisa (un clic en un botón no).
 */
export function deslizarA(destino: number, instantaneo = false, desdeRueda = false) {
  control?.stop();
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const y = Math.max(0, Math.min(max, Math.round(destino)));
  if (instantaneo) {
    window.scrollTo({ top: y, behavior: "instant" });
    return;
  }
  viajando = true;
  control = animate(window.scrollY, y, {
    duration: DURACION,
    ease: CURVA_SCROLL,
    onUpdate: (v) => window.scrollTo({ top: v, behavior: "instant" }),
    onComplete: () => {
      viajando = false;
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

/**
 * "Scroll mágico" (solo en la portada): con la rueda del ratón, cada gesto lleva con una curva suave al
 * siguiente punto. Puntos:
 * - Cada sección de la portada, centrada en la pantalla (si cabe) o desde su inicio (si es más alta).
 * - Dentro de una sección, los elementos marcados con data-punto (los pasos de "Cómo trabajamos"),
 *   cada uno centrado. Si encadenas gestos rápido (uno justo al terminar el viaje anterior), deja de ir
 *   paso a paso y te lleva a la sección siguiente.
 * Reglas para que no moleste: solo responde a la rueda (nunca se mueve solo); en una sección más alta
 * que la pantalla y sin puntos, el scroll es normal hasta su borde; se ignora la inercia del trackpad
 * mientras dura el viaje; se cancela con teclado o clic; apagado en táctil, con "reducir movimiento",
 * con el editor abierto o con un vídeo abierto.
 */
export function useScrollMagico(activo: boolean) {
  useEffect(() => {
    if (!activo || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let ultimoEvento = 0;

    const calcular = (): Punto[] => {
      const vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - vh;
      const lista: Punto[] = [];
      for (const el of document.querySelectorAll<HTMLElement>("main > *")) {
        const top = el.getBoundingClientRect().top + window.scrollY;
        const alto = el.offsetHeight;
        if (alto < 40) continue;
        const subs = el.querySelectorAll<HTMLElement>("[data-punto]");
        if (subs.length) {
          for (const s of subs) {
            const rs = s.getBoundingClientRect();
            lista.push({ destino: rs.top + window.scrollY + rs.height / 2 - vh / 2, top, alto, libre: false, sub: true });
          }
        } else {
          const cabe = alto <= vh + 2;
          lista.push({ destino: cabe ? top + alto / 2 - vh / 2 : top, top, alto, libre: !cabe, sub: false });
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
      viajando = false;
    };

    window.addEventListener("wheel", rueda, { passive: false });
    window.addEventListener("keydown", cancelar);
    window.addEventListener("pointerdown", cancelar);
    return () => {
      window.removeEventListener("wheel", rueda);
      window.removeEventListener("keydown", cancelar);
      window.removeEventListener("pointerdown", cancelar);
      control?.stop();
    };
  }, [activo]);
}
