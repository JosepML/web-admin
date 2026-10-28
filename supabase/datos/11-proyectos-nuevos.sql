-- Proyectos nuevos de 2025 y 2026 (generado por scripts/generar-proyectos-nuevos.py desde
-- plan/contenido/proyectos-nuevos/; no se edita a mano). Incluye la migración 20261025120000_proyectos_categorias_extra.
--
-- Antes de ejecutarlo: subir a la biblioteca las fotos de D:\VIDEOS WEB\_WEB\SUBIR (todas a la vez). Se enlazan
-- por su título, que es el nombre del archivo. Las que falten se saltan; se puede repetir cuando estén.
-- Los proyectos nuevos entran como borrador: se ven en la vista previa y se publican desde el panel.
-- Repetirlo rehace los textos desde las fichas: si ya los has cambiado en el panel, no lo repitas.

begin;

-- La columna de la migración 20261025120000 (por si no se ha ejecutado: así basta con este archivo)
alter table public.proyectos add column if not exists categorias_extra uuid[] not null default '{}';

create function pg_temp.foto(t text) returns uuid language sql as $$
  select id from public.medios where titulo = t and tipo = 'imagen' order by creado_en desc limit 1 $$;
create function pg_temp.gal(titulos text[]) returns jsonb language sql as $$
  select coalesce(jsonb_agg(jsonb_build_object('medio', pg_temp.foto(t), 'pie', '') order by o), '[]'::jsonb)
  from unnest(titulos) with ordinality x(t, o) where pg_temp.foto(t) is not null $$;

create function pg_temp.med(u text) returns uuid language sql as $$ select id from public.medios where url_origen = u order by creado_en limit 1 $$;

-- Vídeos propios, alojados en el bucket público jml-videos de Cloudflare R2: cada uno entra en la biblioteca por su dirección
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/ep-color-adrian-munoz/trailer-color-adrianmunoz-v2.mp4', 'video', 'video/mp4', $t$ep-color-adrian-munoz · Tráiler$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/atavicas-trailer-obra-de-teatro/atavicas2026-neiraysantamaria-videoresumen-v2.mp4', 'video', 'video/mp4', $t$atavicas-trailer-obra-de-teatro · Vídeo resumen$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/ais-10-anos/escuela-ais-videoresumen-v1.mp4', 'video', 'video/mp4', $t$ais-10-anos · Vídeo resumen$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/albir-confort-real-estate/video-villa-dor-v1.mp4', 'video', 'video/mp4', $t$albir-confort-real-estate · Villa d'Or$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/el-xato-evento-boda/videoresumen-evento-xato-v2.mp4', 'video', 'video/mp4', $t$el-xato-evento-boda · Vídeo resumen$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/englobe-evento-redes/englobe-v4.mp4', 'video', 'video/mp4', $t$englobe-evento-redes · Englobe$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/evento-grupo-lon-el-langui/encuentros-lon-langui-v1.mp4', 'video', 'video/mp4', $t$evento-grupo-lon-el-langui · El Langui con Grupo LON$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/locos-de-atar-ultimo-concierto/videoresumen-concierto-lda-v1.mp4', 'video', 'video/mp4', $t$locos-de-atar-ultimo-concierto · El último concierto$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/lavanderia-grupo-lon/reel1-lon-v2.mp4', 'video', 'video/mp4', $t$lavanderia-grupo-lon · Reel 1$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/lavanderia-grupo-lon/reel4-lon-v2.mp4', 'video', 'video/mp4', $t$lavanderia-grupo-lon · Reel 4$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/louk-the-grill/reel-louk-v1.mp4', 'video', 'video/mp4', $t$louk-the-grill · Reel$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/eventos-deportivos/aftermovie-supercupmassi-lanucia-horizontal-v1.mp4', 'video', 'video/mp4', $t$eventos-deportivos · Aftermovie$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/eventos-deportivos/compactat-supercup-lanucia-tv-apunt.mp4', 'video', 'video/mp4', $t$eventos-deportivos · Resumen para À Punt$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/diferens-encuentro-2025/diferens-2025-v1.mp4', 'video', 'video/mp4', $t$diferens-encuentro-2025 · Vídeo resumen$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/flama-aftermovie/aftermovie-flama-2026-v03.mp4', 'video', 'video/mp4', $t$flama-aftermovie · Aftermovie$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/flama-la-nucia-video-oficial/flama-lanucia-v3.mp4', 'video', 'video/mp4', $t$flama-la-nucia-video-oficial · Vídeo oficial$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/flama-benissa-video-oficial/videoresumen-flama-benissa-v3.mp4', 'video', 'video/mp4', $t$flama-benissa-video-oficial · Vídeo oficial$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/forecourttech-2025/forecourttech-2025-v3-withlogo.mp4', 'video', 'video/mp4', $t$forecourttech-2025 · Vídeo resumen$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/la-vibra-video-oficial/video-oficial-lavibra-v3.mp4', 'video', 'video/mp4', $t$la-vibra-video-oficial · Vídeo oficial$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/madison-video-oficial/madison-videoresumen-v3.mp4', 'video', 'video/mp4', $t$madison-video-oficial · Vídeo oficial$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/otra-movida-video-oficial/otramovida-videoresumen-v4-masterizada.mp4', 'video', 'video/mp4', $t$otra-movida-video-oficial · Vídeo oficial$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/consell-valencia-joventut-charla/videoresum-consell-horitzontal-v2.mp4', 'video', 'video/mp4', $t$consell-valencia-joventut-charla · Vídeo resumen$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/formacion-mario-bravo/formacion-mario-bravo.mp4', 'video', 'video/mp4', $t$formacion-mario-bravo · Vídeo promocional$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/zorom-ia/spot-promotora-v4.mp4', 'video', 'video/mp4', $t$zorom-ia · Amiral by Zorom$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/flama-contenido-cinematografico-ia/video-flama-pantallas-v5.mp4', 'video', 'video/mp4', $t$flama-contenido-cinematografico-ia · Foc i Flama$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/aguita-de-coco-visuales/a1-3x2-1080.mp4', 'video', 'video/mp4', $t$aguita-de-coco-visuales · Animación 1$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/aguita-de-coco-visuales/a2-3x2-1080.mp4', 'video', 'video/mp4', $t$aguita-de-coco-visuales · Animación 2$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/aguita-de-coco-visuales/a3-3x2-1080.mp4', 'video', 'video/mp4', $t$aguita-de-coco-visuales · Animación 3$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/aguita-de-coco-visuales/a4-3x2-1080-30s.mp4', 'video', 'video/mp4', $t$aguita-de-coco-visuales · Animación 4$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/albir-confort-reels/reel1-presentacion-james-v3.mp4', 'video', 'video/mp4', $t$albir-confort-reels · Reel 1 · Presentación de James$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/albir-confort-reels/reel2-tip2-v1.mp4', 'video', 'video/mp4', $t$albir-confort-reels · Reel 2$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/albir-confort-reels/reel3-tip3-v1.mp4', 'video', 'video/mp4', $t$albir-confort-reels · Reel 3$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/albir-confort-reels/reel4-tip4-v1.mp4', 'video', 'video/mp4', $t$albir-confort-reels · Reel 4$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/albir-confort-reels/reel5-tip5-v1.mp4', 'video', 'video/mp4', $t$albir-confort-reels · Reel 5$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/albir-confort-reels/reel6-tip7-v1.mp4', 'video', 'video/mp4', $t$albir-confort-reels · Reel 6$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/albir-confort-reels/reel7-tip11-v1.mp4', 'video', 'video/mp4', $t$albir-confort-reels · Reel 7$t$) on conflict do nothing;
-- Tipos nuevos (por si la migración no los creó)
insert into public.tipos_proyecto (slug, nombre, orden)
select v.slug, v.nombre, v.orden from (values ('corporativo', 'Corporativo', 10), ('visuales-e-ia', 'Visuales e IA', 11)) as v(slug, nombre, orden)
where not exists (select 1 from public.tipos_proyecto t where t.slug = v.slug);

-- Agüita de Coco, visuales
insert into public.proyectos (slug, titulo, tipo_id, categorias_extra, anio, direccion, productora, papel, camara, tarjeta, historia, como_lo_hicimos, el_reto, el_resultado, con_juno, videos, imagen_id, galeria, orden, estado, publicado_en)
values (
  $t$aguita-de-coco-visuales$t$,
  $t$Agüita de Coco, visuales$t$,
  (select id from public.tipos_proyecto where idioma = 'es' and slug = 'visuales-e-ia'),
  '{}'::uuid[],
  2026,
  $t$$t$,
  $t$Agüita de Coco$t$,
  $t$Animaciones para pantallas$t$,
  $t$$t$,
  $t$Las animaciones de las pantallas LED de Agüita de Coco, para toda su gira.$t$,
  $t$Hice los visuales de las pantallas LED del escenario de Agüita de Coco, que acompañan toda su gira.$t$,
  $t$$t$,
  $t$$t$,
  $t$$t$,
  false,
  $t$[]$t$::jsonb || jsonb_build_array(jsonb_build_object('tipo', 'archivo', 'rol', 'principal', 'titulo', $t$Animación 1$t$, 'medio', pg_temp.med('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/aguita-de-coco-visuales/a1-3x2-1080.mp4')), jsonb_build_object('tipo', 'archivo',  'titulo', $t$Animación 2$t$, 'medio', pg_temp.med('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/aguita-de-coco-visuales/a2-3x2-1080.mp4')), jsonb_build_object('tipo', 'archivo',  'titulo', $t$Animación 3$t$, 'medio', pg_temp.med('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/aguita-de-coco-visuales/a3-3x2-1080.mp4')), jsonb_build_object('tipo', 'archivo',  'titulo', $t$Animación 4$t$, 'medio', pg_temp.med('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/aguita-de-coco-visuales/a4-3x2-1080-30s.mp4'))),
  pg_temp.foto('aguita-de-coco-visuales-01'),
  pg_temp.gal(array['aguita-de-coco-visuales-01','aguita-de-coco-visuales-02','aguita-de-coco-visuales-03','aguita-de-coco-visuales-04','aguita-de-coco-visuales-05']::text[]),
  20,
  'borrador',
  null)
on conflict (idioma, slug) do update set titulo = excluded.titulo, tipo_id = excluded.tipo_id, categorias_extra = excluded.categorias_extra, anio = excluded.anio, direccion = excluded.direccion, productora = excluded.productora, papel = excluded.papel, camara = excluded.camara, tarjeta = excluded.tarjeta, historia = excluded.historia, como_lo_hicimos = excluded.como_lo_hicimos, el_reto = excluded.el_reto, el_resultado = excluded.el_resultado, con_juno = excluded.con_juno, videos = excluded.videos, imagen_id = excluded.imagen_id, galeria = excluded.galeria;

insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 100, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'aguita-de-coco-visuales' and s.slug = 'edicion' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;

-- AIS, 10 años
insert into public.proyectos (slug, titulo, tipo_id, categorias_extra, anio, direccion, productora, papel, camara, tarjeta, historia, como_lo_hicimos, el_reto, el_resultado, con_juno, videos, imagen_id, galeria, orden, estado, publicado_en)
values (
  $t$ais-10-anos$t$,
  $t$AIS, 10 años$t$,
  (select id from public.tipos_proyecto where idioma = 'es' and slug = 'corporativo'),
  '{}'::uuid[],
  2026,
  $t$Noelia Fluxà (coordinación y dirección)$t$,
  $t$AIS$t$,
  $t$Grabación y edición$t$,
  $t$Sony FX3 · ópticas Tamron y Sony$t$,
  $t$El décimo aniversario del colegio AIS, contado con su propia personalidad.$t$,
  $t$El colegio AIS, entre La Nucía y l'Alfàs del Pi, celebró sus 10 años. Hice el vídeo corporativo del evento para JUNO Media: Noelia Fluxà coordinaba y dirigía, Paula grabó con dron y yo me encargué de la cámara y de la edición.$t$,
  $t$- **La esencia del colegio.** El vídeo replica el carácter muy personal que tiene AIS y que tuvo el evento.
- **Naturalista.** Un tono casi de documental, sin llegar a serlo.
- **Una música diferente.** Una atmósfera alternativa, divertida y distinta, que busca el alma que querían representar.$t$,
  $t$$t$,
  $t$$t$,
  true,
  $t$[]$t$::jsonb || jsonb_build_array(jsonb_build_object('tipo', 'archivo', 'rol', 'principal', 'titulo', $t$Vídeo resumen$t$, 'medio', pg_temp.med('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/ais-10-anos/escuela-ais-videoresumen-v1.mp4'))),
  pg_temp.foto('ais-10-anos-05'),
  pg_temp.gal(array['ais-10-anos-01','ais-10-anos-02','ais-10-anos-03','ais-10-anos-04','ais-10-anos-05','ais-10-anos-06','ais-10-anos-07','ais-10-anos-08']::text[]),
  21,
  'borrador',
  null)
on conflict (idioma, slug) do update set titulo = excluded.titulo, tipo_id = excluded.tipo_id, categorias_extra = excluded.categorias_extra, anio = excluded.anio, direccion = excluded.direccion, productora = excluded.productora, papel = excluded.papel, camara = excluded.camara, tarjeta = excluded.tarjeta, historia = excluded.historia, como_lo_hicimos = excluded.como_lo_hicimos, el_reto = excluded.el_reto, el_resultado = excluded.el_resultado, con_juno = excluded.con_juno, videos = excluded.videos, imagen_id = excluded.imagen_id, galeria = excluded.galeria;

insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 100, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'ais-10-anos' and s.slug = 'filmmaker' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;
insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 101, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'ais-10-anos' and s.slug = 'edicion' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;

-- Albir Confort, vídeos inmobiliarios
insert into public.proyectos (slug, titulo, tipo_id, categorias_extra, anio, direccion, productora, papel, camara, tarjeta, historia, como_lo_hicimos, el_reto, el_resultado, con_juno, videos, imagen_id, galeria, orden, estado, publicado_en)
values (
  $t$albir-confort-real-estate$t$,
  $t$Albir Confort, vídeos inmobiliarios$t$,
  (select id from public.tipos_proyecto where idioma = 'es' and slug = 'publicidad'),
  '{}'::uuid[],
  2026,
  $t$$t$,
  $t$Albir Confort$t$,
  $t$Grabación y edición$t$,
  $t$Sony FX3 · ópticas Tamron y Sony$t$,
  $t$Vídeos de real estate para Albir Confort, con JUNO Media: cada vivienda, su vídeo.$t$,
  $t$Este año he hecho varios vídeos de real estate para Albir Confort, de la mano de JUNO Media. Grabé y edité; el dron y las fotos los hicieron Noelia Fluxà y Paula. Aquí van juntos, vivienda a vivienda.$t$,
  $t$$t$,
  $t$$t$,
  $t$$t$,
  true,
  $t$[]$t$::jsonb || jsonb_build_array(jsonb_build_object('tipo', 'archivo', 'rol', 'principal', 'titulo', $t$Villa d'Or$t$, 'medio', pg_temp.med('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/albir-confort-real-estate/video-villa-dor-v1.mp4'))),
  pg_temp.foto('albir-confort-real-estate-01'),
  pg_temp.gal(array['albir-confort-real-estate-01','albir-confort-real-estate-02','albir-confort-real-estate-03','albir-confort-real-estate-04','albir-confort-real-estate-05','albir-confort-real-estate-06']::text[]),
  22,
  'borrador',
  null)
on conflict (idioma, slug) do update set titulo = excluded.titulo, tipo_id = excluded.tipo_id, categorias_extra = excluded.categorias_extra, anio = excluded.anio, direccion = excluded.direccion, productora = excluded.productora, papel = excluded.papel, camara = excluded.camara, tarjeta = excluded.tarjeta, historia = excluded.historia, como_lo_hicimos = excluded.como_lo_hicimos, el_reto = excluded.el_reto, el_resultado = excluded.el_resultado, con_juno = excluded.con_juno, videos = excluded.videos, imagen_id = excluded.imagen_id, galeria = excluded.galeria;

insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 100, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'albir-confort-real-estate' and s.slug = 'filmmaker' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;
insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 101, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'albir-confort-real-estate' and s.slug = 'edicion' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;

-- Albir Confort, reels para redes
insert into public.proyectos (slug, titulo, tipo_id, categorias_extra, anio, direccion, productora, papel, camara, tarjeta, historia, como_lo_hicimos, el_reto, el_resultado, con_juno, videos, imagen_id, galeria, orden, estado, publicado_en)
values (
  $t$albir-confort-reels$t$,
  $t$Albir Confort, reels para redes$t$,
  (select id from public.tipos_proyecto where idioma = 'es' and slug = 'redes-sociales'),
  '{}'::uuid[],
  2026,
  $t$$t$,
  $t$Albir Confort$t$,
  $t$Edición$t$,
  $t$$t$,
  $t$Siete reels para las redes de Albir Confort: James, su agente, explica en inglés cómo comprar una casa en la zona.$t$,
  $t$Para Albir Confort, con JUNO Media, edité una serie de reels verticales en los que James, el agente de la inmobiliaria, habla a cámara en inglés. Empieza con su presentación y sigue con consejos para quien quiere comprar en España. Los temas van de los trámites y los impuestos a lo que ofrece la zona: Altea, el faro de Albir, los paseos y los eventos culturales.$t$,
  $t$- **Planos de apoyo.** Mientras James habla, entran planos de llaves, papeles, viviendas y calles del pueblo para ilustrar lo que dice.
- **Subtítulos en inglés.** Cada reel lleva sus subtítulos, pensados para verse sin sonido.
- **Formato vertical.** Los siete están montados en 9:16 para Instagram y el resto de redes.$t$,
  $t$$t$,
  $t$$t$,
  true,
  $t$[]$t$::jsonb || jsonb_build_array(jsonb_build_object('tipo', 'archivo', 'rol', 'principal','vertical', true, 'titulo', $t$Reel 1 · Presentación de James$t$, 'medio', pg_temp.med('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/albir-confort-reels/reel1-presentacion-james-v3.mp4')), jsonb_build_object('tipo', 'archivo', 'vertical', true, 'titulo', $t$Reel 2$t$, 'medio', pg_temp.med('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/albir-confort-reels/reel2-tip2-v1.mp4')), jsonb_build_object('tipo', 'archivo', 'vertical', true, 'titulo', $t$Reel 3$t$, 'medio', pg_temp.med('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/albir-confort-reels/reel3-tip3-v1.mp4')), jsonb_build_object('tipo', 'archivo', 'vertical', true, 'titulo', $t$Reel 4$t$, 'medio', pg_temp.med('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/albir-confort-reels/reel4-tip4-v1.mp4')), jsonb_build_object('tipo', 'archivo', 'vertical', true, 'titulo', $t$Reel 5$t$, 'medio', pg_temp.med('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/albir-confort-reels/reel5-tip5-v1.mp4')), jsonb_build_object('tipo', 'archivo', 'vertical', true, 'titulo', $t$Reel 6$t$, 'medio', pg_temp.med('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/albir-confort-reels/reel6-tip7-v1.mp4')), jsonb_build_object('tipo', 'archivo', 'vertical', true, 'titulo', $t$Reel 7$t$, 'medio', pg_temp.med('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/albir-confort-reels/reel7-tip11-v1.mp4'))),
  pg_temp.foto('albir-confort-reels-01'),
  pg_temp.gal(array['albir-confort-reels-01','albir-confort-reels-02','albir-confort-reels-03','albir-confort-reels-04','albir-confort-reels-05','albir-confort-reels-06','albir-confort-reels-07']::text[]),
  23,
  'borrador',
  null)
on conflict (idioma, slug) do update set titulo = excluded.titulo, tipo_id = excluded.tipo_id, categorias_extra = excluded.categorias_extra, anio = excluded.anio, direccion = excluded.direccion, productora = excluded.productora, papel = excluded.papel, camara = excluded.camara, tarjeta = excluded.tarjeta, historia = excluded.historia, como_lo_hicimos = excluded.como_lo_hicimos, el_reto = excluded.el_reto, el_resultado = excluded.el_resultado, con_juno = excluded.con_juno, videos = excluded.videos, imagen_id = excluded.imagen_id, galeria = excluded.galeria;

insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 100, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'albir-confort-reels' and s.slug = 'edicion' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;

-- Atávicas. Mujeres de Lorca hacia la libertad
insert into public.proyectos (slug, titulo, tipo_id, categorias_extra, anio, direccion, productora, papel, camara, tarjeta, historia, como_lo_hicimos, el_reto, el_resultado, con_juno, videos, imagen_id, galeria, orden, estado, publicado_en)
values (
  $t$atavicas-trailer-obra-de-teatro$t$,
  $t$Atávicas. Mujeres de Lorca hacia la libertad$t$,
  (select id from public.tipos_proyecto where idioma = 'es' and slug = 'publicidad'),
  '{}'::uuid[],
  2026,
  $t$$t$,
  $t$Neira y Santamaría$t$,
  $t$Grabación y edición$t$,
  $t$Sony FX3 y Sony A7 III$t$,
  $t$El vídeo promocional de la obra de teatro Atávicas: un tráiler de cine, dinámico, de la propia función.$t$,
  $t$Para JUNO Media hice el vídeo promocional oficial de *Atávicas. Mujeres de Lorca hacia la libertad*, la obra de la compañía Neira y Santamaría, de la que ya llevamos dos ediciones. El encargo principal era el vídeo resumen, y además la obra entera grabada en plano fijo. Grabamos el ensayo y la función en una misma tarde.$t$,
  $t$- **Dos cámaras, dos entregas.** Una cámara fija para la obra completa y otra en movimiento para el vídeo resumen.
- **Diversidad de encuadres.** Muchos planos y tamaños distintos para que el tráiler tenga ritmo.
- **El sonido de la obra.** El montaje usa el propio sonido de la función, para que sea inmersivo.
- **Una narrativa cortita con clímax.** El vídeo llega a los mismos clímax que tiene la obra.$t$,
  $t$Sacar en una sola tarde, entre el ensayo y la función, la obra completa y el material para un tráiler de cine.$t$,
  $t$$t$,
  true,
  $t$[]$t$::jsonb || jsonb_build_array(jsonb_build_object('tipo', 'archivo', 'rol', 'principal', 'titulo', $t$Vídeo resumen$t$, 'medio', pg_temp.med('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/atavicas-trailer-obra-de-teatro/atavicas2026-neiraysantamaria-videoresumen-v2.mp4'))),
  pg_temp.foto('atavicas-trailer-obra-de-teatro-02'),
  pg_temp.gal(array['atavicas-trailer-obra-de-teatro-01','atavicas-trailer-obra-de-teatro-02','atavicas-trailer-obra-de-teatro-03','atavicas-trailer-obra-de-teatro-04','atavicas-trailer-obra-de-teatro-05','atavicas-trailer-obra-de-teatro-06','atavicas-trailer-obra-de-teatro-07','atavicas-trailer-obra-de-teatro-08']::text[]),
  24,
  'borrador',
  null)
on conflict (idioma, slug) do update set titulo = excluded.titulo, tipo_id = excluded.tipo_id, categorias_extra = excluded.categorias_extra, anio = excluded.anio, direccion = excluded.direccion, productora = excluded.productora, papel = excluded.papel, camara = excluded.camara, tarjeta = excluded.tarjeta, historia = excluded.historia, como_lo_hicimos = excluded.como_lo_hicimos, el_reto = excluded.el_reto, el_resultado = excluded.el_resultado, con_juno = excluded.con_juno, videos = excluded.videos, imagen_id = excluded.imagen_id, galeria = excluded.galeria;

insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 100, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'atavicas-trailer-obra-de-teatro' and s.slug = 'filmmaker' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;
insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 101, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'atavicas-trailer-obra-de-teatro' and s.slug = 'edicion' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;

-- Consell Valencià de la Joventut, charla
insert into public.proyectos (slug, titulo, tipo_id, categorias_extra, anio, direccion, productora, papel, camara, tarjeta, historia, como_lo_hicimos, el_reto, el_resultado, con_juno, videos, imagen_id, galeria, orden, estado, publicado_en)
values (
  $t$consell-valencia-joventut-charla$t$,
  $t$Consell Valencià de la Joventut, charla$t$,
  (select id from public.tipos_proyecto where idioma = 'es' and slug = 'corporativo'),
  array(select id from public.tipos_proyecto where idioma = 'es' and slug in ('redes-sociales')),
  2025,
  $t$$t$,
  $t$Consell Valencià de la Joventut$t$,
  $t$Grabación y edición$t$,
  $t$Sony FX3 · ópticas Tamron y Sony$t$,
  $t$El resumen de una charla del Consell Valencià de la Joventut, en horizontal y en vertical para redes.$t$,
  $t$Para el Consell Valencià de la Joventut hice el vídeo resumen de una de sus charlas, en horizontal y en vertical, y una píldora para redes con los temas que se trataron. Grabamos entre Lara Ruiz Martín y yo.$t$,
  $t$$t$,
  $t$$t$,
  $t$$t$,
  false,
  $t$[]$t$::jsonb || jsonb_build_array(jsonb_build_object('tipo', 'archivo', 'rol', 'principal', 'titulo', $t$Vídeo resumen$t$, 'medio', pg_temp.med('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/consell-valencia-joventut-charla/videoresum-consell-horitzontal-v2.mp4'))),
  pg_temp.foto('consell-valencia-joventut-charla-01'),
  pg_temp.gal(array['consell-valencia-joventut-charla-01','consell-valencia-joventut-charla-02','consell-valencia-joventut-charla-03','consell-valencia-joventut-charla-04','consell-valencia-joventut-charla-05','consell-valencia-joventut-charla-06','consell-valencia-joventut-charla-07','consell-valencia-joventut-charla-08']::text[]),
  25,
  'borrador',
  null)
on conflict (idioma, slug) do update set titulo = excluded.titulo, tipo_id = excluded.tipo_id, categorias_extra = excluded.categorias_extra, anio = excluded.anio, direccion = excluded.direccion, productora = excluded.productora, papel = excluded.papel, camara = excluded.camara, tarjeta = excluded.tarjeta, historia = excluded.historia, como_lo_hicimos = excluded.como_lo_hicimos, el_reto = excluded.el_reto, el_resultado = excluded.el_resultado, con_juno = excluded.con_juno, videos = excluded.videos, imagen_id = excluded.imagen_id, galeria = excluded.galeria;

insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 100, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'consell-valencia-joventut-charla' and s.slug = 'filmmaker' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;
insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 101, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'consell-valencia-joventut-charla' and s.slug = 'edicion' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;

-- Diferens, encuentro de equipo
insert into public.proyectos (slug, titulo, tipo_id, categorias_extra, anio, direccion, productora, papel, camara, tarjeta, historia, como_lo_hicimos, el_reto, el_resultado, con_juno, videos, imagen_id, galeria, orden, estado, publicado_en)
values (
  $t$diferens-encuentro-2025$t$,
  $t$Diferens, encuentro de equipo$t$,
  (select id from public.tipos_proyecto where idioma = 'es' and slug = 'corporativo'),
  '{}'::uuid[],
  2025,
  $t$$t$,
  $t$Diferens$t$,
  $t$Grabación y edición$t$,
  $t$Sony FX3 · ópticas Tamron y Sony$t$,
  $t$El resumen de un encuentro muy emocional entre los trabajadores de Diferens.$t$,
  $t$Para JUNO Media hice el vídeo resumen del encuentro de Diferens, una reunión de sus trabajadores muy emocional y personal.$t$,
  $t$- **La emoción por delante.** El vídeo se centra en las personas y en lo que se vivió, más que en la agenda del día.$t$,
  $t$$t$,
  $t$$t$,
  true,
  $t$[]$t$::jsonb || jsonb_build_array(jsonb_build_object('tipo', 'archivo', 'rol', 'principal', 'titulo', $t$Vídeo resumen$t$, 'medio', pg_temp.med('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/diferens-encuentro-2025/diferens-2025-v1.mp4'))),
  pg_temp.foto('diferens-encuentro-2025-04'),
  pg_temp.gal(array['diferens-encuentro-2025-01','diferens-encuentro-2025-02','diferens-encuentro-2025-03','diferens-encuentro-2025-04','diferens-encuentro-2025-05','diferens-encuentro-2025-06','diferens-encuentro-2025-07','diferens-encuentro-2025-08']::text[]),
  26,
  'borrador',
  null)
on conflict (idioma, slug) do update set titulo = excluded.titulo, tipo_id = excluded.tipo_id, categorias_extra = excluded.categorias_extra, anio = excluded.anio, direccion = excluded.direccion, productora = excluded.productora, papel = excluded.papel, camara = excluded.camara, tarjeta = excluded.tarjeta, historia = excluded.historia, como_lo_hicimos = excluded.como_lo_hicimos, el_reto = excluded.el_reto, el_resultado = excluded.el_resultado, con_juno = excluded.con_juno, videos = excluded.videos, imagen_id = excluded.imagen_id, galeria = excluded.galeria;

insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 100, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'diferens-encuentro-2025' and s.slug = 'filmmaker' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;
insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 101, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'diferens-encuentro-2025' and s.slug = 'edicion' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;

-- El Xato
insert into public.proyectos (slug, titulo, tipo_id, categorias_extra, anio, direccion, productora, papel, camara, tarjeta, historia, como_lo_hicimos, el_reto, el_resultado, con_juno, videos, imagen_id, galeria, orden, estado, publicado_en)
values (
  $t$el-xato-evento-boda$t$,
  $t$El Xato$t$,
  (select id from public.tipos_proyecto where idioma = 'es' and slug = 'publicidad'),
  '{}'::uuid[],
  2026,
  $t$$t$,
  $t$El Xato$t$,
  $t$Grabación y edición$t$,
  $t$Sony FX3 · ópticas Tamron y Sony$t$,
  $t$Un restaurante con estrella Michelin haciendo de catering en una boda, contado paso a paso.$t$,
  $t$Para El Xato, de la mano de JUNO Media, grabé y edité un vídeo publicitario tipo evento. El restaurante, con estrella Michelin, hacía de catering en una boda, y el vídeo enseña el paso a paso de cómo prepara su servicio. El rodaje fue desde las ocho de la mañana hasta el final de la comida.$t$,
  $t$- **Paso a paso.** El vídeo sigue el orden real de la preparación, de la cocina a la mesa.
- **Dinámico.** Ritmo ágil para que se vea todo el trabajo sin que se haga largo.$t$,
  $t$Un día entero de rodaje, de las ocho de la mañana al final de la comida, sin perder ningún paso del servicio.$t$,
  $t$$t$,
  true,
  $t$[]$t$::jsonb || jsonb_build_array(jsonb_build_object('tipo', 'archivo', 'rol', 'principal', 'titulo', $t$Vídeo resumen$t$, 'medio', pg_temp.med('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/el-xato-evento-boda/videoresumen-evento-xato-v2.mp4'))),
  pg_temp.foto('el-xato-evento-boda-04'),
  pg_temp.gal(array['el-xato-evento-boda-01','el-xato-evento-boda-02','el-xato-evento-boda-03','el-xato-evento-boda-04','el-xato-evento-boda-05','el-xato-evento-boda-06','el-xato-evento-boda-07','el-xato-evento-boda-08']::text[]),
  27,
  'borrador',
  null)
on conflict (idioma, slug) do update set titulo = excluded.titulo, tipo_id = excluded.tipo_id, categorias_extra = excluded.categorias_extra, anio = excluded.anio, direccion = excluded.direccion, productora = excluded.productora, papel = excluded.papel, camara = excluded.camara, tarjeta = excluded.tarjeta, historia = excluded.historia, como_lo_hicimos = excluded.como_lo_hicimos, el_reto = excluded.el_reto, el_resultado = excluded.el_resultado, con_juno = excluded.con_juno, videos = excluded.videos, imagen_id = excluded.imagen_id, galeria = excluded.galeria;

insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 100, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'el-xato-evento-boda' and s.slug = 'filmmaker' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;
insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 101, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'el-xato-evento-boda' and s.slug = 'edicion' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;

-- Englobe
insert into public.proyectos (slug, titulo, tipo_id, categorias_extra, anio, direccion, productora, papel, camara, tarjeta, historia, como_lo_hicimos, el_reto, el_resultado, con_juno, videos, imagen_id, galeria, orden, estado, publicado_en)
values (
  $t$englobe-evento-redes$t$,
  $t$Englobe$t$,
  (select id from public.tipos_proyecto where idioma = 'es' and slug = 'redes-sociales'),
  '{}'::uuid[],
  2026,
  $t$$t$,
  $t$Englobe$t$,
  $t$Edición de vídeo y fotos$t$,
  $t$$t$,
  $t$El vídeo y las fotos del evento Englobe, editados para redes.$t$,
  $t$Para JUNO Media edité el vídeo y las fotos de un evento de Englobe, pensados para redes.$t$,
  $t$$t$,
  $t$$t$,
  $t$$t$,
  true,
  $t$[]$t$::jsonb || jsonb_build_array(jsonb_build_object('tipo', 'archivo', 'rol', 'principal','vertical', true, 'titulo', $t$Englobe$t$, 'medio', pg_temp.med('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/englobe-evento-redes/englobe-v4.mp4'))),
  pg_temp.foto('englobe-evento-redes-03'),
  pg_temp.gal(array['englobe-evento-redes-01','englobe-evento-redes-02','englobe-evento-redes-03','englobe-evento-redes-04','englobe-evento-redes-05','englobe-evento-redes-06','englobe-evento-redes-07','englobe-evento-redes-08']::text[]),
  28,
  'borrador',
  null)
on conflict (idioma, slug) do update set titulo = excluded.titulo, tipo_id = excluded.tipo_id, categorias_extra = excluded.categorias_extra, anio = excluded.anio, direccion = excluded.direccion, productora = excluded.productora, papel = excluded.papel, camara = excluded.camara, tarjeta = excluded.tarjeta, historia = excluded.historia, como_lo_hicimos = excluded.como_lo_hicimos, el_reto = excluded.el_reto, el_resultado = excluded.el_resultado, con_juno = excluded.con_juno, videos = excluded.videos, imagen_id = excluded.imagen_id, galeria = excluded.galeria;

insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 100, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'englobe-evento-redes' and s.slug = 'edicion' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;

-- EP Color, Adrián Muñoz
insert into public.proyectos (slug, titulo, tipo_id, categorias_extra, anio, direccion, productora, papel, camara, tarjeta, historia, como_lo_hicimos, el_reto, el_resultado, con_juno, videos, imagen_id, galeria, orden, estado, publicado_en)
values (
  $t$ep-color-adrian-munoz$t$,
  $t$EP Color, Adrián Muñoz$t$,
  (select id from public.tipos_proyecto where idioma = 'es' and slug = 'videoclip'),
  '{}'::uuid[],
  2026,
  $t$$t$,
  $t$JUNO Media$t$,
  $t$Dirección de fotografía, grabación y edición$t$,
  $t$Sony FX3 · luces Aputure (1200 y dos 600)$t$,
  $t$El tráiler del EP Color, pensado como el reflejo exacto del de Oscuridad.$t$,
  $t$Tráiler del nuevo EP de Adrián Muñoz, Color, para JUNO Media. Hice la dirección de fotografía, la grabación y la edición. En la preproducción trabajó Noelia Fluxà y en el rodaje me acompañó Lara Ruiz Martín como eléctrica.$t$,
  $t$- **El antónimo de Oscuridad.** Allí, el cantante se hundía en un líquido negro, en blanco y negro. Aquí, todo lo contrario.
- **Líquido blanco, de yogur.** Buscamos una mezcla espesa para que se comportara como el líquido negro del primer tráiler.
- **Fondo blanco y color.** La imagen deja el blanco y negro y se va al color.
- **Tomas espejo.** Planos paralelos a los del tráiler de Oscuridad, para que las dos piezas dialoguen.$t$,
  $t$El artista se manchaba en cada toma. Había poco tiempo para sacar las mejores, y además las tomas espejo del tráiler anterior.$t$,
  $t$$t$,
  true,
  $t$[]$t$::jsonb || jsonb_build_array(jsonb_build_object('tipo', 'archivo', 'rol', 'principal', 'titulo', $t$Tráiler$t$, 'medio', pg_temp.med('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/ep-color-adrian-munoz/trailer-color-adrianmunoz-v2.mp4'))),
  pg_temp.foto('ep-color-adrian-munoz-03'),
  pg_temp.gal(array['ep-color-adrian-munoz-01','ep-color-adrian-munoz-02','ep-color-adrian-munoz-03','ep-color-adrian-munoz-04','ep-color-adrian-munoz-05','ep-color-adrian-munoz-06','ep-color-adrian-munoz-07','ep-color-adrian-munoz-08']::text[]),
  29,
  'borrador',
  null)
on conflict (idioma, slug) do update set titulo = excluded.titulo, tipo_id = excluded.tipo_id, categorias_extra = excluded.categorias_extra, anio = excluded.anio, direccion = excluded.direccion, productora = excluded.productora, papel = excluded.papel, camara = excluded.camara, tarjeta = excluded.tarjeta, historia = excluded.historia, como_lo_hicimos = excluded.como_lo_hicimos, el_reto = excluded.el_reto, el_resultado = excluded.el_resultado, con_juno = excluded.con_juno, videos = excluded.videos, imagen_id = excluded.imagen_id, galeria = excluded.galeria;

insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 100, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'ep-color-adrian-munoz' and s.slug = 'direccion-de-fotografia' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;
insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 101, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'ep-color-adrian-munoz' and s.slug = 'filmmaker' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;
insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 102, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'ep-color-adrian-munoz' and s.slug = 'edicion' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;

-- El Langui con Grupo LON
insert into public.proyectos (slug, titulo, tipo_id, categorias_extra, anio, direccion, productora, papel, camara, tarjeta, historia, como_lo_hicimos, el_reto, el_resultado, con_juno, videos, imagen_id, galeria, orden, estado, publicado_en)
values (
  $t$evento-grupo-lon-el-langui$t$,
  $t$El Langui con Grupo LON$t$,
  (select id from public.tipos_proyecto where idioma = 'es' and slug = 'publicidad'),
  array(select id from public.tipos_proyecto where idioma = 'es' and slug in ('redes-sociales')),
  2026,
  $t$$t$,
  $t$Grupo LON$t$,
  $t$Grabación y edición$t$,
  $t$Sony FX3 · ópticas Tamron y Sony$t$,
  $t$La ponencia de El Langui para Grupo LON: un evento inclusivo y con muy buen rollo.$t$,
  $t$Para JUNO Media grabé y edité el vídeo de la ponencia de El Langui con Grupo LON, en La Nucía. Un evento inclusivo, enfocado a personas con discapacidad. La idea era enseñar el buen rollo que había, en un vídeo para redes.$t$,
  $t$- **El buen rollo como hilo.** Todo el vídeo busca transmitir el ambiente del evento.
- **Pensado para redes.** Formato y ritmo de redes sociales.$t$,
  $t$$t$,
  $t$$t$,
  true,
  $t$[]$t$::jsonb || jsonb_build_array(jsonb_build_object('tipo', 'archivo', 'rol', 'principal','vertical', true, 'titulo', $t$El Langui con Grupo LON$t$, 'medio', pg_temp.med('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/evento-grupo-lon-el-langui/encuentros-lon-langui-v1.mp4'))),
  pg_temp.foto('evento-grupo-lon-el-langui-04'),
  pg_temp.gal(array['evento-grupo-lon-el-langui-01','evento-grupo-lon-el-langui-02','evento-grupo-lon-el-langui-03','evento-grupo-lon-el-langui-04','evento-grupo-lon-el-langui-05','evento-grupo-lon-el-langui-06']::text[]),
  30,
  'borrador',
  null)
on conflict (idioma, slug) do update set titulo = excluded.titulo, tipo_id = excluded.tipo_id, categorias_extra = excluded.categorias_extra, anio = excluded.anio, direccion = excluded.direccion, productora = excluded.productora, papel = excluded.papel, camara = excluded.camara, tarjeta = excluded.tarjeta, historia = excluded.historia, como_lo_hicimos = excluded.como_lo_hicimos, el_reto = excluded.el_reto, el_resultado = excluded.el_resultado, con_juno = excluded.con_juno, videos = excluded.videos, imagen_id = excluded.imagen_id, galeria = excluded.galeria;

insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 100, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'evento-grupo-lon-el-langui' and s.slug = 'filmmaker' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;
insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 101, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'evento-grupo-lon-el-langui' and s.slug = 'edicion' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;

-- Shimano Super Cup Massi, La Nucía (ya existía: se renueva)
update public.proyectos set
  titulo = $t$Shimano Super Cup Massi, La Nucía$t$,
  tipo_id = (select id from public.tipos_proyecto where idioma = 'es' and slug = 'eventos'),
  categorias_extra = array(select id from public.tipos_proyecto where idioma = 'es' and slug in ('redes-sociales')),
  anio = 2026,
  direccion = $t$$t$,
  productora = $t$Ocisport$t$,
  papel = $t$Filmmaker y edición$t$,
  camara = $t$Sony FX3 · ópticas Tamron y Sony$t$,
  tarjeta = $t$Ciclismo de montaña de élite grabado a pie de pista para Ocisport. Dos ediciones, emitidas en À Punt.$t$,
  historia = $t$He cubierto para Ocisport las ediciones de 2025 y 2026 de la Shimano Super Cup Massi, en La Nucía. La carrera no se repite, así que casi todo depende de dónde me coloque. De cada edición salen piezas para televisión y para redes.$t$,
  como_lo_hicimos = $t$- **Elegir sitio.** Me coloco en los puntos más espectaculares del circuito.
- **Cámara rápida y cerrada.** Seguimiento preciso para que se note la velocidad.
- **Sonido realzado.** Ruedas, esfuerzo y público sobre una base musical fuerte.
- **Un pack por canal.** Piezas con calidad de emisión y reels para redes.$t$,
  el_reto = $t$Estar en el sitio justo en el momento justo y condensar la carrera sin perder tensión.$t$,
  el_resultado = $t$- Emitido en À Punt.
- Publicado en las redes de la competición.$t$,
  con_juno = false,
  videos = $t$[]$t$::jsonb || jsonb_build_array(jsonb_build_object('tipo', 'archivo',  'titulo', $t$Aftermovie$t$, 'medio', pg_temp.med('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/eventos-deportivos/aftermovie-supercupmassi-lanucia-horizontal-v1.mp4')), jsonb_build_object('tipo', 'archivo',  'titulo', $t$Resumen para À Punt$t$, 'medio', pg_temp.med('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/eventos-deportivos/compactat-supercup-lanucia-tv-apunt.mp4'))),
  galeria = galeria || (select coalesce(jsonb_agg(g), '[]'::jsonb) from jsonb_array_elements(pg_temp.gal(array['eventos-deportivos-01','eventos-deportivos-02','eventos-deportivos-03','eventos-deportivos-04','eventos-deportivos-05','eventos-deportivos-06','eventos-deportivos-07','eventos-deportivos-08']::text[])) g
    where not galeria @> jsonb_build_array(jsonb_build_object('medio', g ->> 'medio')))
where idioma = 'es' and slug = 'eventos-deportivos';

insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 100, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'eventos-deportivos' and s.slug = 'filmmaker' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;
insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 101, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'eventos-deportivos' and s.slug = 'edicion' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;

-- Flama, aftermovie
insert into public.proyectos (slug, titulo, tipo_id, categorias_extra, anio, direccion, productora, papel, camara, tarjeta, historia, como_lo_hicimos, el_reto, el_resultado, con_juno, videos, imagen_id, galeria, orden, estado, publicado_en)
values (
  $t$flama-aftermovie$t$,
  $t$Flama, aftermovie$t$,
  (select id from public.tipos_proyecto where idioma = 'es' and slug = 'conciertos'),
  '{}'::uuid[],
  2026,
  $t$$t$,
  $t$Flama (SOM Events)$t$,
  $t$Grabación y montaje$t$,
  $t$Sony FX3 · ópticas Tamron y Sony$t$,
  $t$Aftermovie oficial de Flama.$t$,
  $t$Para JUNO Media. Aftermovie oficial de Flama. Es otra noche, distinta a la del vídeo de Benissa. Cada vídeo busca enseñar al máximo lo que da la orquesta y su energía.$t$,
  $t$$t$,
  $t$$t$,
  $t$$t$,
  true,
  $t$[]$t$::jsonb || jsonb_build_array(jsonb_build_object('tipo', 'archivo', 'rol', 'principal', 'titulo', $t$Aftermovie$t$, 'medio', pg_temp.med('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/flama-aftermovie/aftermovie-flama-2026-v03.mp4'))),
  pg_temp.foto('flama-aftermovie-01'),
  pg_temp.gal(array['flama-aftermovie-01','flama-aftermovie-02','flama-aftermovie-03','flama-aftermovie-04','flama-aftermovie-05','flama-aftermovie-06','flama-aftermovie-07','flama-aftermovie-08']::text[]),
  32,
  'borrador',
  null)
on conflict (idioma, slug) do update set titulo = excluded.titulo, tipo_id = excluded.tipo_id, categorias_extra = excluded.categorias_extra, anio = excluded.anio, direccion = excluded.direccion, productora = excluded.productora, papel = excluded.papel, camara = excluded.camara, tarjeta = excluded.tarjeta, historia = excluded.historia, como_lo_hicimos = excluded.como_lo_hicimos, el_reto = excluded.el_reto, el_resultado = excluded.el_resultado, con_juno = excluded.con_juno, videos = excluded.videos, imagen_id = excluded.imagen_id, galeria = excluded.galeria;

insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 100, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'flama-aftermovie' and s.slug = 'filmmaker' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;
insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 101, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'flama-aftermovie' and s.slug = 'edicion' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;

-- Flama, Benissa
insert into public.proyectos (slug, titulo, tipo_id, categorias_extra, anio, direccion, productora, papel, camara, tarjeta, historia, como_lo_hicimos, el_reto, el_resultado, con_juno, videos, imagen_id, galeria, orden, estado, publicado_en)
values (
  $t$flama-benissa-video-oficial$t$,
  $t$Flama, Benissa$t$,
  (select id from public.tipos_proyecto where idioma = 'es' and slug = 'conciertos'),
  '{}'::uuid[],
  2026,
  $t$$t$,
  $t$Flama (SOM Events)$t$,
  $t$Grabación y montaje$t$,
  $t$Sony FX3 · ópticas Tamron y Sony$t$,
  $t$Vídeo oficial del concierto de Flama en Benissa.$t$,
  $t$Para JUNO Media. Vídeo oficial del concierto de Flama en Benissa. Cada vídeo busca enseñar al máximo lo que da la orquesta y su energía.$t$,
  $t$$t$,
  $t$$t$,
  $t$$t$,
  true,
  $t$[]$t$::jsonb || jsonb_build_array(jsonb_build_object('tipo', 'archivo', 'rol', 'principal', 'titulo', $t$Vídeo oficial$t$, 'medio', pg_temp.med('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/flama-benissa-video-oficial/videoresumen-flama-benissa-v3.mp4'))),
  pg_temp.foto('flama-benissa-video-oficial-03'),
  pg_temp.gal(array['flama-benissa-video-oficial-01','flama-benissa-video-oficial-02','flama-benissa-video-oficial-03','flama-benissa-video-oficial-04','flama-benissa-video-oficial-05','flama-benissa-video-oficial-06','flama-benissa-video-oficial-07','flama-benissa-video-oficial-08']::text[]),
  33,
  'borrador',
  null)
on conflict (idioma, slug) do update set titulo = excluded.titulo, tipo_id = excluded.tipo_id, categorias_extra = excluded.categorias_extra, anio = excluded.anio, direccion = excluded.direccion, productora = excluded.productora, papel = excluded.papel, camara = excluded.camara, tarjeta = excluded.tarjeta, historia = excluded.historia, como_lo_hicimos = excluded.como_lo_hicimos, el_reto = excluded.el_reto, el_resultado = excluded.el_resultado, con_juno = excluded.con_juno, videos = excluded.videos, imagen_id = excluded.imagen_id, galeria = excluded.galeria;

insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 100, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'flama-benissa-video-oficial' and s.slug = 'filmmaker' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;
insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 101, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'flama-benissa-video-oficial' and s.slug = 'edicion' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;

-- Flama, vídeo de presentación con IA
insert into public.proyectos (slug, titulo, tipo_id, categorias_extra, anio, direccion, productora, papel, camara, tarjeta, historia, como_lo_hicimos, el_reto, el_resultado, con_juno, videos, imagen_id, galeria, orden, estado, publicado_en)
values (
  $t$flama-contenido-cinematografico-ia$t$,
  $t$Flama, vídeo de presentación con IA$t$,
  (select id from public.tipos_proyecto where idioma = 'es' and slug = 'visuales-e-ia'),
  '{}'::uuid[],
  2026,
  $t$$t$,
  $t$Flama (SOM Events)$t$,
  $t$Idea, generación con IA y montaje$t$,
  $t$$t$,
  $t$El vídeo de presentación de los conciertos de Flama, creado con inteligencia artificial para las pantallas.$t$,
  $t$Flama quería contar su propia historia en las pantallas de sus conciertos. Hice el vídeo de presentación con inteligencia artificial: imágenes con Nano Banana Pro, clips con Veo 3 de Google y música de Artlist. Dura en torno a un minuto.$t$,
  $t$- **Primero, lo que necesita el cliente.** Lo más importante del proceso fue encontrar con Flama qué querían contar y llevarlo a cabo.
- **Imágenes antes que vídeo.** Creo los fotogramas con Nano Banana Pro y los animo con Veo 3.
- **Montaje con música.** Monto los clips en el programa de edición sobre una música de Artlist.$t$,
  $t$La coherencia entre planos. Los modelos de entonces todavía no mantenían bien a los personajes y los espacios de un plano a otro, y había que conseguirlo igualmente.$t$,
  $t$$t$,
  true,
  $t$[]$t$::jsonb || jsonb_build_array(jsonb_build_object('tipo', 'archivo', 'rol', 'principal', 'titulo', $t$Foc i Flama$t$, 'medio', pg_temp.med('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/flama-contenido-cinematografico-ia/video-flama-pantallas-v5.mp4'))),
  pg_temp.foto('flama-contenido-cinematografico-ia-02'),
  pg_temp.gal(array['flama-contenido-cinematografico-ia-01','flama-contenido-cinematografico-ia-02','flama-contenido-cinematografico-ia-03','flama-contenido-cinematografico-ia-04','flama-contenido-cinematografico-ia-05','flama-contenido-cinematografico-ia-06','flama-contenido-cinematografico-ia-07','flama-contenido-cinematografico-ia-08']::text[]),
  34,
  'borrador',
  null)
on conflict (idioma, slug) do update set titulo = excluded.titulo, tipo_id = excluded.tipo_id, categorias_extra = excluded.categorias_extra, anio = excluded.anio, direccion = excluded.direccion, productora = excluded.productora, papel = excluded.papel, camara = excluded.camara, tarjeta = excluded.tarjeta, historia = excluded.historia, como_lo_hicimos = excluded.como_lo_hicimos, el_reto = excluded.el_reto, el_resultado = excluded.el_resultado, con_juno = excluded.con_juno, videos = excluded.videos, imagen_id = excluded.imagen_id, galeria = excluded.galeria;

insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 100, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'flama-contenido-cinematografico-ia' and s.slug = 'edicion' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;

-- Flama, La Nucía
insert into public.proyectos (slug, titulo, tipo_id, categorias_extra, anio, direccion, productora, papel, camara, tarjeta, historia, como_lo_hicimos, el_reto, el_resultado, con_juno, videos, imagen_id, galeria, orden, estado, publicado_en)
values (
  $t$flama-la-nucia-video-oficial$t$,
  $t$Flama, La Nucía$t$,
  (select id from public.tipos_proyecto where idioma = 'es' and slug = 'conciertos'),
  '{}'::uuid[],
  2026,
  $t$$t$,
  $t$Flama (SOM Events)$t$,
  $t$Grabación y montaje$t$,
  $t$Sony FX3 · ópticas Tamron y Sony$t$,
  $t$Vídeo oficial del concierto de Flama en La Nucía.$t$,
  $t$Para JUNO Media. Vídeo oficial del concierto de Flama en La Nucía. Cada vídeo busca enseñar al máximo lo que da la orquesta y su energía.$t$,
  $t$$t$,
  $t$$t$,
  $t$$t$,
  true,
  $t$[]$t$::jsonb || jsonb_build_array(jsonb_build_object('tipo', 'archivo', 'rol', 'principal', 'titulo', $t$Vídeo oficial$t$, 'medio', pg_temp.med('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/flama-la-nucia-video-oficial/flama-lanucia-v3.mp4'))),
  pg_temp.foto('flama-la-nucia-video-oficial-04'),
  pg_temp.gal(array['flama-la-nucia-video-oficial-01','flama-la-nucia-video-oficial-02','flama-la-nucia-video-oficial-03','flama-la-nucia-video-oficial-04','flama-la-nucia-video-oficial-05','flama-la-nucia-video-oficial-06','flama-la-nucia-video-oficial-07','flama-la-nucia-video-oficial-08']::text[]),
  35,
  'borrador',
  null)
on conflict (idioma, slug) do update set titulo = excluded.titulo, tipo_id = excluded.tipo_id, categorias_extra = excluded.categorias_extra, anio = excluded.anio, direccion = excluded.direccion, productora = excluded.productora, papel = excluded.papel, camara = excluded.camara, tarjeta = excluded.tarjeta, historia = excluded.historia, como_lo_hicimos = excluded.como_lo_hicimos, el_reto = excluded.el_reto, el_resultado = excluded.el_resultado, con_juno = excluded.con_juno, videos = excluded.videos, imagen_id = excluded.imagen_id, galeria = excluded.galeria;

insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 100, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'flama-la-nucia-video-oficial' and s.slug = 'filmmaker' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;
insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 101, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'flama-la-nucia-video-oficial' and s.slug = 'edicion' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;

-- ForecourtTech 2025
insert into public.proyectos (slug, titulo, tipo_id, categorias_extra, anio, direccion, productora, papel, camara, tarjeta, historia, como_lo_hicimos, el_reto, el_resultado, con_juno, videos, imagen_id, galeria, orden, estado, publicado_en)
values (
  $t$forecourttech-2025$t$,
  $t$ForecourtTech 2025$t$,
  (select id from public.tipos_proyecto where idioma = 'es' and slug = 'corporativo'),
  '{}'::uuid[],
  2025,
  $t$$t$,
  $t$ForecourtTech$t$,
  $t$Grabación y edición$t$,
  $t$Sony FX3 · ópticas Tamron y Sony$t$,
  $t$El vídeo resumen de ForecourtTech 2025, el congreso anual sobre tecnología para estaciones de servicio, en Alicante.$t$,
  $t$Para JUNO Media hice el vídeo resumen de ForecourtTech 2025, el congreso anual sobre tecnología para estaciones de servicio y tiendas de conveniencia. Se celebró el 1 y 2 de octubre en el hotel Asia Gardens, en Alicante. Ponencias, reuniones de uno a uno entre empresas, entrevistas a los asistentes y las cenas de networking, todo en inglés y montado en un solo vídeo. Llevo tres ediciones seguidas con este evento: 2024, 2025 y 2026.$t$,
  $t$$t$,
  $t$$t$,
  $t$$t$,
  true,
  $t$[]$t$::jsonb || jsonb_build_array(jsonb_build_object('tipo', 'archivo', 'rol', 'principal', 'titulo', $t$Vídeo resumen$t$, 'medio', pg_temp.med('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/forecourttech-2025/forecourttech-2025-v3-withlogo.mp4'))),
  pg_temp.foto('forecourttech-2025-05'),
  pg_temp.gal(array['forecourttech-2025-01','forecourttech-2025-02','forecourttech-2025-03','forecourttech-2025-04','forecourttech-2025-05','forecourttech-2025-06','forecourttech-2025-07']::text[]),
  36,
  'borrador',
  null)
on conflict (idioma, slug) do update set titulo = excluded.titulo, tipo_id = excluded.tipo_id, categorias_extra = excluded.categorias_extra, anio = excluded.anio, direccion = excluded.direccion, productora = excluded.productora, papel = excluded.papel, camara = excluded.camara, tarjeta = excluded.tarjeta, historia = excluded.historia, como_lo_hicimos = excluded.como_lo_hicimos, el_reto = excluded.el_reto, el_resultado = excluded.el_resultado, con_juno = excluded.con_juno, videos = excluded.videos, imagen_id = excluded.imagen_id, galeria = excluded.galeria;

insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 100, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'forecourttech-2025' and s.slug = 'filmmaker' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;
insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 101, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'forecourttech-2025' and s.slug = 'edicion' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;

-- Formación de Mario Bravo, vídeo promocional
insert into public.proyectos (slug, titulo, tipo_id, categorias_extra, anio, direccion, productora, papel, camara, tarjeta, historia, como_lo_hicimos, el_reto, el_resultado, con_juno, videos, imagen_id, galeria, orden, estado, publicado_en)
values (
  $t$formacion-mario-bravo$t$,
  $t$Formación de Mario Bravo, vídeo promocional$t$,
  (select id from public.tipos_proyecto where idioma = 'es' and slug = 'publicidad'),
  '{}'::uuid[],
  2025,
  $t$$t$,
  $t$Mario Bravo$t$,
  $t$Grabación y edición$t$,
  $t$Sony FX3 · ópticas Tamron y Sony$t$,
  $t$El vídeo promocional de una formación para agentes inmobiliarios, en horizontal y en vertical.$t$,
  $t$Mario Bravo se dedica al crecimiento estratégico de agencias inmobiliarias. Para JUNO Media grabé una de sus formaciones para agentes y la convertí en un vídeo promocional, con la sesión, el trabajo en grupo y la opinión de los asistentes. Lo entregué en horizontal y en vertical.$t$,
  $t$$t$,
  $t$$t$,
  $t$$t$,
  true,
  $t$[]$t$::jsonb || jsonb_build_array(jsonb_build_object('tipo', 'archivo', 'rol', 'principal', 'titulo', $t$Vídeo promocional$t$, 'medio', pg_temp.med('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/formacion-mario-bravo/formacion-mario-bravo.mp4'))),
  pg_temp.foto('formacion-mario-bravo-04'),
  pg_temp.gal(array['formacion-mario-bravo-01','formacion-mario-bravo-02','formacion-mario-bravo-03','formacion-mario-bravo-04','formacion-mario-bravo-05','formacion-mario-bravo-06','formacion-mario-bravo-07']::text[]),
  37,
  'borrador',
  null)
on conflict (idioma, slug) do update set titulo = excluded.titulo, tipo_id = excluded.tipo_id, categorias_extra = excluded.categorias_extra, anio = excluded.anio, direccion = excluded.direccion, productora = excluded.productora, papel = excluded.papel, camara = excluded.camara, tarjeta = excluded.tarjeta, historia = excluded.historia, como_lo_hicimos = excluded.como_lo_hicimos, el_reto = excluded.el_reto, el_resultado = excluded.el_resultado, con_juno = excluded.con_juno, videos = excluded.videos, imagen_id = excluded.imagen_id, galeria = excluded.galeria;

insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 100, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'formacion-mario-bravo' and s.slug = 'filmmaker' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;
insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 101, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'formacion-mario-bravo' and s.slug = 'edicion' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;

-- Aniversario de Frimar
insert into public.proyectos (slug, titulo, tipo_id, categorias_extra, anio, direccion, productora, papel, camara, tarjeta, historia, como_lo_hicimos, el_reto, el_resultado, con_juno, videos, imagen_id, galeria, orden, estado, publicado_en)
values (
  $t$frimar-evento-fotografia$t$,
  $t$Aniversario de Frimar$t$,
  (select id from public.tipos_proyecto where idioma = 'es' and slug = 'corporativo'),
  '{}'::uuid[],
  2026,
  $t$$t$,
  $t$Frimar$t$,
  $t$Fotografía del evento$t$,
  $t$Sony A9 · Tamron 28-75$t$,
  $t$Fotografía del aniversario de Frimar en el hotel Luxor de Terra Mítica: la emoción del día, sin posados.$t$,
  $t$Frimar celebró su aniversario en el hotel Luxor de Terra Mítica, un evento con mucha carga emocional. Hice las fotografías para que ese día se pudiera recordar como se vivió.$t$,
  $t$- **Pasar desapercibido.** Cuanto menos se nota la cámara, más natural es lo que pasa delante.
- **Buscar la emoción.** No pido posados: espero el momento en que aparece.
- **Un recuerdo bonito.** Elijo las fotos que mejor devuelven lo que se sintió.
- **Alta calidad.** Fotos pensadas para guardarse y ampliarse.$t$,
  $t$Captar la emoción de un evento privado sin interrumpirlo.$t$,
  $t$$t$,
  false,
  $t$[]$t$::jsonb,
  pg_temp.foto('frimar-evento-fotografia-01'),
  pg_temp.gal(array['frimar-evento-fotografia-01','frimar-evento-fotografia-02','frimar-evento-fotografia-03']::text[]),
  38,
  'borrador',
  now())
on conflict (idioma, slug) do update set titulo = excluded.titulo, tipo_id = excluded.tipo_id, categorias_extra = excluded.categorias_extra, anio = excluded.anio, direccion = excluded.direccion, productora = excluded.productora, papel = excluded.papel, camara = excluded.camara, tarjeta = excluded.tarjeta, historia = excluded.historia, como_lo_hicimos = excluded.como_lo_hicimos, el_reto = excluded.el_reto, el_resultado = excluded.el_resultado, con_juno = excluded.con_juno, videos = excluded.videos, imagen_id = excluded.imagen_id, galeria = excluded.galeria;

insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 100, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'frimar-evento-fotografia' and s.slug = 'filmmaker' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;

-- La Vibra
insert into public.proyectos (slug, titulo, tipo_id, categorias_extra, anio, direccion, productora, papel, camara, tarjeta, historia, como_lo_hicimos, el_reto, el_resultado, con_juno, videos, imagen_id, galeria, orden, estado, publicado_en)
values (
  $t$la-vibra-video-oficial$t$,
  $t$La Vibra$t$,
  (select id from public.tipos_proyecto where idioma = 'es' and slug = 'conciertos'),
  '{}'::uuid[],
  2026,
  $t$$t$,
  $t$Orquesta La Vibra (Mapache Events)$t$,
  $t$Grabación y montaje$t$,
  $t$Sony FX3 · ópticas Tamron y Sony$t$,
  $t$Vídeo oficial de la orquesta La Vibra.$t$,
  $t$Para JUNO Media. Vídeo oficial de la orquesta La Vibra. Cada vídeo busca enseñar al máximo lo que da la orquesta y su energía.$t$,
  $t$$t$,
  $t$$t$,
  $t$$t$,
  true,
  $t$[]$t$::jsonb || jsonb_build_array(jsonb_build_object('tipo', 'archivo', 'rol', 'principal', 'titulo', $t$Vídeo oficial$t$, 'medio', pg_temp.med('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/la-vibra-video-oficial/video-oficial-lavibra-v3.mp4'))),
  pg_temp.foto('la-vibra-video-oficial-05'),
  pg_temp.gal(array['la-vibra-video-oficial-01','la-vibra-video-oficial-02','la-vibra-video-oficial-03','la-vibra-video-oficial-04','la-vibra-video-oficial-05','la-vibra-video-oficial-06','la-vibra-video-oficial-07','la-vibra-video-oficial-08']::text[]),
  39,
  'borrador',
  null)
on conflict (idioma, slug) do update set titulo = excluded.titulo, tipo_id = excluded.tipo_id, categorias_extra = excluded.categorias_extra, anio = excluded.anio, direccion = excluded.direccion, productora = excluded.productora, papel = excluded.papel, camara = excluded.camara, tarjeta = excluded.tarjeta, historia = excluded.historia, como_lo_hicimos = excluded.como_lo_hicimos, el_reto = excluded.el_reto, el_resultado = excluded.el_resultado, con_juno = excluded.con_juno, videos = excluded.videos, imagen_id = excluded.imagen_id, galeria = excluded.galeria;

insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 100, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'la-vibra-video-oficial' and s.slug = 'filmmaker' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;
insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 101, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'la-vibra-video-oficial' and s.slug = 'edicion' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;

-- Lavandería de Grupo LON
insert into public.proyectos (slug, titulo, tipo_id, categorias_extra, anio, direccion, productora, papel, camara, tarjeta, historia, como_lo_hicimos, el_reto, el_resultado, con_juno, videos, imagen_id, galeria, orden, estado, publicado_en)
values (
  $t$lavanderia-grupo-lon$t$,
  $t$Lavandería de Grupo LON$t$,
  (select id from public.tipos_proyecto where idioma = 'es' and slug = 'publicidad'),
  array(select id from public.tipos_proyecto where idioma = 'es' and slug in ('redes-sociales')),
  2026,
  $t$$t$,
  $t$Grupo LON$t$,
  $t$Edición$t$,
  $t$$t$,
  $t$Entrevistas y fábrica convertidas en píldoras para redes, para la lavandería de Grupo LON.$t$,
  $t$Para la lavandería de Grupo LON, en Xeraco y La Nucía, edité un vídeo principal con entrevistas y una serie de vídeos para redes. Lo grabaron Noelia Fluxà y Paula.$t$,
  $t$- **Ordenar el material.** Primero, poner todo en orden y escoger lo mejor de cada entrevista.
- **Lo que la empresa quiere decir.** Selecciono las frases que transmiten justo eso.
- **Píldoras para redes.** Piezas cortas que mezclan las entrevistas con recursos de las propias fábricas.$t$,
  $t$Convertir horas de entrevistas en píldoras cortas que la empresa pudiera usar en redes.$t$,
  $t$$t$,
  true,
  $t$[]$t$::jsonb || jsonb_build_array(jsonb_build_object('tipo', 'archivo', 'vertical', true, 'titulo', $t$Reel 1$t$, 'medio', pg_temp.med('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/lavanderia-grupo-lon/reel1-lon-v2.mp4')), jsonb_build_object('tipo', 'archivo', 'vertical', true, 'titulo', $t$Reel 4$t$, 'medio', pg_temp.med('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/lavanderia-grupo-lon/reel4-lon-v2.mp4'))),
  pg_temp.foto('lavanderia-grupo-lon-01'),
  pg_temp.gal(array['lavanderia-grupo-lon-01','lavanderia-grupo-lon-02','lavanderia-grupo-lon-03','lavanderia-grupo-lon-04','lavanderia-grupo-lon-05','lavanderia-grupo-lon-06','lavanderia-grupo-lon-07']::text[]),
  40,
  'borrador',
  null)
on conflict (idioma, slug) do update set titulo = excluded.titulo, tipo_id = excluded.tipo_id, categorias_extra = excluded.categorias_extra, anio = excluded.anio, direccion = excluded.direccion, productora = excluded.productora, papel = excluded.papel, camara = excluded.camara, tarjeta = excluded.tarjeta, historia = excluded.historia, como_lo_hicimos = excluded.como_lo_hicimos, el_reto = excluded.el_reto, el_resultado = excluded.el_resultado, con_juno = excluded.con_juno, videos = excluded.videos, imagen_id = excluded.imagen_id, galeria = excluded.galeria;

insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 100, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'lavanderia-grupo-lon' and s.slug = 'edicion' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;

-- Locos de Atar, el último concierto
insert into public.proyectos (slug, titulo, tipo_id, categorias_extra, anio, direccion, productora, papel, camara, tarjeta, historia, como_lo_hicimos, el_reto, el_resultado, con_juno, videos, imagen_id, galeria, orden, estado, publicado_en)
values (
  $t$locos-de-atar-ultimo-concierto$t$,
  $t$Locos de Atar, el último concierto$t$,
  (select id from public.tipos_proyecto where idioma = 'es' and slug = 'conciertos'),
  '{}'::uuid[],
  2025,
  $t$$t$,
  $t$Locos de Atar$t$,
  $t$Grabación y edición$t$,
  $t$Sony FX3 · ópticas Tamron y Sony$t$,
  $t$El último concierto de Locos de Atar antes de despedirse para siempre.$t$,
  $t$Me lo encargó JuanMi, el cantante del grupo: el vídeo resumen del concierto de Locos de Atar de 2025, el último antes de parar para siempre. Había que captar la emoción del cantante, de la banda y del público. Lara me ayudó como auxiliar.$t$,
  $t$- **Tres emociones.** El cantante, la banda y el público, cada uno con su espacio en el montaje.
- **Una despedida.** El vídeo tenía que guardar lo que significó esa noche para todos.$t$,
  $t$Grabar una noche que no se iba a repetir, sabiendo que era la última.$t$,
  $t$$t$,
  false,
  $t$[]$t$::jsonb || jsonb_build_array(jsonb_build_object('tipo', 'archivo', 'rol', 'principal', 'titulo', $t$El último concierto$t$, 'medio', pg_temp.med('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/locos-de-atar-ultimo-concierto/videoresumen-concierto-lda-v1.mp4'))),
  pg_temp.foto('locos-de-atar-ultimo-concierto-03'),
  pg_temp.gal(array['locos-de-atar-ultimo-concierto-01','locos-de-atar-ultimo-concierto-02','locos-de-atar-ultimo-concierto-03','locos-de-atar-ultimo-concierto-04','locos-de-atar-ultimo-concierto-05','locos-de-atar-ultimo-concierto-06','locos-de-atar-ultimo-concierto-07','locos-de-atar-ultimo-concierto-08']::text[]),
  41,
  'borrador',
  null)
on conflict (idioma, slug) do update set titulo = excluded.titulo, tipo_id = excluded.tipo_id, categorias_extra = excluded.categorias_extra, anio = excluded.anio, direccion = excluded.direccion, productora = excluded.productora, papel = excluded.papel, camara = excluded.camara, tarjeta = excluded.tarjeta, historia = excluded.historia, como_lo_hicimos = excluded.como_lo_hicimos, el_reto = excluded.el_reto, el_resultado = excluded.el_resultado, con_juno = excluded.con_juno, videos = excluded.videos, imagen_id = excluded.imagen_id, galeria = excluded.galeria;

insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 100, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'locos-de-atar-ultimo-concierto' and s.slug = 'filmmaker' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;
insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 101, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'locos-de-atar-ultimo-concierto' and s.slug = 'edicion' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;

-- LOUK
insert into public.proyectos (slug, titulo, tipo_id, categorias_extra, anio, direccion, productora, papel, camara, tarjeta, historia, como_lo_hicimos, el_reto, el_resultado, con_juno, videos, imagen_id, galeria, orden, estado, publicado_en)
values (
  $t$louk-the-grill$t$,
  $t$LOUK$t$,
  (select id from public.tipos_proyecto where idioma = 'es' and slug = 'redes-sociales'),
  '{}'::uuid[],
  2026,
  $t$$t$,
  $t$LOUK (The Grill)$t$,
  $t$Grabación y edición$t$,
  $t$Sony FX3 · ópticas Tamron y Sony$t$,
  $t$Un vídeo para redes de una coctelería que quería seguir siendo un misterio.$t$,
  $t$Para LOUK, en The Grill, de la mano de JUNO Media, grabé y edité un vídeo para redes sociales. Era un encargo curioso: querían una estética misteriosa, sin enseñar las caras de los clientes, que reflejara una experiencia premium.$t$,
  $t$- **Sin caras.** La gente casi no se ve; el protagonista es el sitio.
- **El fuego.** El espectáculo de fuego que hacen es el centro del vídeo.
- **Oscuro y cuidado.** Una imagen que tira a oscura, misteriosa y premium, como el local.$t$,
  $t$Hacer un vídeo para redes, donde manda la gente, sin enseñar a la gente.$t$,
  $t$$t$,
  true,
  $t$[]$t$::jsonb || jsonb_build_array(jsonb_build_object('tipo', 'archivo', 'rol', 'principal','vertical', true, 'titulo', $t$Reel$t$, 'medio', pg_temp.med('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/louk-the-grill/reel-louk-v1.mp4'))),
  pg_temp.foto('louk-the-grill-02'),
  pg_temp.gal(array['louk-the-grill-01','louk-the-grill-02','louk-the-grill-03','louk-the-grill-04','louk-the-grill-05','louk-the-grill-06','louk-the-grill-07','louk-the-grill-08']::text[]),
  42,
  'borrador',
  null)
on conflict (idioma, slug) do update set titulo = excluded.titulo, tipo_id = excluded.tipo_id, categorias_extra = excluded.categorias_extra, anio = excluded.anio, direccion = excluded.direccion, productora = excluded.productora, papel = excluded.papel, camara = excluded.camara, tarjeta = excluded.tarjeta, historia = excluded.historia, como_lo_hicimos = excluded.como_lo_hicimos, el_reto = excluded.el_reto, el_resultado = excluded.el_resultado, con_juno = excluded.con_juno, videos = excluded.videos, imagen_id = excluded.imagen_id, galeria = excluded.galeria;

insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 100, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'louk-the-grill' and s.slug = 'filmmaker' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;
insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 101, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'louk-the-grill' and s.slug = 'edicion' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;

-- Madison
insert into public.proyectos (slug, titulo, tipo_id, categorias_extra, anio, direccion, productora, papel, camara, tarjeta, historia, como_lo_hicimos, el_reto, el_resultado, con_juno, videos, imagen_id, galeria, orden, estado, publicado_en)
values (
  $t$madison-video-oficial$t$,
  $t$Madison$t$,
  (select id from public.tipos_proyecto where idioma = 'es' and slug = 'conciertos'),
  '{}'::uuid[],
  2026,
  $t$$t$,
  $t$Orquesta Madison (Mapache Events)$t$,
  $t$Grabación y montaje$t$,
  $t$Sony FX3 · ópticas Tamron y Sony$t$,
  $t$Vídeo oficial de la orquesta Madison, grabado a varias cámaras.$t$,
  $t$Para JUNO Media. Vídeo oficial de la orquesta Madison, grabado a varias cámaras. Con la colaboración de Noelia Fluxà y Paula. Cada vídeo busca enseñar al máximo lo que da la orquesta y su energía.$t$,
  $t$$t$,
  $t$$t$,
  $t$$t$,
  true,
  $t$[]$t$::jsonb || jsonb_build_array(jsonb_build_object('tipo', 'archivo', 'rol', 'principal', 'titulo', $t$Vídeo oficial$t$, 'medio', pg_temp.med('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/madison-video-oficial/madison-videoresumen-v3.mp4'))),
  pg_temp.foto('madison-video-oficial-04'),
  pg_temp.gal(array['madison-video-oficial-01','madison-video-oficial-02','madison-video-oficial-03','madison-video-oficial-04','madison-video-oficial-05','madison-video-oficial-06','madison-video-oficial-07','madison-video-oficial-08']::text[]),
  43,
  'borrador',
  null)
on conflict (idioma, slug) do update set titulo = excluded.titulo, tipo_id = excluded.tipo_id, categorias_extra = excluded.categorias_extra, anio = excluded.anio, direccion = excluded.direccion, productora = excluded.productora, papel = excluded.papel, camara = excluded.camara, tarjeta = excluded.tarjeta, historia = excluded.historia, como_lo_hicimos = excluded.como_lo_hicimos, el_reto = excluded.el_reto, el_resultado = excluded.el_resultado, con_juno = excluded.con_juno, videos = excluded.videos, imagen_id = excluded.imagen_id, galeria = excluded.galeria;

insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 100, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'madison-video-oficial' and s.slug = 'filmmaker' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;
insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 101, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'madison-video-oficial' and s.slug = 'edicion' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;

-- The Mandalorian y Grogu
insert into public.proyectos (slug, titulo, tipo_id, categorias_extra, anio, direccion, productora, papel, camara, tarjeta, historia, como_lo_hicimos, el_reto, el_resultado, con_juno, videos, imagen_id, galeria, orden, estado, publicado_en)
values (
  $t$mandalorian-grogu-reel$t$,
  $t$The Mandalorian y Grogu$t$,
  (select id from public.tipos_proyecto where idioma = 'es' and slug = 'redes-sociales'),
  '{}'::uuid[],
  2026,
  $t$$t$,
  $t$Agencia de publicidad · Disney · Star Wars$t$,
  $t$Grabación y edición$t$,
  $t$Sony FX3 · ópticas Tamron y Sony$t$,
  $t$Un reel reaccionando al tráiler de The Mandalorian y Grogu, para la campaña de Disney y Star Wars.$t$,
  $t$Una agencia de publicidad me encargó un reel para la campaña de promoción de The Mandalorian y Grogu. Lo grabé y lo edité reaccionando al tráiler, trabajando con las marcas de Disney y Star Wars. Se publicó en Instagram y en mi canal de YouTube «Del Fan Para el Fan».$t$,
  $t$$t$,
  $t$$t$,
  $t$- Campaña oficial de Disney y Star Wars.$t$,
  false,
  $t$[{"tipo": "youtube-short", "id": "s8m1qUtDeNE", "titulo": "Reel"}]$t$::jsonb,
  null,
  '[]'::jsonb,
  44,
  'borrador',
  now())
on conflict (idioma, slug) do update set titulo = excluded.titulo, tipo_id = excluded.tipo_id, categorias_extra = excluded.categorias_extra, anio = excluded.anio, direccion = excluded.direccion, productora = excluded.productora, papel = excluded.papel, camara = excluded.camara, tarjeta = excluded.tarjeta, historia = excluded.historia, como_lo_hicimos = excluded.como_lo_hicimos, el_reto = excluded.el_reto, el_resultado = excluded.el_resultado, con_juno = excluded.con_juno, videos = excluded.videos, imagen_id = excluded.imagen_id, galeria = excluded.galeria;

insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 100, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'mandalorian-grogu-reel' and s.slug = 'filmmaker' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;
insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 101, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'mandalorian-grogu-reel' and s.slug = 'edicion' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;

-- Otra Movida
insert into public.proyectos (slug, titulo, tipo_id, categorias_extra, anio, direccion, productora, papel, camara, tarjeta, historia, como_lo_hicimos, el_reto, el_resultado, con_juno, videos, imagen_id, galeria, orden, estado, publicado_en)
values (
  $t$otra-movida-video-oficial$t$,
  $t$Otra Movida$t$,
  (select id from public.tipos_proyecto where idioma = 'es' and slug = 'conciertos'),
  '{}'::uuid[],
  2026,
  $t$$t$,
  $t$Orquesta Otra Movida (Mapache Events)$t$,
  $t$Grabación y montaje$t$,
  $t$Sony FX3 · ópticas Tamron y Sony$t$,
  $t$Vídeo oficial de la orquesta Otra Movida, grabado a varias cámaras.$t$,
  $t$Para JUNO Media. Vídeo oficial de la orquesta Otra Movida, grabado a varias cámaras. Con la colaboración de Noelia Fluxà. Cada vídeo busca enseñar al máximo lo que da la orquesta y su energía.$t$,
  $t$$t$,
  $t$$t$,
  $t$$t$,
  true,
  $t$[]$t$::jsonb || jsonb_build_array(jsonb_build_object('tipo', 'archivo', 'rol', 'principal', 'titulo', $t$Vídeo oficial$t$, 'medio', pg_temp.med('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/otra-movida-video-oficial/otramovida-videoresumen-v4-masterizada.mp4'))),
  pg_temp.foto('otra-movida-video-oficial-05'),
  pg_temp.gal(array['otra-movida-video-oficial-01','otra-movida-video-oficial-02','otra-movida-video-oficial-03','otra-movida-video-oficial-04','otra-movida-video-oficial-05','otra-movida-video-oficial-06','otra-movida-video-oficial-07','otra-movida-video-oficial-08']::text[]),
  45,
  'borrador',
  null)
on conflict (idioma, slug) do update set titulo = excluded.titulo, tipo_id = excluded.tipo_id, categorias_extra = excluded.categorias_extra, anio = excluded.anio, direccion = excluded.direccion, productora = excluded.productora, papel = excluded.papel, camara = excluded.camara, tarjeta = excluded.tarjeta, historia = excluded.historia, como_lo_hicimos = excluded.como_lo_hicimos, el_reto = excluded.el_reto, el_resultado = excluded.el_resultado, con_juno = excluded.con_juno, videos = excluded.videos, imagen_id = excluded.imagen_id, galeria = excluded.galeria;

insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 100, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'otra-movida-video-oficial' and s.slug = 'filmmaker' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;
insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 101, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'otra-movida-video-oficial' and s.slug = 'edicion' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;

-- Redención
insert into public.proyectos (slug, titulo, tipo_id, categorias_extra, anio, direccion, productora, papel, camara, tarjeta, historia, como_lo_hicimos, el_reto, el_resultado, con_juno, videos, imagen_id, galeria, orden, estado, publicado_en)
values (
  $t$redencion$t$,
  $t$Redención$t$,
  (select id from public.tipos_proyecto where idioma = 'es' and slug = 'cortometraje'),
  '{}'::uuid[],
  2026,
  $t$Samuel Molina$t$,
  $t$Las Chicas de Venus$t$,
  $t$Gaffer y diseño de iluminación$t$,
  $t$$t$,
  $t$Un cortometraje de iluminación dramática, con una gran iglesia como escenario. Fui el gaffer.$t$,
  $t$Trabajé mano a mano con el director de fotografía, Sento MM, como gaffer y diseñador de iluminación. Usamos luces de Amaran, Aputure y Nanlite.$t$,
  $t$- **Iluminación dramática.** Una luz con peso, también en espacios enormes como la iglesia.
- **Violencia en contraste.** Las escenas violentas tienen su propio tratamiento de luz.
- **Ficción dentro de la ficción.** Algunas escenas son invenciones de los personajes, que no existen ni en su historia, y se distinguen por la luz.
- **Puntos dulces.** En el plano secuencia, cada punto del recorrido tiene su luz exacta.$t$,
  $t$Un plano secuencia con una coreografía exacta. Había que iluminar todo el set para que los personajes pasaran por cada punto dulce bien iluminados y que el recorrido fuera interesante.$t$,
  $t$- Pendiente de recorrido por festivales.$t$,
  false,
  $t$[{"tipo": "instagram", "url": "https://www.instagram.com/p/DSrquANDcfQ/", "titulo": "Tráiler"}]$t$::jsonb,
  null,
  '[]'::jsonb,
  46,
  'borrador',
  now())
on conflict (idioma, slug) do update set titulo = excluded.titulo, tipo_id = excluded.tipo_id, categorias_extra = excluded.categorias_extra, anio = excluded.anio, direccion = excluded.direccion, productora = excluded.productora, papel = excluded.papel, camara = excluded.camara, tarjeta = excluded.tarjeta, historia = excluded.historia, como_lo_hicimos = excluded.como_lo_hicimos, el_reto = excluded.el_reto, el_resultado = excluded.el_resultado, con_juno = excluded.con_juno, videos = excluded.videos, imagen_id = excluded.imagen_id, galeria = excluded.galeria;

insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 100, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'redencion' and s.slug = 'direccion-de-fotografia' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;

-- Tara
insert into public.proyectos (slug, titulo, tipo_id, categorias_extra, anio, direccion, productora, papel, camara, tarjeta, historia, como_lo_hicimos, el_reto, el_resultado, con_juno, videos, imagen_id, galeria, orden, estado, publicado_en)
values (
  $t$tara$t$,
  $t$Tara$t$,
  (select id from public.tipos_proyecto where idioma = 'es' and slug = 'cortometraje'),
  '{}'::uuid[],
  2026,
  $t$Alejandro Palacios$t$,
  $t$Alicante Light Film$t$,
  $t$Gaffer$t$,
  $t$$t$,
  $t$Un cortometraje con tres mundos de luz: la casa, el exterior y el trauma. Fui el gaffer.$t$,
  $t$Fui el gaffer de Tara, el cortometraje de Alejandro Palacios, con Sento MM como director de fotografía.$t$,
  $t$- **La casa, espacio seguro.** Una luz cálida y doméstica.
- **Exteriores naturalistas.** Luz que parece no estar.
- **El trauma en blanco y negro.** Las visiones, con un contraste al estilo del expresionismo alemán.
- **Visiones de ensueño.** Para alguna, una estética más suave, de sueño.$t$,
  $t$$t$,
  $t$$t$,
  false,
  $t$[{"tipo": "instagram", "url": "https://www.instagram.com/p/DePg7vdogPE/", "titulo": "Tráiler"}]$t$::jsonb,
  null,
  '[]'::jsonb,
  47,
  'borrador',
  now())
on conflict (idioma, slug) do update set titulo = excluded.titulo, tipo_id = excluded.tipo_id, categorias_extra = excluded.categorias_extra, anio = excluded.anio, direccion = excluded.direccion, productora = excluded.productora, papel = excluded.papel, camara = excluded.camara, tarjeta = excluded.tarjeta, historia = excluded.historia, como_lo_hicimos = excluded.como_lo_hicimos, el_reto = excluded.el_reto, el_resultado = excluded.el_resultado, con_juno = excluded.con_juno, videos = excluded.videos, imagen_id = excluded.imagen_id, galeria = excluded.galeria;

insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 100, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'tara' and s.slug = 'direccion-de-fotografia' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;

-- Zorom, vídeo con IA
insert into public.proyectos (slug, titulo, tipo_id, categorias_extra, anio, direccion, productora, papel, camara, tarjeta, historia, como_lo_hicimos, el_reto, el_resultado, con_juno, videos, imagen_id, galeria, orden, estado, publicado_en)
values (
  $t$zorom-ia$t$,
  $t$Zorom, vídeo con IA$t$,
  (select id from public.tipos_proyecto where idioma = 'es' and slug = 'visuales-e-ia'),
  '{}'::uuid[],
  2025,
  $t$$t$,
  $t$Zorom$t$,
  $t$Generación con IA, selección de stock y edición$t$,
  $t$$t$,
  $t$Una residencia que aún no existe, enseñada en vídeo a partir de sus renders, con inteligencia artificial.$t$,
  $t$Zorom quería enseñar una residencia que todavía no está construida. Para JUNO Media, convertí sus renders en vídeo con inteligencia artificial, completé con planos de stock que seleccioné en Artlist y lo monté todo.$t$,
  $t$- **De render a vídeo.** Los renders de la casa son el punto de partida de cada plano generado con IA.
- **Stock con criterio.** Los planos de Artlist completan lo que la casa no puede enseñar sola.
- **Un montaje tranquilo.** Ritmo pausado para transmitir la calma que buscaba el cliente.$t$,
  $t$$t$,
  $t$$t$,
  true,
  $t$[]$t$::jsonb || jsonb_build_array(jsonb_build_object('tipo', 'archivo', 'rol', 'principal', 'titulo', $t$Amiral by Zorom$t$, 'medio', pg_temp.med('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/zorom-ia/spot-promotora-v4.mp4'))),
  pg_temp.foto('zorom-ia-02'),
  pg_temp.gal(array['zorom-ia-01','zorom-ia-02','zorom-ia-03','zorom-ia-04','zorom-ia-05','zorom-ia-06','zorom-ia-07','zorom-ia-08']::text[]),
  48,
  'borrador',
  null)
on conflict (idioma, slug) do update set titulo = excluded.titulo, tipo_id = excluded.tipo_id, categorias_extra = excluded.categorias_extra, anio = excluded.anio, direccion = excluded.direccion, productora = excluded.productora, papel = excluded.papel, camara = excluded.camara, tarjeta = excluded.tarjeta, historia = excluded.historia, como_lo_hicimos = excluded.como_lo_hicimos, el_reto = excluded.el_reto, el_resultado = excluded.el_resultado, con_juno = excluded.con_juno, videos = excluded.videos, imagen_id = excluded.imagen_id, galeria = excluded.galeria;

insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 100, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'zorom-ia' and s.slug = 'edicion' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;


-- La ficha genérica «Conciertos» se oculta: cada orquesta tiene ya la suya
update public.proyectos set estado = 'borrador' where idioma = 'es' and slug = 'conciertos';

-- Destacados de Inicio (decididos por Josep el 2026-10-25). Los nuevos salen al publicarlos.
update public.proyectos set destacado_orden = null where idioma = 'es' and destacado_orden is not null;
update public.proyectos p set destacado_orden = d.n
from (values ('y-el-ano-que-viene-que', 1), ('ep-color-adrian-munoz', 2), ('atavicas-trailer-obra-de-teatro', 3),
  ('flama-aftermovie', 4), ('kiboko', 5), ('eventos-deportivos', 6), ('mandalorian-grogu-reel', 7),
  ('flama-contenido-cinematografico-ia', 8), ('ais-10-anos', 9)) as d(slug, n)
where p.idioma = 'es' and p.slug = d.slug;

-- Página de Spots y corporativo: también los proyectos corporativos
update public.bloques b set datos = jsonb_set(b.datos, '{tipos}', '["publicidad", "corporativo"]'::jsonb)
from public.paginas pg
where pg.id = b.pagina_id and pg.slug = 'filmmaker-spots-y-corporativo' and pg.idioma = 'es' and b.tipo = 'trabajos';

-- Filtros de /trabajos: categorías nuevas «Corporativo» y «Visuales e IA»
update public.bloques b set datos = jsonb_set(b.datos, '{filtros}', (
  select jsonb_object_agg(k, case
    when k in ('todos', 'filmmaker') then v || '[{"nombre": "Corporativo", "tipos": ["corporativo"]}]'::jsonb
    else v end
    || case when k in ('todos', 'edicion') then '[{"nombre": "Visuales e IA", "tipos": ["visuales-e-ia"]}]'::jsonb else '[]'::jsonb end)
  from jsonb_each(b.datos -> 'filtros') as f(k, v)
  where true))
from public.paginas pg
where pg.id = b.pagina_id and pg.slug = 'trabajos' and pg.idioma = 'es' and b.orden = 0
  and b.datos ? 'filtros' and not (b.datos -> 'filtros' -> 'todos') @> '[{"nombre": "Corporativo"}]'::jsonb;

-- Clientes nuevos (sin logo todavía). Borrador sin publicar: se ven en la vista previa
insert into public.clientes (nombre, con_juno, orden, estado)
select v.nombre, v.juno, 30 + v.n, 'borrador' from (values
  ('AIS', true, 1), ('LOUK', true, 2), ('Englobe', true, 3), ('Agüita de Coco', false, 4), ('Las Chicas de Venus', false, 5),
  ('Alicante Light Film', false, 6), ('Diferens', true, 7), ('Neira y Santamaría', true, 8), ('Mario Bravo', false, 9)
) as v(nombre, juno, n)
where not exists (select 1 from public.clientes c where lower(c.nombre) = lower(v.nombre));

commit;
