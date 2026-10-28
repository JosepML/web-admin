-- Tarea C · Inicio y lo que leen sus bloques. Generado con scripts/cargar-inicio.mjs (no editar a mano).

begin;

insert into public.medios (url_origen, tipo, mime, titulo, texto_alternativo) values ('https://www.edigitalagency.com.au/wp-content/uploads/new-Disney-logo-white-png-large-size.png', 'imagen', 'image/png', 'Logo Disney', 'Logo de Disney') on conflict (url_origen) where url_origen is not null do nothing;

insert into public.medios (url_origen, tipo, mime, titulo, texto_alternativo) values ('https://upload.wikimedia.org/wikipedia/commons/c/ce/Star_wars2.svg', 'imagen', 'image/svg+xml', 'Logo Star Wars', 'Logo de Star Wars') on conflict (url_origen) where url_origen is not null do nothing;

insert into public.medios (url_origen, tipo, mime, titulo, texto_alternativo) values ('https://i.postimg.cc/Qh3FMz10/Captura-de-pantalla-2026-05-13-161052.png', 'imagen', 'image/png', 'Josep en rodaje (provisional)', 'Josep Mira Lozano en un rodaje') on conflict (url_origen) where url_origen is not null do nothing;

insert into public.medios (url_origen, tipo, mime, titulo, texto_alternativo) values ('https://i.imgur.com/ESU7wLA.jpeg', 'imagen', 'image/jpeg', 'Póster del reel', 'Fotograma de «Y el año que viene, ¿qué?»') on conflict (url_origen) where url_origen is not null do nothing;

update public.servicios set
  nombre = 'Dirección de fotografía', frase = 'La luz cuenta la mitad de la historia.', resumen = 'Decido qué siente quien mira: la luz, el encuadre y el color al servicio de tu historia.',
  mirada = '["Para mí la fotografía no es hacer planos bonitos. Es decidir qué siente quien mira. Una sombra que no deja ver del todo un rostro, un contraluz que protege a alguien, un color que incomoda sin que sepas por qué: ahí está el oficio.","Antes de encender un foco me siento con la dirección a entender la historia. En El Cirujano llevamos el rojo hasta el infierno para meternos en la cabeza del asesino. En No se está tan mal fue justo lo contrario: una luz suave, casi una burbuja, para que el artista pudiera abrirse. Cada historia me pide un lenguaje distinto, y encontrarlo es lo que más disfruto."]'::jsonb, aporto = '["Una propuesta visual propia, con referencias, paleta y tratamiento de la luz","El desglose de cámara y luz secuencia a secuencia","La elección de cámara, ópticas y material según lo que la historia necesita","La dirección del equipo de cámara y eléctricos en rodaje","El acompañamiento del color hasta el final, para que el look llegue intacto"]'::jsonb, para_quien = '["Cortometrajes","Videoclips","Spots"]'::jsonb, con_quien = 'Directoras y directores de cortos, artistas que preparan un videoclip y marcas que quieren que su spot se sienta cine.',
  pasos = '[{"titulo":"Escucho","texto":"Me cuentas la historia, el tono y lo que quieres que sienta el espectador."},{"titulo":"Imagino","texto":"Te propongo una mirada: referencias, luz, encuadres."},{"titulo":"Ruedo","texto":"Me encargo de la imagen para que tú puedas centrarte en dirigir."},{"titulo":"Cuido el final","texto":"Acompaño el color para que el resultado sea el que soñamos."}]'::jsonb, preguntas = '[{"pregunta":"¿Cómo sabes qué luz necesita una historia?","respuesta":"Leyendo el guion muchas veces y hablando mucho con quien dirige. La técnica viene después; primero tiene que haber una idea de qué queremos contar con cada plano."},{"pregunta":"¿Con qué equipo trabajas?","respuesta":"Tengo equipo propio de cámara e iluminación. Pero el equipo lo decide la historia: si un proyecto pide algo que no tengo, se alquila y se incluye en el presupuesto."},{"pregunta":"¿Se puede hacer cine con pocos medios?","respuesta":"Es lo que llevo años demostrando con mis recreaciones: una rejilla de estufa y papel de horno pueden ser la ventana de Vito Corleone. El ingenio también se ve en pantalla."},{"pregunta":"¿Haces también el etalonaje?","respuesta":"Puedo hacerlo yo o acompañar a quien lo haga, para que la imagen final sea la que diseñamos en rodaje."},{"pregunta":"¿Dónde trabajas?","respuesta":"Trabajo desde Alicante en toda la Comunidad Valenciana, y donde me lleve la historia."}]'::jsonb,
  llamada = '¿Tienes una historia que necesita luz?', seo_titulo = 'Director de fotografía en Alicante · Josep Mira Lozano', seo_descripcion = 'Dirección de fotografía para cortometrajes, videoclips y spots. La luz, el encuadre y el color al servicio de la historia.', orden = 1,
  estado = 'publicado', publicado_en = coalesce(publicado_en, now())
where slug = 'direccion-de-fotografia' and idioma = 'es';

update public.servicios set
  nombre = 'Filmmaker', frase = 'Me sumo a tu historia, o te ayudo a encontrarla.', resumen = 'Me sumo a tu equipo o llevo el proyecto de principio a fin: idea, rodaje y montaje, siempre con mirada de cine.',
  mirada = '["Como filmmaker puedo acompañar todo el viaje: la idea, el rodaje y el montaje. Me gusta porque el concepto va creciendo de principio a fin sin perderse por el camino. Y si ya tienes una idea entre manos, me sumo con las mismas ganas: el cine se hace entre muchos, y cada mirada suma.","Vídeo corporativo, un videoclip, una orquesta en fiestas, una carrera de ciclismo o una boda: en todos busco la historia que hay dentro. Vengo de la música, así que ruedo pensando ya en el montaje. Y cuando toca grabar momentos reales, intento que la gente se olvide de la cámara, porque lo auténtico es lo que luego emociona."]'::jsonb, aporto = '["Me integro en tu equipo y en tu forma de trabajar desde el primer día de rodaje","La idea y el guion, si aún no existen","Un rodaje discreto cuando hace falta y ambicioso cuando se puede","Montaje, color y sonido con el mismo cuidado, o el material ordenado para tu montador","Versiones para redes sacadas del mismo material"]'::jsonb, para_quien = '["Productoras","Empresas y marcas","Particulares","Compañeros de profesión","Artistas","Eventos"]'::jsonb, con_quien = 'Sobre todo con productoras y compañeros de profesión que necesitan a alguien de confianza en su rodaje. También con empresas y marcas, artistas y grupos, organizadores de eventos y competiciones, y particulares: parejas que quieren una película de su boda o cualquiera con algo que celebrar o contar.',
  pasos = '[{"titulo":"Escucho","texto":"Qué quieres contar, a quién y dónde se va a ver."},{"titulo":"Propongo","texto":"Si el proyecto ya tiene rumbo, me adapto a él; si no, te propongo una idea y cómo rodarla."},{"titulo":"Ruedo","texto":"Con la mirada puesta ya en el montaje."},{"titulo":"Entrego","texto":"Monto y afino contigo hasta que te emocione, o te dejo el material listo para tu montaje."}]'::jsonb, preguntas = '[{"pregunta":"¿Te sumas a proyectos de otros?","respuesta":"Sí, y es buena parte de mi trabajo. Productoras y compañeros me llaman como filmmaker o como operador de cámara, y me adapto a la dirección, al equipo y a los tiempos del rodaje."},{"pregunta":"¿Necesito tener la idea clara?","respuesta":"No. Muchas veces la mejor idea sale de la primera conversación. Tú me cuentas qué quieres provocar y yo te propongo cómo contarlo."},{"pregunta":"¿Qué tipo de proyectos haces?","respuesta":"Vídeo corporativo y spots, videoclips, conciertos, eventos, deporte, bodas, contenido para redes y encargos de particulares. Si se puede contar con una cámara, hablemos."},{"pregunta":"¿Qué tiene de distinto un vídeo tuyo de boda?","respuesta":"Lo planteo como un tráiler documental de unos 20 minutos, con la música elegida al milímetro. Una película que apetezca volver a ver, no un resumen del día."},{"pregunta":"¿Y en conciertos y eventos?","respuesta":"Antes de tocar la imagen construyo la música. Así la edición respira con el directo y te sientes en primera fila."},{"pregunta":"¿Dónde trabajas?","respuesta":"Trabajo desde Alicante en toda la Comunidad Valenciana, y donde me lleve la historia."}]'::jsonb,
  llamada = '¿Tienes algo que contar, o un rodaje en marcha?', seo_titulo = 'Filmmaker en Alicante · Josep Mira Lozano', seo_descripcion = 'Vídeo corporativo, spots, videoclips, conciertos, eventos, deporte y bodas. Me sumo a tu equipo o llevo el proyecto de la idea al montaje.', orden = 2,
  estado = 'publicado', publicado_en = coalesce(publicado_en, now())
where slug = 'filmmaker' and idioma = 'es';

update public.servicios set
  nombre = 'Edición', frase = 'El ritmo es lo que hace que no puedas dejar de mirar.', resumen = 'Monto con el ritmo por dentro, como una partitura: que la imagen respire con la música.',
  mirada = '["El montaje es donde la historia se escribe por última vez. Puedes tener los mejores planos del mundo y que no emocionen, o unas pocas imágenes que te atrapen. La diferencia está en el ritmo.","Toco la percusión desde los 3 años, y eso se nota cuando monto. No encadeno planos bonitos: construyo una partitura. En Kiboko tuve que tejer horas de entrevistas reales con escenas de ficción sin que se notaran las costuras. En los aftermovies de conciertos, lo que busco es que la imagen baile al compás del directo."]'::jsonb, aporto = '["Una lectura del material para encontrar la historia que hay dentro","Un montaje con estructura y ritmo pensados para dónde se va a ver","El color, para que la imagen tenga una identidad","El sonido y la música, que son la mitad de lo que sentimos","Versiones para redes cuando hacen falta"]'::jsonb, para_quien = '["Documentales","Aftermovies","Redes"]'::jsonb, con_quien = 'Productoras y directores con un documental, corto o videoclip ya rodado, artistas y eventos que quieren un aftermovie, y creadores y marcas que necesitan contenido con alma.',
  pasos = '[{"titulo":"Escucho","texto":"Me pasas el material y me cuentas qué quieres provocar."},{"titulo":"Busco la historia","texto":"Reviso todo y te enseño una primera estructura."},{"titulo":"Afinamos","texto":"Ritmo, música y color, con tus comentarios."},{"titulo":"Entrego","texto":"En los formatos que necesites."}]'::jsonb, preguntas = '[{"pregunta":"¿Qué hace que un montaje funcione?","respuesta":"Que no se note. Que el espectador sienta lo que tiene que sentir sin darse cuenta de por qué. Eso se consigue con ritmo, y el ritmo se entrena."},{"pregunta":"¿Puedo encargarte solo el color o solo el sonido?","respuesta":"Sí, puedo encargarme solo de una parte de la postproducción."},{"pregunta":"¿Editas contenido para redes con regularidad?","respuesta":"Sí. He editado para creadores, YouTubers, Disney y el Consell Valencià de la Joventut."},{"pregunta":"¿Cómo te paso el material?","respuesta":"Por un enlace de descarga o en disco si es mucho."}]'::jsonb,
  llamada = '¿Tienes material esperando su historia?', seo_titulo = 'Montador y editor de vídeo en Alicante · Josep Mira Lozano', seo_descripcion = 'Montaje, color y sonido para documentales, videoclips, spots, eventos y redes. El ritmo como forma de contar.', orden = 3,
  estado = 'publicado', publicado_en = coalesce(publicado_en, now())
where slug = 'edicion' and idioma = 'es';

insert into public.clientes (nombre, logo_id, alto_logo, estilo, con_juno, orden, estado, publicado_en)
select 'Disney', (select id from public.medios where url_origen = 'https://www.edigitalagency.com.au/wp-content/uploads/new-Disney-logo-white-png-large-size.png'), 44, 'logo', false, 1, 'publicado', now()
where not exists (select 1 from public.clientes where nombre = 'Disney');

insert into public.clientes (nombre, logo_id, alto_logo, estilo, con_juno, orden, estado, publicado_en)
select 'Star Wars', (select id from public.medios where url_origen = 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Star_wars2.svg'), 46, 'logo', false, 2, 'publicado', now()
where not exists (select 1 from public.clientes where nombre = 'Star Wars');

insert into public.clientes (nombre, logo_id, alto_logo, estilo, con_juno, orden, estado, publicado_en)
select 'Kinepolis', null, null, 'nombre', false, 3, 'publicado', now()
where not exists (select 1 from public.clientes where nombre = 'Kinepolis');

insert into public.clientes (nombre, logo_id, alto_logo, estilo, con_juno, orden, estado, publicado_en)
select 'Consell Valencià de la Joventut', null, null, 'nombre', false, 4, 'publicado', now()
where not exists (select 1 from public.clientes where nombre = 'Consell Valencià de la Joventut');

insert into public.clientes (nombre, logo_id, alto_logo, estilo, con_juno, orden, estado, publicado_en)
select 'Ayuntamiento de l''Alfàs del Pi', null, null, 'nombre', false, 5, 'publicado', now()
where not exists (select 1 from public.clientes where nombre = 'Ayuntamiento de l''Alfàs del Pi');

insert into public.clientes (nombre, logo_id, alto_logo, estilo, con_juno, orden, estado, publicado_en)
select 'Ocisport', null, null, 'nombre', false, 6, 'publicado', now()
where not exists (select 1 from public.clientes where nombre = 'Ocisport');

insert into public.clientes (nombre, logo_id, alto_logo, estilo, con_juno, orden, estado, publicado_en)
select 'Mediterra Cinema', null, null, 'nombre', false, 7, 'publicado', now()
where not exists (select 1 from public.clientes where nombre = 'Mediterra Cinema');

insert into public.clientes (nombre, logo_id, alto_logo, estilo, con_juno, orden, estado, publicado_en)
select 'Cero Coma', null, null, 'nombre', false, 8, 'publicado', now()
where not exists (select 1 from public.clientes where nombre = 'Cero Coma');

insert into public.clientes (nombre, logo_id, alto_logo, estilo, con_juno, orden, estado, publicado_en)
select 'Dreamore', null, null, 'nombre', false, 9, 'publicado', now()
where not exists (select 1 from public.clientes where nombre = 'Dreamore');

insert into public.clientes (nombre, logo_id, alto_logo, estilo, con_juno, orden, estado, publicado_en)
select 'Kymera Producciones', null, null, 'nombre', false, 10, 'publicado', now()
where not exists (select 1 from public.clientes where nombre = 'Kymera Producciones');

insert into public.clientes (nombre, logo_id, alto_logo, estilo, con_juno, orden, estado, publicado_en)
select 'ForecourtTech', null, null, 'nombre', true, 11, 'publicado', now()
where not exists (select 1 from public.clientes where nombre = 'ForecourtTech');

insert into public.clientes (nombre, logo_id, alto_logo, estilo, con_juno, orden, estado, publicado_en)
select 'Arkano', null, null, 'firma', true, 12, 'publicado', now()
where not exists (select 1 from public.clientes where nombre = 'Arkano');

insert into public.clientes (nombre, logo_id, alto_logo, estilo, con_juno, orden, estado, publicado_en)
select 'SOM Events', null, null, 'nombre', true, 13, 'publicado', now()
where not exists (select 1 from public.clientes where nombre = 'SOM Events');

insert into public.clientes (nombre, logo_id, alto_logo, estilo, con_juno, orden, estado, publicado_en)
select 'Albir Confort', null, null, 'nombre', true, 14, 'publicado', now()
where not exists (select 1 from public.clientes where nombre = 'Albir Confort');

insert into public.clientes (nombre, logo_id, alto_logo, estilo, con_juno, orden, estado, publicado_en)
select 'Mapache Events', null, null, 'nombre', true, 15, 'publicado', now()
where not exists (select 1 from public.clientes where nombre = 'Mapache Events');

insert into public.opiniones (texto, autor, contexto, orden, estado, publicado_en)
select 'La verdad que es increíble, nos ha encantado. Ha quedado realmente precioso, es espectacular.', 'Novios', 'Vídeo de boda', 1, 'publicado', now()
where not exists (select 1 from public.opiniones where texto = 'La verdad que es increíble, nos ha encantado. Ha quedado realmente precioso, es espectacular.');

insert into public.opiniones (texto, autor, contexto, orden, estado, publicado_en)
select 'Jo, me he emocionado. Me encanta. Es simplemente... PERFECTO. Mil gracias.', 'Cliente', 'Proyecto audiovisual', 2, 'publicado', now()
where not exists (select 1 from public.opiniones where texto = 'Jo, me he emocionado. Me encanta. Es simplemente... PERFECTO. Mil gracias.');

insert into public.opiniones (texto, autor, contexto, orden, estado, publicado_en)
select 'GUUUAAAUUUUU, brutaaaaaal.', 'Organización', 'Vídeo resumen de evento', 3, 'publicado', now()
where not exists (select 1 from public.opiniones where texto = 'GUUUAAAUUUUU, brutaaaaaal.');

insert into public.opiniones (texto, autor, contexto, orden, estado, publicado_en)
select 'He visto el vídeo resumen y muy chulo. Muy guapos los cambios.', 'Organización', 'Vídeo resumen de evento', 4, 'publicado', now()
where not exists (select 1 from public.opiniones where texto = 'He visto el vídeo resumen y muy chulo. Muy guapos los cambios.');

insert into public.opiniones (texto, autor, contexto, orden, estado, publicado_en)
select 'Está superguay, Josep. Muy chulo, muy chulo, muy chulo.', 'Artista', 'Aftermovie', 5, 'publicado', now()
where not exists (select 1 from public.opiniones where texto = 'Está superguay, Josep. Muy chulo, muy chulo, muy chulo.');

insert into public.opiniones (texto, autor, contexto, orden, estado, publicado_en)
select '¡Josep! ¡Qué eres un puto máquina, tío! Ens ha flipat a tots mogolló.', 'Cliente', 'Vídeo de evento', 6, 'borrador', null
where not exists (select 1 from public.opiniones where texto = '¡Josep! ¡Qué eres un puto máquina, tío! Ens ha flipat a tots mogolló.');

insert into public.canales (nombre, texto, url, orden, estado, publicado_en)
select 'Del Fan, Para el Fan', 'Donde empecé a compartir mi pasión por el cine, mucho antes de dedicarme a rodar.', null, 1, 'publicado', now()
where not exists (select 1 from public.canales where nombre = 'Del Fan, Para el Fan');

insert into public.canales (nombre, texto, url, orden, estado, publicado_en)
select 'Josep Mira', 'Recreo planos míticos del cine con pocos medios y cuento cómo se hicieron.', 'https://www.youtube.com/channel/UCtyNSF1X0pNPxp5fhwu1NUA', 2, 'publicado', now()
where not exists (select 1 from public.canales where nombre = 'Josep Mira');

insert into public.ajustes (clave, valor) values ('sitio', '{"nombre":"Josep Mira Lozano","lema":"Dirección de fotografía, filmmaker y edición","correo":"josep.mira@gmail.com","whatsapp":"34618867115","disponible":true,"ubicacion":"Alicante","redes":{"instagram":"https://www.instagram.com/josepmiralozano/","youtube":"https://www.youtube.com/channel/UCtyNSF1X0pNPxp5fhwu1NUA","linkedin":"https://www.linkedin.com/in/josep-mira-lozano-a70798214/"}}'::jsonb)
on conflict (clave) do update set valor = excluded.valor
where public.ajustes.valor ->> 'correo' is null;

insert into public.paginas (slug, titulo, seo_titulo, seo_descripcion, estado, publicado_en) values ('inicio', 'Inicio',
  'Josep Mira Lozano · Director de fotografía y filmmaker en Alicante',
  'Cuento historias con luz. Dirección de fotografía, grabación y edición de cortos, videoclips, spots y eventos en Alicante y la Comunidad Valenciana.',
  'publicado', now())
on conflict (idioma, slug) do nothing;

insert into public.bloques (pagina_id, orden, tipo, visible, datos)
select p.id, 0, 'portada', true, '{"antetitulo":"Director de fotografía · Filmmaker · Editor","titulo":"Historias hechas de luz.","texto":"Me llamo Josep y llevo más de nueve años contando historias con luz, encuadre y ritmo. Cada plano que firmo lleva algo de mí.","papeles":["director de fotografía","filmmaker","editor"]}'::jsonb || jsonb_build_object('video', jsonb_build_object('youtubeId', 'dHp3YUb1x2I', 'inicio', 12, 'poster', (select id::text from public.medios where url_origen = 'https://i.imgur.com/ESU7wLA.jpeg'), 'medio', null, 'recorte', 1.45))
from public.paginas p
where p.slug = 'inicio' and p.idioma = 'es'
  and not exists (select 1 from public.bloques x where x.pagina_id = p.id and x.tipo = 'portada');

insert into public.bloques (pagina_id, orden, tipo, visible, datos)
select p.id, 1, 'servicios', true, '{"antetitulo":"Lo que hago","titulo":"¿En qué te puedo ayudar?","texto":"Tres formas de trabajar juntos. Elige una y la vemos con calma."}'::jsonb
from public.paginas p
where p.slug = 'inicio' and p.idioma = 'es'
  and not exists (select 1 from public.bloques x where x.pagina_id = p.id and x.tipo = 'servicios');

insert into public.bloques (pagina_id, orden, tipo, visible, datos)
select p.id, 2, 'filmmaker', true, '{"antetitulo":"Filmmaker","titulo":"Lo que puedo grabar para ti","texto":"Para productoras, empresas o particulares: del vídeo corporativo a la boda, cada encargo con la misma mirada de cine.","enlace":{"texto":"Cómo trabajo como filmmaker","href":"/servicios/filmmaker"}}'::jsonb || jsonb_build_object('piezas', jsonb_build_array(jsonb_build_object('nombre', 'Spots y vídeo corporativo', 'texto', 'Para marcas y empresas que quieren contar algo con alma, no solo enseñar un producto.', 'proyecto', (select id::text from public.proyectos where slug = 'expandete-spot-juno-media' and idioma = 'es')), jsonb_build_object('nombre', 'Videoclips', 'texto', 'La canción manda: una imagen que respira al ritmo de la música.', 'proyecto', (select id::text from public.proyectos where slug = '100-baladas-arkano' and idioma = 'es')), jsonb_build_object('nombre', 'Conciertos y aftermovies', 'texto', 'Monto como músico, para que la imagen baile al compás del directo.', 'proyecto', (select id::text from public.proyectos where slug = 'conciertos' and idioma = 'es')), jsonb_build_object('nombre', 'Bodas', 'texto', 'Una película que apetezca volver a ver, no un resumen del día.', 'proyecto', (select id::text from public.proyectos where slug = 'bodas' and idioma = 'es')), jsonb_build_object('nombre', 'Eventos deportivos', 'texto', 'El esfuerzo, la técnica y la tensión, con el espectador al borde del asiento.', 'proyecto', (select id::text from public.proyectos where slug = 'eventos-deportivos' and idioma = 'es')), jsonb_build_object('nombre', 'Contenido para redes', 'texto', 'Piezas verticales pensadas para el móvil, con el ritmo de cada perfil.', 'proyecto', (select id::text from public.proyectos where slug = 'reels-redes-sociales' and idioma = 'es'))))
from public.paginas p
where p.slug = 'inicio' and p.idioma = 'es'
  and not exists (select 1 from public.bloques x where x.pagina_id = p.id and x.tipo = 'filmmaker');

insert into public.bloques (pagina_id, orden, tipo, visible, datos)
select p.id, 3, 'trabajos', true, '{"antetitulo":"Selección","titulo":"Trabajos de los que estoy orgulloso"}'::jsonb
from public.paginas p
where p.slug = 'inicio' and p.idioma = 'es'
  and not exists (select 1 from public.bloques x where x.pagina_id = p.id and x.tipo = 'trabajos');

insert into public.bloques (pagina_id, orden, tipo, visible, datos)
select p.id, 4, 'sobre-mi', true, '{"antetitulo":"Quién soy","titulo":"Hola, soy Josep","texto":"Empecé con la música y la interpretación, y en el vídeo encontré la forma de juntarlo todo. Desde entonces he rodado cortos, videoclips, spots, conciertos y bodas, y llevo más de nueve años en YouTube recreando planos míticos del cine con cuatro duros. Me gusta trabajar en equipo, resolver problemas en el set y que la gente se olvide de que hay una cámara.","etiqueta":"+9 años · Alicante","cita":"La cámara se convierte en la extensión de mi mirada.","papeles":["Director de fotografía","Filmmaker","Editor","Operador de cámara","Gaffer","Realizador"],"enlace":{"texto":"Conóceme mejor","href":"/sobre-mi"}}'::jsonb || jsonb_build_object('imagen', (select id::text from public.medios where url_origen = 'https://i.postimg.cc/Qh3FMz10/Captura-de-pantalla-2026-05-13-161052.png'))
from public.paginas p
where p.slug = 'inicio' and p.idioma = 'es'
  and not exists (select 1 from public.bloques x where x.pagina_id = p.id and x.tipo = 'sobre-mi');

insert into public.bloques (pagina_id, orden, tipo, visible, datos)
select p.id, 5, 'cifras', true, '{"antetitulo":"En números","titulo":"Más de nueve años detrás de la cámara","cifras":[{"valor":9,"prefijo":"+","unidad":"años","texto":"contando historias: primero en YouTube, después en el set"},{"valor":1.39,"decimales":2,"sufijo":" M","unidad":"visualizaciones","texto":"del EP Oscuridad, de Adrián Muñoz"}]}'::jsonb
from public.paginas p
where p.slug = 'inicio' and p.idioma = 'es'
  and not exists (select 1 from public.bloques x where x.pagina_id = p.id and x.tipo = 'cifras');

insert into public.bloques (pagina_id, orden, tipo, visible, datos)
select p.id, 6, 'proceso', true, '{"antetitulo":"Cómo trabajamos","titulo":"De tu idea a la pantalla, paso a paso","pasos":[{"titulo":"Escucho","texto":"Me cuentas la historia, el tono y lo que quieres que sienta quien la vea. Sin prisas y sin formularios eternos."},{"titulo":"Imagino","texto":"Te propongo una mirada: referencias, luz, encuadres, ritmo. Lo vemos juntos antes de grabar nada."},{"titulo":"Ruedo","texto":"Me encargo de la imagen para que tú puedas centrarte en lo tuyo. Discreto cuando toca, ambicioso cuando se puede."},{"titulo":"Cuido el final","texto":"Montaje, color y sonido con el mismo mimo que el rodaje, hasta que el resultado sea el que soñamos."}]}'::jsonb
from public.paginas p
where p.slug = 'inicio' and p.idioma = 'es'
  and not exists (select 1 from public.bloques x where x.pagina_id = p.id and x.tipo = 'proceso');

insert into public.bloques (pagina_id, orden, tipo, visible, datos)
select p.id, 7, 'opiniones', true, '{"antetitulo":"Opiniones","titulo":"Lo que dicen quienes han confiado en mí"}'::jsonb
from public.paginas p
where p.slug = 'inicio' and p.idioma = 'es'
  and not exists (select 1 from public.bloques x where x.pagina_id = p.id and x.tipo = 'opiniones');

insert into public.bloques (pagina_id, orden, tipo, visible, datos)
select p.id, 8, 'clientes', true, '{"antetitulo":"Clientes","titulo":"Han confiado en mí","juno":{"texto":"Trabajo codo con codo con JUNO Media en producciones para marcas como estas."}}'::jsonb
from public.paginas p
where p.slug = 'inicio' and p.idioma = 'es'
  and not exists (select 1 from public.bloques x where x.pagina_id = p.id and x.tipo = 'clientes');

insert into public.bloques (pagina_id, orden, tipo, visible, datos)
select p.id, 9, 'blog', true, '{"antetitulo":"Blog","titulo":"Lo que aprendo por el camino","cantidad":3,"enlace":{"texto":"Todos los artículos","href":"/blog"}}'::jsonb
from public.paginas p
where p.slug = 'inicio' and p.idioma = 'es'
  and not exists (select 1 from public.bloques x where x.pagina_id = p.id and x.tipo = 'blog');

insert into public.bloques (pagina_id, orden, tipo, visible, datos)
select p.id, 10, 'llamada', true, '{"titulo":"¿Tienes una historia que contar?","texto":"Cuéntamela. Me encantará escucharla y pensar cómo llevarla a la pantalla.","opciones":["Videoclip","Cortometraje","Spot","Evento","Boda","Redes sociales"],"nota":"Te respondo personalmente, normalmente en menos de 24 horas."}'::jsonb
from public.paginas p
where p.slug = 'inicio' and p.idioma = 'es'
  and not exists (select 1 from public.bloques x where x.pagina_id = p.id and x.tipo = 'llamada');

commit;
