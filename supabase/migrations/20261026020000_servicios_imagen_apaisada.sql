-- Foto apaisada de cada servicio, para las tarjetas «Otro servicio» del pie de cada página de servicio (y donde haga
-- falta un formato ancho). Vacía = la imagen de la tarjeta. Viaja en el borrador: columnas_editables() la recoge.
alter table public.servicios add column imagen_apaisada_id uuid references public.medios (id) on delete restrict;
create index servicios_imagen_apaisada_idx on public.servicios (imagen_apaisada_id);

comment on column public.servicios.imagen_apaisada_id is 'Foto en formato ancho del servicio (tarjetas «Otro servicio»). Vacío = imagen_id';
