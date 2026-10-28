-- Proyectos hechos bajo el sello de JUNO Media (Josep trabaja en sinergia con JUNO Media, no forma parte de
-- ella). La tarjeta y la ficha lo marcan. Viaja en el borrador como el resto: columnas_editables() la recoge.
alter table public.proyectos add column con_juno boolean not null default false;

comment on column public.proyectos.con_juno is 'Hecho bajo el sello de JUNO Media: sale marcado en la tarjeta y en la ficha';

update public.proyectos set con_juno = true where productora ilike '%JUNO Media%';
