# Respaldo antes de borrar el esquema inicial (2026-10-22)

Proyecto de Supabase: Web Josep Mira (`oadmqwtnxpbotxcgzaoo`). Datos leídos a las 15:12 UTC, justo antes de la limpieza.

## 1. Filas de cada tabla que se borra

| Tabla | Filas |
| --- | --- |
| servicios | 0 |
| proyectos | 0 |
| articulos | 0 |
| paginas | 0 |
| bloques | 0 |
| clientes | 0 |
| opiniones | 0 |
| canales | 0 |
| medios | 0 |
| mensajes | 0 |
| borradores | 0 |
| Archivos en el bucket `medios` | 0 |

No hay datos que exportar. `ajustes` (1 fila) y `administradores` no se tocan.

## 2. Quién usa estas tablas

- **Web publicada (`master`):** no usa Supabase. Su contenido sale de `constants.ts` (comprobado con `git grep` en `origin/master`).
- **Rama de trabajo:** el código solo lee `ajustes` (`src/lib/ajustes.ts`), que se conserva. El prototipo D usa datos fijos de `src/app/prototipos/d/datos.ts`.

## 3. Esquema

El esquema exacto que se borra es `supabase/migrations/20261022144748_esquema_inicial.sql` (el mismo texto que se aplicó). Lo que no está en ese archivo de forma literal:

```sql
-- Políticas que se borran
create policy "Escritura de ajustes solo administrador" on public.ajustes for all to authenticated
  using ((select es_admin())) with check ((select es_admin()));
create policy "Medios: lectura pública" on storage.objects for select to anon, authenticated
  using (bucket_id = 'medios');
create policy "Medios: escritura solo administrador" on storage.objects for all to authenticated
  using (bucket_id = 'medios' and (select es_admin()))
  with check (bucket_id = 'medios' and (select es_admin()));

-- Función que se borra (se vuelve a crear igual en la parte 1)
create or replace function public.limitar_mensajes() returns trigger language plpgsql security definer
set search_path to '' as $function$
begin
  if (select count(*) from public.mensajes where creado_en > now() - interval '1 hour') >= 30 then
    raise exception 'Hay demasiados mensajes en poco tiempo. Inténtalo más tarde.' using errcode = 'P0001';
  end if;
  return new;
end;
$function$;
```
