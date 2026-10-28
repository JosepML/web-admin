# Textos de proyectos y artículos (tarea E)

Estado: **borrador para revisión de Josep**. Cámaras, clientes citables y plataformas ya cargados (2026-10-22). Respuestas de Josep del 2026-10-22 ya aplicadas (podio, 17.000 visualizaciones, spot no comercializado, título de Nosferatu). Josep revisa en tandas de 4 o 5 proyectos. Hasta su visto bueno, los archivos no se cargan en la base de datos.

## Criterio de los textos (revisión de Opus, 2026-10-22)

Cada ficha tiene que servirle a un cliente: qué era, qué hice yo, qué decisiones concretas tomé (luz, cámara, montaje) y por qué, el reto con su solución y el resultado con hechos. Frases cortas y listas.

- **Tarjeta:** descripción cortita (una o dos frases) que abre la ficha.
- **El proyecto:** qué es y qué hice yo, con los créditos del equipo, en pocas líneas.
- **Decisiones clave:** máximo cuatro; cada una es una decisión y su efecto.
- **Conclusión:** la cierra la frase con doble tipografía de `datos.ts` (`frase`), no el .md.
- **El resultado:** solo hechos (premios, cifras, estrenos). Si no hay ninguno, la sección se deja vacía y no se muestra.
- Lo que falta para que una ficha informe de verdad está en sus preguntas de «Para revisar».

El prototipo lee estos archivos a través de `src/app/prototipos/d/textos.ts`, que se regenera con `node scripts/textos-prototipo.mjs` (no se edita a mano).

## Concordancia con la ficha técnica (2026-10-22)

El cuadro de arriba (año, tipo, dirección, productora, mi papel, cámara) y el laurel ya dan los créditos: el texto **no los repite**. La tarjeta es la premisa; *El proyecto*, el encargo y mi aportación; las decisiones no repiten la frase final; y la frase final (`frase` en `datos.ts`) es la conclusión, no un resumen de créditos.

Frase final: corta, con gancho y con sentido al leerla sola; nada de fórmulas tipo «no es X: es Y». La cursiva de la doble tipografía se marca con `*asteriscos*` y abarca la idea entera (`*blanco y negro*`, no solo «negro»).

## Cómo se ve en la ficha (2026-10-22)

Descripción corta arriba; después filas tipo dosier con la etiqueta a la izquierda: *El proyecto*, *Decisiones clave* (tarjetas numeradas: cada punto se escribe `**Título.** Frase.`), *El reto* (frase destacada) y *Resultado* (hechos con laurel). Cierra la `frase` de `datos.ts` con la doble tipografía.

## Cómo está hecho cada archivo

- **Cabecera (frontmatter):** campos de la ficha técnica que van a `proyectos`. Todo lo que dice `[pendiente]` es un dato que falta; no se publica hasta que Josep lo complete.
- **Secciones:** `Tarjeta` (texto corto para la tarjeta), `La historia`, `Mi papel`, `Cómo lo hicimos`, `El reto`, `El resultado`. Son los campos `historia`, `mi_papel`, `como_lo_hicimos`, `el_reto` y `el_resultado`. Las secciones vacías no se muestran.
- **Para revisar con Josep (no se publica):** preguntas y datos a confirmar. No entran en la base de datos.

Los artículos del blog están en `../articulos/`, con el mismo formato.

## Proyectos (18)

| # | Slug | Tipo | Servicios | Destacado | Pendiente principal |
| --- | --- | --- | --- | --- | --- |
| 1 | y-el-ano-que-viene-que | Cortometraje | Filmmaker, DF, Edición | Sí (1) | Cámara |
| 2 | 100-baladas-arkano | Videoclip | Filmmaker, DF, Edición | Sí (2) | Año; cámara |
| 3 | el-viajero | Cortometraje | Filmmaker, DF, Edición | No | Año; cámara |
| 4 | kiboko | Documental | Edición | Sí (6) | Festivales; Arca Films |
| 5 | no-se-esta-tan-mal-lovva | Videoclip | DF, Edición | Sí (4) | Productora; año |
| 6 | el-cirujano | Cortometraje | DF | Sí (3) | Año del premio |
| 7 | sin-piedad | Cortometraje | DF | No | Sin vídeo público |
| 8 | expandete-spot-juno-media | Publicidad | Filmmaker, Edición | No | Año; director de fotografía (Juan Fran) |
| 9 | ep-oscuridad-adrian-munoz | Videoclip | DF | Sí (5) | Año; cámara |
| 10 | sin-tiempo-peiko | Videoclip | Filmmaker, DF, Edición | No | Año; cámara |
| 11 | conciertos | Eventos | Filmmaker, Edición | No | Años y clientes |
| 12 | bodas | Eventos | Filmmaker, Edición | No | Sin vídeo público; privacidad |
| 13 | eventos-deportivos | Eventos | Filmmaker, Edición | No | Competición y año |
| 14 | reels-redes-sociales | Redes sociales | Filmmaker, Edición | No | Permisos de Disney y Consell |
| 15 | recreacion-nosferatu | Recreación | DF, Edición | No | Año |
| 16 | recreacion-star-wars-luke-vader | Recreación | DF, Edición | No | Año (2025 por el aniversario) |
| 17 | recreacion-el-padrino | Recreación | DF, Edición | No | Mención al daltonismo (se mantiene salvo que Josep la quite) |
| 18 | recreacion-star-wars-sin-cgi | Recreación | DF, Edición | No | Lugar del plano |

Orden propuesto en Trabajos ("Todos"), tomado del mapa: 1, 2, 6, 5, 9, 4, 8, 10, 3, 7, 13, 11, 14, 12. Las recreaciones solo aparecen con su filtro.

## Artículos (2)

Josep decidió (2026-10-22) retirar el artículo "DSLR vs. Cine". Sigue en `legacy/constants.ts` por si se quiere recuperar. La categoría "Equipo" del blog queda sin uso.


- `ia-artesano-audiovisual` (Oficio, 2025-05-13)
- `el-arte-de-contar-historias-con-luz` (Dirección de fotografía, 2024-07-15)

## Reglas aplicadas

- Sin precios ni tarifas en ningún texto.
- Sin sección de equipo; la cámara va en la ficha técnica, y queda `[pendiente]` en todos.
- No se destaca el número de proyectos ni "percusionista desde los 3 años".
- Ningún premio, cifra o nombre inventado: lo que no está confirmado aparece en "Para revisar".
- JUNO Media aparece como productora de los proyectos que produjo. No se describe a Josep como parte de JUNO.
