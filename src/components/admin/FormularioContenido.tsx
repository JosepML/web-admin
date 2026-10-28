"use client";

// Formulario genérico del panel para una fila con borrador y publicado (proyectos hoy; artículos, servicios,
// clientes... en las tareas S14 a S16). Se describe con secciones de campos (src/components/admin/campos/tipos.ts)
// y hace lo mismo para todas: autoguardado, Publicar, Descartar, vista previa, ocultar e historial.
// Receta en plan/patron-panel.md.

import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { cambiarVisible, descartar, publicar, restaurar, revisiones, type ParaEditar, type Revision } from "@/lib/admin/contenido";
import type { TablaContenido } from "@/lib/admin/tipos";
import { CURVA } from "@/styles/movimiento";
import { Icono } from "../Iconos";
import { Campos, ProveedorOpciones } from "./campos/Campos";
import { ProveedorMedios } from "./campos/medios";
import { uuidsEn, type Campo, type OpcionesFormulario } from "./campos/tipos";
import { useDialogos } from "./Dialogos";
import { textoGuardado, useAutoguardado } from "./useAutoguardado";

export type SeccionFormulario = { id: string; titulo: string; descripcion?: string; campos: Campo[] };

type Datos = Record<string, unknown>;

type Props = {
  tabla: TablaContenido;
  id: string;
  inicial: ParaEditar;
  secciones: SeccionFormulario[];
  opciones?: OpcionesFormulario;
  /** Vuelta a la lista */
  volver: { href: string; texto: string };
  /** Ruta pública con los datos actuales (para «Ver en la web» y la vista previa). null si no tiene página */
  rutaPublica?: (datos: Datos) => string | null;
  /** Título grande del formulario */
  titulo: (datos: Datos) => string;
  /** Claves cuyo orden no importa al comparar (listas de ids, como los servicios de un proyecto) */
  sinOrden?: string[];
};

/** Claves de primer nivel que edita el formulario */
const clavesDe = (secciones: SeccionFormulario[]) => secciones.flatMap((s) => s.campos.filter((c) => c.tipo !== "nota" && c.tipo !== "google").map((c) => c.clave));

function normalizar(v: unknown, sinOrden: boolean) {
  if (sinOrden && Array.isArray(v)) return JSON.stringify([...v].sort());
  // null, "" y ausente cuentan igual: un campo que Josep vacía no es un cambio si ya estaba vacío
  if (v === undefined || v === null || v === "") return "∅";
  return JSON.stringify(v);
}

export function FormularioContenido({ tabla, id, inicial, secciones, opciones = {}, volver, rutaPublica, titulo, sinOrden = [] }: Props) {
  const router = useRouter();
  const { confirmar, avisar } = useDialogos();
  const claves = useMemo(() => clavesDe(secciones), [secciones]);

  const [base, setBase] = useState(inicial);
  const publicado = useMemo<Datos>(() => {
    const d: Datos = {};
    for (const k of claves) d[k] = k in base.fila ? base.fila[k] : base.extras[k];
    return d;
  }, [base, claves]);
  const desdeBorrador = (b: ParaEditar) => {
    const d: Datos = {};
    for (const k of claves) d[k] = b.borrador && k in b.borrador ? b.borrador[k] : k in b.fila ? b.fila[k] : b.extras[k];
    return d;
  };
  const [datos, setDatos] = useState<Datos>(() => desdeBorrador(inicial));
  const [publicando, setPublicando] = useState(false);
  const [estadoFila, setEstadoFila] = useState({ estado: String(inicial.fila.estado), publicadoEn: inicial.fila.publicado_en as string | null });

  const calcular = (d: Datos, pub: Datos) => {
    const c: Datos = {};
    for (const k of claves) if (normalizar(d[k], sinOrden.includes(k)) !== normalizar(pub[k], sinOrden.includes(k))) c[k] = d[k] ?? null;
    return c;
  };
  const cambios = useMemo(() => calcular(datos, publicado), [datos, publicado]); // eslint-disable-line react-hooks/exhaustive-deps
  const cambiosIniciales = useMemo(() => calcular(desdeBorrador(base), publicado), [base, publicado]); // eslint-disable-line react-hooks/exhaustive-deps
  const hayCambios = Object.keys(cambios).length > 0;
  const guardado = useAutoguardado(tabla, id, cambios, cambiosIniciales);

  const nuevo = !estadoFila.publicadoEn;
  const oculto = !nuevo && estadoFila.estado !== "publicado";
  const ruta = rutaPublica?.(datos) ?? null;
  const ids = useMemo(() => [...uuidsEn(datos)], [datos]);

  const recargar = async (despues?: () => void) => {
    router.refresh();
    despues?.();
  };

  const alPublicar = async () => {
    setPublicando(true);
    if (await guardado.guardarYa()) {
      const r = await publicar(tabla, id);
      if (r.ok) {
        avisar(nuevo ? "Publicado. Ya está en la web." : "Cambios publicados.");
        // Lo publicado pasa a ser lo que hay ahora
        setBase({ fila: { ...base.fila, ...datos, estado: "publicado", publicado_en: estadoFila.publicadoEn ?? new Date().toISOString() }, borrador: null, extras: { ...base.extras, ...Object.fromEntries(Object.entries(datos).filter(([k]) => k in base.extras)) }, actualizadoEn: null });
        setEstadoFila({ estado: "publicado", publicadoEn: estadoFila.publicadoEn ?? new Date().toISOString() });
        void recargar();
      } else avisar(r.error, "error");
    }
    setPublicando(false);
  };

  const alDescartar = async () => {
    const si = await confirmar({ titulo: "¿Descartar los cambios?", texto: "Vuelve a lo que se ve en la web. Lo que no has publicado se pierde.", aceptar: "Descartar", peligro: true });
    if (!si) return;
    await guardado.guardarYa();
    const r = await descartar(tabla, id);
    if (!r.ok) return avisar(r.error, "error");
    const limpio = { ...base, borrador: null };
    setBase(limpio);
    setDatos(desdeBorrador(limpio));
    avisar("Cambios descartados");
  };

  const alternarVisible = async () => {
    if (!oculto && !nuevo) {
      const si = await confirmar({ titulo: "¿Ocultar de la web?", texto: "Deja de verse en la web al momento. Puedes volver a mostrarlo cuando quieras.", aceptar: "Ocultar" });
      if (!si) return;
    }
    const r = await cambiarVisible(tabla, id, oculto || nuevo);
    if (!r.ok) return avisar(r.error, "error");
    setEstadoFila({ estado: oculto || nuevo ? "publicado" : "borrador", publicadoEn: estadoFila.publicadoEn ?? new Date().toISOString() });
    avisar(oculto ? "Visible otra vez en la web" : nuevo ? "Publicado" : "Oculto");
    if (nuevo) setBase({ ...base, borrador: null, fila: { ...base.fila, ...datos } });
    void recargar();
  };

  return (
    <ProveedorMedios ids={ids}>
      <ProveedorOpciones opciones={opciones}>
        <div className="mx-auto max-w-5xl">
          {/* Cabecera fija: estado, guardado y acciones */}
          <div className="sticky top-16 z-30 -mx-2 mb-8 lg:top-4">
            <div className="cristal cristal-fuerte flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[28px] px-5 py-3.5">
              <Link href={volver.href} className="boton-icono -ml-2" aria-label={volver.texto} title={volver.texto}>
                <Icono nombre="izquierda" />
              </Link>
              <div className="min-w-0 flex-1">
                <h1 className="truncate text-lg font-extrabold tracking-tight sm:text-xl">{titulo(datos) || "Sin título"}</h1>
                <p className={`flex items-center gap-1.5 text-xs ${guardado.estado === "error" ? "text-[#ff6b6b]" : "text-[var(--jm-tenue)]"}`} aria-live="polite">
                  <Estado nuevo={nuevo} oculto={oculto} />
                  <span>·</span>
                  {textoGuardado(guardado.estado, hayCambios, guardado.error)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {ruta && (
                  <a href={`/admin/vista-previa?ruta=${encodeURIComponent(ruta)}`} target="_blank" rel="noreferrer" className="boton boton-suave px-4 py-2 text-sm" title="Abre la página con tus cambios sin publicar">
                    <Icono nombre="ojo" className="h-4 w-4" />
                    Vista previa
                  </a>
                )}
                {hayCambios && !nuevo && (
                  <button type="button" onClick={alDescartar} className="boton px-4 py-2 text-sm text-[var(--jm-suave)] hover:bg-[var(--jm-cristal)]">
                    Descartar
                  </button>
                )}
                <button type="button" onClick={alPublicar} disabled={publicando || (!hayCambios && !nuevo && !oculto)} className="boton boton-acento px-5 py-2 text-sm disabled:opacity-40">
                  {publicando ? "Publicando…" : nuevo ? "Publicar" : oculto && !hayCambios ? "Publicar y mostrar" : "Publicar cambios"}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:grid lg:grid-cols-[180px_1fr] lg:gap-10">
            {/* Índice de secciones */}
            <nav className="sticky top-32 hidden self-start lg:block" aria-label="Secciones del formulario">
              <ul className="flex flex-col gap-0.5 text-sm">
                {secciones.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="block rounded-full px-3 py-1.5 text-[var(--jm-suave)] transition-colors hover:bg-[var(--jm-cristal)] hover:text-[var(--jm-texto)]">
                      {s.titulo}
                    </a>
                  </li>
                ))}
                <li>
                  <a href="#historial" className="block rounded-full px-3 py-1.5 text-[var(--jm-tenue)] transition-colors hover:bg-[var(--jm-cristal)] hover:text-[var(--jm-texto)]">
                    Historial
                  </a>
                </li>
              </ul>
            </nav>

            <div className="flex min-w-0 flex-col gap-4">
              {secciones.map((s, i) => (
                <motion.section
                  key={s.id}
                  id={s.id}
                  className="cristal scroll-mt-36 rounded-[32px] p-5 sm:p-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: Math.min(i, 4) * 0.06, ease: CURVA }}
                >
                  <h2 className="text-lg font-extrabold tracking-tight">{s.titulo}</h2>
                  {s.descripcion && <p className="mt-1 text-sm text-[var(--jm-suave)]">{s.descripcion}</p>}
                  <div className="mt-6">
                    <Campos campos={s.campos} datos={datos} cambiar={(k, v) => setDatos((d) => ({ ...d, [k]: v }))} />
                  </div>
                </motion.section>
              ))}

              <section className="cristal rounded-[32px] p-5 sm:p-8">
                <h2 className="text-lg font-extrabold tracking-tight">Visibilidad</h2>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                  <p className="max-w-md text-sm text-[var(--jm-suave)]">
                    {nuevo
                      ? "Aún no se ve en la web. Publica cuando esté listo."
                      : oculto
                        ? "Está oculto: no se ve en la web, pero no se pierde nada."
                        : "Se ve en la web. Puedes ocultarlo sin borrarlo."}
                  </p>
                  {!nuevo && (
                    <button type="button" onClick={alternarVisible} className="boton boton-suave px-4 py-2 text-sm">
                      <Icono nombre={oculto ? "ojo" : "ojo-no"} className="h-4 w-4" />
                      {oculto ? "Volver a mostrar" : "Ocultar de la web"}
                    </button>
                  )}
                </div>
              </section>

              <Historial
                tabla={tabla}
                id={id}
                alRestaurar={(r) => {
                  const d: Datos = {};
                  for (const k of claves) if (k in r.datos) d[k] = r.datos[k];
                  setDatos((previo) => ({ ...previo, ...d }));
                }}
              />
            </div>
          </div>
        </div>
      </ProveedorOpciones>
    </ProveedorMedios>
  );
}

function Estado({ nuevo, oculto }: { nuevo: boolean; oculto: boolean }) {
  const [color, texto] = nuevo ? ["bg-white/40", "Sin publicar"] : oculto ? ["bg-[#ff9f0a]", "Oculto"] : ["bg-[#34c759]", "En la web"];
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-1.5 w-1.5 rounded-full ${color}`} />
      {texto}
    </span>
  );
}

function Historial({ tabla, id, alRestaurar }: { tabla: TablaContenido; id: string; alRestaurar: (r: Revision) => void }) {
  const { confirmar, avisar } = useDialogos();
  const [lista, setLista] = useState<Revision[] | null>(null);
  useEffect(() => {
    revisiones(tabla, id).then((r) => setLista(r.ok ? r.datos : []));
  }, [tabla, id]);
  return (
    <section id="historial" className="cristal scroll-mt-36 rounded-[32px] p-5 sm:p-8">
      <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
        <Icono nombre="historial" className="h-5 w-5" />
        Historial
      </h2>
      <p className="mt-1 text-sm text-[var(--jm-suave)]">Cada vez que publicas se guarda la versión anterior (las 30 últimas). Recuperar una la pone en el formulario, sin publicarla.</p>
      {lista && !lista.length && <p className="mt-4 text-sm text-[var(--jm-tenue)]">Aún no hay versiones anteriores.</p>}
      <ul className="mt-4 flex flex-col gap-1.5">
        {lista?.map((r) => (
          <li key={r.id} className="flex items-center justify-between gap-2 rounded-[18px] border border-[var(--jm-borde)] px-4 py-2.5 text-sm">
            <span>{new Date(r.creadoEn).toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" })}</span>
            <button
              type="button"
              className="text-xs font-semibold text-[var(--jm-acento)] hover:underline"
              onClick={async () => {
                if (!(await confirmar({ titulo: "¿Recuperar esta versión?", texto: "Sustituye lo que tienes en el formulario. La web no cambia hasta que publiques.", aceptar: "Recuperar" }))) return;
                const res = await restaurar(r.id);
                if (!res.ok) return avisar(res.error, "error");
                alRestaurar(r);
                avisar("Versión recuperada. Revísala y publica.");
              }}
            >
              Recuperar
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
