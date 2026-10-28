-- Fotos que pasan en la cabecera de cada página de servicio (antes eran los pósteres de sus primeros proyectos).
-- Lista `[{ "medio": <id de medios>, "pie": "" }]`, como la galería de un proyecto. Vacía = como hasta ahora.
-- Viaja en el borrador como el resto: columnas_editables() la recoge.
alter table public.servicios add column fotos_cabecera jsonb not null default '[]'::jsonb;

comment on column public.servicios.fotos_cabecera is 'Fotos del carrusel de la cabecera de /servicios/<slug>. Vacío = imagen propia y pósteres de sus primeros proyectos';

-- Rellena la lista con las fotos que pasan ahora en cada cabecera (la imagen propia y los pósteres de sus primeros
-- proyectos publicados, en su orden), para poder quitar, añadir y ordenar desde el panel. Solo si está vacía.
update public.servicios s
set fotos_cabecera = coalesce((
  select jsonb_agg(jsonb_build_object('medio', f.medio, 'pie', '') order by f.n)
  from (
    select x.medio, row_number() over (order by x.o, x.d desc, x.so, x.po) as n
    from (
      select s.imagen_id::text as medio, 0 as o, false as d, 0 as so, 0 as po where s.imagen_id is not null
      union all
      select coalesce(p.imagen_id::text, p.galeria -> 0 ->> 'medio'), 1, ps.destacado, ps.orden, p.orden
      from public.proyecto_servicios ps
      join public.proyectos p on p.id = ps.proyecto_id and p.estado = 'publicado'
      where ps.servicio_id = s.id and coalesce(p.imagen_id::text, p.galeria -> 0 ->> 'medio') is not null
    ) x
    order by x.o, x.d desc, x.so, x.po
    limit 4
  ) f
), '[]'::jsonb)
where s.idioma = 'es' and s.fotos_cabecera = '[]'::jsonb;
