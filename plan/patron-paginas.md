# Cómo se hace una página de la web pública

Receta para las tareas S5 a S11. La escribió la tarea C, que dejó montados el marco de la web, la capa de datos e Inicio. Si sigues esto, tu página se verá como el prototipo D y Josep podrá editar su contenido.

## 1. Dónde está cada cosa

| Qué | Dónde |
| --- | --- |
| Páginas de la web | `src/app/(web)/` (el layout ya pone letras, tokens, `web.css`, transición, menú, orbes y pie) |
| Rutas, en un solo sitio | `src/lib/rutas.ts` (`RUTAS.proyecto(slug)`, `RUTAS.servicio(slug)`...). Nunca escribas una URL a mano |
| Lectura de la base | `src/lib/datos/` (una función por consulta, con caché) |
| Tipos listos para pintar | `src/lib/datos/tipos.ts` (`Proyecto`, `Servicio`, `Articulo`, `Medio`...) |
| Selecciones compartidas | `src/lib/datos/seleccion.ts` (`proyectosDe(proyectos, filtro)`, `imagenesDe`, `fotogramas`, `laurel`, `fechaCorta`) |
| Marco (menú, tema, pie, índice lateral) | `src/components/marco/` |
| Piezas reutilizables | `src/components/piezas.tsx` (`Revelar`, `Titular`, `TituloConAcento`, `Parrafos`, `Contador`, `ModalVideo`, `Disponible`, `Diapositivas`) y `src/components/Iconos.tsx` |
| Utilidades | `src/components/comun/` (`img()` para imágenes q90, `Enlace` con transición, `VideoFondo`, `VideoYouTube`, `useReducir`, `usePunteroFino`, `usePantallaAncha`) |
| Bloques de página | `src/components/bloques/` (uno por tipo, montados por `PaginaBloques`) |
| Estilos | `src/styles/tokens.css` (variables `--jm-*`) y `src/styles/web.css` (clases `cristal`, `boton`, `pastilla`, `jm-serif`, `jm-degradado`...) |
| Referencia visual | `src/app/prototipos/d/` (no se importa nada de ahí: se copia y se adapta) |

## 2. La receta

1. **Página de servidor** en `src/app/(web)/<ruta>/page.tsx`. Lee con las funciones de `src/lib/datos/` y pasa los datos a un componente.
   ```tsx
   import { notFound } from "next/navigation";
   import { getProyecto, getProyectos } from "@/lib/datos/proyectos";
   import { FichaProyecto } from "@/components/trabajos/FichaProyecto";

   export const dynamic = "force-dynamic"; // la compilación no necesita Supabase

   export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
     const p = await getProyecto((await params).slug);
     return p ? { title: p.seo.titulo || p.titulo, description: p.seo.descripcion || p.textos.tarjeta } : {};
   }

   export default async function Pagina({ params }: { params: Promise<{ slug: string }> }) {
     const { slug } = await params;
     const [proyecto, proyectos] = await Promise.all([getProyecto(slug), getProyectos()]);
     if (!proyecto) notFound();
     return <FichaProyecto proyecto={proyecto} proyectos={proyectos} />;
   }
   ```
2. **Componentes** en `src/components/<seccion>/`. Copia la pieza del prototipo D, cambia los datos fijos por props con los tipos de `tipos.ts`, las clases `d-` por `jm-` y `var(--d-…)` por `var(--jm-…)`. Las imágenes, siempre con `img(url, ancho)`, que pide calidad 90.
3. **Textos:** nada fijo en el código que Josep pueda querer cambiar. Si un texto no tiene sitio en su tabla, la página se hace con bloques (punto 3). Los textos en Markdown se pintan con `<Parrafos texto=… />` y los títulos con acento con `<TituloConAcento texto=… />`.
4. **Enlaces:** con `RUTAS`. Al crear tu página, cambia en `src/components/marco/Marco.tsx` el enlace del menú que le toque (hoy apuntan a las anclas de Inicio, `/#trabajos`...).
5. **Movimiento:** solo `transform` y `opacity`, con `CURVA` de `src/styles/movimiento.ts`. La web se mueve siempre como el prototipo D, aunque el sistema pida «reducir movimiento» (decisión de Josep, que lo tiene activado en Windows): `useReducir()` devuelve `false`. Aun así, pasa por `useReducir()` todo lo que se desplaza, por si el repaso de accesibilidad (S20) decide respetarlo. Nunca ocultes contenido con «reducir»: como mucho, que se quede quieto.
6. **Comprueba** en claro y oscuro, en móvil y con escalado 150 %. Después `npm run lint`, `npx tsc --noEmit` y `npm run build`.

## 3. Páginas hechas de bloques

Sobre mí, Recreaciones, Contacto y las páginas que cree Josep son filas de `paginas` con sus `bloques`. Se pintan igual que Inicio:

```tsx
const r = await getPaginaConDatos("sobre-mi");
if (!r) notFound();
return <PaginaBloques bloques={r.pagina.bloques} datos={r.datos} />;
```

`getPaginaConDatos` trae la página y todo lo que pueden leer sus bloques (proyectos, servicios, clientes, ajustes...), en paralelo y desde la caché. El formato de `datos` de cada tipo está en `plan/esquema.md` («Tipos de bloque»). Los bloques nunca dan por hecho que un campo existe: leen con `texto()`, `lista()`, `textos()` y `objeto()` de `src/lib/datos/util.ts`, y si un bloque se queda vacío no se pinta.

**Tipo de bloque nuevo:** migración que añade el valor al enum `tipo_bloque`, tipos regenerados (`src/lib/supabase/tipos.ts`), componente `{ bloque, ancla? }` en `src/components/bloques/`, entrada en `COMPONENTES` de `PaginaBloques.tsx`, nombre en `IndiceLateral.tsx` y fila en la tabla de `plan/esquema.md`.

**Cargar el contenido:** con un script en `scripts/` que genera SQL repetible (todo «si no existe») en `supabase/datos/`, como `scripts/cargar-inicio.mjs`. Se aplica con el MCP de Supabase; si una sentencia grande se queda esperando permiso, no se reintenta: se le deja el archivo a Josep para que lo ejecute en el editor SQL.

## 4. Caché y publicación

- Cada tabla se lee entera una vez y queda en la caché de Next con las etiquetas `contenido` y `tabla:<nombre>`. Caduca sola a los 60 segundos.
- Al publicar desde el panel (tarea D), se llama a `revalidarContenido(["proyectos"])` de `src/lib/datos/revalidar.ts` (comprueba que quien llama es administrador). Sin argumentos vacía todo.
- La web pública solo ve lo publicado (`estado = 'publicado'`).

## 5. Probar sin Supabase (contenedor de Claude)

El contenedor no llega a `supabase.co` ni a las webs de las imágenes. Para ver la página:

1. Saca las filas con el MCP de Supabase a un JSON `{ "tabla": [filas...] }` (si el resultado es muy grande, el MCP lo guarda en un archivo: úsalo).
2. `npm run build` y `JM_DATOS_PRUEBA=/ruta/datos.json npx next start -p 3100`.
3. Captura con Playwright (`/opt/pw-browsers`), `deviceScaleFactor: 1.5`. Las imágenes externas salen rotas en el contenedor (no hay red hacia ImgBB e Imgur); en el PC de Josep se ven.

`JM_DATOS_PRUEBA` nunca se usa en producción.
