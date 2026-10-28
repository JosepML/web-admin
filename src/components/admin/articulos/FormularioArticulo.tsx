"use client";

import type { ParaEditar } from "@/lib/admin/contenido";
import { RUTAS } from "@/lib/rutas";
import type { OpcionesFormulario } from "../campos/tipos";
import { FormularioContenido } from "../FormularioContenido";
import { SECCIONES_ARTICULO } from "./esquema";

export function FormularioArticulo({ id, inicial, opciones }: { id: string; inicial: ParaEditar; opciones: OpcionesFormulario }) {
  return (
    <FormularioContenido
      tabla="articulos"
      id={id}
      inicial={inicial}
      secciones={SECCIONES_ARTICULO}
      opciones={opciones}
      volver={{ href: "/admin/articulos", texto: "Volver a Artículos" }}
      rutaPublica={(d) => (typeof d.slug === "string" && d.slug ? RUTAS.articulo(d.slug) : null)}
      titulo={(d) => String(d.titulo ?? "")}
    />
  );
}
