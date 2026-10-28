"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { salir } from "@/lib/admin/acceso";
import { CURVA } from "@/styles/movimiento";
import { Icono } from "../Iconos";

/** Secciones del panel. `pronto`: se ve atenuada hasta que exista. `tambien`: otras rutas que la marcan activa. */
const SECCIONES: { nombre: string; href: string; icono: string; pronto?: boolean; tambien?: string[] }[] = [
  { nombre: "Resumen", href: "/admin", icono: "rejilla" },
  { nombre: "Páginas", href: "/admin/paginas", icono: "pagina" },
  { nombre: "Proyectos", href: "/admin/proyectos", icono: "claqueta" },
  { nombre: "Artículos", href: "/admin/articulos", icono: "lapiz" },
  { nombre: "Servicios", href: "/admin/servicios", icono: "camara" },
  { nombre: "Clientes y opiniones", href: "/admin/clientes", icono: "estrella", tambien: ["/admin/opiniones", "/admin/canales"] },
  { nombre: "Mensajes", href: "/admin/mensajes", icono: "correo" },
  { nombre: "Biblioteca", href: "/admin/biblioteca", icono: "imagen" },
  { nombre: "Ajustes", href: "/admin/ajustes", icono: "ajustes" },
];

export function BarraLateral({ mensajesNuevos = 0 }: { mensajesNuevos?: number }) {
  const ruta = usePathname();
  const [abierta, setAbierta] = useState(false);
  useEffect(() => setAbierta(false), [ruta]);

  const activa = (href: string) => {
    if (href === "/admin") return ruta === "/admin";
    const s = SECCIONES.find((x) => x.href === href);
    return [href, ...(s?.tambien ?? [])].some((h) => ruta === h || ruta.startsWith(`${h}/`));
  };

  const contenido = (
    <>
      <Link href="/admin" className="block px-3 text-[15px] font-extrabold tracking-tight">
        Josep Mira<span className="text-[var(--jm-acento)]">.</span>
        <span className="ml-2 align-middle text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--jm-tenue)]">Panel</span>
      </Link>
      <nav className="mt-8 flex flex-col gap-0.5" aria-label="Panel">
        {SECCIONES.map((s) =>
          s.pronto ? (
            <span key={s.href} className="flex items-center gap-3 rounded-full px-3 py-2.5 text-sm text-[var(--jm-tenue)]" title="Llega con las próximas tareas">
              <Icono nombre={s.icono} className="h-[18px] w-[18px]" />
              {s.nombre}
              <span className="ml-auto rounded-full border border-[var(--jm-borde)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">Pronto</span>
            </span>
          ) : (
            <Link
              key={s.href}
              href={s.href}
              className={`relative flex items-center gap-3 rounded-full px-3 py-2.5 text-sm font-medium transition-colors ${activa(s.href) ? "text-[var(--jm-texto)]" : "text-[var(--jm-suave)] hover:text-[var(--jm-texto)]"}`}
            >
              {activa(s.href) && <motion.span layoutId="seccion-activa" className="absolute inset-0 rounded-full bg-white/[0.08]" transition={{ duration: 0.45, ease: CURVA }} />}
              <Icono nombre={s.icono} className="relative h-[18px] w-[18px]" />
              <span className="relative">{s.nombre}</span>
              {s.href === "/admin/mensajes" && mensajesNuevos > 0 && (
                <span className="relative ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--jm-acento)] px-1.5 text-[11px] font-bold text-white">{mensajesNuevos}</span>
              )}
            </Link>
          ),
        )}
      </nav>
      <div className="mt-auto flex flex-col gap-0.5 pt-8">
        <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-full px-3 py-2.5 text-sm text-[var(--jm-suave)] hover:text-[var(--jm-texto)]">
          <Icono nombre="externo" className="h-[18px] w-[18px]" />
          Ver la web
        </a>
        <a href="/admin/vista-previa?ruta=/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-full px-3 py-2.5 text-sm text-[var(--jm-suave)] hover:text-[var(--jm-texto)]">
          <Icono nombre="ojo" className="h-[18px] w-[18px]" />
          Ver con lo no publicado
        </a>
        <form action={salir}>
          <button type="submit" className="flex w-full items-center gap-3 rounded-full px-3 py-2.5 text-sm text-[var(--jm-suave)] hover:text-[var(--jm-texto)]">
            <Icono nombre="salir" className="h-[18px] w-[18px]" />
            Cerrar sesión
          </button>
        </form>
      </div>
    </>
  );

  return (
    <>
      {/* Escritorio: barra fija a la izquierda */}
      <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col p-4 lg:flex">
        <div className="cristal flex h-full flex-col rounded-[32px] px-3 py-6">{contenido}</div>
      </aside>

      {/* Móvil: barra arriba y menú desplegable */}
      <div className="fixed inset-x-3 top-3 z-50 lg:hidden">
        <div className="cristal cristal-fuerte flex items-center justify-between rounded-full py-2 pl-5 pr-2">
          <Link href="/admin" className="text-[15px] font-extrabold tracking-tight">
            Josep Mira<span className="text-[var(--jm-acento)]">.</span>
          </Link>
          <button type="button" className="boton-icono" onClick={() => setAbierta((v) => !v)} aria-label="Menú del panel" aria-expanded={abierta}>
            <Icono nombre={abierta ? "cerrar" : "menu"} />
          </button>
        </div>
        <AnimatePresence>
          {abierta && (
            <motion.div
              className="cristal cristal-fuerte mt-2 flex max-h-[80svh] flex-col overflow-y-auto rounded-[28px] p-4"
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.35, ease: CURVA }}
            >
              {contenido}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
