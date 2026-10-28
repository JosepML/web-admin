# Traspaso de la tarea C · Esqueleto público e Inicio desde la base

2026-10-23. Hecho por Opus en el hilo de la tarea C.

## Qué queda hecho

- **Inicio en `/`** sale entero de Supabase: la página `inicio` y sus 11 bloques (portada, servicios, filmmaker, trabajos, sobre mí, cifras, proceso, opiniones, clientes, blog y llamada). Comparado captura a captura con `/prototipos/d` a 1280 px y escalado 150 %: misma altura y mismo dibujo. Las únicas diferencias son a propósito (sin la barra de prototipos, sin «Editar página» hasta la tarea D, sin la nota «en la web final habrá un formulario…», y «Ver todos los trabajos» lleva a `/trabajos`).
- **Componentes de producción** en `src/components/` (marco, piezas, utilidades y los 15 tipos de bloque) y **capa de datos** en `src/lib/datos/` con caché por etiquetas y `revalidarContenido()`. Clases y variables renombradas de `d-` a `jm-`.
- **Receta** para las páginas siguientes: `plan/patron-paginas.md`. Formato de `datos` de cada bloque: `plan/esquema.md`.
- **Contenido cargado en la base** con `scripts/cargar-inicio.mjs` → `supabase/datos/04-inicio.sql`: página y bloques de Inicio, 15 clientes (Disney y Star Wars con logo), 6 opiniones (la del «puto máquina» en borrador, la decide Josep), 2 canales, medios nuevos (logos, foto de Sobre mí).
- Se borraron `src/app/page.tsx` (la página de espera), `src/components/TituloCredito.tsx` y `src/lib/ajustes.ts`, que ya no se usaban.

## Pendiente de Josep

1. ~~Ejecutar `supabase/datos/04-inicio.sql` en el editor SQL~~ Hecho por Josep el 2026-10-23: los 3 servicios están completos y publicados, y `ajustes` tiene correo, WhatsApp y redes. El archivo es repetible, pero no hay que volver a ejecutarlo cuando Josep edite los servicios desde el panel (los pisaría).
2. Vídeo de portada en mp4 (mientras, YouTube sin controles). Cuando esté en el bucket: un medio de tipo vídeo y su id en `bloques.datos.video.medio` de la portada.
3. Foto de Sobre mí definitiva (la actual es una captura provisional de postimg).
4. Logos de los clientes (solo Disney y Star Wars tienen; el resto sale con su nombre en letra).
5. Enlace del canal «Del Fan, Para el Fan» (sin enlace, la tarjeta no muestra «Ver canal»).
6. Póster de «Reels para redes»: el medio `2080844c…` de rbgescuela.com es una imagen de stock, no de Josep. Hoy la tarjeta usa un fotograma de YouTube; conviene sustituirlo y borrar el de stock.
7. Fotogramas limpios de las películas originales para el deslizador de `/recreaciones` (hoy recorta las comparaciones montadas, que en Nosferatu llevan los rótulos quemados abajo, por eso se ve recortada por arriba) y uno de *El Imperio Contraataca* para Luke y Vader, que no tiene.

## Pendiente para los hilos siguientes

- **S5 a S9 ya están hechos** (trabajos, fichas, servicios, recreaciones, Sobre mí y blog). Falta `/contacto` (S10): hoy los botones «Hablemos» llevan a la llamada de Inicio. Los títulos de «Mi mirada» de cada servicio siguen en el código (`src/components/servicios/PaginaServicio.tsx`) hasta que `servicios` tenga una columna para ellos (S15). 
- **Selección muestra 6 proyectos** (los de `destacado_orden` 1 a 6). El prototipo tenía 8 (también EXPÁNDE(TE) y Sin Tiempo). Si Josep los quiere, hace falta permitir más de 6 en `destacado_orden`.
- **D (edición):** «Editar página» y el panel. `revalidarContenido()` ya está lista para llamarla al publicar.
- **Tema claro:** se aplica tras cargar (se guarda en el navegador), así que quien lo eligió ve un instante el oscuro. Se puede arreglar con una cookie cuando se haga D.
- **S2:** todas las imágenes siguen siendo URLs externas (ImgBB, Imgur, YouTube). `next.config.ts` ya admite el bucket de Supabase.
