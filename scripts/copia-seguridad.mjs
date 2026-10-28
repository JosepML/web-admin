// Tarea S18: Copia de seguridad local de la base de datos y del bucket `medios` (proyecto oadmqwtnxpbotxcgzaoo).
// Uso:
//   node scripts/copia-seguridad.mjs                  -> Guarda todas las tablas en copias-seguridad/<fecha>/datos.json
//   node scripts/copia-seguridad.mjs --con-archivos   -> Además descarga los archivos del bucket `medios`
//   node scripts/copia-seguridad.mjs --verificar <dir> -> Comprueba que una copia guardada está completa y legible

import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";

const PROYECTO_PROHIBIDO = "jgolxrpxyuxpqqdyikwb"; // JML Studio: nunca tocar
const PROYECTO_WEB = "oadmqwtnxpbotxcgzaoo";

const TABLAS_PUBLICAS = [
  "ajustes",
  "servicios",
  "tipos_proyecto",
  "proyectos",
  "proyecto_servicios",
  "categorias_articulo",
  "articulos",
  "paginas",
  "bloques",
  "clientes",
  "opiniones",
  "canales",
  "medios",
];

const TABLAS_PRIVADAS = ["carpetas", "mensajes", "revisiones"];

function cargarEnv() {
  const vars = { ...process.env };
  for (const archivo of [".env", ".env.local"]) {
    if (!existsSync(archivo)) continue;
    for (const linea of readFileSync(archivo, "utf8").split(/\r?\n/)) {
      const m = linea.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) vars[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
  return vars;
}

function verificarCopia(carpeta) {
  const rutaDatos = join(carpeta, "datos.json");
  const rutaResumen = join(carpeta, "resumen.json");
  if (!existsSync(rutaDatos) || !existsSync(rutaResumen)) {
    throw new Error(`No se encuentra datos.json o resumen.json en ${carpeta}`);
  }
  const datos = JSON.parse(readFileSync(rutaDatos, "utf8"));
  const resumen = JSON.parse(readFileSync(rutaResumen, "utf8"));
  for (const tabla of TABLAS_PUBLICAS) {
    if (!Array.isArray(datos.tablas?.[tabla])) {
      throw new Error(`Falta la tabla "${tabla}" en la copia.`);
    }
    const n = datos.tablas[tabla].length;
    if (resumen.recuento?.[tabla] !== n) {
      throw new Error(`El recuento de "${tabla}" no coincide (${n} vs ${resumen.recuento?.[tabla]}).`);
    }
  }
  console.log(`✓ Copia verificada correctamente: ${carpeta}`);
  console.log(`  Fecha: ${resumen.fecha}`);
  console.log(`  Proyectos: ${resumen.recuento.proyectos} · Artículos: ${resumen.recuento.articulos} · Medios: ${resumen.recuento.medios} · Bloques: ${resumen.recuento.bloques}`);
}

async function descargarTabla(urlBase, clave, tabla) {
  const res = await fetch(`${urlBase}/rest/v1/${tabla}?select=*`, {
    headers: {
      apikey: clave,
      Authorization: `Bearer ${clave}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Error al leer ${tabla}: ${res.status} ${res.statusText}`);
  }
  return await res.json();
}

async function ejecutar() {
  const args = process.argv.slice(2);
  const idxVerificar = args.indexOf("--verificar");
  if (idxVerificar >= 0) {
    let destino = args[idxVerificar + 1] || "copias-seguridad/ultima";
    if (destino === "copias-seguridad/ultima" && existsSync("copias-seguridad")) {
      const carpetas = readdirSync("copias-seguridad", { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name)
        .sort();
      if (carpetas.length === 0) throw new Error("No hay ninguna copia en copias-seguridad/");
      destino = join("copias-seguridad", carpetas[carpetas.length - 1]);
    }
    verificarCopia(destino);
    return;
  }

  const conArchivos = args.includes("--con-archivos");
  const env = cargarEnv();
  const urlBase = (env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "");
  const clave = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!urlBase || !clave) {
    throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL o la clave de Supabase en .env");
  }
  if (urlBase.includes(PROYECTO_PROHIBIDO)) {
    throw new Error("ABORTADO: la URL apunta al proyecto prohibido JML Studio.");
  }
  if (!urlBase.includes(PROYECTO_WEB) && !urlBase.startsWith("http://localhost")) {
    throw new Error(`ABORTADO: la URL no corresponde al proyecto ${PROYECTO_WEB}.`);
  }

  const ahora = new Date();
  const sello = ahora.toISOString().replace(/[:]/g, "-").slice(0, 16).replace("T", "_");
  const carpeta = join("copias-seguridad", sello);
  mkdirSync(carpeta, { recursive: true });

  console.log(`Creando copia de seguridad en ${carpeta}...`);
  const tablas = {};
  const recuento = {};

  for (const t of TABLAS_PUBLICAS) {
    const filas = await descargarTabla(urlBase, clave, t);
    tablas[t] = filas;
    recuento[t] = filas.length;
    console.log(`  · ${t}: ${filas.length} filas`);
  }

  if (env.SUPABASE_SERVICE_ROLE_KEY) {
    for (const t of TABLAS_PRIVADAS) {
      try {
        const filas = await descargarTabla(urlBase, clave, t);
        tablas[t] = filas;
        recuento[t] = filas.length;
        console.log(`  · ${t} (privada): ${filas.length} filas`);
      } catch {
        // Ignorar si no existe o no hay permiso
      }
    }
  }

  const volcado = {
    proyecto: PROYECTO_WEB,
    fecha: ahora.toISOString(),
    modo: env.SUPABASE_SERVICE_ROLE_KEY ? "completo (service_role)" : "publicado (clave pública)",
    tablas,
  };

  writeFileSync(join(carpeta, "datos.json"), JSON.stringify(volcado, null, 2), "utf8");

  let archivosDescargados = 0;
  if (conArchivos && Array.isArray(tablas.medios)) {
    const carpetaArchivos = join(carpeta, "archivos");
    for (const m of tablas.medios) {
      if (!m.ruta) continue;
      const destinoArchivo = join(carpetaArchivos, m.ruta);
      mkdirSync(dirname(destinoArchivo), { recursive: true });
      const urlArchivo = `${urlBase}/storage/v1/object/public/medios/${m.ruta.split("/").map(encodeURIComponent).join("/")}`;
      const res = await fetch(urlArchivo);
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        writeFileSync(destinoArchivo, buf);
        archivosDescargados++;
      }
    }
    console.log(`  · archivos descargados del bucket medios: ${archivosDescargados}`);
  }

  const resumen = {
    proyecto: PROYECTO_WEB,
    fecha: ahora.toISOString(),
    carpeta,
    modo: volcado.modo,
    recuento,
    archivosDescargados,
  };
  writeFileSync(join(carpeta, "resumen.json"), JSON.stringify(resumen, null, 2), "utf8");

  verificarCopia(carpeta);
}

ejecutar().catch((err) => {
  console.error("Error en la copia de seguridad:", err.message || err);
  process.exit(1);
});
