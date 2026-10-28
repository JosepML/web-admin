// Campos del formulario de un servicio (/servicios/<slug>). Formato de cada campo: plan/esquema.md («servicios»).

import type { SeccionFormulario } from "../FormularioContenido";

export const SECCIONES_SERVICIO: SeccionFormulario[] = [
  {
    id: "basico",
    titulo: "Cabecera",
    campos: [
      { tipo: "texto", clave: "nombre", etiqueta: "Nombre", placeholder: "Dirección de fotografía" },
      { tipo: "slug", clave: "slug", etiqueta: "Dirección", prefijo: "/servicios/", desde: "nombre" },
      { tipo: "texto", clave: "frase", etiqueta: "Frase de la cabecera", ayuda: "La línea naranja debajo del nombre" },
      { tipo: "largo", clave: "resumen", etiqueta: "Resumen", filas: 3, ayuda: "Sale en la tarjeta del servicio en Inicio" },
      { tipo: "medio", clave: "imagen_id", etiqueta: "Imagen de la tarjeta", ayuda: "Opcional: va la primera en la tarjeta del servicio en Inicio. Las demás salen de los pósteres de sus proyectos. No cambia la cabecera" },
      { tipo: "medio", clave: "imagen_apaisada_id", etiqueta: "Imagen apaisada", ayuda: "Para las tarjetas «Otro servicio» del pie de cada servicio. Si falta, se usa la imagen de la tarjeta. Para reencuadrar una foto, recórtala en la Biblioteca" },
      { tipo: "galeria", clave: "fotos_cabecera", etiqueta: "Fotos que pasan en la cabecera", ayuda: "Solo la cabecera de la página del servicio: son independientes de la imagen de la tarjeta y de los proyectos. Si no pones ninguna, la cabecera usa las de la tarjeta" },
    ],
  },
  {
    id: "mirada",
    titulo: "Mi mirada",
    campos: [
      { tipo: "texto", clave: "titulo_mirada", etiqueta: "Título", ayuda: "La última palabra sale en la letra artística. Para elegir otra, márcala con *asteriscos*." },
      { tipo: "textos", clave: "mirada", etiqueta: "Párrafos", largo: true, placeholder: "Un párrafo" },
    ],
  },
  {
    id: "aporto",
    titulo: "Lo que aporto y para quién",
    campos: [
      { tipo: "textos", clave: "aporto", etiqueta: "Lo que aporto", placeholder: "Propuesta visual desde el guion" },
      { tipo: "largo", clave: "con_quien", etiqueta: "Con quién trabajo", filas: 3 },
      { tipo: "textos", clave: "para_quien", etiqueta: "Para quién", placeholder: "Productoras", ayuda: "Etiquetas cortas" },
    ],
  },
  {
    id: "pasos",
    titulo: "Cómo trabajamos",
    campos: [
      {
        tipo: "lista",
        clave: "pasos",
        etiqueta: "Pasos",
        elemento: "Paso",
        titulo: "titulo",
        nuevo: { titulo: "", texto: "" },
        campos: [
          { tipo: "texto", clave: "titulo", etiqueta: "Título", placeholder: "Imagino" },
          { tipo: "largo", clave: "texto", etiqueta: "Texto", filas: 2 },
        ],
      },
    ],
  },
  {
    id: "preguntas",
    titulo: "Preguntas frecuentes",
    campos: [
      {
        tipo: "lista",
        clave: "preguntas",
        etiqueta: "Preguntas",
        elemento: "Pregunta",
        titulo: "pregunta",
        nuevo: { pregunta: "", respuesta: "" },
        campos: [
          { tipo: "texto", clave: "pregunta", etiqueta: "Pregunta" },
          { tipo: "largo", clave: "respuesta", etiqueta: "Respuesta", filas: 3 },
        ],
      },
    ],
  },
  {
    id: "llamada",
    titulo: "Llamada final",
    campos: [{ tipo: "texto", clave: "llamada", etiqueta: "Título de la llamada", ayuda: "Vacío = el de la llamada de Inicio. El formulario sale con este servicio ya marcado." }],
  },
  {
    id: "seo",
    titulo: "Google",
    descripcion: "Cómo aparece en los resultados de búsqueda.",
    campos: [
      { tipo: "texto", clave: "seo_titulo", etiqueta: "Título en Google", ayuda: "Unos 60 caracteres. Vacío = el nombre del servicio" },
      { tipo: "largo", clave: "seo_descripcion", etiqueta: "Descripción en Google", filas: 3, ayuda: "Unos 155 caracteres. Vacío = el resumen" },
      { tipo: "google", clave: "_google", etiqueta: "Así se verá", prefijo: "/servicios/", titulo: "seo_titulo", descripcion: "seo_descripcion", respaldoTitulo: "nombre", respaldoDescripcion: "resumen" },
    ],
  },
];
