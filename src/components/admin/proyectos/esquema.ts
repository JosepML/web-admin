// Campos del formulario de un proyecto, por secciones. Nombres y formato de cada campo: plan/esquema.md («proyectos»).

import type { SeccionFormulario } from "../FormularioContenido";

const premio = {
  tipo: "lista" as const,
  clave: "premios",
  etiqueta: "Premios y reconocimientos",
  elemento: "Premio",
  titulo: "nombre",
  nuevo: { nombre: "", festival: "", anio: null, tipo: "ganado" },
  campos: [
    { tipo: "texto" as const, clave: "nombre", etiqueta: "Premio", placeholder: "Mejor fotografía" },
    { tipo: "texto" as const, clave: "festival", etiqueta: "Festival o certamen", medio: true },
    { tipo: "numero" as const, clave: "anio", etiqueta: "Año", min: 1990, max: 2100, medio: true },
    {
      tipo: "seleccion" as const,
      clave: "tipo",
      etiqueta: "Tipo",
      vacio: "Premio ganado",
      opciones: [
        { valor: "ganado", nombre: "Premio ganado (sale en Cifras)" },
        { valor: "podio", nombre: "Podio o mención (sale en Cifras)" },
        { valor: "nominacion", nombre: "Nominación o selección" },
        { valor: "cifra", nombre: "Cifra (1,39 M visualizaciones…)" },
      ],
    },
  ],
};

export const SECCIONES_PROYECTO: SeccionFormulario[] = [
  {
    id: "basico",
    titulo: "Lo básico",
    campos: [
      { tipo: "texto", clave: "titulo", etiqueta: "Título" },
      { tipo: "slug", clave: "slug", etiqueta: "Dirección", prefijo: "/trabajos/", desde: "titulo" },
      { tipo: "seleccion", clave: "tipo_id", etiqueta: "Tipo", opciones: "tipos", medio: true },
      { tipo: "multiple", clave: "categorias_extra", etiqueta: "También sale en", opciones: "tipos", ayuda: "Otras categorías donde aparece, además de su tipo (por ejemplo, Redes sociales)" },
      { tipo: "numero", clave: "anio", etiqueta: "Año", min: 1990, max: 2100, medio: true },
      { tipo: "multiple", clave: "servicios", etiqueta: "Servicios", opciones: "servicios", ayuda: "En qué páginas de servicio sale este proyecto" },
      { tipo: "texto", clave: "papel", etiqueta: "Mi papel (corto)", placeholder: "Dirección de fotografía y montaje", ayuda: "Sale en la tarjeta y en la ficha" },
      { tipo: "texto", clave: "direccion", etiqueta: "Dirección", medio: true },
      { tipo: "texto", clave: "productora", etiqueta: "Productora o cliente", medio: true },
      { tipo: "texto", clave: "camara", etiqueta: "Cámara", placeholder: "Sony FX3 + Tamron", medio: true },
      { tipo: "interruptor", clave: "con_juno", etiqueta: "Hecho con JUNO Media", ayuda: "Lleva el sello en la tarjeta y en la ficha" },
    ],
  },
  {
    id: "imagenes",
    titulo: "Imágenes y vídeo",
    campos: [
      { tipo: "medio", clave: "imagen_id", etiqueta: "Póster", ayuda: "La foto de la tarjeta. Si falta, se usa la primera de la galería" },
      { tipo: "medio", clave: "imagen_cabecera_id", etiqueta: "Imagen de la cabecera de la ficha", ayuda: "Opcional. Es la foto grande de arriba en la página del proyecto (mientras carga el vídeo, o si no hay). Si falta, se usa el póster" },
      { tipo: "youtube", clave: "youtube_id", etiqueta: "Vídeo principal (YouTube)", medio: true },
      { tipo: "numero", clave: "youtube_inicio", etiqueta: "Vista previa desde el segundo", min: 0, medio: true },
      { tipo: "galeria", clave: "galeria", etiqueta: "Galería (fotogramas)" },
      { tipo: "galeria", clave: "detras_de_camaras", etiqueta: "Detrás de cámaras" },
      { tipo: "medio", clave: "video_portada_id", etiqueta: "Vídeo de cabecera de la ficha (mp4)", acepta: "video", ayuda: "Si no hay, la cabecera usa el clip o YouTube" },
      { tipo: "medio", clave: "clip_id", etiqueta: "Clip corto de la tarjeta (mp4)", acepta: "video" },
      { tipo: "videos", clave: "videos", etiqueta: "Más vídeos", ayuda: "Making of, versiones, reels de Instagram…" },
      { tipo: "interruptor", clave: "videos_debajo_del_texto", etiqueta: "Los vídeos extra van debajo del texto" },
    ],
  },
  {
    id: "textos",
    titulo: "Textos",
    descripcion: "Una sección vacía no se muestra en la ficha.",
    campos: [
      { tipo: "largo", clave: "tarjeta", etiqueta: "Resumen", filas: 2, ayuda: "Una o dos frases: salen en la tarjeta y al principio de la ficha" },
      { tipo: "largo", clave: "historia", etiqueta: "El proyecto", filas: 5 },
      { tipo: "largo", clave: "como_lo_hicimos", etiqueta: "Decisiones clave", filas: 6, ayuda: "Una por línea: - **Título.** texto (salen como tarjetas numeradas)" },
      { tipo: "largo", clave: "el_reto", etiqueta: "El reto", filas: 3 },
      { tipo: "largo", clave: "el_resultado", etiqueta: "Resultado", filas: 4, ayuda: "Una por línea, empezando por guion: - Seleccionado en…" },
      { tipo: "texto", clave: "frase", etiqueta: "Frase final", ayuda: "La parte en la letra artística va entre *asteriscos*" },
    ],
  },
  { id: "premios", titulo: "Premios", campos: [premio] },
  {
    id: "titulos",
    titulo: "Títulos de las secciones",
    descripcion: "Vacío = el título de siempre.",
    campos: [
      {
        tipo: "grupo",
        clave: "titulos_seccion",
        etiqueta: "Títulos",
        campos: [
          { tipo: "texto", clave: "historia", etiqueta: "El proyecto", medio: true },
          { tipo: "texto", clave: "como_lo_hicimos", etiqueta: "Decisiones clave", medio: true },
          { tipo: "texto", clave: "el_reto", etiqueta: "El reto", medio: true },
          { tipo: "texto", clave: "el_resultado", etiqueta: "Resultado", medio: true },
          { tipo: "texto", clave: "mi_papel", etiqueta: "Mi papel", medio: true },
          { tipo: "texto", clave: "mas_videos", etiqueta: "Más vídeos", medio: true },
          { tipo: "texto", clave: "fotogramas", etiqueta: "Fotogramas", medio: true },
        ],
      },
    ],
  },
  {
    id: "seo",
    titulo: "Google",
    descripcion: "Cómo aparece en los resultados de búsqueda.",
    campos: [
      { tipo: "texto", clave: "seo_titulo", etiqueta: "Título en Google", ayuda: "Unos 60 caracteres. Vacío = el título del proyecto" },
      { tipo: "largo", clave: "seo_descripcion", etiqueta: "Descripción en Google", filas: 3, ayuda: "Unos 155 caracteres. Vacío = el resumen" },
      { tipo: "google", clave: "_google", etiqueta: "Así se verá", prefijo: "/trabajos/", titulo: "seo_titulo", descripcion: "seo_descripcion", respaldoTitulo: "titulo", respaldoDescripcion: "tarjeta" },
    ],
  },
];
