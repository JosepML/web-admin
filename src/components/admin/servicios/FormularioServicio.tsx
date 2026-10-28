"use client";

import type { ParaEditar } from "@/lib/admin/contenido";
import { RUTAS } from "@/lib/rutas";
import { FormularioContenido } from "../FormularioContenido";
import { SECCIONES_SERVICIO } from "./esquema";

export function FormularioServicio({ id, inicial }: { id: string; inicial: ParaEditar }) {
  // Los campos que llegan con una migración (titulo_mirada, fotos_cabecera) no se enseñan si la tabla aún no los tiene
  // (el borrador no admite campos que la tabla no tiene)
  const sinColumna = ["titulo_mirada", "fotos_cabecera", "imagen_apaisada_id"].filter((c) => !(c in inicial.fila));
  const secciones = sinColumna.length ? SECCIONES_SERVICIO.map((s) => ({ ...s, campos: s.campos.filter((c) => !sinColumna.includes(c.clave)) })) : SECCIONES_SERVICIO;
  return (
    <FormularioContenido
      tabla="servicios"
      id={id}
      inicial={inicial}
      secciones={secciones}
      volver={{ href: "/admin/servicios", texto: "Volver a Servicios" }}
      rutaPublica={(d) => (typeof d.slug === "string" && d.slug ? RUTAS.servicio(d.slug) : null)}
      titulo={(d) => String(d.nombre ?? "")}
    />
  );
}
