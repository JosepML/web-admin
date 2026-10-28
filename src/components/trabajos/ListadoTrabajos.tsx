"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { proyectosDe, tiposDe } from "@/lib/datos/seleccion";
import type { Proyecto, Servicio } from "@/lib/datos/tipos";
import { TarjetaProyecto } from "../bloques/BloqueTrabajos";
import { CURVA, Revelar } from "../piezas";

type Filtro = { slug: string; nombre: string };

/** Categoría de la segunda fila: un nombre que agrupa uno o más tipos de proyecto */
export type Categoria = { nombre: string; tipos: string[] };

/** Fila de pastillas de filtro: w-fit para ajustarse al contenido sin sobrar barra y flex-wrap para que ninguna palabra se corte en los bordes */
function Pastillas({ id, filtros, actual, alElegir, etiqueta }: { id: string; filtros: Filtro[]; actual: string; alElegir: (s: string) => void; etiqueta: string }) {
  return (
    <div className="cristal flex w-fit max-w-full flex-wrap gap-0.5 rounded-[20px] p-1 sm:gap-1 sm:rounded-full" role="tablist" aria-label={etiqueta}>
      {filtros.map((f) => (
        <button
          key={f.slug}
          type="button"
          role="tab"
          aria-selected={actual === f.slug}
          onClick={() => alElegir(f.slug)}
          className={`relative whitespace-nowrap rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors duration-300 sm:px-4 sm:py-2 sm:text-[13px] ${
            actual === f.slug ? "text-white" : "text-[var(--jm-suave)] hover:text-[var(--jm-texto)]"
          }`}
        >
          {actual === f.slug && (
            <motion.span
              layoutId={`jm-filtro-${id}`}
              className="absolute inset-0 rounded-full bg-[var(--jm-acento)] shadow-[0_6px_20px_-6px_rgba(229,9,20,0.7)]"
              transition={{ type: "spring", stiffness: 380, damping: 32, mass: 0.8 }}
            />
          )}
          <span className="relative">
            {f.slug === "direccion-de-fotografia" ? (
              <>
                <span className="sm:hidden">Fotografía</span>
                <span className="hidden sm:inline">{f.nombre}</span>
              </>
            ) : f.nombre === "Todos los tipos" ? (
              <>
                <span className="sm:hidden">Todos</span>
                <span className="hidden sm:inline">{f.nombre}</span>
              </>
            ) : (
              f.nombre
            )}
          </span>
        </button>
      ))}
    </div>
  );
}

/**
 * Todos los trabajos del listado general (las recreaciones tienen su página), con filtro por servicio y por
 * categoría a la vez. `categorias` da las de cada servicio (`todos`: sin servicio elegido), como las quiere
 * Josep (página «trabajos», supabase/datos/08-filtros-trabajos.sql); si falta, una por tipo de proyecto.
 * Solo salen los filtros que tienen algún proyecto.
 */
export function ListadoTrabajos({ proyectos: todos, servicios, categorias }: { proyectos: Proyecto[]; servicios: Servicio[]; categorias: Record<string, Categoria[]> }) {
  const proyectos = todos.filter((p) => p.tipo?.enListadoGeneral !== false);
  const [servicio, setServicio] = useState("todos");
  const [categoria, setCategoria] = useState("todos");

  const deServicio = (p: Proyecto) => servicio === "todos" || p.servicios.some((s) => s.slug === servicio);
  const filtrosServicio = [{ slug: "todos", nombre: "Todos" }, ...servicios.filter((s) => proyectos.some((p) => p.servicios.some((x) => x.slug === s.slug)))];
  const porTipo = [...new Map(proyectos.flatMap((p) => (p.tipo ? [[p.tipo.slug, { nombre: p.tipo.nombre, tipos: [p.tipo.slug] }] as const] : []))).values()];
  const delServicio = (categorias[servicio] ?? categorias.todos ?? porTipo).filter((c) => proyectos.some((p) => deServicio(p) && tiposDe(p).some((t) => c.tipos.includes(t))));
  const elegida = delServicio.find((c) => c.nombre === categoria);
  const filtrosCategoria = [{ slug: "todos", nombre: "Todos los tipos" }, ...delServicio.map((c) => ({ slug: c.nombre, nombre: c.nombre }))];
  const cumple = (p: Proyecto) => deServicio(p) && (!elegida || tiposDe(p).some((t) => elegida.tipos.includes(t)));
  // Dentro de un servicio, el orden que Josep le dio en el panel («Orden por servicio»); en «Todos», el general
  const visibles = servicio === "todos" ? proyectos.filter(cumple) : proyectosDe(proyectos, servicio).filter(cumple);
  // Al cambiar de servicio, la categoría se mantiene solo si ese servicio también la tiene
  const actualCategoria = elegida ? categoria : "todos";
  const elegirServicio = (s: string) => {
    setServicio(s);
    if (s === "todos") return setCategoria("todos");
    const siguen = (categorias[s] ?? categorias.todos ?? porTipo).some((c) => c.nombre === categoria);
    if (!siguen) setCategoria("todos");
  };

  return (
    <>
      <Revelar retraso={0.15} className="mt-5 flex flex-col gap-2 sm:mt-10 sm:gap-3">
        <Pastillas id="servicio" etiqueta="Filtrar por servicio" filtros={filtrosServicio} actual={servicio} alElegir={elegirServicio} />
        {/* Las categorías solo salen dentro de un servicio (en «Todos» eran tantas que saturaban): se despliegan
            hacia abajo con un fundido y, al cambiar de servicio, la fila se cruza con la nueva */}
        <AnimatePresence initial={false} mode="popLayout">
          {servicio !== "todos" && filtrosCategoria.length > 2 && (
            <motion.div
              key={servicio}
              initial={{ opacity: 0, y: -8, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
              transition={{ duration: 0.45, ease: CURVA }}
            >
              <Pastillas id="tipo" etiqueta="Filtrar por tipo" filtros={filtrosCategoria} actual={actualCategoria} alElegir={setCategoria} />
            </motion.div>
          )}
        </AnimatePresence>
      </Revelar>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${servicio}-${actualCategoria}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: CURVA }}
          className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3"
        >
          {visibles.map((p) => (
            <TarjetaProyecto key={p.slug} proyecto={p} />
          ))}
          {visibles.length === 0 && <p className="col-span-full text-[var(--jm-suave)]">No hay trabajos con este filtro.</p>}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
