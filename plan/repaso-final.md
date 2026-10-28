# Repaso final: dejar la web «niquelada»

Documento de traspaso para los hilos que siguen. Escrito el 2026-10-22 a partir del encargo de Josep:

> «Repasar cada rincón de la web para que la pueda publicar. Aún sin publicarla. Revisa el plan que estaba hecho y sigamos también ese plan. No te saltes instrucciones que ya estaban dadas en un principio.»

«Niquelado» significa: nada en pendiente, nada sin imagen, cada sección revisada y lista para la fase 7. **No se publica nada** hasta que Josep lo diga (fase 7), y PR #1 no se fusiona.

Antes de empezar cualquier hilo, lee en este orden: `CLAUDE.md`, `plan/README.md`, `plan/00-contexto.md`, `plan/hoja-de-ruta.md` y este documento. El plan manda; este documento solo dice dónde estamos y qué falta.

## 1. Qué está hecho

| Bloque | Estado | Dónde |
| --- | --- | --- |
| Fases 1, 2 y 3 | Hechas. Diseño elegido: D · Cristal | `plan/fase-3-direccion-visual.md`, `src/app/prototipos/d/` |
| A · Remates visuales y tokens | Hecha | `src/styles/tokens.css`, `src/styles/movimiento.ts` |
| B · Base de datos, RLS, bucket, usuario de Josep | Hecha | `supabase/migrations/`, `plan/esquema.md`, `src/lib/supabase/tipos.ts` |
| E · Textos de los 18 proyectos | Reescritos y revisados con Josep en el prototipo (estructura fija, frase final con acento) | `plan/contenido/proyectos/*.md` → `textos.ts` con `node scripts/textos-prototipo.mjs` |
| Servicio Filmmaker | Texto mixto (productoras, compañeros y particulares) revisado con Josep | `plan/contenido/servicio-filmmaker.md` y `datos.ts` |
| Blog del prototipo | 2 artículos, con imagen en la tarjeta. El del DSLR se quitó (Josep lo descartó) | `datos.ts` (`ARTICULOS`) |

Lo que **no existe todavía**: la web de verdad. Todo lo que se ve está en `/prototipos/d`, con datos escritos en `datos.ts`. Las tareas C, D y S1–S20 de la hoja de ruta están sin empezar.

## 2. Orden recomendado para los hilos siguientes

Es el de `plan/hoja-de-ruta.md`, sin saltarse nada:

1. **C · Esqueleto público e Inicio desde la base de datos** (Opus). Pasa el prototipo D a `src/components/` y `src/app/(web)/`, crea `src/lib/datos/` y escribe `plan/patron-paginas.md`. Sin C no puede empezar ninguna tarea de páginas.
2. **S1 + S3 + S4** (Sonnet, pueden ir en paralelo con C porque solo dependen de B): migrar proyectos y artículos a Supabase y cargar los textos de `plan/contenido/`. **Ojo:** los textos buenos de los proyectos son los de `plan/contenido/proyectos/*.md` (estructura Tarjeta / El proyecto / Decisiones clave / El reto / Resultado), no los de `legacy/`. La ficha técnica (año, cámara, papel, productora, frase) está en `src/app/prototipos/d/datos.ts`. Hay 2 artículos, no 3.
3. **S2** (imágenes al bucket `medios`): necesita el PC de Josep, porque el contenedor no llega a ImgBB/Imgur ni a Supabase.
4. **S5–S10** (páginas), cada una con `plan/patron-paginas.md`.
5. **D · Sistema de edición** (Opus) y luego **S14–S17** (panel).
6. **S11–S13** (legales, GA4, SEO, redirecciones), **S18** (copias) y **S19** (guía).
7. **S20** (repaso de móvil, accesibilidad y Lighthouse) y el **repaso «niquelado» de la sección 3** de este documento, página a página.
8. **F · Lanzamiento**, solo con la orden de Josep.

Regla de cada hilo: comprobaciones (`npm run lint`, `npx tsc --noEmit`, `npm run build`), commit y push a `claude/project-thread-9vb26d`, y **al final actualizar la versión local de Josep** (ver `plan/README.md` y la memoria del proyecto: sesión de control remoto en su PC, `git pull`, `npm run build`, `npm run start`). Josep lo pidió expresamente: «acaba siempre con el script».

## 3. Repaso por sección: qué falta para que esté niquelada

Marca cada casilla cuando esté hecha en la web de verdad (no en el prototipo).

### Inicio
- [ ] Vídeo de portada como mp4 propio (Josep lo tiene que pasar). Mientras, YouTube sin controles visibles.
- [x] Todos los bloques salen de la tabla `bloques` (nada fijo en el código). Tarea C, 2026-10-23.
- [ ] Logos de clientes: Cero Coma, Dreamore, Kymera, Ayuntamiento de l'Alfàs del Pi; bloque «En sinergia con JUNO Media» (ForecourtTech, Arkano, SOM Events, Albir Confort, Mapache Events). Nunca decir que Josep forma parte de JUNO. Falta el permiso o los archivos de los logos (también Kinepolis, si se usa).
- [ ] Canales de YouTube: «Josep Mira» (destacado) y «Del Fan Para el Fan». Falta el enlace del segundo y si se muestran cifras.

### Servicios (3 páginas)
- [ ] Dirección de fotografía, Filmmaker y Edición con sus textos de `plan/contenido/servicio-*.md`. Sin precios, sin sección de equipo.
- [ ] Filmmaker: confirmar con Josep la frase «como filmmaker o como operador de cámara» de la pregunta frecuente «¿Te sumas a proyectos de otros?».

### Trabajos y fichas (14 proyectos + 4 recreaciones)
- [x] Texto nuevo de cada ficha en la base (S4, 2026-10-22).
- [ ] Frase final con acento (`*marcas*`) de las 4 recreaciones: no existe todavía. Proponerla a Josep (corta, sin fórmulas «no es X: es Y») y guardarla en `proyectos.frase`.
- [ ] Año de casi todos los proyectos: hoy solo tienen año «Y el año que viene» (2024) y Kiboko (2026). Ver la tabla de `/mnt/project-files/textos-proyectos/pendientes.md`. Mientras falte, la ficha dice «Pendiente»: **antes de publicar, ocultar el campo si está vacío** en vez de mostrar «Pendiente».
- [ ] Cámara de Sin Piedad (se cree Blackmagic Pocket 4K, sin confirmar).
- [ ] Kiboko: nombre de los festivales y de la nominación a mejor montaje. Hoy el laurel dice «Festival pendiente»: no se publica así.
- [ ] El Cirujano: falta el tercer fotograma (la URL antigua ya no existe) y los que hay son de baja resolución. Pedir fotogramas en alta a Josep.
- [ ] Bodas: renombrar los archivos de imagen (llevan el nombre de los novios) y confirmar qué se muestra (solo fotogramas).
- [ ] Reels: permiso para nombrar a Disney y al Consell Valencià de la Joventut; cifra de visualizaciones o «cientos de miles».
- [ ] Cada ficha con 4 a 8 fotogramas buenos. Las que tengan menos, se piden a Josep o se sacan de sus vídeos publicados en YouTube (son suyos). *2026-10-22: en el prototipo ya tienen 4 a 7 todas menos Y el año que viene (3), El Cirujano (2) y Reels (1, y no es suya). Ver `plan/traspaso-imagenes.md`.*

### Recreaciones
- [ ] Deslizador antes y después en las 4. Falta la imagen del plano original de cada película. Estas sí se pueden buscar en internet (ver sección 4), anotando la fuente.
- [ ] Star Wars sin CGI: confirmar si el plano es de la Ciudad de las Nubes o de Hoth.
- [ ] El Padrino: confirmar si se mantiene la mención al daltonismo.

### Blog
- [x] Imagen en cada tarjeta (prototipo, 2026-10-22): IA → fotograma de la recreación de Star Wars sin CGI; luz → fotograma de El Cirujano. Son imágenes propias de Josep.
- [x] Imagen de cabecera dentro de cada artículo y, si hace falta, imágenes en el cuerpo (con texto alternativo). *2026-10-22: en `plan/contenido/articulos/*.md`, todas propias. Falta pintarlas en S9.*
- [ ] Artículo de la luz: Josep dijo que es corto. Ampliarlo con ejemplos reales (El Cirujano, EP Oscuridad, El Padrino) usando los textos ya aprobados de esas fichas, y pasárselo a Josep.
- [ ] Artículo de la IA: preguntar si quiere los emojis de vuelta (se quitaron).

### Sobre mí
- [ ] Retrato de Josep y 2 o 3 fotos de rodaje. Hoy usa una captura provisional. **Esto no se busca en internet**: solo fotos suyas.
- [ ] Texto de `plan/contenido/sobre-mi.md`. «Más de nueve años», sin presumir de número de proyectos ni de «percusionista desde los 3 años».

### Contacto y Gracias
- [x] Formulario guiado que guarda en `mensajes` y avisa por correo con Formspree (S10).
- [x] Textos de `plan/contenido/contacto-gracias-y-llamadas.md`.

### Legal, SEO y medición
- [x] Aviso legal (`/aviso-legal`), Privacidad (`/privacidad`) y Cookies (`/cookies`); aviso de cookies AEPD; GA4 `G-RKBDRMVL1J` solo tras aceptar (S11). Datos identificativos en `src/lib/datos/legales.ts`.
- [x] Metadatos, Schema.org (`src/components/seo/JsonLd.tsx`), `sitemap.xml`, `robots.txt` e imagen Open Graph (`/opengraph-image`) (S12).
- [x] Redirecciones de las URLs antiguas con hash (`RedireccionAntigua.tsx`), sin hash (`next.config.ts`) y por `id_antiguo` (S13).

### Toda la web
- [x] Móvil, teclado (enlace «Saltar al contenido», cierre con `Escape`, aparición del menú al recibir foco), contraste en claro y oscuro, «reducir movimiento» (`useReducir()` devuelve `false` en el PC de Josep) y compilación limpia (S20).
- [x] Ninguna imagen servida desde ImgBB, Imgur, Postimg ni iili (S2, 95 imágenes migradas al bucket `medios`).
- [x] Ningún «Pendiente», «[pendiente]» ni texto de relleno visible en las fichas de proyecto (`FichaProyecto.tsx` oculta los campos vacíos).

## 4. Imágenes: de dónde salen

Josep dio permiso (2026-10-22) para usar alguna imagen de internet. Orden de preferencia:

1. **Imágenes propias de Josep**: fotogramas de sus proyectos y de sus vídeos de YouTube. Es lo primero y lo mejor.
2. **Fotogramas de las películas originales** solo para el «antes» de las recreaciones (uso de cita y comparación, con el título de la película como pie).
3. **Bancos libres** (Unsplash, Pexels; licencia que permite uso comercial sin atribución obligatoria) solo para ilustrar artículos cuando no haya nada propio. Nunca para fichas de proyecto ni para Sobre mí.

Cada imagen de internet se apunta aquí con fuente y licencia:

| Imagen | Dónde se usa | Fuente | Licencia |
| --- | --- | --- | --- |
| (ninguna todavía: todo lo usado hasta ahora es de Josep) | | | |

## 5. Preguntas abiertas para Josep

Recogidas en `/mnt/project-files/textos-proyectos/pendientes.md` y en la sección «Para revisar con Josep» de cada archivo de `plan/contenido/proyectos/`. Las que bloquean la publicación:

1. Año de cada proyecto (y cámara de Sin Piedad).
2. Festivales de Kiboko.
3. Vídeo de portada en mp4.
4. Retrato y fotos para Sobre mí.
5. Logos de clientes (archivos o permiso para bajarlos de sus webs).
6. Permisos de Reels (Disney, Consell) y qué se enseña de Bodas.
7. Fotogramas en alta de El Cirujano.
8. Enlace del canal «Del Fan Para el Fan».
9. Dominio y alojamiento (fase 7).

Su último mensaje se cortó en «continuemos con el plan, pero sigamos…»: preguntarle si quería añadir algo.

## Registro

- 2026-10-22 (hilo de imágenes): galerías completas en las fichas del prototipo, imágenes propias en los artículos y plan para lo que necesita el PC de Josep en `plan/traspaso-imagenes.md`.

- 2026-10-22: documento creado. Blog del prototipo con imagen en las tarjetas y sin el artículo del DSLR.
