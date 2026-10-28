"use client";

import { AnimatePresence, motion, Reorder, useDragControls } from "motion/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { cambiarAlInstante, cambiarVisible, crear, duplicar, borrar, reordenar, ordenarPorServicio } from "@/lib/admin/contenido";
import type { Medio } from "@/lib/datos/tipos";
import { RUTAS } from "@/lib/rutas";
import { CURVA } from "@/styles/movimiento";
import { Icono } from "../../Iconos";
import { Miniatura } from "../campos/medios";
import { aSlug } from "../campos/tipos";
import { useDialogos } from "../Dialogos";

export type FilaProyecto = {
  id: string;
  titulo: string;
  slug: string;
  anio: number | null;
  tipo: string;
  estado: string;
  nuevo: boolean;
  hayBorrador: boolean;
  /** Posición en Inicio (1, 2, 3...) o null */
  destacado: number | null;
  poster: Medio | null;
};

type Filtro = "todos" | "web" | "ocultos" | "cambios";
const FILTROS: { id: Filtro; nombre: string }[] = [
  { id: "todos", nombre: "Todos" },
  { id: "web", nombre: "En la web" },
  { id: "ocultos", nombre: "Ocultos y nuevos" },
  { id: "cambios", nombre: "Con cambios" },
];

/** Máximo de destacados en Inicio: los que caben en el carrusel de Selección sin que se haga largo */
const MAX_DESTACADOS = 12;

export type OrdenServicio = { id: string; nombre: string; proyectos: string[] };

export function ListaProyectos({ inicial, porServicio }: { inicial: FilaProyecto[]; porServicio: OrdenServicio[] }) {
  const router = useRouter();
  const buscar = useSearchParams();
  const { confirmar, avisar } = useDialogos();
  const [lista, setLista] = useState(inicial);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [creando, setCreando] = useState(buscar.has("nuevo"));
  useEffect(() => setLista(inicial), [inicial]);

  const visibles = useMemo(() => {
    const q = aSlug(busqueda);
    return lista.filter((p) => {
      if (filtro === "web" && (p.estado !== "publicado" || p.nuevo)) return false;
      if (filtro === "ocultos" && p.estado === "publicado") return false;
      if (filtro === "cambios" && !p.hayBorrador) return false;
      return !q || aSlug(`${p.titulo} ${p.tipo} ${p.anio ?? ""}`).includes(q);
    });
  }, [lista, busqueda, filtro]);
  // Ordenar arrastrando solo con la lista entera a la vista (con filtros, el orden sería ambiguo)
  const tira = useRef<HTMLUListElement>(null);
  const desplazar = (dx: number) => tira.current?.scrollBy({ left: dx, behavior: "smooth" });
  const ordenable = filtro === "todos" && !busqueda.trim();
  const destacados = lista.filter((p) => p.destacado !== null).sort((a, b) => a.destacado! - b.destacado!);

  const resultado = (r: { ok: boolean; error?: string }, ok?: string) => {
    if (!r.ok) avisar(r.error ?? "Algo falló", "error");
    else if (ok) avisar(ok);
    router.refresh();
    return r.ok;
  };

  const alReordenar = async (nueva: FilaProyecto[]) => {
    setLista(nueva);
  };
  const guardarOrden = async () => resultado(await reordenar("proyectos", lista.map((p) => p.id)));

  const alternarDestacado = async (p: FilaProyecto) => {
    let cambios: { id: string; campo: string; valor: unknown }[];
    if (p.destacado !== null) {
      // Al quitar uno, los siguientes suben un puesto
      const resto = destacados.filter((d) => d.id !== p.id);
      cambios = [{ id: p.id, campo: "destacado_orden", valor: null }, ...resto.map((d, i) => ({ id: d.id, campo: "destacado_orden", valor: i + 1 }))];
    } else {
      if (destacados.length >= MAX_DESTACADOS) return avisar(`Ya hay ${MAX_DESTACADOS} en Inicio: quita uno antes.`, "error");
      cambios = [{ id: p.id, campo: "destacado_orden", valor: destacados.length + 1 }];
    }
    setLista((l) => l.map((x) => ({ ...x, destacado: (cambios.find((c) => c.id === x.id)?.valor as number | null | undefined) ?? (cambios.some((c) => c.id === x.id) ? null : x.destacado) })));
    resultado(await cambiarAlInstante("proyectos", cambios), p.destacado !== null ? "Quitado de Inicio" : "Destacado en Inicio");
  };

  const ordenarDestacados = async (nuevos: FilaProyecto[]) => {
    const cambios = nuevos.map((d, i) => ({ id: d.id, campo: "destacado_orden", valor: i + 1 }));
    setLista((l) => l.map((x) => ({ ...x, destacado: (cambios.find((c) => c.id === x.id)?.valor as number | undefined) ?? x.destacado })));
    return cambios;
  };

  const alternarVisible = async (p: FilaProyecto) => {
    const mostrar = p.estado !== "publicado";
    if (!mostrar && !(await confirmar({ titulo: `¿Ocultar «${p.titulo}»?`, texto: "Deja de verse en la web al momento. Puedes volver a mostrarlo cuando quieras.", aceptar: "Ocultar" }))) return;
    setLista((l) => l.map((x) => (x.id === p.id ? { ...x, estado: mostrar ? "publicado" : "borrador", nuevo: false, hayBorrador: mostrar && x.nuevo ? false : x.hayBorrador } : x)));
    resultado(await cambiarVisible("proyectos", p.id, mostrar), mostrar ? (p.nuevo ? "Publicado" : "Visible en la web") : "Oculto");
  };

  const alDuplicar = async (p: FilaProyecto) => {
    const r = await duplicar("proyectos", p.id);
    if (resultado(r, "Copia creada, sin publicar") && r.ok) router.push(`/admin/proyectos/${r.datos.id}`);
  };

  const alBorrar = async (p: FilaProyecto) => {
    if (!(await confirmar({ titulo: `¿Borrar «${p.titulo}» para siempre?`, texto: "Se borra con su historial. Las fotos siguen en la biblioteca.", aceptar: "Borrar", peligro: true }))) return;
    if (resultado(await borrar("proyectos", p.id), "Borrado")) setLista((l) => l.filter((x) => x.id !== p.id));
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-[-0.04em]">Proyectos</h1>
          <p className="mt-1 text-sm text-[var(--jm-suave)]">
            {lista.filter((p) => p.estado === "publicado").length} en la web · {lista.length} en total
          </p>
        </div>
        <button type="button" onClick={() => setCreando(true)} className="boton boton-acento px-5 py-3 text-sm">
          <Icono nombre="mas" className="h-4 w-4" />
          Nuevo proyecto
        </button>
      </div>

      {/* Destacados en Inicio */}
      <section className="cristal mt-8 rounded-[28px] p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <Icono nombre="estrella-llena" className="h-4 w-4 text-[var(--jm-laurel)]" />
            En Inicio ({destacados.length}/{MAX_DESTACADOS})
          </h2>
          <span className="text-xs text-[var(--jm-tenue)]">Arrastra para cambiar el orden del carrusel</span>
        </div>
        {destacados.length ? (
          <div className="relative mt-4">
          <button type="button" onClick={() => desplazar(-360)} className="boton-icono absolute -left-3 top-1/2 z-10 -translate-y-1/2 bg-black/70" aria-label="Ver los anteriores">‹</button>
          <button type="button" onClick={() => desplazar(360)} className="boton-icono absolute -right-3 top-1/2 z-10 -translate-y-1/2 bg-black/70" aria-label="Ver los siguientes">›</button>
          <Reorder.Group
            ref={tira}
            axis="x"
            values={destacados}
            onReorder={(n) => void ordenarDestacados(n)}
            onWheel={(e) => {
              if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) tira.current?.scrollBy({ left: e.deltaY });
            }}
            className="sin-barra flex gap-2 overflow-x-auto pb-1"
          >
            {destacados.map((p) => (
              <Reorder.Item
                key={p.id}
                value={p}
                onDragEnd={async () => {
                  const actuales = lista.filter((x) => x.destacado !== null).sort((a, b) => a.destacado! - b.destacado!);
                  resultado(await cambiarAlInstante("proyectos", actuales.map((d, i) => ({ id: d.id, campo: "destacado_orden", valor: i + 1 }))));
                }}
                className="relative w-36 shrink-0 cursor-grab select-none overflow-hidden rounded-[18px] active:cursor-grabbing"
                whileDrag={{ scale: 1.05 }}
              >
                <Miniatura medio={p.poster} className="pointer-events-none aspect-video w-full" />
                <span className="absolute left-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-[10px] font-bold text-white">{p.destacado}</span>
                <span className="block truncate bg-black/40 px-2 py-1.5 text-xs font-semibold">{p.titulo}</span>
                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => void alternarDestacado(p)}
                  className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-[11px] font-bold text-white hover:bg-[#e50914]"
                  aria-label={`Quitar «${p.titulo}» de Inicio`}
                  title="Quitar de Inicio"
                >
                  ×
                </button>
              </Reorder.Item>
            ))}
          </Reorder.Group>
          </div>
        ) : (
          <p className="mt-3 text-sm text-[var(--jm-suave)]">Marca proyectos con la estrella para que salgan en Inicio.</p>
        )}
        <label className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[var(--jm-tenue)]">
          Añadir a la selección
          <select
            value=""
            onChange={(e) => {
              const p = lista.find((x) => x.id === e.target.value);
              if (p) void alternarDestacado(p);
            }}
            className="campo !w-auto !rounded-full !py-1.5 text-[13px]"
          >
            <option value="">Elige un trabajo…</option>
            {lista
              .filter((x) => x.destacado === null)
              .map((x) => (
                <option key={x.id} value={x.id}>
                  {x.titulo}
                  {x.estado !== "publicado" ? " (no visible en la web)" : ""}
                </option>
              ))}
          </select>
        </label>
      </section>

      <OrdenPorServicio servicios={porServicio} lista={lista} alGuardar={ordenarPorServicio} alResultado={resultado} />

      {/* Buscar y filtrar */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <label className="relative min-w-[220px] flex-1">
          <Icono nombre="buscar" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--jm-tenue)]" />
          <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por título, tipo o año" className="campo !rounded-full !pl-11" />
        </label>
        <div className="flex flex-wrap gap-1 rounded-full bg-black/25 p-1">
          {FILTROS.map((f) => (
            <button key={f.id} type="button" onClick={() => setFiltro(f.id)} className={`relative rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${filtro === f.id ? "text-[var(--jm-texto)]" : "text-[var(--jm-tenue)] hover:text-[var(--jm-suave)]"}`}>
              {filtro === f.id && <motion.span layoutId="filtro-proyectos" className="absolute inset-0 rounded-full bg-white/10" transition={{ duration: 0.4, ease: CURVA }} />}
              <span className="relative">{f.nombre}</span>
            </button>
          ))}
        </div>
      </div>
      {!ordenable && <p className="mt-3 text-xs text-[var(--jm-tenue)]">Para ordenar arrastrando, quita la búsqueda y el filtro.</p>}

      <Reorder.Group axis="y" values={visibles} onReorder={alReordenar} className="mt-4 flex flex-col gap-2">
        {visibles.map((p) => (
          <FilaLista
            key={p.id}
            p={p}
            ordenable={ordenable}
            alSoltar={guardarOrden}
            alDestacar={() => alternarDestacado(p)}
            alVisible={() => alternarVisible(p)}
            alDuplicar={() => alDuplicar(p)}
            alBorrar={() => alBorrar(p)}
          />
        ))}
      </Reorder.Group>
      {!visibles.length && <p className="mt-8 text-center text-sm text-[var(--jm-suave)]">No hay proyectos que coincidan.</p>}

      <AnimatePresence>{creando && <NuevoProyecto alCerrar={() => setCreando(false)} />}</AnimatePresence>
    </div>
  );
}

function FilaLista({
  p,
  ordenable,
  alSoltar,
  alDestacar,
  alVisible,
  alDuplicar,
  alBorrar,
}: {
  p: FilaProyecto;
  ordenable: boolean;
  alSoltar: () => void;
  alDestacar: () => void;
  alVisible: () => void;
  alDuplicar: () => void;
  alBorrar: () => void;
}) {
  const controles = useDragControls();
  const visible = p.estado === "publicado";
  return (
    <Reorder.Item
      value={p}
      dragListener={false}
      dragControls={controles}
      onDragEnd={alSoltar}
      className="cristal group flex items-center gap-3 rounded-[24px] p-2 pr-3"
      whileDrag={{ scale: 1.02, boxShadow: "0 24px 50px -16px rgba(0,0,0,0.6)", zIndex: 10 }}
    >
      {ordenable && (
        <button type="button" onPointerDown={(e) => controles.start(e)} className="flex h-10 w-6 shrink-0 cursor-grab touch-none items-center justify-center text-[var(--jm-tenue)] active:cursor-grabbing" aria-label="Arrastrar para ordenar">
          <Icono nombre="asa" className="h-4 w-4" />
        </button>
      )}
      <Link href={`/admin/proyectos/${p.id}`} className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
        <Miniatura medio={p.poster} className={`aspect-video w-16 shrink-0 rounded-[14px] sm:w-32 ${visible ? "" : "opacity-50"}`} />
        <span className="min-w-0">
          <span className="line-clamp-2 font-semibold leading-snug">{p.titulo || "Sin título"}</span>
          <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--jm-tenue)]">
            {[p.tipo, p.anio].filter(Boolean).join(" · ")}
            {p.nuevo ? <Insignia color="bg-white/15 text-[var(--jm-suave)]">Sin publicar</Insignia> : !visible && <Insignia color="bg-[#ff9f0a]/15 text-[#ffb340]">Oculto</Insignia>}
            {p.hayBorrador && !p.nuevo && <Insignia color="bg-[var(--jm-calido)]/15 text-[var(--jm-calido)]"><span className="sm:hidden">Con cambios</span><span className="hidden sm:inline">Cambios sin publicar</span></Insignia>}
          </span>
        </span>
      </Link>
      <div className="-mr-1 flex shrink-0 items-center sm:mr-0">
        <button type="button" onClick={alDestacar} className={`boton-icono ${p.destacado !== null ? "!text-[var(--jm-laurel)]" : ""}`} aria-label={p.destacado !== null ? "Quitar de Inicio" : "Destacar en Inicio"} title={p.destacado !== null ? `En Inicio (${p.destacado}º). Clic para quitarlo` : "Destacar en Inicio"}>
          <Icono nombre={p.destacado !== null ? "estrella-llena" : "estrella"} className="h-[18px] w-[18px]" />
        </button>
        <button type="button" onClick={alVisible} className="boton-icono" aria-label={visible ? "Ocultar de la web" : p.nuevo ? "Publicar" : "Mostrar en la web"} title={visible ? "Ocultar de la web" : p.nuevo ? "Publicar" : "Mostrar en la web"}>
          <Icono nombre={visible ? "ojo" : "ojo-no"} className="h-[18px] w-[18px]" />
        </button>
        <Menu p={p} alDuplicar={alDuplicar} alBorrar={alBorrar} />
      </div>
    </Reorder.Item>
  );
}

function Insignia({ color, children }: { color: string; children: React.ReactNode }) {
  return <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${color}`}>{children}</span>;
}

function Menu({ p, alDuplicar, alBorrar }: { p: FilaProyecto; alDuplicar: () => void; alBorrar: () => void }) {
  const [abierto, setAbierto] = useState(false);
  useEffect(() => {
    if (!abierto) return;
    const cerrar = () => setAbierto(false);
    window.addEventListener("click", cerrar);
    return () => window.removeEventListener("click", cerrar);
  }, [abierto]);
  return (
    <div className="relative">
      <button
        type="button"
        className="boton-icono"
        aria-label="Más acciones"
        aria-expanded={abierto}
        onClick={(e) => {
          e.stopPropagation();
          setAbierto((v) => !v);
        }}
      >
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden>
          <circle cx="5" cy="12" r="1.6" />
          <circle cx="12" cy="12" r="1.6" />
          <circle cx="19" cy="12" r="1.6" />
        </svg>
      </button>
      <AnimatePresence>
        {abierto && (
          <motion.div
            className="cristal cristal-fuerte absolute right-0 top-11 z-40 flex w-52 flex-col rounded-[20px] p-1.5 text-sm"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.25, ease: CURVA }}
          >
            {!p.nuevo && p.estado === "publicado" && (
              <a href={RUTAS.proyecto(p.slug)} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 rounded-[14px] px-3 py-2 hover:bg-white/[0.07]">
                <Icono nombre="externo" className="h-4 w-4" />
                Ver en la web
              </a>
            )}
            <a href={`/admin/vista-previa?ruta=${encodeURIComponent(RUTAS.proyecto(p.slug))}`} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 rounded-[14px] px-3 py-2 hover:bg-white/[0.07]">
              <Icono nombre="ojo" className="h-4 w-4" />
              Vista previa
            </a>
            <button type="button" onClick={alDuplicar} className="flex items-center gap-2.5 rounded-[14px] px-3 py-2 text-left hover:bg-white/[0.07]">
              <Icono nombre="duplicar" className="h-4 w-4" />
              Duplicar
            </button>
            {p.estado !== "publicado" && (
              <button type="button" onClick={alBorrar} className="flex items-center gap-2.5 rounded-[14px] px-3 py-2 text-left text-[#ff6b6b] hover:bg-white/[0.07]">
                <Icono nombre="papelera" className="h-4 w-4" />
                Borrar
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NuevoProyecto({ alCerrar }: { alCerrar: () => void }) {
  const router = useRouter();
  const { avisar } = useDialogos();
  const [titulo, setTitulo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const slug = aSlug(titulo);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug) return;
    setEnviando(true);
    const r = await crear("proyectos", { titulo: titulo.trim(), slug });
    if (r.ok) router.push(`/admin/proyectos/${r.datos.id}`);
    else {
      avisar(r.error, "error");
      setEnviando(false);
    }
  };

  return (
    <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={alCerrar}>
      <motion.form
        onSubmit={enviar}
        onClick={(e) => e.stopPropagation()}
        className="cristal cristal-fuerte w-full max-w-md rounded-[32px] p-7"
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.97, opacity: 0 }}
        transition={{ duration: 0.4, ease: CURVA }}
      >
        <h2 className="text-xl font-extrabold tracking-tight">Nuevo proyecto</h2>
        <p className="mt-1 text-sm text-[var(--jm-suave)]">Empieza por el título. Lo demás lo rellenas después; no se ve en la web hasta que lo publiques.</p>
        <label className="mt-6 block">
          <span className="campo-etiqueta">Título</span>
          <input autoFocus className="campo mt-1.5" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Sin Tiempo" />
        </label>
        {slug && <p className="mt-2 px-1 text-xs text-[var(--jm-tenue)]">Dirección: /trabajos/{slug}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={alCerrar} className="boton boton-suave px-5 py-2.5 text-sm">
            Cancelar
          </button>
          <button type="submit" disabled={!slug || enviando} className="boton boton-acento px-5 py-2.5 text-sm disabled:opacity-40">
            {enviando ? "Creando…" : "Crear y editar"}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}

/**
 * Orden de los proyectos dentro de cada servicio: es el que ven las páginas de Filmmaker, Dirección de fotografía y
 * Edición y sus filtros en Trabajos. Un servicio a la vez; se arrastra y se guarda al soltar.
 */
function OrdenPorServicio({
  servicios,
  lista,
  alGuardar,
  alResultado,
}: {
  servicios: OrdenServicio[];
  lista: FilaProyecto[];
  alGuardar: (servicioId: string, ids: string[]) => Promise<{ ok: boolean; error?: string }>;
  alResultado: (r: { ok: boolean; error?: string }, ok?: string) => boolean;
}) {
  const [abierto, setAbierto] = useState(false);
  const [actual, setActual] = useState(servicios[0]?.id ?? "");
  const [ordenes, setOrdenes] = useState(() => Object.fromEntries(servicios.map((s) => [s.id, s.proyectos])));
  useEffect(() => setOrdenes(Object.fromEntries(servicios.map((s) => [s.id, s.proyectos]))), [servicios]);
  const servicio = servicios.find((s) => s.id === actual);
  const filas = (ordenes[actual] ?? []).flatMap((id) => lista.find((p) => p.id === id) ?? []);
  if (!servicios.length) return null;

  return (
    <section className="cristal mt-6 rounded-[28px] p-5">
      <button type="button" onClick={() => setAbierto((a) => !a)} className="flex w-full items-center justify-between gap-3 text-left" aria-expanded={abierto}>
        <h2 className="text-sm font-bold">Orden por servicio</h2>
        <span className="text-xs text-[var(--jm-tenue)]">{abierto ? "Cerrar" : "Un orden propio para Filmmaker, Dirección de fotografía y Edición"}</span>
      </button>
      <AnimatePresence initial={false}>
        {abierto && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: CURVA }} className="overflow-hidden">
            <div className="mt-4 flex flex-wrap gap-1 rounded-full bg-black/25 p-1 w-fit max-w-full">
              {servicios.map((s) => (
                <button key={s.id} type="button" onClick={() => setActual(s.id)} className={`relative rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${actual === s.id ? "text-[var(--jm-texto)]" : "text-[var(--jm-tenue)] hover:text-[var(--jm-suave)]"}`}>
                  {actual === s.id && <motion.span layoutId="orden-servicio" className="absolute inset-0 rounded-full bg-white/10" transition={{ duration: 0.4, ease: CURVA }} />}
                  <span className="relative">{s.nombre}</span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-[var(--jm-tenue)]">
              Arrastra para ordenar «{servicio?.nombre}»: el primero es el primero que se ve en su página y en su filtro de Trabajos. Los ocultos y sin publicar también cuentan, para que ya estén en su sitio al publicarlos.
            </p>
            <Reorder.Group axis="y" values={filas} onReorder={(n) => setOrdenes((o) => ({ ...o, [actual]: n.map((p) => p.id) }))} className="mt-3 flex flex-col gap-1.5">
              {filas.map((p, i) => (
                <FilaServicio key={p.id} p={p} puesto={i + 1} alSoltar={async () => alResultado(await alGuardar(actual, ordenes[actual] ?? []), "Orden guardado")} />
              ))}
            </Reorder.Group>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function FilaServicio({ p, puesto, alSoltar }: { p: FilaProyecto; puesto: number; alSoltar: () => void }) {
  const controles = useDragControls();
  const visible = p.estado === "publicado";
  return (
    <Reorder.Item value={p} dragListener={false} dragControls={controles} onDragEnd={alSoltar} className="flex items-center gap-3 rounded-[18px] bg-black/20 p-1.5 pr-3" whileDrag={{ scale: 1.02, boxShadow: "0 18px 40px -16px rgba(0,0,0,0.6)", zIndex: 10 }}>
      <button type="button" onPointerDown={(e) => controles.start(e)} className="flex h-9 w-6 shrink-0 cursor-grab touch-none items-center justify-center text-[var(--jm-tenue)] active:cursor-grabbing" aria-label="Arrastrar para ordenar">
        <Icono nombre="asa" className="h-4 w-4" />
      </button>
      <span className="w-5 shrink-0 text-center text-xs font-bold text-[var(--jm-tenue)]">{puesto}</span>
      <Miniatura medio={p.poster} className={`pointer-events-none aspect-video w-16 shrink-0 rounded-[10px] ${visible ? "" : "opacity-50"}`} />
      <span className="min-w-0 flex-1 truncate text-sm font-semibold">{p.titulo || "Sin título"}</span>
      {p.nuevo ? <Insignia color="bg-white/15 text-[var(--jm-suave)]">Sin publicar</Insignia> : !visible && <Insignia color="bg-[#ff9f0a]/15 text-[#ffb340]">Oculto</Insignia>}
    </Reorder.Item>
  );
}
