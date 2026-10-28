-- Reels para redes (2026-10-26): el reel del Consell Valencià pasa al vídeo vertical (subido a R2: consell-valencia-joventut-charla/videoresum-consell-vertical-v2.mp4, 93 MB).
-- Ya aplicado en la base de datos; este archivo es el registro. El id del medio es el que se creó entonces.
insert into public.medios (url_origen, tipo, mime, bytes, titulo, texto_alternativo)
values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/consell-valencia-joventut-charla/videoresum-consell-vertical-v2.mp4', 'video', 'video/mp4', 97613730, 'consell-valencia-joventut-charla · Vídeo resumen vertical', '');
-- Medio ya creado: 8b9aba90-5563-478e-bb7f-51582c799f60
update public.proyectos set videos = jsonb_set(videos, '{0}', '{"tipo":"archivo","medio":"8b9aba90-5563-478e-bb7f-51582c799f60","titulo":"Reels para el Consell Valencià de la Joventut","vertical":true}'::jsonb)
where idioma = 'es' and slug = 'reels-redes-sociales';
