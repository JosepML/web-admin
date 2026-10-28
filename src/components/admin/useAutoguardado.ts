"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { guardarBorrador } from "@/lib/admin/contenido";
import type { TablaContenido } from "@/lib/admin/tipos";

export type EstadoGuardado = "guardado" | "pendiente" | "guardando" | "error";

/** Espera tras la última tecla antes de guardar: suficiente para no guardar a cada letra, corto para no perder nada */
const ESPERA = 900;

/**
 * Autoguardado en `borradores`. `cambios` es lo que difiere de lo publicado (vacío = sin cambios: el borrador se
 * borra). Guarda un momento después de que Josep deja de escribir, al salir de la página y con Ctrl+S.
 * `inicial`: los cambios con los que se abrió (ya guardados), para no volver a guardarlos al cargar.
 */
export function useAutoguardado(tabla: TablaContenido, id: string | null, cambios: Record<string, unknown> | null, inicial: Record<string, unknown> | null) {
  const [estado, setEstado] = useState<EstadoGuardado>("guardado");
  const [error, setError] = useState<string | null>(null);
  const [guardadoEn, setGuardadoEn] = useState<Date | null>(null);
  const guardadoJson = useRef<string | null>(null);
  const actual = useRef<string | null>(null);
  const enCurso = useRef<Promise<boolean> | null>(null);
  const temporizador = useRef<number | undefined>(undefined);

  // Al abrir otra fila, lo guardado es lo que trae
  useEffect(() => {
    guardadoJson.current = inicial ? JSON.stringify(inicial) : JSON.stringify({});
    setEstado("guardado");
    setError(null);
  }, [id, inicial]);

  const guardar = useCallback(async (): Promise<boolean> => {
    window.clearTimeout(temporizador.current);
    if (enCurso.current) await enCurso.current;
    const json = actual.current;
    if (!id || json === null || json === guardadoJson.current) {
      setEstado("guardado");
      return true;
    }
    setEstado("guardando");
    const tarea = guardarBorrador(tabla, id, JSON.parse(json)).then((r) => {
      if (r.ok) {
        guardadoJson.current = json;
        setGuardadoEn(new Date(r.datos.guardadoEn));
        setError(null);
        // Si mientras guardaba se siguió escribiendo, queda pendiente
        setEstado(actual.current === json ? "guardado" : "pendiente");
        return true;
      }
      setError(r.error);
      setEstado("error");
      return false;
    });
    enCurso.current = tarea;
    const ok = await tarea;
    enCurso.current = null;
    return ok;
  }, [id, tabla]);

  useEffect(() => {
    if (!cambios) return;
    const json = JSON.stringify(cambios);
    actual.current = json;
    if (json === guardadoJson.current) return;
    setEstado("pendiente");
    window.clearTimeout(temporizador.current);
    temporizador.current = window.setTimeout(() => void guardar(), ESPERA);
  }, [cambios, guardar]);

  // Volver a intentarlo solo tras un error de red, cada 5 s
  useEffect(() => {
    if (estado !== "error") return;
    const t = window.setTimeout(() => void guardar(), 5000);
    return () => window.clearTimeout(t);
  }, [estado, guardar]);

  // Avisar al cerrar la pestaña con cambios sin guardar, y guardar al esconderla (cambio de pestaña, móvil)
  useEffect(() => {
    const antes = (e: BeforeUnloadEvent) => {
      if (actual.current !== null && actual.current !== guardadoJson.current) {
        void guardar();
        e.preventDefault();
      }
    };
    const oculta = () => document.visibilityState === "hidden" && void guardar();
    const teclas = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void guardar();
      }
    };
    window.addEventListener("beforeunload", antes);
    document.addEventListener("visibilitychange", oculta);
    window.addEventListener("keydown", teclas);
    return () => {
      window.removeEventListener("beforeunload", antes);
      document.removeEventListener("visibilitychange", oculta);
      window.removeEventListener("keydown", teclas);
    };
  }, [guardar]);

  return { estado, error, guardadoEn, guardarYa: guardar };
}

/** «Guardado hace 5 s», «Guardando…», «Sin conexión: se reintentará» */
export function textoGuardado(estado: EstadoGuardado, hayCambios: boolean, error: string | null) {
  if (estado === "guardando") return "Guardando…";
  if (estado === "pendiente") return "Cambios sin guardar…";
  if (estado === "error") return error ?? "No se pudo guardar";
  return hayCambios ? "Guardado · sin publicar" : "Igual que la web";
}
