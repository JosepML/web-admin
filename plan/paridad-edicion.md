# Paridad de edición: editor en la web frente al panel `/admin`

Auditoría de la fase 1 del plan de migración a dos repositorios (2026-10-28). Objetivo: que, al quitar «Editar página» de la web pública, el panel permita todo lo que hoy se puede editar.

Fuentes revisadas: `src/components/edicion/EditorPagina.tsx`, `contexto.tsx`, `catalogo.ts`, `src/components/admin/paginas/OrdenSecciones.tsx` y `EditorCabecera.tsx`, `src/lib/admin/contenido.ts`.

## Hallazgo principal

El panel y el editor de la web usan el **mismo `CATALOGO`** de campos (`catalogo.ts`) y los mismos componentes `Campos`, `SelectorMedios` y `subirArchivo`. Por eso la edición de **contenido de cada bloque** (textos, fotos, listas, proyectos, vídeos, enlaces) ya es equivalente: el lápiz de `OrdenSecciones` abre exactamente los mismos campos.

## Tabla de paridad

| Función | En la web (`EditorPagina`) | En el panel | Estado |
|---|---|---|---|
| Editar el contenido de cada campo del bloque (los 18 tipos del catálogo) | Sí | Sí, por el lápiz (mismo `CATALOGO`) | Equivalente |
| Texto en su sitio (clic y escribir) | Sí | No aplica (se edita en el formulario del bloque) | Sin hueco: mismo campo en formulario |
| Cambiar imagen / soltar archivo encima | Sí | Sí, con selector de biblioteca y subida en el campo | Equivalente |
| Reordenar secciones (arrastrar y flechas) | Sí | Sí | Equivalente |
| Ocultar / mostrar sección | Sí | Sí | Equivalente |
| **Añadir sección desde el catálogo** | Sí | **No** (enlaza a `?editar=1`) | **HUECO** |
| **Duplicar sección** | Sí | **No** | **HUECO** |
| **Borrar sección (con confirmación)** | Sí | **No** | **HUECO** |
| **Versiones anteriores de la página** (`Historial`, `revisiones`, `restaurar`) | Sí | **No** en `OrdenSecciones`/`EditorCabecera` | **HUECO** |
| Deshacer / rehacer (`Ctrl+Z`) | Sí | **No** | **HUECO** (código ya escrito, reutilizable) |
| Título de la página y SEO (título y descripción en Google) | Sí (pestaña «Página») | Sí (`EditorCabecera`) | Equivalente |
| Autoguardado en borrador, Publicar, Descartar | Sí | Sí | Equivalente |
| Vista previa de la página con borradores | Sí | Sí (`/admin/vista-previa`) | **Se elimina** (decisión de Josep) |

## Otras partes del panel (ya independientes de la web)

Proyectos, Artículos, Servicios, Clientes, Opiniones, Canales, Biblioteca (subir, recortar, punto de interés, carpetas), Mensajes y Ajustes se editan solo desde `/admin`. No dependen del editor de la web. Solo hay que convertirlos a ejecución en el navegador (fase 3).

## Cómo cerrar los huecos (fase 2)

La lógica ya existe en `EditorPagina.tsx` como operaciones sobre una lista de bloques en memoria: `duplicar`, `borrar` (con confirmación), `anadir` (con `CATALOGO[tipo].nuevo`), `deshacer` y `rehacer`, más el componente `Historial`. Se extrae a un módulo compartido y se usa desde `OrdenSecciones`. No hay que inventar nada.

## Decisión sobre «Deshacer»

Como el código ya existe y es la forma más segura de recuperar un borrado accidental, se mantiene en el panel (botones y `Ctrl+Z`). Si Josep prefiere quitarlo, se elimina sin afectar al resto.
