-- Esquema inicial de la web nueva de Josep Mira (tarea B, fase 4).
-- Tablas y columnas en español. `estado` decide qué ve el público (borrador o publicado).
-- Los cambios pendientes de una fila viven en `borradores` hasta que Josep pulsa Publicar.

-- Administración -----------------------------------------------------------------

create table administradores (
  user_id uuid primary key references auth.users (id) on delete cascade,
  creado_en timestamptz not null default now()
);

alter table administradores enable row level security;

create policy "Cada administrador ve su propia fila"
  on administradores for select to authenticated
  using (user_id = (select auth.uid()));

-- SECURITY INVOKER: la RLS de administradores deja leer la propia fila, sin funciones con privilegios.
create function es_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.administradores a where a.user_id = (select auth.uid())
  );
$$;

revoke execute on function es_admin() from public, anon;
grant execute on function es_admin() to authenticated;

create function fijar_actualizado_en()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.actualizado_en := now();
  return new;
end;
$$;

-- Servicios ----------------------------------------------------------------------
-- Sin precios: el presupuesto nace de cada proyecto (ver plan/00-contexto.md).

create table servicios (
  id uuid primary key default gen_random_uuid(),
  idioma text not null default 'es',
  slug text not null,
  nombre text not null default '',
  frase text not null default '',
  resumen text not null default '',
  mirada jsonb not null default '[]',
  aporto jsonb not null default '[]',
  para_quien jsonb not null default '[]',
  con_quien text not null default '',
  pasos jsonb not null default '[]',
  preguntas jsonb not null default '[]',
  llamada text not null default '',
  imagen text,
  orden integer not null default 0,
  estado text not null default 'borrador' check (estado in ('borrador', 'publicado')),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  unique (idioma, slug)
);

-- Proyectos ----------------------------------------------------------------------

create table proyectos (
  id uuid primary key default gen_random_uuid(),
  idioma text not null default 'es',
  id_antiguo text,
  slug text not null,
  titulo text not null default '',
  tipo text not null default 'cortometraje' check (tipo in (
    'cortometraje', 'videoclip', 'publicidad', 'documental', 'eventos', 'redes-sociales', 'recreacion'
  )),
  servicios text[] not null default '{}' check (servicios <@ array[
    'direccion-de-fotografia', 'filmmaker', 'edicion'
  ]::text[]),
  anio integer,
  direccion text not null default '',
  productora text not null default '',
  mi_papel text not null default '',
  camara text not null default '',
  premios jsonb not null default '[]',
  frase text not null default '',
  contexto text not null default '',
  rol text not null default '',
  proceso jsonb not null default '[]',
  retos text not null default '',
  resultados text not null default '',
  titulos_seccion jsonb not null default '{}',
  videos jsonb not null default '[]',
  youtube_id text,
  youtube_inicio integer,
  clip_url text,
  video_portada_url text,
  imagen text,
  galeria jsonb not null default '[]',
  destacado boolean not null default false,
  orden integer not null default 0,
  estado text not null default 'borrador' check (estado in ('borrador', 'publicado')),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  unique (idioma, slug),
  unique (idioma, id_antiguo)
);

create index proyectos_servicios_idx on proyectos using gin (servicios);
create index proyectos_publicados_idx on proyectos (estado, destacado, orden);

-- Artículos ----------------------------------------------------------------------

create table articulos (
  id uuid primary key default gen_random_uuid(),
  idioma text not null default 'es',
  id_antiguo text,
  slug text not null,
  titulo text not null default '',
  fecha date not null default current_date,
  extracto text not null default '',
  contenido text not null default '',
  categoria text not null default 'oficio' check (categoria in (
    'oficio', 'direccion-de-fotografia', 'equipo', 'detras-de-camaras'
  )),
  imagen text,
  seo_titulo text not null default '',
  seo_descripcion text not null default '',
  orden integer not null default 0,
  estado text not null default 'borrador' check (estado in ('borrador', 'publicado')),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  unique (idioma, slug),
  unique (idioma, id_antiguo)
);

create index articulos_fecha_idx on articulos (estado, fecha desc);

-- Páginas y bloques --------------------------------------------------------------
-- Una página es una lista ordenada de bloques. `pagina` guarda el slug de la página ('inicio', 'sobre-mi'...).

create table paginas (
  id uuid primary key default gen_random_uuid(),
  idioma text not null default 'es',
  slug text not null,
  titulo text not null default '',
  seo_titulo text not null default '',
  seo_descripcion text not null default '',
  estado text not null default 'borrador' check (estado in ('borrador', 'publicado')),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  unique (idioma, slug)
);

create table bloques (
  id uuid primary key default gen_random_uuid(),
  idioma text not null default 'es',
  pagina text not null,
  orden integer not null default 0,
  tipo text not null check (tipo in (
    'portada', 'texto', 'cita', 'imagen', 'galeria', 'video', 'trabajos',
    'servicios', 'clientes', 'opiniones', 'cta', 'reel'
  )),
  visible boolean not null default true,
  datos jsonb not null default '{}',
  estado text not null default 'borrador' check (estado in ('borrador', 'publicado')),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create index bloques_pagina_idx on bloques (idioma, pagina, orden);

-- Clientes, opiniones y canales --------------------------------------------------

create table clientes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null default '',
  logo text,
  enlace text,
  fila smallint not null default 1 check (fila in (1, 2)),
  con_juno boolean not null default false,
  orden integer not null default 0,
  estado text not null default 'borrador' check (estado in ('borrador', 'publicado')),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create table opiniones (
  id uuid primary key default gen_random_uuid(),
  idioma text not null default 'es',
  cliente text not null default '',
  persona text not null default '',
  texto text not null default '',
  proyecto_id uuid references proyectos (id) on delete set null,
  orden integer not null default 0,
  estado text not null default 'borrador' check (estado in ('borrador', 'publicado')),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create index opiniones_proyecto_idx on opiniones (proyecto_id);

create table canales (
  id uuid primary key default gen_random_uuid(),
  nombre text not null default '',
  url text not null default '',
  descripcion text not null default '',
  cifra text,
  destacado boolean not null default false,
  orden integer not null default 0,
  estado text not null default 'borrador' check (estado in ('borrador', 'publicado')),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

-- Medios (solo administrador) ----------------------------------------------------

create table medios (
  id uuid primary key default gen_random_uuid(),
  ruta text not null unique,
  tipo text not null check (tipo in ('imagen', 'video', 'documento')),
  mime text not null default '',
  bytes bigint not null default 0,
  ancho integer,
  alto integer,
  texto_alternativo text not null default '',
  creado_en timestamptz not null default now()
);

-- Mensajes del formulario de contacto --------------------------------------------

create table mensajes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null check (char_length(nombre) between 2 and 120),
  correo text not null check (char_length(correo) between 5 and 200 and correo ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  telefono text not null default '' check (char_length(telefono) <= 30),
  servicio text not null default '' check (char_length(servicio) <= 60),
  mensaje text not null check (char_length(mensaje) between 10 and 4000),
  origen text not null default 'contacto' check (char_length(origen) <= 60),
  acepta_privacidad boolean not null check (acepta_privacidad),
  estado text not null default 'nuevo' check (estado in ('nuevo', 'respondido', 'cerrado')),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create index mensajes_estado_idx on mensajes (estado, creado_en desc);

-- Tope global de mensajes por hora (freno básico; por IP llegará con la tarea S10).
-- SECURITY DEFINER porque quien escribe es el público, que no puede leer la tabla.
create function limitar_mensajes()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select count(*) from public.mensajes where creado_en > now() - interval '1 hour') >= 30 then
    raise exception 'Hay demasiados mensajes en poco tiempo. Inténtalo más tarde.'
      using errcode = 'P0001';
  end if;
  return new;
end;
$$;

revoke execute on function limitar_mensajes() from public, anon, authenticated;

create trigger mensajes_limite
  before insert on mensajes
  for each row execute function limitar_mensajes();

-- Borradores: cambios pendientes de una fila (solo administrador) -----------------
-- Autoguardado escribe aquí. Publicar copia `datos` a la fila y borra el borrador.

create table borradores (
  tabla text not null check (tabla in (
    'servicios', 'proyectos', 'articulos', 'paginas', 'bloques', 'clientes', 'opiniones', 'canales'
  )),
  fila_id uuid not null,
  datos jsonb not null,
  actualizado_en timestamptz not null default now(),
  primary key (tabla, fila_id)
);

-- Disparadores de actualizado_en -------------------------------------------------

create trigger servicios_actualizado before update on servicios
  for each row execute function fijar_actualizado_en();
create trigger proyectos_actualizado before update on proyectos
  for each row execute function fijar_actualizado_en();
create trigger articulos_actualizado before update on articulos
  for each row execute function fijar_actualizado_en();
create trigger paginas_actualizado before update on paginas
  for each row execute function fijar_actualizado_en();
create trigger bloques_actualizado before update on bloques
  for each row execute function fijar_actualizado_en();
create trigger clientes_actualizado before update on clientes
  for each row execute function fijar_actualizado_en();
create trigger opiniones_actualizado before update on opiniones
  for each row execute function fijar_actualizado_en();
create trigger canales_actualizado before update on canales
  for each row execute function fijar_actualizado_en();
create trigger mensajes_actualizado before update on mensajes
  for each row execute function fijar_actualizado_en();
create trigger borradores_actualizado before update on borradores
  for each row execute function fijar_actualizado_en();

-- RLS ----------------------------------------------------------------------------
-- Público (anon): solo lo publicado. Administrador: todo. Mensajes: el público solo inserta.

alter table servicios enable row level security;
alter table proyectos enable row level security;
alter table articulos enable row level security;
alter table paginas enable row level security;
alter table bloques enable row level security;
alter table clientes enable row level security;
alter table opiniones enable row level security;
alter table canales enable row level security;
alter table medios enable row level security;
alter table mensajes enable row level security;
alter table borradores enable row level security;

create policy "Lectura pública de lo publicado" on servicios for select to anon, authenticated using (estado = 'publicado');
create policy "Administrador: todo" on servicios for all to authenticated using ((select public.es_admin())) with check ((select public.es_admin()));

create policy "Lectura pública de lo publicado" on proyectos for select to anon, authenticated using (estado = 'publicado');
create policy "Administrador: todo" on proyectos for all to authenticated using ((select public.es_admin())) with check ((select public.es_admin()));

create policy "Lectura pública de lo publicado" on articulos for select to anon, authenticated using (estado = 'publicado');
create policy "Administrador: todo" on articulos for all to authenticated using ((select public.es_admin())) with check ((select public.es_admin()));

create policy "Lectura pública de lo publicado" on paginas for select to anon, authenticated using (estado = 'publicado');
create policy "Administrador: todo" on paginas for all to authenticated using ((select public.es_admin())) with check ((select public.es_admin()));

create policy "Lectura pública de lo publicado" on bloques for select to anon, authenticated using (estado = 'publicado');
create policy "Administrador: todo" on bloques for all to authenticated using ((select public.es_admin())) with check ((select public.es_admin()));

create policy "Lectura pública de lo publicado" on clientes for select to anon, authenticated using (estado = 'publicado');
create policy "Administrador: todo" on clientes for all to authenticated using ((select public.es_admin())) with check ((select public.es_admin()));

create policy "Lectura pública de lo publicado" on opiniones for select to anon, authenticated using (estado = 'publicado');
create policy "Administrador: todo" on opiniones for all to authenticated using ((select public.es_admin())) with check ((select public.es_admin()));

create policy "Lectura pública de lo publicado" on canales for select to anon, authenticated using (estado = 'publicado');
create policy "Administrador: todo" on canales for all to authenticated using ((select public.es_admin())) with check ((select public.es_admin()));

create policy "Administrador: todo" on medios for all to authenticated using ((select public.es_admin())) with check ((select public.es_admin()));

create policy "Cualquiera puede enviar un mensaje nuevo" on mensajes for insert to anon, authenticated with check (estado = 'nuevo');
create policy "Administrador: todo" on mensajes for all to authenticated using ((select public.es_admin())) with check ((select public.es_admin()));

create policy "Administrador: todo" on borradores for all to authenticated using ((select public.es_admin())) with check ((select public.es_admin()));

-- Ajustes (ya existía con lectura pública): solo el administrador escribe.
create policy "Escritura de ajustes solo administrador" on ajustes for all to authenticated
  using ((select public.es_admin())) with check ((select public.es_admin()));

-- Lo que nunca toca el público, ni siquiera por error de políticas.
revoke all on administradores, borradores, medios from anon;
revoke select, update, delete on mensajes from anon;

-- Bucket de medios (lectura pública, escritura solo administrador) ---------------

insert into storage.buckets (id, name, public)
values ('medios', 'medios', true)
on conflict (id) do nothing;

create policy "Medios: lectura pública"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'medios');

create policy "Medios: escritura solo administrador"
  on storage.objects for all to authenticated
  using (bucket_id = 'medios' and (select public.es_admin()))
  with check (bucket_id = 'medios' and (select public.es_admin()));
