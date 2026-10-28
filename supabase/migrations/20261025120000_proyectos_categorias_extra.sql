-- Categorías extra de un proyecto: además de su tipo, puede salir en otras categorías (por ejemplo, un evento
-- deportivo que también es contenido para redes). Son ids de tipos_proyecto. Las páginas de especialidad y los
-- filtros de Trabajos cuentan un proyecto si su tipo o una de estas categorías coincide.
-- Viaja en el borrador como el resto: columnas_editables() la recoge.
alter table public.proyectos add column categorias_extra uuid[] not null default '{}';

comment on column public.proyectos.categorias_extra is 'Otros tipos (ids de tipos_proyecto) en los que también sale el proyecto';

-- Tipos nuevos (2026-10-25, pedidos por Josep)
insert into public.tipos_proyecto (slug, nombre, orden)
select v.slug, v.nombre, v.orden from (values ('corporativo', 'Corporativo', 10), ('visuales-e-ia', 'Visuales e IA', 11)) as v(slug, nombre, orden)
where not exists (select 1 from public.tipos_proyecto t where t.slug = v.slug);
