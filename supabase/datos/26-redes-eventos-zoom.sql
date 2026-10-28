-- Registro (2026-10-26), ya aplicado en la base de datos:
-- 1) Eventos deportivos: la página de la especialidad también muestra Corporativo.
update public.bloques b set datos = b.datos || '{"tipos": ["eventos", "corporativo"]}'::jsonb from public.paginas p where p.id = b.pagina_id and p.slug = 'filmmaker-eventos-deportivos' and b.tipo = 'trabajos';
-- 2) Lo que grabo (Inicio): Bodas, la última tarjeta.
update public.bloques b set datos = jsonb_set(b.datos, '{piezas}', (select jsonb_agg(x order by (case when x->>'href' like '%/bodas' then 1 else 0 end), ord) from jsonb_array_elements(b.datos->'piezas') with ordinality t(x, ord))) from public.paginas p where p.id = b.pagina_id and p.slug = 'inicio' and b.tipo = 'filmmaker';
-- 3) Créditos: grabado por Noelia Fluxà, edición de Josep (Englobe, Lavandería de Grupo LON y Albir Confort, reels).
update public.proyectos set mi_papel = 'Los grabó Noelia Fluxà. Yo me encargué de la edición.' where slug in ('englobe-evento-redes', 'lavanderia-grupo-lon', 'albir-confort-reels');
-- 4) Proyecto nuevo «Albir Confort, reels para redes»: supabase/datos/15-albir-reels.sql (en borrador; publicar desde el panel).
-- 5) Trabajos → Filmmaker: «Eventos y corporativo» en un solo filtro, y Bodas el último (datos.filtros.filmmaker del bloque de /trabajos).
update public.bloques b set datos = jsonb_set(b.datos, '{filtros,filmmaker}', '[{"nombre":"Publicidad","tipos":["publicidad"]},{"nombre":"Videoclips","tipos":["videoclip"]},{"nombre":"Eventos y corporativo","tipos":["eventos","corporativo"]},{"nombre":"Aftermovies y conciertos","tipos":["conciertos"]},{"nombre":"Redes sociales","tipos":["redes-sociales"]},{"nombre":"Bodas","tipos":["bodas"]}]'::jsonb) from public.paginas p where p.id = b.pagina_id and p.slug = 'trabajos' and p.idioma = 'es' and b.orden = 0;
