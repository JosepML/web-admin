-- Título de la sección «Mi mirada» de cada página de servicio (antes estaba fijo en el código). Se edita en el
-- panel y viaja en el borrador como el resto: columnas_editables() la recoge.
alter table public.servicios add column titulo_mirada text not null default '';

comment on column public.servicios.titulo_mirada is 'Título de «Mi mirada» en /servicios/<slug>. Vacío = el nombre del servicio';

update public.servicios set titulo_mirada = 'Decido qué siente quien mira' where slug = 'direccion-de-fotografia' and titulo_mirada = '';
update public.servicios set titulo_mirada = 'Con tu equipo, o de principio a fin' where slug = 'filmmaker' and titulo_mirada = '';
update public.servicios set titulo_mirada = 'Monto con el ritmo por dentro' where slug = 'edicion' and titulo_mirada = '';
