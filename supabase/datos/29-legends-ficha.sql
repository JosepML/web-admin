-- Ficha de Legends (2026-10-26): aftermovie del concierto de Legends (grupo de tributos de SOM Events, 28/09/2024), proyecto de JUNO Media.
-- Ya aplicado en la base de datos, y publicado; este archivo es el registro. Slug: legends-aftermovie.
-- Medios: vídeo en R2 (legends/legends-videoresumen-28-09-24.mp4, medio ee4afe23-60c8-4e8a-9249-c7b6559ca58f) y 8 fotogramas en medios/fotogramas/.
-- Enlazada a los servicios Filmmaker y Edición:
insert into public.proyecto_servicios (proyecto_id, servicio_id)
select p.id, s.id from public.proyectos p, public.servicios s
where p.idioma = 'es' and p.slug = 'legends-aftermovie' and s.idioma = 'es' and s.slug in ('filmmaker', 'edicion')
on conflict do nothing;
