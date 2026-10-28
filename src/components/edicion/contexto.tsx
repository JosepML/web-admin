"use client";

// Versión estática de contexto para la web pública: los bloques se pintan directamente
// sin cargar código de edición, botones flotantes ni dependencias de sesión.

import type { Bloque, TipoBloque } from "@/lib/datos/tipos";

export type Ruta = (string | number)[];
export type BloqueEditable = { id: string; tipo: TipoBloque; visible: boolean; datos: Record<string, unknown> };
export type VistaEdicion = { bloques: BloqueEditable[]; medios: Record<string, unknown>; edicion: Edicion | null } | null;

export type Edicion = {
  cambiar: (bloque: string, ruta: Ruta, valor: unknown) => void;
  elegirMedio: (bloque: string, ruta: Ruta, acepta?: "imagen" | "video") => void;
  soltarArchivo: (bloque: string, ruta: Ruta, archivo: File) => void;
  Herramientas: React.ComponentType<{ bloque: BloqueEditable; indice: number; total: number }>;
};

export const useEdicion = (): Edicion | null => null;
export const useEditando = () => false;
export const ProveedorBloque = ({ children }: { value?: unknown; children: React.ReactNode }) => <>{children}</>;

export function ZonaEdicion({
  publicados,
  children,
}: {
  pagina?: { id: string; slug: string; titulo: string };
  publicados: Bloque[];
  children: (bloques: Bloque[]) => React.ReactNode;
}) {
  return <>{children(publicados)}</>;
}

export function Editable({ children }: { children?: React.ReactNode; [key: string]: unknown }) {
  return <>{children}</>;
}

export function CambiarImagen(props?: { campo?: string; acepta?: "imagen" | "video"; className?: string }) {
  void props;
  return null;
}
