import Link from "next/link";
import { fechaCorta } from "@/lib/datos/seleccion";
import type { Articulo } from "@/lib/datos/tipos";
import { RUTAS } from "@/lib/rutas";
import { enfoque, img } from "../comun/imagen";
import { Icono } from "../Iconos";

/** Tarjeta de un artículo (bloque Blog de Inicio, listado /blog y «Más artículos» de cada artículo). */
export function TarjetaArticulo({ articulo: a }: { articulo: Articulo }) {
  return (
    <>
      {/* Móvil: panel horizontal compacto para que quepan los 3 en una pantalla */}
      <Link
        href={RUTAS.articulo(a.slug)}
        data-foco
        className="cristal group flex items-center gap-3.5 overflow-hidden rounded-[20px] p-2.5 transition-transform duration-500 hover:-translate-y-1 sm:hidden"
      >
        <div className="relative aspect-[16/10] w-28 shrink-0 overflow-hidden rounded-[14px] bg-black">
          {a.imagen && (
            <img
              src={img(a.imagen.url, 384)}
              style={enfoque(a.imagen)}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-110"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <div className="flex items-center gap-2 text-[10px] text-[var(--jm-tenue)]">
            <time dateTime={a.fecha}>{fechaCorta(a.fecha)}</time>
            {a.categoria && <span className="font-semibold text-[var(--jm-acento)]">· {a.categoria.nombre}</span>}
          </div>
          <h3 className="mt-1 line-clamp-2 text-xs font-bold leading-snug tracking-[-0.015em] text-[var(--jm-texto)]">
            {a.titulo}
          </h3>
          <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--jm-acento)]">
            Leer
            <Icono nombre="flecha" className="h-3 w-3" />
          </span>
        </div>
      </Link>

      {/* Pantalla grande: tarjeta vertical amplia con foto grande */}
      <Link
        href={RUTAS.articulo(a.slug)}
        data-foco
        className="cristal group hidden h-full flex-col overflow-hidden rounded-[32px] transition-transform duration-500 hover:-translate-y-1.5 sm:flex"
      >
        <div className="relative aspect-[16/9] overflow-hidden bg-black">
          {a.imagen && (
            <img
              src={img(a.imagen.url, 828)}
              style={enfoque(a.imagen)}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-110"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          {a.categoria && <span className="cristal absolute left-5 top-5 rounded-full px-3 py-1 text-[11px] font-semibold">{a.categoria.nombre}</span>}
        </div>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <p className="text-xs text-[var(--jm-tenue)]">
            <time dateTime={a.fecha}>{fechaCorta(a.fecha)}</time>
          </p>
          <h3 className="mt-2 text-xl font-extrabold leading-snug tracking-[-0.03em]">{a.titulo}</h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--jm-suave)]">{a.extracto}</p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--jm-acento)]">
            Leer
            <Icono nombre="flecha" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </>
  );
}
