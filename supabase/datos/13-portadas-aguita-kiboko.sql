-- Agüita de Coco: portada propia con el logo entero (el banner 5x1 salía recortado en la cabecera) + Kiboko: la cabecera
-- reproduce el vídeo de YouTube desde el segundo 110 (antes el 30, que caía en los créditos).
update public.proyectos set imagen_id = coalesce((select id from public.medios where titulo = 'aguita-de-coco-portada-01' and tipo = 'imagen' order by creado_en desc limit 1), imagen_id)
where idioma = 'es' and slug = 'aguita-de-coco-visuales';

update public.proyectos set youtube_inicio = 110 where idioma = 'es' and slug = 'kiboko';
