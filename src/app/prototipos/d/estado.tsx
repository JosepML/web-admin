"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { BLOQUES_INICIALES, CATALOGO, type Bloque, type TipoBloque } from "./datos";

/**
 * Estado del prototipo D: tema claro/oscuro y los bloques de la portada.
 * En el prototipo los cambios del modo edición se guardan en este navegador (localStorage);
 * en la web final se guardarán en la tabla `bloques` de Supabase desde el panel privado.
 */
type Tema = "oscuro" | "claro";

type EstadoD = {
  tema: Tema;
  cambiarTema: () => void;
  bloques: Bloque[];
  setBloques: (b: Bloque[]) => void;
  actualizar: (id: string, cambios: Partial<Bloque> | { datos: Partial<Bloque["datos"]> }) => void;
  anadir: (tipo: TipoBloque) => string;
  quitar: (id: string) => void;
  restablecer: () => void;
  editando: boolean;
  setEditando: (v: boolean) => void;
};

const Contexto = createContext<EstadoD | null>(null);

export const useEstadoD = () => {
  const c = useContext(Contexto);
  if (!c) throw new Error("useEstadoD fuera de ProveedorD");
  return c;
};

// Versión en la clave: al cambiar los textos por defecto, lo guardado antes en el navegador no los tapa
const CLAVE_BLOQUES = "proto-d-bloques-v5";
const CLAVE_TEMA = "proto-d-tema";

function leer<T>(clave: string): T | null {
  try {
    const v = localStorage.getItem(clave);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
}

function guardar(clave: string, valor: unknown) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch {}
}

export function ProveedorD({ children }: { children: React.ReactNode }) {
  const [tema, setTema] = useState<Tema>("oscuro");
  const [bloques, setBloquesState] = useState<Bloque[]>(BLOQUES_INICIALES);
  const [editando, setEditando] = useState(false);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    const b = leer<Bloque[]>(CLAVE_BLOQUES);
    const t = leer<Tema>(CLAVE_TEMA);
    if (Array.isArray(b) && b.every((x) => x && x.tipo in CATALOGO)) setBloquesState(b);
    if (t === "claro" || t === "oscuro") setTema(t);
    setCargado(true);
  }, []);

  useEffect(() => {
    if (cargado) guardar(CLAVE_BLOQUES, bloques);
  }, [bloques, cargado]);

  const setBloques = useCallback((b: Bloque[]) => setBloquesState(b), []);

  const cambiarTema = useCallback(() => {
    setTema((t) => {
      const nuevo = t === "oscuro" ? "claro" : "oscuro";
      guardar(CLAVE_TEMA, nuevo);
      return nuevo;
    });
  }, []);

  const actualizar = useCallback<EstadoD["actualizar"]>((id, cambios) => {
    setBloquesState((bs) =>
      bs.map((b) => {
        if (b.id !== id) return b;
        const { datos, ...resto } = cambios as Partial<Bloque>;
        return { ...b, ...resto, datos: datos ? { ...b.datos, ...datos } : b.datos };
      }),
    );
  }, []);

  const anadir = useCallback((tipo: TipoBloque) => {
    const id = `${tipo}-${Date.now().toString(36)}`;
    setBloquesState((bs) => {
      // Las secciones nuevas entran justo antes de la llamada final
      const i = bs.findIndex((b) => b.tipo === "llamada");
      const nuevo: Bloque = { id, tipo, visible: true, datos: { ...CATALOGO[tipo].datos } };
      const copia = [...bs];
      copia.splice(i === -1 ? copia.length : i, 0, nuevo);
      return copia;
    });
    return id;
  }, []);

  const quitar = useCallback((id: string) => setBloquesState((bs) => bs.filter((b) => b.id !== id)), []);

  const restablecer = useCallback(() => setBloquesState(BLOQUES_INICIALES), []);

  const valor = useMemo(
    () => ({ tema, cambiarTema, bloques, setBloques, actualizar, anadir, quitar, restablecer, editando, setEditando }),
    [tema, cambiarTema, bloques, setBloques, actualizar, anadir, quitar, restablecer, editando],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}
