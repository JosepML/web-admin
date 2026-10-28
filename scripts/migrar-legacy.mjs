// Tarea S1: genera el SQL que carga proyectos y artículos en Supabase.
// Uso: node --experimental-strip-types scripts/migrar-legacy.mjs
// Salida: supabase/datos/01-servicios-medios.sql, 02-proyectos-NN.sql, 03-articulos.sql (se aplican en ese orden, con execute_sql).
// Fuentes: legacy/constants.ts (id antiguo, imágenes, vídeos extra), src/app/prototipos/d/datos.ts (ficha técnica revisada
// con Josep) y plan/contenido/{proyectos,articulos}/*.md (textos de la tarea E). Solo inserta o actualiza; nunca borra.
// Es repetible: proyectos y artículos se actualizan por (idioma, id_antiguo); los medios no se duplican (por url_origen).
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { PROJECTS } from "../legacy/constants.ts";
import { PROYECTOS, SERVICIOS, SELECCION, ARTICULOS } from "../src/app/prototipos/d/datos.ts";

const SALIDA = "supabase/datos";
mkdirSync(SALIDA, { recursive: true });

// URLs que ya no existen en su servidor (no se migran)
const URLS_MUERTAS = new Set(["https://iili.io/BmoHrCl.png"]);

const q = (s) => (s == null || s === "" ? "null" : `'${String(s).replace(/'/g, "''")}'`);
const tag = (s) => { let t = "t"; while (s.includes(`$${t}$`)) t += "x"; return `$${t}$${s}$${t}$`; };
const txt = (s) => (s ? tag(s) : "''");

/** Frontmatter sencillo de los .md + cuerpo */
function leerMd(ruta) {
  const md = readFileSync(ruta, "utf8").replace(/\r\n/g, "\n");
  const fin = md.indexOf("\n---\n", 4);
  const meta = {};
  for (const l of md.slice(4, fin).split("\n")) {
    const m = l.match(/^([^:]+):\s*(.*)$/);
    if (m) meta[m[1].trim()] = m[2].trim();
  }
  return { meta, cuerpo: md.slice(fin + 5) };
}

/** Quita los «[pendiente…]» de un campo; vacío si solo quedaba eso */
const limpio = (s) => (s ?? "").replace(/\s*\[[^\]]*\]/g, "").replace(/\s*·\s*ópticas\s*$/, "").trim();

/** Secciones del cuerpo de un proyecto; «Para revisar» no se carga nunca */
function secciones(cuerpo) {
  const out = {};
  for (const trozo of cuerpo.split(/^## /m).slice(1)) {
    const [titulo, ...resto] = trozo.split("\n");
    if (/^Para revisar/i.test(titulo.trim())) continue;
    out[titulo.trim()] = resto.join("\n").trim().replace(/\n{3,}/g, "\n\n");
  }
  return out;
}

const mds = {};
for (const f of readdirSync("plan/contenido/proyectos").filter((f) => f.endsWith(".md") && f !== "README.md")) {
  const { meta, cuerpo } = leerMd(join("plan/contenido/proyectos", f));
  mds[meta.slug] = { meta, sec: secciones(cuerpo) };
}

const legacyPorId = Object.fromEntries(PROJECTS.map((p) => [p.id, p]));
const datosPorSlug = Object.fromEntries(PROYECTOS.map((p) => [p.slug, p]));

// Orden de Trabajos («Todos») del mapa de contenido; las recreaciones al final
const ORDEN = [
  "y-el-ano-que-viene-que", "100-baladas-arkano", "el-cirujano", "no-se-esta-tan-mal-lovva", "ep-oscuridad-adrian-munoz",
  "kiboko", "expandete-spot-juno-media", "sin-tiempo-peiko", "el-viajero", "sin-piedad", "eventos-deportivos",
  "conciertos", "reels-redes-sociales", "bodas",
  "recreacion-nosferatu", "recreacion-star-wars-luke-vader", "recreacion-el-padrino", "recreacion-star-wars-sin-cgi",
];
const SERVICIO_ORDEN = ["direccion-de-fotografia", "filmmaker", "edicion"];

// ---------------------------------------------------------------- medios
const medios = new Map(); // url -> tipo de uso (solo para el recuento)
const mime = (u) => (/\.png(\?|$)/i.test(u) ? "image/png" : /\.jpe?g(\?|$)/i.test(u) || /ytimg\.com/.test(u) ? "image/jpeg" : "");
function medio(url) {
  if (!url || URLS_MUERTAS.has(url) || !url.startsWith("https://")) return null;
  medios.set(url, true);
  return url;
}

// ---------------------------------------------------------------- proyectos
const filas = [];
const avisos = [];
for (const slug of ORDEN) {
  const md = mds[slug];
  if (!md) throw new Error(`Falta el .md de ${slug}`);
  const d = datosPorSlug[slug]; // ficha revisada con Josep (14 proyectos); las 4 recreaciones salen del .md
  const idAntiguo = md.meta.id_antiguo;
  const lg = legacyPorId[idAntiguo];
  if (!lg) throw new Error(`No hay proyecto antiguo con id ${idAntiguo}`);

  const anio = d ? d.anio : /^\d{4}$/.test(md.meta["año"]) ? Number(md.meta["año"]) : undefined;
  const servicios = d ? d.servicios : md.meta.servicios.replace(/[[\]]/g, "").split(",").map((s) => s.trim());
  const poster = medio(d ? d.poster : lg.thumbnailUrl);
  const urls = [];
  for (const u of [...(d ? d.fotogramas : []), ...(lg.images ?? [])]) if (medio(u) && !urls.includes(u)) urls.push(u);
  if (poster && !urls.includes(poster)) urls.unshift(poster);

  // Premios: solo hechos confirmados
  const premios = [];
  if (slug === "y-el-ano-que-viene-que") premios.push({ anio: 2024, nombre: "Podio", tipo: "podio", festival: "ESCAC Dreammakers Contest 2024" });
  if (slug === "el-cirujano") premios.push({ nombre: "Mejor fotografía", tipo: "ganado", festival: "On Duty International Film Festival" });
  if (slug === "ep-oscuridad-adrian-munoz") premios.push({ nombre: "1,39 M visualizaciones", tipo: "cifra", festival: "YouTube y plataformas" });
  if (slug === "kiboko") premios.push({ anio: 2026, nombre: "Nominación a mejor montaje", tipo: "nominacion" });

  // Vídeos extra de la web antigua
  const videos = [];
  for (const v of lg.multipleVideos ?? []) {
    if (v.type === "instagram") {
      for (const m of (v.customHtml ?? "").matchAll(/data-instgrm-permalink="(https:\/\/www\.instagram\.com\/[^"?]+)/g)) videos.push({ tipo: "instagram", url: m[1], titulo: v.title });
    } else videos.push({ tipo: v.type ?? "youtube", id: v.id, titulo: v.title });
  }
  if (lg.processVideoId) videos.push({ tipo: "youtube", id: lg.processVideoId, titulo: "Cómo lo hicimos", rol: "proceso" });

  const s = md.sec;
  filas.push({
    slug, idAntiguo, titulo: d ? d.titulo : md.meta.titulo, tipo: md.meta.tipo, anio,
    direccion: d ? d.direccion : md.meta.direccion,
    productora: d ? d.productora : limpio(md.meta.productora_cliente),
    papel: d ? d.papel : md.meta.mi_papel,
    camara: d ? (d.camara ?? "") : limpio(md.meta.camara),
    premios, tarjeta: s["Tarjeta"] ?? "", historia: s["El proyecto"] ?? "", como: s["Decisiones clave"] ?? "",
    reto: s["El reto"] ?? "", resultado: s["Resultado"] ?? "", frase: d?.frase ?? "",
    youtubeId: d ? d.youtubeId : lg.youtubeVideoId, inicio: d?.inicioClip,
    videos, debajoTexto: !!lg.videosBelowText, poster, galeria: urls,
    destacado: Number(md.meta.destacado) || null, orden: ORDEN.indexOf(slug) + 1, servicios,
  });
  if (!anio) avisos.push(`${slug}: sin año`);
  if (!(d ? d.camara : limpio(md.meta.camara))) avisos.push(`${slug}: sin cámara`);
  if (urls.length < 4) avisos.push(`${slug}: solo ${urls.length} imagen(es)`);
}

// ---------------------------------------------------------------- artículos
function inline(s) {
  const out = [];
  const re = /\*\*(.+?)\*\*|\*(.+?)\*|\[(.+?)\]\((https?:[^)]+)\)/g;
  let i = 0, m;
  const t = (text, marks) => text && out.push({ type: "text", text, ...(marks ? { marks } : {}) });
  while ((m = re.exec(s))) {
    t(s.slice(i, m.index));
    if (m[1]) t(m[1], [{ type: "bold" }]);
    else if (m[2]) t(m[2], [{ type: "italic" }]);
    else t(m[3], [{ type: "link", attrs: { href: m[4] } }]);
    i = re.lastIndex;
  }
  t(s.slice(i));
  return out;
}
function documento(cuerpo) {
  const content = [];
  const quitar = cuerpo.split(/^## Para revisar/m)[0];
  for (const bloque of quitar.trim().split(/\n\s*\n/)) {
    const b = bloque.trim();
    if (!b) continue;
    const h = b.match(/^(#{2,3})\s+(.+)$/);
    if (h) content.push({ type: "heading", attrs: { level: h[1].length }, content: inline(h[2]) });
    else if (/^[-*] /m.test(b)) content.push({ type: "bulletList", content: b.split("\n").map((l) => ({ type: "listItem", content: [{ type: "paragraph", content: inline(l.replace(/^[-*]\s+/, "")) }] })) });
    else content.push({ type: "paragraph", content: inline(b.replace(/\s*\n\s*/g, " ")) });
  }
  return { type: "doc", content };
}
const articulos = [];
for (const f of readdirSync("plan/contenido/articulos").filter((f) => f.endsWith(".md"))) {
  const { meta, cuerpo } = leerMd(join("plan/contenido/articulos", f));
  const imagen = medio(ARTICULOS.find((a) => a.slug === meta.slug)?.imagen);
  articulos.push({ ...meta, imagen, doc: documento(cuerpo) });
}

// ---------------------------------------------------------------- SQL
const idMedio = (url) => (url ? `pg_temp.med(${q(url)})` : "null");
// Funciones temporales (viven solo durante la ejecución del archivo): id de un medio por su URL y galería en el formato de `galeria`
const AYUDAS = `create function pg_temp.med(u text) returns uuid language sql as $$ select id from public.medios where url_origen = u order by creado_en limit 1 $$;
create function pg_temp.gal(urls text[]) returns jsonb language sql as $$ select coalesce(jsonb_agg(jsonb_build_object('medio', pg_temp.med(u), 'pie', '') order by o), '[]'::jsonb) from unnest(urls) with ordinality t(u, o) $$;
`;

// 1. servicios mínimos (S3 completa los textos y los publica) + todos los medios
const sql1 = [
  "-- S1 · parte 1: servicios (solo lo imprescindible para enlazar proyectos; S3 carga el resto) y medios externos",
  ...SERVICIOS.map((s) => `insert into public.servicios (slug, nombre, frase, resumen, orden) values (${q(s.slug)}, ${q(s.nombre)}, ${q(s.frase)}, ${q(s.resumen)}, ${SERVICIO_ORDEN.indexOf(s.slug) + 1}) on conflict (idioma, slug) do nothing;`),
  `insert into public.medios (url_origen, tipo, mime) select v.u, 'imagen', v.m from (values\n${[...medios.keys()].map((u) => `(${q(u)}, ${q(mime(u) || "image/*")})`).join(",\n")}\n) v(u, m) where not exists (select 1 from public.medios x where x.url_origen = v.u);`,
].join("\n");
writeFileSync(join(SALIDA, "01-servicios-medios.sql"), sql1 + "\n");

const sqlProyecto = (p) => {
  const galeria = p.galeria.length ? `pg_temp.gal(array[${p.galeria.map(q).join(",")}])` : "'[]'::jsonb";
  return `
insert into public.proyectos (id_antiguo, slug, titulo, tipo_id, anio, direccion, productora, papel, camara, premios, tarjeta, historia, como_lo_hicimos, el_reto, el_resultado, frase,
  youtube_id, youtube_inicio, videos, videos_debajo_del_texto, imagen_id, galeria, destacado_orden, orden, estado, publicado_en)
values (${q(p.idAntiguo)}, ${q(p.slug)}, ${q(p.titulo)}, (select id from public.tipos_proyecto where slug = ${q(p.tipo)}), ${p.anio ?? "null"}, ${q(p.direccion) === "null" ? "''" : q(p.direccion)},
  ${q(p.productora) === "null" ? "''" : q(p.productora)}, ${q(p.papel) === "null" ? "''" : q(p.papel)}, ${q(p.camara) === "null" ? "''" : q(p.camara)}, ${tag(JSON.stringify(p.premios))}::jsonb,
  ${txt(p.tarjeta)}, ${txt(p.historia)}, ${txt(p.como)}, ${txt(p.reto)}, ${txt(p.resultado)}, ${txt(p.frase)},
  ${q(p.youtubeId)}, ${p.inicio ?? "null"}, ${tag(JSON.stringify(p.videos))}::jsonb, ${p.debajoTexto}, ${idMedio(p.poster)}, ${galeria}, ${p.destacado ?? "null"}, ${p.orden}, 'publicado', now())
on conflict (idioma, id_antiguo) do update set slug = excluded.slug, titulo = excluded.titulo, tipo_id = excluded.tipo_id, anio = excluded.anio, direccion = excluded.direccion,
  productora = excluded.productora, papel = excluded.papel, camara = excluded.camara, premios = excluded.premios, tarjeta = excluded.tarjeta, historia = excluded.historia,
  como_lo_hicimos = excluded.como_lo_hicimos, el_reto = excluded.el_reto, el_resultado = excluded.el_resultado, frase = excluded.frase, youtube_id = excluded.youtube_id,
  youtube_inicio = excluded.youtube_inicio, videos = excluded.videos, videos_debajo_del_texto = excluded.videos_debajo_del_texto, imagen_id = excluded.imagen_id,
  galeria = excluded.galeria, destacado_orden = excluded.destacado_orden, orden = excluded.orden;
${p.servicios.map((sv, i) => {
    const enSel = (SELECCION[sv] ?? []).indexOf(p.slug);
    const resto = ORDEN.filter((x) => !(SELECCION[sv] ?? []).includes(x) && (datosPorSlug[x]?.servicios ?? mds[x].meta.servicios.replace(/[[\]]/g, "").split(",").map((s) => s.trim())).includes(sv));
    const orden = enSel >= 0 ? enSel + 1 : (SELECCION[sv] ?? []).length + resto.indexOf(p.slug) + 1;
    return `insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) select p.id, s.id, ${orden}, ${enSel >= 0} from public.proyectos p, public.servicios s where p.id_antiguo = ${q(p.idAntiguo)} and s.slug = ${q(sv)} on conflict (proyecto_id, servicio_id) do update set orden = excluded.orden, destacado = excluded.destacado;`;
  }).join("\n")}`;
};
for (let i = 0; i < filas.length; i += 3) {
  const n = String(i / 3 + 1).padStart(2, "0");
  writeFileSync(join(SALIDA, `02-proyectos-${n}.sql`), `-- S1 · parte 2.${n}: proyectos ${filas.slice(i, i + 3).map((p) => p.slug).join(", ")}\n${AYUDAS}${filas.slice(i, i + 3).map(sqlProyecto).join("\n")}\n`);
}

const fechaOk = (f) => /^\d{4}-\d{2}-\d{2}$/.test(f);
writeFileSync(
  join(SALIDA, "03-articulos.sql"),
  `-- S1 · parte 3: artículos\n${AYUDAS}${articulos.map((a) => {
    if (!fechaOk(a.fecha)) throw new Error(`Fecha no válida en ${a.slug}`);
    return `insert into public.articulos (id_antiguo, slug, titulo, fecha, extracto, contenido, categoria_id, imagen_id, estado, publicado_en)
values (${q(a.id_antiguo)}, ${q(a.slug)}, ${q(a.titulo)}, ${q(a.fecha)}, ${q(a.extracto)}, ${tag(JSON.stringify(a.doc))}::jsonb, (select id from public.categorias_articulo where nombre = ${q(a.categoria)}), ${idMedio(a.imagen)}, 'publicado', now())
on conflict (idioma, id_antiguo) do update set slug = excluded.slug, titulo = excluded.titulo, fecha = excluded.fecha, extracto = excluded.extracto, contenido = excluded.contenido, categoria_id = excluded.categoria_id, imagen_id = excluded.imagen_id;`;
  }).join("\n")}\n`,
);

console.log(`${filas.length} proyectos, ${articulos.length} artículos, ${medios.size} medios, ${SERVICIOS.length} servicios`);
console.log(avisos.join("\n"));
