// Campos del formulario de un artículo del blog. Formato de cada campo: plan/esquema.md («articulos»).

import type { SeccionFormulario } from "../FormularioContenido";

export const SECCIONES_ARTICULO: SeccionFormulario[] = [
  {
    id: "basico",
    titulo: "Lo básico",
    campos: [
      { tipo: "texto", clave: "titulo", etiqueta: "Título" },
      { tipo: "slug", clave: "slug", etiqueta: "Dirección", prefijo: "/blog/", desde: "titulo" },
      { tipo: "fecha", clave: "fecha", etiqueta: "Fecha", ayuda: "La que se muestra en el artículo y ordena el blog", medio: true },
      { tipo: "seleccion", clave: "categoria_id", etiqueta: "Categoría", opciones: "categorias", medio: true },
      { tipo: "medio", clave: "imagen_id", etiqueta: "Imagen principal", ayuda: "Sale en la tarjeta del blog y arriba del artículo" },
      { tipo: "largo", clave: "extracto", etiqueta: "Entradilla", filas: 2, ayuda: "Una o dos frases: salen en la tarjeta y debajo del título" },
    ],
  },
  {
    id: "texto",
    titulo: "Texto",
    descripcion: "Escribe como en un procesador de textos. Para meter una foto entre párrafos, pon el cursor y pulsa «Imagen», o arrástrala encima.",
    campos: [{ tipo: "documento", clave: "contenido", etiqueta: "Artículo" }],
  },
  {
    id: "seo",
    titulo: "Google",
    descripcion: "Cómo aparece en los resultados de búsqueda.",
    campos: [
      { tipo: "texto", clave: "seo_titulo", etiqueta: "Título en Google", ayuda: "Unos 60 caracteres. Vacío = el título del artículo" },
      { tipo: "largo", clave: "seo_descripcion", etiqueta: "Descripción en Google", filas: 3, ayuda: "Unos 155 caracteres. Vacío = la entradilla" },
      { tipo: "google", clave: "_google", etiqueta: "Así se verá", prefijo: "/blog/", titulo: "seo_titulo", descripcion: "seo_descripcion", respaldoTitulo: "titulo", respaldoDescripcion: "extracto" },
    ],
  },
];
