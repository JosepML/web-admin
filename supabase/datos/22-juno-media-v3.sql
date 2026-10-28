-- Página JUNO Media, versión 3 (2026-10-26): sin pasos ni «independiente». Cuenta la relación entre un filmmaker y una
-- productora (profesional, artística y personal). Bloques: 0 cabecera, 1 cita, 2 proyectos de gran envergadura,
-- 3 proyectos hechos juntos, 4 enlace a su web, 5 llamada. Actualiza los bloques existentes; no borra nada.
begin;

update public.bloques set tipo = 'texto'::public.tipo_bloque, datos = $json${"estilo": "cabecera", "antetitulo": "En sinergia con JUNO Media", "titulo": "Trabajamos *juntos*", "imagen": "508f8ec8-b800-45cd-bf9a-013f1b276ef9", "texto": "JUNO Media es una productora audiovisual y cinematográfica con la que mantengo una colaboración muy estrecha. Nos une una relación profesional, artística y personal, y los proyectos que nacen allí los sacamos adelante Noelia Fluxà y yo."}$json$::jsonb where pagina_id = (select id from public.paginas where slug = 'juno-media' and idioma = 'es') and orden = 0;

update public.bloques set tipo = 'cita'::public.tipo_bloque, datos = $json${"titulo": "Profesional, artística y *personal*."}$json$::jsonb where pagina_id = (select id from public.paginas where slug = 'juno-media' and idioma = 'es') and orden = 1;

update public.bloques set tipo = 'texto'::public.tipo_bloque, datos = $json${"estilo": "tarjeta", "antetitulo": "Cuando el proyecto lo pide", "titulo": "Proyectos de gran *envergadura*", "imagen": "d8248ed7-bb85-48e0-8559-4a9779e5deb8", "texto": "Si tu proyecto es de gran envergadura, JUNO Media pone la producción: una productora audiovisual y cinematográfica completa. Puedes elegir esta opción desde el primer día, y yo mismo te la propondré si creo que tu proyecto la necesita."}$json$::jsonb where pagina_id = (select id from public.paginas where slug = 'juno-media' and idioma = 'es') and orden = 2;

update public.bloques set datos = $json${"antetitulo": "Proyectos con JUNO Media", "titulo": "Lo que hemos hecho *juntos*", "origen": "juno"}$json$::jsonb where pagina_id = (select id from public.paginas where slug = 'juno-media' and idioma = 'es') and orden = 3;

update public.bloques set datos = $json${"estilo": "tarjeta", "antetitulo": "La productora", "titulo": "Conoce a *JUNO Media*", "imagen": "dd1964cd-fa6b-4a57-ae39-635aa3913627", "texto": "Productora audiovisual y cinematográfica, a la medida de cada proyecto. Aquí puedes ver quiénes son y qué hacen.", "enlace": {"texto": "Visitar junomedia.es", "href": "https://junomedia.es"}}$json$::jsonb where pagina_id = (select id from public.paginas where slug = 'juno-media' and idioma = 'es') and orden = 4;

update public.bloques set datos = datos || $json${"titulo": "¿Tienes un proyecto en mente?", "texto": "Cuéntamelo y vemos cómo sacarlo adelante, con JUNO Media si el proyecto lo pide."}$json$::jsonb where pagina_id = (select id from public.paginas where slug = 'juno-media' and idioma = 'es') and orden = 5;

update public.paginas set seo_descripcion = $t$Mi colaboración con JUNO Media, productora audiovisual y cinematográfica: una relación profesional, artística y personal.$t$ where slug = 'juno-media' and idioma = 'es';

commit;
