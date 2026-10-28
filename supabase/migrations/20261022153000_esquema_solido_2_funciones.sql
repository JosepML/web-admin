-- Esquema sólido, parte 2 de 3: funciones de borrador, publicación, historial y disparadores.
-- Razones en plan/esquema.md.

-- 13. Funciones de apoyo --------------------------------------------------------------

-- Columnas que Josep edita (y que viajan en el borrador). Lo estructural queda fuera:
-- id, grupo e idioma se fijan al crear; estado y orden son acciones de lista; las fechas las pone la base.
create function public.columnas_editables(p_tabla text)
returns text[]
language sql
stable
set search_path = ''
as $$
  select coalesce(array_agg(a.attname::text order by a.attnum), '{}')
  from pg_catalog.pg_attribute a
  where a.attrelid = ('public.' || quote_ident(p_tabla))::regclass
    and a.attnum > 0
    and not a.attisdropped
    and a.attname not in ('id', 'grupo', 'idioma', 'estado', 'orden', 'publicado_en', 'creado_en', 'actualizado_en');
$$;

-- Claves del borrador que no son columnas: la lista de servicios de un proyecto y los bloques de una página
create function public.claves_extra(p_tabla text)
returns text[]
language sql
immutable
set search_path = ''
as $$
  select case p_tabla
    when 'proyectos' then array['servicios']
    when 'paginas' then array['bloques']
    else '{}'::text[]
  end;
$$;

-- Lo publicado que no vive en la fila: se guarda en el historial junto a ella
create function public.extras_publicados(p_tabla text, p_id uuid)
returns jsonb
language sql
stable
set search_path = ''
as $$
  select case p_tabla
    when 'proyectos' then jsonb_build_object('servicios', coalesce((
      select jsonb_agg(ps.servicio_id order by ps.servicio_id)
      from public.proyecto_servicios ps where ps.proyecto_id = p_id), '[]'::jsonb))
    when 'paginas' then jsonb_build_object('bloques', coalesce((
      select jsonb_agg(jsonb_build_object('id', b.id, 'tipo', b.tipo, 'visible', b.visible, 'datos', b.datos) order by b.orden)
      from public.bloques b where b.pagina_id = p_id), '[]'::jsonb))
    else '{}'::jsonb
  end;
$$;

create function public.comprobar_lista_medios(p_lista jsonb, p_campo text)
returns void
language plpgsql
set search_path = ''
as $$
declare
  v_elemento jsonb;
begin
  for v_elemento in select value from jsonb_array_elements(p_lista) loop
    if jsonb_typeof(v_elemento) <> 'object' or coalesce(v_elemento ->> 'medio', '') = '' then
      raise exception 'Cada elemento de % necesita su imagen («medio»)', p_campo;
    end if;
    if not exists (select 1 from public.medios m where m.id = (v_elemento ->> 'medio')::uuid) then
      raise exception 'La imagen % de % no existe en la biblioteca', v_elemento ->> 'medio', p_campo;
    end if;
  end loop;
end;
$$;

create function public.sincronizar_servicios(p_proyecto uuid, p_lista jsonb)
returns void
language plpgsql
set search_path = ''
as $$
declare
  v_ids uuid[];
begin
  if jsonb_typeof(p_lista) <> 'array' then
    raise exception 'Los servicios del proyecto deben ser una lista';
  end if;
  select coalesce(array_agg(value::uuid), '{}') into v_ids from jsonb_array_elements_text(p_lista);

  delete from public.proyecto_servicios
  where proyecto_id = p_proyecto and not (servicio_id = any (v_ids));

  -- Un servicio nuevo para el proyecto entra al final de la página de ese servicio
  insert into public.proyecto_servicios (proyecto_id, servicio_id, orden)
  select p_proyecto, s.id,
    coalesce((select max(ps.orden) + 1 from public.proyecto_servicios ps where ps.servicio_id = s.id), 0)
  from unnest(v_ids) as s(id)
  on conflict (proyecto_id, servicio_id) do nothing;
end;
$$;

create function public.sincronizar_bloques(p_pagina uuid, p_lista jsonb)
returns void
language plpgsql
set search_path = ''
as $$
begin
  if jsonb_typeof(p_lista) <> 'array' then
    raise exception 'Los bloques de la página deben ser una lista';
  end if;
  if exists (select 1 from jsonb_array_elements(p_lista) e where coalesce(e ->> 'id', '') = '' or coalesce(e ->> 'tipo', '') = '') then
    raise exception 'Cada bloque necesita id y tipo';
  end if;
  if exists (
    select 1 from jsonb_array_elements(p_lista) e
    join public.bloques b on b.id = (e ->> 'id')::uuid
    where b.pagina_id <> p_pagina
  ) then
    raise exception 'Un bloque del borrador pertenece a otra página';
  end if;

  delete from public.bloques
  where pagina_id = p_pagina
    and id not in (select (e ->> 'id')::uuid from jsonb_array_elements(p_lista) e);

  insert into public.bloques (id, pagina_id, orden, tipo, visible, datos)
  select (x.e ->> 'id')::uuid, p_pagina, (x.n - 1)::integer, (x.e ->> 'tipo')::public.tipo_bloque,
    coalesce((x.e ->> 'visible')::boolean, true), coalesce(x.e -> 'datos', '{}'::jsonb)
  from jsonb_array_elements(p_lista) with ordinality as x(e, n)
  on conflict (id) do update
    set orden = excluded.orden, tipo = excluded.tipo, visible = excluded.visible, datos = excluded.datos;
end;
$$;

-- 14. Publicar, descartar y restaurar -------------------------------------------------

create function public.publicar(p_tabla text, p_id uuid)
returns void
language plpgsql
set search_path = ''
as $$
declare
  v_actual jsonb;
  v_datos jsonb;
  v_columnas text[];
  v_asignaciones text;
begin
  if not public.es_admin() then
    raise exception 'Solo el administrador puede publicar' using errcode = '42501';
  end if;
  if p_tabla not in ('servicios', 'proyectos', 'articulos', 'paginas', 'clientes', 'opiniones', 'canales') then
    raise exception 'No se puede publicar en %', p_tabla;
  end if;

  execute format('select to_jsonb(t) from public.%I t where t.id = $1 for update', p_tabla)
    into v_actual using p_id;
  if v_actual is null then
    raise exception 'No existe la fila % en %', p_id, p_tabla;
  end if;

  select d.datos into v_datos
  from public.borradores d where d.tabla = p_tabla and d.fila_id = p_id
  for update;

  if v_datos is not null then
    -- La versión que estaba publicada pasa al historial
    if v_actual ->> 'estado' = 'publicado' then
      insert into public.revisiones (tabla, fila_id, datos, autor)
      values (p_tabla, p_id, v_actual || public.extras_publicados(p_tabla, p_id), auth.uid());
    end if;

    select array_agg(k) into v_columnas
    from jsonb_object_keys(v_datos) as k
    where k = any (public.columnas_editables(p_tabla));

    if v_columnas is not null then
      select string_agg(format('%1$I = r.%1$I', c), ', ') into v_asignaciones from unnest(v_columnas) as c;
      execute format(
        'update public.%1$I t set %2$s from jsonb_populate_record(null::public.%1$I, $1) r where t.id = $2',
        p_tabla, v_asignaciones
      ) using v_datos, p_id;
    end if;

    if p_tabla = 'proyectos' and v_datos ? 'servicios' then
      perform public.sincronizar_servicios(p_id, v_datos -> 'servicios');
    end if;
    if p_tabla = 'paginas' and v_datos ? 'bloques' then
      perform public.sincronizar_bloques(p_id, v_datos -> 'bloques');
    end if;

    delete from public.borradores where tabla = p_tabla and fila_id = p_id;
  end if;

  execute format(
    'update public.%I set estado = ''publicado'', publicado_en = coalesce(publicado_en, now()) where id = $1',
    p_tabla
  ) using p_id;

  -- Historial: las 30 últimas versiones de cada fila
  delete from public.revisiones r
  where r.tabla = p_tabla and r.fila_id = p_id
    and r.id not in (
      select r2.id from public.revisiones r2
      where r2.tabla = p_tabla and r2.fila_id = p_id
      order by r2.creado_en desc limit 30
    );
end;
$$;

create function public.descartar(p_tabla text, p_id uuid)
returns void
language plpgsql
set search_path = ''
as $$
begin
  if not public.es_admin() then
    raise exception 'Solo el administrador puede descartar cambios' using errcode = '42501';
  end if;
  delete from public.borradores where tabla = p_tabla and fila_id = p_id;
end;
$$;

-- Lleva una versión del historial al borrador. No publica: Josep la revisa y pulsa Publicar.
create function public.restaurar_revision(p_revision uuid)
returns void
language plpgsql
set search_path = ''
as $$
declare
  v_revision public.revisiones;
  v_datos jsonb;
begin
  if not public.es_admin() then
    raise exception 'Solo el administrador puede restaurar versiones' using errcode = '42501';
  end if;
  select * into v_revision from public.revisiones where id = p_revision;
  if v_revision.id is null then
    raise exception 'No existe esa versión';
  end if;

  select coalesce(jsonb_object_agg(key, value), '{}'::jsonb) into v_datos
  from jsonb_each(v_revision.datos)
  where key = any (public.columnas_editables(v_revision.tabla) || public.claves_extra(v_revision.tabla));

  insert into public.borradores (tabla, fila_id, datos)
  values (v_revision.tabla, v_revision.fila_id, v_datos)
  on conflict (tabla, fila_id) do update set datos = excluded.datos;
end;
$$;

-- 15. Disparadores --------------------------------------------------------------------

-- El borrador solo admite campos que existen y con el tipo correcto: el error salta al autoguardar,
-- no al publicar.
create function public.validar_borrador()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_sobran text;
  v_existe boolean;
begin
  select string_agg(k, ', ') into v_sobran
  from jsonb_object_keys(new.datos) as k
  where not (k = any (public.columnas_editables(new.tabla) || public.claves_extra(new.tabla)));
  if v_sobran is not null then
    raise exception 'Campos que no existen en %: %', new.tabla, v_sobran;
  end if;

  execute format('select jsonb_populate_record(null::public.%I, $1)', new.tabla)
    using new.datos - public.claves_extra(new.tabla);

  execute format('select exists (select 1 from public.%I where id = $1)', new.tabla)
    into v_existe using new.fila_id;
  if not v_existe then
    raise exception 'El borrador apunta a una fila que no existe en %', new.tabla;
  end if;

  new.actualizado_por := auth.uid();
  return new;
end;
$$;

create trigger borradores_validar before insert or update on public.borradores
  for each row execute function public.validar_borrador();

create function public.validar_proyecto()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v jsonb;
begin
  perform public.comprobar_lista_medios(new.galeria, 'la galería');
  perform public.comprobar_lista_medios(new.detras_de_camaras, 'detrás de cámaras');

  for v in select value from jsonb_array_elements(new.videos) loop
    if coalesce(v ->> 'tipo', '') not in ('youtube', 'youtube-short', 'instagram', 'archivo') then
      raise exception 'Tipo de vídeo no válido: %', coalesce(v ->> 'tipo', '(vacío)');
    end if;
    if coalesce(v ->> 'id', v ->> 'url', v ->> 'medio', '') = '' then
      raise exception 'Cada vídeo necesita id de YouTube, enlace o archivo';
    end if;
  end loop;

  for v in select value from jsonb_array_elements(new.premios) loop
    if coalesce(v ->> 'nombre', '') = '' then
      raise exception 'Cada premio necesita su nombre';
    end if;
  end loop;

  return new;
end;
$$;

create trigger proyectos_validar before insert or update on public.proyectos
  for each row execute function public.validar_proyecto();

-- Un medio en uso no se puede borrar (las columnas *_id ya lo impiden con su clave foránea;
-- esto cubre las listas en jsonb: galerías, bloques, artículos y borradores).
create function public.impedir_borrar_medio_en_uso()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_id text := old.id::text;
  v_donde text;
begin
  select string_agg(donde, ', ') into v_donde from (
    select 'proyecto «' || p.titulo || '»' as donde from public.proyectos p
      where strpos(p.galeria::text, v_id) > 0 or strpos(p.detras_de_camaras::text, v_id) > 0
         or strpos(p.videos::text, v_id) > 0
    union all
    select 'página «' || pg.slug || '»' from public.bloques b join public.paginas pg on pg.id = b.pagina_id
      where strpos(b.datos::text, v_id) > 0
    union all
    select 'artículo «' || a.titulo || '»' from public.articulos a where strpos(a.contenido::text, v_id) > 0
    union all
    select 'un borrador sin publicar' from public.borradores d where strpos(d.datos::text, v_id) > 0
  ) as usos;
  if v_donde is not null then
    raise exception 'Este archivo se usa en: %. Quítalo de ahí antes de borrarlo.', v_donde;
  end if;
  return old;
end;
$$;

create trigger medios_en_uso before delete on public.medios
  for each row execute function public.impedir_borrar_medio_en_uso();

-- Al borrar una fila se van con ella su borrador y su historial
create function public.limpiar_borrador_e_historial()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  delete from public.borradores where tabla = tg_table_name and fila_id = old.id;
  delete from public.revisiones where tabla = tg_table_name and fila_id = old.id;
  return old;
end;
$$;

-- Redirección automática al cambiar el slug de algo publicado. tg_argv[0] es la ruta base.
create function public.registrar_redireccion()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_idioma text := '';
  v_desde text;
  v_hacia text;
begin
  if new.slug is not distinct from old.slug or old.estado <> 'publicado' then
    return new;
  end if;
  if tg_table_name = 'paginas' and old.slug = 'inicio' then
    raise exception 'La página de inicio no puede cambiar de dirección';
  end if;
  if not exists (select 1 from public.idiomas i where i.codigo = new.idioma and i.predeterminado) then
    v_idioma := '/' || new.idioma;
  end if;
  v_desde := v_idioma || tg_argv[0] || old.slug;
  v_hacia := v_idioma || tg_argv[0] || new.slug;

  delete from public.redirecciones where desde = v_hacia;
  update public.redirecciones set hacia = v_hacia where hacia = v_desde;
  insert into public.redirecciones (desde, hacia) values (v_desde, v_hacia)
  on conflict (desde) do update set hacia = excluded.hacia;
  return new;
end;
$$;

create trigger proyectos_redireccion after update of slug on public.proyectos
  for each row execute function public.registrar_redireccion('/trabajos/');
create trigger articulos_redireccion after update of slug on public.articulos
  for each row execute function public.registrar_redireccion('/blog/');
create trigger servicios_redireccion after update of slug on public.servicios
  for each row execute function public.registrar_redireccion('/servicios/');
create trigger paginas_redireccion after update of slug on public.paginas
  for each row execute function public.registrar_redireccion('/');

do $$
declare
  t text;
begin
  foreach t in array array[
    'ajustes', 'medios', 'tipos_proyecto', 'categorias_articulo', 'servicios', 'proyectos', 'articulos', 'paginas',
    'bloques', 'clientes', 'opiniones', 'canales', 'mensajes', 'borradores'
  ] loop
    execute format(
      'create trigger %1$s_actualizado before update on public.%1$I for each row execute function public.fijar_actualizado_en()',
      t
    );
  end loop;

  foreach t in array array['servicios', 'proyectos', 'articulos', 'paginas', 'clientes', 'opiniones', 'canales'] loop
    execute format(
      'create trigger %1$s_limpiar after delete on public.%1$I for each row execute function public.limpiar_borrador_e_historial()',
      t
    );
  end loop;
end;
$$;
