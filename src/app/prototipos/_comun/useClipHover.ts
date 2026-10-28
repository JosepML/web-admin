"use client";

import { useEffect, useRef, useState } from "react";
import { usePunteroFino, useReducir } from "./hooks";

/**
 * Clip mudo al pasar el ratón: arranca tras una breve espera (para no cargar
 * vídeos al cruzar la pantalla con el ratón). Desactivado en móvil y con "reducir movimiento".
 */
export function useClipHover(espera = 350) {
  const fino = usePunteroFino();
  const reducir = useReducir();
  const [encima, setEncima] = useState(false);
  const [activo, setActivo] = useState(false);
  const t = useRef<number>(0);

  useEffect(() => {
    window.clearTimeout(t.current);
    if (encima && fino && !reducir) t.current = window.setTimeout(() => setActivo(true), espera);
    else setActivo(false);
    return () => window.clearTimeout(t.current);
  }, [encima, fino, reducir, espera]);

  return {
    activo,
    encima,
    handlers: {
      onPointerEnter: () => setEncima(true),
      onPointerLeave: () => setEncima(false),
    },
  };
}
