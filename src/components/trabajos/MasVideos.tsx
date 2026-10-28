"use client";

import { useState } from "react";
import type { VideoExtra } from "@/lib/datos/tipos";
import { Icono } from "../Iconos";
import { ModalVideo, Revelar } from "../piezas";

/** Shorts y reels van en vertical */
const esVertical = (v: VideoExtra) => v.tipo === "youtube-short" || v.tipo === "instagram" || !!v.vertical;

/** Dirección del reproductor de Instagram a partir del enlace del reel o la publicación */
function embedInstagram(url = "") {
  const m = url.match(/instagram\.com\/(reel|p|tv)\/([\w-]+)/);
  return m ? `https://www.instagram.com/${m[1]}/${m[2]}/embed` : null;
}

const ETIQUETA: Record<VideoExtra["tipo"], string> = { youtube: "Vídeo", "youtube-short": "Short", instagram: "Reel", archivo: "Vídeo" };
const ROL: Record<string, string> = { proceso: "Cómo lo hicimos", making: "Making of" };

/**
 * «Más vídeos» de un proyecto (making of, versiones, reels): tarjetas con su miniatura que abren el vídeo en
 * la ventana grande. Los horizontales en filas de dos o tres y los verticales (Shorts y reels) más estrechos.
 */
export function MasVideos({ videos, titulo, arriba }: { videos: VideoExtra[]; titulo: string; arriba?: boolean }) {
  if (!validos(videos).length) return null;
  return (
    <section className={`px-4 pb-24 sm:px-8 ${arriba ? "pt-20 sm:pt-28" : ""}`}>
      <div className="mx-auto max-w-7xl">
        <Revelar>
          <h2 className="text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">{titulo}</h2>
        </Revelar>
        <div className="mt-8">
          <RejillaVideos videos={videos} />
        </div>
      </div>
    </section>
  );
}

/** Los que se pueden reproducir: Instagram con enlace válido, archivo con dirección, YouTube con id */
const validos = (videos: VideoExtra[]) => videos.filter((v) => (v.tipo === "instagram" ? embedInstagram(v.url) : v.tipo === "archivo" ? v.url : v.id));

/** Las tarjetas de vídeo y su ventana grande, sin título (lo pone quien la usa: la ficha o un bloque) */
export function RejillaVideos({ videos }: { videos: VideoExtra[] }) {
  const [abierto, setAbierto] = useState<VideoExtra | null>(null);
  const lista = validos(videos);
  if (!lista.length) return null;
  const verticales = lista.every(esVertical);
  return (
    <>
      <div className={`grid gap-3 ${verticales ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
        {lista.map((v, i) => (
          <Revelar key={`${v.id ?? v.url}-${i}`} retraso={Math.min(i, 5) * 0.06}>
            <Tarjeta video={v} vertical={verticales && esVertical(v)} alAbrir={() => setAbierto(v)} />
          </Revelar>
        ))}
      </div>
      <ModalVideo
        abierto={!!abierto}
        alCerrar={() => setAbierto(null)}
        vertical={!!abierto && esVertical(abierto)}
        id={abierto?.id}
        src={abierto?.tipo === "instagram" ? (embedInstagram(abierto.url) ?? undefined) : undefined}
        archivo={abierto?.tipo === "archivo" ? abierto.url : undefined}
      />
    </>
  );
}

function Tarjeta({ video: v, vertical, alAbrir }: { video: VideoExtra; vertical: boolean; alAbrir: () => void }) {
  // Miniatura de YouTube; de un Short sale con bandas negras a los lados y el recorte vertical las quita
  const miniatura = v.id && v.tipo !== "instagram" ? `https://i.ytimg.com/vi/${v.id}/${vertical ? "hqdefault" : "maxresdefault"}.jpg` : null;
  const [rota, setRota] = useState(false);
  const etiqueta = (v.rol && ROL[v.rol]) || ETIQUETA[v.tipo];
  return (
    <button
      type="button"
      onClick={alAbrir}
      data-foco
      className={`group relative block w-full overflow-hidden rounded-[24px] bg-black text-left text-white ${vertical ? "aspect-[9/16]" : "aspect-video"}`}
      aria-label={`Ver ${v.titulo || "el vídeo"}`}
    >
      {miniatura && !rota ? (
        <img
          src={miniatura}
          alt=""
          loading="lazy"
          decoding="async"
          // maxresdefault no existe en todos los vídeos: entonces se usa la de calidad alta
          onError={(e) => (e.currentTarget.src.includes("maxres") ? (e.currentTarget.src = `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`) : setRota(true))}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
        />
      ) : v.tipo === "archivo" && v.url ? (
        <video src={`${v.url}#t=0.5`} muted playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" aria-hidden />
      ) : (
        // Instagram no da miniatura sin su API: un fondo con sus colores, muy apagados
        <span className="absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_10%,rgba(253,29,29,0.35),transparent_60%),radial-gradient(100%_80%_at_90%_90%,rgba(131,58,180,0.4),transparent_60%),#111]" />
      )}
      <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/15 transition-transform duration-500 group-hover:scale-110">
        <Icono nombre="play" className="ml-0.5 h-5 w-5" />
      </span>
      <span className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        {etiqueta.toLowerCase() !== (v.titulo ?? "").trim().toLowerCase() && (
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">{etiqueta}</span>
        )}
        {v.titulo && <span className="mt-1 block text-base font-bold leading-snug tracking-[-0.01em] sm:text-lg">{v.titulo}</span>}
      </span>
    </button>
  );
}
