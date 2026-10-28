"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { usePantallaAncha, useReducir } from "./hooks";
import { VideoYouTube } from "./VideoYouTube";
import { img } from "./imagen";

type Props = {
  /** Sin vídeo se queda el póster */
  id?: string;
  inicio?: number;
  poster: string;
  className?: string;
  /** Filtro CSS para el póster y el vídeo (p. ej. blanco y negro) */
  filtro?: string;
  /** Zoom extra del vídeo, para recortar bandas negras del original */
  escala?: number;
};

/**
 * Reel de fondo. Primero se pinta el fotograma (carga rápida en móvil);
 * en pantallas anchas y sin "reducir movimiento" entra el vídeo encima.
 * Fuera de pantalla el vídeo se pausa (no se desmonta: rehacer el iframe daba tirones al salir de la portada).
 */
export function VideoFondo({ id, inicio, poster, className = "", filtro, escala }: Props) {
  const ancha = usePantallaAncha();
  const reducir = useReducir();
  const caja = useRef<HTMLDivElement>(null);
  const visible = useInView(caja, { margin: "100px" });
  const [listo, setListo] = useState(false);

  // Crear el reproductor de YouTube bloquea la GPU unos 250 ms (lo inicia el propio YouTube), así que
  // solo se crea con el vídeo a la vista y la página quieta un momento: nunca en mitad de un scroll.
  // Una vez creado se queda (fuera de pantalla se pausa).
  useEffect(() => {
    if (listo || !visible) return;
    let t = window.setTimeout(() => setListo(true), 700);
    const reiniciar = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => setListo(true), 700);
    };
    window.addEventListener("scroll", reiniciar, { passive: true });
    window.addEventListener("wheel", reiniciar, { passive: true });
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("scroll", reiniciar);
      window.removeEventListener("wheel", reiniciar);
    };
  }, [listo, visible]);

  const video = Boolean(id) && listo && ancha && !reducir;

  return (
    <div ref={caja} className={`absolute inset-0 overflow-hidden bg-black ${className}`} style={{ filter: filtro }}>
      <img
        src={img(poster, 3840)}
        alt=""
        className={`absolute inset-0 h-full w-full object-cover ${reducir || video || !visible ? "" : "animate-[kenburns_24s_ease-in-out_infinite_alternate]"}`}
        fetchPriority="high"
      />
      {id && <VideoYouTube id={id} inicio={inicio} activo={video} escala={escala} pausado={!visible} />}
    </div>
  );
}
