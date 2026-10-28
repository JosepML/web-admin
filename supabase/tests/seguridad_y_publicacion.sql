-- Pruebas de seguridad (RLS y permisos) y del flujo borrador → publicar → historial.
-- Todo ocurre dentro de una transacción que se deshace al final: no deja nada en la base.
-- Si algo falla, se detiene con un error que empieza por «FALLO».
-- Sirve para el PostgreSQL local (ver entorno_local.sql) y para el proyecto real (execute_sql).

begin;

-- Datos de prueba (como propietario, sin RLS) -------------------------------------------

insert into auth.users (id, email) values
  ('a0000000-0000-4000-8000-000000000001', 'admin-prueba@example.com'),
  ('a0000000-0000-4000-8000-000000000002', 'intruso-prueba@example.com');
insert into public.administradores (user_id) values ('a0000000-0000-4000-8000-000000000001');

insert into public.medios (id, url_origen, tipo, texto_alternativo) values
  ('b0000000-0000-4000-8000-000000000001', 'https://example.com/prueba-1.jpg', 'imagen', 'Fotograma de prueba 1'),
  ('b0000000-0000-4000-8000-000000000002', 'https://example.com/prueba-2.jpg', 'imagen', 'Fotograma de prueba 2');

insert into public.servicios (id, slug, nombre, estado) values
  ('c0000000-0000-4000-8000-000000000001', 'prueba-servicio-a', 'Servicio A', 'publicado'),
  ('c0000000-0000-4000-8000-000000000002', 'prueba-servicio-b', 'Servicio B', 'publicado');

insert into public.proyectos (id, slug, titulo, estado, tipo_id, imagen_id, galeria) values
  ('d0000000-0000-4000-8000-000000000001', 'prueba-publicado', 'Proyecto publicado', 'publicado',
    (select id from public.tipos_proyecto where slug = 'cortometraje' and idioma = 'es'),
    'b0000000-0000-4000-8000-000000000001',
    '[{"medio": "b0000000-0000-4000-8000-000000000002", "pie": "Fotograma"}]'),
  ('d0000000-0000-4000-8000-000000000002', 'prueba-borrador', 'Proyecto en borrador', 'borrador', null, null, '[]');

insert into public.paginas (id, slug, titulo, estado) values
  ('e0000000-0000-4000-8000-000000000001', 'prueba-pagina', 'Página de prueba', 'publicado');
insert into public.bloques (id, pagina_id, orden, tipo, datos) values
  ('f0000000-0000-4000-8000-000000000001', 'e0000000-0000-4000-8000-000000000001', 0, 'portada', '{"titulo": "Antes"}');

insert into public.borradores (tabla, fila_id, datos) values
  ('proyectos', 'd0000000-0000-4000-8000-000000000001', '{"titulo": "Cambio sin publicar"}');

insert into storage.objects (bucket_id, name) values ('medios', 'prueba/archivo-de-prueba.jpg');

-- Integridad (como propietario) ---------------------------------------------------------

do $$
declare ok boolean := false;
begin
  begin
    insert into public.proyectos (slug, galeria) values ('prueba-galeria-rota', '[{"medio": "b0000000-0000-4000-8000-0000000000ff"}]');
  exception when raise_exception then ok := true;
  end;
  if not ok then raise exception 'FALLO: se aceptó una galería con una imagen que no existe'; end if;

  ok := false;
  begin
    insert into public.proyectos (slug, premios) values ('prueba-premio-sin-nombre', '[{"anio": 2024, "festival": "X"}]');
  exception when raise_exception then ok := true;
  end;
  if not ok then raise exception 'FALLO: se aceptó un premio sin nombre'; end if;

  ok := false;
  begin
    insert into public.proyectos (slug) values ('Slug Con Espacios');
  exception when check_violation then ok := true;
  end;
  if not ok then raise exception 'FALLO: se aceptó un slug no válido'; end if;

  ok := false;
  begin
    delete from public.medios where id = 'b0000000-0000-4000-8000-000000000002';
  exception when raise_exception then ok := true;
  end;
  if not ok then raise exception 'FALLO: se borró una imagen que usa una galería'; end if;

  ok := false;
  begin
    delete from public.medios where id = 'b0000000-0000-4000-8000-000000000001';
  exception when foreign_key_violation then ok := true;
  end;
  if not ok then raise exception 'FALLO: se borró la imagen principal de un proyecto'; end if;
end;
$$;

-- Público (anon) ------------------------------------------------------------------------

set local role anon;

do $$
declare ok boolean := false;
begin
  if (select count(*) from public.proyectos where slug like 'prueba-%') <> 1 then
    raise exception 'FALLO: el público no ve exactamente el proyecto publicado';
  end if;
  if exists (select 1 from public.proyectos where estado = 'borrador') then
    raise exception 'FALLO: el público ve un borrador';
  end if;
  if (select titulo from public.proyectos where slug = 'prueba-publicado') <> 'Proyecto publicado' then
    raise exception 'FALLO: el público ve cambios sin publicar';
  end if;
  if (select count(*) from public.bloques where pagina_id = 'e0000000-0000-4000-8000-000000000001') <> 1 then
    raise exception 'FALLO: el público no ve los bloques de una página publicada';
  end if;
  if exists (select 1 from storage.objects where bucket_id = 'medios') then
    raise exception 'FALLO: el público puede listar los archivos del bucket';
  end if;
  if (select valor ->> 'nombre' from public.ajustes where clave = 'sitio') is null then
    raise exception 'FALLO: el público no lee los ajustes';
  end if;

  begin
    perform 1 from public.borradores;
  exception when insufficient_privilege then ok := true;
  end;
  if not ok then raise exception 'FALLO: el público puede leer borradores'; end if;

  ok := false;
  begin
    perform 1 from public.revisiones;
  exception when insufficient_privilege then ok := true;
  end;
  if not ok then raise exception 'FALLO: el público puede leer el historial'; end if;

  ok := false;
  begin
    perform 1 from public.mensajes;
  exception when insufficient_privilege then ok := true;
  end;
  if not ok then raise exception 'FALLO: el público puede leer mensajes'; end if;

  insert into public.mensajes (nombre, correo, mensaje, acepta_privacidad)
  values ('Prueba', 'prueba@example.com', 'Mensaje de prueba, se deshace al final.', true);

  ok := false;
  begin
    insert into public.mensajes (nombre, correo, mensaje, acepta_privacidad, estado)
    values ('Prueba', 'prueba@example.com', 'Intento de marcarlo como cerrado.', true, 'cerrado');
  exception when insufficient_privilege then ok := true;
  end;
  if not ok then raise exception 'FALLO: el público puede crear un mensaje con otro estado'; end if;

  ok := false;
  begin
    insert into public.proyectos (slug) values ('prueba-intruso');
  exception when insufficient_privilege then ok := true;
  end;
  if not ok then raise exception 'FALLO: el público puede crear proyectos'; end if;

  ok := false;
  begin
    perform public.publicar('proyectos', 'd0000000-0000-4000-8000-000000000002');
  exception when insufficient_privilege then ok := true;
  end;
  if not ok then raise exception 'FALLO: el público puede llamar a publicar'; end if;
end;
$$;

reset role;

-- Usuario con sesión que no es administrador ----------------------------------------------

select set_config('request.jwt.claims', '{"sub": "a0000000-0000-4000-8000-000000000002", "role": "authenticated"}', true);
set local role authenticated;

do $$
declare ok boolean := false;
begin
  if exists (select 1 from public.proyectos where estado = 'borrador') then
    raise exception 'FALLO: un usuario sin permisos ve borradores';
  end if;
  if exists (select 1 from public.borradores) then
    raise exception 'FALLO: un usuario sin permisos ve borradores pendientes';
  end if;

  update public.proyectos set titulo = 'Pirateado' where slug = 'prueba-publicado';
  if (select titulo from public.proyectos where slug = 'prueba-publicado') <> 'Proyecto publicado' then
    raise exception 'FALLO: un usuario sin permisos cambia un proyecto';
  end if;

  begin
    perform public.publicar('proyectos', 'd0000000-0000-4000-8000-000000000001');
  exception when insufficient_privilege then ok := true;
  end;
  if not ok then raise exception 'FALLO: un usuario sin permisos puede publicar'; end if;
end;
$$;

reset role;

-- Administrador ---------------------------------------------------------------------------

select set_config('request.jwt.claims', '{"sub": "a0000000-0000-4000-8000-000000000001", "role": "authenticated"}', true);
set local role authenticated;

do $$
declare ok boolean := false;
begin
  if (select count(*) from public.proyectos where slug like 'prueba-%') <> 2 then
    raise exception 'FALLO: el administrador no ve todos los proyectos';
  end if;

  -- El borrador rechaza campos que no existen y tipos incorrectos
  begin
    update public.borradores set datos = '{"precio": 100}' where fila_id = 'd0000000-0000-4000-8000-000000000001';
  exception when raise_exception then ok := true;
  end;
  if not ok then raise exception 'FALLO: el borrador acepta un campo que no existe'; end if;

  ok := false;
  begin
    update public.borradores set datos = '{"anio": "dos mil"}' where fila_id = 'd0000000-0000-4000-8000-000000000001';
  exception when invalid_text_representation then ok := true;
  end;
  if not ok then raise exception 'FALLO: el borrador acepta un año que no es número'; end if;

  -- Autoguardado: cambia título, slug y servicios
  update public.borradores
  set datos = '{"titulo": "Proyecto publicado (v2)", "slug": "prueba-publicado-v2", "anio": 2025,
                "servicios": ["c0000000-0000-4000-8000-000000000002", "c0000000-0000-4000-8000-000000000001"]}'
  where tabla = 'proyectos' and fila_id = 'd0000000-0000-4000-8000-000000000001';

  if (select titulo from public.proyectos where id = 'd0000000-0000-4000-8000-000000000001') <> 'Proyecto publicado' then
    raise exception 'FALLO: el autoguardado cambió la versión publicada';
  end if;

  perform public.publicar('proyectos', 'd0000000-0000-4000-8000-000000000001');

  if (select titulo || '|' || slug || '|' || anio from public.proyectos where id = 'd0000000-0000-4000-8000-000000000001')
     <> 'Proyecto publicado (v2)|prueba-publicado-v2|2025' then
    raise exception 'FALLO: publicar no aplicó el borrador';
  end if;
  if exists (select 1 from public.borradores where fila_id = 'd0000000-0000-4000-8000-000000000001') then
    raise exception 'FALLO: el borrador sigue ahí después de publicar';
  end if;
  if (select count(*) from public.proyecto_servicios where proyecto_id = 'd0000000-0000-4000-8000-000000000001') <> 2 then
    raise exception 'FALLO: publicar no sincronizó los servicios';
  end if;
  if (select datos ->> 'titulo' from public.revisiones where fila_id = 'd0000000-0000-4000-8000-000000000001') <> 'Proyecto publicado' then
    raise exception 'FALLO: el historial no guardó la versión anterior';
  end if;
  if (select hacia from public.redirecciones where desde = '/trabajos/prueba-publicado') <> '/trabajos/prueba-publicado-v2' then
    raise exception 'FALLO: cambiar el slug no creó la redirección';
  end if;

  -- Quitar un servicio en el siguiente borrador
  insert into public.borradores (tabla, fila_id, datos)
  values ('proyectos', 'd0000000-0000-4000-8000-000000000001', '{"servicios": ["c0000000-0000-4000-8000-000000000001"]}');
  perform public.publicar('proyectos', 'd0000000-0000-4000-8000-000000000001');
  if (select count(*) from public.proyecto_servicios where proyecto_id = 'd0000000-0000-4000-8000-000000000001') <> 1 then
    raise exception 'FALLO: publicar no quitó el servicio';
  end if;

  -- Restaurar la primera versión lleva su contenido al borrador, sin publicarlo
  perform public.restaurar_revision((
    select id from public.revisiones
    where fila_id = 'd0000000-0000-4000-8000-000000000001' order by creado_en, datos ->> 'titulo' limit 1
  ));
  if (select datos ->> 'titulo' from public.borradores where fila_id = 'd0000000-0000-4000-8000-000000000001') is null then
    raise exception 'FALLO: restaurar no creó el borrador';
  end if;
  perform public.descartar('proyectos', 'd0000000-0000-4000-8000-000000000001');
  if exists (select 1 from public.borradores where fila_id = 'd0000000-0000-4000-8000-000000000001') then
    raise exception 'FALLO: descartar no borró el borrador';
  end if;

  -- Proyecto nuevo: invisible hasta publicar
  insert into public.borradores (tabla, fila_id, datos)
  values ('proyectos', 'd0000000-0000-4000-8000-000000000002', '{"titulo": "Nuevo proyecto"}');
  perform public.publicar('proyectos', 'd0000000-0000-4000-8000-000000000002');
  if (select estado::text || '|' || titulo || '|' || (publicado_en is not null)::text
      from public.proyectos where id = 'd0000000-0000-4000-8000-000000000002') <> 'publicado|Nuevo proyecto|true' then
    raise exception 'FALLO: publicar un proyecto nuevo no lo dejó publicado';
  end if;

  -- Página: el borrador lleva todos sus bloques; publicar los reordena, cambia, añade y quita
  insert into public.borradores (tabla, fila_id, datos)
  values ('paginas', 'e0000000-0000-4000-8000-000000000001', '{"bloques": [
    {"id": "f0000000-0000-4000-8000-000000000002", "tipo": "texto", "visible": true, "datos": {"titulo": "Nuevo"}},
    {"id": "f0000000-0000-4000-8000-000000000001", "tipo": "portada", "visible": false, "datos": {"titulo": "Después"}}
  ]}');

  if (select datos ->> 'titulo' from public.bloques where id = 'f0000000-0000-4000-8000-000000000001') <> 'Antes' then
    raise exception 'FALLO: el borrador de la página cambió la versión publicada';
  end if;

  perform public.publicar('paginas', 'e0000000-0000-4000-8000-000000000001');

  if (select string_agg(tipo::text || ':' || visible::text || ':' || (datos ->> 'titulo'), ',' order by orden)
      from public.bloques where pagina_id = 'e0000000-0000-4000-8000-000000000001')
     <> 'texto:true:Nuevo,portada:false:Después' then
    raise exception 'FALLO: publicar la página no aplicó los bloques en orden';
  end if;

  insert into public.borradores (tabla, fila_id, datos)
  values ('paginas', 'e0000000-0000-4000-8000-000000000001', '{"bloques": []}');
  perform public.publicar('paginas', 'e0000000-0000-4000-8000-000000000001');
  if exists (select 1 from public.bloques where pagina_id = 'e0000000-0000-4000-8000-000000000001') then
    raise exception 'FALLO: quitar todos los bloques no los borró';
  end if;

  if not exists (select 1 from storage.objects where bucket_id = 'medios') then
    raise exception 'FALLO: el administrador no ve los archivos del bucket';
  end if;

  -- El administrador gestiona mensajes
  update public.mensajes set estado = 'respondido' where correo = 'prueba@example.com';
  if not exists (select 1 from public.mensajes where estado = 'respondido') then
    raise exception 'FALLO: el administrador no puede cambiar el estado de un mensaje';
  end if;
end;
$$;

reset role;

-- Lo publicado ya lo ve el público
set local role anon;
do $$
begin
  if (select titulo from public.proyectos where slug = 'prueba-publicado-v2') <> 'Proyecto publicado (v2)' then
    raise exception 'FALLO: el público no ve la versión recién publicada';
  end if;
end;
$$;
reset role;

select 'Todas las pruebas pasan' as resultado;

rollback;
