-- Esquema sólido, parte 3 de 3: políticas RLS, permisos y almacenamiento.
-- Razones en plan/esquema.md.

-- 16. Seguridad (RLS) -----------------------------------------------------------------
-- Una sola política por rol y acción, para que Postgres no evalúe varias (advisor de rendimiento).

do $$
declare
  t text;
begin
  -- Contenido con estado: el público ve lo publicado; el administrador, todo.
  foreach t in array array['servicios', 'proyectos', 'articulos', 'paginas', 'clientes', 'opiniones', 'canales'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "Público: lee lo publicado" on public.%I for select to anon using (estado = ''publicado'')', t);
    execute format('create policy "Sesión: lee lo publicado o, si es administrador, todo" on public.%I for select to authenticated using (estado = ''publicado'' or (select public.es_admin()))', t);
    execute format('create policy "Administrador: crea" on public.%I for insert to authenticated with check ((select public.es_admin()))', t);
    execute format('create policy "Administrador: cambia" on public.%I for update to authenticated using ((select public.es_admin())) with check ((select public.es_admin()))', t);
    execute format('create policy "Administrador: borra" on public.%I for delete to authenticated using ((select public.es_admin()))', t);
  end loop;

  -- Catálogos públicos: todos leen; solo el administrador escribe.
  foreach t in array array['ajustes', 'idiomas', 'medios', 'tipos_proyecto', 'categorias_articulo', 'redirecciones'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "Todos: leen" on public.%I for select to anon, authenticated using (true)', t);
    execute format('create policy "Administrador: crea" on public.%I for insert to authenticated with check ((select public.es_admin()))', t);
    execute format('create policy "Administrador: cambia" on public.%I for update to authenticated using ((select public.es_admin())) with check ((select public.es_admin()))', t);
    execute format('create policy "Administrador: borra" on public.%I for delete to authenticated using ((select public.es_admin()))', t);
  end loop;

  -- Solo administrador.
  foreach t in array array['borradores', 'revisiones'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "Administrador: todo" on public.%I for all to authenticated using ((select public.es_admin())) with check ((select public.es_admin()))', t);
  end loop;

end;
$$;

-- Bloques y servicios de un proyecto: visibles si su página o su proyecto está publicado.
alter table public.bloques enable row level security;
create policy "Público: lee los bloques de páginas publicadas" on public.bloques for select to anon
  using (exists (select 1 from public.paginas p where p.id = pagina_id and p.estado = 'publicado'));
create policy "Sesión: lee publicados o, si es administrador, todos" on public.bloques for select to authenticated
  using ((select public.es_admin()) or exists (select 1 from public.paginas p where p.id = pagina_id and p.estado = 'publicado'));
create policy "Administrador: crea" on public.bloques for insert to authenticated with check ((select public.es_admin()));
create policy "Administrador: cambia" on public.bloques for update to authenticated using ((select public.es_admin())) with check ((select public.es_admin()));
create policy "Administrador: borra" on public.bloques for delete to authenticated using ((select public.es_admin()));

alter table public.proyecto_servicios enable row level security;
create policy "Público: lee los de proyectos publicados" on public.proyecto_servicios for select to anon
  using (exists (select 1 from public.proyectos p where p.id = proyecto_id and p.estado = 'publicado'));
create policy "Sesión: lee publicados o, si es administrador, todos" on public.proyecto_servicios for select to authenticated
  using ((select public.es_admin()) or exists (select 1 from public.proyectos p where p.id = proyecto_id and p.estado = 'publicado'));
create policy "Administrador: crea" on public.proyecto_servicios for insert to authenticated with check ((select public.es_admin()));
create policy "Administrador: cambia" on public.proyecto_servicios for update to authenticated using ((select public.es_admin())) with check ((select public.es_admin()));
create policy "Administrador: borra" on public.proyecto_servicios for delete to authenticated using ((select public.es_admin()));

-- Mensajes: cualquiera envía uno nuevo; solo el administrador los lee y gestiona.
alter table public.mensajes enable row level security;
create policy "Todos: envían un mensaje nuevo" on public.mensajes for insert to anon, authenticated
  with check (estado = 'nuevo' and notas = '');
create policy "Administrador: lee" on public.mensajes for select to authenticated using ((select public.es_admin()));
create policy "Administrador: cambia" on public.mensajes for update to authenticated using ((select public.es_admin())) with check ((select public.es_admin()));
create policy "Administrador: borra" on public.mensajes for delete to authenticated using ((select public.es_admin()));

-- 17. Permisos ------------------------------------------------------------------------
-- Defensa en profundidad: aunque una política fallara, el público no tiene permiso sobre estas tablas.

revoke all on public.borradores, public.revisiones, public.administradores from anon;
revoke select, update, delete on public.mensajes from anon;
-- TRUNCATE no pasa por RLS: nadie desde la API.
revoke truncate, references, trigger on all tables in schema public from anon, authenticated;

-- Funciones: el público no ejecuta ninguna; la sesión solo lo que usa el panel.
revoke execute on all functions in schema public from public, anon;
grant execute on function
  public.es_admin(), public.publicar(text, uuid), public.descartar(text, uuid), public.restaurar_revision(uuid),
  public.columnas_editables(text), public.claves_extra(text), public.extras_publicados(text, uuid),
  public.comprobar_lista_medios(jsonb, text), public.sincronizar_servicios(uuid, jsonb), public.sincronizar_bloques(uuid, jsonb)
  to authenticated;
revoke execute on function public.limitar_mensajes() from authenticated;

-- 18. Almacenamiento ------------------------------------------------------------------
-- Bucket público: las URLs de los archivos se sirven sin política de lectura, así que no hace falta
-- (y no se crea) una política SELECT para el público. Sin ella nadie puede listar el bucket.

update storage.buckets
set file_size_limit = 52428800,
    allowed_mime_types = array[
      'image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'image/svg+xml',
      'video/mp4', 'video/webm', 'application/pdf'
    ]
where id = 'medios';

-- Las políticas del bucket vienen de la primera versión, reconvertidas en la parte 0:
-- «Medios: escritura solo administrador» (todas las acciones, solo admin) y «Medios: lectura pública»,
-- anulada (anon, using false). Los nombres no se pueden cambiar desde aquí.
