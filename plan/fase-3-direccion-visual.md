# Fase 3: Dirección visual

**Estado:** Hecha (2026-10-22): Josep aprueba D · Cristal
**Depende de:** fase 1. Puede ir en paralelo con las fases 2 y 4.

## Objetivo

Elegir el estilo visual y de animación de la web con prototipos de portada que Josep vea en `localhost`.

## Dirección actual: D · Cristal

La web antigua (Inter muy gruesa, rojo de marca, cristal, esquinas redondas, modo claro/oscuro) llevada a un acabado tipo página de producto de Apple: dinámica, cinematográfica, cálida y personal, con más peso de venta de servicios. Sustituye a A, B y C, que Josep descartó (ver *Registro*).

| Token | Oscuro | Claro |
| --- | --- | --- |
| Fondo | `#09090b` | `#f5f5f7` |
| Texto | `#f5f5f7` | `#1d1d1f` |
| Acento (rojo de la web antigua) | `#e50914` | `#e50914` |
| Acento cálido (degradados) | `#ff8a3d` | `#ff8a3d` |
| Cristal | blanco 6 % + desenfoque 28 px + saturación 170 % + borde blanco 12 % + reflejo arriba | blanco 55 % + borde blanco 90 % |
| Orbes de fondo | rojo 32 %, naranja 22 %, violeta 14 % | a la mitad |

- **Tipos:** Inter (800-900, interletraje muy cerrado) para todo; Instrument Serif cursiva solo para la palabra de acento de cada titular.
- **Formas:** píldoras (`rounded-full`) para botones y chips; tarjetas de 28 a 48 px de radio.
- **Curva de animación:** `cubic-bezier(0.22, 1, 0.36, 1)`, entre 0,5 y 0,9 s.
- Código: `src/app/prototipos/d/` (tokens en `cristal.css`). Se pasarán a `globals.css` cuando Josep dé el visto bueno.

## Animaciones (D · Cristal)

| Dónde | Animación |
| --- | --- |
| Portada | El reel vive en una tarjeta redondeada que se aleja con el scroll (escala y radio); el titular entra palabra a palabra con desenfoque; palabra que rota (director de fotografía / filmmaker / editor) |
| Servicios | Tarjetas que se abren al pasar el ratón: la elegida crece, arranca su clip y enseña lo que aporto, para quién es y "Hablemos de tu proyecto" |
| Trabajos | Galería horizontal fijada (el scroll vertical la mueve de lado) con filtro por servicio; clip al pasar el ratón; en móvil, carrusel con el dedo |
| Cambio de página | La imagen de la tarjeta crece con sus esquinas redondas hasta ser la cabecera de la ficha, con el fondo desenfocado |
| Cifras | Números que cuentan al entrar y premios con laurel |
| Proceso | Título fijo con el número del paso; el paso activo se ilumina con el scroll |
| Sobre mí | Retrato que se inclina con el ratón y se desplaza con el scroll |
| Opiniones y clientes | Marquesinas de tarjetas de cristal (se paran al pasar el ratón) |
| Siempre | Foco de luz que sigue al ratón en las tarjetas; orbes de color que se mueven despacio; menú de cristal que se compacta y se esconde al bajar |

Límites: con "reducir movimiento" todo pasa a fundidos simples (sin vídeo, sin fijados, sin marquesinas); en móvil se simplifica.

## Tareas

- [x] Crear 2 o 3 variantes de portada en rutas de prueba con contenido real
- [x] Variar entre ellas: paleta, tipografía y estilo de animación
- [x] Incluir en cada una: apertura, cabecera con vídeo, tarjetas con clip al pasar el ratón, una transición de página
- [x] Comprobar "reducir movimiento" y móvil
- [x] Josep descarta A, B y C → nueva dirección D · Cristal (portada a partir de bloques editables, modo edición de demostración)
- [x] Borrar los prototipos descartados (A, B y C)
- [ ] Josep da el visto bueno a D (o pide cambios); fijar los tokens definitivos en `globals.css`

## Entregable

Prototipo en `localhost:3000/prototipos/d` y, tras el visto bueno, el sistema de diseño fijado.

## Revisión de Josep

- [x] Da el visto bueno a la dirección visual (2026-10-22)

## Registro

### 2026-10-20 · Prototipos A, B y C (descartados)

Tres portadas con su ficha: **A · Sala** (negro cálido y tungsteno, Cormorant Garamond), **B · Papel** (papel claro y tinta, Instrument Serif + IBM Plex Mono) y **C · Contraste** (blanco, negro y rojo, Anton). Código borrado; queda en el historial de git (commit `a2d59fa`).

**Por qué no:** a Josep no le gustó ninguna. Se alejaban demasiado de su web anterior; las vio muy estáticas, poco modernas y con aire de plantilla de portfolio. Quiere seguir con la estética tipo Apple (cristal, formas redondeadas) y llevar su idea original al máximo: más profesional, más mezcla de portfolio y venta de sus servicios audiovisuales, cinematográfica, bonita y elegante, pero cálida y personal, no empresarial. Y que todo salga de una base de datos que pueda editar (crear artículos, secciones...): una página viva.

**Descubrimiento importante:** el PC de Josep tiene desactivados los "Efectos de animación" de Windows (Configuración › Accesibilidad › Efectos visuales). Los navegadores lo traducen en "reducir movimiento", así que A, B y C se le mostraban casi sin animaciones. Desde ahora los prototipos muestran las animaciones aunque Windows las tenga desactivadas (`useReducir` en `_comun/hooks.ts`), con un interruptor en la barra inferior ("Animaciones: sí / según Windows"). En la web final se respetará siempre el ajuste del visitante.

### 2026-10-20 · Prototipo D · Cristal

**Hecho**

- `/prototipos/d`: portada completa y ficha de proyecto (`/prototipos/d/<slug>`) con 6 proyectos reales (*Y el año que viene, ¿qué?*, *100 Baladas*, *El Cirujano*, *Lovva*, *EP Oscuridad*, *Kiboko*), los 3 servicios, cifras y premios, proceso, sobre mí, opiniones, clientes, blog y llamada final. Modo claro/oscuro.
- **Portada hecha de bloques** con la forma de la futura tabla `bloques` (`pagina`, `orden`, `tipo`, `visible`, `datos`): `src/app/prototipos/d/datos.ts`. Cada tipo de bloque es un componente (`PortadaD.tsx`). Tipos: portada, servicios, trabajos, cifras, proceso, sobre-mi, opiniones, clientes, blog, texto (sección libre), llamada.
- **Modo edición de demostración** (botón "Editar página"): arrastrar para reordenar secciones, ocultarlas, cambiar sus textos, crear secciones nuevas de cualquier tipo, borrar y restablecer. Los cambios se guardan solo en el navegador; en la fase 6 será el panel real contra Supabase.
- Venta sin precios: servicios con "Lo que aporto", "Ideal para" y "Hablemos de tu proyecto"; llamada final con chips "¿Qué tienes en mente?" que rellenan el asunto del correo y el mensaje de WhatsApp; chip "Disponible para nuevos proyectos"; en cada ficha, "¿Quieres algo así para tu proyecto?".
- Ficha: cabecera redondeada con clip, ficha técnica de cristal, frase, fotogramas con visor ampliado, antes/después del color (LOG simulado), siguiente proyecto con la misma transición.
- Comprobado en el navegador a 1024×768 y 375×812, en claro y oscuro, con y sin "reducir movimiento", sin errores de consola. `npm run lint`, `npx tsc --noEmit` y `npm run build` pasan.

**Decisiones técnicas para las fases 4, 5 y 6**

- Tabla `bloques` (o `secciones`): `id`, `pagina`, `orden`, `tipo`, `visible`, `datos jsonb`. El panel ofrece un catálogo de tipos (`CATALOGO` en `datos.ts`); un tipo nuevo en el futuro = un componente nuevo.
- Reel y clips: archivos propios cortos (mp4/webm, sin sonido, 3-5 s) más póster, no YouTube (`clip_url` en `proyectos`). Cada servicio también necesita imagen y clip.
- Imágenes con `<img>` en los prototipos; en la fase 5, `next/image` con el almacenamiento de Supabase.

### 2026-10-20 · D: visto bueno al camino y pasada de rendimiento

Josep: "me parece muy buen camino", pero "va MUY petada" (pesada, con tirones).

**Cambios**

- **Cristal sin `backdrop-filter`** en las tarjetas (`.cristal`): base translúcida + brillo en diagonal + borde y reflejo. El desenfoque real queda solo en `.cristal-fuerte` (menú, editor, botón de editar). Antes había decenas de capas desenfocando lo que tenían detrás, algunas moviéndose (marquesinas de opiniones, galería horizontal, tarjetas de servicios que cambian de ancho).
- **Orbes del fondo** con degradados radiales en vez de `filter: blur(90px)` animado.
- Sin desenfoque en los elementos que se mueven: barra de datos y chips de las tarjetas de trabajos, chips del retrato, iconos de servicios. Círculos de luz decorativos (llamada, premios, ficha) con degradado radial en vez de `blur-3xl`/`blur-[100px]`.
- Animaciones de entrada (`Revelar`, ficha) y palabra que rota sin `filter: blur`: solo opacidad y desplazamiento. El desenfoque de entrada queda solo en el titular de la portada, una vez.
- Transición de página: velo oscuro con opacidad en vez de animar un desenfoque a pantalla completa.
- El reel (y el clip de la cabecera de la ficha) se desmonta al salir de pantalla; antes seguía reproduciéndose el iframe de YouTube.
- Foco de luz del ratón: como mucho una actualización por fotograma.
- Servicios: la tarjeta se abre si el ratón se queda 160 ms, no al cruzarla.
- Josep revisa ahora con la **versión de producción** (`npm run build` + `npm run start`), no con el modo de desarrollo, que es mucho más lento. Tras cada cambio hay que volver a compilar.

**Medición** (Chrome en el PC de Josep, RTX 5070 a 165 Hz, pantalla 2048×1152): recorriendo la página fotograma a fotograma, el hilo principal va holgado antes y después (p95 de 6 ms por fotograma; en móvil simulado con CPU ×4, p95 de 18 ms). Lo que se ha quitado es trabajo de composición en la GPU, que esa medida no recoge; hay que confirmarlo con Josep mirando la web.

### 2026-10-20 · D: segunda ronda de cambios de Josep

Josep: "es una buena base, pero sigue faltando mucho trabajo". Lo que pidió y lo que se hizo:

- **Tipografía (lo más importante):** Inter no se estaba aplicando. `cristal.css` y `globals.css` apuntaban a `var(--font-sans)`, que con `@theme inline` de Tailwind no existe como variable CSS, y la web salía con la fuente del sistema (Segoe UI en Windows). Ahora usan `var(--font-sans-face)`. Inter en todo; la única cursiva es la palabra de acento de los titulares (Instrument Serif). Fuera la serif de la palabra que rota, la cita de Sobre mí, las frases de servicio, las obras premiadas y las comillas de las opiniones.
- **Textos cortados:** los titulares iban con degradado recortado al texto e interlineado de 0,95-0,98, y se comían tildes, "¿" y letras con rabito. Ahora van en color sólido con interlineado 1,02-1,08 y `text-wrap: balance`; la palabra de acento lleva relleno para que la cursiva no se corte, y los signos de cierre quedan fuera de la cursiva.
- **Controles de YouTube al entrar:** el vídeo solo se deja ver cuando YouTube avisa de que se está reproduciendo (API por `postMessage`), y se oculta si se para o termina el bucle. Debajo siempre está el póster. El reel se recorta más (`escala` 1,45) porque el provisional tiene bandas negras con subtítulos.
- **Scroll de la portada:** zona fijada de 200svh a 135svh; solo escala (de 1 a 0,9) y fundido del texto; indicador "Desliza" con una línea por la que baja una luz. Fuera Lenis: scroll nativo (`scroll-behavior: smooth` solo para los enlaces internos).
- **Rendimiento:** el radio de la tarjeta del reel ya no se anima (obligaba a repintar el vídeo en cada fotograma). Los clips de YouTube al pasar el ratón (servicios y trabajos) se sustituyen por un fundido entre fotogramas con zoom lento: cada clip cargaba un reproductor de YouTube entero. Solo queda un iframe vivo (el reel) y se desmonta fuera de pantalla.
- **Palabra que rota** ("Soy director de fotografía / filmmaker / editor"): fundido cruzado lento (1,1 s, cada 3,4 s) con un leve desplazamiento y desenfoque, en Inter, sin que la línea cambie de ancho.
- **Servicios:** sin texto vertical ni cambios de tamaño de letra al abrir; la tarjeta se ensancha en 0,9 s y el detalle entra después, con un ancho mínimo fijo para que no se recoloque. Botón "Ver proyectos y detalles".
- **Página de cada servicio** (`/prototipos/d/servicios/<slug>`): cabecera con fotogramas, mi mirada, lo que aporto, con quién trabajo, sus proyectos, cómo trabajamos, preguntas frecuentes, llamada con el servicio ya marcado y enlaces a los otros servicios. Textos de `plan/contenido/servicio-*.md`.
- **Selección:** ya no va ligada al scroll vertical. Carrusel con flechas de cristal, arrastre con el ratón y ajuste a cada tarjeta. Cada filtro tiene su propia selección y orden (`SELECCION` en `datos.ts`, de "Destacados por servicio"), con transición al cambiar. Se añaden los demás proyectos (EXPÁNDE(TE), Sin Tiempo, El Viajero, Sin Piedad, Conciertos, Eventos deportivos, Reels, Bodas).
- **En números:** "+7 años" (no 15), 1,39 M, los dos premios y dos tarjetas de los canales de YouTube ("Del Fan, Para el Fan" y "Josep Mira"). Fuera "18 proyectos". "Más de quince años" pasa a "más de siete años" en la portada, Sobre mí, `inicio.md` y `sobre-mi.md`.
- **Cómo trabajamos:** el paso activo sale del avance del scroll por la columna de pasos (antes cada tarjeta detectaba si estaba a la vista y, con dos a medias, parpadeaba); el número cambia con un fundido sin esperas. En móvil, lista normal.
- Los bloques guardados en el navegador usan otra clave (`proto-d-bloques-v2`) para que los textos nuevos no queden tapados por los antiguos.

**Dudas**

- Cifras de suscriptores y enlace de "Del Fan, Para el Fan": pendientes de Josep (no se inventan).
- Los textos dicen "más de ocho años en YouTube" (inicio, Sobre mí) y "más de nueve años creando contenido" (FAQ de Filmmaker), que no cuadran del todo con "más de 7 años". Pendiente de que Josep diga qué cifra usar en cada sitio.

**Queda**

- Que Josep lo revise (versión de producción en `localhost:3000/prototipos/d`).

### 2026-10-20 · D: 9 años y controles de YouTube

- Josep: "déjalo en 9 años". La experiencia pasa a **"más de nueve años"** / "+9" en todo (portada, cifras, Sobre mí, `inicio.md`, `sobre-mi.md`; también "ocho años en YouTube" → "nueve"). Resuelve la duda de arriba.
- Seguían viéndose los controles de vídeo al entrar. Con capturas segundo a segundo se ve la causa: el reproductor nuevo de YouTube enseña sus controles centrales (anterior, pausa, siguiente) durante unos 2-3 s al empezar a reproducirse, aunque se pida `controls=0`. El vídeo ahora espera 3,5 s reproduciéndose, tapado por el póster, antes de aparecer.
- Si aun así se ve alguna pieza de YouTube, la solución de verdad es no usar YouTube para el fondo: un mp4 propio corto (lo previsto para la web final) o Vimeo en modo `background`, que no tiene ninguna interfaz. Para el mp4 hace falta el archivo del reel (no está en el PC con un nombre reconocible) o permiso para descargarlo.

### 2026-10-20 · D: tercera ronda (Montserrat, servicios, selección, clientes)

- **Letra base Montserrat** (400-800) en todo el prototipo; Instrument Serif cursiva para la palabra de acento de los titulares, las frases de cada servicio y la palabra que rota de la portada (a Josep le gustaba esa letra ahí; lo que no le gustaba era el "Soy", que ahora va en Montserrat, más discreto).
- **Portada sin fijar:** se baja con el scroll normal; mientras se va, la tarjeta se aleja un poco y el texto sube y se funde. La sección siguiente entra enseguida.
- **Lo que hago:** tres tarjetas iguales que llevan a la página de cada servicio, con lo justo: nombre, frase, 3 "ideal para" y "Ver proyectos y cómo trabajo". Al pasar el ratón solo cambian transform y opacidad (antes cambiaban de ancho y eso recolocaba la sección en cada fotograma: era lo que daba tirones).
- **Selección:** la pastilla del filtro se desliza con un muelle; al cambiar de filtro, las tarjetas que siguen se deslizan a su nuevo sitio y las nuevas entran escalonadas; arrastre con inercia y ajuste suave. La barra de avance usa un valor de Motion (antes cada scroll del carrusel volvía a pintar toda la sección).
- **Quién soy** pasa antes de Cómo trabajamos. La foto ya no se desplaza con el scroll (cortaba la cabeza): zoom leve anclado arriba. Fuera el chip "Percusionista desde los 3 años"; en `sobre-mi.md` queda como una mención de pasada.
- **Han confiado en mí:** dos filas de logos que se mueven en sentidos opuestos (logos oficiales de Disney y Star Wars de la web antigua, monocromos según el tema; el de Kinepolis ya no carga y sale en texto, como los que no tienen logo fiable) y el apartado "Trabajo en sinergia con JUNO Media" con sus clientes. Faltan los logos oficiales del resto.
- **Foco de luz del ratón:** una mancha que se mueve con transform en vez de repintar un degradado en toda la tarjeta.
- Bloques guardados en el navegador con clave `proto-d-bloques-v4` (nuevo orden).

### 2026-10-21 · D: scroll mágico, carrusel protagonista y JUNO Media

- **Scroll mágico** (`d/scrollMagico.ts`): con la rueda del ratón, cada gesto lleva con una curva suave (1,05 s, lenta al empezar y al frenar) al inicio de la sección siguiente o anterior. Solo responde a la rueda (nunca salta solo); dentro de secciones más altas que la pantalla el scroll es normal hasta su borde; se ignora la inercia del trackpad mientras dura el viaje; se cancela con teclado o clic; apagado en táctil, con "reducir movimiento", con el editor abierto o con un vídeo abierto. El coordinador proponía en cambio un "asentado" automático al dejar de hacer scroll; se eligió lo que pidió Josep (que la rueda lleve al siguiente punto) porque además así nada se mueve sin que él lo pida.
- **Selección, carrusel protagonista:** la tarjeta activa centrada, grande y nítida; las vecinas más pequeñas y atenuadas; avance de una en una con flechas, arrastre (también con el dedo) o pulsando una vecina, con un muelle suave. Indicador de progreso fino. El fondo de la sección se funde con el fotograma de la tarjeta activa. Tarjeta limitada a la mitad del alto de la pantalla.
- **Salto al cambiar de filtro:** venía de las animaciones de layout dentro de un contenedor con scroll. Ahora: altura fija, la lista se funde (0,22 s) y la nueva entra escalonada desde la primera tarjeta. Comprobado con capturas cada 250 ms: sin saltos.
- **Han confiado en mí:** una sola fila, mucho más lenta (110 s por vuelta), se para al pasar el ratón.
- **JUNO Media:** fuera las pastillas. Pieza propia centrada: "En sinergia con", la marca JUNO MEDIA grande, la frase "Trabajo codo con codo con JUNO Media en producciones para marcas como estas." y las marcas en una fila con separadores finos (versalitas espaciadas; Arkano como firma en la cursiva de acento).

### 2026-10-21 · D: ajuste fino del scroll mágico y equilibrio de clientes

- **Scroll mágico solo en la portada** (no en fichas, servicios ni artículos).
- **Cada sección llega centrada y entera:** el destino es el centro de la sección cuando cabe en la pantalla (si es más alta, su inicio y scroll libre hasta su borde). En escritorio las secciones se compactan con márgenes y tamaños en función del alto de la pantalla (`svh`): titulares, tarjetas de servicios, carrusel, foto de Sobre mí, llamada final. "En números" pasa a dos filas (cifras y premios en una, canales en otra). Medido: a 1920×950 (y en la pantalla de Josep) caben todas; a 1440×770 todas; a 1366×640 algunas (cifras, Sobre mí, opiniones, llamada) son algo más altas y usan el scroll libre.
- **Cómo trabajamos:** cada paso es un punto del scroll mágico (data-punto): cada gesto de rueda centra el siguiente paso, y al terminar el último se pasa a la siguiente sección. El paso activo es el más cercano al centro de la pantalla.
- **Han confiado en mí, equilibrado:** la primera parte gana peso (titular de verdad "Han confiado en mí", logos y nombres más grandes y con más aire) y JUNO Media pasa a secundaria (marca pequeña en línea con "En sinergia con", frase y muro de marcas más discretos).

### 2026-10-21 · D: Han confiado en mí, luminancia

- "En sinergia con" y "JUNO MEDIA" en dos líneas separadas, con aire entre ambas; después la frase y el muro de marcas.
- Escala de luminancia propia de la sección, igual en claro y oscuro (variables en `cristal.css`): titular 100 %, clientes 82 % (y los logos de imagen con la misma opacidad y una altura óptica parecida a los nombres en texto), marca JUNO 66 %, antetítulos y frase 58 %, marcas de JUNO 52 %, líneas 12 % (antes en modo claro las líneas eran blancas y no se veían). Espaciado vertical coherente entre las dos partes. Comprobado con capturas en los dos temas.

### 2026-10-21 · D: clientes sin marquesina y secciones encuadradas

- Marca JUNO MEDIA un escalón más luminosa (74 % en oscuro, 76 % en claro); el resto de la escala igual.
- **Clientes sin marquesina:** era rápida y, al llegar, podían no verse Disney o Star Wars. Ahora todas las marcas están quietas y a la vista a la vez, en una rejilla de 5 × 2 (3 o 2 columnas en pantallas más estrechas), Disney y Star Wars primero, con la misma luminancia; los nombres largos se parten en dos líneas centradas. Entran escalonadas una sola vez y se iluminan al pasar el ratón. Nada se mueve en bucle.
- **Secciones encuadradas:** en escritorio cada sección de la portada ocupa al menos la pantalla entera con el contenido centrado (salvo la portada, que ya mide una pantalla, y Cómo trabajamos). Así el scroll mágico la deja encuadrada y no asoman la de arriba ni la de abajo. En Cómo trabajamos, 70svh por paso para que al centrar uno no asomen sus vecinos. Comprobado recorriendo la portada entera con la rueda y capturando cada parada.

### 2026-10-21 · D: barrido de luz en clientes

- Josep eligió "solo el 1" de las propuestas para dar dinamismo a "Han confiado en mí": un **barrido de luz**. Cada marca está al 82 % y sube al 100 % cuando le llega la luz; la luz cruza la rejilla de izquierda a derecha en diagonal leve (la fila de abajo un poco después). Pasada de unos 3 s y pausa de unos 4 s. Una sola animación de opacidad por marca (`.d-barrido` en `cristal.css`), sin mover nada de sitio: siempre se ven todas. Solo mientras la sección está en pantalla; con el ratón encima se para y se ilumina la marca concreta; sin barrido con "reducir movimiento". Se mantiene la entrada escalonada al aparecer.
- Se probó también una rejilla de líneas que se dibujaba al llegar (la opción 1 de otra lista de propuestas) y se quitó: Josep pidió solo una opción.

### 2026-10-21 · D: Selección fluida y pasar rápido "Cómo trabajamos"

- Josep confirma el barrido de luz en clientes ("sí"): se queda.
- **Selección seguía a tirones.** Medido con una traza de Chrome mientras el carrusel avanzaba y cambiaba de filtro: mucho trabajo de capas y pintado (575 ms de capas, 255 ms de pintado y 112 ms de rasterizado en 5 s). Causas: el carrusel hecho a mano movía con JavaScript (muelles de Motion) la pista y las siete tarjetas en cada fotograma, y el fondo era una imagen a pantalla completa con `blur(50px)` que se fundía al cambiar de tarjeta. Rehecho sobre **scroll horizontal nativo con ajuste** (`scroll-snap`): el navegador mueve las tarjetas en el compositor; la tarjeta activa sale de la posición del scroll (una vez por fotograma como mucho) y las vecinas se atenúan y encogen con una transición CSS que solo se dispara al cambiar la activa; flechas, puntos y clic en una vecina hacen scroll suave nativo; arrastre con ratón como antes. El fondo teñido se mantiene pero barato: la imagen a un octavo de tamaño con un desenfoque pequeño y ampliada ×8. Sombra y radio de las tarjetas fijos. Resultado medido: rasterizado de 112 a 16 ms; fotogramas por encima de 20 ms, de 2 a 0 (peor fotograma de 48 a 18 ms). Mismo aspecto, comprobado con capturas.
- **Pasar rápido "Cómo trabajamos":** botón de cristal "Saltar al siguiente apartado" bajo el contador; los números 01-04 son accesos directos a cada paso; y si se encadenan gestos de rueda rápido (uno justo al terminar el viaje anterior), el scroll mágico deja de ir paso a paso y lleva a la sección siguiente. Los viajes lanzados con botones no cuentan como prisa. Nada se mueve solo. Probado con gestos lentos, rápidos y con los botones.

### 2026-10-21 · D: pasada global de rendimiento (a medias)

- Medido con trazas de Chrome recorriendo la portada entera con el scroll mágico (pantalla de Josep, 2048×1040).
- Capas compuestas de 71 a 27: fuera `will-change`/`translate3d` permanentes del foco de luz (unas 30 capas), de los orbes y del carrusel; el grano pasa dentro de la capa de los orbes; la marquesina de opiniones solo se mueve en pantalla; el punto "Disponible" late con transform/opacidad (antes animaba box-shadow y repintaba siempre). Pintado de 435 a 84 ms en el recorrido; capas de 1.210 a unos 800 ms; rasterizado de 155 a unos 100 ms.
- "Cómo trabajamos" solo calcula el paso activo con la sección en pantalla.
- Imágenes externas por el optimizador de Next (`next.config.ts`, `_comun/imagen.ts`) al tamaño mostrado y en WebP/AVIF, y precarga en segundo plano de las fotos de la portada.
- El vídeo de la portada se pausa fuera de pantalla en vez de desmontarse (rehacer el iframe daba fotogramas de 40-70 ms al salir de la portada).
- **Queda:** siguen unos pocos fotogramas lentos (20-60 ms) al salir de la portada hacia "Lo que hago", sobre todo en modo desarrollo; hay que volver a medir en producción tras la pausa del vídeo. Pendiente también pasar el script de arranque a producción (`build` + `start`), que va más fluido que el modo desarrollo. El fotograma `iili.io/BmoHrCl.png` de El Cirujano ya no existe (404).

### 2026-10-21 · D: rendimiento, segunda parte

- **El script de arranque** (`scripts/iniciar-prototipos.bat`) compila y arranca la versión de producción (`npm run build` + `npm run start`), mucho más fluida que el modo desarrollo; si la compilación falla, avisa y arranca en modo desarrollo.
- **Volver de una ficha a la portada** congelaba la pantalla 242 ms. Con una traza se vio que no era montar la portada sino el reproductor de YouTube del reel al crearse (el propio YouTube ocupa la GPU unos 250 ms al arrancar). Ahora el iframe solo se crea con el vídeo a la vista y la página quieta 0,7 s, y fuera de pantalla se pausa en vez de destruirse. Peor fotograma al volver: de 242 a 24 ms. Además, al volver a la portada desde otra página, primero se montan las dos primeras secciones y el resto en segundo plano.
- Cambio claro/oscuro: peor fotograma de 37 a 18 ms.
- Fotos servidas al ancho de cada tarjeta (servicios y rejillas a 750 px, carrusel a 1080, cabeceras a 1920-2048).
- El fotograma roto de El Cirujano se quita de la lista hasta que Josep pase otro (quedan los dos que funcionan).
- **Lo que queda:** en la primera pasada por la portada caen unos 5 fotogramas de 24-50 ms al salir del hero hacia "Lo que hago" y al llegar a "Cómo trabajamos"; en una segunda pasada, ninguno. Es el navegador preparando por primera vez en la GPU esas zonas; probado quitando sombras, desenfoques, orbes, menú, iframe, animaciones de servicios y textos con degradado, y ninguno lo cambia.

### 2026-10-21 · D: ronda de la tarde

- **Calidad de imagen:** las fotos se sirven con calidad 90 y al menos al doble del tamaño en pantalla (tarjetas a 1200-1920 px, cabeceras y fotogramas a 3840). El optimizador no amplía por encima del original.
- **Cómo trabajamos:** fuera el scroll paso a paso y el botón de saltar. Los cuatro pasos a la vez en una fila de tarjetas de cristal con su número; entran escalonadas y se iluminan al pasar el ratón. (La línea que debía unirlos quedaba por encima de las tarjetas y cortaba sus bordes: Josep la marcó como error y se quitó.)
- **Selección:** tarjetas verticales más estrechas (se ven la central y casi dos vecinas por lado) y avance con flechas, puntos o clic con un deslizamiento propio de 0,6 s con curva suave (el "smooth" del navegador era brusco).
- **"Soy …"** más grande y en negrita; la palabra que rota en la cursiva artística con un degradado rojo-cálido y un brillo sutil, ajustada para que su tamaño óptico iguale al de "Soy".
- **Orden:** "En números" justo después de "Quién soy". Nueva sección **"Lo que puedo grabar para ti"** (Filmmaker), justo después de "Lo que hago": retoma la rejilla de servicios de la web antigua con seis tipos de encargo (spots y vídeo corporativo, videoclips, conciertos y aftermovies, bodas, eventos deportivos, redes), cada uno con la foto de un trabajo real que lleva a su ficha. Datos en `FILMMAKER` (datos.ts), sin precios. Bloques guardados con clave `proto-d-bloques-v5`.
- **Lo que hago:** en reposo solo icono y nombre; al pasar el ratón sube la frase, para quién y el enlace (en táctil se ve todo). Recorte con `clip-path` y el mismo radio para que la imagen no asome bajo la sombra. Después: "Ver proyectos y cómo trabajo →" siempre visible bajo el título (así el título no queda pegado abajo) y la frase y los chips aparecen entre ambos. Filo claro en el borde inferior al pasar el ratón: la foto con zoom va en su propia capa y se recorta aparte del degradado, así que en el suavizado del borde redondeado se colaban sus píxeles. Reproducido con escalado de Windows al 150 % (1 px gris en el tramo recto inferior). Ahora la foto lleva una máscara que la desvanece del todo antes del borde (solo queda el fondo negro), comprobado al 125 % y al 150 % con hover; lo mismo en las tarjetas de Selección y de proyecto. Además, el quinto inferior de las tarjetas de Lo que hago es negro opaco, para que el pie de la foto no se lea como una raya bajo el título.
- **Índice lateral** en la portada (solo escritorio): una marca fina por sección, la actual más larga y en rojo, nombre al pasar el ratón, clic para ir con la curva del scroll mágico. Aparece al salir del hero para no tapar el titular.
- **Tirones:** la tarjeta del hero y la foto de Sobre mí cambian de escala con el scroll; ahora llevan `will-change: transform` para que el navegador no las vuelva a dibujar a cada tamaño. Primera pasada por la portada: de 7-8 fotogramas lentos a 4. Comparado con el scroll nativo del navegador (6 fotogramas lentos), el scroll mágico no es la causa. Los que quedan aparecen la primera vez que se ve una sección con muchas fotos grandes.

### 2026-10-22 · D: remates de Selección, índice y ficha de proyecto

- **Selección cabe en una pantalla** también con el escalado de Windows al 150 % (unos 1280 × 632 px): medía 657 px y ahora 600. Tarjeta como mucho al 46 % del alto visible, y el enlace "Ver los trabajos por servicio" pasa a la fila de los puntos y las flechas. En tarjetas estrechas, versión compacta (menos margen, título más pequeño, solo tipo y año).
- **Selección en modo claro:** las vecinas se apagaban con opacidad y sobre el fondo claro quedaban lechosas. Ahora se apagan con un velo negro (`--d-velo-vecina`: 0,6 en oscuro, 0,3 en claro).
- **Índice lateral:** al llegar a la última sección (o al final de la página) se despliega solo con los nombres de todas las secciones y el titular "¿Quieres volver a algo?", en cascada; al subir se repliega. Entre 1024 y 1440 px el contenido de las secciones deja sitio a la izquierda para que el índice no tape los titulares (regla al final de `cristal.css`).
- **Ficha de proyecto:** los fotogramas pasan a una cuadrícula de miniaturas (2 a 4 columnas) y al pulsar se abre un visor a pantalla completa (`Visor.tsx`): fondo oscuro, contador, flechas, teclado (← → Esc), deslizar con el dedo, foto a 3840 px con las vecinas precargadas y cierre con fundido. Fuera el bloque "Del LOG al color".

### 2026-10-22 · Tokens de diseño y piezas reutilizables (tarea A)

- La línea pequeña de la llamada final ("Te respondo personalmente…") va acotada y centrada, para que el índice lateral desplegado no la tape en pantallas estrechas.
- **Tokens definitivos en `src/styles/tokens.css`:** colores de claro y oscuro (según `data-tema`), marca, letras, escala de texto, radios, sombras, curvas y duraciones. Las curvas y duraciones para motion están en `src/styles/movimiento.ts` (`CURVA`, `CURVA_VIAJE`, `DURACION`). El prototipo D ya los usa: `cristal.css` solo da nombres cortos (`--d-*` = `--jm-*`), y `piezas.tsx`, `scrollMagico.ts` y el carrusel leen las curvas de `movimiento.ts`. Se comprobó que no cambia nada visible: capturas idénticas antes y después, y los mismos valores calculados en claro y oscuro.

#### Piezas reutilizables (para pasarlas a `src/components/` en la tarea C)

| Pieza | Qué es | Dónde está |
| --- | --- | --- |
| Cristal | Fondo translúcido con brillo en diagonal, borde claro, reflejo arriba y sombra del tema. Sin `backdrop-filter`. `.cristal-fuerte` sí desenfoca, pero solo en lo que flota (menú, editor, índice) | `.cristal` y `.cristal-fuerte` en `src/app/prototipos/d/cristal.css` |
| Pastilla | Antetítulo o chip de cristal: `rounded-full`, 11 px, mayúsculas, peso 600, tracking 0,16em. Variante "Disponible" con punto verde que late | `Titular` y `Disponible` en `d/piezas.tsx`; `.latido` en `cristal.css` |
| Botón | Píldora con icono; `.boton-acento` es el rojo con sombra. Leve escala al pasar el ratón (desactivada con "reducir movimiento") | `.boton` y `.boton-acento` en `cristal.css` |
| Etiqueta | Texto pequeño en mayúsculas para tipo, año y papel, y chip de premio con laurel | `TarjetaCarrusel` y `TarjetaProyecto` en `d/bloques/BloqueTrabajos.tsx`; icono `laurel` en `d/Iconos.tsx` |
| Titular con palabra de acento | Antetítulo en pastilla, titular grande (`--jm-titular`) y la última palabra en Instrument Serif cursiva con degradado rojo-naranja. Los signos de cierre quedan fuera de la cursiva | `Titular` y `TituloConAcento` en `d/piezas.tsx`; `.d-serif` y `.d-degradado-acento` en `cristal.css` |
| Tarjeta con foto | Recorte con `clip-path` del mismo radio, fotos que se funden con zoom lento al pasar el ratón, degradado negro abajo y máscara para que la foto no asome por el borde; contenido que se revela entre el título y el enlace | `TarjetaFoto` y `Revelable` en `d/bloques/BloqueServicios.tsx`; `Diapositivas` en `d/piezas.tsx`; `MASCARA_BORDE` |
| Tarjeta de proyecto | Variante para carrusel (vecinas con velo `--jm-velo-vecina` y versión compacta) y para rejilla (pie de cristal oscuro y foco de luz que sigue al ratón con `[data-foco]`) | `TarjetaCarrusel` y `TarjetaProyecto` en `d/bloques/BloqueTrabajos.tsx` |
| Aparición al entrar | Fundido y subida de 28 px en 0,9 s con `CURVA` | `Revelar` en `d/piezas.tsx` |
| Índice lateral | Una marca por sección, nombre al pasar el ratón; al final se despliega con todas las secciones. Entre 1024 y 1440 px el contenido le deja sitio (regla al final de `cristal.css`) | `d/IndiceLateral.tsx` |
| Scroll mágico | Solo en Inicio: cada gesto lleva a la sección siguiente o anterior, centrada, con `CURVA_VIAJE`; un gesto rápido justo después de llegar se salta una | `d/scrollMagico.ts` (`useScrollMagico`, `deslizarA`, `encuadre`) |
| Carrusel | Scroll nativo con ajuste (`scroll-snap`), avance propio de 0,6 s con `CURVA_VIAJE`, arrastre con ratón y fondo teñido con el fotograma activo | `Carrusel` en `d/bloques/BloqueTrabajos.tsx` |
| Visor de fotos | Pantalla completa: flechas, teclado, deslizar con el dedo, contador, foto a 3840 px con las vecinas precargadas | `d/Visor.tsx` |
| Imagen en calidad alta | Optimizador de Next a calidad 90 y al doble del tamaño en pantalla | `img()` en `src/app/prototipos/_comun/imagen.ts` |

**Pendiente**

- Vídeo de fondo propio (ver arriba): hace falta el archivo del reel o el permiso de Josep para descargarlo de su canal e instalar las herramientas (yt-dlp y ffmpeg).
- Logos oficiales de Kinepolis, Consell Valencià de la Joventut, Ayuntamiento de l'Alfàs del Pi, Ocisport, Mediterra Cinema, Cero Coma, Dreamore, Kymera, JUNO Media y sus clientes (que los pase Josep o descargarlos con su permiso). Después: pasar los tokens a `globals.css` y la tipografía a `layout.tsx`.
- Datos pendientes ("Pendiente" en las fichas): año de *El Cirujano*, *Lovva*, *100 Baladas*, *EP Oscuridad* y *Kiboko*; productora de *Lovva*, *EP Oscuridad* y *Kiboko*; dirección de *Kiboko*; cámara de todos.

**2026-10-22 (cierre)**
- Josep da el visto bueno a D · Cristal. Fase 3 hecha. Lo que siga se pule en cada página durante la construcción (tareas C y S de `hoja-de-ruta.md`).
