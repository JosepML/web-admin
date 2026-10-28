# Traspaso del proyecto · Web nueva de Josep Mira Lozano

Actualizado el 2026-10-27. Resumen unificado del proyecto, reglas de Josep, estado del código y siguientes pasos.

---

## 1. Reglas fijas de Josep (no negociables)

- **Rama de trabajo:** `claude/project-thread-9vb26d` del repositorio `JosepML/JosepML`. **Nunca** tocar `master` ni fusionar/marcar como lista la PR #1 («NO FUSIONAR hasta la fase 7») sin orden expresa de Josep.
- **Base de datos:** proyecto de Supabase `oadmqwtnxpbotxcgzaoo` («Web Josep Mira»). **Prohibido** tocar el proyecto `jgolxrpxyuxpqqdyikwb` («JML Studio», app de facturación).
- **Voz y contenido:**
  - Textos cortos, cálidos y en primera persona. Sin fórmulas de IA («no es X: es Y»).
  - **Sin precios ni tramos de presupuesto** en ninguna parte de la web ni del formulario.
  - **Sin sección de equipo** (la cámara va en la ficha técnica de cada proyecto).
  - **Nunca inventar** premios, cifras, clientes ni nombres de festivales.
  - Con JUNO Media se habla de **sinergia / colaboración** (`/juno-media`), nunca diciendo que Josep forma parte de la empresa.
- **Diseño y movimiento:**
  - Dirección visual **D · Cristal** (`src/styles/tokens.css`, `src/styles/movimiento.ts`).
  - Tipografía **Montserrat** para todo el texto e **Instrument Serif** cursiva solo para la palabra de acento (`*palabra*`).
  - **Las animaciones van siempre activadas:** `useReducir()` en `src/components/comun/hooks.ts` devuelve siempre `false` porque Josep tiene «reducir movimiento» activado en Windows.
- **Flujo de trabajo:**
  - Antes de cada commit: `npm run lint`, `npx tsc --noEmit` y `npm run build`.
  - Commits pequeños en español.
  - En el PC de Josep, para ver los cambios compilados se ejecuta `scripts\iniciar-prototipos.bat`.

---

## 2. Estado de las tareas

| Tarea | Qué incluye | Estado |
| --- | --- | --- |
| **A** | Dirección visual D · Cristal, tokens (`src/styles/tokens.css`) y curvas (`src/styles/movimiento.ts`) | Hecha |
| **B** | Esquema SQL, políticas RLS, función `es_admin()`, bucket `medios` y tipos (`src/lib/supabase/tipos.ts`) | Hecha |
| **C** | Marco público, bloques dinámicos, Inicio conectado a Supabase y `plan/patron-paginas.md` | Hecha |
| **D** | Acceso `/admin/entrar`, middleware, «Editar página» en vivo, panel `/admin` y `plan/patron-panel.md` | Hecha |
| **E, S1, S3, S4** | Textos y carga de los 18 proyectos iniciales, 29 proyectos nuevos (`plan/contenido/proyectos-nuevos/`), 2 artículos, servicios, clientes, opiniones y canales | Hecha |
| **S2** | Migración de las 95 imágenes externas al bucket `medios/migradas/` | Hecha |
| **S5–S9** | `/trabajos`, `/trabajos/[slug]`, `/servicios/[slug]`, `/servicios/[slug]/[especialidad]`, `/recreaciones`, `/sobre-mi`, `/juno-media`, `/blog` y `/blog/[slug]` | Hecha |
| **S10** | `/contacto` y `/gracias`, guardado en `mensajes` + aviso por correo con Formspree (`https://formspree.io/f/mrblvlpb`) | Hecha |
| **S11** | `/aviso-legal`, `/privacidad`, `/cookies`, banner de cookies AEPD y GA4 (`G-RKBDRMVL1J`) tras aceptar | Hecha (datos legales de Josep incorporados en `src/lib/datos/legales.ts`) |
| **S12** | Metadatos SEO, Schema.org (`src/components/seo/JsonLd.tsx`), `/sitemap.xml`, `/robots.txt` y `/opengraph-image` | Hecha |
| **S13** | Redirecciones de rutas antiguas con `#` (`RedireccionAntigua.tsx`), sin `#` (`next.config.ts`) y por `id_antiguo` | Hecha |
| **S14–S17** | Panel completo: artículos, servicios, clientes, opiniones, canales, ajustes, biblioteca (recorte, foco, carpetas tipo Drive) y mensajes | Hecha |
| **S18** | Script de copia de seguridad en `copias-seguridad/` (`scripts/copia-seguridad.mjs` y `scripts/hacer-copia-seguridad.bat`) | Hecha |
| **S19** | Guía completa del panel en `plan/guia-del-panel.md` | Hecha |
| **S20** | Repaso final de accesibilidad, teclado, claro/oscuro, ausencia de textos `"Pendiente"` y compilación limpia | Hecha |
| **F** | Lanzamiento (`plan/fase-7-lanzamiento.md`) | En espera de orden de Josep |
