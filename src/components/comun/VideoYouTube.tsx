"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  id: string;
  inicio?: number;
  activo: boolean;
  /** Espera desde que empieza a reproducirse hasta mostrarse, para que no se vea el rótulo inicial de YouTube */
  retraso?: number;
  /** Zoom sobre el recorte base (1.18), p. ej. para ocultar bandas negras */
  escala?: number;
  /** Pausa el vídeo sin desmontarlo (por ejemplo, cuando sale de pantalla) */
  pausado?: boolean;
};

/**
 * Vídeo de YouTube mudo, en bucle y sin controles, que cubre su contenedor.
 * Solo se deja ver mientras YouTube dice que se está reproduciendo (API por postMessage):
 * así nunca asoman el botón de reproducir, la pausa ni la pantalla final. Debajo queda el póster.
 * Se usa mientras no haya vídeo propio (mp4 en el bucket `medios`), que es más ligero.
 */
// El reproductor nuevo de YouTube enseña sus controles centrales (anterior, pausa, siguiente) unos 2-3 s
// al empezar aunque se pida controls=0: el vídeo no se deja ver hasta que han desaparecido.
export function VideoYouTube({ id, inicio = 0, activo, retraso = 3500, escala, pausado = false }: Props) {
  const marco = useRef<HTMLIFrameElement>(null);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [visible, setVisible] = useState(false);

  // Fuera de pantalla se pausa en vez de desmontarse: quitar y volver a crear el iframe de YouTube costaba
  // fotogramas de 40-70 ms justo al salir de la portada. Pausado no decodifica vídeo y se oculta solo
  // (deja de estar "reproduciendo"); al volver sigue donde iba.
  useEffect(() => {
    const w = marco.current?.contentWindow;
    if (!w || !activo) return;
    w.postMessage(JSON.stringify({ event: "command", func: pausado ? "pauseVideo" : "playVideo", args: [], id, channel: "widget" }), "*");
  }, [pausado, activo, id]);

  // Hablar con el reproductor: pedirle que nos avise de los cambios de estado
  useEffect(() => {
    if (!activo) {
      setReproduciendo(false);
      return;
    }
    const recibir = (e: MessageEvent) => {
      if (e.source !== marco.current?.contentWindow || typeof e.data !== "string") return;
      try {
        const d = JSON.parse(e.data) as { event?: string; info?: { playerState?: number } | number };
        const estado =
          d.event === "onStateChange" && typeof d.info === "number"
            ? d.info
            : d.event === "infoDelivery" && typeof d.info === "object"
              ? d.info?.playerState
              : undefined;
        if (estado !== undefined) setReproduciendo(estado === 1);
      } catch {}
    };
    window.addEventListener("message", recibir);
    return () => window.removeEventListener("message", recibir);
  }, [activo]);

  // Tras empezar a reproducirse, un momento de espera antes de dejarlo ver; si se para, se oculta al instante
  useEffect(() => {
    if (!reproduciendo) {
      setVisible(false);
      return;
    }
    const t = window.setTimeout(() => setVisible(true), retraso);
    return () => window.clearTimeout(t);
  }, [reproduciendo, retraso]);

  if (!activo) return null;

  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    controls: "0",
    loop: "1",
    playlist: id,
    playsinline: "1",
    modestbranding: "1",
    rel: "0",
    disablekb: "1",
    fs: "0",
    iv_load_policy: "3",
    cc_load_policy: "0",
    enablejsapi: "1",
    origin: typeof window === "undefined" ? "" : window.location.origin,
    start: String(inicio),
  });

  // El reproductor tarda en estar listo tras cargar el iframe: se repite el saludo unas cuantas veces
  const escuchar = () => {
    for (const ms of [0, 300, 800, 1600, 3000]) {
      window.setTimeout(() => {
        const w = marco.current?.contentWindow;
        if (!w) return;
        w.postMessage(JSON.stringify({ event: "listening", id, channel: "widget" }), "*");
        w.postMessage(JSON.stringify({ event: "command", func: "addEventListener", args: ["onStateChange"], id, channel: "widget" }), "*");
      }, ms);
    }
  };

  return (
    <div className="yt-marco" aria-hidden>
      <iframe
        ref={marco}
        className="yt-cubrir transition-opacity duration-700"
        style={{ opacity: visible ? 1 : 0, transform: escala ? `translate(-50%, -50%) scale(${escala})` : undefined }}
        src={`https://www.youtube-nocookie.com/embed/${id}?${params}`}
        allow="autoplay; encrypted-media"
        tabIndex={-1}
        title=""
        onLoad={escuchar}
      />
    </div>
  );
}
