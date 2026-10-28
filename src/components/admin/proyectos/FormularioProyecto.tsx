"use client";

import type { ParaEditar } from "@/lib/admin/contenido";
import { RUTAS } from "@/lib/rutas";
import type { OpcionesFormulario } from "../campos/tipos";
import { FormularioContenido } from "../FormularioContenido";
import { SECCIONES_PROYECTO } from "./esquema";

export function FormularioProyecto({ id, inicial, opciones }: { id: string; inicial: ParaEditar; opciones: OpcionesFormulario }) {
  return (
    <FormularioContenido
      tabla="proyectos"
      id={id}
      inicial={inicial}
      secciones={SECCIONES_PROYECTO}
      opciones={opciones}
      volver={{ href: "/admin/proyectos", texto: "Volver a Proyectos" }}
      rutaPublica={(d) => (typeof d.slug === "string" && d.slug ? RUTAS.proyecto(d.slug) : null)}
      titulo={(d) => String(d.titulo ?? "")}
      sinOrden={["servicios"]}
    />
  );
}
