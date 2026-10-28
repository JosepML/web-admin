-- Página «trabajos»: solo da la cabecera y el SEO del listado /trabajos (los proyectos salen de su tabla).
-- Escrito a mano; repetible.
begin;

insert into public.paginas (slug, titulo, seo_titulo, seo_descripcion, estado, publicado_en) values ('trabajos', 'Trabajos',
  'Trabajos · Josep Mira Lozano',
  'Cortometrajes, videoclips, spots, documentales, eventos y contenido para redes: dirección de fotografía, grabación y montaje de Josep Mira Lozano.',
  'publicado', now())
on conflict (idioma, slug) do nothing;

insert into public.bloques (pagina_id, orden, tipo, visible, datos)
select p.id, 0, 'texto', true, '{"antetitulo":"Trabajos","titulo":"Historias que he ayudado a *contar*","texto":"Cortos, videoclips, spots, documentales, eventos y redes. Filtra por servicio o por tipo."}'::jsonb
from public.paginas p
where p.slug = 'trabajos' and p.idioma = 'es'
  and not exists (select 1 from public.bloques x where x.pagina_id = p.id);

commit;
