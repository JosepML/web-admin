# Traspaso: carga de proyectos y artículos en la base (tarea S1)

Hilo «Carga de contenido en la base», 2026-10-22. Proyecto de Supabase `oadmqwtnxpbotxcgzaoo` ("Web Josep Mira"). Solo se ha insertado o actualizado; no se ha borrado nada.

## Recuento en la base

| Qué | Cargado | Notas |
| --- | --- | --- |
| Proyectos | **18 / 18** | Estado `publicado` (ver «Decisión de estado»). `id_antiguo` conservado en todos |
| Artículos | **2 / 2** | El del DSLR no se carga: Josep lo retiró (la hoja de ruta decía 3) |
| `proyecto_servicios` | 36 | Orden y destacado por servicio según `SELECCION` de `datos.ts` |
| Medios | 90 | Con `url_origen` y sin `ruta`: S2 los descarga al bucket |
| Servicios | 3, en `borrador` | Solo slug, nombre, frase, resumen y orden; completa y publica el hilo que carga los textos de servicios |

Comprobado: 0 proyectos sin imagen de portada. Fichas con menos de 4 imágenes: El Cirujano (2), Y el año que viene (3), Reels (1, ver abajo).

## Qué se ha cargado y de dónde

- **Ficha técnica** (título, tipo, año, dirección, productora, papel, cámara): `datos.ts` del prototipo para los 14 proyectos que tiene; los `.md` de `plan/contenido/proyectos/` para las 4 recreaciones. Los `[pendiente]` quedan vacíos (nunca «Pendiente»).
- **Textos** de los `.md` de E, tal cual en Markdown: `tarjeta`, `historia` (= «El proyecto»), `como_lo_hicimos` (= «Decisiones clave», lista `- **Título.** texto`), `el_reto`, `el_resultado` (lista). `mi_papel` queda vacío. «Para revisar» no se carga. Esto cubre también la tarea S4.
- **`frase`** (conclusión con `*acento*`): columna nueva de la migración `20261022230000_proyectos_frase` (la creó el hilo S4). Las 4 recreaciones no tienen frase.
- **Premios**: Y el año que viene `podio` 2024; El Cirujano `ganado` (sin año); Kiboko `nominacion` 2026 (sin festival); EP Oscuridad `cifra` «1,39 M visualizaciones». Nada inventado.
- **Vídeos extra**: Conciertos (3 piezas + proceso `VdDBgDkqCio`) y Reels (Instagram + 3 shorts, `videos_debajo_del_texto`).
- **Galería**: fotogramas de `datos.ts` más los de `legacy/constants.ts`, sin duplicados. Se omitió `iili.io/BmoHrCl.png` (ya no existe). `imagen_id` = póster.
- **Orden de Trabajos** en `orden` (1 a 18, recreaciones al final) y destacados de Inicio en `destacado_orden` (1 a 6).
- **Artículos**: documento ProseMirror generado desde los `.md`; categoría e imagen de tarjeta de `datos.ts`.

## Decisión de estado

Proyectos y artículos están `publicado` para que la web local (tarea C) los lea con la clave pública. Nada sale a internet por ello: la web actual es estática en `master`. Si se prefiere borrador, basta `update proyectos set estado = 'borrador'`.

## Cómo repetirlo

`node --experimental-strip-types scripts/migrar-legacy.mjs` regenera `supabase/datos/01-servicios-medios.sql`, `02-proyectos-NN.sql` y `03-articulos.sql`. Se aplican con `execute_sql` en ese orden. Son repetibles (upsert por `id_antiguo`, medios por `url_origen`). **No volver a aplicarlos** sobre filas que otros hilos hayan corregido: pisarían sus cambios.

## Pendiente que no es de este hilo

- ~~**S4**~~ hecho el 2026-10-22: ver `plan/traspaso-textos-s4.md`. Los textos coincidían; se corrigieron pósteres, `titulos_seccion`, cámaras de las recreaciones y los artículos (`supabase/datos/s4_correcciones.sql`). Si se vuelve a ejecutar `migrar-legacy.mjs`, aplicar ese archivo después.
- **S2**: pasar las 90 imágenes a Storage, rellenar `ruta` y limpiar `url_origen`. Las de Bodas llevan el nombre de los novios en la URL (visible hoy en `medios.url_origen`, que el público puede leer): renombrar y borrar el origen.
- **Datos que faltan** (preguntas a Josep en `/mnt/project-files/textos-proyectos/pendientes.md`): año de 15 proyectos, cámara de Sin Piedad, festivales de Kiboko, año del premio de El Cirujano. Antes de publicar, la ficha no debe mostrar «Pendiente» sino ocultar el campo.
- Servicios: completar mirada, aporto, para quién, pasos, preguntas, etc. y publicarlos.
