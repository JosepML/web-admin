-- Fotos que pasan en la cabecera de cada página de servicio (antes eran los pósteres de sus primeros proyectos).
-- Lista `[{ "medio": <id de medios>, "pie": "" }]`, como la galería de un proyecto. Vacía = como hasta ahora.
-- Viaja en el borrador como el resto: columnas_editables() la recoge.
alter table public.servicios add column fotos_cabecera jsonb not null default '[]'::jsonb;

comment on column public.servicios.fotos_cabecera is 'Fotos del carrusel de la cabecera de /servicios/<slug>. Vacío = imagen propia y pósteres de sus primeros proyectos';
