import type { Proyecto } from "@/lib/datos/tipos";
import { RUTAS } from "@/lib/rutas";
import { enfoque, img } from "../comun/imagen";
import { Enlace } from "../comun/Enlace";
import { Icono } from "../Iconos";
import { Revelar } from "../piezas";

/** Tarjeta al final de /trabajos que lleva a /recreaciones (las recreaciones no salen en el listado) */
/** `evitar`: medios que no sirven de foto (las comparaciones montadas, con marco y rótulos) */
export function EnlaceRecreaciones({ titulo, texto, recreaciones, evitar }: { titulo: string; texto: string; recreaciones: Proyecto[]; evitar: Set<string> }) {
  const fotos = recreaciones
    .flatMap((p) => [p.poster, ...p.galeria.map((g) => g.imagen)].find((m) => m && !evitar.has(m.id)) ?? [])
    .slice(0, 4);
  if (!recreaciones.length) return null;
  return (
    <Revelar className="mt-20">
      <Enlace href={RUTAS.recreaciones} className="group relative block overflow-hidden rounded-[32px] bg-black sm:rounded-[40px]">
        <div className="absolute inset-0 grid grid-cols-2 sm:grid-cols-4">
          {fotos.map((f) => (
            <img key={f.id} src={img(f.url, 1200)} style={enfoque(f)} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover opacity-60 transition-transform duration-[1.4s] group-hover:scale-105" />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/25" />
        <div className="relative flex min-h-[320px] flex-col justify-end gap-6 p-7 text-white sm:min-h-[380px] sm:flex-row sm:items-end sm:justify-between sm:p-12">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">{recreaciones.length} recreaciones</p>
            <p className="mt-2 text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1] tracking-[-0.04em]">{titulo}</p>
            {texto && <p className="mt-4 text-lg leading-snug text-white/80 [text-wrap:pretty]">{texto}</p>}
          </div>
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur transition-transform duration-500 group-hover:translate-x-1">
            <Icono nombre="flecha" className="h-5 w-5" />
          </span>
        </div>
      </Enlace>
    </Revelar>
  );
}
