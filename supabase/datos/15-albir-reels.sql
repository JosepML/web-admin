-- Proyecto suelto, generado por scripts/generar-proyectos-nuevos.py --solo albir-confort-reels
create or replace function pg_temp.foto(t text) returns uuid language sql as $$
  select id from public.medios where titulo = t and tipo = 'imagen' order by creado_en desc limit 1 $$;
create or replace function pg_temp.gal(titulos text[]) returns jsonb language sql as $$
  select coalesce(jsonb_agg(jsonb_build_object('medio', pg_temp.foto(t), 'pie', '') order by o), '[]'::jsonb)
  from unnest(titulos) with ordinality x(t, o) where pg_temp.foto(t) is not null $$;

create or replace function pg_temp.med(u text) returns uuid language sql as $$ select id from public.medios where url_origen = u order by creado_en limit 1 $$;


insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/albir-confort-reels/reel1-presentacion-james-v3.mp4', 'video', 'video/mp4', $t$albir-confort-reels · Reel 1 · Presentación de James$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/albir-confort-reels/reel2-tip2-v1.mp4', 'video', 'video/mp4', $t$albir-confort-reels · Reel 2$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/albir-confort-reels/reel3-tip3-v1.mp4', 'video', 'video/mp4', $t$albir-confort-reels · Reel 3$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/albir-confort-reels/reel4-tip4-v1.mp4', 'video', 'video/mp4', $t$albir-confort-reels · Reel 4$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/albir-confort-reels/reel5-tip5-v1.mp4', 'video', 'video/mp4', $t$albir-confort-reels · Reel 5$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/albir-confort-reels/reel6-tip7-v1.mp4', 'video', 'video/mp4', $t$albir-confort-reels · Reel 6$t$) on conflict do nothing;
insert into public.medios (url_origen, tipo, mime, titulo) values ('https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev/albir-confort-reels/reel7-tip11-v1.mp4', 'video', 'video/mp4', $t$albir-confort-reels · Reel 7$t$) on conflict do nothing;

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
  24,
  'borrador',
  null)
on conflict (idioma, slug) do update set titulo = excluded.titulo, tipo_id = excluded.tipo_id, categorias_extra = excluded.categorias_extra, anio = excluded.anio, direccion = excluded.direccion, productora = excluded.productora, papel = excluded.papel, camara = excluded.camara, tarjeta = excluded.tarjeta, historia = excluded.historia, como_lo_hicimos = excluded.como_lo_hicimos, el_reto = excluded.el_reto, el_resultado = excluded.el_resultado, con_juno = excluded.con_juno, videos = excluded.videos, imagen_id = excluded.imagen_id, galeria = excluded.galeria;
insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 100, false from public.proyectos p, public.servicios s where p.idioma = 'es' and p.slug = 'albir-confort-reels' and s.slug = 'edicion' and s.idioma = 'es' on conflict (proyecto_id, servicio_id) do nothing;

