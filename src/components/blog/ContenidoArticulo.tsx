import type { Medio } from "@/lib/datos/tipos";
import { enfoque, img } from "../comun/imagen";

// El cuerpo de un artículo es un documento del editor (formato ProseMirror/TipTap): { type: "doc", content: [...] }.
// Aquí se pinta sin dependencias. Lo que no se reconoce se salta en vez de romper la página, para que un
// nodo nuevo del editor (tarea S14) no tumbe el artículo: se añade aquí cuando exista.

type Nodo = { type?: string; attrs?: Record<string, unknown>; content?: Nodo[]; text?: string; marks?: { type: string; attrs?: Record<string, unknown> }[] };

const cadena = (v: unknown) => (typeof v === "string" ? v : "");

/** Id de YouTube de una URL (watch, youtu.be, shorts o embed) o del propio id */
function idYouTube(v: string) {
  return v.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/)?.[1] ?? (/^[\w-]{11}$/.test(v) ? v : "");
}

function Texto({ nodo }: { nodo: Nodo }) {
  let r: React.ReactNode = nodo.text ?? "";
  for (const m of nodo.marks ?? []) {
    if (m.type === "bold") r = <strong className="font-bold text-[var(--jm-texto)]">{r}</strong>;
    else if (m.type === "italic") r = <em>{r}</em>;
    else if (m.type === "link") {
      const href = cadena(m.attrs?.href);
      const fuera = /^https?:/.test(href);
      r = (
        <a href={href} {...(fuera ? { target: "_blank", rel: "noreferrer" } : {})} className="font-semibold text-[var(--jm-acento)] underline decoration-1 underline-offset-4">
          {r}
        </a>
      );
    }
  }
  return <>{r}</>;
}

function Hijos({ nodo, medios }: { nodo: Nodo; medios: Record<string, Medio> }) {
  return (
    <>
      {(nodo.content ?? []).map((n, i) => (
        <Bloque key={i} nodo={n} medios={medios} />
      ))}
    </>
  );
}

function Bloque({ nodo, medios }: { nodo: Nodo; medios: Record<string, Medio> }) {
  switch (nodo.type) {
    case "text":
      return <Texto nodo={nodo} />;
    case "hardBreak":
      return <br />;
    case "paragraph":
      return nodo.content?.length ? (
        <p className="mt-6 text-[1.075rem] leading-[1.8] text-[var(--jm-suave)] [text-wrap:pretty]">
          <Hijos nodo={nodo} medios={medios} />
        </p>
      ) : null;
    case "heading":
      return Number(nodo.attrs?.level) >= 3 ? (
        <h3 className="mt-10 text-xl font-extrabold tracking-[-0.02em]">
          <Hijos nodo={nodo} medios={medios} />
        </h3>
      ) : (
        <h2 className="mt-14 text-[clamp(1.5rem,3vw,2rem)] font-extrabold leading-tight tracking-[-0.03em] [text-wrap:balance]">
          <Hijos nodo={nodo} medios={medios} />
        </h2>
      );
    case "bulletList":
    case "orderedList": {
      const Lista = nodo.type === "bulletList" ? "ul" : "ol";
      return (
        <Lista className={`mt-6 space-y-2 pl-6 text-[1.075rem] leading-[1.8] text-[var(--jm-suave)] ${nodo.type === "bulletList" ? "list-disc" : "list-decimal"} marker:text-[var(--jm-acento)]`}>
          <Hijos nodo={nodo} medios={medios} />
        </Lista>
      );
    }
    case "listItem":
      // Dentro de una lista, los párrafos no llevan su margen
      return (
        <li className="[&>p]:mt-0">
          <Hijos nodo={nodo} medios={medios} />
        </li>
      );
    case "blockquote":
      return (
        <blockquote className="mt-10 border-l-2 border-[var(--jm-acento)] pl-6 text-xl font-semibold leading-relaxed text-[var(--jm-texto)] [&>p]:text-inherit">
          <Hijos nodo={nodo} medios={medios} />
        </blockquote>
      );
    case "horizontalRule":
      return <hr className="my-12 border-[var(--jm-borde)]" />;
    case "image": {
      const m = medios[cadena(nodo.attrs?.medio)];
      const url = m?.url ?? cadena(nodo.attrs?.src);
      if (!url) return null;
      const pie = cadena(nodo.attrs?.pie);
      return (
        // Las imágenes salen algo más anchas que el texto, como en una revista
        <figure className="-mx-2 mt-10 sm:-mx-16">
          <img src={img(url, 1920)} alt={cadena(nodo.attrs?.alt) || m?.alt || ""} loading="lazy" decoding="async" className="w-full rounded-[28px] object-cover" style={enfoque(m)} />
          {pie && <figcaption className="mt-3 px-2 text-sm text-[var(--jm-tenue)] sm:px-16">{pie}</figcaption>}
        </figure>
      );
    }
    case "youtube": {
      const id = idYouTube(cadena(nodo.attrs?.src) || cadena(nodo.attrs?.id));
      if (!id) return null;
      return (
        <div className="-mx-2 mt-10 aspect-video overflow-hidden rounded-[28px] bg-black sm:-mx-16">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
            title={cadena(nodo.attrs?.titulo) || "Vídeo"}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="h-full w-full"
          />
        </div>
      );
    }
    default:
      return nodo.content ? <Hijos nodo={nodo} medios={medios} /> : null;
  }
}

/** Cuerpo del artículo. `medios`: la biblioteca, para resolver las imágenes que el documento cita por id. */
export function ContenidoArticulo({ contenido, medios }: { contenido: unknown; medios: Record<string, Medio> }) {
  const doc = (contenido && typeof contenido === "object" ? contenido : {}) as Nodo;
  return (
    <div className="[&>*:first-child]:mt-0">
      <Hijos nodo={doc} medios={medios} />
    </div>
  );
}
