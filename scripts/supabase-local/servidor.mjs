// Imitación mínima de Supabase (auth, REST y storage) sobre un PostgreSQL local, para probar la web y el
// panel en el contenedor de Claude, que no llega a supabase.co. Nunca se usa en producción.
//
// - REST: el subconjunto de PostgREST que usa la app (select con filtros y orden, insert, upsert, update,
//   delete y rpc). Cada petición va en una transacción con el rol (anon o authenticated) y los claims del
//   JWT, así que la RLS, los permisos y las funciones son los de verdad (las migraciones del repo).
// - Auth: un único usuario (el de `administradores`) con contraseña local. Emite JWT HS256.
// - Storage: guarda los archivos del bucket en una carpeta y los sirve en /storage/v1/object/public/.
//
// Uso: PGURL=postgres://postgres@/jm?host=/var/tmp/pgjm&port=54322 node servidor.mjs   (puerto 54321)
// Receta completa en README.md de esta carpeta.

import { createHmac, randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import pg from "pg";

const PUERTO = Number(process.env.PUERTO ?? 54321);
const SECRETO = "secreto-solo-local";
const CORREO = process.env.CORREO ?? "josep.mira@gmail.com";
const CLAVE = process.env.CLAVE ?? "local-josep";
const ARCHIVOS = process.env.ARCHIVOS ?? "/var/tmp/pgjm/storage";
const pool = new pg.Pool({ connectionString: process.env.PGURL ?? "postgres://postgres@localhost:54322/jm?host=/var/tmp/pgjm" });

// ---- JWT ------------------------------------------------------------------------------------------
const b64 = (b) => Buffer.from(b).toString("base64url");
function firmar(carga) {
  const cab = b64(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const cuerpo = b64(JSON.stringify(carga));
  return `${cab}.${cuerpo}.${createHmac("sha256", SECRETO).update(`${cab}.${cuerpo}`).digest("base64url")}`;
}
function verificar(token) {
  const [cab, cuerpo, firma] = String(token ?? "").split(".");
  if (!firma || createHmac("sha256", SECRETO).update(`${cab}.${cuerpo}`).digest("base64url") !== firma) return null;
  const c = JSON.parse(Buffer.from(cuerpo, "base64url").toString());
  return c.exp * 1000 > Date.now() ? c : null;
}

let usuario = null;
async function elUsuario() {
  if (usuario) return usuario;
  const { rows } = await pool.query("select user_id from public.administradores limit 1");
  usuario = { id: rows[0]?.user_id ?? randomUUID(), email: CORREO };
  return usuario;
}
const refrescos = new Set();
async function sesion() {
  const u = await elUsuario();
  const ahora = Math.floor(Date.now() / 1000);
  const access_token = firmar({ sub: u.id, email: u.email, role: "authenticated", aud: "authenticated", iat: ahora, exp: ahora + 3600 });
  const refresh_token = randomUUID();
  refrescos.add(refresh_token);
  return { access_token, token_type: "bearer", expires_in: 3600, expires_at: ahora + 3600, refresh_token, user: datosUsuario(u) };
}
const datosUsuario = (u) => ({
  id: u.id,
  aud: "authenticated",
  role: "authenticated",
  email: u.email,
  email_confirmed_at: "2026-10-22T00:00:00Z",
  app_metadata: { provider: "email", providers: ["email"] },
  user_metadata: {},
  identities: [],
  created_at: "2026-10-22T00:00:00Z",
  updated_at: "2026-10-22T00:00:00Z",
});

function claimsDe(req) {
  const t = (req.headers.authorization ?? "").replace(/^Bearer /i, "");
  return verificar(t);
}

// ---- Utilidades HTTP ------------------------------------------------------------------------------
function responder(res, estado, cuerpo, cabeceras = {}) {
  res.writeHead(estado, { "content-type": "application/json", ...cabeceras });
  res.end(cuerpo === undefined ? "" : typeof cuerpo === "string" ? cuerpo : JSON.stringify(cuerpo));
}
async function leerCuerpo(req) {
  const trozos = [];
  for await (const t of req) trozos.push(t);
  return Buffer.concat(trozos);
}
function errorPg(res, e) {
  const estado = e.code === "42501" ? 403 : e.code === "23505" ? 409 : 400;
  responder(res, estado, { code: e.code ?? "PGRST000", message: e.message, details: e.detail ?? null, hint: e.hint ?? null });
}

/** Ejecuta `fn(cliente)` en una transacción con el rol y los claims de la petición (como PostgREST) */
async function comoPeticion(req, fn) {
  const claims = claimsDe(req);
  const c = await pool.connect();
  try {
    await c.query("begin");
    await c.query(`set local role ${claims ? "authenticated" : "anon"}`);
    await c.query("select set_config('request.jwt.claims', $1, true)", [JSON.stringify(claims ?? { role: "anon" })]);
    const r = await fn(c);
    await c.query("commit");
    return r;
  } catch (e) {
    await c.query("rollback").catch(() => {});
    throw e;
  } finally {
    c.release();
  }
}

// ---- REST -----------------------------------------------------------------------------------------
const id = (s) => `"${String(s).replace(/"/g, '""')}"`;
const RESERVADOS = new Set(["select", "order", "limit", "offset", "on_conflict", "columns"]);

/** Filtros de PostgREST (col=eq.valor...) → where con parámetros */
function filtros(params, valores, pre = "") {
  const partes = [];
  for (const [col, crudo] of params) {
    if (RESERVADOS.has(col)) continue;
    let v = crudo;
    let neg = false;
    if (v.startsWith("not.")) {
      neg = true;
      v = v.slice(4);
    }
    const p = v.indexOf(".");
    const op = v.slice(0, p);
    const val = v.slice(p + 1);
    let sql;
    const ph = () => {
      valores.push(val);
      return `$${valores.length}`;
    };
    switch (op) {
      case "eq": sql = `${pre}${id(col)} = ${ph()}`; break;
      case "neq": sql = `${pre}${id(col)} <> ${ph()}`; break;
      case "gt": sql = `${pre}${id(col)} > ${ph()}`; break;
      case "gte": sql = `${pre}${id(col)} >= ${ph()}`; break;
      case "lt": sql = `${pre}${id(col)} < ${ph()}`; break;
      case "lte": sql = `${pre}${id(col)} <= ${ph()}`; break;
      case "like": valores.push(val.replace(/\*/g, "%")); sql = `${pre}${id(col)}::text like $${valores.length}`; break;
      case "ilike": valores.push(val.replace(/\*/g, "%")); sql = `${pre}${id(col)}::text ilike $${valores.length}`; break;
      case "is": sql = `${pre}${id(col)} is ${val === "null" ? "null" : val === "true" ? "true" : "false"}`; break;
      case "in": {
        const lista = val.replace(/^\(|\)$/g, "").split(",").filter(Boolean).map((x) => x.replace(/^"|"$/g, ""));
        valores.push(lista);
        sql = `${pre}${id(col)}::text = any($${valores.length}::text[])`;
        break;
      }
      default: throw Object.assign(new Error(`Operador no soportado en la imitación: ${op}`), { code: "PGRST100" });
    }
    partes.push(neg ? `not (${sql})` : sql);
  }
  return partes.length ? `where ${partes.join(" and ")}` : "";
}

function orden(params) {
  const o = params.get("order");
  if (!o) return "";
  return "order by " + o.split(",").map((t) => {
    const [col, ...mods] = t.split(".");
    return `${id(col)} ${mods.includes("desc") ? "desc" : "asc"}${mods.includes("nullsfirst") ? " nulls first" : mods.includes("nullslast") ? " nulls last" : ""}`;
  }).join(", ");
}

function columnas(params) {
  const s = params.get("select");
  if (!s || s === "*") return "*";
  if (/[()]/.test(s)) throw Object.assign(new Error("La imitación no admite recursos anidados en select"), { code: "PGRST100" });
  return s.split(",").map((c) => id(c.trim())).join(", ");
}

async function clavePrimaria(c, tabla) {
  const { rows } = await c.query(
    `select a.attname from pg_index i join pg_attribute a on a.attrelid = i.indrelid and a.attnum = any(i.indkey)
     where i.indrelid = ('public.' || quote_ident($1))::regclass and i.indisprimary`,
    [tabla],
  );
  return rows.map((r) => r.attname);
}

function devolver(req, res, filas, estadoVacio = 201) {
  const pref = req.headers.prefer ?? "";
  // count=exact: el total va en Content-Range (las cuentas del panel, con head: true)
  if (pref.includes("count=")) res.setHeader("content-range", filas.length ? `0-${filas.length - 1}/${filas.length}` : "*/0");
  if (req.method === "HEAD") return responder(res, 200, undefined);
  const objeto = (req.headers.accept ?? "").includes("vnd.pgrst.object");
  if (objeto) {
    if (filas.length !== 1) return responder(res, 406, { code: "PGRST116", message: "JSON object requested, multiple (or no) rows returned", details: `The result contains ${filas.length} rows`, hint: null });
    return responder(res, 200, filas[0]);
  }
  if (req.method !== "GET" && !pref.includes("return=representation")) return responder(res, estadoVacio === 201 ? 201 : 204, undefined);
  return responder(res, 200, filas);
}

async function rest(req, res, url) {
  const ruta = url.pathname.replace(/^\/rest\/v1\//, "");
  const params = url.searchParams;
  const cuerpo = ["POST", "PATCH"].includes(req.method) ? (await leerCuerpo(req)).toString() : "";

  if (ruta.startsWith("rpc/")) {
    const fn = ruta.slice(4);
    const args = cuerpo ? JSON.parse(cuerpo) : {};
    const nombres = Object.keys(args);
    const r = await comoPeticion(req, (c) =>
      c.query(
        `select to_jsonb(public.${id(fn)}(${nombres.map((n, i) => `${id(n)} => $${i + 1}`).join(", ")})) as r`,
        nombres.map((n) => (args[n] !== null && typeof args[n] === "object" ? JSON.stringify(args[n]) : args[n])),
      ),
    );
    return responder(res, 200, r.rows[0]?.r ?? null);
  }

  const tabla = ruta;
  const valores = [];
  if (req.method === "GET" || req.method === "HEAD") {
    const lim = params.get("limit") ? ` limit ${Number(params.get("limit"))}` : "";
    const off = params.get("offset") ? ` offset ${Number(params.get("offset"))}` : "";
    const sql = `select coalesce(jsonb_agg(to_jsonb(x)), '[]') as r from (select ${columnas(params)} from public.${id(tabla)} ${filtros(params, valores)} ${orden(params)}${lim}${off}) x`;
    const r = await comoPeticion(req, (c) => c.query(sql, valores));
    return devolver(req, res, r.rows[0].r);
  }

  if (req.method === "POST") {
    const datos = JSON.parse(cuerpo || "[]");
    const filasIn = Array.isArray(datos) ? datos : [datos];
    const claves = [...new Set(filasIn.flatMap((f) => Object.keys(f)))];
    const pref = req.headers.prefer ?? "";
    const r = await comoPeticion(req, async (c) => {
      let conflicto = "";
      if (pref.includes("resolution=")) {
        const cols = params.get("on_conflict")?.split(",") ?? (await clavePrimaria(c, tabla));
        conflicto = pref.includes("ignore-duplicates")
          ? `on conflict (${cols.map(id).join(", ")}) do nothing`
          : `on conflict (${cols.map(id).join(", ")}) do update set ${claves.filter((k) => !cols.includes(k)).map((k) => `${id(k)} = excluded.${id(k)}`).join(", ") || `${id(cols[0])} = excluded.${id(cols[0])}`}`;
      }
      return c.query(
        `with ins as (insert into public.${id(tabla)} (${claves.map(id).join(", ")})
           select ${claves.map(id).join(", ")} from jsonb_populate_recordset(null::public.${id(tabla)}, $1::jsonb) ${conflicto} returning *)
         select coalesce(jsonb_agg(to_jsonb(ins)), '[]') as r from ins`,
        [JSON.stringify(filasIn)],
      );
    });
    return devolver(req, res, r.rows[0].r);
  }

  if (req.method === "PATCH") {
    const datos = JSON.parse(cuerpo || "{}");
    const claves = Object.keys(datos);
    valores.push(JSON.stringify(datos));
    const where = filtros(params, valores, "t0.").replace(/^where /, "and ");
    const sql = `with up as (update public.${id(tabla)} t0 set ${claves.map((k) => `${id(k)} = r.${id(k)}`).join(", ")}
      from jsonb_populate_record(null::public.${id(tabla)}, $1::jsonb) r where true ${where} returning t0.*)
      select coalesce(jsonb_agg(to_jsonb(up)), '[]') as r from up`;
    const r = await comoPeticion(req, (c) => c.query(sql, valores));
    return devolver(req, res, r.rows[0].r, 204);
  }

  if (req.method === "DELETE") {
    const sql = `with del as (delete from public.${id(tabla)} ${filtros(params, valores)} returning *) select coalesce(jsonb_agg(to_jsonb(del)), '[]') as r from del`;
    const r = await comoPeticion(req, (c) => c.query(sql, valores));
    return devolver(req, res, r.rows[0].r, 204);
  }
  responder(res, 405, { message: "Método no soportado" });
}

// ---- Auth -----------------------------------------------------------------------------------------
async function auth(req, res, url) {
  const ruta = url.pathname.replace(/^\/auth\/v1/, "");
  if (ruta === "/token" && req.method === "POST") {
    const cuerpo = JSON.parse((await leerCuerpo(req)).toString() || "{}");
    const tipo = url.searchParams.get("grant_type");
    if (tipo === "password") {
      if (cuerpo.email?.toLowerCase() !== CORREO || cuerpo.password !== CLAVE)
        return responder(res, 400, { code: 400, error_code: "invalid_credentials", msg: "Invalid login credentials" });
      return responder(res, 200, await sesion());
    }
    if (tipo === "refresh_token") {
      if (!refrescos.has(cuerpo.refresh_token)) return responder(res, 400, { code: 400, error_code: "refresh_token_not_found", msg: "Invalid Refresh Token" });
      refrescos.delete(cuerpo.refresh_token);
      return responder(res, 200, await sesion());
    }
  }
  if (ruta === "/user" && req.method === "GET") {
    const c = claimsDe(req);
    if (!c) return responder(res, 401, { code: 401, error_code: "bad_jwt", msg: "invalid JWT" });
    return responder(res, 200, datosUsuario(await elUsuario()));
  }
  if (ruta === "/logout") return responder(res, 204, undefined);
  responder(res, 404, { msg: `Ruta de auth no imitada: ${ruta}` });
}

// ---- Storage --------------------------------------------------------------------------------------
async function storage(req, res, url) {
  const ruta = decodeURIComponent(url.pathname.replace(/^\/storage\/v1\/object\//, ""));
  if (req.method === "GET" && ruta.startsWith("public/")) {
    const archivo = join(ARCHIVOS, ruta.slice(7));
    try {
      const meta = JSON.parse(await readFile(`${archivo}.meta.json`, "utf8"));
      res.writeHead(200, { "content-type": meta.tipo, "access-control-allow-origin": "*", "cache-control": "public, max-age=3600" });
      return res.end(await readFile(archivo));
    } catch {
      return responder(res, 404, { message: "Object not found" });
    }
  }
  // Escribir y borrar: solo el administrador (como la política del bucket)
  const claims = claimsDe(req);
  const esAdmin = claims && (await comoPeticion(req, (c) => c.query("select public.es_admin() as a"))).rows[0].a;
  if (!esAdmin) return responder(res, 403, { statusCode: "403", error: "Unauthorized", message: "new row violates row-level security policy" });

  if (req.method === "DELETE") {
    const { prefixes = [] } = JSON.parse((await leerCuerpo(req)).toString() || "{}");
    const bucket = ruta.replace(/\/$/, "");
    for (const p of prefixes) {
      await rm(join(ARCHIVOS, bucket, p), { force: true }).catch(() => {});
      await rm(join(ARCHIVOS, bucket, `${p}.meta.json`), { force: true }).catch(() => {});
    }
    return responder(res, 200, prefixes.map((name) => ({ name })));
  }
  if (req.method === "POST" || req.method === "PUT") {
    const cuerpo = await leerCuerpo(req);
    let datos = cuerpo;
    let tipo = req.headers["content-type"] ?? "application/octet-stream";
    if (tipo.startsWith("multipart/form-data")) {
      const fd = await new Request("http://x", { method: "POST", headers: { "content-type": tipo }, body: cuerpo }).formData();
      const f = [...fd.values()].find((v) => typeof v !== "string");
      datos = Buffer.from(await f.arrayBuffer());
      tipo = f.type || "application/octet-stream";
    }
    const archivo = join(ARCHIVOS, ruta);
    await mkdir(dirname(archivo), { recursive: true });
    await writeFile(archivo, datos);
    await writeFile(`${archivo}.meta.json`, JSON.stringify({ tipo }));
    return responder(res, 200, { Key: ruta, Id: randomUUID() });
  }
  responder(res, 405, { message: "Método no soportado" });
}

createServer(async (req, res) => {
  res.setHeader("access-control-allow-origin", req.headers.origin ?? "*");
  res.setHeader("access-control-allow-headers", "*");
  res.setHeader("access-control-allow-methods", "GET,POST,PATCH,PUT,DELETE,OPTIONS,HEAD");
  res.setHeader("access-control-expose-headers", "content-range");
  if (req.method === "OPTIONS") return responder(res, 204, undefined);
  const url = new URL(req.url, "http://localhost");
  try {
    if (url.pathname.startsWith("/rest/v1/")) return await rest(req, res, url);
    if (url.pathname.startsWith("/auth/v1/")) return await auth(req, res, url);
    if (url.pathname.startsWith("/storage/v1/")) return await storage(req, res, url);
    responder(res, 404, { message: "No existe" });
  } catch (e) {
    console.error(req.method, req.url, e.message);
    errorPg(res, e);
  }
}).listen(PUERTO, () => console.log(`Supabase local en http://localhost:${PUERTO}`));
