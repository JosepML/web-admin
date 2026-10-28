"use client";

// Lista genérica del panel para las tablas con borrador y publicado (artículos, servicios, clientes, opiniones,
// canales): buscar, filtrar, ordenar arrastrando, ocultar, duplicar, borrar y crear. Proyectos tiene la suya
// (ListaProyectos), con los destacados de Inicio.

import { AnimatePresence, motion, Reorder, useDragControls } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { cambiarVisible, crear, duplicar, borrar, reordenar } from "@/lib/admin/contenido";
import type { TablaContenido } from "@/lib/admin/tipos";
import type { Medio } from "@/lib/datos/tipos";
import { CURVA } from "@/styles/movimiento";
import { Icono } from "../Iconos";
import { Miniatura } from "./campos/medios";
import { aSlug } from "./campos/tipos";
import { useDialogos } from "./Dialogos";

export type FilaContenido = {
  id: string;
  titulo: string;
  /** Línea gris de debajo (tipo, fecha, contexto...) */
  detalle?: string;
  estado: string;
  nuevo: boolean;
  hayBorrador: boolean;
  /** undefined: la lista no lleva miniaturas */
  miniatura?: Medio | null;
  /** Dirección en la web, si tiene página propia */
  ruta?: string | null;
  /** Id del grupo al que pertenece, si la lista va separada en apartados (ver `grupos`) */
  grupo?: string;
};

/** Apartado de una lista separada (por ejemplo, clientes míos y clientes de JUNO) */
export type GrupoLista = { id: string; nombre: string; ayuda?: string };

type Filtro = "todos" | "web" | "ocultos" | "cambios";
const FILTROS: { id: Filtro; nombre: string }[] = [
  { id: "todos", nombre: "Todos" },
  { id: "web", nombre: "En la web" },
  { id: "ocultos", nombre: "Ocultos y nuevos" },
  { id: "cambios", nombre: "Con cambios" },
];

export type ConfigCrear = {
  /** «Nuevo artículo», «Nueva opinión» */
  texto: string;
  ayuda: string;
  /** Campo que se pide (título, nombre, autor...) */
  clave: string;
  etiqueta: string;
  placeholder?: string;
  /** Si la fila tiene dirección propia, el slug sale de lo escrito */
  slug?: { prefijo: string };
  /** Valores fijos de la fila nueva */
  valores?: Record<string, unknown>;
};

type Props = {
  tabla: TablaContenido;
  titulo: string;
  descripcion?: string;
  /** Pestañas encima del título (Clientes · Opiniones · Canales) */
  pestanas?: { href: string; nombre: string }[];
  /** Ruta del panel donde está el formulario de cada fila: `${base}/${id}` */
  base: string;
  filas: FilaContenido[];
  /** Orden arrastrando (los artículos van por fecha) */
  ordenable?: boolean;
  crearCon: ConfigCrear;
  buscarTexto?: string;
  /** Si se pasa, la lista se separa en estos apartados, cada uno con su orden */
  grupos?: GrupoLista[];
};

export function ListaContenido({ tabla, titulo, descripcion, pestanas, base, filas, ordenable: conOrden = true, crearCon, buscarTexto = "Buscar", grupos }: Props) {
  const router = useRouter();
  const buscar = useSearchParams();
  const { confirmar, avisar } = useDialogos();
  const [lista, setLista] = useState(filas);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [creando, setCreando] = useState(buscar.has("nuevo"));
  useEffect(() => setLista(filas), [filas]);

  const visibles = useMemo(() => {
    const q = aSlug(busqueda);
    return lista.filter((p) => {
      if (filtro === "web" && (p.estado !== "publicado" || p.nuevo)) return false;
      if (filtro === "ocultos" && p.estado === "publicado") return false;
      if (filtro === "cambios" && !p.hayBorrador) return false;
      return !q || aSlug(`${p.titulo} ${p.detalle ?? ""}`).includes(q);
    });
  }, [lista, busqueda, filtro]);
  const ordenable = conOrden && filtro === "todos" && !busqueda.trim();

  const resultado = (r: { ok: boolean; error?: string }, ok?: string) => {
    if (!r.ok) avisar(r.error ?? "Algo falló", "error");
    else if (ok) avisar(ok);
    router.refresh();
    return r.ok;
  };

  const guardarOrden = async () => resultado(await reordenar(tabla, lista.map((p) => p.id)));

  const alternarVisible = async (p: FilaContenido) => {
    const mostrar = p.estado !== "publicado";
    if (!mostrar && !(await confirmar({ titulo: `¿Ocultar «${p.titulo || "sin título"}»?`, texto: "Deja de verse en la web al momento. Puedes volver a mostrarlo cuando quieras.", aceptar: "Ocultar" }))) return;
    setLista((l) => l.map((x) => (x.id === p.id ? { ...x, estado: mostrar ? "publicado" : "borrador", nuevo: false, hayBorrador: mostrar && x.nuevo ? false : x.hayBorrador } : x)));
    resultado(await cambiarVisible(tabla, p.id, mostrar), mostrar ? (p.nuevo ? "Publicado" : "Visible en la web") : "Oculto");
  };

  const alDuplicar = async (p: FilaContenido) => {
    const r = await duplicar(tabla, p.id);
    if (resultado(r, "Copia creada, sin publicar") && r.ok) router.push(`${base}/${r.datos.id}`);
  };

  const alBorrar = async (p: FilaContenido) => {
    if (!(await confirmar({ titulo: `¿Borrar «${p.titulo || "sin título"}» para siempre?`, texto: "Se borra con su historial. Las imágenes siguen en la biblioteca.", aceptar: "Borrar", peligro: true }))) return;
    if (resultado(await borrar(tabla, p.id), "Borrado")) setLista((l) => l.filter((x) => x.id !== p.id));
  };

  return (
    <div className="mx-auto max-w-5xl">
      {pestanas && <Pestanas pestanas={pestanas} />}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-[-0.04em]">{titulo}</h1>
          <p className="mt-1 text-sm text-[var(--jm-suave)]">
            {descripcion ? `${descripcion} · ` : ""}
            {lista.filter((p) => p.estado === "publicado").length} en la web · {lista.length} en total
          </p>
        </div>
        <button type="button" onClick={() => setCreando(true)} className="boton boton-acento px-5 py-3 text-sm">
          <Icono nombre="mas" className="h-4 w-4" />
          {crearCon.texto}
        </button>
      </div>

      {lista.length > 4 && (
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <label className="relative min-w-[220px] flex-1">
            <Icono nombre="buscar" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--jm-tenue)]" />
            <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder={buscarTexto} className="campo !rounded-full !pl-11" />
          </label>
          <div className="flex flex-wrap gap-1 rounded-full bg-black/25 p-1">
            {FILTROS.map((f) => (
              <button key={f.id} type="button" onClick={() => setFiltro(f.id)} className={`relative rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${filtro === f.id ? "text-[var(--jm-texto)]" : "text-[var(--jm-tenue)] hover:text-[var(--jm-suave)]"}`}>
                {filtro === f.id && <motion.span layoutId={`filtro-${tabla}`} className="absolute inset-0 rounded-full bg-white/10" transition={{ duration: 0.4, ease: CURVA }} />}
                <span className="relative">{f.nombre}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {conOrden && !ordenable && <p className="mt-3 text-xs text-[var(--jm-tenue)]">Para ordenar arrastrando, quita la búsqueda y el filtro.</p>}
      {conOrden && ordenable && lista.length > 1 && <p className="mt-6 text-xs text-[var(--jm-tenue)]">Arrastra por el asa para cambiar el orden en la web.</p>}

      {grupos ? (
        grupos.map((g) => {
          const delGrupo = visibles.filter((p) => p.grupo === g.id);
          // Reordenar un apartado recoloca solo sus filas, en los huecos que ocupaban en la lista entera
          const alReordenar = (nuevo: FilaContenido[]) =>
            setLista((l) => {
              let i = 0;
              return l.map((x) => (x.grupo === g.id && delGrupo.some((d) => d.id === x.id) ? nuevo[i++] : x));
            });
          return (
            <section key={g.id} className="mt-10 first:mt-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h2 className="text-lg font-bold tracking-tight">
                  {g.nombre} <span className="ml-1 text-sm font-medium text-[var(--jm-tenue)]">{lista.filter((p) => p.grupo === g.id).length}</span>
                </h2>
                {g.ayuda && <p className="text-xs text-[var(--jm-tenue)]">{g.ayuda}</p>}
              </div>
              <Reorder.Group axis="y" values={delGrupo} onReorder={alReordenar} className="mt-3 flex flex-col gap-2">
                {delGrupo.map((p) => (
                  <Fila key={p.id} p={p} base={base} ordenable={ordenable} alSoltar={guardarOrden} alVisible={() => alternarVisible(p)} alDuplicar={() => alDuplicar(p)} alBorrar={() => alBorrar(p)} />
                ))}
              </Reorder.Group>
              {!delGrupo.length && <p className="mt-3 text-sm text-[var(--jm-suave)]">Nada aquí todavía.</p>}
            </section>
          );
        })
      ) : (
        <Reorder.Group axis="y" values={visibles} onReorder={setLista} className="mt-4 flex flex-col gap-2">
          {visibles.map((p) => (
            <Fila key={p.id} p={p} base={base} ordenable={ordenable} alSoltar={guardarOrden} alVisible={() => alternarVisible(p)} alDuplicar={() => alDuplicar(p)} alBorrar={() => alBorrar(p)} />
          ))}
        </Reorder.Group>
      )}
      {!grupos && !visibles.length && <p className="mt-8 text-center text-sm text-[var(--jm-suave)]">{lista.length ? "No hay nada que coincida." : "Todavía no hay nada. Crea el primero."}</p>}

      <AnimatePresence>{creando && <Nuevo tabla={tabla} base={base} config={crearCon} alCerrar={() => setCreando(false)} />}</AnimatePresence>
    </div>
  );
}

/** Pestañas de una sección con varias listas */
export function Pestanas({ pestanas }: { pestanas: { href: string; nombre: string }[] }) {
  const ruta = usePathname();
  return (
    <div className="mb-6 inline-flex flex-wrap gap-1 rounded-full bg-black/25 p-1">
      {pestanas.map((t) => {
        const activa = ruta === t.href || ruta.startsWith(`${t.href}/`);
        return (
          <Link key={t.href} href={t.href} className={`relative rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors ${activa ? "text-[var(--jm-texto)]" : "text-[var(--jm-tenue)] hover:text-[var(--jm-suave)]"}`}>
            {activa && <motion.span layoutId="pestana-panel" className="absolute inset-0 rounded-full bg-white/10" transition={{ duration: 0.4, ease: CURVA }} />}
            <span className="relative">{t.nombre}</span>
          </Link>
        );
      })}
    </div>
  );
}

function Fila({ p, base, ordenable, alSoltar, alVisible, alDuplicar, alBorrar }: { p: FilaContenido; base: string; ordenable: boolean; alSoltar: () => void; alVisible: () => void; alDuplicar: () => void; alBorrar: () => void }) {
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
      <Link href={`${base}/${p.id}`} className={`flex min-w-0 flex-1 items-center gap-3 py-1.5 sm:gap-4 ${ordenable ? "" : "pl-3"}`}>
        {p.miniatura !== undefined && <Miniatura medio={p.miniatura} className={`aspect-video w-16 shrink-0 rounded-[14px] sm:w-28 ${visible ? "" : "opacity-50"}`} />}
        <span className="min-w-0">
          <span className={`line-clamp-2 font-semibold leading-snug ${p.titulo ? "" : "italic text-[var(--jm-tenue)]"}`}>{p.titulo || "Sin título"}</span>
          <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--jm-tenue)]">
            {p.detalle && <span className="line-clamp-1">{p.detalle}</span>}
            {p.nuevo ? <Insignia color="bg-white/15 text-[var(--jm-suave)]">Sin publicar</Insignia> : !visible && <Insignia color="bg-[#ff9f0a]/15 text-[#ffb340]">Oculto</Insignia>}
            {p.hayBorrador && !p.nuevo && (
              <Insignia color="bg-[var(--jm-calido)]/15 text-[var(--jm-calido)]">
                <span className="sm:hidden">Con cambios</span>
                <span className="hidden sm:inline">Cambios sin publicar</span>
              </Insignia>
            )}
          </span>
        </span>
      </Link>
      <div className="-mr-1 flex shrink-0 items-center sm:mr-0">
        <button type="button" onClick={alVisible} className="boton-icono" aria-label={visible ? "Ocultar de la web" : p.nuevo ? "Publicar" : "Mostrar en la web"} title={visible ? "Ocultar de la web" : p.nuevo ? "Publicar" : "Mostrar en la web"}>
          <Icono nombre={visible ? "ojo" : "ojo-no"} className="h-[18px] w-[18px]" />
        </button>
        <MenuFila p={p} alDuplicar={alDuplicar} alBorrar={alBorrar} />
      </div>
    </Reorder.Item>
  );
}

export function Insignia({ color, children }: { color: string; children: React.ReactNode }) {
  return <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${color}`}>{children}</span>;
}

function MenuFila({ p, alDuplicar, alBorrar }: { p: FilaContenido; alDuplicar: () => void; alBorrar: () => void }) {
  const [abierto, setAbierto] = useState(false);
  useEffect(() => {
    if (!abierto) return;
    const cerrar = () => setAbierto(false);
    window.addEventListener("click", cerrar);
    return () => window.removeEventListener("click", cerrar);
  }, [abierto]);
  const opcion = "flex items-center gap-2.5 rounded-[14px] px-3 py-2 text-left hover:bg-white/[0.07]";
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
            {p.ruta && !p.nuevo && p.estado === "publicado" && (
              <a href={p.ruta} target="_blank" rel="noreferrer" className={opcion}>
                <Icono nombre="externo" className="h-4 w-4" />
                Ver en la web
              </a>
            )}
            {p.ruta && (
              <a href={`/admin/vista-previa?ruta=${encodeURIComponent(p.ruta)}`} target="_blank" rel="noreferrer" className={opcion}>
                <Icono nombre="ojo" className="h-4 w-4" />
                Vista previa
              </a>
            )}
            <button type="button" onClick={alDuplicar} className={opcion}>
              <Icono nombre="duplicar" className="h-4 w-4" />
              Duplicar
            </button>
            {p.estado !== "publicado" && (
              <button type="button" onClick={alBorrar} className={`${opcion} text-[#ff6b6b]`}>
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

function Nuevo({ tabla, base, config, alCerrar }: { tabla: TablaContenido; base: string; config: ConfigCrear; alCerrar: () => void }) {
  const router = useRouter();
  const { avisar } = useDialogos();
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const slug = aSlug(texto);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!texto.trim() || (config.slug && !slug)) return;
    setEnviando(true);
    const r = await crear(tabla, { ...config.valores, [config.clave]: texto.trim(), ...(config.slug ? { slug } : {}) });
    if (r.ok) router.push(`${base}/${r.datos.id}`);
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
        <h2 className="text-xl font-extrabold tracking-tight">{config.texto}</h2>
        <p className="mt-1 text-sm text-[var(--jm-suave)]">{config.ayuda}</p>
        <label className="mt-6 block">
          <span className="campo-etiqueta">{config.etiqueta}</span>
          <input autoFocus className="campo mt-1.5" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder={config.placeholder} />
        </label>
        {config.slug && slug && (
          <p className="mt-2 px-1 text-xs text-[var(--jm-tenue)]">
            Dirección: {config.slug.prefijo}
            {slug}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={alCerrar} className="boton boton-suave px-5 py-2.5 text-sm">
            Cancelar
          </button>
          <button type="submit" disabled={!texto.trim() || enviando} className="boton boton-acento px-5 py-2.5 text-sm disabled:opacity-40">
            {enviando ? "Creando…" : "Crear y editar"}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}
