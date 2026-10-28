-- Carpetas de la biblioteca: agrupan los archivos (una carpeta por proyecto, por ejemplo). Un archivo está en
-- una carpeta o en ninguna; si se borra la carpeta, sus archivos quedan sin carpeta (no se borran).
create table public.carpetas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null check (char_length(nombre) between 1 and 120),
  creado_en timestamptz not null default now()
);

alter table public.carpetas enable row level security;
create policy "Administrador: todo" on public.carpetas for all to authenticated
  using ((select public.es_admin())) with check ((select public.es_admin()));

alter table public.medios add column carpeta_id uuid references public.carpetas (id) on delete set null;
create index medios_carpeta_idx on public.medios (carpeta_id);

-- Lo que ya hay: una carpeta por proyecto con fotos (poster, cabecera, clip, portada de vídeo y galería).
-- Un archivo que ya tenga carpeta no se mueve; los que no se usan en ningún proyecto se quedan sin carpeta.
do $$
declare
  p record;
  ids uuid[];
  c uuid;
begin
  for p in select id, titulo, imagen_id, imagen_cabecera_id, clip_id, video_portada_id, galeria from public.proyectos loop
    ids := array_remove(array[p.imagen_id, p.imagen_cabecera_id, p.clip_id, p.video_portada_id], null)
      || coalesce(array(
           select (g->>'medio')::uuid
           from jsonb_array_elements(coalesce(p.galeria, '[]'::jsonb)) g
           where g->>'medio' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
         ), '{}');
    if not exists (select 1 from public.medios where id = any(ids) and carpeta_id is null) then continue; end if;
    insert into public.carpetas (nombre) values (p.titulo) returning id into c;
    update public.medios set carpeta_id = c where id = any(ids) and carpeta_id is null;
  end loop;
end $$;
