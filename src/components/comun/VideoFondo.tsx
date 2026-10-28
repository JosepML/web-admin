"use client";

import { useInView } from "motion/react";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { useMedia, useReducir, useVideoAbierto } from "./hooks";
import { VideoYouTube } from "./VideoYouTube";
import { img } from "./imagen";

type Props = {
  /** Vídeo propio (mp4 o webm del bucket `medios`): es lo preferido. Si no hay, YouTube; sin ninguno, el póster */
  archivo?: string | null;
  /** Vídeo vertical opcional para pantallas en vertical / móvil */
  archivoVertical?: string | null;
  youtubeId?: string | null;
  inicio?: number;
  poster?: string | null;
  /** Punto de interés del póster al recortarse (object-position) */
  foco?: CSSProperties;
  className?: string;
  /** Filtro CSS para el póster y el vídeo (p. ej. blanco y negro) */
  filtro?: string;
  /** Zoom extra del vídeo de YouTube, para recortar bandas negras del original */
  escala?: number;
};

/**
 * Vídeo de fondo. Primero se pinta el póster (carga rápida en móvil); en pantallas anchas entra el vídeo
 * encima. Fuera de pantalla, o con el vídeo grande abierto, el vídeo se pausa (no se desmonta: rehacer el iframe daba tirones).
 * Con "reducir movimiento" el vídeo sigue (es la imagen de la web), pero el póster no hace zoom.
 */
export function VideoFondo({ archivo, archivoVertical, youtubeId, inicio, poster, foco, className = "", filtro, escala }: Props) {
  const reducir = useReducir();
  const esVertical = useMedia("(orientation: portrait)");
  // Si la pantalla está en vertical y hay vídeo vertical adaptado, se usa; en horizontal o sin vertical, el normal
  const archivoActual = esVertical && archivoVertical ? archivoVertical : (archivo || archivoVertical);
  const caja = useRef<HTMLDivElement>(null);
  const propio = useRef<HTMLVideoElement>(null);
  const enPantalla = useInView(caja, { margin: "100px" });
  // Con el vídeo grande abierto encima, el de fondo se pausa como si estuviera fuera de pantalla
  const videoAbierto = useVideoAbierto();
  const visible = enPantalla && !videoAbierto;
  const [listo, setListo] = useState(false);
  const [propioListo, setPropioListo] = useState(false);

  useEffect(() => {
    setPropioListo(false);
  }, [archivoActual]);

  // Crear o arrancar el reproductor espera a que la portada ya haya mostrado su póster y la página
  // esté quieta un momento (150 ms para archivo mp4, 600 ms para YouTube): así siempre se ve
  // primero la imagen y nunca una pantalla en negro, tanto en móvil como en escritorio.
  useEffect(() => {
    if (listo || !visible) return;
    const espera = archivoActual ? 150 : 600;
    let t = window.setTimeout(() => setListo(true), espera);
    const reiniciar = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => setListo(true), espera);
    };
    window.addEventListener("scroll", reiniciar, { passive: true });
    window.addEventListener("wheel", reiniciar, { passive: true });
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("scroll", reiniciar);
      window.removeEventListener("wheel", reiniciar);
    };
  }, [listo, visible, archivoActual]);

  const conVideo = listo;

  // El vídeo propio arranca cuando toca (conVideo) y se pausa fuera de pantalla
  useEffect(() => {
    const v = propio.current;
    if (!v) return;
    if (conVideo && visible) {
      const p = v.play();
      if (p !== undefined) p.catch(() => {});
    } else {
      v.pause();
    }
  }, [conVideo, visible, archivoActual]);

  return (
    <div ref={caja} className={`absolute inset-0 overflow-hidden bg-black ${className}`} style={{ filter: filtro }}>
      {poster && (
        <img
          src={img(poster, 1920)}
          alt=""
          style={foco}
          className={`absolute inset-0 h-full w-full object-cover ${reducir || propioListo || !visible ? "" : "animate-[kenburns_24s_ease-in-out_infinite_alternate]"}`}
          fetchPriority="high"
        />
      )}
      {archivoActual ? (
        <video
          ref={propio}
          src={archivoActual}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
          onPlaying={() => setPropioListo(true)}
          onTimeUpdate={(e) => {
            if (!propioListo && e.currentTarget.currentTime > 0.12) setPropioListo(true);
          }}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
          style={{ opacity: propioListo ? 1 : 0 }}
        />
      ) : (
        youtubeId && <VideoYouTube id={youtubeId} inicio={inicio} activo={conVideo} escala={escala} pausado={!visible} />
      )}
    </div>
  );
}
