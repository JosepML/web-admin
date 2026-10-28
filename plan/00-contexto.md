# Contexto común (leer en cada chat)

## Qué queremos

Una web nueva para **Josep Mira Lozano**: director de fotografía y filmmaker (ejes principales) y editor. Debe ser una mezcla de **página de venta de servicios audiovisuales y portfolio**, no solo portfolio.

- **Tono:** personal y cálido, en primera persona. Nada empresarial.
- **Estética:** cinematográfica, bonita, elegante. Fondo negro cálido, acento tungsteno, tipografía editorial, formato panorámico.
- **Animaciones:** que la web se sienta dinámica y audiovisual, con animaciones visualmente interesantes pero nunca molestas. Respetar "reducir movimiento" y simplificar en móvil.
- **Viva y editable:** todo el contenido sale de una base de datos que Josep edita desde un panel privado (crear artículos, proyectos, secciones y páginas) sin tocar código.
- **No se pierde nada:** todo el contenido de la web actual (21 proyectos, 3 artículos, Recreaciones, páginas fijas, imágenes) se migra.

## Reglas de trabajo (decididas por Josep)

- La web publicada **no se toca** hasta el lanzamiento. Se publica todo de una vez al final.
- Se trabaja **en local**: Josep ve la web en `http://localhost:3000` en su PC. No quiere registrarse en Vercel durante el desarrollo.
- Cada fase se ejecuta en un chat distinto, leyendo estos archivos (ver `README.md`).

## Datos técnicos

| Qué | Valor |
| --- | --- |
| Repositorio | JosepML/JosepML (GitHub) |
| Rama de trabajo | `claude/project-thread-9vb26d` |
| Web publicada actual | `master` → GitHub Pages, `josepml.github.io/JosepML` (React + Vite, HashRouter) |
| Código de la web antigua | carpeta `legacy/` en la rama de trabajo (contenido en `legacy/constants.ts`) |
| Web nueva | Next.js 15 (App Router) + TypeScript + Tailwind 4 + Motion + Lenis |
| Base de datos | Supabase, proyecto "Web Josep Mira", id `oadmqwtnxpbotxcgzaoo`, región eu-west-3 |
| Claves públicas | en `.env` (solo URL y clave publicable; los secretos irían en `.env.local`, que no se sube) |
| Proyecto Supabase prohibido | "JML Studio" (`jgolxrpxyuxpqqdyikwb`): app de facturación de Josep, **no tocar** |
| Copia local en el PC de Josep | `C:\Users\Josep\Documents\WEB JOSEP MIRA` (Windows, Node 26, git 2.54) |
| Arrancar en local | `npm install` y `npm run dev` en esa carpeta |
| Google Analytics 4 | `G-RKBDRMVL1J` (mantener el mismo ID) |
| Formulario actual | Formspree (se sustituirá por guardado en la base de datos + aviso por correo) |
| Redes | Instagram @josepmiralozano, LinkedIn, YouTube |

Nota para Claude en la nube: el contenedor en la nube no puede conectar con `*.supabase.co` (el proxy lo bloquea). Para leer o escribir en la base de datos usa las herramientas de Supabase (MCP); la conexión real de la web se comprueba en el PC de Josep.

## Decisiones tomadas

- 2026-10-20: Plan de 7 fases aprobado.
- 2026-10-20: Previsualización en local en el PC de Josep en vez de Vercel. Vercel (u otro alojamiento) solo para el lanzamiento.
- 2026-10-20: Ejecución por fases en chats distintos con estos archivos .md.
- 2026-10-20: **Sin precios en la web.** Los presupuestos no son fijos, nacen de cada proyecto. La web es un escaparate de Josep (su mirada, oficio, gusto y arte), no un catálogo: los textos hablan desde ahí. La tabla `servicios` no lleva campo de precio y el formulario no pregunta tramos de presupuesto.
- 2026-10-20: Fundamentos de la web revisados (`plan/contenido/fundamentos.md`): el trabajo primero (menú empieza por Trabajos), ficha técnica por proyecto (dirección, productora, mi papel, cámara), galería de fotogramas, detrás de cámaras, premios y laureles visibles, opiniones visibles. **Sin sección de equipo**: la cámara va en la ficha de cada proyecto y lo que falte se alquila.
- 2026-10-20: WhatsApp +34 618 867 115 como botón (no en texto). Correo josep.mira@gmail.com. Reel provisional: "Y el año que viene, ¿qué?" hasta que Josep monte uno nuevo.
- 2026-10-20 (fase 2, propuesta pendiente de visto bueno): el contenido antiguo son 18 proyectos y 3 artículos. Clasificación por servicio (Dirección de fotografía, Filmmaker, Edición) y por tipo (Cortometraje, Videoclip, Publicidad, Documental, Eventos, Redes sociales, Recreación). Cada proyecto guarda su id antiguo para redirigir enlaces viejos. Detalle en `plan/contenido/mapa-de-contenido.md`.

- 2026-10-20 (fase 3): el reel y los clips de las tarjetas serán archivos de vídeo propios cortos (no YouTube); la tabla `proyectos` necesita `clip_url` además del vídeo completo.
- 2026-10-20 (fase 3): Josep descarta los prototipos A, B y C (muy estáticos, con aire de plantilla y lejos de su web anterior). Nueva dirección **D · Cristal**: la estética de la web antigua (Inter gruesa, rojo `#e50914`, cristal, esquinas redondas, modo claro/oscuro) llevada a un acabado tipo Apple, dinámica, cálida y personal, con más peso de venta. Las páginas se construyen con **bloques** editables (tabla `bloques`: pagina, orden, tipo, visible, datos jsonb) que Josep reordena, oculta, edita y crea desde el panel. Detalle en `fase-3-direccion-visual.md`.
- 2026-10-20: **Experiencia: "más de 9 años"** (no 15; primero se dijo 7 y Josep lo dejó en 9 para que cuadre con YouTube y el contenido). Se destacan sus canales de YouTube, "Del Fan, Para el Fan" (donde empezó) y "Josep Mira" (recreaciones), de donde viene buena parte de esa experiencia. No se presume del número de proyectos. Cifras de suscriptores pendientes de Josep.
- 2026-10-20 (fase 3): cada servicio tiene su página con sus proyectos (`/servicios/<slug>`); los filtros de Trabajos usan la selección y el orden de "Destacados por servicio" de `mapa-de-contenido.md`.
- 2026-10-20 (fase 3): **Montserrat** como letra base de la web (Instrument Serif cursiva solo para palabras de acento). La percusión no se destaca.
- 2026-10-20: clientes en dos filas de logos (Disney, Star Wars, Kinepolis, Consell Valencià de la Joventut, Ayuntamiento de l'Alfàs del Pi, Ocisport, Mediterra Cinema, Cero Coma, Dreamore, Kymera Producciones) y apartado propio **"Trabajo en sinergia con JUNO Media"**, sin decir que Josep es parte de JUNO, con sus clientes comunes (ForecourtTech, Arkano, SOM Events, Albir Confort, Mapache Events). La fase 4 necesita tabla `clientes` (nombre, logo, fila, orden, `con_juno`).
- 2026-10-20: el vídeo de fondo de la portada debe ser un archivo propio (mp4 corto, sin sonido), no YouTube: el reproductor de YouTube enseña controles. Pendiente del archivo o del permiso de Josep para descargarlo de su canal.
- 2026-10-20: el PC de Josep tiene desactivados los "Efectos de animación" de Windows, y el navegador lo trata como "reducir movimiento". Los prototipos muestran las animaciones igualmente (interruptor en la barra inferior); la web final respetará el ajuste de cada visitante.
- 2026-10-22: **Josep aprueba D · Cristal** y la fase 3 queda cerrada. Tokens de diseño en `src/styles/tokens.css` y curvas en `src/styles/movimiento.ts`; piezas reutilizables en `fase-3-direccion-visual.md`. Orden de trabajo: `hoja-de-ruta.md`.

## Decisiones pendientes de Josep

| Decisión | Por defecto si no dice nada | Fase |
| --- | --- | --- |
| Dominio propio (p. ej. josepmira.com) | Usar uno propio; comprarlo antes de lanzar si no lo tiene | 7 |
| Plan de pago de Vercel para uso comercial (unos 20 USD/mes, confirmar precio) | Sí, solo desde el lanzamiento | 7 |
| Fotos de Josep trabajando para "Sobre mí" | Usar las que tenga; si no, planificar sesión | 2 |
| Idiomas | Solo español, base de datos preparada para añadir más | 4 |
