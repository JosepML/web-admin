# Traspaso: textos de proyectos y artículos en la base (tarea S4)

Hilo «Textos de artículos en la base», 2026-10-22. Proyecto de Supabase `oadmqwtnxpbotxcgzaoo` ("Web Josep Mira"). Solo se ha insertado o actualizado; no se ha borrado nada.

## Qué hay en la base

- **18 proyectos** con su texto nuevo (`tarjeta`, `historia`, `como_lo_hicimos`, `el_reto`, `el_resultado`) y su `frase` final. La carga la hizo el hilo S1 (`plan/traspaso-carga-base.md`) a la vez que este; para no duplicar, S4 comparó campo a campo con lo que había preparado y corrigió solo lo que difería.
- Los 5 textos de cada proyecto coinciden con `plan/contenido/proyectos/*.md` (comprobado por hash, sin «Para revisar»).
- **2 artículos** con título y extracto de `datos.ts`, portada y las fotos del cuerpo que añadió el hilo de imágenes, como nodos `image` enlazados a `medios` (formato en `plan/esquema.md`).
- Estado: `publicado` (decisión de S1, para que la web local los lea). No sale a internet: la web publicada sigue siendo la de `master`.

## Cambios de S4

| Qué | Por qué |
| --- | --- |
| Migración `20261022230000_proyectos_frase`: columna `proyectos.frase` | La frase con doble tipografía no tenía sitio en el esquema. `columnas_editables()` la recoge sola, así que viaja en borradores y publicaciones sin tocar funciones |
| `titulos_seccion` en las 18 fichas | Para que la ficha muestre «El proyecto», «Decisiones clave», «El reto» y «Resultado», como el prototipo D |
| Póster de El Padrino → `i.ytimg.com/vi/WnSCN4aXDKA/maxresdefault.jpg` (también en la galería) | La URL de `i9.ytimg.com` era firmada y caduca |
| Póster de Reels → miniatura de su short `rUv-Ql7NxCQ`, galería vacía | La imagen de `rbgescuela.com` no es de Josep (regla de `repaso-final.md`: fichas solo con imágenes propias) |
| Cámara de las recreaciones: «Sony FX3 · Tamron y Sony» | Mismo formato que el resto de fichas |
| Artículos: título y extracto de `datos.ts`, fotos del cuerpo | Son los que Josep vio en el prototipo; las fotos llegaron después de la carga de S1 |

El SQL aplicado está en `supabase/datos/s4_correcciones.sql`. **Si alguien vuelve a ejecutar `scripts/migrar-legacy.mjs`, tiene que aplicar después ese archivo**, o se pierden estas correcciones.

## Lo que queda (no lo hace S4)

- **Frase final de las 4 recreaciones** (`proyectos.frase` vacía): proponerla a Josep. No se inventa sin su visto bueno.
- **Medios huérfanos** que ya no usa nadie: la imagen de `rbgescuela.com` y la de `i9.ytimg.com`. Borrarlos es cosa de Josep (o de S2 al migrar), no se hace desde un hilo.
- **Reels** necesita fotogramas propios para la galería (hoy vacía): sacarlos de sus vídeos o pedirlos a Josep.
- **Extracto del artículo de la luz**: el `.md` tiene uno nuevo en primera persona («Cómo pienso la luz cuando cuento una historia...»); en la base está el de la tarjeta del prototipo. Preguntar a Josep cuál prefiere.
- Datos que faltan de cada ficha (años, cámara de Sin Piedad, festivales de Kiboko): `/mnt/project-files/textos-proyectos/pendientes.md`. Cuando Josep los dé, se actualizan en la base y en `plan/contenido/`.
- Cuando exista el panel (D), Josep edita todo esto desde allí; los `.md` dejan de ser la fuente.
