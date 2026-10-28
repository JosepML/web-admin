# Cómo se añade una pantalla al panel

Receta para añadir o cambiar pantallas del panel. La escribió la tarea D, que dejó montados el inicio de sesión, el modo «Editar página» y la pantalla de Proyectos, y la amplió el mismo hilo al hacer el resto del panel (S14 a S17: artículos, servicios, clientes, opiniones, canales, ajustes, biblioteca y mensajes). **Artículos o Servicios son el modelo más simple:** copia sus archivos y cambia lo que toque.

## 1. Cómo funciona la edición (no lo cambies)

- **Una sola persona edita:** Josep, con Supabase Auth. El middleware (`src/middleware.ts`) refresca la sesión y manda `/admin/*` a `/admin/entrar` si no hay sesión. Cada página del panel vuelve a comprobarlo con `exigirAdmin()` (`src/lib/admin/sesion.ts`), y la RLS de la base es la última barrera.
- **Borrador y publicado** (contrato completo en `plan/esquema.md`, «Cómo se usa desde la app»): lo que Josep escribe se autoguarda en `borradores` (solo los campos que difieren de lo publicado). La web no lo ve hasta que pulsa **Publicar** (`rpc publicar`), que guarda la versión anterior en `revisiones` (las 30 últimas) y vacía la caché de esa tabla. **Descartar** borra el borrador. **Ocultar** pone `estado = borrador`. Una fila nueva nace oculta y sin `publicado_en`.
- **Vista previa:** `/admin/vista-previa?ruta=/trabajos/x` activa el `draftMode` de Next. Mientras está activo, `filas()` de `src/lib/datos/cliente.ts` lee con la sesión de Josep y pone encima los borradores, así que toda la web se ve como quedará. Sale con la pastilla «Vista previa» o en `/admin/vista-previa/salir`.
- **Acciones del servidor** en `src/lib/admin/contenido.ts`. Son genéricas por tabla (las de `TABLAS_CONTENIDO` en `src/lib/admin/tipos.ts`) y **nunca lanzan**: devuelven `Resultado<T>` (`{ ok: true, datos }` o `{ ok: false, error }` con un texto en español que Josep entiende).

| Acción | Para qué |
| --- | --- |
| `listar(tabla)` | Filas con `hayBorrador` y su `borrador`, en su orden |
| `cargarParaEditar(tabla, id)` | Fila, borrador y extras (servicios de un proyecto, bloques de una página) |
| `guardarBorrador(tabla, id, datos)` | Autoguardado. Con `{}` descarta |
| `publicar` / `descartar` | Lo de arriba |
| `crear(tabla, valores)` | Fila nueva, oculta y primera de la lista |
| `duplicar(tabla, id)` | Copia oculta con slug `-copia` y el contenido en borrador |
| `cambiarVisible` / `reordenar` / `borrar` | Ojo, arrastrar y borrar (solo lo que nunca se publicó) |
| `cambiarAlInstante(tabla, cambios)` | Lo que no pasa por borrador (hoy, `proyectos.destacado_orden`). Lista blanca en `AL_INSTANTE` |
| `revisiones` / `restaurar` | Historial «Versiones anteriores» |

Medios en `src/lib/admin/medios.ts` (`listarMedios`, `mediosPorId`, `registrarMedio`, `cambiarTextoAlternativo`) y subida desde el navegador con `subirArchivo(file)` de `src/lib/admin/subir.ts` (comprueba tipo y 50 MB, sube a `medios/subidas/AAAA/MM/`, mide la imagen o el vídeo y crea la fila de `medios`).

## 2. La receta (una tabla con borrador, como artículos o servicios)

1. **Campos** en `src/components/admin/<seccion>/esquema.ts`: una lista de `SeccionFormulario` (`{ id, titulo, campos }`) como `SECCIONES_PROYECTO`. Los tipos de campo están en `src/components/admin/campos/tipos.ts`:
   `texto`, `largo` (Markdown básico), `numero`, `interruptor`, `seleccion`, `multiple`, `proyecto`, `medio` (imagen o vídeo de la biblioteca), `galeria`, `youtube`, `videos`, `textos` (frases sueltas; con `largo: true`, párrafos), `lista` (objetos ordenables), `grupo` (subobjeto), `slug`, `enlace` (https; vacío se guarda como null, que es lo que admiten las columnas de enlace), `fecha`, `documento` (editor visual del cuerpo de un artículo, `campos/EditorDocumento.tsx`), `google` (vista previa del resultado de búsqueda; no tiene valor propio) y `nota`. En `seleccion`, `obligatorio: true` quita la opción vacía (columnas que no admiten null). Las claves son las columnas de la tabla tal como están en `plan/esquema.md`. `medio: true` pone dos campos cortos en la misma fila.
2. **Formulario**: un componente cliente de tres líneas como `FormularioProyecto.tsx`, que monta `<FormularioContenido>` con `tabla`, `secciones`, `volver`, `titulo(datos)` y `rutaPublica(datos)` (para «Ver en la web» y la vista previa). Ya trae: autoguardado (0,9 s, Ctrl+S, al cambiar de pestaña y aviso al cerrar), estado («Sin publicar», «Oculto», «En la web»), Publicar, Descartar, índice de secciones, ocultar o mostrar e historial.
3. **Página del formulario** en `src/app/admin/(panel)/<seccion>/[id]/page.tsx`: `exigirAdmin({ redirigir })`, `cargarParaEditar` y las opciones que pidan los campos (`tipos`, `servicios`, `categorias`...).
4. **Lista** en `src/app/admin/(panel)/<seccion>/page.tsx` con `<ListaContenido>` (`src/components/admin/ListaContenido.tsx`): la página de servidor llama a `listar(tabla)`, mezcla cada fila con su borrador y pasa `{ id, titulo, detalle, estado, nuevo, hayBorrador, miniatura?, ruta? }`. Trae búsqueda, filtros (Todos, En la web, Ocultos y nuevos, Con cambios), orden arrastrando (`ordenable`), ojo, menú (ver, vista previa, duplicar, borrar), pestañas opcionales (`pestanas`) y el modal «Nuevo…» (`crearCon`: qué campo pide y si saca el slug). Proyectos usa la suya, `ListaProyectos.tsx`, por los destacados de Inicio.
5. **Barra lateral**: en `src/components/admin/BarraLateral.tsx`, quita `pronto` de tu sección. Si debe salir en el Resumen, añádela en `src/app/admin/(panel)/page.tsx`.
6. **Caché**: si publicar tu tabla cambia otras que lee la web, añádelas en `afectadas()` de `contenido.ts`. Si tu tabla tiene extras (como los servicios de un proyecto), sigue el ejemplo de `servicios` en `cargarParaEditar`, `duplicar` y la función `publicar` de la base.
7. **Comprueba** en el emulador (punto 5): crear, escribir, recargar (el borrador sigue), vista previa, publicar (la web cambia), ocultar, duplicar, recuperar una versión. En móvil también.

**Tablas sin borrador** (`mensajes`, `medios`, `ajustes`): no usan `FormularioContenido`, que es para borrador y publicado. Escriben directo con el cliente de `exigirAdmin()` (la RLS solo deja al administrador) y llaman a `revalidarContenido([tabla])` después. Ejemplos: `src/lib/admin/ajustes.ts` (botón Guardar, se ve al momento), `src/lib/admin/mensajes.ts` y, en `src/lib/admin/medios.ts`, `cambiarMedio`, `usosDeMedios` (dónde se usa cada archivo) y `borrarMedio` (la base impide borrar lo que se usa).

**Columna nueva:** migración en `supabase/migrations/` (`add column … not null default …`), tipos en `src/lib/supabase/tipos.ts` y el campo en el esquema del formulario. `publicar` y los borradores la recogen solos (`columnas_editables()`). Si la migración la tiene que ejecutar Josep, el formulario no debe enseñar el campo hasta que exista (el borrador rechaza campos que la tabla no tiene): mira `FormularioServicio.tsx`.

## 3. Piezas que puedes usar

| Pieza | Dónde |
| --- | --- |
| `Campos({ campos, datos, cambiar })` y `ProveedorOpciones` | `src/components/admin/campos/Campos.tsx` |
| Selector de la biblioteca (subir o elegir, búsqueda, varias a la vez), `Miniatura`, `useSoltarArchivos` | `src/components/admin/campos/medios.tsx` |
| `useDialogos()` → `confirmar({ titulo, texto, aceptar, peligro })` y `avisar(texto)` | `src/components/admin/Dialogos.tsx` (ya montado en el layout del panel) |
| `useAutoguardado` y `textoGuardado` | `src/components/admin/useAutoguardado.ts` |
| Clases: `campo`, `interruptor`, `boton-icono`, `boton-suave`, más las de la web (`cristal`, `boton`, `boton-acento`) | `src/styles/edicion.css` y `src/styles/web.css` |
| Iconos | `src/components/Iconos.tsx` |

Textos de la interfaz en español, cálidos y cortos, como los que ya hay. Nada de precios. Animaciones siempre activas (Josep tiene «reducir movimiento» en Windows).

## 4. Editar en la propia web (páginas de bloques)

Inicio y Sobre mí se editan en su sitio con la pastilla «Editar página» (`src/components/edicion/`). La parte que carga un visitante (`contexto.tsx`) es mínima; el editor (`EditorPagina.tsx`) solo se descarga si el navegador tiene la cookie de sesión.

- Una página nueva hecha de bloques solo tiene que pasar `pagina={{ id, slug, titulo }}` a `<PaginaBloques>` para ser editable.
- **Texto editable en un bloque:** envuélvelo con `<Editable campo="titulo" valor={d.titulo}>…</Editable>` (`multilinea` para textos largos, `bloqueHtml` si dentro hay párrafos). El `Titular` de `piezas.tsx` ya lo hace con antetítulo, título y texto.
- **Imagen cambiable:** `<CambiarImagen campo="imagen" />` dentro de un contenedor `relative`.
- **Tipo de bloque nuevo:** además de lo que dice `plan/patron-paginas.md`, añade su entrada en `CATALOGO` de `src/components/edicion/catalogo.ts` (nombre, descripción, campos y datos iniciales). Sin ella no sale en «Añadir sección» ni tiene formulario.
- **Ordenar secciones** (`/admin/paginas/[id]`, `src/components/admin/paginas/OrdenSecciones.tsx`): el orden y el ojo de cada sección sin abrir la web. Escribe la lista de bloques en el mismo borrador que el editor y respeta lo demás que lleve.
- **Cabecera de Trabajos y Recreaciones** (`EditorCabecera.tsx`, en la misma ruta): su primer bloque y los datos de Google.
- **Especialidades** (`filmmaker-*`): páginas de bloques normales en `/servicios/filmmaker/<x>`; la ruta pública de cualquier página sale de `rutaPagina()`.
- Las páginas con plantilla propia (Trabajos, Recreaciones, fichas, servicios, blog) no se editan en su sitio: sus datos se cambian en el panel.

## 5. Probar en el contenedor

El contenedor no llega a Supabase. `scripts/supabase-local/README.md` explica cómo montar un PostgreSQL local con las migraciones del repo y una imitación de Supabase (REST, auth y storage) con la RLS real, y entrar con `local-josep`. Las capturas, con Playwright. Nunca se prueba escribiendo en la base real: eso lo hace Josep en su PC.
