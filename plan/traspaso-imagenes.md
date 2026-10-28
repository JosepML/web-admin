# Traspaso: imágenes de la web

Hilo «Imágenes y fotos de la web», 2026-10-22. Sigue la política de imágenes de `plan/repaso-final.md` (sección 4): primero material propio de Josep; fotogramas de películas solo para el «antes» de las recreaciones; bancos libres solo para artículos y si no hay nada propio. Nada se publica.

## Hecho en este hilo

- **Galerías de las fichas.** El prototipo solo usaba el póster en 10 fichas. Se han recuperado de la web antigua (`legacy/constants.ts`) los fotogramas que ya tenía cada proyecto. Ahora: 100 Baladas 6, EP Oscuridad 7, Kiboko 4, EXPÁNDE(TE) 7, Sin Tiempo 5, El Viajero 7, Sin Piedad 4, Conciertos 4, Eventos deportivos 5, Bodas 7. Ya estaban bien: Y el año que viene 3, Lovva 5, El Cirujano 2.
- **Artículos.** Cada uno tiene `imagen_portada` (y su texto alternativo) en la cabecera del `.md` e imágenes en el cuerpo con pie, en Markdown (`![alt](url "pie")`). Todas son fotogramas propios:
  - Luz: portada El Cirujano; cuerpo El Cirujano, EP Oscuridad, Lovva y la recreación de El Padrino (una por ejemplo del texto).
  - IA: portada Star Wars sin CGI; cuerpo la maqueta de la Ciudad Nube.
  - No ha hecho falta ninguna imagen de internet. La tarea S4 debe pasar estas imágenes a `medios` y al documento del editor; S9 las pinta.

## Falta (necesita el PC de Josep)

El contenedor de los hilos no llega a YouTube, Imgur, ImgBB ni Wikimedia (el proxy responde 403), así que esto se hace con una sesión de control remoto en el PC de Josep (carpeta `C:\Users\Josep\Documents\WEB JOSEP MIRA`):

1. **Inventario de `C:\Users\Josep\Documents\WEB\FOTOS WEB`** en `plan/inventario-fotos-web.md`.
2. **Sobre mí:** 1 retrato y hasta 3 fotos de rodaje, solo de Josep, en `public/medios/sobre-mi/` (JPEG q92, lado largo ≤ 2400 px, sin GPS). Si no hay, se le piden. Nunca de internet.
3. **Fotogramas de sus vídeos de YouTube** (con yt-dlp y ffmpeg, JPEG q92, 1920 px o 2560 si es 4K):
   - El Cirujano (`9uyjeDnqixo`): 4 fotogramas en alta, `public/medios/el-cirujano/01-04.jpg`. Resuelve el tercer fotograma perdido y la baja resolución.
   - Reels (`rUv-Ql7NxCQ`, `8mUizSJ357s`; no `s8m1qUtDeNE`, de Disney, sin permiso): 4 fotogramas verticales en `public/medios/reels/`. **Sustituyen el póster actual, que es una imagen de `rbgescuela.com` y no es de Josep.**
   - «Antes» y «después» de las recreaciones, sacados de sus propios vídeos, donde suele salir el plano original: Nosferatu `3UuwHJLk60A`, El Padrino `WnSCN4aXDKA`, Star Wars sin CGI `-T8Y-ESHRTs`. Falta el ID del vídeo de Luke y Vader (en la web antigua no está). Si no sale el original limpio, buscarlo en FilmGrab (film-grab.com) o en Wikimedia Commons y apuntar fuente y licencia en `plan/repaso-final.md`, sección 4.
4. **Comprobar las URLs** de `datos.ts` y de los artículos (que respondan y que tengan al menos 1280 px de ancho).
5. Cambiar `datos.ts` para usar los archivos nuevos, comprobaciones, commit, push y dejar arrancada su versión local.

Las instrucciones completas para la sesión remota están en el registro de este hilo; son estos mismos pasos.

## Para la tarea S2

- Todas las imágenes externas de `datos.ts` y de los artículos tienen que acabar en el bucket `medios` (ninguna desde ImgBB, Imgur, Postimg ni iili).
- Las de Bodas llevan el nombre de los novios en la URL: renombrarlas al subirlas (`bodas-01.jpg`...).
- Las de `public/medios/` (si las deja la sesión remota) también se suben al bucket y se borran del repositorio cuando la web lea de `medios`.
