// Tipos compartidos del panel y del editor (sin "use server": se importan desde el navegador y el servidor)

/** Tablas con borrador y publicado (las que publica la función `publicar` de la base) */
export const TABLAS_CONTENIDO = ["servicios", "proyectos", "articulos", "paginas", "clientes", "opiniones", "canales"] as const;
export type TablaContenido = (typeof TABLAS_CONTENIDO)[number];

/** Lo que devuelven las acciones: nunca lanzan, para que el mensaje de error llegue entero al navegador */
export type Resultado<T> = { ok: true; datos: T } | { ok: false; error: string };
