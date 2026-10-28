# Siguientes pasos

> **2026-10-24: el orden vigente está en `plan/plan-publicacion.md`** (qué hace Opus y qué Sonnet hasta publicar). Este archivo queda como detalle de cada tarea.

2026-10-24. Escrito al cerrar el panel (hilo de D). El panel está completo: lo que queda es web pública, datos y lanzamiento. Cada punto es un hilo; los marcados con Sonnet siguen `plan/patron-paginas.md` o `plan/patron-panel.md`.

## Orden recomendado

0. **Proyectos nuevos** (pedido por Josep el 2026-10-24): la web lleva un año sin actualizarse. Añadir desde el panel los proyectos del último año, con su tipo para que salgan en la página de su especialidad (eventos corporativos, por ejemplo, en Spots y vídeo corporativo: puede hacer falta un tipo nuevo y añadirlo a los `tipos` de esa página).

1. **S10 · Contacto** (Sonnet). `/contacto` guiado que inserta en `mensajes` (la RLS ya admite la inserción pública con límite) y `/gracias`. Aviso por correo a Josep: Edge Function o un servicio de correo; hay que elegir uno con Josep (no hay ninguno configurado). Al terminar, los «Hablemos» que hoy llevan a `/#llamada` pueden ir a `/contacto`, y la pantalla Mensajes del panel tendrá datos de verdad (S17).
2. **S2 · Imágenes al bucket** (en el PC de Josep, con Remote Control: el contenedor no llega a ImgBB ni a Imgur). 95 de los 101 medios siguen fuera (`url_origen` sin `ruta`). Descargar cada uno a resolución original, subirlo a `medios/` y rellenar `ruta`, sin tocar los ids (todo apunta a ellos). Cuando esté, el recorte de la biblioteca funciona con todas las fotos y la web deja de depender de servicios externos. Antes de escribir en la base real, Josep da el visto bueno.
3. **S11 · Privacidad y cookies** (Sonnet). Páginas legales como páginas de bloques y GA4 `G-RKBDRMVL1J` solo tras aceptar.
4. **S12 · SEO y S13 · redirecciones** (Sonnet). Metadatos y Schema.org desde los campos SEO que ya guarda el panel; las URLs antiguas `/#/project/<id>` a su ficha con `id_antiguo`.
5. **S18 · Copia de seguridad, S19 · guía del panel y S20 · repaso final.**
6. **F · Lanzamiento** (Opus), solo con la orden de Josep.

## Pendiente de Josep

- Vídeo de portada como archivo mp4 (o permiso para sacarlo de su canal).
- Logos oficiales que faltan (Ocisport, Kinepolis, CVJ, Ayuntamiento de l'Alfàs, Centro Excursionista Eldense, Mediterra Cinema, Cero Coma, Kymera y los de JUNO sin logo): se suben en Clientes.
- En Clientes hay tres «SOM Events» ocultos repetidos (borradores de pruebas): puede borrarlos desde su menú.
- Retrato y fotos de rodaje para «Sobre mí».
