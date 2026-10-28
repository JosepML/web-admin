-- S1 · parte 2.06: proyectos recreacion-star-wars-luke-vader, recreacion-el-padrino, recreacion-star-wars-sin-cgi
create function pg_temp.med(u text) returns uuid language sql as $$ select id from public.medios where url_origen = u order by creado_en limit 1 $$;
create function pg_temp.gal(urls text[]) returns jsonb language sql as $$ select coalesce(jsonb_agg(jsonb_build_object('medio', pg_temp.med(u), 'pie', '') order by o), '[]'::jsonb) from unnest(urls) with ordinality t(u, o) $$;

insert into public.proyectos (id_antiguo, slug, titulo, tipo_id, anio, direccion, productora, papel, camara, premios, tarjeta, historia, como_lo_hicimos, el_reto, el_resultado, frase,
  youtube_id, youtube_inicio, videos, videos_debajo_del_texto, imagen_id, galeria, destacado_orden, orden, estado, publicado_en)
values ('star-wars-vader-recreacion', 'recreacion-star-wars-luke-vader', 'Recreación del mejor plano de ''Star Wars: El Imperio Contraataca''', (select id from public.tipos_proyecto where slug = 'recreacion'), 2025, 'Josep Mira Lozano',
  'Canal de YouTube', 'Concepción, dirección y ejecución', 'Sony FX3 · ópticas Tamron y Sony', $t$[]$t$::jsonb,
  $t$El duelo de Luke y Vader con una maqueta, siluetas y sables añadidos fotograma a fotograma.$t$, $t$Para el 45.º aniversario de *El Imperio Contraataca* recreé el duelo final en la Ciudad Nube, con medios caseros.$t$, $t$- **Maqueta.** Un set en miniatura, como en las películas originales.
- **Exposición.** Muchas pruebas de diafragma e ISO para enfocar algo tan pequeño.
- **Siluetas.** Rodadas al aire libre contra una pared blanca, tras fallar en interior.
- **Postproducción.** Sables y personajes añadidos fotograma a fotograma.$t$, $t$Espacio y luz: dar a una maqueta pequeña la profundidad de un set real.$t$, '', '',
  'oSHFSsmXdMw', null, $t$[]$t$::jsonb, false, pg_temp.med('https://i.imgur.com/wij6Im5.jpeg'), pg_temp.gal(array['https://i.imgur.com/wij6Im5.jpeg','https://i.imgur.com/RGyhSYF.jpeg','https://i.imgur.com/ERa4jQL.jpeg','https://i.imgur.com/r9xe36z.jpeg','https://i.imgur.com/v6fA4Co.jpeg','https://i.imgur.com/M3jSLQp.jpeg','https://i.imgur.com/YhxMZTd.jpeg','https://i.imgur.com/l4qpIaT.jpeg']), null, 16, 'publicado', now())
on conflict (idioma, id_antiguo) do update set slug = excluded.slug, titulo = excluded.titulo, tipo_id = excluded.tipo_id, anio = excluded.anio, direccion = excluded.direccion,
  productora = excluded.productora, papel = excluded.papel, camara = excluded.camara, premios = excluded.premios, tarjeta = excluded.tarjeta, historia = excluded.historia,
  como_lo_hicimos = excluded.como_lo_hicimos, el_reto = excluded.el_reto, el_resultado = excluded.el_resultado, frase = excluded.frase, youtube_id = excluded.youtube_id,
  youtube_inicio = excluded.youtube_inicio, videos = excluded.videos, videos_debajo_del_texto = excluded.videos_debajo_del_texto, imagen_id = excluded.imagen_id,
  galeria = excluded.galeria, destacado_orden = excluded.destacado_orden, orden = excluded.orden;
insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 10, false from public.proyectos p, public.servicios s where p.id_antiguo = 'star-wars-vader-recreacion' and s.slug = 'direccion-de-fotografia' on conflict (proyecto_id, servicio_id) do update set orden = excluded.orden, destacado = excluded.destacado;
insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 13, false from public.proyectos p, public.servicios s where p.id_antiguo = 'star-wars-vader-recreacion' and s.slug = 'edicion' on conflict (proyecto_id, servicio_id) do update set orden = excluded.orden, destacado = excluded.destacado;

insert into public.proyectos (id_antiguo, slug, titulo, tipo_id, anio, direccion, productora, papel, camara, premios, tarjeta, historia, como_lo_hicimos, el_reto, el_resultado, frase,
  youtube_id, youtube_inicio, videos, videos_debajo_del_texto, imagen_id, galeria, destacado_orden, orden, estado, publicado_en)
values ('godfather-recreation', 'recreacion-el-padrino', 'Recreación de ''El Padrino''', (select id from public.tipos_proyecto where slug = 'recreacion'), null, 'Josep Mira Lozano',
  'Canal de YouTube', 'Dirección, dirección de fotografía, diseño de set y postproducción', 'Sony FX3 · ópticas Tamron y Sony', $t$[]$t$::jsonb,
  $t$El despacho de Vito Corleone, con la rejilla de una estufa como ventana.$t$, $t$Quise estudiar cómo ilumina Gordon Willis recreando su plano más conocido. Construí el set desde cero en un sótano.$t$, $t$- **La ventana.** Rejilla de estufa de butano, cinta negra, papel de horno como difusor y LED detrás.
- **Ojos en sombra.** Aputure 300d II con softbox cenital y un negativo en el suelo.
- **Temperatura.** Cámara hacia cálido y fondo compensado con geles fríos.
- **Color sin verlo.** Soy daltónico: igualé pieles y sombras en DaVinci Resolve con el fotograma original.$t$, $t$Recrear la luz de una ventana que no existía, y un color que no veo como los demás.$t$, '', '',
  'WnSCN4aXDKA', null, $t$[]$t$::jsonb, false, pg_temp.med('https://i9.ytimg.com/vi/WnSCN4aXDKA/maxresdefault.jpg?v=679bcbdd&sqp=CIT8kdAG&rs=AOn4CLCyKnwCfs3IcWmzYzI1ecB1Be9rOg'), pg_temp.gal(array['https://i9.ytimg.com/vi/WnSCN4aXDKA/maxresdefault.jpg?v=679bcbdd&sqp=CIT8kdAG&rs=AOn4CLCyKnwCfs3IcWmzYzI1ecB1Be9rOg','https://i.ibb.co/jP2769Q5/Captura-de-pantalla-2026-05-13-154204.png','https://i.ibb.co/0RRp3Vbv/Captura-de-pantalla-2026-05-13-154114.png','https://i.ibb.co/3ydQ8Qz8/Captura-de-pantalla-2026-05-13-154132.png']), null, 17, 'publicado', now())
on conflict (idioma, id_antiguo) do update set slug = excluded.slug, titulo = excluded.titulo, tipo_id = excluded.tipo_id, anio = excluded.anio, direccion = excluded.direccion,
  productora = excluded.productora, papel = excluded.papel, camara = excluded.camara, premios = excluded.premios, tarjeta = excluded.tarjeta, historia = excluded.historia,
  como_lo_hicimos = excluded.como_lo_hicimos, el_reto = excluded.el_reto, el_resultado = excluded.el_resultado, frase = excluded.frase, youtube_id = excluded.youtube_id,
  youtube_inicio = excluded.youtube_inicio, videos = excluded.videos, videos_debajo_del_texto = excluded.videos_debajo_del_texto, imagen_id = excluded.imagen_id,
  galeria = excluded.galeria, destacado_orden = excluded.destacado_orden, orden = excluded.orden;
insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 11, false from public.proyectos p, public.servicios s where p.id_antiguo = 'godfather-recreation' and s.slug = 'direccion-de-fotografia' on conflict (proyecto_id, servicio_id) do update set orden = excluded.orden, destacado = excluded.destacado;
insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 14, false from public.proyectos p, public.servicios s where p.id_antiguo = 'godfather-recreation' and s.slug = 'edicion' on conflict (proyecto_id, servicio_id) do update set orden = excluded.orden, destacado = excluded.destacado;

insert into public.proyectos (id_antiguo, slug, titulo, tipo_id, anio, direccion, productora, papel, camara, premios, tarjeta, historia, como_lo_hicimos, el_reto, el_resultado, frase,
  youtube_id, youtube_inicio, videos, videos_debajo_del_texto, imagen_id, galeria, destacado_orden, orden, estado, publicado_en)
values ('star-wars-hoth-recreation', 'recreacion-star-wars-sin-cgi', 'Recreación de ''Star Wars: El Imperio Contraataca'' sin CGI', (select id from public.tipos_proyecto where slug = 'recreacion'), null, 'Josep Mira Lozano',
  'Canal de YouTube', 'Dirección y dirección de fotografía', 'Sony FX3 · ópticas Tamron y Sony', $t$[]$t$::jsonb,
  $t$Luke en la Ciudad de las Nubes sin CGI: pilares de alfombra, tuberías de ferretería y fondo de papel perforado.$t$, $t$Llevo una década haciendo contenido de Star Wars. Aquí recreé el plano más icónico de Luke solo con recursos físicos.$t$, $t$- **Decorado de ferretería.** Pilares de alfombra forrada de goma EVA y tuberías de fontanería.
- **Luces de fondo.** Papel gris perforado; el desenfoque convierte los agujeros en halos.
- **Luz dura.** LED magnético de contraluz, modificador concentrado y negativo en el suelo.$t$, $t$La perspectiva. Con un 85 mm las proporciones no eran las del original, así que rehíce el rodaje entero con un 55 mm.$t$, '', '',
  '-T8Y-ESHRTs', null, $t$[]$t$::jsonb, false, pg_temp.med('https://i.ytimg.com/vi/-T8Y-ESHRTs/maxresdefault.jpg'), pg_temp.gal(array['https://i.ytimg.com/vi/-T8Y-ESHRTs/maxresdefault.jpg','https://i.ibb.co/KxmsqgfX/Captura-de-pantalla-2026-05-13-154839.png','https://i.ibb.co/RGtfBnFM/Captura-de-pantalla-2026-05-13-154739.png','https://i.ibb.co/bgZQxQ4H/Captura-de-pantalla-2026-05-13-154720.png']), null, 18, 'publicado', now())
on conflict (idioma, id_antiguo) do update set slug = excluded.slug, titulo = excluded.titulo, tipo_id = excluded.tipo_id, anio = excluded.anio, direccion = excluded.direccion,
  productora = excluded.productora, papel = excluded.papel, camara = excluded.camara, premios = excluded.premios, tarjeta = excluded.tarjeta, historia = excluded.historia,
  como_lo_hicimos = excluded.como_lo_hicimos, el_reto = excluded.el_reto, el_resultado = excluded.el_resultado, frase = excluded.frase, youtube_id = excluded.youtube_id,
  youtube_inicio = excluded.youtube_inicio, videos = excluded.videos, videos_debajo_del_texto = excluded.videos_debajo_del_texto, imagen_id = excluded.imagen_id,
  galeria = excluded.galeria, destacado_orden = excluded.destacado_orden, orden = excluded.orden;
insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 12, false from public.proyectos p, public.servicios s where p.id_antiguo = 'star-wars-hoth-recreation' and s.slug = 'direccion-de-fotografia' on conflict (proyecto_id, servicio_id) do update set orden = excluded.orden, destacado = excluded.destacado;
insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, 15, false from public.proyectos p, public.servicios s where p.id_antiguo = 'star-wars-hoth-recreation' and s.slug = 'edicion' on conflict (proyecto_id, servicio_id) do update set orden = excluded.orden, destacado = excluded.destacado;
