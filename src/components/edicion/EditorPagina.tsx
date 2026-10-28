"use client";

// Editor de una página de bloques en la propia web (modo «Editar página»). Solo se descarga con la sesión de
// Josep (lo carga ZonaEdicion). Mientras edita, la página se pinta con su borrador: textos editables en su sitio,
// imágenes que se cambian arrastrando, y un panel con las secciones (ordenar, ocultar, añadir, duplicar, borrar
// y todos sus campos). Todo se autoguarda en `borradores`; la web no cambia hasta que pulsa Publicar.

import { AnimatePresence, motion, Reorder, useDragControls } from "motion/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Campos, ProveedorOpciones } from "@/components/admin/campos/Campos";
import { ProveedorMediosControlado, SelectorMedios } from "@/components/admin/campos/medios";
import { conValor, uuidsEn, type Campo } from "@/components/admin/campos/tipos";
import { ProveedorDialogos, useDialogos } from "@/components/admin/Dialogos";
import { Historial } from "@/components/admin/paginas/Historial";
import { textoGuardado, useAutoguardado } from "@/components/admin/useAutoguardado";
import { Icono } from "@/components/Iconos";
import { cargarParaEditar, descartar, publicar } from "@/lib/admin/contenido";
import { estadoEditor } from "@/lib/admin/editor";
import { mediosPorId } from "@/lib/admin/medios";
import { subirArchivo } from "@/lib/admin/subir";
import type { Medio, TipoBloque } from "@/lib/datos/tipos";
import { CURVA } from "@/styles/movimiento";
import { useDatos } from "../marco/DatosWeb";
import { CATALOGO, nombreBloque } from "./catalogo";
import type { BloqueEditable, Edicion, Ruta, VistaEdicion } from "./contexto";

type Pagina = { id: string; slug: string; titulo: string };
type CamposPagina = { titulo: string; seo_titulo: string; seo_descripcion: string };
type Estado = { bloques: BloqueEditable[]; pagina: CamposPagina };

const CAMPOS_PAGINA: Campo[] = [
  { tipo: "texto", clave: "titulo", etiqueta: "Nombre de la página", ayuda: "Para ti y para los lectores de pantalla" },
  { tipo: "texto", clave: "seo_titulo", etiqueta: "Título en Google", ayuda: "Hasta unos 60 caracteres. Vacío = el nombre de la página" },
  { tipo: "largo", clave: "seo_descripcion", etiqueta: "Descripción en Google", filas: 3, ayuda: "Hasta unos 155 caracteres: lo que se lee bajo el título en los resultados" },
];

const igual = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/** Lo que difiere de lo publicado: es lo que va al borrador */
function calcularCambios(estado: Estado, publicado: Estado) {
  const c: Record<string, unknown> = {};
  if (!igual(estado.bloques, publicado.bloques)) c.bloques = estado.bloques;
  for (const k of Object.keys(estado.pagina) as (keyof CamposPagina)[]) if (estado.pagina[k] !== publicado.pagina[k]) c[k] = estado.pagina[k];
  return c;
}

export function EditorPagina(props: { pagina: Pagina; alCambiarVista: (v: VistaEdicion) => void }) {
  // El panel va fuera del contenido de la página (que tiene su propio z-index) para quedar por encima del menú
  const [destino] = useState(() => document.querySelector<HTMLElement>(".jm-raiz") ?? document.body);
  return createPortal(
    <ProveedorDialogos>
      <Editor {...props} />
    </ProveedorDialogos>,
    destino,
  );
}

function Editor({ pagina, alCambiarVista }: { pagina: Pagina; alCambiarVista: (v: VistaEdicion) => void }) {
  const router = useRouter();
  const { confirmar, avisar } = useDialogos();
  const datosWeb = useDatos();
  const [admin, setAdmin] = useState(false);
  const [hayBorradorInicial, setHayBorradorInicial] = useState(false);
  const [abiertoEditor, setAbiertoEditor] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [minimizado, setMinimizado] = useState(false);
  const [pestana, setPestana] = useState<"secciones" | "pagina">("secciones");
  const [abierto, setAbierto] = useState<string | null>(null);
  const [catalogo, setCatalogo] = useState(false);
  const [publicando, setPublicando] = useState(false);
  const [selector, setSelector] = useState<{ bloque: string; ruta: Ruta; acepta: "imagen" | "video" } | null>(null);

  // Lo publicado (para saber qué ha cambiado) y lo que se edita, con historial para deshacer
  const [publicado, setPublicado] = useState<Estado | null>(null);
  const [estado, setEstado] = useState<Estado | null>(null);
  const [cambiosIniciales, setCambiosIniciales] = useState<Record<string, unknown> | null>(null);
  const pasado = useRef<Estado[]>([]);
  const futuro = useRef<Estado[]>([]);
  const ultimoGrupo = useRef<{ clave: string; cuando: number } | null>(null);
  const [, setVersionHistorial] = useState(0);

  const [medios, setMedios] = useState<Record<string, Medio>>({});
  const registrarMedio = useCallback((m: Medio | Medio[]) => {
    const lista = Array.isArray(m) ? m : [m];
    setMedios((previo) => ({ ...previo, ...Object.fromEntries(lista.map((x) => [x.id, x])) }));
  }, []);
  const contextoMedios = useMemo(() => ({ medios: { ...datosWeb.medios, ...medios }, registrar: registrarMedio }), [datosWeb.medios, medios, registrarMedio]);

  useEffect(() => {
    estadoEditor(pagina.id).then((r) => {
      setAdmin(r.admin);
      setHayBorradorInicial(r.hayBorrador);
    });
  }, [pagina.id]);

  // ---- Cambios ------------------------------------------------------------------------------------

  // El historial vive en refs y se calcula fuera de los «updaters» de React (que en desarrollo se ejecutan dos veces)
  const estadoRef = useRef<Estado | null>(null);
  const poner = useCallback((e: Estado | null) => {
    estadoRef.current = e;
    setEstado(e);
  }, []);

  /** Aplica un cambio. Los cambios seguidos del mismo campo (escribir) se deshacen de una vez. */
  const aplicar = useCallback(
    (cambio: (e: Estado) => Estado, grupo?: string) => {
      const previo = estadoRef.current;
      if (!previo) return;
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
    const actual = estadoRef.current;
    const previo = pasado.current.at(-1);
    if (!previo || !actual) return;
    pasado.current = pasado.current.slice(0, -1);
    futuro.current = [actual, ...futuro.current];
    ultimoGrupo.current = null;
    poner(previo);
    setVersionHistorial((n) => n + 1);
  }, [poner]);
  const rehacer = useCallback(() => {
    const actual = estadoRef.current;
    const siguiente = futuro.current[0];
    if (!siguiente || !actual) return;
    futuro.current = futuro.current.slice(1);
    pasado.current = [...pasado.current, actual];
    ultimoGrupo.current = null;
    poner(siguiente);
    setVersionHistorial((n) => n + 1);
  }, [poner]);

  const cambiarBloque = useCallback(
    (id: string, cambio: (b: BloqueEditable) => BloqueEditable, grupo?: string) =>
      aplicar((e) => ({ ...e, bloques: e.bloques.map((b) => (b.id === id ? cambio(b) : b)) }), grupo),
    [aplicar],
  );
  const cambiarDato = useCallback(
    (id: string, ruta: Ruta, valor: unknown) => cambiarBloque(id, (b) => ({ ...b, datos: conValor(b.datos, ruta, valor) }), `${id}:${ruta.join(".")}`),
    [cambiarBloque],
  );

  const mover = useCallback(
    (id: string, paso: number) =>
      aplicar((e) => {
        const i = e.bloques.findIndex((b) => b.id === id);
        const j = i + paso;
        if (i < 0 || j < 0 || j >= e.bloques.length) return e;
        const lista = [...e.bloques];
        [lista[i], lista[j]] = [lista[j], lista[i]];
        return { ...e, bloques: lista };
      }),
    [aplicar],
  );
  const alternarVisible = useCallback((id: string) => cambiarBloque(id, (b) => ({ ...b, visible: !b.visible })), [cambiarBloque]);
  const duplicar = useCallback(
    (id: string) => {
      const nuevo = crypto.randomUUID();
      aplicar((e) => {
        const i = e.bloques.findIndex((b) => b.id === id);
        if (i < 0) return e;
        const lista = [...e.bloques];
        lista.splice(i + 1, 0, { ...structuredClone(e.bloques[i]), id: nuevo });
        return { ...e, bloques: lista };
      });
      irA(nuevo);
    },
    [aplicar],
  );
  const borrar = useCallback(
    async (id: string) => {
      const b = estado?.bloques.find((x) => x.id === id);
      if (!b) return;
      const si = await confirmar({
        titulo: `¿Borrar «${nombreBloque(b.tipo, b.datos)}»?`,
        texto: "Desaparece de la página cuando publiques. Si te arrepientes, Deshacer la recupera.",
        aceptar: "Borrar",
        peligro: true,
      });
      if (si) aplicar((e) => ({ ...e, bloques: e.bloques.filter((x) => x.id !== id) }));
    },
    [aplicar, confirmar, estado],
  );
  const anadir = (tipo: TipoBloque) => {
    const nuevo: BloqueEditable = { id: crypto.randomUUID(), tipo, visible: true, datos: structuredClone(CATALOGO[tipo].nuevo) };
    aplicar((e) => {
      // Detrás de la sección abierta; si no hay ninguna, antes de la llamada final (si existe) o al final
      const i = abierto ? e.bloques.findIndex((b) => b.id === abierto) : -1;
      const llamada = e.bloques.findIndex((b) => b.tipo === "llamada");
      const donde = i >= 0 ? i + 1 : llamada >= 0 ? llamada : e.bloques.length;
      const lista = [...e.bloques];
      lista.splice(donde, 0, nuevo);
      return { ...e, bloques: lista };
    });
    setCatalogo(false);
    setAbierto(nuevo.id);
    irA(nuevo.id);
  };

  // ---- Medios -------------------------------------------------------------------------------------

  const elegirMedio = useCallback((bloque: string, ruta: Ruta, acepta: "imagen" | "video" = "imagen") => setSelector({ bloque, ruta, acepta }), []);
  const soltarArchivo = useCallback(
    async (bloque: string, ruta: Ruta, archivo: File) => {
      avisar("Subiendo…");
      try {
        const m = await subirArchivo(archivo);
        registrarMedio(m);
        cambiarDato(bloque, ruta, m.id);
        avisar("Imagen cambiada");
      } catch (e) {
        avisar(e instanceof Error ? e.message : String(e), "error");
      }
    },
    [avisar, cambiarDato, registrarMedio],
  );

  // ---- Abrir, cargar y salir ----------------------------------------------------------------------

  const cargar = useCallback(async () => {
    const r = await cargarParaEditar("paginas", pagina.id);
    if (!r.ok) {
      avisar(r.error, "error");
      return false;
    }
    const { fila, borrador, extras } = r.datos;
    const camposFila = { titulo: String(fila.titulo ?? ""), seo_titulo: String(fila.seo_titulo ?? ""), seo_descripcion: String(fila.seo_descripcion ?? "") };
    const pub: Estado = { bloques: (extras.bloques as BloqueEditable[]) ?? [], pagina: camposFila };
    const edit: Estado = {
      bloques: (borrador?.bloques as BloqueEditable[] | undefined) ?? pub.bloques,
      pagina: { ...camposFila, ...(Object.fromEntries(Object.entries(borrador ?? {}).filter(([k]) => k in camposFila)) as Partial<CamposPagina>) },
    };
    // Medios que citan los bloques y aún no conoce la página (secciones ocultas, borradores)
    const faltan = [...uuidsEn(edit.bloques)].filter((id) => !datosWeb.medios[id]);
    if (faltan.length) {
      const m = await mediosPorId(faltan);
      if (m.ok) registrarMedio(Object.values(m.datos));
    }
    setPublicado(pub);
    poner(edit);
    setCambiosIniciales(calcularCambios(edit, pub));
    pasado.current = [];
    futuro.current = [];
    return true;
  }, [avisar, datosWeb.medios, pagina.id, poner, registrarMedio]);

  const entrar = async () => {
    setCargando(true);
    if (await cargar()) {
      setAbiertoEditor(true);
      setMinimizado(false);
    }
    setCargando(false);
  };

  // Desde el panel se llega con ?editar=1: el editor se abre solo
  const entrarRef = useRef(entrar);
  entrarRef.current = entrar;
  useEffect(() => {
    if (!admin) return;
    const url = new URL(window.location.href);
    if (!url.searchParams.has("editar")) return;
    url.searchParams.delete("editar");
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
    void entrarRef.current();
  }, [admin]);

  // Lo que difiere de lo publicado es lo que va al borrador
  const cambios = useMemo(() => (estado && publicado ? calcularCambios(estado, publicado) : null), [estado, publicado]);
  const hayCambios = !!cambios && Object.keys(cambios).length > 0;
  const guardado = useAutoguardado("paginas", abiertoEditor ? pagina.id : null, abiertoEditor ? cambios : null, cambiosIniciales);

  const salir = async () => {
    await guardado.guardarYa();
    setHayBorradorInicial(hayCambios);
    setAbiertoEditor(false);
    poner(null);
    setAbierto(null);
  };

  const alPublicar = async () => {
    setPublicando(true);
    const ok = await guardado.guardarYa();
    if (ok) {
      const r = await publicar("paginas", pagina.id);
      if (r.ok) {
        avisar("Publicado. Ya se ve en la web.");
        setHayBorradorInicial(false);
        setAbiertoEditor(false);
        poner(null);
        router.refresh();
      } else avisar(r.error, "error");
    }
    setPublicando(false);
  };

  const alDescartar = async () => {
    const si = await confirmar({
      titulo: "¿Descartar los cambios?",
      texto: "La página vuelve a ser exactamente la que se ve en la web. Lo que no has publicado se pierde.",
      aceptar: "Descartar",
      peligro: true,
    });
    if (!si) return;
    await guardado.guardarYa();
    const r = await descartar("paginas", pagina.id);
    if (!r.ok) return avisar(r.error, "error");
    await cargar();
    avisar("Cambios descartados");
  };

  // ---- La página se pinta con el borrador ---------------------------------------------------------

  const acciones = useRef({ mover, alternarVisible, duplicar, borrar, abrir: (id: string) => id });
  acciones.current = {
    mover,
    alternarVisible,
    duplicar,
    borrar,
    abrir: (id: string) => {
      setMinimizado(false);
      setPestana("secciones");
      setAbierto(id);
      return id;
    },
  };
  const Herramientas = useMemo(() => crearHerramientas(acciones), []);
  const edicion = useMemo<Edicion>(() => ({ cambiar: cambiarDato, elegirMedio, soltarArchivo, Herramientas }), [cambiarDato, elegirMedio, soltarArchivo, Herramientas]);

  useEffect(() => {
    if (!abiertoEditor || !estado) alCambiarVista(null);
    else alCambiarVista({ bloques: estado.bloques, medios, edicion: minimizado ? null : edicion });
  }, [abiertoEditor, estado, medios, edicion, minimizado, alCambiarVista]);
  useEffect(() => () => alCambiarVista(null), [alCambiarVista]);

  // Deshacer y rehacer con el teclado (en un campo de texto manda el deshacer del propio campo)
  useEffect(() => {
    if (!abiertoEditor) return;
    const teclas = (e: KeyboardEvent) => {
      const enCampo = (e.target as HTMLElement)?.closest("input, textarea, select, [contenteditable]");
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
  }, [abiertoEditor, deshacer, rehacer]);

  const opciones = useMemo(
    () => ({
      proyectos: datosWeb.proyectos.map((p) => ({ valor: p.id, nombre: p.titulo })),
      // Tipos de proyecto que tienen algo publicado (para «Solo proyectos de estos tipos»)
      tipos: [...new Map(datosWeb.proyectos.flatMap((p) => (p.tipo ? [[p.tipo.slug, { valor: p.tipo.slug, nombre: p.tipo.nombre }] as const] : []))).values()],
    }),
    [datosWeb.proyectos],
  );

  if (!admin) return null;

  return (
    <ProveedorMediosControlado value={contextoMedios}>
      <ProveedorOpciones opciones={opciones}>
        {/* Pastilla para entrar */}
        <AnimatePresence>
          {!abiertoEditor && (
            <motion.button
              type="button"
              onClick={entrar}
              disabled={cargando}
              className="cristal cristal-fuerte boton fixed bottom-4 right-4 z-[60] px-4 py-3 text-[13px] sm:bottom-5 sm:right-5"
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ duration: 0.45, ease: CURVA }}
              title={hayBorradorInicial ? "Tienes cambios sin publicar en esta página" : undefined}
            >
              <Icono nombre="lapiz" className="h-4 w-4" />
              <span>{cargando ? "Abriendo…" : "Editar página"}</span>
              {hayBorradorInicial && <span className="ml-0.5 h-2 w-2 rounded-full bg-[var(--jm-calido)]" aria-label="Con cambios sin publicar" />}
            </motion.button>
          )}
        </AnimatePresence>

        {/* Barra pequeña en vista previa */}
        <AnimatePresence>
          {abiertoEditor && minimizado && (
            <motion.div
              className="cristal cristal-fuerte fixed bottom-4 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-1.5 rounded-full p-1.5 pl-5 text-[13px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.45, ease: CURVA }}
            >
              <span className="mr-2 whitespace-nowrap text-[var(--jm-suave)]">Vista previa · {hayCambios ? "sin publicar" : "sin cambios"}</span>
              <button type="button" onClick={() => setMinimizado(false)} className="boton boton-suave px-4 py-2">
                <Icono nombre="lapiz" className="h-4 w-4" />
                Seguir editando
              </button>
              <button type="button" onClick={alPublicar} disabled={!hayCambios || publicando} className="boton boton-acento px-4 py-2 disabled:opacity-40">
                {publicando ? "Publicando…" : "Publicar"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Panel */}
        <AnimatePresence>
          {abiertoEditor && !minimizado && estado && (
            <motion.aside
              className="cristal cristal-fuerte fixed inset-x-2 bottom-2 z-[80] flex max-h-[72svh] flex-col overflow-hidden rounded-[28px] sm:inset-x-auto sm:bottom-3 sm:right-3 sm:top-3 sm:max-h-none sm:w-[400px]"
              initial={{ opacity: 0, x: 40, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.98 }}
              transition={{ duration: 0.45, ease: CURVA }}
              aria-label={`Editor de ${pagina.titulo}`}
              data-lenis-prevent
            >
              <header className="border-b border-[var(--jm-borde)] px-5 pb-3 pt-4">
                <div className="flex items-center gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--jm-acento)]">Editando</p>
                    <h2 className="truncate text-lg font-extrabold tracking-tight">{estado.pagina.titulo || pagina.titulo}</h2>
                  </div>
                  <button type="button" className="boton-icono" onClick={deshacer} disabled={!pasado.current.length} aria-label="Deshacer" title="Deshacer (Ctrl+Z)">
                    <Icono nombre="deshacer" className="h-[18px] w-[18px]" />
                  </button>
                  <button type="button" className="boton-icono" onClick={rehacer} disabled={!futuro.current.length} aria-label="Rehacer" title="Rehacer (Ctrl+Mayús+Z)">
                    <Icono nombre="rehacer" className="h-[18px] w-[18px]" />
                  </button>
                  <button type="button" className="boton-icono" onClick={() => setMinimizado(true)} aria-label="Vista previa" title="Ver la página como quedará">
                    <Icono nombre="ojo" className="h-[18px] w-[18px]" />
                  </button>
                  <button type="button" className="boton-icono" onClick={salir} aria-label="Salir del editor" title="Salir (lo que has hecho queda guardado)">
                    <Icono nombre="cerrar" className="h-5 w-5" />
                  </button>
                </div>
                <p className={`mt-1.5 flex items-center gap-1.5 text-xs ${guardado.estado === "error" ? "text-[#ff6b6b]" : "text-[var(--jm-tenue)]"}`} aria-live="polite">
                  <span className={`h-1.5 w-1.5 rounded-full ${guardado.estado === "guardado" ? (hayCambios ? "bg-[var(--jm-calido)]" : "bg-[#34c759]") : guardado.estado === "error" ? "bg-[#ff453a]" : "bg-white/40"}`} />
                  {textoGuardado(guardado.estado, hayCambios, guardado.error)}
                </p>
                <div className="mt-3 grid grid-cols-2 gap-1 rounded-full bg-black/25 p-1 text-[13px] font-semibold">
                  {(["secciones", "pagina"] as const).map((p) => (
                    <button key={p} type="button" onClick={() => setPestana(p)} className={`relative rounded-full py-1.5 transition-colors ${pestana === p ? "text-[var(--jm-texto)]" : "text-[var(--jm-tenue)] hover:text-[var(--jm-suave)]"}`}>
                      {pestana === p && <motion.span layoutId="pestana-editor" className="absolute inset-0 rounded-full bg-white/10" transition={{ duration: 0.4, ease: CURVA }} />}
                      <span className="relative">{p === "secciones" ? "Secciones" : "Página"}</span>
                    </button>
                  ))}
                </div>
              </header>

              <div className="sin-barra flex-1 overflow-y-auto p-3" data-lenis-prevent>
                {pestana === "secciones" ? (
                  <>
                    <Reorder.Group axis="y" values={estado.bloques} onReorder={(lista) => aplicar((e) => ({ ...e, bloques: lista }), "reordenar")} className="flex flex-col gap-2">
                      {estado.bloques.map((b) => (
                        <FilaSeccion
                          key={b.id}
                          bloque={b}
                          abierto={abierto === b.id}
                          alAbrir={() => {
                            const nuevo = abierto === b.id ? null : b.id;
                            setAbierto(nuevo);
                            if (nuevo) irA(nuevo);
                          }}
                          alCambiarDatos={(clave, valor) => cambiarDato(b.id, [clave], valor)}
                          alAlternarVisible={() => alternarVisible(b.id)}
                          alDuplicar={() => duplicar(b.id)}
                          alBorrar={() => borrar(b.id)}
                        />
                      ))}
                    </Reorder.Group>
                    <AnimatePresence initial={false}>
                      {catalogo && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: CURVA }} className="overflow-hidden">
                          <div className="mt-3 grid grid-cols-1 gap-1 rounded-[24px] border border-dashed border-[var(--jm-borde)] p-2">
                            <p className="px-3 pb-1 pt-2 text-xs text-[var(--jm-tenue)]">{abierto ? "Se añade detrás de la sección abierta" : "Se añade antes de «Hablemos»"}</p>
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
                    <p className="mt-4 px-2 text-xs leading-relaxed text-[var(--jm-tenue)]">
                      Consejo: haz clic en cualquier texto de la página para cambiarlo ahí mismo, y arrastra una foto encima de una imagen para sustituirla.
                    </p>
                  </>
                ) : (
                  <div className="p-2">
                    <Campos campos={CAMPOS_PAGINA} datos={estado.pagina} cambiar={(k, v) => aplicar((e) => ({ ...e, pagina: { ...e.pagina, [k]: v } }), `pagina:${k}`)} />
                    <Historial
                      paginaId={pagina.id}
                      alRestaurar={async () => {
                        await cargar();
                        setPestana("secciones");
                      }}
                    />
                  </div>
                )}
              </div>

              <footer className="flex items-center gap-2 border-t border-[var(--jm-borde)] p-3">
                <button type="button" onClick={alDescartar} disabled={!hayCambios} className="boton px-4 py-2.5 text-sm text-[var(--jm-suave)] hover:bg-[var(--jm-cristal)] disabled:opacity-35">
                  Descartar
                </button>
                <button type="button" onClick={alPublicar} disabled={!hayCambios || publicando} className="boton boton-acento ml-auto px-6 py-2.5 text-sm disabled:opacity-40">
                  {publicando ? "Publicando…" : "Publicar"}
                </button>
              </footer>
            </motion.aside>
          )}
        </AnimatePresence>

        <SelectorMedios
          abierto={!!selector}
          acepta={selector?.acepta ?? "imagen"}
          alCerrar={() => setSelector(null)}
          alElegir={(m) => {
            if (!selector) return;
            registrarMedio(m);
            cambiarDato(selector.bloque, selector.ruta, m[0].id);
          }}
        />
      </ProveedorOpciones>
    </ProveedorMediosControlado>
  );
}

/** Lleva la página a una sección (centrada) y la resalta un momento */
function irA(id: string) {
  window.setTimeout(() => {
    const el = document.getElementById(`bloque-${id}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: el.offsetHeight > window.innerHeight ? "start" : "center" });
    el.setAttribute("data-resaltada", "");
    window.setTimeout(() => el.removeAttribute("data-resaltada"), 1600);
  }, 80);
}

function resaltar(id: string, si: boolean) {
  const el = document.getElementById(`bloque-${id}`);
  if (si) el?.setAttribute("data-resaltada", "");
  else el?.removeAttribute("data-resaltada");
}

// ---- Fila de una sección en el panel --------------------------------------------------------------

function FilaSeccion({
  bloque,
  abierto,
  alAbrir,
  alCambiarDatos,
  alAlternarVisible,
  alDuplicar,
  alBorrar,
}: {
  bloque: BloqueEditable;
  abierto: boolean;
  alAbrir: () => void;
  alCambiarDatos: (clave: string, valor: unknown) => void;
  alAlternarVisible: () => void;
  alDuplicar: () => void;
  alBorrar: () => void;
}) {
  const controles = useDragControls();
  const info = CATALOGO[bloque.tipo];
  const ref = useRef<HTMLLIElement>(null);
  useEffect(() => {
    if (abierto) window.setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 450);
  }, [abierto]);

  return (
    <Reorder.Item
      ref={ref}
      value={bloque}
      dragListener={false}
      dragControls={controles}
      onPointerEnter={() => resaltar(bloque.id, true)}
      onPointerLeave={() => resaltar(bloque.id, false)}
      className={`rounded-[24px] border bg-[var(--jm-cristal)] transition-[opacity,border-color] duration-300 ${abierto ? "border-white/25" : "border-[var(--jm-borde)]"} ${bloque.visible ? "" : "opacity-55"}`}
      whileDrag={{ scale: 1.03, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.5)" }}
    >
      <div className="flex items-center gap-0.5 p-1.5">
        <button type="button" onPointerDown={(e) => controles.start(e)} className="flex h-9 w-7 shrink-0 cursor-grab touch-none items-center justify-center text-[var(--jm-tenue)] active:cursor-grabbing" aria-label={`Arrastrar ${info?.nombre}`}>
          <Icono nombre="asa" className="h-4 w-4" />
        </button>
        <button type="button" onClick={alAbrir} className="min-w-0 flex-1 py-1 text-left">
          <span className="block truncate text-sm font-semibold">{nombreBloque(bloque.tipo, bloque.datos)}</span>
          <span className="block text-[11px] text-[var(--jm-tenue)]">
            {info?.nombre ?? bloque.tipo}
            {!bloque.visible && " · oculta"}
          </span>
        </button>
        <button type="button" onClick={alAlternarVisible} className="boton-icono" aria-label={bloque.visible ? "Ocultar sección" : "Mostrar sección"} title={bloque.visible ? "Ocultar" : "Mostrar"}>
          <Icono nombre={bloque.visible ? "ojo" : "ojo-no"} className="h-4 w-4" />
        </button>
        <button type="button" onClick={alAbrir} className={`boton-icono ${abierto ? "!text-[var(--jm-acento)]" : ""}`} aria-label="Editar sección" aria-expanded={abierto}>
          <Icono nombre="lapiz" className="h-4 w-4" />
        </button>
      </div>
      <AnimatePresence initial={false}>
        {abierto && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: CURVA }} className="overflow-hidden">
            <div className="px-3 pb-3 pt-2">
              {info ? <Campos campos={info.campos} datos={bloque.datos} cambiar={alCambiarDatos} /> : <p className="text-sm text-[var(--jm-suave)]">Esta sección no tiene campos editables aquí.</p>}
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

// ---- Barra de cada sección en la página -----------------------------------------------------------

type Acciones = {
  mover: (id: string, paso: number) => void;
  alternarVisible: (id: string) => void;
  duplicar: (id: string) => void;
  borrar: (id: string) => void;
  abrir: (id: string) => string;
};

/** Componente estable (no cambia entre renders) que lee las acciones del editor al pulsar */
function crearHerramientas(acciones: React.RefObject<Acciones>) {
  return function Herramientas({ bloque, indice, total }: { bloque: BloqueEditable; indice: number; total: number }) {
    const a = () => acciones.current;
    return (
      // A la izquierda (pasado el índice lateral): a la derecha la taparía el panel del editor
      <div className={`pointer-events-none absolute left-3 z-30 flex sm:left-24 ${bloque.tipo === "portada" ? "top-24" : "top-4 sm:top-6"}`}>
        <div className="cristal cristal-fuerte pointer-events-auto flex items-center gap-0.5 rounded-full p-1 opacity-0 shadow-xl transition-opacity duration-300 group-hover/seccion:opacity-100 focus-within:opacity-100 [@media(hover:none)]:opacity-100">
          <span className="hidden whitespace-nowrap px-3 text-xs font-semibold text-[var(--jm-suave)] sm:inline">
            {CATALOGO[bloque.tipo]?.nombre}
            {!bloque.visible && " · oculta"}
          </span>
          <button type="button" className="boton-icono !h-8 !w-8" disabled={indice === 0} onClick={() => a().mover(bloque.id, -1)} aria-label="Subir sección" title="Subir">
            <Icono nombre="arriba" className="h-4 w-4" />
          </button>
          <button type="button" className="boton-icono !h-8 !w-8" disabled={indice === total - 1} onClick={() => a().mover(bloque.id, 1)} aria-label="Bajar sección" title="Bajar">
            <Icono nombre="abajo" className="h-4 w-4" />
          </button>
          <button type="button" className="boton-icono !h-8 !w-8" onClick={() => a().alternarVisible(bloque.id)} aria-label={bloque.visible ? "Ocultar sección" : "Mostrar sección"} title={bloque.visible ? "Ocultar" : "Mostrar"}>
            <Icono nombre={bloque.visible ? "ojo" : "ojo-no"} className="h-4 w-4" />
          </button>
          <button type="button" className="boton-icono !h-8 !w-8" onClick={() => a().duplicar(bloque.id)} aria-label="Duplicar sección" title="Duplicar">
            <Icono nombre="duplicar" className="h-4 w-4" />
          </button>
          <button type="button" className="boton-icono !h-8 !w-8" onClick={() => a().borrar(bloque.id)} aria-label="Borrar sección" title="Borrar">
            <Icono nombre="papelera" className="h-4 w-4" />
          </button>
          <button type="button" className="boton boton-acento ml-0.5 h-8 px-3.5 text-xs" onClick={() => a().abrir(bloque.id)}>
            <Icono nombre="lapiz" className="h-3.5 w-3.5" />
            Editar
          </button>
        </div>
      </div>
    );
  };
}
