-- Filtros de /trabajos por servicio (pedido de Josep, 2026-10-23): cada servicio enseña sus propias
-- categorías. Bodas y Conciertos dejan de ser «Eventos» y pasan a tener su tipo. Escrito a mano; repetible.
begin;

insert into public.tipos_proyecto (slug, nombre, en_listado_general, orden) values
  ('conciertos', 'Aftermovies y conciertos', true, 6),
  ('bodas', 'Bodas', true, 7)
on conflict (idioma, slug) do nothing;
update public.tipos_proyecto set orden = 8 where slug = 'redes-sociales';
update public.tipos_proyecto set orden = 9 where slug = 'recreacion';

update public.proyectos set tipo_id = (select id from public.tipos_proyecto where slug = 'conciertos' and idioma = 'es') where slug = 'conciertos';
update public.proyectos set tipo_id = (select id from public.tipos_proyecto where slug = 'bodas' and idioma = 'es') where slug = 'bodas';

-- Categorías de cada servicio («todos»: sin servicio elegido). Una categoría agrupa uno o más tipos;
-- las que no tienen proyectos no salen.
update public.bloques b set datos = b.datos || $json${"filtros": {
  "todos": [
    { "nombre": "Cortometrajes y documental", "tipos": ["cortometraje", "documental"] },
    { "nombre": "Videoclips", "tipos": ["videoclip"] },
    { "nombre": "Publicidad", "tipos": ["publicidad"] },
    { "nombre": "Eventos", "tipos": ["eventos"] },
    { "nombre": "Aftermovies y conciertos", "tipos": ["conciertos"] },
    { "nombre": "Bodas", "tipos": ["bodas"] },
    { "nombre": "Redes sociales", "tipos": ["redes-sociales"] }
  ],
  "direccion-de-fotografia": [
    { "nombre": "Cortometrajes y documental", "tipos": ["cortometraje", "documental"] },
    { "nombre": "Videoclips", "tipos": ["videoclip"] },
    { "nombre": "Publicidad", "tipos": ["publicidad"] }
  ],
  "filmmaker": [
    { "nombre": "Publicidad", "tipos": ["publicidad"] },
    { "nombre": "Videoclips", "tipos": ["videoclip"] },
    { "nombre": "Eventos", "tipos": ["eventos"] },
    { "nombre": "Aftermovies y conciertos", "tipos": ["conciertos"] },
    { "nombre": "Bodas", "tipos": ["bodas"] },
    { "nombre": "Redes sociales", "tipos": ["redes-sociales"] }
  ],
  "edicion": [
    { "nombre": "Cortometrajes y documental", "tipos": ["cortometraje", "documental"] },
    { "nombre": "Videoclips", "tipos": ["videoclip"] },
    { "nombre": "Eventos", "tipos": ["eventos"] },
    { "nombre": "Aftermovies y conciertos", "tipos": ["conciertos"] },
    { "nombre": "Bodas", "tipos": ["bodas"] },
    { "nombre": "Redes sociales", "tipos": ["redes-sociales"] }
  ]
}}$json$::jsonb
from public.paginas p
where b.pagina_id = p.id and p.slug = 'trabajos' and p.idioma = 'es' and b.orden = 0;

commit;
