# Fundamentos: qué tiene que tener la web de un director de fotografía y filmmaker

Revisión hecha el 2026-10-20 tras el comentario de Josep ("revisa bien qué debe tener una página así, son los cimientos"). Resume lo que hacen las webs de directores de fotografía y filmmakers y cómo lo aplicamos. Este archivo manda sobre el resto de `plan/contenido/` si hay contradicción.

## Lo que hacen las buenas webs del oficio

1. **El trabajo habla primero.** El reel ocupa toda la pantalla nada más entrar, y debe ser corto (de 1 a 3 minutos), sin parones, con lo mejor de la luz y el encuadre. Los textos largos van después.
2. **Poco y muy bueno.** Se elige con criterio: mejor 8 proyectos impecables que 20 desiguales. El menú es corto (unas 4 o 5 entradas) y el trabajo va primero.
3. **Cada proyecto tiene su ficha técnica.** Título, año, tipo, director/a, productora o cliente, **mi papel** y **cámara y ópticas**. Es la forma estándar de acreditar en cine (así lo hacen las fichas de profesionales de las film commissions: año, título, tipo, productora, cargo).
4. **Fotogramas.** Para un director de fotografía, los fotogramas (frame grabs) en alta calidad y con la proporción original son tan importantes como el vídeo: se ven de un vistazo, cargan rápido y enseñan la luz y la composición. Muchas webs de DF tienen una galería de fotogramas propia.
5. **Detrás de cámaras.** Fotos de rodaje y, cuando lo hay, el antes/después del color. Enseñan cómo trabajas.
6. **Premios y selecciones visibles.** Laureles en la ficha y en la tarjeta del proyecto, y una lista (año, premio o selección, obra) en Sobre mí.
7. **El equipo no es una sección.** Las webs serias no tienen una página de "mi material". La cámara aparece en la ficha técnica de cada proyecto, que es donde le interesa a quien sabe.
8. **Clientes y opiniones.** Logos de clientes reales y frases de clientes, cortas y con nombre o, al menos, con el tipo de proyecto.
9. **Sobre mí con cara.** Retrato de calidad, historia breve en primera persona, formación y reconocimientos.
10. **Contacto sin esfuerzo.** Formulario corto, correo y un botón de WhatsApp, siempre a un clic.
11. **Rápida.** Vídeos que no bloquean la carga, imágenes optimizadas, y un fotograma de respaldo si el vídeo no puede reproducirse.

Fuentes consultadas: guías de portfolio para cineastas y directores de fotografía (HubSpot, Wix, Format, Diversekit, Muffingroup, Grigora, FrameKit), el modelo de créditos de Madrid Film Office y fichas de DF españoles (Pau Esteve Birba, Kiko de la Rica).

## Cómo cambia nuestra web

| Qué | Antes (primera versión de la fase 2) | Ahora |
| --- | --- | --- |
| Menú | Servicios · Trabajos · Sobre mí · Blog · Contacto | **Trabajos** · Servicios · Sobre mí · Blog · Contacto, y botón "Hablemos". El trabajo primero |
| Tarjeta de proyecto | Imagen y título | Fotograma, título, **mi papel** y laurel si lo tiene. Clip mudo al pasar el ratón (fase 3) |
| Ficha de proyecto | Textos largos | **Ficha técnica** arriba (año, tipo, dirección, productora o cliente, mi papel, cámara), vídeo, **galería de fotogramas**, textos ("La historia", "Cómo lo hicimos"...), **detrás de cámaras**, premios |
| Trabajos | Lista con filtros | Lista con filtros y una vista **Fotogramas** (cuadrícula solo de fotogramas, que lleva a cada proyecto) |
| Premios | Mencionados dentro de los textos | Bloque propio: franja de laureles en Inicio y lista en Sobre mí |
| Equipo | Sección "Mi equipo" en Sobre mí | **Eliminada.** La cámara va en cada ficha técnica; una pregunta frecuente explica que, si un proyecto pide otro material, se alquila |
| Opiniones | Oculta hasta tener | **Visible** con las 5 frases que ha pasado Josep |
| WhatsApp | Pendiente | Botón de WhatsApp (sin mostrar el número en texto, para evitar spam) |

## Lo que esto pide a la base de datos (fase 4)

Campos nuevos en `proyectos`: `direccion` (quién dirige), `productora_cliente`, `mi_papel` (corto, para la tarjeta), `camara`, `fotogramas` (lista de imágenes con su orden), `detras_de_camaras` (fotos), `premios` (lista: año, nombre, festival, tipo ganado/selección/nominación). Tabla `opiniones` ya prevista.
