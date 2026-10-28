# Supabase de imitación para el contenedor de Claude

El contenedor donde trabaja Claude no llega a `supabase.co`. Para probar de verdad el inicio de sesión, el modo «Editar página» y el panel (guardar borradores, subir imágenes, publicar), esta carpeta monta una imitación mínima de Supabase sobre un PostgreSQL local con **las migraciones del repositorio**: la RLS, los permisos y las funciones (`publicar`, `descartar`, `restaurar_revision`...) son los reales. **Nunca se usa en producción** ni en el PC de Josep.

## Montarlo (una vez por contenedor)

```bash
# 1. PostgreSQL 16 en /var/tmp/pgjm, puerto 54322
mkdir -p /var/tmp/pgjm && chown postgres /var/tmp/pgjm
su postgres -c "/usr/lib/postgresql/16/bin/initdb -D /var/tmp/pgjm/data -U postgres -A trust"
su postgres -c "/usr/lib/postgresql/16/bin/pg_ctl -D /var/tmp/pgjm/data -o '-p 54322 -k /var/tmp/pgjm' -l /var/tmp/pgjm/log start"

# 2. Base `jm`: roles y esquemas de Supabase de mentira + migraciones del repo
P="psql -h /var/tmp/pgjm -p 54322 -U postgres -v ON_ERROR_STOP=1 -q"
$P -c "create database jm"
for f in supabase/tests/entorno_local.sql supabase/migrations/*.sql; do $P -d jm -f "$f"; done

# 3. Datos reales: exporta con el MCP de Supabase (proyecto oadmqwtnxpbotxcgzaoo, solo lectura) la consulta
#    de abajo, guarda el objeto `d` en datos.json y cárgalo
cd scripts/supabase-local && npm install && node cargar.mjs /ruta/datos.json
```

Consulta de exportación (una fila, columna `d`):

```sql
select jsonb_build_object(
  'idiomas', (select jsonb_agg(to_jsonb(t)) from idiomas t),
  'ajustes', (select jsonb_agg(to_jsonb(t)) from ajustes t),
  'tipos_proyecto', (select jsonb_agg(to_jsonb(t)) from tipos_proyecto t),
  'categorias_articulo', (select jsonb_agg(to_jsonb(t)) from categorias_articulo t),
  'medios', (select jsonb_agg(to_jsonb(t)) from medios t),
  'servicios', (select jsonb_agg(to_jsonb(t)) from servicios t),
  'proyectos', (select jsonb_agg(to_jsonb(t)) from proyectos t),
  'proyecto_servicios', (select jsonb_agg(to_jsonb(t)) from proyecto_servicios t),
  'articulos', (select jsonb_agg(to_jsonb(t)) from articulos t),
  'paginas', (select jsonb_agg(to_jsonb(t)) from paginas t),
  'bloques', (select jsonb_agg(to_jsonb(t)) from bloques t),
  'clientes', (select jsonb_agg(to_jsonb(t)) from clientes t),
  'opiniones', (select jsonb_agg(to_jsonb(t)) from opiniones t),
  'canales', (select jsonb_agg(to_jsonb(t)) from canales t),
  'administradores', (select jsonb_agg(to_jsonb(t)) from administradores t)
) as d
```

Si el resultado es grande, el MCP lo deja en un archivo: saca de ahí el JSON.

## Usarlo

```bash
cd scripts/supabase-local && node servidor.mjs        # puerto 54321 (REST, auth y storage)
```

En la raíz, un `.env.local` (está en `.gitignore`, nunca se sube) apunta la app a la imitación:

```
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=local-anon
```

Después `npx next dev -p 3100` (o `npm run build && npx next start -p 3100`) y se entra en `/admin/entrar` con `josep.mira@gmail.com` y la contraseña local `local-josep`. **Borra `.env.local` al terminar** si vas a compilar para otra cosa.

Variables opcionales del servidor: `PUERTO`, `PGURL`, `CORREO`, `CLAVE` y `ARCHIVOS` (carpeta de las subidas, por defecto `/var/tmp/pgjm/storage`).

## Lo que imita y lo que no

- **REST:** el subconjunto de PostgREST que usa la app (select con filtros `eq`, `in`, `is`, `neq`, orden y límite; insert, upsert, update, delete y rpc). Cada petición va en una transacción con el rol `anon` o `authenticated` y los claims del JWT, así que la RLS manda como en la base real.
- **Auth:** un único usuario con contraseña local. Emite JWT HS256 con caducidad de una hora y refresca la sesión.
- **Storage:** sube y sirve archivos del bucket `medios` desde una carpeta local.
- **No imita:** joins embebidos de PostgREST, Realtime, Edge Functions ni el transformador de imágenes. Si la app empieza a usar algo de eso, amplía `servidor.mjs`.
- Las imágenes externas (ImgBB, Imgur, YouTube) salen rotas en el contenedor porque no hay red hacia ellas. En el PC de Josep se ven.
