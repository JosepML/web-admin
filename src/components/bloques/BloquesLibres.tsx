"use client";

import type { Bloque, VideoExtra } from "@/lib/datos/tipos";
import { lista, objeto, texto } from "@/lib/datos/util";
import { enfoque, img } from "../comun/imagen";
import { Editable, useEditando } from "../edicion/contexto";
import { RejillaVideos } from "../trabajos/MasVideos";
import { useDatos, useMedio } from "../marco/DatosWeb";
import { Revelar, Titular, TituloConAcento } from "../piezas";

// Bloques para las páginas que cree Josep (no salen en Inicio): galería, vídeo (uno o varios) y cita.

/** Galería: rejilla de imágenes con su pie. `imagenes`: [{ medio, pie }] */
export function BloqueGaleria({ bloque }: { bloque: Bloque }) {
  const { medios } = useDatos();
  const imagenes = lista(bloque.datos.imagenes).flatMap((x) => {
    const o = objeto(x);
    const m = typeof o.medio === "string" ? medios[o.medio] : undefined;
    return m ? [{ medio: m, pie: texto(o.pie) }] : [];
  });
  if (!imagenes.length) return null;
  return (
    <section className="px-4 py-8 sm:px-8 sm:py-32 lg:py-[6svh]">
      <div className="mx-auto max-w-7xl">
        {bloque.datos.titulo && <Titular antetitulo={bloque.datos.antetitulo} titulo={bloque.datos.titulo} texto={bloque.datos.texto} />}
        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-12 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
          {imagenes.map(({ medio, pie }, i) => (
            <Revelar key={`${medio.id}-${i}`} retraso={(i % 3) * 0.07}>
              <figure>
                <img
                  src={img(medio.url, 1200)}
                  alt={medio.alt}
                  loading="lazy"
                  decoding="async"
                  style={enfoque(medio)}
                  className="aspect-[3/2] w-full rounded-[var(--jm-radio-medio)] object-cover"
                />
                {pie && <figcaption className="mt-2 px-1 text-sm text-[var(--jm-suave)]">{pie}</figcaption>}
              </figure>
            </Revelar>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Vídeo: uno de YouTube (`youtubeId`) o un archivo propio (`medio`), en una tarjeta panorámica */
export function BloqueVideo({ bloque }: { bloque: Bloque }) {
  const archivo = useMedio(bloque.datos.medio);
  const youtubeId = texto(bloque.datos.youtubeId);
  const { medios } = useDatos();
  // Los vídeos subidos van por id: aquí se les pone su dirección
  const videos = lista<VideoExtra>(bloque.datos.videos).map((v) => (v.tipo === "archivo" && v.medio ? { ...v, url: medios[v.medio]?.url ?? v.url } : v));
  const editando = useEditando();
  // Varios vídeos: en tarjetas que se abren en la ventana grande (como los «Más vídeos» de un proyecto)
  if (videos.length) {
    return (
      <section className="px-4 py-8 sm:px-8 sm:py-24 lg:py-[5svh]">
        <div className="mx-auto max-w-7xl">
          {bloque.datos.titulo && <Titular antetitulo={bloque.datos.antetitulo} titulo={bloque.datos.titulo} texto={bloque.datos.texto} />}
          <div className="mt-5 sm:mt-10 lg:mt-[4svh]">
            <RejillaVideos videos={videos} />
          </div>
        </div>
      </section>
    );
  }
  if (!archivo && !youtubeId) {
    return editando ? (
      <section className="px-4 py-16 sm:px-8">
        <p className="cristal mx-auto max-w-3xl rounded-[28px] p-8 text-center text-[var(--jm-suave)]">Sección de vídeo vacía: añade uno o varios vídeos desde su formulario.</p>
      </section>
    ) : null;
  }
  return (
    <section className="px-4 py-8 sm:px-8 sm:py-32 lg:py-[6svh]">
      <div className="mx-auto max-w-6xl">
        {bloque.datos.titulo && <Titular antetitulo={bloque.datos.antetitulo} titulo={bloque.datos.titulo} texto={bloque.datos.texto} />}
        <Revelar className="mt-5 sm:mt-12">
          <div className="relative aspect-video overflow-hidden rounded-[var(--jm-radio-bloque)] bg-black shadow-[var(--jm-sombra-foto)]">
            {archivo ? (
              <video src={archivo.url} controls playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                allow="encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
                loading="lazy"
                title={bloque.datos.titulo || "Vídeo"}
              />
            )}
          </div>
        </Revelar>
      </div>
    </section>
  );
}

/** Cita: una frase grande con la palabra de acento (*asteriscos*) y quién la dijo (`autor`) */
export function BloqueCita({ bloque }: { bloque: Bloque }) {
  const autor = texto(bloque.datos.autor);
  const frase = bloque.datos.titulo || bloque.datos.texto || "";
  if (!frase) return null;
  return (
    <section className="px-3 py-8 sm:px-6 sm:py-24">
      <Revelar>
        <figure className="cristal mx-auto max-w-6xl rounded-[var(--jm-radio-bloque)] px-5 py-10 text-center sm:px-16 sm:py-28">
          <blockquote className="text-[clamp(1.4rem,4.6vw,4rem)] font-extrabold leading-[1.1] tracking-[-0.04em] [text-wrap:balance] sm:leading-[1.08]">
            <Editable campo={bloque.datos.titulo || !bloque.datos.texto ? "titulo" : "texto"} valor={frase}>
              <TituloConAcento texto={frase} />
            </Editable>
          </blockquote>
          {autor && (
            <figcaption className="mt-6 text-sm font-semibold text-[var(--jm-suave)]">
              <Editable campo="autor" valor={autor}>
                {autor}
              </Editable>
            </figcaption>
          )}
        </figure>
      </Revelar>
    </section>
  );
}
