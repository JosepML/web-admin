-- Frase final de cada ficha (la conclusión con doble tipografía; la cursiva va entre *asteriscos*).
-- Viaja en el borrador y se publica como el resto de campos: columnas_editables() la recoge sola.
alter table public.proyectos add column frase text not null default '';

comment on column public.proyectos.frase is 'Frase final de la ficha, con *cursiva* para la palabra de acento';
