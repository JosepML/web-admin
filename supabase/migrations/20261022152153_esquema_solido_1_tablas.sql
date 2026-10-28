-- Esquema sólido, parte 1 de 3: tablas (revisión de la tarea B).
-- Sustituye a 20261022144748_esquema_inicial (apartado en la parte 0 al esquema archivo_v1).
-- Las razones de cada decisión están en plan/esquema.md.

-- 1. Tipos ----------------------------------------------------------------------------
-- Enums para estados y tipos que dependen del código: el TypeScript generado los convierte en uniones.

create type public.estado_publicacion as enum ('borrador', 'publicado');
create type public.estado_mensaje as enum ('nuevo', 'respondido', 'cerrado');
create type public.tipo_medio as enum ('imagen', 'video', 'documento');
create type public.estilo_cliente as enum ('logo', 'nombre', 'firma');

-- Los once primeros son los del prototipo D (src/app/prototipos/d/datos.ts, TipoBloque);
-- galeria, video y cita sirven para páginas libres. Cada tipo tiene su componente en el código.
create type public.tipo_bloque as enum (
  'portada', 'servicios', 'filmmaker', 'trabajos', 'cifras', 'proceso', 'sobre-mi',
  'opiniones', 'clientes', 'blog', 'texto', 'llamada', 'galeria', 'video', 'cita'
);

create domain public.texto_slug as text
  check (value ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(value) <= 120);

-- 2. Idiomas --------------------------------------------------------------------------

create table public.idiomas (
  codigo text primary key check (codigo ~ '^[a-z]{2}$'),
  nombre text not null,
  predeterminado boolean not null default false,
  activo boolean not null default true,
  creado_en timestamptz not null default now()
);

create unique index idiomas_un_solo_predeterminado on public.idiomas (predeterminado) where predeterminado;

insert into public.idiomas (codigo, nombre, predeterminado) values ('es', 'Español', true);

-- 2b. Ajustes ------------------------------------------------------------------------
-- Clave y valor para lo general del sitio. Cambia al instante, sin borrador.

create table public.ajustes (
  clave text primary key,
  valor jsonb not null,
  actualizado_en timestamptz not null default now()
);

insert into public.ajustes (clave, valor, actualizado_en)
select clave, valor, actualizado_en from archivo_v1.ajustes;

-- 3. Medios ---------------------------------------------------------------------------
-- Un medio es un archivo del bucket `medios` (ruta) o, mientras se migra, una URL externa (url_origen).
-- Todo lo demás apunta a medios por id, así que nada se queda con una imagen rota.

create table public.medios (
  id uuid primary key default gen_random_uuid(),
  ruta text unique check (ruta is null or (ruta !~ '^/' and char_length(ruta) <= 500)),
  url_origen text check (url_origen is null or url_origen ~ '^https://'),
  tipo public.tipo_medio not null,
  mime text not null default '',
  bytes bigint check (bytes is null or bytes >= 0),
  ancho integer check (ancho is null or ancho > 0),
  alto integer check (alto is null or alto > 0),
  duracion numeric check (duracion is null or duracion >= 0),
  titulo text not null default '',
  texto_alternativo text not null default '',
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  check (ruta is not null or url_origen is not null)
);

create unique index medios_url_origen_unica on public.medios (url_origen) where url_origen is not null;

-- 4. Taxonomías -----------------------------------------------------------------------
-- `grupo` une las traducciones de una misma cosa: la fila en español y su versión en inglés comparten grupo.

create table public.tipos_proyecto (
  id uuid primary key default gen_random_uuid(),
  grupo uuid not null default gen_random_uuid(),
  idioma text not null default 'es' references public.idiomas (codigo),
  slug public.texto_slug not null,
  nombre text not null,
  -- Las recreaciones no salen en «Todos», solo con su filtro (mapa-de-contenido.md)
  en_listado_general boolean not null default true,
  orden integer not null default 0,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  unique (idioma, slug),
  unique (idioma, grupo)
);

create table public.categorias_articulo (
  id uuid primary key default gen_random_uuid(),
  grupo uuid not null default gen_random_uuid(),
  idioma text not null default 'es' references public.idiomas (codigo),
  slug public.texto_slug not null,
  nombre text not null,
  orden integer not null default 0,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  unique (idioma, slug),
  unique (idioma, grupo)
);

insert into public.tipos_proyecto (slug, nombre, en_listado_general, orden) values
  ('cortometraje', 'Cortometraje', true, 1),
  ('videoclip', 'Videoclip', true, 2),
  ('publicidad', 'Publicidad', true, 3),
  ('documental', 'Documental', true, 4),
  ('eventos', 'Eventos', true, 5),
  ('redes-sociales', 'Redes sociales', true, 6),
  ('recreacion', 'Recreación', false, 7);

insert into public.categorias_articulo (slug, nombre, orden) values
  ('oficio', 'Oficio', 1),
  ('direccion-de-fotografia', 'Dirección de fotografía', 2),
  ('equipo', 'Equipo', 3),
  ('detras-de-camaras', 'Detrás de cámaras', 4);

-- 5. Servicios ------------------------------------------------------------------------
-- Sin precios: el presupuesto nace de cada proyecto (00-contexto.md).

create table public.servicios (
  id uuid primary key default gen_random_uuid(),
  grupo uuid not null default gen_random_uuid(),
  idioma text not null default 'es' references public.idiomas (codigo),
  slug public.texto_slug not null,
  nombre text not null default '',
  frase text not null default '',
  resumen text not null default '',
  mirada jsonb not null default '[]' check (jsonb_typeof(mirada) = 'array'),
  aporto jsonb not null default '[]' check (jsonb_typeof(aporto) = 'array'),
  para_quien jsonb not null default '[]' check (jsonb_typeof(para_quien) = 'array'),
  con_quien text not null default '',
  pasos jsonb not null default '[]' check (jsonb_typeof(pasos) = 'array'),
  preguntas jsonb not null default '[]' check (jsonb_typeof(preguntas) = 'array'),
  llamada text not null default '',
  imagen_id uuid references public.medios (id) on delete restrict,
  seo_titulo text not null default '',
  seo_descripcion text not null default '',
  orden integer not null default 0,
  estado public.estado_publicacion not null default 'borrador',
  publicado_en timestamptz,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  unique (idioma, slug),
  unique (idioma, grupo)
);

create index servicios_imagen_idx on public.servicios (imagen_id);

-- 6. Proyectos ------------------------------------------------------------------------

create table public.proyectos (
  id uuid primary key default gen_random_uuid(),
  grupo uuid not null default gen_random_uuid(),
  idioma text not null default 'es' references public.idiomas (codigo),
  id_antiguo text,
  slug public.texto_slug not null,
  titulo text not null default '',
  tipo_id uuid references public.tipos_proyecto (id) on delete restrict,
  -- Ficha técnica
  anio integer check (anio is null or anio between 1990 and 2100),
  direccion text not null default '',
  productora text not null default '',
  -- Papel corto de la ficha y la tarjeta («Dirección y montaje»)
  papel text not null default '',
  camara text not null default '',
  -- [{"anio": 2024, "nombre": "Mejor fotografía", "tipo": "ganado", "festival": "..."}]
  premios jsonb not null default '[]' check (jsonb_typeof(premios) = 'array'),
  -- Textos (los de la tarea E: plan/contenido/proyectos/). Markdown básico: párrafos, cursiva y negrita.
  tarjeta text not null default '',
  historia text not null default '',
  mi_papel text not null default '',
  como_lo_hicimos text not null default '',
  el_reto text not null default '',
  el_resultado text not null default '',
  -- Títulos propios para alguna sección (de la web antigua): {"historia": "..."}
  titulos_seccion jsonb not null default '{}' check (jsonb_typeof(titulos_seccion) = 'object'),
  -- Vídeo e imagen
  youtube_id text check (youtube_id is null or youtube_id ~ '^[A-Za-z0-9_-]{11}$'),
  youtube_inicio integer check (youtube_inicio is null or youtube_inicio >= 0),
  videos jsonb not null default '[]' check (jsonb_typeof(videos) = 'array'),
  videos_debajo_del_texto boolean not null default false,
  imagen_id uuid references public.medios (id) on delete restrict,
  clip_id uuid references public.medios (id) on delete restrict,
  video_portada_id uuid references public.medios (id) on delete restrict,
  galeria jsonb not null default '[]' check (jsonb_typeof(galeria) = 'array'),
  detras_de_camaras jsonb not null default '[]' check (jsonb_typeof(detras_de_camaras) = 'array'),
  -- Publicación. destacado_orden: posición en Inicio (1, 2, 3...); vacío = no sale en Inicio
  destacado_orden integer check (destacado_orden is null or destacado_orden > 0),
  seo_titulo text not null default '',
  seo_descripcion text not null default '',
  orden integer not null default 0,
  estado public.estado_publicacion not null default 'borrador',
  publicado_en timestamptz,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  unique (idioma, slug),
  unique (idioma, grupo),
  unique (idioma, id_antiguo)
);

create index proyectos_tipo_idx on public.proyectos (tipo_id);
create index proyectos_imagen_idx on public.proyectos (imagen_id);
create index proyectos_clip_idx on public.proyectos (clip_id);
create index proyectos_video_portada_idx on public.proyectos (video_portada_id);
create index proyectos_listado_idx on public.proyectos (idioma, estado, orden);

-- Qué servicios muestra cada proyecto y en qué orden sale en la página de cada servicio
-- («Destacados por servicio» de mapa-de-contenido.md).
create table public.proyecto_servicios (
  proyecto_id uuid not null references public.proyectos (id) on delete cascade,
  servicio_id uuid not null references public.servicios (id) on delete cascade,
  orden integer not null default 0,
  destacado boolean not null default false,
  primary key (proyecto_id, servicio_id)
);

create index proyecto_servicios_servicio_idx on public.proyecto_servicios (servicio_id, orden);

-- 7. Artículos ------------------------------------------------------------------------
-- `contenido` es el documento del editor visual (formato ProseMirror/TipTap: {"type":"doc","content":[...]}).
-- Nada de HTML guardado: la web lo pinta con componentes propios y no hay riesgo de inyectar código.

create table public.articulos (
  id uuid primary key default gen_random_uuid(),
  grupo uuid not null default gen_random_uuid(),
  idioma text not null default 'es' references public.idiomas (codigo),
  id_antiguo text,
  slug public.texto_slug not null,
  titulo text not null default '',
  fecha date not null default current_date,
  extracto text not null default '',
  contenido jsonb not null default '{"type": "doc", "content": []}'
    check (jsonb_typeof(contenido) = 'object' and contenido ->> 'type' = 'doc'),
  categoria_id uuid references public.categorias_articulo (id) on delete restrict,
  imagen_id uuid references public.medios (id) on delete restrict,
  seo_titulo text not null default '',
  seo_descripcion text not null default '',
  estado public.estado_publicacion not null default 'borrador',
  publicado_en timestamptz,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  unique (idioma, slug),
  unique (idioma, grupo),
  unique (idioma, id_antiguo)
);

create index articulos_categoria_idx on public.articulos (categoria_id);
create index articulos_imagen_idx on public.articulos (imagen_id);
create index articulos_listado_idx on public.articulos (idioma, estado, fecha desc);

-- 8. Páginas y bloques ----------------------------------------------------------------
-- Una página es una lista ordenada de bloques. Se edita y se publica entera: el borrador de una página
-- guarda la lista completa de sus bloques, y Publicar la vuelca a `bloques` en una sola transacción.

create table public.paginas (
  id uuid primary key default gen_random_uuid(),
  grupo uuid not null default gen_random_uuid(),
  idioma text not null default 'es' references public.idiomas (codigo),
  slug public.texto_slug not null,
  titulo text not null default '',
  imagen_id uuid references public.medios (id) on delete restrict,
  seo_titulo text not null default '',
  seo_descripcion text not null default '',
  estado public.estado_publicacion not null default 'borrador',
  publicado_en timestamptz,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  unique (idioma, slug),
  unique (idioma, grupo)
);

create index paginas_imagen_idx on public.paginas (imagen_id);

create table public.bloques (
  id uuid primary key default gen_random_uuid(),
  pagina_id uuid not null references public.paginas (id) on delete cascade,
  orden integer not null default 0,
  tipo public.tipo_bloque not null,
  visible boolean not null default true,
  datos jsonb not null default '{}' check (jsonb_typeof(datos) = 'object'),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create index bloques_pagina_idx on public.bloques (pagina_id, orden);

-- 9. Clientes, opiniones y canales ----------------------------------------------------

create table public.clientes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null default '',
  logo_id uuid references public.medios (id) on delete restrict,
  alto_logo integer check (alto_logo is null or alto_logo between 8 and 200),
  estilo public.estilo_cliente not null default 'nombre',
  enlace text check (enlace is null or enlace ~ '^https://'),
  -- Va en el apartado «Trabajo en sinergia con JUNO Media», no en la franja general
  con_juno boolean not null default false,
  orden integer not null default 0,
  estado public.estado_publicacion not null default 'borrador',
  publicado_en timestamptz,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create index clientes_logo_idx on public.clientes (logo_id);

create table public.opiniones (
  id uuid primary key default gen_random_uuid(),
  grupo uuid not null default gen_random_uuid(),
  idioma text not null default 'es' references public.idiomas (codigo),
  texto text not null default '',
  autor text not null default '',
  contexto text not null default '',
  proyecto_id uuid references public.proyectos (id) on delete set null,
  orden integer not null default 0,
  estado public.estado_publicacion not null default 'borrador',
  publicado_en timestamptz,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  unique (idioma, grupo)
);

create index opiniones_proyecto_idx on public.opiniones (proyecto_id);

create table public.canales (
  id uuid primary key default gen_random_uuid(),
  grupo uuid not null default gen_random_uuid(),
  idioma text not null default 'es' references public.idiomas (codigo),
  nombre text not null default '',
  texto text not null default '',
  url text check (url is null or url ~ '^https://'),
  cifra text not null default '',
  orden integer not null default 0,
  estado public.estado_publicacion not null default 'borrador',
  publicado_en timestamptz,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  unique (idioma, grupo)
);

-- 10. Redirecciones -------------------------------------------------------------------
-- Cambiar el slug de algo publicado deja una redirección automática, para no romper enlaces.
-- Las URLs antiguas con hash (/#/project/<id>) se resuelven con `id_antiguo` (tarea S13).

create table public.redirecciones (
  desde text primary key check (desde ~ '^/'),
  hacia text not null check (hacia ~ '^/'),
  creado_en timestamptz not null default now(),
  check (desde <> hacia)
);

-- 11. Mensajes del formulario ---------------------------------------------------------

create table public.mensajes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null check (char_length(btrim(nombre)) between 2 and 120),
  correo text not null check (char_length(correo) <= 200 and correo ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  telefono text not null default '' check (char_length(telefono) <= 30),
  servicio text not null default '' check (char_length(servicio) <= 120),
  mensaje text not null check (char_length(btrim(mensaje)) between 10 and 5000),
  origen text not null default 'contacto' check (char_length(origen) <= 120),
  acepta_privacidad boolean not null check (acepta_privacidad),
  estado public.estado_mensaje not null default 'nuevo',
  notas text not null default '',
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create index mensajes_bandeja_idx on public.mensajes (estado, creado_en desc);

-- Freno global: 30 mensajes por hora. El límite por persona (IP o captcha) llega con la tarea S10.
-- SECURITY DEFINER porque quien envía es el público, que no puede leer la tabla para contar.
create function public.limitar_mensajes()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select count(*) from public.mensajes where creado_en > now() - interval '1 hour') >= 30 then
    raise exception 'Hay demasiados mensajes en poco tiempo. Inténtalo más tarde.' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

create trigger mensajes_limite before insert on public.mensajes
  for each row execute function public.limitar_mensajes();

-- 12. Borradores e historial ----------------------------------------------------------
-- Autoguardado: los cambios van a `borradores`, nunca a la fila publicada.
-- Publicar (función publicar) los aplica en una transacción y guarda la versión anterior en `revisiones`.

create table public.borradores (
  tabla text not null check (tabla in (
    'servicios', 'proyectos', 'articulos', 'paginas', 'clientes', 'opiniones', 'canales'
  )),
  fila_id uuid not null,
  datos jsonb not null check (jsonb_typeof(datos) = 'object'),
  actualizado_por uuid,
  actualizado_en timestamptz not null default now(),
  primary key (tabla, fila_id)
);

create table public.revisiones (
  id uuid primary key default gen_random_uuid(),
  tabla text not null,
  fila_id uuid not null,
  datos jsonb not null,
  autor uuid,
  creado_en timestamptz not null default now()
);

create index revisiones_fila_idx on public.revisiones (tabla, fila_id, creado_en desc);

-- RLS activada desde ya (sin políticas = nadie lee ni escribe). Las políticas llegan en la migración de seguridad.
alter table public.ajustes enable row level security;
alter table public.idiomas enable row level security;
alter table public.medios enable row level security;
alter table public.tipos_proyecto enable row level security;
alter table public.categorias_articulo enable row level security;
alter table public.servicios enable row level security;
alter table public.proyectos enable row level security;
alter table public.proyecto_servicios enable row level security;
alter table public.articulos enable row level security;
alter table public.paginas enable row level security;
alter table public.bloques enable row level security;
alter table public.clientes enable row level security;
alter table public.opiniones enable row level security;
alter table public.canales enable row level security;
alter table public.redirecciones enable row level security;
alter table public.mensajes enable row level security;
alter table public.borradores enable row level security;
alter table public.revisiones enable row level security;

