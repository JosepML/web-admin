# Esquema de la base de datos

Proyecto de Supabase: **Web Josep Mira** (`oadmqwtnxpbotxcgzaoo`, eu-west-3). Nunca "JML Studio".

- Migraciones: `supabase/migrations/` (en orden por fecha).
- Pruebas: `supabase/tests/` (cómo se ejecutan, al final de este documento).
- Tipos de TypeScript: `src/lib/supabase/tipos.ts` (se regeneran tras cada migración).

## Decisiones y por qué

Revisado por Opus el 2026-10-22 sobre una primera versión hecha con Haiku. La primera versión se archivó en el esquema `archivo_v1` (estaba vacía; respaldo en `supabase/respaldos/`), cerrado al público y a la sesión, porque tenía fallos de base: tipos de bloque distintos de los del prototipo D, servicios fijados a mano en los proyectos, imágenes como URLs sueltas sin integridad, publicar en varios pasos sin transacción ni historial, y traducciones sin vínculo entre ellas.

1. **Borrador y publicado sin tocar la versión en vivo.** Cada fila de contenido tiene `estado` (`borrador` o `publicado`): el público solo ve lo publicado. Lo que Josep edita se autoguarda en la tabla `borradores`, nunca en la fila. Así puede editar un proyecto publicado durante días sin que la web cambie hasta que pulsa Publicar.
   - *Descartado:* una columna `borrador` dentro de cada tabla. El público puede leer las filas publicadas, y con una política mal escrita leería también los borradores. En una tabla aparte, el público no tiene ni permiso de tabla.
2. **Publicar es una función de la base de datos (`publicar`), en una sola transacción.** Aplica el borrador, guarda la versión anterior en `revisiones`, sincroniza servicios o bloques, marca como publicado y borra el borrador. Si algo falla, no cambia nada. Si lo hiciera la app en varios pasos, un corte a mitad dejaría la web a medias.
3. **Historial de versiones (`revisiones`).** Cada publicación guarda la versión anterior (las 30 últimas por fila). `restaurar_revision` la vuelve a poner en el borrador, sin publicar, para que Josep la revise.
4. **El borrador se valida al guardarlo.** Un trigger rechaza campos que no existen (por ejemplo `precio`) y valores del tipo equivocado (un año con letras), así el error sale al escribir y no al publicar.
5. **Una página se edita y publica entera.** El borrador de una página contiene la lista completa de sus bloques, en orden. Publicar los crea, cambia, reordena, oculta y borra de golpe. Es lo que pide el modo «Editar página»: Josep mueve secciones, cambia textos y, hasta que pulsa Publicar, la web sigue igual.
6. **Las imágenes son filas de `medios`, y todo apunta a ellas por id.** Las columnas `*_id` tienen clave foránea: no se puede borrar una imagen en uso. Las listas en JSON (galerías, bloques, artículos) se validan con triggers, y borrar un medio que aparece en ellas da un error que dice dónde se usa. Durante la migración, un medio puede ser una URL externa (`url_origen`); la tarea S2 la descarga, la sube al bucket y rellena `ruta`.
   - *Contrapartida asumida:* la tabla `medios` la puede leer el público (la web la necesita para pintar las imágenes con su texto alternativo y su tamaño). Una imagen subida para un proyecto aún sin publicar se podría encontrar si alguien busca en la API. Para un portfolio es aceptable; si algún día hace falta, se restringe a los medios en uso por contenido publicado.
7. **Servicios de cada proyecto en una tabla de unión (`proyecto_servicios`).** Con clave foránea a `servicios`, así un servicio nuevo creado desde el panel funciona sin tocar el esquema. Guarda además el orden y si es destacado *en la página de ese servicio* («Destacados por servicio» de `mapa-de-contenido.md`).
8. **Tipos de proyecto y categorías del blog son tablas, no listas fijas.** Josep puede añadir una categoría sin migración. `tipos_proyecto.en_listado_general` recoge la regla de que las recreaciones no salen en «Todos».
9. **Enums para lo que depende del código.** Estados, tipos de bloque y tipos de medio son enums de Postgres: el TypeScript generado da uniones exactas (`'borrador' | 'publicado'`) y el compilador avisa de errores. Añadir un tipo de bloque es una migración, a propósito: cada tipo necesita su componente.
10. **Varios idiomas, preparado de verdad.** Tabla `idiomas` (con `es` como predeterminado). El contenido traducible tiene `idioma` (con clave foránea) y `grupo`: la fila en español y su traducción comparten `grupo`, y así el selector de idioma encuentra la otra versión. Las claves únicas son por idioma: `(idioma, slug)`.
11. **Redirecciones automáticas.** Cambiar el slug de algo publicado crea una redirección de la ruta vieja a la nueva (y actualiza las cadenas). Las URLs antiguas con `#` se resuelven con `id_antiguo` (tarea S13).
12. **Artículos como documento estructurado, no HTML.** `articulos.contenido` es el documento del editor visual (formato ProseMirror/TipTap). La web lo pinta con componentes propios: no hay HTML guardado que pueda inyectar código, y las imágenes del texto apuntan a `medios`. Los vídeos de Instagram se guardan como enlace, no como el HTML de inserción de la web antigua.
13. **Seguridad en tres capas.** RLS en todas las tablas; permisos de tabla retirados al público donde no debe entrar (`borradores`, `revisiones`, `administradores` y la lectura de `mensajes`); y funciones que comprueban `es_admin()`. `TRUNCATE` (que se salta la RLS) está retirado para todos los roles de la API.
14. **`es_admin()` sin privilegios elevados.** Es `SECURITY INVOKER`: la RLS de `administradores` deja leer la propia fila. La única función `SECURITY DEFINER` es el freno de mensajes, que no se puede llamar desde la API.
15. **Una política por rol y acción.** Evita que Postgres evalúe varias políticas en cada lectura (aviso de rendimiento de Supabase) y hace las reglas fáciles de leer.
16. **Sin precios y sin equipo.** Ninguna tabla tiene precio, tarifa ni tramo de presupuesto, ni tabla de equipos. La cámara va en la ficha de cada proyecto (`camara`).

## Tablas

### Contenido con borrador y publicado

Todas tienen `estado`, `publicado_en` (primera publicación), `creado_en` y `actualizado_en`. Las traducibles tienen también `idioma` y `grupo`.

**`proyectos`**: las fichas de trabajo. Los nombres de los textos son los de la tarea E (`plan/contenido/proyectos/`).

| Campo | Para qué |
| --- | --- |
| `slug`, `id_antiguo` | Dirección (`/trabajos/<slug>`) e id de la web antigua, para redirigir enlaces viejos |
| `titulo`, `tipo_id` | Título y tipo (tabla `tipos_proyecto`) |
| `anio`, `direccion`, `productora`, `papel`, `camara` | Ficha técnica. `papel` es el corto de la tarjeta («Dirección y montaje»). En los archivos de E: `año`, `productora_cliente` y `mi_papel` de la cabecera |
| `premios` | Lista: `[{"anio": 2024, "nombre": "Mejor fotografía", "tipo": "ganado", "festival": "..."}]`. `nombre` es obligatorio |
| `tarjeta`, `historia`, `mi_papel`, `como_lo_hicimos`, `el_reto`, `el_resultado` | Textos (Markdown básico: párrafos, cursiva, negrita). Sección vacía = no se muestra. Con la estructura de E: `historia` = «El proyecto», `como_lo_hicimos` = «Decisiones clave» (lista `- **Título.** texto`, tarjetas numeradas), `el_reto` = «El reto», `el_resultado` = «Resultado» (lista de hechos). `mi_papel` queda vacío: el papel ya está en la ficha |
| `frase` | Frase final de la ficha con doble tipografía; la cursiva va entre `*asteriscos*`. Vacía = no se muestra |
| `titulos_seccion` | Títulos visibles de las secciones. Hoy todas las fichas: `{"historia": "El proyecto", "como_lo_hicimos": "Decisiones clave", "el_reto": "El reto", "el_resultado": "Resultado"}` |
| `youtube_id`, `youtube_inicio` | Vídeo principal y segundo en el que empieza el clip de vista previa |
| `videos`, `videos_debajo_del_texto` | Vídeos extra: `[{"tipo": "youtube" \| "youtube-short" \| "instagram" \| "archivo", "id" \| "url" \| "medio": ..., "titulo": "...", "rol": "proceso"}]` |
| `imagen_id`, `clip_id`, `video_portada_id` | Póster, clip corto de la tarjeta (mp4) y vídeo de cabecera de la ficha (todos a `medios`) |
| `galeria`, `detras_de_camaras` | Listas ordenadas: `[{"medio": "<id>", "pie": "..."}]` |
| `destacado_orden` | Posición en Inicio (1, 2, 3...). Vacío = no sale en Inicio |
| `orden` | Orden en Trabajos |
| `seo_titulo`, `seo_descripcion` | SEO |

Los servicios del proyecto están en `proyecto_servicios` (`orden` y `destacado` dentro de la página de cada servicio). En el borrador viajan como `"servicios": ["<id servicio>", ...]`.

**`servicios`**: las páginas de servicio (`/servicios/<slug>`). `nombre`, `frase`, `resumen`, `titulo_mirada`, `mirada` (lista de párrafos), `aporto` y `para_quien` (listas de frases), `con_quien`, `pasos` (`[{"titulo", "texto"}]`), `preguntas` (`[{"pregunta", "respuesta"}]`), `llamada`, `imagen_id`, SEO y `orden`.

**`articulos`**: el blog. `slug`, `id_antiguo`, `titulo`, `fecha` (la que se muestra), `extracto`, `contenido` (documento del editor), `categoria_id`, `imagen_id` y SEO. En `contenido` hay nodos `paragraph`, `heading` (nivel 2), texto con marcas `italic` y `bold`, e `image` con `attrs: {"medio": "<id de medios>", "alt": "...", "pie": "..."}`.

**`paginas`**: Inicio (`inicio`), Sobre mí, Recreaciones, Contacto, legales y las que Josep cree. `slug`, `titulo`, `imagen_id` (para compartir) y SEO. El contenido está en `bloques`. La página `inicio` no puede cambiar de slug.

**`clientes`**: logos. `nombre`, `logo_id`, `alto_logo` (px), `estilo` (`logo`, `nombre` o `firma`, la cursiva para artistas), `enlace`, `con_juno` (va en «Trabajo en sinergia con JUNO Media») y `orden`. No se traduce.

**`opiniones`**: `texto`, `autor` («Novios»), `contexto` («Vídeo de boda»), `proyecto_id` opcional y `orden`.

**`canales`**: canales de YouTube. `nombre`, `texto`, `url`, `cifra` (suscriptores, si Josep quiere mostrarla) y `orden`.

### Estructura

| Tabla | Para qué |
| --- | --- |
| `bloques` | Secciones publicadas de cada página: `pagina_id`, `orden`, `tipo`, `visible`, `datos` |
| `proyecto_servicios` | Servicios de cada proyecto, con orden y destacado por servicio |
| `tipos_proyecto` | Cortometraje, Videoclip, Publicidad, Documental, Eventos, Redes sociales y Recreación (cargados) |
| `categorias_articulo` | Oficio, Dirección de fotografía, Equipo y Detrás de cámaras (cargadas) |
| `idiomas` | `es` (predeterminado) |
| `medios` | Biblioteca: `ruta` en el bucket o `url_origen` mientras se migra, `tipo`, `mime`, `bytes`, `ancho`, `alto`, `duracion`, `titulo`, `texto_alternativo` |
| `redirecciones` | `desde` → `hacia`, automáticas al cambiar un slug publicado |
| `ajustes` | Clave y valor (ya existía). Cambia al instante, sin borrador |

### Privadas (solo Josep)

| Tabla | Para qué |
| --- | --- |
| `administradores` | Quién puede editar: el `user_id` de Josep en Supabase Auth |
| `borradores` | Cambios sin publicar: `tabla`, `fila_id`, `datos` |
| `revisiones` | Versiones anteriores a cada publicación |
| `mensajes` | Formulario de contacto: `nombre`, `correo`, `telefono`, `servicio`, `mensaje`, `origen`, `acepta_privacidad` (siempre sí), `estado` (`nuevo`, `respondido`, `cerrado`) y `notas` de Josep. El público solo puede insertar, con estado `nuevo` y sin notas. Tope de 30 por hora en toda la web (el límite por persona llega con S10) |

## Tipos de bloque

Los once primeros son los del prototipo D (`TipoBloque` en `src/app/prototipos/d/datos.ts`). `galeria`, `video` y `cita` son para páginas libres.

Todos aceptan en `datos` los campos comunes del prototipo: `antetitulo`, `titulo`, `texto` (Markdown básico: párrafos separados por línea en blanco, `**negrita**`, `*cursiva*`) e `imagen` (id de `medios`). En los títulos, la palabra de acento (la que sale en la letra artística) es la última, salvo que se marque con `*asteriscos*`. Formato definitivo, fijado en la tarea C (los componentes están en `src/components/bloques/`):

| `tipo` | Qué es | Extras en `datos` | Datos que lee de otras tablas |
| --- | --- | --- | --- |
| `portada` | Vídeo a pantalla completa y frase principal | `papeles`: `["director de fotografía", ...]` (rotan tras «Soy»); `video`: `{"youtubeId", "inicio", "poster": "<medio>", "medio": "<medio mp4 o null>", "recorte"}`. Si hay `medio`, se usa el mp4 y YouTube queda de reserva | `ajustes.disponible` |
| `servicios` | Lo que ofrezco | | `servicios` (y sus proyectos para las fotos) |
| `filmmaker` | Lo que grabo: una tarjeta por especialidad | `piezas`: `[{"nombre", "texto", "proyecto": "<id>", "href"?, "imagen"?}]` (`imagen`, la foto de la tarjeta; sin ella, la portada de `proyecto`; `href`, la página de la especialidad; sin `href`, lleva a la ficha); `enlace`: `{"texto", "href"}` | `proyectos` |
| `trabajos` | Carrusel de proyectos con filtro por servicio, o rejilla de unos tipos | `proyectos`?: `[id, ...]` (a mano y en orden; manda sobre `origen` y `tipos`), `tipos`?: `[slug de tipo, ...]`: con tipos, rejilla con todos sus proyectos publicados (si solo hay uno, también sus «Más vídeos») | `proyectos` con `destacado_orden` (Todos) y `proyecto_servicios` (filtros) |
| `cifras` | Números, premios y canales | `cifras`: `[{"valor", "decimales"?, "prefijo"?, "sufijo"?, "unidad", "texto"}]` | `proyectos.premios` de tipo `ganado` y `podio`, `canales` |
| `proceso` | Los pasos de un encargo | `pasos`: `[{"titulo", "texto"}]` | |
| `sobre-mi` | Retrato y presentación | `imagen`, `etiqueta`, `cita`, `papeles`: `[...]`, `enlace`: `{"texto", "href"}` | |
| `opiniones` | Frases de clientes | | `opiniones` |
| `clientes` | Logos y apartado JUNO Media | `juno`: `{"texto", "enlace": {"texto", "href"}}` (el enlace «Así trabajamos» solo sale con `href`) | `clientes` (`con_juno` separa los dos grupos) |
| `blog` | Últimos artículos | `cantidad`, `enlace`: `{"texto", "href"}` | `articulos` |
| `texto` | Sección libre (con `estilo: "cabecera"`, cabecera de cine con la imagen grande; si no, tarjeta) | (solo los comunes) | |
| `llamada` | Invitación a escribir (WhatsApp y correo) | `opciones`: `[...]` (chips, detrás de los nombres de los servicios), `nota` | `ajustes.correo`, `ajustes.whatsapp`, `servicios` |
| `galeria` | Rejilla de imágenes | `imagenes`: `[{"medio", "pie"}]` | |
| `video` | Un vídeo, o varios en tarjetas | `youtubeId` o `medio`; o `videos`: `[{"tipo", "id"?, "url"?, "medio"?, "titulo"?}]` como `proyectos.videos` (si hay, mandan) | |
| `cita` | Frase destacada | `autor` (la frase va en `titulo`) | |
| `colaboracion` | Colaboración con una productora (página /juno-media) | `parte`: `apertura` (`texto`, `imagenes`: `[{"medio", "pie"}]`), `relacion` (`facetas`: `[{"titulo", "texto", "imagen"}]`), `valor` (`texto`, `imagen`, `opciones`: `[{"titulo", "texto"}]`) o `productora` (`lema`, `texto`, `enlace`, `rotulo`; las marcas son los clientes «con JUNO Media») | Las fotos que faltan salen de los proyectos con JUNO Media |

**Especialidades de un servicio.** Una página de bloques con slug `<servicio>-<especialidad>` (`filmmaker-videoclips`) se ve en `/servicios/<servicio>/<especialidad>` (`rutaPagina()` en `src/lib/rutas.ts`). Las de filmmaker las crea `supabase/datos/09-especialidades-filmmaker.sql`: texto, proceso, trabajos con `tipos` y la llamada. `10-especialidades-fotos.sql` pone el texto en `estilo: "cabecera"` (cabecera de cine) y fotos de galería en cabeceras y tarjetas. Con un solo proyecto, el bloque trabajos lo enseña en grande con un mosaico de su galería y sus vídeos.

**Páginas con plantilla propia.** `trabajos` y `recreaciones` no se pintan con `PaginaBloques`: su primer bloque (`texto`) da la cabecera. El de `trabajos` lleva `filtros` (`supabase/datos/08-filtros-trabajos.sql`): `{"todos" | "<slug de servicio>": [{"nombre", "tipos": [slug de tipo, ...]}]}`, la segunda fila de filtros de cada servicio; las categorías sin proyectos no salen. El de `recreaciones` (`supabase/datos/07-recreaciones.sql`) lleva además `etiquetaAntes`/`etiquetaDespues` (rótulos del deslizador), `llamada` (título de la invitación final), `orden` (`[slug, ...]`) y `comparaciones`: `{"<slug>": {"original": {"medio", "recorte"?}, "recreacion": {"medio", "recorte"?}, "tamano"?: [ancho, alto]}}`. `recorte` es `[x, y, ancho, alto]` en píxeles de una imagen de `tamano`; sirve para sacar los dos lados de una comparación ya montada. Sin comparación, la recreación enseña el póster y el vídeo.

## Cómo se usa desde la app (contrato para C y D)

| Acción | Cómo |
| --- | --- |
| Leer para la web pública | `select` normal con la clave pública: la RLS ya filtra lo publicado |
| Autoguardar | `upsert` en `borradores` (`tabla`, `fila_id`, `datos` con solo los campos editados; las listas, completas) |
| Ver la vista previa | Fila publicada + `borradores.datos` encima |
| Publicar | `rpc('publicar', { p_tabla, p_id })`, y después `revalidateTag` |
| Descartar | `rpc('descartar', { p_tabla, p_id })` |
| Restaurar una versión | `rpc('restaurar_revision', { p_revision })`, y después Publicar |
| Crear | `insert` con `estado = 'borrador'` y `slug`; el contenido va al borrador |
| Ocultar o volver a mostrar | `update estado` (al instante) |
| Reordenar una lista | `update orden` (al instante). Las secciones de una página se reordenan en su borrador |

Campos que viajan en el borrador: todos los de la fila menos `id`, `grupo`, `idioma`, `estado`, `orden`, `publicado_en`, `creado_en` y `actualizado_en`. Además, `servicios` en los proyectos y `bloques` en las páginas (`[{"id", "tipo", "visible", "datos"}]`, en orden; los bloques nuevos llevan un uuid generado en el navegador).

## Seguridad: quién puede qué

| | Público | Con sesión, sin ser admin | Josep (admin) |
| --- | --- | --- | --- |
| Contenido con estado | Lee lo publicado | Lee lo publicado | Todo |
| `bloques`, `proyecto_servicios` | Lee los de lo publicado | Igual | Todo |
| Catálogos (`idiomas`, `medios`, `tipos_proyecto`, `categorias_articulo`, `redirecciones`), `ajustes` | Lee | Lee | Todo |
| `mensajes` | Solo envía uno nuevo | Igual | Todo |
| `borradores`, `revisiones` | Sin permiso | Nada | Todo |
| `publicar`, `descartar`, `restaurar_revision` | Sin permiso | Error «solo el administrador» | Sí |
| Bucket `medios` | Ve los archivos por su URL; no puede listar | Igual | Sube, cambia, borra y lista. Máximo 50 MB por archivo; solo imágenes, mp4/webm y pdf |

## Pruebas

`supabase/tests/seguridad_y_publicacion.sql` comprueba la RLS y los permisos como público, como usuario sin permisos y como administrador, la integridad (imágenes en uso, slugs, premios) y el flujo completo (autoguardar, publicar, historial, restaurar, descartar, bloques de página, redirecciones). Todo dentro de una transacción que se deshace: no deja rastro. Si algo falla, se para con un error que empieza por «FALLO».

- **En local** (PostgreSQL 16): `entorno_local.sql`, después las migraciones en orden y por último las pruebas.
- **En el proyecto real**: con `execute_sql` del MCP de Supabase.

Antes de dar por buena la suite, se comprobó que detecta fallos: abriendo `borradores` al público o haciendo visible un borrador, salta con «FALLO».

## Alta del administrador (una vez)

Hecho el 2026-10-22: Josep tiene su usuario, está en `administradores` (comprobado con `es_admin()`) y el registro público está cerrado.

1. Josep crea su usuario en Supabase: Authentication > Users > **Add user**, con su correo y una contraseña que elige él. La contraseña no se escribe nunca en el repositorio ni en el chat.
2. Claude añade su `user_id` a `administradores`.
3. Josep cierra el registro: Authentication > Sign In / Providers > desactivar **Allow new users to sign up**. Mientras tanto no hay riesgo: alguien que se registrara no sería administrador y solo vería lo publicado.

## Historial de migraciones

| Versión | Qué hace |
| --- | --- |
| `20261020151832_create_ajustes` | Tabla `ajustes` (fase 1). Reconstruida en el repo a partir de la base |
| `20261022144748_esquema_inicial` | Primera versión (Haiku). Sustituida |
| `20261022152009_esquema_solido_0_archivar` | Mueve las tablas vacías de la primera versión al esquema `archivo_v1`, sin acceso desde la API. Se archiva en vez de borrar porque los borrados piden una confirmación que no llega a este hilo |
| `20261022152153_esquema_solido_1_tablas` | Tipos, tablas e índices. RLS activada desde el principio |
| `20261022153000_esquema_solido_2_funciones` | Borradores, publicación, historial, validaciones, redirecciones. La ejecutó Josep en el editor SQL (contiene `delete` dentro de funciones, que pide confirmación), así que no figura en el historial de Supabase; se comprobó que las 17 funciones coinciden con este archivo. La versión es aproximada |
| `20261022153230_esquema_solido_3_seguridad` | Políticas RLS, permisos y almacenamiento |
| `20261022230000_proyectos_frase` | Columna `proyectos.frase` (frase final de la ficha). Tarea S4 |
| `20261023133000_proyectos_con_juno` | Columna `proyectos.con_juno` (hecho bajo el sello de JUNO Media; sello en tarjeta y ficha). Marcados los 4 con JUNO en la productora |
| `20261024190000_servicios_titulo_mirada` | Columna `servicios.titulo_mirada` (título de «Mi mirada», antes fijo en el código), con los 3 títulos de siempre. **La ejecuta Josep en el editor SQL** (el hilo no tiene permiso); hasta entonces el panel no enseña ese campo y la web usa los títulos de siempre |

### Pendiente de limpieza (opcional, lo hace Josep desde el panel)

- Borrar el esquema `archivo_v1` cuando ya no haga falta (`drop schema archivo_v1 cascade`). Sus avisos de rendimiento («multiple permissive policies») desaparecen con él; no afectan a la web porque nadie puede acceder a ese esquema.
- Las dos políticas del bucket conservan su nombre antiguo: «Medios: escritura solo administrador» es la que vale (solo el administrador escribe) y «Medios: lectura pública» está anulada (`using (false)`). Se pueden renombrar o borrar en Storage > Policies.
- Los avisos «unused index» son normales con la base vacía: los índices cubren claves ajenas y listados.

### Estado comprobado el 2026-10-22

- Advisors de seguridad: 0 avisos.
- `supabase/tests/seguridad_y_publicacion.sql` ejecutado contra la base real con `execute_sql`: «Todas las pruebas pasan», y la transacción se deshizo (0 usuarios, 0 proyectos, 0 mensajes, 0 objetos después).
