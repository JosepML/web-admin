-- Imitación mínima de Supabase para probar las migraciones en un PostgreSQL local (16 o superior).
-- Crea los roles, auth.users, auth.uid() y las tablas de storage que usan las migraciones.
-- Uso (base vacía):
--   psql -f supabase/tests/entorno_local.sql
--   psql -f supabase/migrations/<cada migración, en orden>.sql
--   psql -f supabase/tests/seguridad_y_publicacion.sql
-- No se ejecuta nunca contra el proyecto real.

-- Los roles son de todo el servidor: se crean solo si no existen (la base se puede rehacer sin tocarlos)
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then create role service_role nologin bypassrls; end if;
end;
$$;

grant usage on schema public to anon, authenticated, service_role;

-- Como en Supabase: las tablas y funciones nuevas de public dan permisos a los tres roles
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema public grant execute on functions to anon, authenticated, service_role;

create schema auth;
grant usage on schema auth to anon, authenticated, service_role;

create table auth.users (
  id uuid primary key,
  email text
);

create function auth.uid() returns uuid language sql stable as $$
  select coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;
grant execute on function auth.uid() to anon, authenticated, service_role;

create schema storage;
grant usage on schema storage to anon, authenticated, service_role;

create table storage.buckets (
  id text primary key,
  name text not null,
  public boolean default false,
  file_size_limit bigint,
  allowed_mime_types text[]
);

create table storage.objects (
  id uuid primary key default gen_random_uuid(),
  bucket_id text references storage.buckets (id),
  name text
);
alter table storage.objects enable row level security;
grant all on storage.objects, storage.buckets to anon, authenticated, service_role;
