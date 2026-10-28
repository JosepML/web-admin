# Plan hasta la publicación

Actualizado el 2026-10-27. Estado real de todo lo necesario antes del lanzamiento (Fase 7).

## Dónde estamos

- **Hecho en código y base de datos:**
  - Diseño **D · Cristal** aprobado (`src/styles/tokens.css`, `src/styles/movimiento.ts`).
  - Base de datos y seguridad RLS (`oadmqwtnxpbotxcgzaoo`), 16 migraciones en `supabase/migrations/`.
  - **S1, S2, S3, S4, O1 y P:** 18 proyectos iniciales, 29 fichas de proyectos nuevos (`plan/contenido/proyectos-nuevos/`), 2 artículos y las 95 imágenes externas migradas al bucket `medios/migradas/`.
  - **C y S5–S10:** Todas las páginas públicas (`/`, `/trabajos`, `/trabajos/[slug]`, `/servicios/[slug]`, `/servicios/[slug]/[especialidad]`, `/recreaciones`, `/sobre-mi`, `/juno-media`, `/blog`, `/blog/[slug]`, `/contacto` con Formspree + guardado en `mensajes`, y `/gracias`).
  - **D y S14–S17:** Modo «Editar página» en vivo y panel `/admin` completo (Resumen, Páginas, Proyectos, Artículos, Servicios, Clientes, Opiniones, Canales, Biblioteca con recorte, foco y carpetas tipo Drive, Mensajes y Ajustes).
  - **S11:** Páginas legales (`/aviso-legal`, `/privacidad`, `/cookies`), enlace en el pie y en el formulario, banner de consentimiento de cookies conforme a la Guía AEPD y carga de Google Analytics 4 (`G-RKBDRMVL1J`) únicamente tras aceptar. Los datos identificativos del titular están incorporados en `src/lib/datos/legales.ts`.
  - **S12:** SEO completo: metadatos por página/ficha, Schema.org JSON-LD (`Person`, `ProfessionalService`, `Service`, `FAQPage`, `CreativeWork`, `BlogPosting`), `/sitemap.xml`, `/robots.txt` e imagen OpenGraph (`/opengraph-image`).
  - **S13:** Redirecciones de las direcciones antiguas con hash (`/#/project/<id>`, `/#/portfolio`, `/#about`, etc.) en `RedireccionAntigua.tsx`, redirecciones sin `#` en `next.config.ts` y resolución por `id_antiguo` en `/trabajos/[slug]` y `/blog/[slug]`.
  - **S18 y S19:** Script de copia de seguridad local (`scripts/copia-seguridad.mjs` y `scripts/hacer-copia-seguridad.bat` → carpeta `copias-seguridad/`) y guía completa del panel en `plan/guia-del-panel.md`.
  - **S20:** Repaso final de accesibilidad (enlace «Saltar al contenido», cierre de menú móvil con `Escape`, aparición del menú al recibir foco de teclado, ningún texto `"Pendiente"` visible en fichas) y compilación limpia (`lint`, `tsc --noEmit` y `build`).

## Lo único que falta antes de lanzar (Fase 7)

1. **Dominio web definitivo:** comprar o configurar el dominio (p. ej. `josepmira.com`) y asignarlo en `src/lib/datos/legales.ts` y en las variables de entorno de producción.
2. **Orden expresa de Josep para ejecutar la Fase 7 (`plan/fase-7-lanzamiento.md`):**
   - Definir `NEXT_PUBLIC_SITE_URL` y `NEXT_PUBLIC_INDEXAR=1` en el alojamiento de producción.
   - Asociar dominio propio al bucket de vídeos de Cloudflare R2 si se desea sustituir `r2.dev`.
   - Etiquetar la web antigua (`web-antigua`) y publicar con el visto bueno de Josep.
