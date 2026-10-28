"use client";

import { useSyncExternalStore } from "react";

function useMedia(consulta: string, porDefecto = false) {
  return useSyncExternalStore(
    (avisar) => {
      const mq = window.matchMedia(consulta);
      mq.addEventListener("change", avisar);
      return () => mq.removeEventListener("change", avisar);
    },
    () => window.matchMedia(consulta).matches,
    () => porDefecto,
  );
}

/** Ratón o trackpad: hay hover de verdad. En móvil y tableta es false. */
export function usePunteroFino() {
  return useMedia("(hover: hover) and (pointer: fine)");
}

/** Pantalla ancha (tableta horizontal y ordenador). */
export function usePantallaAncha() {
  return useMedia("(min-width: 768px)");
}

/** Ordenador (el punto `lg` de Tailwind). */
export function useEscritorio() {
  return useMedia("(min-width: 1024px)");
}

// --- Reducir movimiento -------------------------------------------------------
// El PC de Josep tiene desactivados los "Efectos de animación" de Windows, y el navegador lo traduce
// en "reducir movimiento": la web se ve casi quieta. En los prototipos las animaciones van siempre,
// salvo que se active "Respetar ajuste del sistema" en la barra inferior. En la web final se respetará siempre.

const CLAVE_RESPETAR = "proto-respetar-movimiento";
const EVENTO_RESPETAR = "proto-respetar-movimiento";

function suscribirRespetar(avisar: () => void) {
  window.addEventListener(EVENTO_RESPETAR, avisar);
  window.addEventListener("storage", avisar);
  return () => {
    window.removeEventListener(EVENTO_RESPETAR, avisar);
    window.removeEventListener("storage", avisar);
  };
}

function leerRespetar() {
  try {
    return localStorage.getItem(CLAVE_RESPETAR) === "1";
  } catch {
    return false;
  }
}

export function useRespetarSistema() {
  return useSyncExternalStore(suscribirRespetar, leerRespetar, () => false);
}

export function setRespetarSistema(valor: boolean) {
  try {
    localStorage.setItem(CLAVE_RESPETAR, valor ? "1" : "0");
  } catch {}
  window.dispatchEvent(new Event(EVENTO_RESPETAR));
}

/** Sustituye a useReducedMotion en los prototipos. */
export function useReducir() {
  const sistema = useMedia("(prefers-reduced-motion: reduce)");
  const respetar = useRespetarSistema();
  return sistema && respetar;
}

/** true si el sistema pide reducir movimiento (para avisar en la barra). */
export function useSistemaReduce() {
  return useMedia("(prefers-reduced-motion: reduce)");
}
