-- Vídeos adaptados para la Portada (2026-10-28):
-- 1) Versión horizontal (16:9, 1080p, 85.7 MB): y-el-ano-que-viene-que/portada-horizontal.mp4
-- 2) Versión vertical (9:16, 1080x1920, 84.0 MB): y-el-ano-que-viene-que/portada-vertical.mp4
-- 3) Botón «Ver reel»: reproduce el vídeo completo de Cloudflare R2 (y-el-ano-que-viene-que/y-el-ano-que-viene-que-completo.mp4)

begin;

-- Insertar o actualizar los medios en Cloudflare R2
insert into public.medios (url_origen, tipo, mime, bytes, titulo, texto_alternativo)
values 
  ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/y-el-ano-que-viene-que/portada-horizontal.mp4', 'video', 'video/mp4', 89887471, 'Portada horizontal (16:9)', 'Vídeo de cabecera en horizontal'),
  ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/y-el-ano-que-viene-que/portada-vertical.mp4', 'video', 'video/mp4', 88057374, 'Portada vertical (9:16)', 'Vídeo de cabecera en vertical para móvil')
on conflict (url_origen) where url_origen is not null do update set
  bytes = excluded.bytes,
  titulo = excluded.titulo;

-- Actualizar el bloque portada de la página de inicio
update public.bloques
set datos = jsonb_set(
  jsonb_set(
    datos,
    '{video,medio}',
    to_jsonb((select id::text from public.medios where url_origen = 'https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/y-el-ano-que-viene-que/portada-horizontal.mp4'))
  ),
  '{video,vertical}',
  to_jsonb((select id::text from public.medios where url_origen = 'https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/y-el-ano-que-viene-que/portada-vertical.mp4'))
)
where tipo = 'portada'
  and pagina_id in (select id from public.paginas where slug = 'inicio' and idioma = 'es');

commit;
