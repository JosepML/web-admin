# Mapa de contenido

Dónde va cada contenido de la web antigua (`legacy/constants.ts`) en la web nueva. La fase 4 usa esta tabla para cargar la base de datos.

> **Ojo con el número de proyectos:** el plan hablaba de 21 proyectos, pero en `legacy/constants.ts` hay **18** (14 trabajos + 4 recreaciones). El 21 salía de sumar también los 3 artículos del blog. No falta nada.

## Clasificación nueva

**Servicios** (un proyecto puede tener varios):

| Servicio | slug | Qué cubre | Categorías antiguas que lo alimentan |
| --- | --- | --- | --- |
| Dirección de fotografía | `direccion-de-fotografia` | Luz, cámara, look de cortos, videoclips y spots | "Dirección de Fotografía" |
| Filmmaker | `filmmaker` | Idear, dirigir y grabar la pieza completa: spots, videoclips, eventos, bodas, redes | "Dirección", "Eventos y Publicidad" |
| Edición | `edicion` | Montaje, ritmo, color y sonido | "Postproducción" |

**Tipos** (uno por proyecto, para filtrar en Trabajos):

| Tipo | slug |
| --- | --- |
| Cortometraje | `cortometraje` |
| Videoclip | `videoclip` |
| Publicidad | `publicidad` |
| Documental | `documental` |
| Eventos | `eventos` (conciertos, bodas, deporte) |
| Redes sociales | `redes-sociales` |
| Recreación | `recreacion` |

Las recreaciones salen en su página propia y también en Trabajos con el filtro "Recreación" (en la web antigua estaban ocultas del listado general; se mantiene: no aparecen en "Todos", solo con su filtro).

## Proyectos

Se conservan todos los textos (contexto, rol, proceso, retos, resultados, títulos de sección propios), vídeos e imágenes tal cual. El `slug` nuevo es el `id` antiguo salvo donde se propone cambiarlo; el id antiguo se guarda en `id_antiguo` para redirigir los enlaces viejos (`/#/project/<id>`) en la fase 7.

| # | id antiguo | Título | Tipo | Servicios | slug nuevo | Destacado en Inicio | Notas |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `y-el-ano-que-viene-que` | Y el año que viene, ¿qué? | Cortometraje | Filmmaker, Dirección de fotografía, Edición | igual | **Sí (1)** | Podio del ESCAC Dreammakers Contest 2024 de Cupra, con J. A. Bayona en el jurado. Es también el vídeo de fondo actual de la portada |
| 2 | `100-baladas-arkano` | 100 Baladas, Arkano | Videoclip | Filmmaker, Dirección de fotografía, Edición | igual | **Sí (2)** | Artista conocido, producción JUNO Media |
| 3 | `el-viajero` | El Viajero | Cortometraje | Filmmaker, Dirección de fotografía, Edición | igual | No | Corto de fin de ciclo; bueno para "Sobre mí" |
| 4 | `kiboko` | Kiboko, Documental Cinematográfico | Documental | Edición | igual | **Sí (6)** | Mejor ejemplo del servicio de Edición. `results` vacío |
| 5 | `no-se-esta-tan-mal-lovva` | No se está tan mal, Lovva | Videoclip | Dirección de fotografía, Edición | igual | **Sí (4)** | |
| 6 | `el-cirujano` | El Cirujano | Cortometraje | Dirección de fotografía | igual | **Sí (3)** | El trabajo de luz más reconocible (rojo) |
| 7 | `sin-piedad` | Sin Piedad | Cortometraje | Dirección de fotografía | igual | No | **No tiene vídeo**; solo imágenes. En distribución a festivales |
| 8 | `spot-juno-media` | EXPÁNDE(TE), spot para Juno Media | Publicidad | Filmmaker, Edición | `expandete-spot-juno-media` | No | El spot no llegó a publicarse; sigue en Trabajos como muestra. `results` vacío a propósito |
| 9 | `ep-oscuridad-adrian-munoz` | EP Oscuridad, Adrián Muñoz | Videoclip | Dirección de fotografía | igual | **Sí (5)** | 7 visualizers + tráiler. 1.392.400 visualizaciones en total |
| 10 | `sin-tiempo-peiko` | Sin Tiempo, Peiko | Videoclip | Filmmaker, Dirección de fotografía, Edición | igual | No | Proyecto de estudios. `results` vacío |
| 11 | `cobertura-conciertos` | Conciertos | Eventos | Filmmaker, Edición | `conciertos` | No | 3 vídeos (Miami Show, Flama, Legends) + vídeo de proceso |
| 12 | `bodas-cinematograficas` | Bodas | Eventos | Filmmaker, Edición | `bodas` | No | **Sin vídeo**: en la web antigua salía como "próximamente" oculto |
| 13 | `eventos-deportivos` | Eventos deportivos | Eventos | Filmmaker, Edición | igual | No | Shimano Super Cup Massi (La Nucía) |
| 14 | `reels-rrss` | Reels para RRSS | Redes sociales | Filmmaker, Edición | `reels-redes-sociales` | No | Vídeos de Instagram (Consell Valencià de la Joventut y otros) |
| 15 | `nosferatu-recreacion` | Recreación de un plano de 'Nosferatu' con 100 € | Recreación | Dirección de fotografía, Edición | `recreacion-nosferatu` | No | Con Comboi Films |
| 16 | `star-wars-vader-recreacion` | Recreación del mejor plano de 'Star Wars: El Imperio Contraataca' | Recreación | Dirección de fotografía, Edición | `recreacion-star-wars-luke-vader` | No | Maqueta en miniatura |
| 17 | `godfather-recreation` | Recreación de 'El Padrino' | Recreación | Dirección de fotografía, Edición | `recreacion-el-padrino` | No | Rejilla de estufa como ventana |
| 18 | `star-wars-hoth-recreation` | Recreación de 'Star Wars: El Imperio Contraataca' sin CGI | Recreación | Dirección de fotografía, Edición | `recreacion-star-wars-sin-cgi` | No | El id dice "Hoth" pero el texto habla de la Ciudad de las Nubes; por eso el slug nuevo no lo menciona |

**Orden propuesto en Trabajos ("Todos"):** 1, 2, 6, 5, 9, 4, 8, 10, 3, 7, 13, 11, 14, 12. Primero lo más fuerte y variado; Bodas al final mientras no tenga vídeo.

**Destacados por servicio** (bloque "Proyectos relacionados" de cada página de servicio):

- Dirección de fotografía: El Cirujano, No se está tan mal, EP Oscuridad, Y el año que viene, ¿qué?
- Filmmaker: EXPÁNDE(TE), 100 Baladas, Conciertos, Eventos deportivos
- Edición: Kiboko, Conciertos, Reels para RRSS, Y el año que viene, ¿qué?

## Ficha técnica y premios por proyecto

Datos para la ficha técnica (ver `fundamentos.md`). Salen de los textos antiguos y de lo que ha contado Josep el 2026-10-20. Lo marcado `[pendiente]` lo completa Josep desde el panel cuando pueda.

| Proyecto | Dirección | Productora o cliente | Mi papel (tarjeta) | Premios, selecciones y resultados |
| --- | --- | --- | --- | --- |
| Y el año que viene, ¿qué? | Josep Mira Lozano | Proyecto propio (ESCAC Dreammakers, Cupra) | Dirección, fotografía y montaje | Podio del ESCAC Dreammakers Contest 2024, con J. A. Bayona en el jurado `[confirmar si fue 2.º o 3.º]` |
| 100 Baladas, Arkano | Josep Mira Lozano (idea de Álex Gómez) | JUNO Media | Dirección y montaje | Videoclip de Arkano; 17.000 visualizaciones en YouTube `[confirmar cifra]` |
| El Viajero | Josep Mira Lozano | Proyecto de fin de ciclo, IES Veles e Vents | Dirección y fotografía | |
| Kiboko | Noelia Fluxá y Julie-Estel Soard | JUNO Media y Arca Films | Montaje | Estreno con aforo completo en el Teatre Auditori de La Vila Joiosa (6 de junio de 2026). Selecciones en festivales y nominación a mejor montaje `[pendiente: nombres de los festivales; no aparecen en internet]` |
| No se está tan mal, Lovva | Ángela Manzano | `[pendiente]` | Fotografía y montaje | |
| El Cirujano | Kevin Ramos y Emilio Graña | Impulsos Creativos | Dirección de fotografía | **Mejor fotografía**, On Duty International Film Festival `[pendiente: año]` |
| Sin Piedad | Ángela Manzano | Proyecto personal de Ángela Manzano | Dirección de fotografía | En preparación para festivales |
| EXPÁNDE(TE) | Josep Mira Lozano | JUNO Media | Dirección y montaje | No publicado |
| EP Oscuridad, Adrián Muñoz | JUNO Media | JUNO Media | Dirección de fotografía | 1.392.400 visualizaciones en las plataformas donde se publicó |
| Sin Tiempo, Peiko | Josep Mira Lozano | Proyecto de estudios | Dirección y fotografía | |
| Conciertos, Bodas, Eventos deportivos, Reels | | Varios clientes | Grabación y montaje | Opiniones de clientes (ver `inicio.md`) |
| Recreaciones (4) | Josep Mira Lozano | Canal de YouTube | Dirección, fotografía y montaje | |

**Cámara:** se añade por proyecto en la ficha técnica (Josep trabaja con Sony FX3 e iluminación Aputure). `[pendiente: cámara de cada proyecto]`

### Huecos detectados en los proyectos

- `results` vacío en Kiboko, EXPÁNDE(TE), EP Oscuridad, Sin Tiempo, Conciertos y Bodas. Se rellena con la tabla de arriba donde hay datos; en EXPÁNDE(TE) y Sin Tiempo se queda vacío y la sección no se muestra.
- Bodas y Sin Piedad no tienen vídeo.
- **Fotogramas:** hay que sacar de 4 a 8 fotogramas por proyecto en alta calidad (fase 4, a partir de los vídeos o de Josep).
- Las recreaciones necesitan imagen del plano original y de la recreación para el deslizador antes/después. Hay que revisar si las `images` actuales sirven o hay que sacar fotogramas.
- Las miniaturas están en imgur, ibb.co, postimg, YouTube y webs de terceros (platinocrowdfunding, rbgescuela). En la fase 4 se descargan y se suben al almacenamiento propio para que no se rompan.

## Artículos del blog

Se conservan título, extracto y contenido completos. Fechas pasadas a formato ISO.

| id antiguo | Título | Fecha | Categoría nueva | slug |
| --- | --- | --- | --- | --- |
| `ia-artesano-audiovisual` | El Artesano y la Inteligencia Artificial en el Cine | 2025-05-13 | Oficio | igual |
| `el-arte-de-contar-historias-con-luz` | Dirección de Fotografía: El Arte de Contar Historias con Luz | 2024-07-15 | Dirección de fotografía | igual |
| `dslr-vs-cine-la-camara-no-hace-al-cineasta` | DSLR vs. Cine: ¿Qué cámara elegir para videografía profesional? | 2024-06-28 | Equipo | igual |

Categorías del blog: **Oficio**, **Dirección de fotografía**, **Equipo**, **Detrás de cámaras** (vacía por ahora, para contar el proceso de proyectos).

## Resto de contenido antiguo

| Contenido antiguo | Dónde va |
| --- | --- |
| Portada: "Narrativas hechas de luz", texto de presentación | Inicio (la idea se conserva en la frase principal, ver `inicio.md`) |
| Portada: 4 servicios SEO (vídeo corporativo, eventos, DF, edición) | Se reparten en los 3 servicios nuevos; "vídeo corporativo" entra en Filmmaker |
| Portada: "Sobre mí" largo + áreas de especialización | Página Sobre mí (`sobre-mi.md`) y versión corta en Inicio |
| Portada: "La cámara no hace al cineasta, pero la visión sí." | Se conserva como cita en Sobre mí |
| Portada: Marcas (Disney, Star Wars, Consell Valencià de la Joventut, Kinepolis, Ocisport, Mediterra Cinema, JUNO Media) | Franja "Han confiado en mí" en Inicio y Sobre mí |
| Página Recreaciones (introducción) | `recreaciones.md` |
| Página Blog (introducción) | `blog.md` |
| Contacto (texto, redes, formulario Formspree) | `contacto.md`; formulario nuevo guarda en la base de datos |
| Gracias | `contacto.md` (sección Gracias) |
| Política de privacidad (`legacy/pages/PrivacyPolicyPage.tsx`) | Se copia tal cual a la página Privacidad; se añade página de Cookies (Google Analytics) |
| SEO: "Alicante", "Comunidad Valenciana" | Se mantienen en textos de servicios y contacto, y en las descripciones SEO |
| Google Analytics `G-RKBDRMVL1J` | Igual |
