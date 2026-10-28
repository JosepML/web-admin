# Traspaso de la tarea D · Sistema de edición

2026-10-24. Hecho por Opus en el hilo de la tarea D. Receta para seguir: `plan/patron-panel.md`.

## Qué queda hecho

- **Entrar:** `/admin/entrar` con el correo y la contraseña de Supabase de Josep. Si entra alguien que no es administrador, se le cierra la sesión. El middleware protege `/admin` y refresca la sesión; sin cookie de sesión no hace nada, así que la web pública no paga nada por él.
- **Editar página** (Inicio y Sobre mí): con la sesión iniciada aparece la pastilla «Editar página» (desde el panel se llega con `?editar=1`). Textos editables con un clic donde están, «Cambiar imagen» o soltar una foto encima, barra de cada sección al pasar el ratón (subir, bajar, ocultar, duplicar, borrar, editar), panel lateral con la lista de secciones y sus formularios, «Añadir sección» con el catálogo de los 15 tipos, pestaña Página (título y SEO) con las versiones anteriores, deshacer y rehacer (Ctrl+Z), autoguardado en borrador, Publicar, Descartar y «Ver cómo queda».
- **Panel:** Resumen (atajos y lista de cambios sin publicar), Páginas y **Proyectos completos**: lista con búsqueda, filtros y orden arrastrando, tira «En Inicio» (hasta 8, orden arrastrando, estrella para destacar), ojo para ocultar o mostrar, nuevo, duplicar, borrar lo nunca publicado y formulario por secciones (básico, imágenes y vídeo, textos, premios, títulos de las secciones y Google) con autoguardado, galería arrastrando, subida de archivos e historial.
- **Vista previa de toda la web** con lo no publicado (`/admin/vista-previa`), con su pastilla para salir.
- **Emulador de Supabase** para probar en el contenedor: `scripts/supabase-local/` (README dentro).

Probado de punta a punta en el emulador, con las migraciones reales y una copia de los datos: entrar, editar un texto de Inicio, subir una imagen, ocultar y añadir secciones, publicar (el visitante lo ve y queda una revisión), deshacer, descartar, crear un proyecto, rellenarlo, publicarlo y verlo en `/trabajos/<slug>`. No se tocó la base real.

## Pendiente de Josep

1. Probarlo en su PC con la base real: volver a lanzar `scripts\iniciar-prototipos.bat`, entrar en `/admin/entrar`, editar un texto de Inicio y crear un proyecto de prueba (después lo puede borrar desde su menú si no lo publica, u ocultarlo).
2. Las cosas pequeñas de contenido que vio en su repaso, para un hilo de Sonnet.

## Pendiente para los hilos siguientes

- **S14 a S17 hechos en este hilo** (2026-10-24, a petición de Josep): artículos con editor visual, servicios, clientes, opiniones, canales, ajustes, biblioteca y mensajes. El recorte de S16 se hizo después (se guarda como imagen nueva; solo funciona con imágenes ya copiadas al bucket, no con las de ImgBB o Imgur hasta S2). S17 espera al formulario de contacto (S10) para tener mensajes de verdad.
- **SQL de `titulo_mirada`:** ejecutado por Josep (comprobado el 2026-10-24).
- **Trabajos y Recreaciones** tienen plantilla propia y no se editan en su sitio. Sus textos de cabecera, si Josep quiere cambiarlos, necesitan bloques o columnas nuevas.
- **«Más vídeos» de un proyecto:** hecho, la ficha los pinta con `MasVideos.tsx` (antes o después del texto según el interruptor del panel).
- Los cambios de **orden** de la lista de proyectos y de **destacados** se guardan al instante, sin pasar por borrador (son de organización, no de contenido).
