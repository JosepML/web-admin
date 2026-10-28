-- Portadas de los proyectos nuevos, elegidas a ojo para el banner ancho de la ficha (2026-10-25).
-- Va DESPUÉS de 11-proyectos-nuevos.sql (si se repite el 11, hay que repetir este).
-- Antes: subir a la biblioteca aguita-de-coco-banner-01..04.jpg (de D:\VIDEOS WEB\_WEB\SUBIR2).
-- Si una foto no está en la biblioteca, esa portada se deja como estaba.

update public.proyectos p
set imagen_id = coalesce((select id from public.medios m where m.titulo = d.foto and m.tipo = 'imagen' order by m.creado_en desc limit 1), p.imagen_id)
from (values
  ('flama-aftermovie', 'flama-aftermovie-03'),
  ('atavicas-trailer-obra-de-teatro', 'atavicas-trailer-obra-de-teatro-06'),
  ('flama-benissa-video-oficial', 'flama-benissa-video-oficial-06'),
  ('otra-movida-video-oficial', 'otra-movida-video-oficial-08'),
  ('madison-video-oficial', 'madison-video-oficial-01'),
  ('consell-valencia-joventut-charla', 'consell-valencia-joventut-charla-06'),
  ('flama-la-nucia-video-oficial', 'flama-la-nucia-video-oficial-04'),
  ('zorom-ia', 'zorom-ia-02'),
  ('albir-confort-real-estate', 'albir-confort-real-estate-01'),
  ('diferens-encuentro-2025', 'diferens-encuentro-2025-02'),
  ('flama-contenido-cinematografico-ia', 'flama-contenido-cinematografico-ia-01'),
  ('aguita-de-coco-visuales', 'aguita-de-coco-banner-01')
) as d(slug, foto)
where p.idioma = 'es' and p.slug = d.slug;

-- Agüita de Coco: los banners 5x1 entran al principio de la galería (si están subidos)
update public.proyectos p
set galeria = coalesce((
  select jsonb_agg(jsonb_build_object('medio', m.id, 'pie', '') order by m.titulo)
  from public.medios m where m.titulo like 'aguita-de-coco-banner-%' and m.tipo = 'imagen'), '[]'::jsonb) || p.galeria
where p.idioma = 'es' and p.slug = 'aguita-de-coco-visuales'
  and not exists (select 1 from public.medios m where m.id::text in (select e->>'medio' from jsonb_array_elements(p.galeria) e) and m.titulo like 'aguita-de-coco-banner-%');

-- Kiboko: la portada pasa del fotograma de créditos a la persiana con el grafiti «Kiboko» (3.ª foto de su galería)
update public.proyectos set imagen_id = 'a4763ee8-1608-475a-a9dc-0b37df4cfc30'
where idioma = 'es' and slug = 'kiboko' and exists (select 1 from public.medios where id = 'a4763ee8-1608-475a-a9dc-0b37df4cfc30');
