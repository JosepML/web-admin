"use client";

// Secciones de una página de bloques (Inicio, Sobre mí, JUNO Media, especialidades...) desde el panel: ordenar
// (arrastrar y flechas), ocultar, editar el contenido, añadir, duplicar y borrar secciones, deshacer y rehacer, y las
// versiones anteriores. Escribe en el mismo borrador que el modo «Editar página» (la lista entera de bloques, en
// orden), así que lo que se hace aquí se ve allí y al revés, y nada llega a la web hasta Publicar.

import { AnimatePresence, motion, Reorder, useDragControls } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDialogos } from "@/components/admin/Dialogos";
import { Campos, ProveedorOpciones } from "@/components/admin/campos/Campos";
import type { OpcionesFormulario } from "@/components/admin/campos/tipos";
import { Insignia } from "@/components/admin/ListaContenido";
import { Historial } from "@/components/admin/paginas/Historial";
import { textoGuardado, useAutoguardado } from "@/components/admin/useAutoguardado";
import { CATALOGO, nombreBloque } from "@/components/edicion/catalogo";
import { Icono } from "@/components/Iconos";
import { CURVA } from "@/styles/movimiento";
import { cargarParaEditar, descartar, publicar, type ParaEditar } from "@/lib/admin/contenido";
import type { TipoBloque } from "@/lib/datos/tipos";

type BloqueEditable = { id: string; tipo: TipoBloque; visible: boolean; datos: Record<string, unknown> };

const json = (x: unknown) => JSON.stringify(x);

/** El título de la sección tal como se lee (sin los asteriscos que marcan la palabra de acento) */
function tituloDe(b: BloqueEditable) {
  const t = typeof b.datos.titulo === "string" ? b.datos.titulo : "";
  return t.replace(/\*/g, "").trim();
}

export function OrdenSecciones({ id, titulo, ruta, inicial, opciones }: { id: string; titulo: string; ruta: string; inicial: ParaEditar; opciones: OpcionesFormulario }) {
  const router = useRouter();
  const { confirmar, avisar } = useDialogos();
  const [publicados, setPublicados] = useState(() => (inicial.extras.bloques as BloqueEditable[]) ?? []);
  // Lo demás que lleve el borrador (textos de la página, título, SEO) se respeta tal cual
  const [otros, setOtros] = useState(() => Object.fromEntries(Object.entries(inicial.borrador ?? {}).filter(([k]) => k !== "bloques")));
  const [bloques, setBloques] = useState<BloqueEditable[]>(() => (inicial.borrador?.bloques as BloqueEditable[] | undefined) ?? publicados);
  const [publicando, setPublicando] = useState(false);
  const [abierto, setAbierto] = useState<string | null>(null);
  const [catalogo, setCatalogo] = useState(false);

  // Historial para deshacer y rehacer. Vive en refs y se calcula fuera de los «updaters» de React.
  const bloquesRef = useRef(bloques);
  const pasado = useRef<BloqueEditable[][]>([]);
  const futuro = useRef<BloqueEditable[][]>([]);
  const ultimoGrupo = useRef<{ clave: string; cuando: number } | null>(null);
  const [, setVersionHistorial] = useState(0);

  const poner = useCallback((lista: BloqueEditable[]) => {
    bloquesRef.current = lista;
    setBloques(lista);
  }, []);

  /** Aplica un cambio a la lista de secciones. Los cambios seguidos del mismo campo (escribir) se deshacen de una vez. */
  const aplicar = useCallback(
    (cambio: (l: BloqueEditable[]) => BloqueEditable[], grupo?: string) => {
      const previo = bloquesRef.current;
      const nuevo = cambio(previo);
      if (nuevo === previo) return;
      const ahora = Date.now();
      const mismo = grupo && ultimoGrupo.current?.clave === grupo && ahora - ultimoGrupo.current.cuando < 1500;
      if (!mismo) {
        pasado.current = [...pasado.current.slice(-79), previo];
        futuro.current = [];
      }
      ultimoGrupo.current = grupo ? { clave: grupo, cuando: ahora } : null;
      poner(nuevo);
      setVersionHistorial((n) => n + 1);
    },
    [poner],
  );

  const deshacer = useCallback(() => {
    const previo = pasado.current.at(-1);
    if (!previo) return;
    pasado.current = pasado.current.slice(0, -1);
    futuro.current = [bloquesRef.current, ...futuro.current];
    ultimoGrupo.current = null;
    poner(previo);
    setVersionHistorial((n) => n + 1);
  }, [poner]);

  const rehacer = useCallback(() => {
    const siguiente = futuro.current[0];
    if (!siguiente) return;
    futuro.current = futuro.current.slice(1);
    pasado.current = [...pasado.current, bloquesRef.current];
    ultimoGrupo.current = null;
    poner(siguiente);
    setVersionHistorial((n) => n + 1);
  }, [poner]);

  const borrarHistorial = useCallback(() => {
    pasado.current = [];
    futuro.current = [];
    ultimoGrupo.current = null;
    setVersionHistorial((n) => n + 1);
  }, []);

  // Deshacer y rehacer con el teclado (en un campo de texto manda el deshacer del propio campo)
  useEffect(() => {
    const teclas = (e: KeyboardEvent) => {
      const enCampo = (e.target as HTMLElement | null)?.closest("input, textarea, select, [contenteditable]");
      if (enCampo || !(e.ctrlKey || e.metaKey)) return;
      const k = e.key.toLowerCase();
      if (k === "z" && !e.shiftKey) {
        e.preventDefault();
        deshacer();
      } else if ((k === "z" && e.shiftKey) || k === "y") {
        e.preventDefault();
        rehacer();
      }
    };
    window.addEventListener("keydown", teclas);
    return () => window.removeEventListener("keydown", teclas);
  }, [deshacer, rehacer]);

  const cambios = useMemo(() => (json(bloques) === json(publicados) ? { ...otros } : { ...otros, bloques }), [bloques, otros, publicados]);
  const [cambiosIniciales, setCambiosIniciales] = useState<Record<string, unknown>>(() => inicial.borrador ?? {});
  const guardado = useAutoguardado("paginas", id, cambios, cambiosIniciales);
  const hayCambios = Object.keys(cambios).length > 0;

  const porId = new Map(publicados.map((b) => [b.id, b]));
  // Cambios de la página que no son de las secciones (título, SEO): al publicar salen también
  const cambiosDePagina = Object.keys(otros).length > 0;

  const mover = (i: number, paso: number) =>
    aplicar((l) => {
      const j = i + paso;
      if (j < 0 || j >= l.length) return l;
      const lista = [...l];
      [lista[i], lista[j]] = [lista[j], lista[i]];
      return lista;
    });
  const cambiarDato = (bid: string, clave: string, valor: unknown) => aplicar((l) => l.map((b) => (b.id === bid ? { ...b, datos: { ...b.datos, [clave]: valor } } : b)), `${bid}:${clave}`);
  const alternar = (bid: string) => aplicar((l) => l.map((b) => (b.id === bid ? { ...b, visible: !b.visible } : b)));

  /** Lleva la lista a una sección (por si es larga) y la resalta un momento */
  const irA = (bid: string) =>
    window.setTimeout(() => {
      const el = document.getElementById(`seccion-${bid}`);
      el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 120);

  const duplicar = (bid: string) => {
    const nuevo = crypto.randomUUID();
    aplicar((l) => {
      const i = l.findIndex((b) => b.id === bid);
      if (i < 0) return l;
      const lista = [...l];
      lista.splice(i + 1, 0, { ...structuredClone(l[i]), id: nuevo });
      return lista;
    });
    setAbierto(nuevo);
    irA(nuevo);
  };

  const borrar = async (bid: string) => {
    const b = bloques.find((x) => x.id === bid);
    if (!b) return;
    const si = await confirmar({
      titulo: `¿Borrar «${nombreBloque(b.tipo, b.datos)}»?`,
      texto: "Desaparece de la página cuando publiques. Si te arrepientes, Deshacer la recupera.",
      aceptar: "Borrar",
      peligro: true,
    });
    if (!si) return;
    aplicar((l) => l.filter((x) => x.id !== bid));
    if (abierto === bid) setAbierto(null);
  };

  const anadir = (tipo: TipoBloque) => {
    const nuevo: BloqueEditable = { id: crypto.randomUUID(), tipo, visible: true, datos: structuredClone(CATALOGO[tipo].nuevo) };
    aplicar((l) => {
      // Detrás de la sección abierta; si no hay ninguna, antes de la llamada final (si existe) o al final
      const i = abierto ? l.findIndex((b) => b.id === abierto) : -1;
      const llamada = l.findIndex((b) => b.tipo === "llamada");
      const donde = i >= 0 ? i + 1 : llamada >= 0 ? llamada : l.length;
      const lista = [...l];
      lista.splice(donde, 0, nuevo);
      return lista;
    });
    setCatalogo(false);
    setAbierto(nuevo.id);
    irA(nuevo.id);
  };

  /** Vuelve a leer el borrador y lo publicado (tras recuperar una versión anterior) */
  const recargar = async () => {
    const r = await cargarParaEditar("paginas", id);
    if (!r.ok) return avisar(r.error, "error");
    const pub = (r.datos.extras.bloques as BloqueEditable[]) ?? [];
    const borrador = r.datos.borrador ?? {};
    setPublicados(pub);
    setOtros(Object.fromEntries(Object.entries(borrador).filter(([k]) => k !== "bloques")));
    poner((borrador.bloques as BloqueEditable[] | undefined) ?? pub);
    setCambiosIniciales(borrador);
    setAbierto(null);
    borrarHistorial();
  };

  const alPublicar = async () => {
    setPublicando(true);
    if (await guardado.guardarYa()) {
      const r = await publicar("paginas", id);
      if (r.ok) {
        avisar("Publicado. Ya se ve en la web.");
        setPublicados(bloques);
        setOtros({});
        setCambiosIniciales({});
        router.refresh();
      } else avisar(r.error, "error");
    }
    setPublicando(false);
  };

  const alDescartar = async () => {
    const si = await confirmar({
      titulo: "¿Descartar los cambios?",
      texto: "La página vuelve a ser la que se ve en la web. Lo que no has publicado se pierde.",
      aceptar: "Descartar",
      peligro: true,
    });
    if (!si) return;
    await guardado.guardarYa();
    const r = await descartar("paginas", id);
    if (!r.ok) return avisar(r.error, "error");
    setOtros({});
    setCambiosIniciales({});
    poner(publicados);
    borrarHistorial();
    avisar("Cambios descartados");
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="sticky top-16 z-30 -mx-2 mb-6 lg:top-4">
        <div className="cristal cristal-fuerte flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[28px] px-5 py-3.5">
          <Link href="/admin/paginas" className="boton-icono -ml-2" aria-label="Volver a Páginas" title="Volver a Páginas">
            <Icono nombre="izquierda" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-extrabold tracking-tight sm:text-xl">Secciones de {titulo}</h1>
            <p className={`text-xs ${guardado.estado === "error" ? "text-[#ff6b6b]" : "text-[var(--jm-tenue)]"}`} aria-live="polite">
              {textoGuardado(guardado.estado, hayCambios, guardado.error)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button type="button" className="boton-icono" onClick={deshacer} disabled={!pasado.current.length} aria-label="Deshacer" title="Deshacer (Ctrl+Z)">
              <Icono nombre="deshacer" className="h-[18px] w-[18px]" />
            </button>
            <button type="button" className="boton-icono" onClick={rehacer} disabled={!futuro.current.length} aria-label="Rehacer" title="Rehacer (Ctrl+Mayús+Z)">
              <Icono nombre="rehacer" className="h-[18px] w-[18px]" />
            </button>
            <a href={`/admin/vista-previa?ruta=${encodeURIComponent(ruta)}`} target="_blank" rel="noreferrer" className="boton boton-suave px-4 py-2 text-sm" title="Abre la página con tus cambios sin publicar">
              <Icono nombre="ojo" className="h-4 w-4" />
              Vista previa
            </a>
            {hayCambios && (
              <button type="button" onClick={alDescartar} className="boton px-4 py-2 text-sm text-[var(--jm-suave)] hover:bg-[var(--jm-cristal)]">
                Descartar
              </button>
            )}
            <button type="button" onClick={alPublicar} disabled={publicando || !hayCambios} className="boton boton-acento px-5 py-2 text-sm disabled:opacity-40">
              {publicando ? "Publicando…" : "Publicar cambios"}
            </button>
          </div>
        </div>
      </div>

      <p className="max-w-xl text-[var(--jm-suave)]">
        Arrastra las secciones para cambiar su orden, o usa las flechas. El ojo la oculta sin borrarla y el lápiz abre su contenido: textos, fotos y qué proyectos salen y en qué orden; ahí también puedes duplicarla o borrarla. Nada cambia en la web hasta que pulsas Publicar.
      </p>
      {cambiosDePagina && (
        <p className="mt-4 rounded-[20px] bg-[var(--jm-calido)]/10 px-4 py-3 text-sm text-[var(--jm-calido)]">
          Esta página tiene además cambios en su título o en lo que sale en Google sin publicar. Al publicar aquí, salen también.
        </p>
      )}

      <ProveedorOpciones opciones={opciones}>
        <Reorder.Group axis="y" values={bloques} onReorder={(lista) => aplicar(() => lista, "reordenar")} className="mt-6 flex flex-col gap-2">
          {bloques.map((b, i) => (
            <Fila
              key={b.id}
              b={b}
              n={i + 1}
              abierto={abierto === b.id}
              alAbrir={() => setAbierto(abierto === b.id ? null : b.id)}
              alCambiar={(clave, valor) => cambiarDato(b.id, clave, valor)}
              nueva={!porId.has(b.id)}
              primera={i === 0}
              ultima={i === bloques.length - 1}
              alSubir={() => mover(i, -1)}
              alBajar={() => mover(i, 1)}
              alVisible={() => alternar(b.id)}
              alDuplicar={() => duplicar(b.id)}
              alBorrar={() => borrar(b.id)}
            />
          ))}
        </Reorder.Group>
      </ProveedorOpciones>

      <AnimatePresence initial={false}>
        {catalogo && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: CURVA }} className="overflow-hidden">
            <div className="mt-3 grid grid-cols-1 gap-1 rounded-[24px] border border-dashed border-[var(--jm-borde)] p-2 sm:grid-cols-2">
              <p className="px-3 pb-1 pt-2 text-xs text-[var(--jm-tenue)] sm:col-span-2">{abierto ? "Se añade detrás de la sección abierta" : "Se añade antes de «Hablemos»"}</p>
              {(Object.keys(CATALOGO) as TipoBloque[])
                .filter((t) => t !== "portada")
                .map((tipo) => (
                  <button key={tipo} type="button" onClick={() => anadir(tipo)} className="rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-[var(--jm-cristal)]">
                    <span className="block text-sm font-semibold">{CATALOGO[tipo].nombre}</span>
                    <span className="block text-xs text-[var(--jm-suave)]">{CATALOGO[tipo].descripcion}</span>
                  </button>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setCatalogo((v) => !v)}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-[20px] border border-dashed border-[var(--jm-borde)] px-4 py-3 text-sm font-semibold text-[var(--jm-suave)] transition-colors hover:border-white/30 hover:text-[var(--jm-texto)]"
      >
        <Icono nombre={catalogo ? "cerrar" : "mas"} className="h-4 w-4" />
        {catalogo ? "Cancelar" : "Añadir sección"}
      </button>

      <Historial paginaId={id} alRestaurar={recargar} />
    </div>
  );
}

/** Las cuatro partes del bloque «colaboracion» se distinguen por su nombre en la lista */
const PARTES: Record<string, string> = { apertura: "Apertura", relacion: "Lo que nos une", valor: "Para tu proyecto", productora: "La productora" };

function Fila({
  b,
  n,
  abierto,
  alAbrir,
  alCambiar,
  nueva,
  primera,
  ultima,
  alSubir,
  alBajar,
  alVisible,
  alDuplicar,
  alBorrar,
}: {
  b: BloqueEditable;
  n: number;
  abierto: boolean;
  alAbrir: () => void;
  alCambiar: (clave: string, valor: unknown) => void;
  nueva: boolean;
  primera: boolean;
  ultima: boolean;
  alSubir: () => void;
  alBajar: () => void;
  alVisible: () => void;
  alDuplicar: () => void;
  alBorrar: () => void;
}) {
  const controles = useDragControls();
  const info = CATALOGO[b.tipo];
  const t = tituloDe(b);
  return (
    <Reorder.Item
      id={`seccion-${b.id}`}
      value={b}
      dragListener={false}
      dragControls={controles}
      className="cristal rounded-[24px]"
      whileDrag={{ scale: 1.02, boxShadow: "0 24px 50px -16px rgba(0,0,0,0.6)", zIndex: 10 }}
    >
      <div className="flex items-center gap-3 p-2 pr-3">
      <button type="button" onPointerDown={(e) => controles.start(e)} className="flex h-10 w-6 shrink-0 cursor-grab touch-none items-center justify-center text-[var(--jm-tenue)] active:cursor-grabbing" aria-label="Arrastrar para ordenar">
        <Icono nombre="asa" className="h-4 w-4" />
      </button>
      <span className="w-5 shrink-0 text-center text-xs font-semibold tabular-nums text-[var(--jm-tenue)]">{n}</span>
      <span className={`min-w-0 flex-1 py-1.5 ${b.visible ? "" : "opacity-50"}`}>
        <span className="block font-semibold leading-snug">{(b.tipo === "colaboracion" && PARTES[String(b.datos.parte)]) || info?.nombre || b.tipo}</span>
        <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--jm-tenue)]">
          {t && <span className="line-clamp-1">{t}</span>}
          {nueva && <Insignia color="bg-white/15 text-[var(--jm-suave)]">Nueva</Insignia>}
          {!b.visible && <Insignia color="bg-[#ff9f0a]/15 text-[#ffb340]">Oculta</Insignia>}
        </span>
      </span>
      <div className="-mr-1 flex shrink-0 items-center">
        <button type="button" onClick={alSubir} disabled={primera} className="boton-icono disabled:opacity-25" aria-label="Subir" title="Subir">
          <Icono nombre="arriba" className="h-[18px] w-[18px]" />
        </button>
        <button type="button" onClick={alBajar} disabled={ultima} className="boton-icono disabled:opacity-25" aria-label="Bajar" title="Bajar">
          <Icono nombre="abajo" className="h-[18px] w-[18px]" />
        </button>
        <button type="button" onClick={alVisible} className="boton-icono" aria-label={b.visible ? "Ocultar sección" : "Mostrar sección"} title={b.visible ? "Ocultar sección" : "Mostrar sección"}>
          <Icono nombre={b.visible ? "ojo" : "ojo-no"} className="h-[18px] w-[18px]" />
        </button>
        {info && (
          <button type="button" onClick={alAbrir} className={`boton-icono ${abierto ? "!text-[var(--jm-acento)]" : ""}`} aria-label="Editar el contenido" aria-expanded={abierto} title="Editar el contenido">
            <Icono nombre="lapiz" className="h-[18px] w-[18px]" />
          </button>
        )}
      </div>
      </div>
      <AnimatePresence initial={false}>
        {abierto && info && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: CURVA }} className="overflow-hidden">
            <div className="border-t border-[var(--jm-borde)] px-4 pb-5 pt-4">
              <Campos campos={info.campos} datos={b.datos} cambiar={alCambiar} />
              <div className="mt-5 flex gap-1.5 border-t border-[var(--jm-borde)] pt-3">
                <button type="button" onClick={alDuplicar} className="boton px-3 py-1.5 text-xs text-[var(--jm-suave)] hover:bg-[var(--jm-cristal)]">
                  <Icono nombre="duplicar" className="h-3.5 w-3.5" />
                  Duplicar
                </button>
                <button type="button" onClick={alBorrar} className="boton px-3 py-1.5 text-xs text-[var(--jm-suave)] hover:bg-[var(--jm-cristal)] hover:text-[#ff6b6b]">
                  <Icono nombre="papelera" className="h-3.5 w-3.5" />
                  Borrar sección
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Reorder.Item>
  );
}
