// Carga en el PostgreSQL local las filas exportadas de la base real (datos.json, ver README.md).
// Uso: node cargar.mjs /ruta/datos.json
import { readFile } from "node:fs/promises";
import pg from "pg";

const ORDEN = ["idiomas", "ajustes", "tipos_proyecto", "categorias_articulo", "medios", "servicios", "proyectos", "proyecto_servicios", "articulos", "paginas", "bloques", "clientes", "opiniones", "canales", "administradores"];
const CORREO = process.env.CORREO ?? "josep.mira@gmail.com";

const datos = JSON.parse(await readFile(process.argv[2], "utf8"));
const cliente = new pg.Client({ connectionString: process.env.PGURL ?? "postgres://postgres@localhost:54322/jm?host=/var/tmp/pgjm" });
await cliente.connect();
try {
  await cliente.query("begin");
  // Las migraciones siembran estos catálogos: se sustituyen por los de la base real
  await cliente.query("truncate public.idiomas, public.ajustes, public.tipos_proyecto, public.categorias_articulo cascade");
  await cliente.query("insert into storage.buckets(id, name, public) values ('medios', 'medios', true) on conflict do nothing");
  const admin = datos.administradores?.[0];
  if (admin) await cliente.query("insert into auth.users(id, email) values ($1, $2) on conflict do nothing", [admin.user_id, CORREO]);
  for (const tabla of ORDEN) {
    const filas = datos[tabla] ?? [];
    if (!filas.length) continue;
    await cliente.query(`insert into public.${tabla} select * from jsonb_populate_recordset(null::public.${tabla}, $1::jsonb)`, [JSON.stringify(filas)]);
    console.log(`${tabla}: ${filas.length}`);
  }
  await cliente.query("commit");
} catch (e) {
  await cliente.query("rollback");
  throw e;
} finally {
  await cliente.end();
}
