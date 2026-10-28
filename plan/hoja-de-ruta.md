# Hoja de ruta: del prototipo D a la web completa

Fecha: 2026-10-22. Sustituye al orden de trabajo de las fases 4, 5 y 6 (sus archivos siguen valiendo como lista de comprobación). Cada tarea se hace en **un hilo propio**, salvo la A, que se termina en el hilo de la fase 3.

**Modelo:** **Opus** para lo que decide la arquitectura, el diseño o la voz de Josep. **Sonnet** para lo que sigue un patrón ya hecho. Las tareas de Sonnet solo empiezan cuando existe la pieza de Opus que copian.

## Reglas para todos los hilos

1. Lee `CLAUDE.md`, `plan/README.md`, `plan/00-contexto.md`, este archivo y solo los archivos que cite tu tarea.
2. Rama `claude/project-thread-9vb26d`. Nunca `master`. Nunca el proyecto de Supabase "JML Studio".
3. El diseño de referencia es el prototipo D (`src/app/prototipos/d/`). No inventes estética nueva: copia sus piezas, tokens y movimientos.
4. Rendimiento: anima solo `transform` y `opacity`. Sin `backdrop-filter` en elementos que se mueven. Imágenes en calidad alta (q90, 2x). Pruébalo con el escalado de Windows al 150 % (el de Josep).
5. Antes de cada commit, ejecuta `npm run lint`, `npx tsc --noEmit` y `npm run build`. Al terminar, marca la tarea aquí con `[x]` y añade una línea al *Registro* de abajo.
6. Lo que se vea en pantalla, Josep lo revisa en `http://localhost:3000` en su PC (sesión en su equipo). Sin su visto bueno, la tarea no está hecha.

## Decisiones de arquitectura (las fija Opus en B y C; las tareas de Sonnet no las cambian)

- **Rutas:** la web final vive en `src/app/(web)/` (Inicio `/`, `/trabajos`, `/trabajos/[slug]`, `/servicios/[slug]`, `/recreaciones`, `/sobre-mi`, `/blog`, `/blog/[slug]`, `/contacto`, `/gracias`, legales). El panel vive en `src/app/admin/`. `/prototipos` se borra en la fase 7.
- **Datos:** Supabase `oadmqwtnxpbotxcgzaoo`. Lectura en servidor (`src/lib/datos/*.ts`, una función por consulta) con caché y etiquetas. Al publicar se llama a `revalidateTag`.
- **Un solo editor:** Josep, con Supabase Auth (correo y contraseña, registro cerrado). Tabla `administradores` y función `es_admin()` en todas las políticas RLS. Lectura pública solo de lo publicado.
- **Borrador y publicado:** cada fila editable tiene `estado` (`borrador` o `publicado`). Josep edita, ve la vista previa y pulsa Publicar.
- **Flujo de edición cómodo (dos puertas):**
  1. **Editar en la propia web.** Si Josep ha iniciado sesión, aparece la pastilla «Editar página», como en el prototipo. Con ella edita los textos donde están, cambia imágenes arrastrando, reordena, oculta y añade secciones, todo con guardado automático en borrador. Después pulsa Publicar.
  2. **Panel `/admin`** para lo que son listas: proyectos, artículos, servicios, clientes, opiniones, mensajes, medios y ajustes. Formularios con autoguardado, subida de imágenes arrastrando y vista previa. Funciona también en el móvil.

## Tareas

### A · Remates de la dirección visual · Opus · hilo de la fase 3 (en curso)
- [x] Selección sin espacio sobrante, para que el scroll quede limpio
- [x] Al llegar al final de la página, el índice lateral se despliega como llamada a volver a una sección
- [x] Selección bien en modo claro
- [x] Ficha: galería en miniaturas con visor a pantalla completa
- [x] Ficha: quitar «Del LOG al color»
- [x] Fijar los tokens de diseño definitivos (colores, letras, radios, sombras y curvas de movimiento) en `src/styles/tokens.css`, y las piezas reutilizables (cristal, pastilla, tarjeta con foto, botón, etiqueta y titular con palabra de acento) documentadas en `plan/fase-3-direccion-visual.md`
- [x] Visto bueno de Josep → fase 3 «Hecha» (2026-10-22)

**Hecho cuando:** Josep da el visto bueno a D y los tokens están en un archivo único que importan las tareas C a K.

### B · Base de datos, seguridad y acceso · Opus · hilo nuevo
Lee: `plan/fase-4-base-de-datos-y-migracion.md`, `plan/contenido/mapa-de-contenido.md`, `src/app/prototipos/d/datos.ts`, `legacy/types.ts`.
- [x] Esquema SQL como migraciones (y copia en `supabase/migrations/`): `servicios`, `proyectos` (con ficha técnica, premios jsonb, `clip_url`, `video_portada_url`, galería ordenada, `id_antiguo`, `estado`, `orden`, `destacado`), `articulos`, `paginas`, `bloques` (pagina, orden, tipo, visible, datos jsonb, estado), `clientes` (nombre, logo, orden, `con_juno`), `opiniones`, `canales` (YouTube), `medios`, `mensajes`, `ajustes`, `administradores`. Preparado para varios idiomas, con una columna `idioma` por defecto `es`.
- [x] RLS en todas las tablas y función `es_admin()`. `mensajes`: inserción pública con límite y lectura solo para el administrador.
- [x] Bucket `medios` (lectura pública, escritura solo del administrador).
- [x] Usuario de Josep creado, con el registro público cerrado. La contraseña la pone él; nunca se escribe en el repositorio.
- [x] Tipos generados en `src/lib/supabase/tipos.ts`.
- [x] Avisos de seguridad de Supabase (advisors) a cero.
- [x] `plan/esquema.md`: tabla por tabla, para qué sirve cada campo y qué tipos de bloque existen, con el formato de su `datos`.

**Hecho cuando:** el esquema está aplicado, los advisors no dan avisos y `plan/esquema.md` lo explica.

### C · Esqueleto de la web pública e Inicio conectado · Opus · hilo nuevo · necesita A y B
- [x] Pasar el prototipo D a componentes de producción en `src/components/` (Marco, menú, pie, índice lateral, scroll mágico, transición, tarjetas, bloques)
- [x] Capa de datos `src/lib/datos/` con caché por etiquetas y `revalidarContenido()`
- [x] Inicio `/` construido a partir de `bloques` de la base de datos (cada tipo de bloque es un componente)
- [ ] Vídeo de portada como archivo propio (mp4 en Storage) en lugar de YouTube. Necesita el archivo de Josep; mientras no llegue, se usa YouTube. El componente ya acepta el mp4 (`datos.video.medio`).
- [x] `plan/patron-paginas.md`: cómo se hace una página nueva (receta que seguirán las tareas de Sonnet)

**Hecho cuando:** Inicio en `localhost:3000` se ve igual que el prototipo D, leyendo los datos de Supabase.

### D · Sistema de edición · Opus · hilo nuevo · necesita B y C
- [x] Inicio de sesión en `/admin/entrar` y protección de `/admin` con el middleware
- [x] Modo «Editar página» real sobre `bloques`: texto editable en su sitio, cambiar imagen arrastrando (subida a `medios`), reordenar, ocultar, añadir y duplicar secciones, autoguardado en borrador, Publicar y Descartar
- [x] Base del panel `/admin`: barra lateral, lista con búsqueda y orden arrastrando, formulario genérico con autoguardado, campo de imagen, campo de galería, campo de vídeo (YouTube, Instagram o archivo), vista previa y Publicar
- [x] Proyectos completos en el panel (crear, editar, duplicar, ocultar, reordenar y destacar), que sirven de modelo para las demás pantallas
- [x] `plan/patron-panel.md`: receta para añadir una pantalla nueva al panel

**Hecho cuando:** Josep crea un proyecto de prueba y edita un texto de Inicio, y los dos se ven publicados sin tocar código. (Probado en el emulador del contenedor; falta que Josep lo haga en su PC con la base real.)

### E · Textos de los proyectos y artículos · Opus · hilo nuevo · puede empezar ya
Lee: `legacy/constants.ts`, `plan/contenido/fundamentos.md`, `plan/contenido/mapa-de-contenido.md`, `plan/contenido/trabajos-recreaciones-y-blog.md` y la web original (https://josepml.github.io/JosepML/#/).
- [ ] Para cada uno de los 18 proyectos: reescribir el cuerpo en la voz de la web nueva (primera persona, cálido y concreto, sin vender tarifas) y con **más contenido**: la historia, mi papel, decisiones de luz y cámara, el reto, cómo se resolvió, el resultado y una cita o anécdota. Un archivo por proyecto en `plan/contenido/proyectos/<slug>.md` con sus campos de ficha.
- [ ] Revisar los 3 artículos del blog con el mismo criterio.
- [ ] Una lista corta de preguntas a Josep por proyecto, solo donde falten datos reales. Nunca se inventan premios, cifras ni nombres.
- [ ] Josep revisa en tandas de 4 o 5 proyectos.

**Hecho cuando:** los 18 proyectos y los 3 artículos tienen su archivo aprobado por Josep.

### Tareas para Sonnet (cada una en su hilo; siguen `plan/patron-paginas.md` o `plan/patron-panel.md`)

| Id | Tarea | Necesita | Hecho cuando |
| --- | --- | --- | --- |
| S1 ✓ | Script `scripts/migrar-legacy.mjs` (hecho 2026-10-22, ver `plan/traspaso-carga-base.md`): proyectos y artículos de `legacy/constants.ts` a Supabase, guardando `id_antiguo` | B | 18/18 proyectos y 3/3 artículos en la base de datos; recuento en `fase-4` |
| S2 ✓ | (hecho 2026-10-26, ver Registro) Copiar las ~90 imágenes de ImgBB e Imgur al bucket `medios` y reescribir las URLs (en el PC de Josep) | B, S1 | 0 URLs externas de imagen en la base de datos |
| S3 (casi) | Cargar en la base de datos los textos de `plan/contenido/` (servicios, bloques de Inicio, Sobre mí, clientes, opiniones, canales). Inicio, servicios, clientes, opiniones y canales los cargó C (`scripts/cargar-inicio.mjs`); falta Sobre mí, que va con S8 | B | Inicio y servicios sin textos fijos en el código |
| S4 ✓ | Cargar los textos aprobados de E en `proyectos` y `articulos` | E, S1 | Cada ficha muestra su texto nuevo |
| S5 ✓ | (hecho en el hilo de C, 2026-10-23: `src/components/trabajos/`) `/trabajos` con filtros por servicio y tipo, y la ficha `/trabajos/[slug]` (galería con visor y siguiente proyecto) | C | Las 18 fichas se abren sin errores, en claro y oscuro |
| S6 ✓ | `/servicios/[slug]` (los 3) (hecho en el hilo de C, 2026-10-23: `src/components/servicios/`) | C | Igual que el prototipo, con sus proyectos y preguntas frecuentes |
| S7 ✓ | `/recreaciones` con antes y después (hecho en el hilo de C, 2026-10-23: `src/components/recreaciones/`) | C | Las 4 recreaciones con su deslizador |
| S8 ✓ | `/sobre-mi` (hecho en el hilo de C, 2026-10-23: página de bloques, `scripts/cargar-sobre-mi.mjs`; faltan las fotos de Josep) | C | Texto, fotos y canales de YouTube |
| S9 ✓ | `/blog` y `/blog/[slug]` (hecho en el hilo de C, 2026-10-23: `src/components/blog/`, el cuerpo se pinta desde el documento del editor con `ContenidoArticulo`) | C | 3 artículos legibles, con el ancho de lectura cuidado |
| S10 ✓ | `/contacto` guiado que guarda en `mensajes` y avisa por correo (Formspree); `/gracias` | C | Un mensaje de prueba llega al correo y a la base de datos |
| S11 ✓ | Privacidad, aviso legal, cookies (aviso AEPD) y GA4 `G-RKBDRMVL1J` tras aceptar (datos legales de Josep incorporados en `src/lib/datos/legales.ts`) | C | GA4 recibe la visita solo tras aceptar |
| S12 ✓ | SEO: metadatos, Schema.org (Person, Service, CreativeWork, Article), `sitemap.xml`, `robots.txt` e imágenes OG | S5–S9 | Validadores de Google sin errores |
| S13 ✓ | Redirecciones de las URLs antiguas con hash (`/#/project/<id>`, etc.) y por `id_antiguo` | S1, S5 | Todas las URLs antiguas llevan a su página nueva |
| S14 ✓ | (hecho en el hilo de D, 2026-10-24) Panel: artículos con editor visual (títulos, negritas, imágenes y vídeos en el texto) y SEO con vista previa de Google | D | Josep escribe y publica un artículo de prueba |
| S15 ✓ | (hecho en el hilo de D, 2026-10-24) Panel: servicios, clientes (logos), opiniones, canales y ajustes | D | Cada cosa se edita y se ve en la web |
| S16 ✓ | (hecho en el hilo de D, 2026-10-24; el recorte se guarda como imagen nueva) Panel: biblioteca de medios (subir, recortar, texto alternativo, ver dónde se usa) | D | Subir, recortar y reutilizar una imagen |
| S17 ✓ | (hecho en el hilo de D, 2026-10-24; se prueba de verdad con S10) Panel: mensajes (nuevo, respondido, cerrado) | D, S10 | El mensaje de prueba cambia de estado |
| S18 ✓ | Copia de seguridad de la base de datos y los archivos en `copias-seguridad/` (`scripts/copia-seguridad.mjs` y `.bat`) | B | Script listo y verificado |
| S19 ✓ | Guía del panel `plan/guia-del-panel.md` | D, S14–S17 | Josep la sigue sin ayuda |
| S20 ✓ | Repaso final: móvil, teclado, accesibilidad, «reducir movimiento» y compilación limpia | todo | Informe en `plan/repaso-final.md` |

### F · Lanzamiento · Opus · hilo de la fase 7
Sigue `plan/fase-7-lanzamiento.md`. Solo con la orden expresa de Josep.

## Orden recomendado

1. **Ya:** A (hilo de la fase 3), B y E en paralelo.
2. **Cuando estén A y B:** C. Después, S1, S2 y S3 en paralelo.
3. **Cuando esté C:** D, y S5 a S11 en paralelo (cada una en su hilo).
4. **Cuando esté D:** S14 a S17, y S4 cuando E esté aprobada.
5. **Al final:** S12, S13, S18, S19 y S20. Después, F.

## Pendiente de Josep (no bloquea, pero cuanto antes mejor)

- Vídeo de portada como archivo (mp4) o permiso para sacarlo de su canal.
- Logos oficiales de los clientes, o permiso para descargarlos de sus webs.
- Enlace del canal «Del Fan, Para el Fan» y cifras de suscriptores, si quiere mostrarlas.
- Cámara y año de cada proyecto, y los datos que pida E.
- Retrato y fotos de rodaje para «Sobre mí».

## Registro

- 2026-10-22: hoja de ruta creada a partir de la revisión de Josep del prototipo D.
- 2026-10-22 (tarea E): textos en borrador de los 18 proyectos (`plan/contenido/proyectos/`) y los 3 artículos (`plan/contenido/articulos/`), con preguntas para Josep en cada archivo. Pendiente de su revisión en tandas; E sigue sin marcar hasta su visto bueno.
- 2026-10-22 (tarea A): remates de Selección, índice lateral desplegable y ficha (miniaturas con visor, sin «Del LOG al color»); tokens en `src/styles/tokens.css` y `src/styles/movimiento.ts`, usados ya por el prototipo D; piezas reutilizables documentadas en `plan/fase-3-direccion-visual.md`. Falta el visto bueno de Josep.
- 2026-10-22 (tarea B): esquema rehecho sobre una base sólida y aplicado (migraciones `esquema_solido_0` a `_3`), con RLS, `es_admin()`, bucket `medios`, tipos y advisors de seguridad a 0. Pruebas de seguridad y publicación pasadas en la base real. Nombres de campo distintos a los de esta lista (p. ej. `clip_id` en vez de `clip_url`, `destacado_orden`): ver `plan/esquema.md`. Usuario de Josep creado y dado de alta como administrador; registro público cerrado. B terminada.
- 2026-10-22 (tarea E, revisión): Opus revisa los 18 textos de proyectos con un criterio más exigente (decisiones concretas, cámara, reto con solución, resultado solo con hechos; sin relleno). Criterio en `plan/contenido/proyectos/README.md`. `textos.ts` del prototipo se regenera con `scripts/textos-prototipo.mjs`.
- 2026-10-22: `plan/repaso-final.md` con el repaso de cada sección, las preguntas abiertas y el orden de los hilos siguientes para dejar la web «niquelada». Blog del prototipo con imagen en las tarjetas; artículo del DSLR retirado.
- 2026-10-22 (tarea S1): 18/18 proyectos, 2/2 artículos (el del DSLR retirado), 36 `proyecto_servicios`, 90 medios y 3 servicios mínimos cargados en la base con `scripts/migrar-legacy.mjs`. Detalle y pendientes en `plan/traspaso-carga-base.md`.
- 2026-10-22 (tarea S4): textos de los 18 proyectos y los 2 artículos en la base, comprobados contra `plan/contenido/` (los cargó S1; S4 añadió la columna `frase` y corrigió pósteres, títulos de sección, cámaras y artículos con sus fotos). Nota en `plan/traspaso-textos-s4.md`. Falta la frase final de las 4 recreaciones.
- 2026-10-23 (tarea C): Inicio `/` sale entero de Supabase (página y 11 bloques), con los componentes de producción en `src/components/`, la capa de datos en `src/lib/datos/` y la receta `plan/patron-paginas.md`. Igual que el prototipo D captura a captura. Cargados clientes, opiniones, canales y bloques; los servicios completos y los ajustes esperan a que Josep ejecute `supabase/datos/04-inicio.sql`. Detalle en `plan/traspaso-tarea-c.md`. Falta el visto bueno de Josep y el mp4 de portada.
- 2026-10-23: Josep ejecutó `supabase/datos/04-inicio.sql`; servicios publicados y ajustes completos. Su versión local está en `5648f35`.
- 2026-10-23: `/blog` y `/blog/[slug]` montados (las tarjetas de Inicio daban 404). Cabecera del listado: primer bloque de la página `blog` si existe, si no el bloque Blog de Inicio. La invitación final de cada artículo repite el título de la llamada de Inicio.
- 2026-10-23: S5, S6 y S8 hechos en el hilo de C para que Inicio no tuviera enlaces rotos: `/trabajos` (filtros por servicio y tipo, sin las recreaciones), las 18 fichas `/trabajos/[slug]`, los 3 servicios y `/sobre-mi` (página de bloques cargada en la base). El menú ya apunta a Trabajos, Sobre mí y Blog. Siguen sin página `/recreaciones` (S7) y `/contacto` (S10).
- 2026-10-23: S7 hecho: `/recreaciones` (orden Nosferatu, El Padrino, Luke y Vader, Star Wars sin CGI) con deslizador «Original / Mi recreación». No hay fotogramas sueltos de las películas: el deslizador recorta las comparaciones ya montadas de Nosferatu, El Padrino y Star Wars sin CGI; Luke y Vader enseña el póster y el vídeo hasta que haya un fotograma original. `/trabajos` acaba con una tarjeta que lleva a Recreaciones. Contenido en `supabase/datos/07-recreaciones.sql` (aplicado). Solo falta `/contacto` (S10).
- 2026-10-23: apuntes de Josep: filtros de `/trabajos` con categorías propias por servicio (tipos nuevos `conciertos` «Aftermovies y conciertos» y `bodas`), sello «con JUNO Media» en tarjeta y ficha (`proyectos.con_juno`), enlace «Así trabajamos» en el bloque JUNO (espera el artículo), índice lateral que se despliega con el ratón encima, barra de arriba que vuelve al llevar el ratón arriba y anclas (`/#servicios`) encuadradas como el scroll mágico.
- 2026-10-24 (tarea D): sistema de edición montado. `/admin/entrar` y middleware; modo «Editar página» en Inicio y Sobre mí (texto en su sitio, cambiar imagen arrastrando, reordenar, ocultar, añadir, duplicar y borrar secciones, deshacer, autoguardado, Publicar, Descartar, historial y vista previa); panel con Resumen, Páginas y Proyectos completos (lista con búsqueda, filtros y orden, destacados de Inicio, nuevo, duplicar, ocultar, borrar y formulario con autoguardado, galería, vídeos, premios y SEO); vista previa de toda la web con lo no publicado. Receta en `plan/patron-panel.md`, emulador de Supabase para probar en el contenedor en `scripts/supabase-local/`, detalle en `plan/traspaso-tarea-d.md`. Falta el visto bueno de Josep en su PC.
- 2026-10-24 (hilo de D, S14 a S17): el resto del panel, a petición de Josep. Artículos con editor visual (títulos, negrita, cursiva, enlaces, listas, citas, imágenes y vídeos de YouTube entre párrafos) y vista previa de Google; servicios (con el título de «Mi mirada», columna nueva `titulo_mirada` que tiene que ejecutar Josep: `supabase/migrations/20261024190000_servicios_titulo_mirada.sql`); clientes, opiniones y canales; ajustes; biblioteca (subir, descripción, dónde se usa, borrar lo que no se usa; falta recortar) y mensajes (estados, notas, responder por correo o WhatsApp). Lista genérica `ListaContenido` y receta ampliada en `plan/patron-panel.md`. Probado en el emulador.
- 2026-10-24 (hilo de D): apuntes de Josep sobre Clientes. Marcas en filas de seis desde 1200 px (cuatro desde 1024, tres en tableta, dos en móvil) y la última fila, si no está completa, centrada; lo mismo en JUNO, con líneas por fila y una línea entre filas. Logos un punto por debajo de los nombres escritos para que pesen igual. Si la sección no cabe en la pantalla, el scroll mágico se para en cada parte (`data-punto-alto`). Nueva pantalla **Ordenar secciones** (`/admin/paginas/[id]`, atajo «Orden de Inicio» en el Resumen): arrastrar, subir, bajar y ocultar secciones, en el mismo borrador que «Editar página». El cambio de orden Clientes antes que Opiniones lo hace Josep desde ahí.
- 2026-10-24 (hilo de D): el vídeo grande ya no va a tirones. Causa: un desenfoque a pantalla completa (`backdrop-blur-xl`) encima del vídeo de fondo de la cabecera, que seguía reproduciéndose detrás, así que el navegador recalculaba el desenfoque en cada fotograma y decodificaba dos vídeos. Ahora la ventana va sin desenfoque y por encima del menú, y mientras está abierta (o el visor de fotos) los vídeos de fondo se pausan y la página se congela (`marcarVideoAbierto` en `src/components/comun/hooks.ts`). Las fichas pintan los «Más vídeos» (`src/components/trabajos/MasVideos.tsx`: YouTube, Shorts y reels en vertical, Instagram y archivos), con su título editable. S16 terminada: recortar en la biblioteca con proporciones (libre, 16:9, cine, 4:5, 1:1, 9:16) a la resolución original. Siguientes pasos en `plan/siguientes-pasos.md`.
- 2026-10-24 (hilo de D): «Lo que puedo grabar para ti» replanteado a petición de Josep. Cada tarjeta lleva a una página por especialidad (`/servicios/filmmaker/videoclips`, conciertos y aftermovies, bodas, eventos deportivos, spots y vídeo corporativo, contenido para redes): cómo trabajo ese encargo, pasos y todos sus proyectos (bloque `trabajos` con `tipos`; con un solo proyecto, también sus «Más vídeos»). Son páginas de bloques editables en su sitio, y salen también en `/servicios/filmmaker`. El bloque `video` admite varios vídeos. Contenido de partida en `supabase/datos/09-especialidades-filmmaker.sql` (lo ejecuta Josep). Panel: Páginas agrupa las especialidades, y Trabajos y Recreaciones tienen su pantalla de cabecera y Google. Siguiente tarea que pidió Josep: añadir los proyectos del último año.
- 2026-10-24: `plan/plan-publicacion.md`: lo que falta hasta publicar, separado entre Opus (O1 preparar proyectos nuevos, S2, textos, S20, F) y Sonnet (proyectos del año, S10–S13, S18, S19).
- 2026-10-26 (tarea S2): las 95 imágenes externas de `medios` (ImgBB 50, Imgur 32, YouTube 7 y 6 de otros sitios) copiadas al bucket `medios`, carpeta `migradas/<id>.<ext>` (133 MB), con `ruta`, `mime`, `bytes`, `ancho` y `alto` rellenados y los ids intactos; `url_origen` se conserva como registro. Hecho en el navegador de Josep con su sesión de administrador, descargando cada imagen con un proxy local temporal. Comprobado: 0 imágenes sin ruta en la base; 18 páginas recorridas en Chrome, 1106 de 1109 imágenes salen del bucket y ninguna está rota. Las 3 restantes son miniaturas de YouTube de los vídeos de las fichas (no son `medios`).
- 2026-10-27 (tareas S10–S13, S18–S20): S10 confirmada con Formspree. S11 montada: páginas `/aviso-legal`, `/privacidad` y `/cookies`, panel de preferencias, aviso de cookies AEPD y GA4 (`G-RKBDRMVL1J`) cargado solo tras aceptar; datos del titular concentrados en `src/lib/datos/legales.ts` a la espera de confirmación de Josep. S12 montada: JSON-LD Schema.org (`Person`, `ProfessionalService`, `Service`, `FAQPage`, `CreativeWork`, `BlogPosting`), `/sitemap.xml`, `/robots.txt` e imagen OpenGraph (`/opengraph-image`). S13 completada: redirección de todos los hashes antiguos (`RedireccionAntigua.tsx`), redirecciones sin `#` (`next.config.ts`) y resolución por `id_antiguo` en `/trabajos/[slug]` y `/blog/[slug]`. S18 lista (`scripts/copia-seguridad.mjs` y `scripts/hacer-copia-seguridad.bat` en `copias-seguridad/`). S19 escrita (`plan/guia-del-panel.md`). S20 comprobada y documentada en `plan/repaso-final.md` y `plan/traspaso-proyecto.md`.
