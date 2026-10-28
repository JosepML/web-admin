"use client";

import { useSyncExternalStore } from "react";

export function useMedia(consulta: string, porDefecto = false) {
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

/**
 * "Reducir movimiento". La web se mueve siempre como el prototipo D aprobado, aunque el sistema pida
 * reducir movimiento: Josep (que tiene desactivados los efectos de animación de Windows) lo pidió así, y
 * con el ajuste del sistema se perdían los orbes del fondo, las marquesinas y el scroll mágico. Todo el
 * código que se adapta sigue pasando por aquí: si algún día se quiere respetar el sistema (repaso de
 * accesibilidad, S20), basta con devolver useMedia("(prefers-reduced-motion: reduce)").
 */
export function useReducir() {
  return false;
}

/** Columnas de una rejilla según el ancho: 2 en móvil, 3 desde sm (640 px), 4 desde lg (1024 px) y `ancha` desde
 *  1200 px. En el servidor, las de ordenador. */
export function useColumnas(ancha: number) {
  const sm = useMedia("(min-width: 640px)", true);
  const lg = useMedia("(min-width: 1024px)", true);
  const xl = useMedia("(min-width: 1200px)", true);
  return xl ? ancha : lg ? 4 : sm ? 3 : 2;
}

/** Parte una lista en filas de `n` (la última puede quedar incompleta) */
export function enFilas<T>(lista: T[], n: number): T[][] {
  const filas: T[][] = [];
  for (let i = 0; i < lista.length; i += n) filas.push(lista.slice(i, i + n));
  return filas;
}

// ---- Vídeo a pantalla completa abierto ------------------------------------------------------------
// Mientras se ve un vídeo en la ventana grande, el resto de la página se para: los vídeos de fondo se pausan
// (si no, el navegador decodifica dos vídeos a la vez) y las animaciones CSS se congelan (ver
// .jm-raiz[data-video] en web.css). Así toda la potencia va al vídeo.
let videoAbierto = false;
const avisosVideo = new Set<() => void>();

export function marcarVideoAbierto(abierto: boolean) {
  if (videoAbierto === abierto) return;
  videoAbierto = abierto;
  document.querySelector(".jm-raiz")?.toggleAttribute("data-video", abierto);
  avisosVideo.forEach((f) => f());
}

export function useVideoAbierto() {
  return useSyncExternalStore(
    (avisar) => {
      avisosVideo.add(avisar);
      return () => avisosVideo.delete(avisar);
    },
    () => videoAbierto,
    () => false,
  );
}
