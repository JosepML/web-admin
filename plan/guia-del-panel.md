# Guía del panel de edición · Web Josep Mira Lozano

Todo el contenido de la web (textos, fotos, proyectos, artículos, servicios, clientes, opiniones, canales y datos de contacto) sale de la base de datos y se edita desde dos sitios: **en la propia web** (para las páginas de secciones como Inicio, Sobre mí, JUNO Media o las especialidades) y en el **panel `/admin`** (para proyectos, artículos, biblioteca de fotos, mensajes y ajustes).

---

## 1. Cómo entrar y cómo funcionan los borradores

1. Abre `/admin/entrar` (por ejemplo, `http://localhost:3000/admin/entrar` en local o `tudominio.com/admin/entrar` cuando esté publicada).
2. Entra con tu correo y tu contraseña de administrador.
3. **Nada de lo que toques sale en público hasta que pulses «Publicar»:**
   - Mientras escribes o cambias fotos, todo se **autoguarda en borrador** en menos de un segundo (o al pulsar `Ctrl + S`).
   - El botón **«Ver cómo queda» / «Vista previa»** te enseña la web entera tal como quedará con tus borradores aplicados. Arriba o abajo verás una pastilla para salir de la vista previa cuando quieras.
   - **«Publicar»** pasa los cambios a la web pública y guarda la versión anterior en el historial (**«Versiones anteriores»**), por si quieres volver atrás.
   - **«Descartar»** borra el borrador sin tocar lo que ya estaba publicado.

---

## 2. Editar páginas directamente sobre la web (Inicio, Sobre mí, JUNO Media y especialidades)

Cuando has iniciado sesión, al visitar Inicio (`/`), Sobre mí (`/sobre-mi`), JUNO Media (`/juno-media`) o cualquiera de las especialidades de Filmmaker (`/servicios/filmmaker/...`), aparece abajo una pastilla flotante **«Editar página»**:

- **Cambiar un texto en su sitio:** haz clic encima de cualquier título, subtítulo o párrafo y escribe directamente. Para poner la palabra de acento en cursiva editorial (*Instrument Serif*), rodéala con asteriscos: `Historias hechas de *luz*`.
- **Cambiar una foto:** pasa el ratón sobre la imagen y pulsa **«Cambiar imagen»** (o suelta un archivo desde tu ordenador encima).
- **Reordenar, ocultar o añadir secciones:**
  - Al pasar el ratón por una sección aparece su barra superior con botones para **subir**, **bajar**, **ocultar** (ojo), **duplicar**, **borrar** o abrir todos sus campos en el panel lateral.
  - Con **«Añadir sección»** puedes insertar cualquiera de los bloques del catálogo.
  - Puedes deshacer con `Ctrl + Z`.
- **Desde el panel (`/admin/paginas`):** también puedes entrar en **«Páginas»** y pulsar **«Editar contenido»** en cualquier página para ordenar sus secciones arrastrando, editar el contenido de cada bloque con el icono del lápiz (incluidos qué proyectos salen en Selección y en qué orden) o cambiar el título y la descripción que salen en Google.

---

## 3. Proyectos (`/admin/proyectos`)

En **Proyectos** tienes toda tu filmografía y trabajos:

- **Tira superior «En Inicio»:** muestra los proyectos destacados que salen en el carrusel de Selección de Inicio. Puedes cambiar su orden arrastrándolos, añadir más o quitarlos con la estrella.
- **Orden en Trabajos:** puedes filtrar la lista por **Todos**, **Filmmaker**, **Dirección de fotografía** o **Edición** y arrastrar las filas para decidir en qué orden aparecen dentro de cada servicio.
- **Visibilidad rápida:** el icono del **ojo** oculta o muestra un proyecto en la web sin borrarlo.
- **Crear o editar un proyecto:**
  1. **Datos básicos:** título, `slug` (la dirección `/trabajos/tu-slug`), tipo principal (Cortometraje, Videoclip, Publicidad, Corporativo, Aftermovies y conciertos, Eventos, Bodas, Redes sociales, Visuales e IA, Recreación), categorías extra (por ejemplo, para que un evento salga también en Redes sociales), servicios asociados, año, dirección, productora/cliente, tu papel, cámara y el interruptor **«Con JUNO Media»** (añade el sello que enlaza a `/juno-media`).
  2. **Imágenes y vídeos:**
     - **Póster (miniatura):** la imagen que sale en las tarjetas.
     - **Imagen de cabecera:** opcional; si quieres que la foto grande de arriba al entrar en la ficha sea distinta del póster.
     - **Vídeo principal:** ID de YouTube (con segundo de inicio opcional) o archivo de vídeo propio en «Más vídeos» con rol `principal`.
     - **Clip corto (hover) y vídeo de portada:** archivos mp4 silenciosos opcionales para la vista previa al pasar el ratón y el fondo de la cabecera.
     - **Galería de fotogramas y Detrás de cámaras:** sube o elige varias fotos de la biblioteca y ordénalas arrastrando.
     - **Más vídeos:** piezas adicionales (YouTube, Shorts en vertical, reels de Instagram o archivos propios) y un interruptor para colocarlos antes o después del texto.
  3. **Textos de la ficha:** resumen para la tarjeta, **El proyecto** (`historia`), **Decisiones clave** (lista con `- **Título.** explicación`), **El reto**, **Resultado** y la **Frase final** (con `*palabra*` entre asteriscos para la cursiva). Si dejas una sección vacía, no se muestra en la ficha.
  4. **Premios y menciones:** nombre del premio o cifra, festival/contexto, año y tipo (`ganado`, `podio`, `nominacion` o `cifra`).
  5. **Google (SEO):** título y descripción personalizados para buscadores, con vista previa en vivo.

---

## 4. Biblioteca de medios (`/admin/biblioteca`)

Todas las fotos y vídeos propios de la web viven aquí:

- **Carpetas tipo Drive (columna derecha):** organiza las fotos por proyecto o carpeta. Puedes crear carpetas nuevas, buscar una carpeta con el buscador lateral y **arrastrar varias fotos seleccionadas** a una carpeta para moverlas de golpe.
- **Buscador superior:** busca fotos por su nombre de archivo, su texto alternativo o el nombre de su carpeta.
- **Subir fotos con punto de interés:** al subir una o varias imágenes puedes marcar con un clic dónde está el **punto de interés** (por ejemplo, la cara del sujeto) para que ningún recorte panorámico o vertical de la web corte lo importante.
- **Editar una foto existente:** al hacer clic en cualquier imagen de la biblioteca puedes:
  - Cambiar su **texto alternativo** (descripción para Google y accesibilidad).
  - Mover su **punto de interés** en cualquier momento.
  - **Recortar** la imagen en proporción libre, `16:9`, cine, `4:5`, `1:1` o `9:16` (se guarda como una imagen nueva a resolución original, sin estropear la original).
  - Ver **dónde se está usando** (en qué proyecto, página o artículo). La biblioteca impide borrar por error una imagen que esté en uso.

---

## 5. Artículos del blog (`/admin/articulos`)

- Crea o edita artículos con el **editor visual**: títulos (`H2`, `H3`), negrita, cursiva, listas, citas, enlaces, imágenes de la biblioteca con pie de foto y vídeos de YouTube intercalados entre párrafos.
- Elige la **categoría**, la **fecha**, el **extracto** de la tarjeta, la **imagen de portada** y revisa cómo se verá en Google antes de pulsar **Publicar**.

---

## 6. Servicios, Clientes, Opiniones, Canales y Ajustes

- **Servicios (`/admin/servicios`):** edita los 3 ejes (Dirección de fotografía, Filmmaker y Edición): frase, resumen, imagen de tarjeta, imagen apaisada, **fotos del carrusel de cabecera**, «Mi mirada» (y su título), qué aporto, para quién, pasos del proceso y preguntas frecuentes.
- **Clientes (`/admin/clientes`):** separados en dos pestañas (**Clientes propios** y **Con JUNO Media**). Puedes mostrar cada cliente con su logo o con su nombre escrito, ajustar la altura del logo y reordenarlos arrastrando.
- **Opiniones (`/admin/opiniones`):** citas de clientes o directores con su nombre y proyecto/cargo.
- **Canales (`/admin/canales`):** las tarjetas de tus canales de YouTube («Del Fan, Para el Fan» y «Josep Mira»).
- **Ajustes (`/admin/ajustes`):** tu nombre, lema, ubicación, correo, número de WhatsApp, interruptor de «Disponible para nuevos proyectos», enlaces a Instagram/YouTube/LinkedIn y la **Foto de Contacto** que sale en `/contacto`, `/gracias` y en el bloque «Hablemos» del final de las páginas. Los cambios en Ajustes se aplican al pulsar **Guardar**.

---

## 7. Mensajes de contacto (`/admin/mensajes`)

- Cada vez que alguien envía el formulario de `/contacto` o el bloque «Hablemos» del final de una página, te llega el aviso por correo (Formspree) **y además queda guardado aquí**.
- Puedes filtrar los mensajes por **Nuevos**, **Respondidos** o **Cerrados**, añadir notas internas y pulsar directamente **Responder por correo** o **Abrir en WhatsApp** si dejaron teléfono.

---

## 8. Copia de seguridad (`scripts\hacer-copia-seguridad.bat`)

- Haz doble clic en `scripts\hacer-copia-seguridad.bat` cuando quieras guardar en tu ordenador una copia completa de todas las tablas de la base de datos y de los archivos del bucket `medios`.
- Se guardará en una carpeta con fecha dentro de `copias-seguridad/`.
