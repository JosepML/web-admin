"use client";

// Biblioteca de medios: todo lo subido (fotos, vídeos y pdf), con su texto alternativo, dónde se usa cada
// archivo y la opción de borrar lo que no se usa. Se sube con el botón o soltando archivos en cualquier sitio.

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { img } from "@/components/comun/imagen";
import { Icono } from "@/components/Iconos";
import { borrarCarpeta, borrarMedio, cambiarMedio, crearCarpeta, moverMedios, renombrarCarpeta, type Carpeta, type MedioBiblioteca, type Uso } from "@/lib/admin/medios";
import { ACEPTA } from "@/lib/admin/subir";
import { CURVA } from "@/styles/movimiento";
import { Miniatura, ProveedorMedios, useSoltarArchivos } from "../campos/medios";
import { aSlug } from "../campos/tipos";
import { useDialogos } from "../Dialogos";
import { Insignia } from "../ListaContenido";
import { PuntoDeInteres } from "./PuntoDeInteres";
import { Recortador } from "./Recortador";

type Filtro = "todo" | "imagen" | "video" | "sin-usar" | "sin-alt";
const FILTROS: { id: Filtro; nombre: string }[] = [
  { id: "todo", nombre: "Todo" },
  { id: "imagen", nombre: "Fotos" },
  { id: "video", nombre: "Vídeos" },
  { id: "sin-usar", nombre: "Sin usar" },
  { id: "sin-alt", nombre: "Sin descripción" },
];

/** Nombre que se enseña: el título, o el del archivo si no tiene (lo que se cargó de la web antigua) */
const nombre = (m: MedioBiblioteca) => m.titulo || decodeURIComponent(m.url.split("?")[0].split("/").pop() ?? "").replace(/^[0-9a-f]{8}-/, "") || "Sin nombre";
const tamano = (b: number | null) => (b == null ? "" : b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);
const fecha = (iso: string) => new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
const porNombre = (a: Carpeta, b: Carpeta) => a.nombre.localeCompare(b.nombre, "es");
/** Tipo de arrastre de las fotos: lleva los ids de las que se mueven a una carpeta */
const MIME_MEDIO = "application/x-jm-medios";

export function Biblioteca(props: { medios: MedioBiblioteca[]; usos: Record<string, Uso[]>; carpetas: Carpeta[] }) {
  return (
    <ProveedorMedios>
      <Contenido {...props} />
    </ProveedorMedios>
  );
}

function Contenido({ medios: iniciales, usos, carpetas: carpetasIniciales }: { medios: MedioBiblioteca[]; usos: Record<string, Uso[]>; carpetas: Carpeta[] }) {
  const router = useRouter();
  const { avisar, confirmar } = useDialogos();
  const [medios, setMedios] = useState(iniciales);
  const [carpetas, setCarpetas] = useState(carpetasIniciales);
  // "todas", "sin" (archivos sin carpeta) o el id de una carpeta
  const [carpeta, setCarpeta] = useState<string>("todas");
  const [creando, setCreando] = useState(false);
  // Buscador de la columna de carpetas: filtra la lista por nombre mientras se escribe
  const [buscarCarpeta, setBuscarCarpeta] = useState("");
  const [nueva, setNueva] = useState("");
  // Fotos marcadas para moverlas de una vez (también se arrastran juntas)
  const [seleccion, setSeleccion] = useState<string[]>([]);
  const [filtro, setFiltro] = useState<Filtro>("todo");
  const [busqueda, setBusqueda] = useState("");
  const [abierto, setAbierto] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => setMedios(iniciales), [iniciales]);
  useEffect(() => setCarpetas(carpetasIniciales), [carpetasIniciales]);

  const carpetaElegida = carpetas.find((c) => c.id === carpeta) ?? null;
  // En la raíz (sin búsqueda) la zona de fotos muestra las carpetas como tarjetas; al entrar, solo sus fotos
  const enRaiz = carpeta === "todas" && !busqueda.trim();
  const sinCarpeta = medios.filter((m) => !m.carpetaId).length;

  const { encima, subiendo, error, setError, subir, manejadores, fotoElegida } = useSoltarArchivos(
    (nuevos) => {
      // Lo que se sube entra en la carpeta que está abierta (si hay una)
      const destino = carpetaElegida?.id ?? null;
      if (destino) moverMedios(nuevos.map((m) => m.id), destino);
      setMedios((m) => [...nuevos.map((x) => ({ ...x, carpetaId: destino })), ...m]);
      router.refresh();
    },
    { multiple: true, elegirFoco: true },
  );

  const usosDe = (id: string) => usos[id.toLowerCase()] ?? [];
  const visibles = useMemo(() => {
    const q = aSlug(busqueda);
    return medios.filter((m) => {
      if (carpeta === "sin" && m.carpetaId) return false;
      if (carpetaElegida && m.carpetaId !== carpetaElegida.id) return false;
      if (filtro === "imagen" && m.tipo !== "imagen") return false;
      if (filtro === "video" && m.tipo !== "video") return false;
      if (filtro === "sin-usar" && usosDe(m.id).length) return false;
      if (filtro === "sin-alt" && (m.tipo !== "imagen" || m.alt.trim())) return false;
      // La búsqueda también mira el nombre de la carpeta: «nosferatu» trae todas las fotos de esa carpeta
      const de = carpetas.find((c) => c.id === m.carpetaId)?.nombre ?? "";
      return !q || aSlug(`${nombre(m)} ${m.alt} ${de}`).includes(q);
    });
  }, [medios, filtro, busqueda, usos, carpeta, carpetaElegida, carpetas]); // eslint-disable-line react-hooks/exhaustive-deps

  const elegido = medios.find((m) => m.id === abierto) ?? null;

  const crear = async () => {
    const r = await crearCarpeta(nueva);
    if (!r.ok) return avisar(r.error, "error");
    setCarpetas((l) => [...l, r.datos].sort(porNombre));
    setCarpeta(r.datos.id);
    setNueva("");
    setCreando(false);
  };

  const renombrar = async (c: Carpeta, valor: string) => {
    const n = valor.trim();
    if (!n || n === c.nombre) return;
    const r = await renombrarCarpeta(c.id, n);
    if (!r.ok) return avisar(r.error, "error");
    setCarpetas((l) => l.map((x) => (x.id === c.id ? { ...x, nombre: n } : x)).sort(porNombre));
  };

  const borrar = async (c: Carpeta) => {
    if (!(await confirmar({ titulo: `¿Borrar la carpeta «${c.nombre}»?`, texto: "Sus archivos no se borran: quedan en «Sin carpeta».", aceptar: "Borrar", peligro: true }))) return;
    const r = await borrarCarpeta(c.id);
    if (!r.ok) return avisar(r.error, "error");
    setCarpetas((l) => l.filter((x) => x.id !== c.id));
    setMedios((l) => l.map((x) => (x.carpetaId === c.id ? { ...x, carpetaId: null } : x)));
    setCarpeta("todas");
  };

  const mover = async (ids: string[], carpetaId: string | null) => {
    const r = await moverMedios(ids, carpetaId);
    if (!r.ok) return avisar(r.error, "error");
    setMedios((l) => l.map((x) => (ids.includes(x.id) ? { ...x, carpetaId } : x)));
    setSeleccion([]);
  };

  const alternar = (id: string) => setSeleccion((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]));

  // Al arrastrar una foto marcada se mueven todas las marcadas; si no, solo la que se arrastra
  const arrastrar = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData(MIME_MEDIO, JSON.stringify(seleccion.includes(id) ? seleccion : [id]));
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="relative mx-auto max-w-6xl" {...manejadores}>
      {fotoElegida}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-[-0.04em]">Biblioteca</h1>
          <p className="mt-1 text-sm text-[var(--jm-suave)]">
            {medios.length} archivos · {medios.filter((m) => !usosDe(m.id).length).length} sin usar
          </p>
        </div>
        <button type="button" onClick={() => input.current?.click()} className="boton boton-acento px-5 py-3 text-sm">
          <Icono nombre="subir" className="h-4 w-4" />
          Subir archivos
        </button>
        <input
          ref={input}
          type="file"
          accept={ACEPTA}
          multiple
          hidden
          onChange={(e) => {
            subir([...(e.target.files ?? [])]);
            e.target.value = "";
          }}
        />
      </div>
      <p className="mt-2 text-xs text-[var(--jm-tenue)]">También puedes soltar fotos, vídeos mp4 o pdf en cualquier parte de esta página. Hasta 50 MB por archivo.</p>

      {(subiendo > 0 || error) && (
        <div className={`mt-4 flex items-center justify-between gap-3 rounded-[18px] px-4 py-3 text-sm ${error ? "bg-[#ff453a]/15 text-[#ff8a80]" : "bg-white/[0.06] text-[var(--jm-suave)]"}`}>
          <span>{error ?? `Subiendo ${subiendo} archivo${subiendo === 1 ? "" : "s"}…`}</span>
          {error && (
            <button type="button" onClick={() => setError(null)} className="text-xs font-semibold underline">
              Cerrar
            </button>
          )}
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <label className="relative min-w-[220px] flex-1">
          <Icono nombre="buscar" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--jm-tenue)]" />
          <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por nombre o descripción" className="campo !rounded-full !pl-11" />
        </label>
        <div className="flex flex-wrap gap-1 rounded-full bg-black/25 p-1">
          {FILTROS.map((f) => (
            <button key={f.id} type="button" onClick={() => setFiltro(f.id)} className={`relative rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${filtro === f.id ? "text-[var(--jm-texto)]" : "text-[var(--jm-tenue)] hover:text-[var(--jm-suave)]"}`}>
              {filtro === f.id && <motion.span layoutId="filtro-biblioteca" className="absolute inset-0 rounded-full bg-white/10" transition={{ duration: 0.4, ease: CURVA }} />}
              <span className="relative">{f.nombre}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-start">
      {/* Carpetas en vertical: a la derecha en pantalla ancha (fijas al hacer scroll), arriba y con poco alto en el móvil */}
      <aside className="flex max-h-56 w-full flex-col gap-2 rounded-[22px] bg-black/40 p-2.5 backdrop-blur-xl lg:sticky lg:top-4 lg:order-last lg:max-h-[75svh] lg:w-60 lg:shrink-0">
        <input
          value={buscarCarpeta}
          onChange={(e) => setBuscarCarpeta(e.target.value)}
          placeholder="Buscar proyecto…"
          aria-label="Buscar proyecto"
          className="campo !rounded-xl !py-2 text-sm"
        />
        <div className="flex min-h-0 flex-col gap-1 overflow-y-auto">
        <Pastilla activo={carpeta === "todas"} onClick={() => setCarpeta("todas")}>
          Todas las carpetas
        </Pastilla>
        {carpetas.filter((c) => aSlug(c.nombre).includes(aSlug(buscarCarpeta))).map((c) => (
          <Pastilla key={c.id} activo={carpeta === c.id} onClick={() => setCarpeta(c.id)} alSoltar={(ids) => mover(ids, c.id)}>
            {c.nombre} <span className="opacity-60">{medios.filter((m) => m.carpetaId === c.id).length}</span>
          </Pastilla>
        ))}
        <Pastilla activo={carpeta === "sin"} onClick={() => setCarpeta("sin")} alSoltar={(ids) => mover(ids, null)}>
          Sin carpeta
        </Pastilla>
        {creando ? (
          <input
            autoFocus
            value={nueva}
            onChange={(e) => setNueva(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") crear();
              if (e.key === "Escape") {
                setNueva("");
                setCreando(false);
              }
            }}
            onBlur={() => {
              if (!nueva.trim()) setCreando(false);
            }}
            placeholder="Nombre de la carpeta"
            className="campo !rounded-xl !py-2 text-sm"
          />
        ) : (
          <button type="button" onClick={() => setCreando(true)} className="w-full rounded-xl px-3 py-2 text-left text-[13px] font-semibold text-[var(--jm-suave)] ring-1 ring-[var(--jm-borde)] hover:text-[var(--jm-texto)]">
            + Nueva carpeta
          </button>
        )}
        </div>
      </aside>
      <div className="min-w-0 flex-1">
      {enRaiz ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {carpetas.map((c) => (
            <CarpetaTarjeta key={c.id} nombre={c.nombre} cuantos={medios.filter((m) => m.carpetaId === c.id).length} alEntrar={() => setCarpeta(c.id)} alSoltar={(ids) => mover(ids, c.id)} />
          ))}
          <CarpetaTarjeta nombre="Sin carpeta" cuantos={sinCarpeta} alEntrar={() => setCarpeta("sin")} alSoltar={(ids) => mover(ids, null)} />
        </div>
      ) : (
      <>
      <nav className="flex flex-wrap items-center gap-2 text-sm">
        <button type="button" onClick={() => setCarpeta("todas")} className="flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold text-[var(--jm-suave)] ring-1 ring-[var(--jm-borde)] hover:text-[var(--jm-texto)]">
          <Icono nombre="izquierda" className="h-3.5 w-3.5" />
          Volver
        </button>
        <button type="button" onClick={() => setCarpeta("todas")} className="font-semibold text-[var(--jm-suave)] underline-offset-4 hover:underline">
          Biblioteca
        </button>
        <Icono nombre="derecha" className="h-3.5 w-3.5 text-[var(--jm-tenue)]" />
        <span className="font-semibold">{carpetaElegida?.nombre ?? (carpeta === "sin" ? "Sin carpeta" : "Resultados")}</span>
      </nav>
      {carpetaElegida && (
        <div className="flex flex-wrap items-center gap-3">
          <input
            key={carpetaElegida.id}
            defaultValue={carpetaElegida.nombre}
            aria-label="Nombre de la carpeta"
            onBlur={(e) => renombrar(carpetaElegida, e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
            className="campo !py-1.5 text-sm sm:max-w-xs"
          />
          <button type="button" onClick={() => borrar(carpetaElegida)} className="text-xs font-semibold text-[#ff6b6b] underline-offset-4 hover:underline">
            Borrar carpeta
          </button>
          <span className="text-xs text-[var(--jm-tenue)]">Sus archivos no se borran: quedan en «Sin carpeta».</span>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {visibles.map((m) => {
          const sinUsar = !usosDe(m.id).length;
          return (
            <div key={m.id} draggable onDragStart={(e) => arrastrar(e, m.id)} className="group relative">
              <button type="button" onClick={() => setAbierto(m.id)} className="block w-full text-left">
                <div className={`relative overflow-hidden rounded-[18px] ring-1 transition-[box-shadow] duration-300 group-hover:ring-2 group-hover:ring-[var(--jm-acento)] ${seleccion.includes(m.id) ? "ring-2 ring-[var(--jm-acento)]" : "ring-[var(--jm-borde)]"}`}>
                  <Miniatura medio={m} className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-[1.03]" />
                  <span className="absolute left-2 top-2 flex gap-1">
                    {m.tipo === "video" && <Insignia color="bg-black/70 text-white">Vídeo</Insignia>}
                    {sinUsar && <Insignia color="bg-black/70 text-[var(--jm-suave)]">Sin usar</Insignia>}
                  </span>
                  {m.tipo === "imagen" && !m.alt.trim() && <span className="absolute bottom-2 right-2 h-2.5 w-2.5 rounded-full bg-[#ff9f0a] shadow" title="Sin descripción" />}
                </div>
                <span className="mt-1.5 block truncate px-1 text-xs text-[var(--jm-suave)]">{nombre(m)}</span>
              </button>
              <button
                type="button"
                onClick={() => alternar(m.id)}
                aria-pressed={seleccion.includes(m.id)}
                aria-label={seleccion.includes(m.id) ? "Quitar de la selección" : "Seleccionar"}
                className={`absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-opacity ${seleccion.includes(m.id) ? "border-[var(--jm-acento)] bg-[var(--jm-acento)] text-white" : "border-white/80 bg-black/40 text-transparent opacity-0 group-hover:opacity-100"}`}
              >
                <Icono nombre="check" className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
      {!visibles.length && <p className="mt-10 text-center text-sm text-[var(--jm-suave)]">No hay archivos que coincidan.</p>}
      </>
      )}
      </div>
      </div>

      {seleccion.length > 0 && (
        <div className="cristal cristal-fuerte fixed bottom-4 left-1/2 z-[60] flex w-[min(92vw,640px)] -translate-x-1/2 flex-wrap items-center gap-3 rounded-full px-5 py-2.5 text-sm">
          <span className="font-semibold">
            {seleccion.length} {seleccion.length === 1 ? "seleccionada" : "seleccionadas"}
          </span>
          <select className="campo !w-auto !py-1.5 text-sm" value="" onChange={(e) => e.target.value && mover(seleccion, e.target.value === "sin" ? null : e.target.value)}>
            <option value="" disabled>
              Mover a…
            </option>
            <option value="sin">Sin carpeta</option>
            {carpetas.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
          <button type="button" onClick={() => setSeleccion([])} className="ml-auto text-xs font-semibold text-[var(--jm-suave)] underline-offset-4 hover:underline">
            Quitar selección
          </button>
        </div>
      )}

      <AnimatePresence>
        {encima && (
          <motion.div className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center bg-[rgba(229,9,20,0.18)] backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="cristal cristal-fuerte rounded-full px-6 py-3 text-sm font-semibold">Suelta para subirlos a la biblioteca</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {elegido && (
          <Detalle
            key={elegido.id}
            medio={elegido}
            usos={usosDe(elegido.id)}
            carpetas={carpetas}
            alMover={(c) => mover([elegido.id], c)}
            alCerrar={() => setAbierto(null)}
            alCambiar={(c) => setMedios((l) => l.map((x) => (x.id === elegido.id ? { ...x, ...c } : x)))}
            alRecortar={(nuevo) => {
              setMedios((l) => [nuevo, ...l]);
              setAbierto(nuevo.id);
              router.refresh();
            }}
            alBorrar={() => {
              setMedios((l) => l.filter((x) => x.id !== elegido.id));
              setAbierto(null);
              router.refresh();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/** Pastilla de los filtros de la biblioteca (carpetas) */
/** Carpeta en la raíz de la biblioteca: un clic entra en ella y las fotos arrastradas encima se mueven a esa carpeta */
function CarpetaTarjeta({ nombre, cuantos, alEntrar, alSoltar }: { nombre: string; cuantos: number; alEntrar: () => void; alSoltar: (ids: string[]) => void }) {
  const [encima, setEncima] = useState(false);
  return (
    <button
      type="button"
      onClick={alEntrar}
      onDragOver={(e) => {
        if (!e.dataTransfer.types.includes(MIME_MEDIO)) return;
        e.preventDefault();
        setEncima(true);
      }}
      onDragLeave={() => setEncima(false)}
      onDrop={(e) => {
        e.preventDefault();
        setEncima(false);
        alSoltar(JSON.parse(e.dataTransfer.getData(MIME_MEDIO)));
      }}
      className={`flex items-center gap-3 rounded-[18px] bg-white/[0.04] p-4 text-left ring-1 transition-[box-shadow,background-color] hover:bg-white/[0.07] ${encima ? "ring-2 ring-[var(--jm-acento)]" : "ring-[var(--jm-borde)]"}`}
    >
      <Icono nombre="carpeta" className="h-9 w-9 shrink-0 text-[var(--jm-suave)]" />
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold">{nombre}</span>
        <span className="text-xs text-[var(--jm-tenue)]">
          {cuantos} {cuantos === 1 ? "elemento" : "elementos"}
        </span>
      </span>
    </button>
  );
}

/** Si recibe `alSoltar`, es una carpeta donde se pueden soltar las fotos arrastradas */
function Pastilla({ activo, onClick, alSoltar, children }: { activo: boolean; onClick: () => void; alSoltar?: (ids: string[]) => void; children: React.ReactNode }) {
  const [encima, setEncima] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onDragOver={(e) => {
        if (!alSoltar || !e.dataTransfer.types.includes(MIME_MEDIO)) return;
        e.preventDefault();
        setEncima(true);
      }}
      onDragLeave={() => setEncima(false)}
      onDrop={(e) => {
        if (!alSoltar) return;
        e.preventDefault();
        setEncima(false);
        alSoltar(JSON.parse(e.dataTransfer.getData(MIME_MEDIO)));
      }}
      className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-1.5 text-left text-[12.5px] font-semibold transition-[box-shadow,color] ${activo ? "bg-white/10 text-[var(--jm-texto)]" : "bg-black/25 text-[var(--jm-tenue)] hover:text-[var(--jm-suave)]"} ${encima ? "ring-2 ring-[var(--jm-acento)]" : ""}`}
    >
      {children}
    </button>
  );
}

function Detalle({
  medio,
  usos,
  carpetas,
  alMover,
  alCerrar,
  alCambiar,
  alBorrar,
  alRecortar,
}: {
  medio: MedioBiblioteca;
  usos: Uso[];
  carpetas: Carpeta[];
  alMover: (carpetaId: string | null) => void;
  alCerrar: () => void;
  alCambiar: (c: Partial<MedioBiblioteca>) => void;
  alBorrar: () => void;
  alRecortar: (nuevo: MedioBiblioteca) => void;
}) {
  const { confirmar, avisar } = useDialogos();
  const [recortando, setRecortando] = useState(false);
  // SVG (vectorial) y GIF (animado) no se recortan: se perderían
  const recortable = medio.tipo === "imagen" && !["image/svg+xml", "image/gif"].includes(medio.mime);
  const [titulo, setTitulo] = useState(medio.titulo);
  const [alt, setAlt] = useState(medio.alt);
  const [borrando, setBorrando] = useState(false);

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && (recortando ? setRecortando(false) : alCerrar());
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [alCerrar, recortando]);

  const guardar = async (campo: "titulo" | "alt") => {
    const valor = (campo === "titulo" ? titulo : alt).trim();
    if (valor === (campo === "titulo" ? medio.titulo : medio.alt)) return;
    const r = await cambiarMedio(medio.id, campo === "titulo" ? { titulo: valor } : { texto_alternativo: valor });
    if (!r.ok) return avisar(r.error, "error");
    alCambiar(campo === "titulo" ? { titulo: valor } : { alt: valor });
    avisar("Guardado");
  };

  const quitar = async () => {
    if (!(await confirmar({ titulo: "¿Borrar este archivo para siempre?", texto: "Se borra de la biblioteca y del almacenamiento. No se puede deshacer.", aceptar: "Borrar", peligro: true }))) return;
    setBorrando(true);
    const r = await borrarMedio(medio.id);
    setBorrando(false);
    if (!r.ok) return avisar(r.error, "error");
    avisar("Archivo borrado");
    alBorrar();
  };

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(medio.url);
      avisar("Enlace copiado");
    } catch {
      avisar("No se pudo copiar el enlace", "error");
    }
  };

  return (
    <motion.div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-2 backdrop-blur-sm sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={alCerrar}>
      <motion.div
        role="dialog"
        aria-label={medio.titulo || "Archivo"}
        onClick={(e) => e.stopPropagation()}
        className="cristal cristal-fuerte grid max-h-[92svh] w-full max-w-5xl overflow-y-auto rounded-[32px] md:grid-cols-[1.4fr_1fr]"
        initial={{ y: 24, scale: 0.97 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 16, opacity: 0 }}
        transition={{ duration: 0.45, ease: CURVA }}
      >
        <div className="flex items-center justify-center bg-black/40 p-4 md:min-h-[28rem]">
          {recortando ? (
            <Recortador medio={medio} alCancelar={() => setRecortando(false)} alTerminar={alRecortar} />
          ) : medio.tipo === "video" ? (
            <video src={medio.url} controls playsInline className="max-h-[60svh] w-full rounded-[18px]" />
          ) : medio.tipo === "imagen" ? (
            <img src={img(medio.url, 1080)} alt={medio.alt} className="max-h-[60svh] w-auto rounded-[18px] object-contain" />
          ) : (
            <a href={medio.url} target="_blank" rel="noreferrer" className="boton boton-suave px-5 py-3 text-sm">
              Abrir el PDF
            </a>
          )}
        </div>
        <div className="flex flex-col gap-5 p-6">
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs text-[var(--jm-tenue)]">
              {[medio.ancho && medio.alto ? `${medio.ancho} × ${medio.alto}` : "", tamano(medio.bytes), medio.mime.split("/")[1]?.toUpperCase(), fecha(medio.creadoEn)].filter(Boolean).join(" · ")}
            </p>
            <button type="button" onClick={alCerrar} className="boton-icono -mr-2 -mt-2" aria-label="Cerrar">
              <Icono nombre="cerrar" />
            </button>
          </div>
          <label className="block">
            <span className="campo-etiqueta">Nombre</span>
            <input className="campo mt-1.5" value={titulo} onChange={(e) => setTitulo(e.target.value)} onBlur={() => guardar("titulo")} />
            <span className="campo-ayuda">Solo para encontrarlo aquí</span>
          </label>
          <label className="block">
            <span className="campo-etiqueta">Carpeta</span>
            <select className="campo mt-1.5" value={medio.carpetaId ?? ""} onChange={(e) => alMover(e.target.value || null)}>
              <option value="">Sin carpeta</option>
              {carpetas.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </label>
          {medio.tipo !== "documento" && (
            <label className="block">
              <span className="campo-etiqueta">Descripción (texto alternativo)</span>
              <textarea className="campo mt-1.5 min-h-[5rem] resize-y" value={alt} onChange={(e) => setAlt(e.target.value)} onBlur={() => guardar("alt")} placeholder="Qué se ve: «Josep con la cámara en un rodaje nocturno»" />
              <span className="campo-ayuda">La leen quienes no ven la imagen y Google. Una frase basta.</span>
            </label>
          )}
          {medio.tipo === "imagen" && <PuntoDeInteres medio={medio} alCambiar={alCambiar} />}
          <div>
            <span className="campo-etiqueta">Dónde se usa</span>
            {usos.length ? (
              <ul className="mt-2 flex flex-col gap-1">
                {usos.map((u) => (
                  <li key={u.donde + u.href}>
                    <Link href={u.href} className="flex items-center justify-between gap-2 rounded-[14px] bg-white/[0.04] px-3 py-2 text-sm hover:bg-white/[0.08]">
                      <span className="truncate">{u.donde}</span>
                      <Icono nombre="derecha" className="h-4 w-4 shrink-0 text-[var(--jm-tenue)]" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-[var(--jm-suave)]">En ningún sitio todavía.</p>
            )}
          </div>
          <div className="mt-auto flex flex-wrap gap-2 pt-2">
            {recortable && !recortando && (
              <button type="button" onClick={() => setRecortando(true)} className="boton boton-suave px-4 py-2.5 text-sm" title="Se guarda como una imagen nueva: esta no cambia">
                Recortar
              </button>
            )}
            <button type="button" onClick={copiar} className="boton boton-suave px-4 py-2.5 text-sm">
              Copiar enlace
            </button>
            <button
              type="button"
              onClick={quitar}
              disabled={usos.length > 0 || borrando}
              title={usos.length ? "Quítalo de donde se usa para poder borrarlo" : undefined}
              className="boton px-4 py-2.5 text-sm text-[#ff6b6b] ring-1 ring-[#ff6b6b]/40 hover:bg-[#ff453a]/10 disabled:opacity-35"
            >
              {borrando ? "Borrando…" : "Borrar"}
            </button>
          </div>
          {usos.length > 0 && <p className="-mt-3 text-xs text-[var(--jm-tenue)]">Para borrarlo, primero quítalo de donde se usa.</p>}
        </div>
      </motion.div>
    </motion.div>
  );
}
