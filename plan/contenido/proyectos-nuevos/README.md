# Proyectos nuevos de este año

2026-10-24, actualizado el 2026-10-25 con las respuestas de Josep y el material de `D:\VIDEOS WEB`. 29 fichas (Azahara aún sin cargar). Las fotos (fotogramas de los vídeos, 185) están en `D:\VIDEOS WEB\_WEB\SUBIR`, con el nombre `<slug>-NN.jpg`. La carga es `supabase/datos/11-proyectos-nuevos.sql`, generado desde estas fichas con `scripts/generar-proyectos-nuevos.py`: si cambia una ficha, se vuelve a generar. Lo que queda abierto, en `cuestionario.md`.

**Cómo se carga:** 1) subir todas las fotos de `SUBIR` a la biblioteca de una vez; 2) ejecutar `11-proyectos-nuevos.sql` (ya incluye la migración de `categorias_extra` y enlaza los vídeos). **Vídeos:** están en el bucket público `jml-videos` de Cloudflare R2 (1080p, CRF 18, 3,9 GB; lista en `scripts/videos-r2.txt`). Cada uno entra en la biblioteca por su dirección (`medios.url_origen`) y la ficha lo reproduce con el vídeo con `rol: principal`. La dirección `r2.dev` vale para empezar, pero Cloudflare no la recomienda en producción: al lanzar, asociar un dominio propio al bucket y cambiar `R2` en el generador. Los proyectos entran en borrador: se ven en la vista previa y se publican desde el panel.

Formato de las fichas: el mismo de `../proyectos/` (cabecera con los campos de la ficha técnica, `Tarjeta`, `El proyecto`, `Decisiones clave`, `El reto`, `Resultado`). Solo hay texto donde Josep dio datos: no se inventan cifras, premios ni decisiones. Lo que dice `[pendiente]` o `[confirmar]` no se publica.

## Estructura (confirmada por Josep el 2026-10-25)

- **Tipo nuevo `corporativo`** («Corporativo»): se añade a los `tipos` de `filmmaker-spots-y-corporativo`, junto a `publicidad`.
- **Tipo nuevo `visuales-e-ia`** («Visuales e IA»): en Edición y en el filtro de Trabajos.
- **Redes sociales como categoría extra:** columna nueva `proyectos.categorias_extra` (slugs de tipos). El bloque de proyectos de una especialidad y los filtros de Trabajos cuentan un proyecto si su tipo **o** una de sus categorías extra coincide. Lo usan Shimano, El Langui con LON y la lavandería de LON (y los reels que vengan).
- **Conciertos:** cada orquesta, su proyecto. La ficha genérica «Conciertos» se oculta; la página de la especialidad agrupa.
- **Eventos deportivos:** la ficha existente pasa a «Shimano Super Cup Massi, La Nucía» (Ocisport), con el mismo vídeo.
- **EP Color ↔ EP Oscuridad:** enlace entre fichas (campo o bloque por decidir al cargar).
- **Frimar:** se carga oculto.
- **Clientes nuevos:** AIS, LOUK, Englobe, Agüita de Coco, Las Chicas de Venus, Alicante Light Film.

## Tabla

| # | Slug | Tipo | Extra | Servicios | JUNO | Falta |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | frimar-evento-fotografia (oculto) | corporativo | | Filmmaker | | 2 fotos |
| 2 | eventos-deportivos (revisión) | eventos | redes | Filmmaker, Edición | | enlaces de redes |
| 3 | flama-contenido-cinematografico-ia | visuales-e-ia | | Edición | sí | vídeo |
| 4 | zorom-ia (2025) | visuales-e-ia | | Edición | sí | vídeo |
| 5 | albir-confort-real-estate | publicidad | | Filmmaker, Edición | sí | cuántos vídeos |
| 6 | atavicas-trailer-obra-de-teatro | publicidad | | Filmmaker, Edición | sí | compañía, vídeo |
| 7 | ep-color-adrian-munoz | videoclip | | DF, Filmmaker, Edición | sí | vídeo |
| 8 | redencion | cortometraje | | DF | | tráiler |
| 9 | el-xato-evento-boda | publicidad | | Filmmaker, Edición | sí | vídeo |
| 10 | mandalorian-grogu-reel | redes-sociales | | Filmmaker, Edición | | vídeo |
| 11 | louk-the-grill | redes-sociales | | Filmmaker, Edición | sí | vídeo |
| 12 | lavanderia-grupo-lon | publicidad | redes | Edición | sí | vídeos |
| 13 | ais-10-anos | corporativo | | Filmmaker, Edición | sí | vídeo final |
| 14 | englobe-evento-redes | redes-sociales | | Edición | sí | vídeo |
| 15 | tara | cortometraje | | DF | | dossier, tráiler |
| 16 | evento-grupo-lon-el-langui | publicidad | redes | Filmmaker, Edición | sí | vídeo |
| 17 | flama-benissa-video-oficial, la-vibra-video-oficial, otra-movida-video-oficial, madison-video-oficial, azahara-video-oficial, flama-aftermovie | conciertos | | Filmmaker, Edición | sí | vídeos |
| 18 | aguita-de-coco-visuales | visuales-e-ia | | Edición | | fotos del escenario |

## Cuando lleguen vídeos, fotos y respuestas

1. Josep contesta `cuestionario.md` y trae los enlaces y las fotos.
2. Se completa cada ficha y se escribe una frase final con acento (`frase`), corta y sin fórmulas.
3. Se carga como las anteriores: SQL revisado (`supabase/datos/`) o desde el panel. Para fotos: subirlas a la biblioteca (no más ImgBB).
4. Se añaden los tipos nuevos a las páginas de especialidad y a los filtros de Trabajos.
5. Josep revisa en su vista previa, por tandas.
