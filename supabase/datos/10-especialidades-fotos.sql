-- Fotos propias para las especialidades de filmmaker (después de 09-especialidades-filmmaker.sql).
-- 1. Cada tarjeta de «Lo que puedo grabar para ti» (Inicio) lleva una foto de la galería de su proyecto que no es
--    su portada, para no repetirla (campo `imagen` de la tarjeta).
-- 2. La primera sección de cada página de especialidad pasa a «cabecera de cine» (estilo `cabecera`), con otra foto
--    de esa galería, distinta de la de la tarjeta.
-- Las fotos se toman por su posición en la galería (0 = la primera). Se puede repetir sin problema. Si Inicio o
-- una especialidad tienen cambios sin publicar en el panel, al publicarlos mandan ellos.

begin;

-- 1. Tarjetas de Inicio, emparejadas por nombre
with foto(nombre, proyecto, n) as (
  values
    ('Spots y vídeo corporativo', 'expandete-spot-juno-media', 1),
    ('Videoclips', '100-baladas-arkano', 1),
    ('Conciertos y aftermovies', 'conciertos', 1),
    ('Bodas', 'bodas', 6),
    ('Eventos deportivos', 'eventos-deportivos', 4)
)
update public.bloques b
set datos = jsonb_set(b.datos, '{piezas}', (
  select coalesce(jsonb_agg(
    case when m.medio is not null then pz || jsonb_build_object('imagen', m.medio) else pz end order by i), '[]'::jsonb)
  from jsonb_array_elements(b.datos -> 'piezas') with ordinality as t(pz, i)
  left join lateral (
    select p.galeria -> f.n ->> 'medio' as medio
    from foto f join public.proyectos p on p.slug = f.proyecto and p.idioma = 'es'
    where f.nombre = pz ->> 'nombre'
  ) m on true
))
from public.paginas pg
where pg.id = b.pagina_id and pg.slug = 'inicio' and pg.idioma = 'es' and b.tipo = 'filmmaker' and jsonb_typeof(b.datos -> 'piezas') = 'array';

-- 2. Cabecera de cine en cada especialidad (sin foto en la lista, se queda la que tenía)
with cabecera(pagina, proyecto, n) as (
  values
    ('filmmaker-spots-y-corporativo', 'expandete-spot-juno-media', 2),
    ('filmmaker-videoclips', '100-baladas-arkano', 4),
    ('filmmaker-conciertos-y-aftermovies', 'conciertos', 3),
    ('filmmaker-bodas', 'bodas', 2),
    ('filmmaker-eventos-deportivos', 'eventos-deportivos', 1),
    ('filmmaker-contenido-para-redes', null, null)
)
update public.bloques b
set datos = b.datos || jsonb_build_object('estilo', 'cabecera')
  || coalesce(jsonb_strip_nulls(jsonb_build_object('imagen',
       (select p.galeria -> c.n ->> 'medio' from public.proyectos p where p.slug = c.proyecto and p.idioma = 'es'))), '{}'::jsonb)
from public.paginas pg, cabecera c
where pg.id = b.pagina_id and pg.slug = c.pagina and pg.idioma = 'es' and b.tipo = 'texto'
  and b.orden = (select min(x.orden) from public.bloques x where x.pagina_id = pg.id);

commit;
