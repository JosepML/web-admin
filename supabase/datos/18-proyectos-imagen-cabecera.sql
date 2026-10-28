-- Imagen propia de la cabecera de la ficha de un proyecto, independiente del póster de la tarjeta.
-- Vacía = el póster. Viaja en el borrador: columnas_editables() la recoge.
alter table public.proyectos add column imagen_cabecera_id uuid references public.medios (id) on delete restrict;
create index proyectos_imagen_cabecera_idx on public.proyectos (imagen_cabecera_id);

comment on column public.proyectos.imagen_cabecera_id is 'Imagen de la cabecera de /trabajos/<slug> (y de su carga mientras llega el vídeo). Vacío = imagen_id';
