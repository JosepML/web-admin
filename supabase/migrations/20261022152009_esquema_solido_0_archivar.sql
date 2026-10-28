-- Esquema sólido, parte 0: aparta la primera versión (20261022144748_esquema_inicial) sin borrar nada.
-- Sus tablas estaban vacías (respaldo en supabase/respaldos/2026-10-22-antes-de-limpiar.md). Se mueven al
-- esquema `archivo_v1`, que la API no expone; se pueden borrar más adelante desde el panel de Supabase.
-- `ajustes` también se aparta: la parte 1 la crea limpia y copia sus filas.
-- Las políticas del bucket se reconvierten aparte (storage.objects no admite ALTER POLICY en migraciones).

create schema if not exists archivo_v1;
revoke all on schema archivo_v1 from public, anon, authenticated;

alter table public.servicios set schema archivo_v1;
alter table public.proyectos set schema archivo_v1;
alter table public.articulos set schema archivo_v1;
alter table public.paginas set schema archivo_v1;
alter table public.bloques set schema archivo_v1;
alter table public.clientes set schema archivo_v1;
alter table public.opiniones set schema archivo_v1;
alter table public.canales set schema archivo_v1;
alter table public.medios set schema archivo_v1;
alter table public.mensajes set schema archivo_v1;
alter table public.borradores set schema archivo_v1;
alter table public.ajustes set schema archivo_v1;
alter function public.limitar_mensajes() set schema archivo_v1;

-- Almacenamiento (ejecutado aparte con execute_sql: en una migración, storage.objects no admite ALTER POLICY;
-- y renombrar exige ser propietario de la tabla, así que los nombres antiguos se quedan):
-- «Medios: escritura solo administrador» (todas las acciones, solo admin) es justo la que hace falta y se deja.
-- «Medios: lectura pública» dejaba listar el bucket: se anula. Las URLs públicas de los archivos no la necesitan.
-- alter policy "Medios: lectura pública" on storage.objects to anon using (false);
