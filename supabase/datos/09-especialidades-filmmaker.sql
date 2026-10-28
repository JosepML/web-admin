-- Páginas de cada especialidad de filmmaker (/servicios/filmmaker/<especialidad>): cómo trabajo ese tipo de
-- encargo y todos sus proyectos. Son páginas de bloques («filmmaker-videoclips»...) que se editan en su sitio
-- como Inicio. Bloques: texto (presentación con la foto de un proyecto), proceso (cómo lo trabajo), trabajos con
-- `tipos` (rejilla con todos los proyectos de esos tipos; si solo hay uno, también sus «Más vídeos») y la llamada
-- de Inicio. Al final, las tarjetas de «Lo que puedo grabar para ti» de Inicio pasan a llevar a cada página.
-- Textos de partida para que Josep los revise. Escrito a mano; repetible (no duplica nada si ya existe).
begin;

-- Spots y vídeo corporativo
insert into public.paginas (slug, titulo, seo_titulo, seo_descripcion, estado, publicado_en)
values ('filmmaker-spots-y-corporativo', 'Spots y vídeo corporativo', $t$Spots y vídeo corporativo · Josep Mira Lozano$t$, $t$Spots y vídeos de empresa que cuentan una historia. Llevo el proyecto de la idea al montaje o me sumo al equipo de tu productora.$t$, 'publicado', now())
on conflict (idioma, slug) do nothing;

insert into public.bloques (pagina_id, orden, tipo, visible, datos)
select pg.id, b.orden, b.tipo::public.tipo_bloque, true, b.datos
from public.paginas pg
cross join lateral (values
  (0, 'texto', $json${"antetitulo": "Spots y vídeo corporativo", "titulo": "Contar algo con *alma*", "texto": "Un spot o un vídeo de empresa funciona cuando cuenta una historia, no cuando enseña un catálogo. Busco qué hay de verdad detrás de la marca y lo convierto en algo que se quiera ver hasta el final.\n\nPuedo llevar el proyecto entero, de la idea al montaje, o sumarme al equipo de tu productora."}$json$::jsonb || jsonb_strip_nulls(jsonb_build_object('imagen', (select imagen_id from public.proyectos where slug = 'expandete-spot-juno-media')))),
  (1, 'proceso', $json${"antetitulo": "Cómo lo trabajo", "titulo": "De la idea a la *pantalla*", "pasos": [{"titulo": "Escucho", "texto": "Qué quieres contar, a quién y dónde se va a ver."}, {"titulo": "Propongo", "texto": "Una idea y cómo rodarla. Si ya hay guion, me adapto a él."}, {"titulo": "Ruedo", "texto": "Casting, localizaciones y rodaje, con la mirada puesta ya en el montaje."}, {"titulo": "Entrego", "texto": "Montaje, color y sonido, y versiones para redes sacadas del mismo material."}]}$json$::jsonb),
  (2, 'trabajos', $json${"antetitulo": "Proyectos", "titulo": "Spots y *vídeos*", "tipos": ["publicidad"]}$json$::jsonb),
  (3, 'llamada', coalesce((select x.datos from public.bloques x join public.paginas i on i.id = x.pagina_id where i.slug = 'inicio' and i.idioma = 'es' and x.tipo = 'llamada' order by x.orden limit 1), '{}'::jsonb))
) as b(orden, tipo, datos)
where pg.slug = 'filmmaker-spots-y-corporativo' and pg.idioma = 'es'
  and not exists (select 1 from public.bloques x where x.pagina_id = pg.id);

-- Videoclips
insert into public.paginas (slug, titulo, seo_titulo, seo_descripcion, estado, publicado_en)
values ('filmmaker-videoclips', 'Videoclips', $t$Videoclips · Josep Mira Lozano$t$, $t$Videoclips rodados al servicio de la canción: de la idea del artista al plan de rodaje y un montaje que sigue al tema.$t$, 'publicado', now())
on conflict (idioma, slug) do nothing;

insert into public.bloques (pagina_id, orden, tipo, visible, datos)
select pg.id, b.orden, b.tipo::public.tipo_bloque, true, b.datos
from public.paginas pg
cross join lateral (values
  (0, 'texto', $json${"antetitulo": "Videoclips", "titulo": "La canción *manda*", "texto": "Vengo de la música, así que para mí un videoclip empieza en la canción: la escucho hasta saber qué pide cada parte.\n\nA veces la idea es del artista y mi trabajo es hacerla rodable; otras la escribimos juntos desde cero. En los dos casos, cada plano está al servicio del tema."}$json$::jsonb || jsonb_strip_nulls(jsonb_build_object('imagen', (select imagen_id from public.proyectos where slug = '100-baladas-arkano')))),
  (1, 'proceso', $json${"antetitulo": "Cómo lo trabajo", "titulo": "De la canción al *rodaje*", "pasos": [{"titulo": "Escucho el tema", "texto": "Busco la historia que cuenta y los cambios donde la imagen tiene que girar."}, {"titulo": "Plan de rodaje", "texto": "Paso la canción a un plan: qué plano va en cada parte, con qué óptica y qué movimiento."}, {"titulo": "Ruedo", "texto": "Con playback para que labios e instrumentos cuadren, y una luz pensada para cada atmósfera."}, {"titulo": "Monto a la canción", "texto": "Los cortes siguen los cambios del tema, no un ritmo fijo."}]}$json$::jsonb),
  (2, 'trabajos', $json${"antetitulo": "Proyectos", "titulo": "Videoclips que he *rodado*", "tipos": ["videoclip"]}$json$::jsonb),
  (3, 'llamada', coalesce((select x.datos from public.bloques x join public.paginas i on i.id = x.pagina_id where i.slug = 'inicio' and i.idioma = 'es' and x.tipo = 'llamada' order by x.orden limit 1), '{}'::jsonb))
) as b(orden, tipo, datos)
where pg.slug = 'filmmaker-videoclips' and pg.idioma = 'es'
  and not exists (select 1 from public.bloques x where x.pagina_id = pg.id);

-- Conciertos y aftermovies
insert into public.paginas (slug, titulo, seo_titulo, seo_descripcion, estado, publicado_en)
values ('filmmaker-conciertos-y-aftermovies', 'Conciertos y aftermovies', $t$Conciertos y aftermovies · Josep Mira Lozano$t$, $t$Aftermovies y vídeos de conciertos montados como un músico: primero la música, después la imagen, para sentirte en primera fila.$t$, 'publicado', now())
on conflict (idioma, slug) do nothing;

insert into public.bloques (pagina_id, orden, tipo, visible, datos)
select pg.id, b.orden, b.tipo::public.tipo_bloque, true, b.datos
from public.paginas pg
cross join lateral (values
  (0, 'texto', $json${"antetitulo": "Conciertos y aftermovies", "titulo": "El directo, en pocos *minutos*", "texto": "Un aftermovie tiene que hacerte sentir en primera fila aunque no estuvieras. Por eso, antes de tocar la imagen, construyo la música: un mix con los temas más potentes que hace de esqueleto del vídeo.\n\nHe grabado para Tamilah y Fluxà, Mapache Events, Orquesta Azara y Miami Show."}$json$::jsonb || jsonb_strip_nulls(jsonb_build_object('imagen', (select imagen_id from public.proyectos where slug = 'conciertos')))),
  (1, 'proceso', $json${"antetitulo": "Cómo lo trabajo", "titulo": "Así monto un *directo*", "pasos": [{"titulo": "Primero el audio", "texto": "Un mix con los temas más potentes y sus cambios de tempo marca el ritmo de todo el vídeo."}, {"titulo": "Hablo con los artistas", "texto": "Sé qué momentos vienen y dónde colocarme para no perderlos."}, {"titulo": "Grabo para montar", "texto": "Muchos encuadres y el playback tomado, para que labios e instrumentos cuadren después."}, {"titulo": "Construyo la estructura", "texto": "Lo más rompedor al principio y lo más espectacular al cierre, con el ambiente del público."}]}$json$::jsonb),
  (2, 'trabajos', $json${"antetitulo": "Proyectos", "titulo": "Conciertos y *aftermovies*", "tipos": ["conciertos"]}$json$::jsonb),
  (3, 'llamada', coalesce((select x.datos from public.bloques x join public.paginas i on i.id = x.pagina_id where i.slug = 'inicio' and i.idioma = 'es' and x.tipo = 'llamada' order by x.orden limit 1), '{}'::jsonb))
) as b(orden, tipo, datos)
where pg.slug = 'filmmaker-conciertos-y-aftermovies' and pg.idioma = 'es'
  and not exists (select 1 from public.bloques x where x.pagina_id = pg.id);

-- Bodas
insert into public.paginas (slug, titulo, seo_titulo, seo_descripcion, estado, publicado_en)
values ('filmmaker-bodas', 'Bodas', $t$Vídeo de bodas · Josep Mira Lozano$t$, $t$Bodas contadas como un tráiler documental de unos 20 minutos, con la música elegida con la pareja.$t$, 'publicado', now())
on conflict (idioma, slug) do nothing;

insert into public.bloques (pagina_id, orden, tipo, visible, datos)
select pg.id, b.orden, b.tipo::public.tipo_bloque, true, b.datos
from public.paginas pg
cross join lateral (values
  (0, 'texto', $json${"antetitulo": "Bodas", "titulo": "Una película, no un *resumen*", "texto": "Planteo cada boda como un tráiler documental de unos 20 minutos, con la música elegida con la pareja. Una película que apetezca volver a ver dentro de muchos años.\n\nEl día es vuestro: me muevo con discreción para que os olvidéis de la cámara y los momentos salgan solos."}$json$::jsonb || jsonb_strip_nulls(jsonb_build_object('imagen', (select imagen_id from public.proyectos where slug = 'bodas')))),
  (1, 'proceso', $json${"antetitulo": "Cómo lo trabajo", "titulo": "Vuestro día, vuestra *película*", "pasos": [{"titulo": "Nos conocemos", "texto": "Me contáis cómo sois y qué no puede faltar."}, {"titulo": "Elegimos la música", "texto": "La escogemos juntos, y sobre ella monto cada transición."}, {"titulo": "Discreción en el día", "texto": "Sin poses forzadas ni interrupciones: lo auténtico es lo que luego emociona."}, {"titulo": "La película", "texto": "Montaje ágil y color cuidado, pensados para volver a verse."}]}$json$::jsonb),
  (2, 'trabajos', $json${"antetitulo": "Proyectos", "titulo": "Algunas *bodas*", "tipos": ["bodas"], "texto": "Por privacidad, aquí solo enseño fotogramas."}$json$::jsonb),
  (3, 'llamada', coalesce((select x.datos from public.bloques x join public.paginas i on i.id = x.pagina_id where i.slug = 'inicio' and i.idioma = 'es' and x.tipo = 'llamada' order by x.orden limit 1), '{}'::jsonb))
) as b(orden, tipo, datos)
where pg.slug = 'filmmaker-bodas' and pg.idioma = 'es'
  and not exists (select 1 from public.bloques x where x.pagina_id = pg.id);

-- Eventos deportivos
insert into public.paginas (slug, titulo, seo_titulo, seo_descripcion, estado, publicado_en)
values ('filmmaker-eventos-deportivos', 'Eventos deportivos', $t$Eventos deportivos · Josep Mira Lozano$t$, $t$Vídeo de competiciones grabado a pie de pista: piezas para redes y para televisión, con la velocidad y el esfuerzo de la carrera.$t$, 'publicado', now())
on conflict (idioma, slug) do nothing;

insert into public.bloques (pagina_id, orden, tipo, visible, datos)
select pg.id, b.orden, b.tipo::public.tipo_bloque, true, b.datos
from public.paginas pg
cross join lateral (values
  (0, 'texto', $json${"antetitulo": "Eventos deportivos", "titulo": "La carrera no se *repite*", "texto": "En deporte no hay segunda toma, así que casi todo depende de dónde me coloque. Busco los puntos más espectaculares del recorrido y sigo la acción de cerca para que se note la velocidad.\n\nHe grabado ciclismo de élite para Ocisport, como la Shimano Super Cup Massi en La Nucía."}$json$::jsonb || jsonb_strip_nulls(jsonb_build_object('imagen', (select imagen_id from public.proyectos where slug = 'eventos-deportivos')))),
  (1, 'proceso', $json${"antetitulo": "Cómo lo trabajo", "titulo": "A pie de *pista*", "pasos": [{"titulo": "Estudio el recorrido", "texto": "Elijo los puntos donde la carrera se ve más espectacular."}, {"titulo": "Cámara rápida y cerrada", "texto": "Seguimiento preciso para que se sienta la velocidad."}, {"titulo": "Sonido realzado", "texto": "Ruedas, esfuerzo y público sobre una base musical fuerte."}, {"titulo": "Un pack por canal", "texto": "Reels para redes y piezas largas con calidad de emisión."}]}$json$::jsonb),
  (2, 'trabajos', $json${"antetitulo": "Proyectos", "titulo": "Eventos *deportivos*", "tipos": ["eventos"]}$json$::jsonb),
  (3, 'llamada', coalesce((select x.datos from public.bloques x join public.paginas i on i.id = x.pagina_id where i.slug = 'inicio' and i.idioma = 'es' and x.tipo = 'llamada' order by x.orden limit 1), '{}'::jsonb))
) as b(orden, tipo, datos)
where pg.slug = 'filmmaker-eventos-deportivos' and pg.idioma = 'es'
  and not exists (select 1 from public.bloques x where x.pagina_id = pg.id);

-- Contenido para redes
insert into public.paginas (slug, titulo, seo_titulo, seo_descripcion, estado, publicado_en)
values ('filmmaker-contenido-para-redes', 'Contenido para redes', $t$Contenido para redes · Josep Mira Lozano$t$, $t$Vídeo vertical para marcas, entidades y creadores, con gancho en los primeros segundos y el tono de cada perfil.$t$, 'publicado', now())
on conflict (idioma, slug) do nothing;

insert into public.bloques (pagina_id, orden, tipo, visible, datos)
select pg.id, b.orden, b.tipo::public.tipo_bloque, true, b.datos
from public.paginas pg
cross join lateral (values
  (0, 'texto', $json${"antetitulo": "Contenido para redes", "titulo": "Que dejen de hacer *scroll*", "texto": "Llevo más de nueve años creando contenido y sé lo que hace que alguien se pare en tu vídeo. Cada perfil necesita sonar distinto: un creador, una marca de entretenimiento o una entidad pública.\n\nHe hecho piezas verticales para Disney, el Consell Valencià de la Joventut y creadores de YouTube."}$json$::jsonb || jsonb_strip_nulls(jsonb_build_object('imagen', (select imagen_id from public.proyectos where slug = 'reels-redes-sociales')))),
  (1, 'proceso', $json${"antetitulo": "Cómo lo trabajo", "titulo": "Pensado para el *móvil*", "pasos": [{"titulo": "Gancho", "texto": "Lo más potente, en los tres primeros segundos."}, {"titulo": "Sin tiempos muertos", "texto": "Cortes a la música, zooms y diseño sonoro."}, {"titulo": "Cada cliente, su tono", "texto": "Cambian la luz, el color, los subtítulos y el ritmo."}, {"titulo": "Del mismo rodaje", "texto": "Si grabamos algo más largo, saco las versiones verticales del mismo material."}]}$json$::jsonb),
  (2, 'trabajos', $json${"antetitulo": "Proyectos", "titulo": "Contenido para *redes*", "tipos": ["redes-sociales"]}$json$::jsonb),
  (3, 'llamada', coalesce((select x.datos from public.bloques x join public.paginas i on i.id = x.pagina_id where i.slug = 'inicio' and i.idioma = 'es' and x.tipo = 'llamada' order by x.orden limit 1), '{}'::jsonb))
) as b(orden, tipo, datos)
where pg.slug = 'filmmaker-contenido-para-redes' and pg.idioma = 'es'
  and not exists (select 1 from public.bloques x where x.pagina_id = pg.id);

-- Las tarjetas de «Lo que puedo grabar para ti» (Inicio) llevan a su página. Se emparejan por nombre; una tarjeta
-- que ya tenga dirección no se toca. Si Inicio tiene cambios sin publicar en el panel, al publicarlos mandan
-- ellos: en ese caso, mejor poner las direcciones a mano en la tarjeta («Lleva a»).
update public.bloques b
set datos = jsonb_set(b.datos, '{piezas}', (
  select coalesce(jsonb_agg(
    case when coalesce(pz ->> 'href', '') = '' then pz || jsonb_build_object('href', case pz ->> 'nombre'
        when 'Spots y vídeo corporativo' then '/servicios/filmmaker/spots-y-corporativo'
        when 'Videoclips' then '/servicios/filmmaker/videoclips'
        when 'Conciertos y aftermovies' then '/servicios/filmmaker/conciertos-y-aftermovies'
        when 'Bodas' then '/servicios/filmmaker/bodas'
        when 'Eventos deportivos' then '/servicios/filmmaker/eventos-deportivos'
        when 'Contenido para redes' then '/servicios/filmmaker/contenido-para-redes'
        else '' end)
    else pz end order by i), '[]'::jsonb)
  from jsonb_array_elements(b.datos -> 'piezas') with ordinality as t(pz, i)
))
from public.paginas pg
where pg.id = b.pagina_id and pg.slug = 'inicio' and pg.idioma = 'es' and b.tipo = 'filmmaker' and jsonb_typeof(b.datos -> 'piezas') = 'array';

commit;
