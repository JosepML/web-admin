"use client";

// Modo «Editar página»: la parte que va en la web pública. Es pequeña a propósito: un visitante solo carga
// esto, que no hace nada si no hay sesión. El editor de verdad (EditorPagina, con el panel, los formularios y
// el guardado) se descarga aparte, solo cuando el navegador tiene la sesión de Josep.

import dynamic from "next/dynamic";
import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Bloque, DatosWeb, Medio, TipoBloque } from "@/lib/datos/tipos";
import { ProveedorDatos, useDatos } from "../marco/DatosWeb";

export type Ruta = (string | number)[];

/** Un bloque tal como lo edita el editor (también los ocultos) */
export type BloqueEditable = { id: string; tipo: TipoBloque; visible: boolean; datos: Record<string, unknown> };

export type Edicion = {
  /** Cambia un valor de los datos de un bloque (ruta dentro de `datos`) */
  cambiar: (bloque: string, ruta: Ruta, valor: unknown) => void;
  /** Abre el selector de imágenes para un campo de un bloque */
  elegirMedio: (bloque: string, ruta: Ruta, acepta?: "imagen" | "video") => void;
  /** Sube un archivo soltado sobre la página y lo pone en el campo */
  soltarArchivo: (bloque: string, ruta: Ruta, archivo: File) => void;
  /** Barra de herramientas de cada sección (subir, bajar, ocultar, duplicar, editar) */
  Herramientas: React.ComponentType<{ bloque: BloqueEditable; indice: number; total: number }>;
};

const ContextoEdicion = createContext<Edicion | null>(null);
const ContextoBloque = createContext<string | null>(null);

export const useEdicion = () => useContext(ContextoEdicion);
/** ¿Se está editando el bloque que contiene a este componente? (para enseñar los campos vacíos) */
export function useEditando() {
  const edicion = useContext(ContextoEdicion);
  const bloque = useContext(ContextoBloque);
  return !!edicion && !!bloque;
}
export const ProveedorBloque = ContextoBloque.Provider;

// ---- Sesión ---------------------------------------------------------------------------------------

/** ¿El navegador tiene la cookie de sesión de Supabase? (no dice si es válida: eso lo comprueba el editor) */
function useConCookieDeSesion() {
  return useSyncExternalStore(
    () => () => {},
    () => /(?:^|;\s*)sb-[^=]+-auth-token/.test(document.cookie),
    () => false,
  );
}

const EditorPagina = dynamic(() => import("./EditorPagina").then((m) => m.EditorPagina), { ssr: false });

/** Lo que el editor pide pintar. Sin `edicion` (vista previa) la página se ve tal cual quedará, sin herramientas */
export type VistaEdicion = { bloques: BloqueEditable[]; medios: Record<string, Medio>; edicion: Edicion | null } | null;

/**
 * Envuelve una página de bloques. Sin sesión pinta los bloques publicados y nada más. Con la sesión de Josep
 * carga el editor, que enseña la pastilla «Editar página»; mientras edita, la página se pinta con el borrador.
 */
export function ZonaEdicion({
  pagina,
  publicados,
  children,
}: {
  pagina?: { id: string; slug: string; titulo: string };
  publicados: Bloque[];
  children: (bloques: (Bloque & { oculto?: boolean })[]) => React.ReactNode;
}) {
  const conSesion = useConCookieDeSesion();
  const datos = useDatos();
  const [vista, setVista] = useState<VistaEdicion>(null);

  const editor = pagina && conSesion ? <EditorPagina pagina={pagina} alCambiarVista={setVista} /> : null;
  // La estructura es siempre la misma (con o sin edición) para que React no vuelva a montar el editor ni las secciones
  const bloques = !vista
    ? publicados
    : vista.edicion
      ? vista.bloques.map((b) => ({ id: b.id, tipo: b.tipo, datos: b.datos, oculto: !b.visible }))
      : vista.bloques.filter((b) => b.visible).map((b) => ({ id: b.id, tipo: b.tipo, datos: b.datos }));
  return (
    <>
      <ProveedorDatos datos={vista ? ({ ...datos, medios: { ...datos.medios, ...vista.medios } } satisfies DatosWeb) : datos}>
        <ContextoEdicion.Provider value={vista?.edicion ?? null}>
          <div className={vista?.edicion ? "jm-editando" : undefined}>{children(bloques)}</div>
        </ContextoEdicion.Provider>
      </ProveedorDatos>
      {editor}
    </>
  );
}

// ---- Texto editable en su sitio -------------------------------------------------------------------

/**
 * Texto de un bloque que Josep cambia haciendo clic encima. Fuera del modo edición devuelve `children` tal cual.
 * `campo`: ruta dentro de `datos` («titulo», «pasos.0.texto»). `valor`: el texto crudo (con sus *asteriscos*).
 */
export function Editable({
  campo,
  valor,
  children,
  multilinea,
  bloqueHtml,
  vacio = "Escribe aquí",
}: {
  campo: string;
  valor: string | undefined;
  children?: React.ReactNode;
  multilinea?: boolean;
  /** El contenido son párrafos (div): el envoltorio también tiene que ser de bloque */
  bloqueHtml?: boolean;
  vacio?: string;
}) {
  const edicion = useContext(ContextoEdicion);
  const bloque = useContext(ContextoBloque);
  const [abierto, setAbierto] = useState(false);
  if (!edicion || !bloque) return <>{children}</>;

  const ruta: Ruta = campo.split(".").map((k) => (/^\d+$/.test(k) ? Number(k) : k));
  if (abierto)
    return <EnLinea valor={valor ?? ""} multilinea={multilinea} alCambiar={(v) => edicion.cambiar(bloque, ruta, v)} alCerrar={() => setAbierto(false)} bloqueHtml={bloqueHtml} />;

  const Etiqueta = bloqueHtml ? "div" : "span";
  return (
    <Etiqueta
      className="jm-editable"
      role="button"
      tabIndex={0}
      title="Clic para editar"
      onClickCapture={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setAbierto(true);
      }}
      onKeyDown={(e) => e.key === "Enter" && setAbierto(true)}
    >
      {valor?.trim() ? children : <span className="jm-editable-vacio">{vacio}</span>}
    </Etiqueta>
  );
}

function EnLinea({ valor, multilinea, alCambiar, alCerrar, bloqueHtml }: { valor: string; multilinea?: boolean; alCambiar: (v: string) => void; alCerrar: () => void; bloqueHtml?: boolean }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const inicial = useRef(valor);
  // Copia local: la página se repinta con el cambio un instante después, y escribiendo rápido se perderían letras
  const [texto, setTexto] = useState(valor);
  const escribir = (v: string) => {
    setTexto(v);
    alCambiar(v);
  };
  useEffect(() => {
    const t = ref.current;
    if (!t) return;
    t.focus();
    t.setSelectionRange(t.value.length, t.value.length);
  }, []);
  useEffect(() => {
    const t = ref.current;
    if (!t) return;
    t.style.height = "auto";
    t.style.height = `${t.scrollHeight}px`;
  }, [texto]);
  const area = (
    <textarea
      ref={ref}
      className="jm-en-linea"
      value={texto}
      rows={1}
      onChange={(e) => escribir(multilinea ? e.target.value : e.target.value.replace(/\n/g, " "))}
      onBlur={alCerrar}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          escribir(inicial.current);
          alCerrar();
        }
        if (e.key === "Enter" && !multilinea) {
          e.preventDefault();
          alCerrar();
        }
      }}
    />
  );
  return bloqueHtml ? <div>{area}</div> : <span className="block">{area}</span>;
}

/**
 * Botón «Cambiar imagen» encima de una foto de un bloque, y zona para soltar un archivo. Va dentro de un
 * contenedor con `position: relative`. Fuera del modo edición no pinta nada.
 */
export function CambiarImagen({ campo, acepta = "imagen", className = "" }: { campo: string; acepta?: "imagen" | "video"; className?: string }) {
  const edicion = useContext(ContextoEdicion);
  const bloque = useContext(ContextoBloque);
  const [encima, setEncima] = useState(false);
  if (!edicion || !bloque) return null;
  const ruta: Ruta = campo.split(".");
  return (
    <div
      className={`absolute inset-0 z-20 flex items-center justify-center transition-colors duration-300 ${encima ? "bg-[rgba(229,9,20,0.25)]" : "bg-transparent"} ${className}`}
      onDragOver={(e) => {
        if (!e.dataTransfer.types.includes("Files")) return;
        e.preventDefault();
        setEncima(true);
      }}
      onDragLeave={() => setEncima(false)}
      onDrop={(e) => {
        e.preventDefault();
        setEncima(false);
        const f = e.dataTransfer.files[0];
        if (f) edicion.soltarArchivo(bloque, ruta, f);
      }}
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          edicion.elegirMedio(bloque, ruta, acepta);
        }}
        className="boton cristal cristal-fuerte px-4 py-2.5 text-[13px] text-[var(--jm-texto)] shadow-xl"
      >
        {encima ? "Suelta para cambiarla" : acepta === "video" ? "Cambiar vídeo" : "Cambiar imagen"}
      </button>
    </div>
  );
}
