// Catálogo de tipos de bloque para el editor de la web: nombre, para qué sirve, sus campos (el formato de `datos`
// de plan/esquema.md, «Tipos de bloque») y con qué datos empieza un bloque nuevo.
// Un tipo de bloque nuevo (migración + componente) necesita también su entrada aquí.

import type { Campo } from "@/components/admin/campos/tipos";
import type { TipoBloque } from "@/lib/datos/tipos";

const antetitulo: Campo = { tipo: "texto", clave: "antetitulo", etiqueta: "Antetítulo", ayuda: "La etiqueta pequeña encima del título" };
const titulo: Campo = { tipo: "texto", clave: "titulo", etiqueta: "Título", ayuda: "La última palabra sale en la letra artística. Para elegir otra, márcala con *asteriscos*." };
const texto: Campo = { tipo: "largo", clave: "texto", etiqueta: "Texto" };
const imagen: Campo = { tipo: "medio", clave: "imagen", etiqueta: "Imagen" };
const enlace: Campo = {
  tipo: "grupo",
  clave: "enlace",
  etiqueta: "Botón",
  campos: [
    { tipo: "texto", clave: "texto", etiqueta: "Texto del botón", medio: true },
    { tipo: "texto", clave: "href", etiqueta: "Lleva a", placeholder: "/trabajos", medio: true, ayuda: "Sin dirección, el botón no sale" },
  ],
};
const papeles: Campo = { tipo: "textos", clave: "papeles", etiqueta: "Papeles", placeholder: "director de fotografía" };

const nota = (texto: string): Campo => ({ tipo: "nota", clave: "_nota", etiqueta: texto });

export type InfoBloque = {
  nombre: string;
  descripcion: string;
  campos: Campo[];
  nuevo: Record<string, unknown>;
};

export const CATALOGO: Record<TipoBloque, InfoBloque> = {
  portada: {
    nombre: "Portada",
    descripcion: "Vídeo a pantalla completa con tu frase principal",
    campos: [
      antetitulo,
      { ...titulo, ayuda: "La última palabra sale en la letra artística." },
      { ...papeles, etiqueta: "Papeles que rotan tras «Soy»" },
      { ...texto, etiqueta: "Entradilla" },
      {
        tipo: "grupo",
        clave: "video",
        etiqueta: "Vídeo de fondo",
        campos: [
          { tipo: "medio", clave: "medio", etiqueta: "Vídeo horizontal (16:9)", acepta: "video", ayuda: "Se usa en ordenador y pantallas en horizontal" },
          { tipo: "medio", clave: "vertical", etiqueta: "Vídeo vertical (9:16)", acepta: "video", ayuda: "Se usa en móviles y pantallas en vertical" },
          { tipo: "medio", clave: "completo", etiqueta: "Vídeo completo (botón «Ver reel»)", acepta: "video", ayuda: "Vídeo que se abre en grande al pulsar «Ver reel»" },
          { tipo: "youtube", clave: "youtubeId", etiqueta: "Vídeo de YouTube (reel)", medio: true },
          { tipo: "numero", clave: "inicio", etiqueta: "Empieza en el segundo", min: 0, medio: true },
          { tipo: "medio", clave: "poster", etiqueta: "Imagen mientras carga" },
          { tipo: "numero", clave: "recorte", etiqueta: "Zoom para ocultar bandas negras", min: 1, max: 2, paso: 0.05, ayuda: "1 = sin zoom" },
        ],
      },
    ],
    nuevo: { titulo: "Josep Mira Lozano", papeles: ["director de fotografía", "filmmaker", "editor"], video: {} },
  },
  servicios: {
    nombre: "Lo que ofrezco",
    descripcion: "Tus servicios con sus fotos",
    campos: [antetitulo, titulo, texto, nota("Los servicios se editan en el panel, en Servicios.")],
    nuevo: { antetitulo: "Servicios", titulo: "Lo que *ofrezco*" },
  },
  filmmaker: {
    nombre: "Lo que grabo",
    descripcion: "Tus especialidades, en tarjetas con foto que llevan a su página",
    campos: [
      antetitulo,
      titulo,
      texto,
      {
        tipo: "lista",
        clave: "piezas",
        etiqueta: "Tarjetas",
        elemento: "Tarjeta",
        titulo: "nombre",
        nuevo: { nombre: "", texto: "", proyecto: null, href: "" },
        campos: [
          { tipo: "texto", clave: "nombre", etiqueta: "Nombre", placeholder: "Videoclips" },
          { tipo: "texto", clave: "texto", etiqueta: "Frase" },
          { tipo: "proyecto", clave: "proyecto", etiqueta: "Proyecto que enseña", ayuda: "Su portada sale en la tarjeta si no eliges otra foto" },
          { tipo: "medio", clave: "imagen", etiqueta: "Foto de la tarjeta", acepta: "imagen", ayuda: "Mejor una de la galería que no sea la portada del proyecto, para no repetirla" },
          { tipo: "texto", clave: "href", etiqueta: "Lleva a", placeholder: "/servicios/filmmaker/videoclips", ayuda: "La página de esta especialidad. Vacío = la ficha del proyecto" },
        ],
      },
      enlace,
    ],
    nuevo: { antetitulo: "Filmmaker", titulo: "Lo que *grabo*", piezas: [] },
  },
  trabajos: {
    nombre: "Selección de trabajos",
    descripcion: "Tus destacados en carrusel, o todos los proyectos de unos tipos",
    campos: [
      antetitulo,
      titulo,
      texto,
      {
        tipo: "multiple",
        clave: "tipos",
        etiqueta: "Solo proyectos de estos tipos",
        opciones: "tipos",
        ayuda: "Sin ninguno, salen tus destacados en el carrusel (los de la estrella en Proyectos). Con tipos, todos sus proyectos en rejilla; si solo hay uno, también sus «Más vídeos».",
      },
      {
        tipo: "seleccion",
        clave: "origen",
        etiqueta: "Qué proyectos",
        opciones: [{ valor: "juno", nombre: "Todos los hechos con JUNO Media" }],
        vacio: "Los destacados o los de los tipos de arriba",
      },
      {
        tipo: "proyectos",
        clave: "proyectos",
        etiqueta: "O elige tú los proyectos",
        ayuda: "Salen justo estos, en este orden (el primero, en grande). Si no eliges ninguno, sale lo de arriba.",
      },
    ],
    nuevo: { antetitulo: "Trabajos", titulo: "Selección de *trabajos*" },
  },
  cifras: {
    nombre: "Cifras",
    descripcion: "Números, premios y canales",
    campos: [
      antetitulo,
      titulo,
      {
        tipo: "lista",
        clave: "cifras",
        etiqueta: "Cifras",
        elemento: "Cifra",
        titulo: "unidad",
        nuevo: { valor: 0, unidad: "", texto: "" },
        campos: [
          { tipo: "numero", clave: "valor", etiqueta: "Número", medio: true, paso: 0.01 },
          { tipo: "numero", clave: "decimales", etiqueta: "Decimales", min: 0, max: 3, medio: true },
          { tipo: "texto", clave: "prefijo", etiqueta: "Delante", placeholder: "+", medio: true },
          { tipo: "texto", clave: "sufijo", etiqueta: "Detrás", placeholder: "M", medio: true },
          { tipo: "texto", clave: "unidad", etiqueta: "Qué es", placeholder: "años de experiencia" },
          { tipo: "texto", clave: "texto", etiqueta: "Detalle" },
        ],
      },
      nota("Los premios salen de las fichas de los proyectos y los canales del panel."),
    ],
    nuevo: { antetitulo: "En cifras", titulo: "Lo que dicen los *números*", cifras: [] },
  },
  proceso: {
    nombre: "Cómo trabajo",
    descripcion: "Los pasos de un encargo",
    campos: [
      antetitulo,
      titulo,
      {
        tipo: "lista",
        clave: "pasos",
        etiqueta: "Pasos",
        elemento: "Paso",
        titulo: "titulo",
        nuevo: { titulo: "", texto: "" },
        campos: [
          { tipo: "texto", clave: "titulo", etiqueta: "Título" },
          { tipo: "largo", clave: "texto", etiqueta: "Texto", filas: 2, ayuda: "" },
        ],
      },
    ],
    nuevo: { antetitulo: "Proceso", titulo: "Cómo *trabajo*", pasos: [] },
  },
  "sobre-mi": {
    nombre: "Sobre mí",
    descripcion: "Retrato y presentación",
    campos: [
      antetitulo,
      titulo,
      texto,
      { ...imagen, etiqueta: "Retrato" },
      { tipo: "texto", clave: "etiqueta", etiqueta: "Etiqueta sobre la foto" },
      { tipo: "texto", clave: "cita", etiqueta: "Frase destacada" },
      papeles,
      enlace,
    ],
    nuevo: { antetitulo: "Sobre mí", titulo: "Hola, soy *Josep*", papeles: [] },
  },
  opiniones: {
    nombre: "Opiniones",
    descripcion: "Frases de clientes",
    campos: [antetitulo, titulo, nota("Las opiniones se editan en el panel, en Opiniones.")],
    nuevo: { antetitulo: "Opiniones", titulo: "Lo que *dicen*" },
  },
  clientes: {
    nombre: "Clientes",
    descripcion: "Logos y el apartado de JUNO Media",
    campos: [
      antetitulo,
      titulo,
      {
        tipo: "grupo",
        clave: "juno",
        etiqueta: "Apartado JUNO Media",
        campos: [{ tipo: "largo", clave: "texto", etiqueta: "Texto", filas: 2 }, enlace],
      },
      nota("Los clientes y sus logos se editan en el panel, en Clientes."),
    ],
    nuevo: { antetitulo: "Clientes", titulo: "Han confiado en *mí*" },
  },
  blog: {
    nombre: "Últimos artículos",
    descripcion: "Las entradas más recientes del blog",
    campos: [antetitulo, titulo, { tipo: "numero", clave: "cantidad", etiqueta: "Cuántos artículos", min: 1, max: 6 }, enlace],
    nuevo: { antetitulo: "Blog", titulo: "Desde el *rodaje*", cantidad: 3 },
  },
  texto: {
    nombre: "Texto libre",
    descripcion: "Lo que quieras contar, con una imagen opcional",
    campos: [
      {
        tipo: "seleccion",
        clave: "estilo",
        etiqueta: "Estilo",
        opciones: [
          { valor: "tarjeta", nombre: "Tarjeta con la imagen al lado" },
          { valor: "cabecera", nombre: "Cabecera de cine: la imagen grande con el título encima" },
        ],
        obligatorio: true,
      },
      antetitulo,
      titulo,
      texto,
      imagen,
      enlace,
    ],
    nuevo: { estilo: "tarjeta", titulo: "Una sección *nueva*", texto: "" },
  },
  llamada: {
    nombre: "Hablemos",
    descripcion: "Invitación a escribirte por correo o WhatsApp",
    campos: [
      titulo,
      { tipo: "largo", clave: "texto", etiqueta: "Texto", filas: 2, ayuda: "" },
      { tipo: "textos", clave: "opciones", etiqueta: "Chips extra (detrás de los servicios)", placeholder: "Otra idea" },
      { tipo: "texto", clave: "nota", etiqueta: "Nota pequeña al final" },
    ],
    nuevo: { titulo: "¿Tienes una historia que *contar*?" },
  },
  galeria: {
    nombre: "Galería",
    descripcion: "Rejilla de fotos con su pie",
    campos: [antetitulo, titulo, texto, { tipo: "galeria", clave: "imagenes", etiqueta: "Fotos" }],
    nuevo: { titulo: "", imagenes: [] },
  },
  video: {
    nombre: "Vídeo",
    descripcion: "Un vídeo, o varios en tarjetas",
    campos: [
      antetitulo,
      titulo,
      texto,
      { tipo: "youtube", clave: "youtubeId", etiqueta: "Vídeo de YouTube" },
      { tipo: "medio", clave: "medio", etiqueta: "O un vídeo propio (mp4)", acepta: "video" },
      { tipo: "videos", clave: "videos", etiqueta: "O varios vídeos", ayuda: "En tarjetas que se abren en grande. Si hay alguno, manda sobre los dos de arriba." },
    ],
    nuevo: { titulo: "" },
  },
  cita: {
    nombre: "Cita",
    descripcion: "Una frase grande y quién la dijo",
    campos: [{ ...titulo, etiqueta: "Frase" }, { tipo: "texto", clave: "autor", etiqueta: "Quién la dijo" }],
    nuevo: { titulo: "Una frase que *inspira*", autor: "" },
  },
  colaboracion: {
    nombre: "Colaboración",
    descripcion: "Tu colaboración con JUNO Media, en cuatro partes",
    campos: [
      {
        tipo: "seleccion",
        clave: "parte",
        etiqueta: "Parte",
        opciones: [
          { valor: "apertura", nombre: "Apertura: los dos nombres, el titular y tres fotos" },
          { valor: "relacion", nombre: "Lo que nos une: tres facetas con foto" },
          { valor: "valor", nombre: "Para tu proyecto: foto grande y las formas de trabajar juntos" },
          { valor: "productora", nombre: "La productora: su marca, su lema, su web y las marcas" },
        ],
        obligatorio: true,
      },
      antetitulo,
      { ...titulo, si: { clave: "parte", valores: ["apertura", "relacion", "valor"] } },
      { ...texto, si: { clave: "parte", valores: ["apertura", "relacion", "valor", "productora"] } },
      {
        tipo: "proyectos",
        clave: "proyectos",
        etiqueta: "Proyectos del tríptico (tres)",
        ayuda: "Sale la portada de cada uno, en este orden (el segundo, el grande), y lleva a su ficha. Sin elegir, salen tres de JUNO Media.",
        si: { clave: "parte", valores: ["apertura"] },
      },
      {
        tipo: "galeria",
        clave: "imagenes",
        etiqueta: "O fotos sueltas (tres)",
        ayuda: "Solo se usan para los huecos que dejen los proyectos de arriba",
        si: { clave: "parte", valores: ["apertura"] },
      },
      {
        tipo: "lista",
        clave: "facetas",
        etiqueta: "Facetas",
        elemento: "Faceta",
        titulo: "titulo",
        nuevo: { titulo: "", texto: "", imagen: null },
        campos: [
          { tipo: "texto", clave: "titulo", etiqueta: "Palabra", placeholder: "Profesional" },
          { tipo: "largo", clave: "texto", etiqueta: "Texto", filas: 3 },
          { tipo: "medio", clave: "imagen", etiqueta: "Foto", acepta: "imagen" },
        ],
        si: { clave: "parte", valores: ["relacion"] },
      },
      { ...imagen, si: { clave: "parte", valores: ["valor"] } },
      {
        tipo: "lista",
        clave: "opciones",
        etiqueta: "Formas de trabajar juntos",
        elemento: "Forma",
        titulo: "titulo",
        nuevo: { titulo: "", texto: "" },
        campos: [
          { tipo: "texto", clave: "titulo", etiqueta: "Título" },
          { tipo: "largo", clave: "texto", etiqueta: "Texto", filas: 2 },
        ],
        si: { clave: "parte", valores: ["valor"] },
      },
      { tipo: "texto", clave: "lema", etiqueta: "Lema", ayuda: "En la letra artística, bajo la marca", si: { clave: "parte", valores: ["productora"] } },
      { ...enlace, si: { clave: "parte", valores: ["productora"] } },
      { tipo: "texto", clave: "rotulo", etiqueta: "Rótulo sobre las marcas", si: { clave: "parte", valores: ["productora"] } },
      { ...nota("Las marcas son los clientes marcados «con JUNO Media» en el panel, en Clientes."), si: { clave: "parte", valores: ["productora"] } },
    ],
    nuevo: { parte: "apertura", titulo: "Un filmmaker y una productora, *en sinergia*" },
  },
};

/** Nombre que se ve en la lista de secciones: su título (sin asteriscos), su antetítulo o el nombre del tipo */
export function nombreBloque(tipo: TipoBloque, datos: Record<string, unknown>) {
  const t = typeof datos.titulo === "string" ? datos.titulo.replace(/\*/g, "").trim() : "";
  const ante = typeof datos.antetitulo === "string" ? datos.antetitulo.trim() : "";
  return t || ante || CATALOGO[tipo]?.nombre || tipo;
}
