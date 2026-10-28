"use client";

import type { ParaEditar } from "@/lib/admin/contenido";
import type { OpcionesFormulario } from "../campos/tipos";
import { FormularioContenido } from "../FormularioContenido";
import { SECCIONES_CANAL, SECCIONES_CLIENTE, SECCIONES_OPINION } from "./esquema";

type Props = { id: string; inicial: ParaEditar; opciones?: OpcionesFormulario };

export function FormularioCliente({ id, inicial }: Props) {
  return <FormularioContenido tabla="clientes" id={id} inicial={inicial} secciones={SECCIONES_CLIENTE} volver={{ href: "/admin/clientes", texto: "Volver a Clientes" }} rutaPublica={() => "/"} titulo={(d) => String(d.nombre ?? "")} />;
}

export function FormularioOpinion({ id, inicial, opciones }: Props) {
  return (
    <FormularioContenido
      tabla="opiniones"
      id={id}
      inicial={inicial}
      secciones={SECCIONES_OPINION}
      opciones={opciones}
      volver={{ href: "/admin/opiniones", texto: "Volver a Opiniones" }}
      rutaPublica={() => "/"}
      titulo={(d) => String(d.autor || "Opinión")}
    />
  );
}

export function FormularioCanal({ id, inicial }: Props) {
  return <FormularioContenido tabla="canales" id={id} inicial={inicial} secciones={SECCIONES_CANAL} volver={{ href: "/admin/canales", texto: "Volver a Canales" }} rutaPublica={() => "/"} titulo={(d) => String(d.nombre ?? "")} />;
}
