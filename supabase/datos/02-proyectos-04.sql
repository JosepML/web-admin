-- S1 · parte 2.04: proyectos sin-piedad, eventos-deportivos, conciertos
create function pg_temp.med(u text) returns uuid language sql as $$ select id from public.medios where url_origen = u order by creado_en limit 1 $$;
create function pg_temp.gal(urls text[]) returns jsonb language sql as $$ select coalesce(jsonb_agg(jsonb_build_object('medio', pg_temp.med(u), 'pie', '') order by o), '[]'::jsonb) from unnest(urls) with ordinality t(u, o) $$;

insert into public.proyectos (id_antiguo, slug, titulo, tipo_id, anio, direccion, productora, papel, camara, premios, tarjeta, historia, como_lo_hicimos, el_reto, el_resultado, frase,
  youtube_id, youtube_inicio, videos, videos_debajo_del_texto, imagen_id, galeria, destacado_orden, orden, estado, publicado_en)
values ('sin-piedad', 'sin-piedad', 'Sin Piedad', (select id from public.tipos_proyecto where slug = 'cortometraje'), null, 'Ángela Manzano',
  'Proyecto personal de Ángela Manzano', 'Dirección de fotografía', '', $t$[]$t$::jsonb,
  $t$Un hombre machacado por su trabajo decide secuestrar a su jefa.$t$, $t$Ángela Manzano lo cuenta desde dentro de su cabeza, con tono onírico. Mi trabajo fue traducir ese estado mental a luz y composición. Aún no es público: se prepara para festivales, por eso aquí solo hay fotogramas.$t$, $t$- **Oficina como limbo.** Luz uniforme y fría sobre el blanco.
- **Confrontación.** Prácticas cálidas que fingen normalidad, con sombras profundas sobre él.
- **Prisión mental.** Sombras de persiana y tonos azulados, sin paredes.
- **Secuestro.** Contraluz intenso, como un halo teatral.$t$, $t$Rodamos casi todo sobre un ciclorama blanco. Había que convertir un solo espacio neutro en varios lugares, cada uno con su carga emocional.$t$, '', $t$Una cárcel hecha *solo de luz*.$t$,
  null, null, $t$[]$t$::jsonb, false, pg_temp.med('https://i.imgur.com/j3loxUV.png'), pg_temp.gal(array['https://i.imgur.com/j3loxUV.png','https://i.ibb.co/Z6sq4zns/3a45388c-c86c-4c6c-a65e-08ecc09924d4.jpg','https://i.ibb.co/8LbdJj5g/adfb7bc1-79ad-49fb-9085-05ed6ad25614.jpg','https://i.ibb.co/LX70LVX2/7858818b-410d-4e0e-b79d-2f325f66c072.jpg']), null, 10, 'publicado', now())
on conflict (idioma, id_antiguo) do update set slug = excluded.slug, titulo = excluded.titulo, tipo_id = excluded.tipo_id, anio = excluded.anio, direccion = excluded.direccion,
  productora = excluded.productora, papel = excluded.papel, camara = excluded.camara, premios = excluded.premios, tarjeta = excluded.tarjeta, historia = excluded.historia,
  como_lo_hicimos = excluded.como_lo_hicimos, el_reto = excluded.el_reto, el_resultado = excluded.el_resultado, frase = excluded.frase, youtube_id = excluded.youtube_id,
  youtube_inicio = excluded.youtube_inicio, videos = excluded.videos, videos_debajo_del_texto = excluded.videos_debajo_del_texto, imagen_id = excluded.imagen_id,
  galeria = excluded.galeria, destacado_orden = excluded.destacado_orden, orden = excluded.orden;
insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 5, true from public.proyectos p, public.servicios s where p.id_antiguo = 'sin-piedad' and s.slug = 'direccion-de-fotografia' on conflict (proyecto_id, servicio_id) do update set orden = excluded.orden, destacado = excluded.destacado;

insert into public.proyectos (id_antiguo, slug, titulo, tipo_id, anio, direccion, productora, papel, camara, premios, tarjeta, historia, como_lo_hicimos, el_reto, el_resultado, frase,
  youtube_id, youtube_inicio, videos, videos_debajo_del_texto, imagen_id, galeria, destacado_orden, orden, estado, publicado_en)
values ('eventos-deportivos', 'eventos-deportivos', 'Eventos deportivos', (select id from public.tipos_proyecto where slug = 'eventos'), null, 'Josep Mira Lozano',
  'Ocisport', 'Grabación y montaje', 'Sony FX3 · Tamron y Sony', $t$[]$t$::jsonb,
  $t$Ciclismo de élite, como la Shimano Super Cup Massi en La Nucía, grabado a pie de pista.$t$, $t$Para Ocisport. La carrera no se repite, así que casi todo depende de dónde me coloque. De ahí salen piezas para redes y para televisión.$t$, $t$- **Elegir sitio.** Me coloco en los puntos más espectaculares del circuito.
- **Cámara rápida y cerrada.** Seguimiento preciso para que se note la velocidad.
- **Un pack por canal.** Reels para redes y piezas largas con calidad de emisión.
- **Sonido realzado.** Ruedas, esfuerzo y público sobre una base musical fuerte.$t$, $t$Estar en el sitio justo en el momento justo y, luego, condensar la carrera sin perder tensión.$t$, '', $t$En una carrera, cada plano pasa *una sola vez*.$t$,
  'm7rbFqf9dzE', null, $t$[]$t$::jsonb, false, pg_temp.med('https://i.ibb.co/YBc4tqZw/Captura-de-pantalla-2026-05-13-141447.png'), pg_temp.gal(array['https://i.ibb.co/YBc4tqZw/Captura-de-pantalla-2026-05-13-141447.png','https://i.ibb.co/zVJMr1nJ/Captura-de-pantalla-2026-05-13-141759.png','https://i.ibb.co/PsV1DzfW/Captura-de-pantalla-2026-05-13-141748.png','https://i.ibb.co/bgbn1nNj/Captura-de-pantalla-2026-05-13-142016.png','https://i.ibb.co/TM2cqWk3/Captura-de-pantalla-2026-05-13-141842.png']), null, 11, 'publicado', now())
on conflict (idioma, id_antiguo) do update set slug = excluded.slug, titulo = excluded.titulo, tipo_id = excluded.tipo_id, anio = excluded.anio, direccion = excluded.direccion,
  productora = excluded.productora, papel = excluded.papel, camara = excluded.camara, premios = excluded.premios, tarjeta = excluded.tarjeta, historia = excluded.historia,
  como_lo_hicimos = excluded.como_lo_hicimos, el_reto = excluded.el_reto, el_resultado = excluded.el_resultado, frase = excluded.frase, youtube_id = excluded.youtube_id,
  youtube_inicio = excluded.youtube_inicio, videos = excluded.videos, videos_debajo_del_texto = excluded.videos_debajo_del_texto, imagen_id = excluded.imagen_id,
  galeria = excluded.galeria, destacado_orden = excluded.destacado_orden, orden = excluded.orden;
insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 4, true from public.proyectos p, public.servicios s where p.id_antiguo = 'eventos-deportivos' and s.slug = 'filmmaker' on conflict (proyecto_id, servicio_id) do update set orden = excluded.orden, destacado = excluded.destacado;
insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 10, false from public.proyectos p, public.servicios s where p.id_antiguo = 'eventos-deportivos' and s.slug = 'edicion' on conflict (proyecto_id, servicio_id) do update set orden = excluded.orden, destacado = excluded.destacado;

insert into public.proyectos (id_antiguo, slug, titulo, tipo_id, anio, direccion, productora, papel, camara, premios, tarjeta, historia, como_lo_hicimos, el_reto, el_resultado, frase,
  youtube_id, youtube_inicio, videos, videos_debajo_del_texto, imagen_id, galeria, destacado_orden, orden, estado, publicado_en)
values ('cobertura-conciertos', 'conciertos', 'Conciertos', (select id from public.tipos_proyecto where slug = 'eventos'), null, 'Josep Mira Lozano',
  'Varios clientes', 'Grabación y montaje', 'Sony FX3 · Tamron y Sony', $t$[]$t$::jsonb,
  $t$Aftermovies que cuentan un directo en pocos minutos: el espectáculo, los artistas y el público.$t$, $t$Para Tamilah y Fluxà (Agüita de Coco y Flama), Mapache Events, Orquesta Azara y Miami Show. Aquí hay tres piezas y un vídeo del proceso.$t$, $t$- **Primero el audio.** Un mix con los temas más potentes y cambios de tempo es el esqueleto del vídeo.
- **Grabar para montar.** Hablo con los artistas, cubro muchos encuadres y tomo el playback para que labios e instrumentos cuadren.
- **Estructura.** Lo más rompedor al principio y lo más espectacular al cierre, con el ambiente del público.$t$, $t$Que tenga ritmo y cuente el concierto, en lugar de ser una lista de clips bonitos.$t$, '', $t$Un aftermovie se monta *de oído*.$t$,
  null, null, $t$[{"tipo":"youtube","id":"na4SmBeo7X8","titulo":"Miami Show"},{"tipo":"youtube","id":"JK_tjTfrlOk","titulo":"Flama"},{"tipo":"youtube","id":"hTYKt-15v7k","titulo":"Legends"},{"tipo":"youtube","id":"VdDBgDkqCio","titulo":"Cómo lo hicimos","rol":"proceso"}]$t$::jsonb, false, pg_temp.med('https://i.ibb.co/HDqT2xzW/Captura-de-pantalla-2026-05-12-210438.png'), pg_temp.gal(array['https://i.ibb.co/HDqT2xzW/Captura-de-pantalla-2026-05-12-210438.png','https://i.ibb.co/JWs3rX1g/Captura-de-pantalla-2026-05-12-210536.png','https://i.ibb.co/xKnqM1dq/Captura-de-pantalla-2026-05-12-210716.png','https://i.ibb.co/LdwnXNrm/Captura-de-pantalla-2026-05-12-210211.png']), null, 12, 'publicado', now())
on conflict (idioma, id_antiguo) do update set slug = excluded.slug, titulo = excluded.titulo, tipo_id = excluded.tipo_id, anio = excluded.anio, direccion = excluded.direccion,
  productora = excluded.productora, papel = excluded.papel, camara = excluded.camara, premios = excluded.premios, tarjeta = excluded.tarjeta, historia = excluded.historia,
  como_lo_hicimos = excluded.como_lo_hicimos, el_reto = excluded.el_reto, el_resultado = excluded.el_resultado, frase = excluded.frase, youtube_id = excluded.youtube_id,
  youtube_inicio = excluded.youtube_inicio, videos = excluded.videos, videos_debajo_del_texto = excluded.videos_debajo_del_texto, imagen_id = excluded.imagen_id,
  galeria = excluded.galeria, destacado_orden = excluded.destacado_orden, orden = excluded.orden;
insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 3, true from public.proyectos p, public.servicios s where p.id_antiguo = 'cobertura-conciertos' and s.slug = 'filmmaker' on conflict (proyecto_id, servicio_id) do update set orden = excluded.orden, destacado = excluded.destacado;
insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 2, true from public.proyectos p, public.servicios s where p.id_antiguo = 'cobertura-conciertos' and s.slug = 'edicion' on conflict (proyecto_id, servicio_id) do update set orden = excluded.orden, destacado = excluded.destacado;
