-- Página «JUNO Media» (/juno-media): la colaboración de Josep con JUNO Media. La etiqueta «con JUNO MEDIA» de los
-- proyectos y el apartado de Clientes llevan a ella. Página de bloques, editable en su sitio. Repetible.
-- Versión 2 (2026-10-26): textos y estructura revisados con Josep. Si la página ya existía, ver 21-juno-media-v2.sql.
begin;

insert into public.paginas (slug, titulo, seo_titulo, seo_descripcion, estado, publicado_en)
values ('juno-media', 'JUNO Media', $t$Mi colaboración con JUNO Media · Josep Mira Lozano$t$, $t$Trabajo en sinergia con JUNO Media: puedes contar conmigo directamente o, en los proyectos grandes, con la producción de una productora audiovisual detrás.$t$, 'publicado', now())
on conflict (idioma, slug) do nothing;

insert into public.bloques (pagina_id, orden, tipo, visible, datos)
select pg.id, b.orden, b.tipo::public.tipo_bloque, true, b.datos
from public.paginas pg
cross join lateral (values
  (0, 'texto', $json${"estilo": "cabecera", "antetitulo": "JUNO Media y yo", "titulo": "Donde *empezó todo*", "imagen": "508f8ec8-b800-45cd-bf9a-013f1b276ef9", "texto": "JUNO Media es la productora con la que más trabajo y donde di mis primeros pasos. Desde entonces no hemos dejado de crear juntos: hoy, los proyectos que nacen allí los sacamos adelante Noelia Fluxà y yo.\n\nNos une una relación personal, artística y profesional. Y sigo siendo independiente: puedes trabajar conmigo directamente o, cuando el proyecto lo pide, con toda una productora detrás."}$json$::jsonb),
  (1, 'proceso', $json${"antetitulo": "Cómo trabajamos", "titulo": "Cercanía de autónomo, *respaldo de productora*", "pasos": [{"titulo": "Conmigo, directamente", "texto": "Me llamas, hablamos de tu idea y la levantamos juntos: rodaje, luz o montaje."}, {"titulo": "Un equipo pequeño", "texto": "Lo que entra en JUNO Media lo hacemos Noelia y yo. Trato directo y el mismo cuidado de principio a fin."}, {"titulo": "Una productora, si hace falta", "texto": "En los proyectos de gran envergadura, la producción queda en manos de una productora audiovisual y cinematográfica."}, {"titulo": "Tú eliges cómo", "texto": "Esa opción está siempre sobre la mesa. Y si veo que tu proyecto la necesita, te lo propongo yo."}]}$json$::jsonb),
  (2, 'cita', $json${"titulo": "Una productora detrás y *el mismo equipo* de siempre."}$json$::jsonb),
  (3, 'trabajos', $json${"antetitulo": "Proyectos con JUNO Media", "titulo": "Lo que hemos hecho *juntos*", "texto": "Videoclips, conciertos, eventos, cine y publicidad: buena parte de mi trabajo nace de esta colaboración.", "origen": "juno"}$json$::jsonb),
  (4, 'texto', $json${"estilo": "tarjeta", "antetitulo": "La productora", "titulo": "Conoce a *JUNO Media*", "imagen": "d8248ed7-bb85-48e0-8559-4a9779e5deb8", "texto": "Productora audiovisual y cinematográfica, a la medida de cada proyecto. Si buscas una producción completa, su web es un buen punto de partida.", "enlace": {"texto": "Visitar junomedia.es", "href": "https://junomedia.es"}}$json$::jsonb),
  (5, 'llamada', coalesce((select x.datos from public.bloques x join public.paginas i on i.id = x.pagina_id where i.slug = 'inicio' and i.idioma = 'es' and x.tipo = 'llamada' order by x.orden limit 1), '{}'::jsonb) || $json${"titulo": "¿Tienes un proyecto en mente?", "texto": "Cuéntamelo. Te diré con sinceridad cómo lo veo y si conviene afrontarlo a solas o con JUNO Media."}$json$::jsonb)
) as b(orden, tipo, datos)
where pg.slug = 'juno-media' and pg.idioma = 'es'
  and not exists (select 1 from public.bloques x where x.pagina_id = pg.id);

-- El apartado de JUNO en Clientes (Inicio y Sobre mí) lleva a la página
update public.bloques b set datos = jsonb_set(b.datos, '{juno,enlace}', '{"texto": "Así trabajamos", "href": "/juno-media"}'::jsonb, true)
from public.paginas p
where b.pagina_id = p.id and p.idioma = 'es' and b.tipo = 'clientes' and p.slug in ('inicio', 'sobre-mi')
  and coalesce(b.datos #>> '{juno,enlace,href}', '') = '';

commit;
