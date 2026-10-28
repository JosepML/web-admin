"use client";

import { createContext, useContext } from "react";
import type { DatosWeb, Medio } from "@/lib/datos/tipos";

/**
 * Los datos de la base de datos que necesitan los bloques de una página (proyectos, servicios, clientes...).
 * La página (componente de servidor) los carga con getPaginaConDatos() y los pasa a <PaginaBloques>, que
 * los deja aquí. Así cada bloque lee lo suyo sin pasar props por toda la página.
 */
const Contexto = createContext<DatosWeb | null>(null);

export function ProveedorDatos({ datos, children }: { datos: DatosWeb; children: React.ReactNode }) {
  return <Contexto.Provider value={datos}>{children}</Contexto.Provider>;
}

export function useDatos() {
  const d = useContext(Contexto);
  if (!d) throw new Error("useDatos fuera de ProveedorDatos");
  return d;
}

/** Un medio citado por id en los datos de un bloque (imagen, póster...). null si falta. */
export function useMedio(id: unknown): Medio | null {
  const { medios } = useDatos();
  return typeof id === "string" ? (medios[id] ?? null) : null;
}
