// Tipos de la web pública: lo que devuelve src/lib/datos/ a las páginas y los componentes, ya listo para
// pintar (imágenes con su URL, servicios por slug, nombres en camelCase). Las filas crudas de Supabase son
// las de src/lib/supabase/tipos.ts; la traducción de una a otra está en src/lib/datos/traducir.ts.

import type { Database } from "@/lib/supabase/tipos";

export type TipoBloque = Database["public"]["Enums"]["tipo_bloque"];

/** Una imagen o vídeo de la biblioteca (`medios`), con la URL ya resuelta */
export type Medio = {
  id: string;
  url: string;
  tipo: "imagen" | "video" | "documento";
  alt: string;
  ancho: number | null;
  alto: number | null;
  /** Punto de interés (% desde la izquierda y desde arriba) para los recortes; vacío = centro */
  foco?: { x: number; y: number } | null;
};

export type Ajustes = {
  nombre: string;
  lema: string;
  correo: string;
  /** Solo dígitos, con prefijo de país (34618867115) */
  whatsapp: string;
  /** Chip «Disponible para nuevos proyectos» */
  disponible: boolean;
  ubicacion: string;
  redes: { instagram?: string; youtube?: string; linkedin?: string };
  /** Foto de Contacto y Gracias (id de `medios`); vacía = la de por defecto */
  fotoContacto?: string;
};

export type Servicio = {
  id: string;
  slug: string;
  nombre: string;
  frase: string;
  resumen: string;
  mirada: string[];
  /** Título de «Mi mirada». Vacío = el de siempre */
  tituloMirada: string;
  aporto: string[];
  paraQuien: string[];
  conQuien: string;
  pasos: { titulo: string; texto: string }[];
  preguntas: { pregunta: string; respuesta: string }[];
  llamada: string;
  imagen: Medio | null;
  /** Fotos del carrusel de la cabecera, elegidas en el panel. Vacío = la imagen propia y los pósteres de sus proyectos */
  fotosCabecera: Medio[];
  /** Foto en formato ancho (tarjetas «Otro servicio»). Null = la imagen de la tarjeta */
  imagenApaisada: Medio | null;
  seo: { titulo: string; descripcion: string };
};

/** `tipo`: «ganado» y «podio» van en Cifras; «nominacion» y «cifra» (1,39 M visualizaciones) solo en la ficha y la tarjeta */
export type Premio = { nombre: string; tipo: string; festival: string; anio: number | null };

export type ImagenConPie = { imagen: Medio; pie: string };

/** `rol: "principal"` en un archivo propio: es el vídeo de «Ver completo» de la ficha (cuando no hay YouTube) y no sale en «Más vídeos» */
export type VideoExtra = { tipo: "youtube" | "youtube-short" | "instagram" | "archivo"; id?: string; url?: string; medio?: string; titulo?: string; rol?: string; vertical?: boolean };

export type Proyecto = {
  id: string;
  slug: string;
  titulo: string;
  idAntiguo: string | null;
  tipo: { slug: string; nombre: string; enListadoGeneral: boolean } | null;
  /** Servicios del proyecto, con su orden y si es destacado en la página de cada servicio */
  servicios: { slug: string; orden: number; destacado: boolean }[];
  anio: number | null;
  direccion: string;
  productora: string;
  papel: string;
  camara: string;
  youtubeId: string | null;
  youtubeInicio: number | null;
  /** Póster (imagen_id); si falta, la primera de la galería */
  poster: Medio | null;
  /** Imagen propia de la cabecera de la ficha. Null = el póster */
  imagenCabecera: Medio | null;
  galeria: ImagenConPie[];
  detrasDeCamaras: ImagenConPie[];
  clip: Medio | null;
  videoPortada: Medio | null;
  videos: VideoExtra[];
  videosDebajoDelTexto: boolean;
  premios: Premio[];
  /** Hecho bajo el sello de JUNO Media: la tarjeta y la ficha lo marcan */
  conJuno: boolean;
  /** Slugs de otros tipos en los que también sale (Redes sociales, por ejemplo) */
  categoriasExtra: string[];
  destacadoOrden: number | null;
  orden: number;
  /** Frase final con la parte en cursiva entre *asteriscos* */
  frase: string;
  /** Textos en Markdown básico. `comoLoHicimos` es la lista de decisiones clave (`- **Título.** texto`) */
  textos: { tarjeta: string; historia: string; miPapel: string; comoLoHicimos: string; elReto: string; elResultado: string };
  titulosSeccion: Record<string, string>;
  seo: { titulo: string; descripcion: string };
};

export type Articulo = {
  id: string;
  slug: string;
  titulo: string;
  idAntiguo: string | null;
  /** AAAA-MM-DD */
  fecha: string;
  extracto: string;
  categoria: { slug: string; nombre: string } | null;
  imagen: Medio | null;
  /** Documento del editor (formato ProseMirror/TipTap) */
  contenido: unknown;
  seo: { titulo: string; descripcion: string };
};

export type Cliente = {
  id: string;
  nombre: string;
  logo: Medio | null;
  altoLogo: number | null;
  estilo: "logo" | "nombre" | "firma";
  enlace: string | null;
  conJuno: boolean;
};

export type Opinion = { id: string; texto: string; autor: string; contexto: string };

export type Canal = { id: string; nombre: string; texto: string; url: string | null; cifra: string };

/**
 * Datos de un bloque. Comunes: antetitulo, titulo, texto (Markdown básico) e imagen (id de `medios`). Los
 * extras de cada tipo están en plan/patron-paginas.md. Se leen con cuidado (pueden faltar): nunca se
 * da por hecho que un campo existe.
 */
export type DatosBloque = {
  antetitulo?: string;
  titulo?: string;
  texto?: string;
  imagen?: string;
  [extra: string]: unknown;
};

export type Bloque = { id: string; tipo: TipoBloque; datos: DatosBloque };

export type Pagina = {
  id: string;
  slug: string;
  titulo: string;
  imagen: Medio | null;
  seo: { titulo: string; descripcion: string };
  bloques: Bloque[];
};

/** Todo lo que pueden necesitar los bloques de una página: se carga una vez y va por contexto */
export type DatosWeb = {
  ajustes: Ajustes;
  servicios: Servicio[];
  proyectos: Proyecto[];
  articulos: Articulo[];
  clientes: Cliente[];
  opiniones: Opinion[];
  canales: Canal[];
  /** Medios que citan los bloques por id (imagen, póster del vídeo...) */
  medios: Record<string, Medio>;
};
