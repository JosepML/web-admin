# Fase 2: Contenido y textos

**Estado:** En revisión (textos escritos, faltan datos y visto bueno de Josep)
**Depende de:** fase 1. Puede ir en paralelo con las fases 3 y 4.

## Objetivo

Definir qué dice la web y dónde va cada contenido actual: textos nuevos en tono personal para vender los servicios, y un mapa del contenido antiguo a la estructura nueva.

## Entradas

- `legacy/constants.ts` (proyectos y artículos), `legacy/pages/*.tsx` (textos actuales de inicio, contacto, privacidad, Recreaciones)
- Estructura de páginas de abajo y tono de `00-contexto.md`

## Estructura de la web nueva

| Página | Para qué | Contenido |
| --- | --- | --- |
| Inicio | Enganchar y orientar | Reel a pantalla completa, frase personal, 3 servicios, 3 a 6 proyectos destacados, quién soy en corto, opiniones, llamada a contactar |
| Servicios (x3) | Vender cada eje | Dirección de fotografía, Filmmaker, Edición: qué incluye, para quién, cómo trabajo, proyectos relacionados, preguntas frecuentes, botón de contacto |
| Trabajos | Demostrar | Todos los proyectos con filtros por servicio y tipo |
| Ficha de proyecto | Contar el cómo | Vídeo, contexto, rol, proceso, retos, resultado, galería, siguiente proyecto |
| Recreaciones | Mostrar oficio | Las 4 recreaciones con antes/después |
| Sobre mí | Dar la cara | Historia, forma de trabajar, equipo, fotos detrás de cámaras |
| Blog | Atraer y aportar | Artículos con categorías |
| Contacto | Convertir | Formulario guiado (qué necesitas, tipo de proyecto, fecha), WhatsApp, correo |
| Legales y Gracias | Cumplir | Privacidad, cookies, gracias |

Menú: Trabajos · Servicios · Sobre mí · Blog · Contacto, con botón destacado "Hablemos".

## Tareas

- [x] Leer los textos actuales y listar las ideas que se conservan
- [x] Mapa de contenido: cada uno de los 21 proyectos y 3 artículos → página, servicio(s) y tipo nuevos; marcar los destacados propuestos
- [x] Textos de Inicio (frase principal, introducción, bloques)
- [x] Textos de cada servicio: qué incluye, para quién, pasos de trabajo, 4 a 6 preguntas frecuentes (sin precios, decisión de Josep)
- [x] Texto de Sobre mí (pedir a Josep datos de trayectoria si faltan)
- [x] Textos de Contacto, Gracias y llamadas a la acción
- [x] Preguntar a Josep por opiniones de clientes, fotos suyas y reel (ver decisiones pendientes)
- [x] Guardar todo en `plan/contenido/` (un .md por página + `mapa-de-contenido.md`) para que la fase 4 lo cargue en la base de datos

## Entregable

Carpeta `plan/contenido/` con los textos y el mapa, para que Josep los edite o comente.

## Revisión de Josep

- [ ] Aprueba los textos y la estructura del menú

## Registro

**2026-10-20**
- Hecho: leídos `legacy/constants.ts` y `legacy/pages/*`. Escritos todos los textos en `plan/contenido/` (índice en `plan/contenido/README.md`): mapa de contenido, Inicio, los 3 servicios, Sobre mí, Trabajos/ficha/Recreaciones/Blog, Contacto/Gracias/legales/menú/llamadas a la acción.
- Hallazgo: hay 18 proyectos (14 + 4 recreaciones), no 21; el 21 incluía los 3 artículos. No falta contenido.
- Propuesto: servicios Dirección de fotografía / Filmmaker / Edición; tipos Cortometraje, Videoclip, Publicidad, Documental, Eventos, Redes sociales, Recreación; 6 destacados en Inicio; slugs nuevos para 7 proyectos guardando el id antiguo para redirecciones.
- Queda: datos de Josep (lista en `plan/contenido/README.md`: frase principal, WhatsApp, equipo, fotos, opiniones, reel, logos) y su visto bueno a textos y menú.
- 2026-10-20 (segunda ronda): Josep pidió revisar a fondo qué debe tener la web de un DF y filmmaker. Nuevo `plan/contenido/fundamentos.md` y cambios en todo: ficha técnica, fotogramas, detrás de cámaras, premios, menú con Trabajos primero, sin sección de equipo, opiniones visibles, WhatsApp como botón, EP Oscuridad sustituye a EXPÁNDE(TE) (no publicado) en destacados. Pendiente lo que lista `plan/contenido/README.md`.
- Decisiones de Josep: sin precios en la web; los textos deben hablar de él, su mirada y su arte, no vender tarifas. Reescritos los 3 servicios (nueva sección "Mi mirada"), Inicio y Contacto con ese enfoque; quitado el tramo de presupuesto del formulario.
