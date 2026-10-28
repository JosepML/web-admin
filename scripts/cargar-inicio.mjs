// Tarea C (y la parte de S3 que necesita Inicio): genera supabase/datos/04-inicio.sql con
// - los servicios completos (mirada, aporto, para quién, pasos, preguntas, llamada, SEO) y publicados,
// - clientes (con sus logos como medios), opiniones y canales de YouTube,
// - el ajuste «sitio» (nombre, contacto, redes),
// - la página «inicio» y sus bloques, con los textos aprobados en el prototipo D.
// Fuente: src/app/prototipos/d/datos.ts (lo que Josep revisó en el prototipo) y plan/contenido/*.md (SEO).
//
// Uso: node --experimental-strip-types --no-warnings scripts/cargar-inicio.mjs
// y después aplicar el SQL con execute_sql (MCP de Supabase) o en el editor SQL.
// Es repetible: no duplica nada ni pisa lo que Josep haya cambiado después (todo es «si no existe»), salvo
// los servicios, que se actualizan por slug: no volver a aplicarlo cuando Josep ya los edite desde el panel.

import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const D = await import(join(raiz, "src/app/prototipos/d/datos.ts"));

const q = (s) => (s === null || s === undefined ? "null" : `'${String(s).replace(/'/g, "''")}'`);
const j = (v) => `${q(JSON.stringify(v))}::jsonb`;
const medio = (url) => `(select id::text from public.medios where url_origen = ${q(url)})`;
const proyecto = (slug) => `(select id::text from public.proyectos where slug = ${q(slug)} and idioma = 'es')`;
const mime = (url) => (url.endsWith(".svg") ? "image/svg+xml" : /\.png$/i.test(url) ? "image/png" : "image/jpeg");

const sql = [];
const L = (s) => sql.push(s);

L("-- Tarea C · Inicio y lo que leen sus bloques. Generado con scripts/cargar-inicio.mjs (no editar a mano).");
L("begin;");

// --- Medios que no cargó S1: logos de clientes, foto de Sobre mí ------------------------------------
const nuevos = [
  ...D.CLIENTES.filter((c) => c.logo).map((c) => ({ url: c.logo, alt: `Logo de ${c.nombre}`, titulo: `Logo ${c.nombre}` })),
  { url: D.CATALOGO["sobre-mi"].datos.imagen, alt: "Josep Mira Lozano en un rodaje", titulo: "Josep en rodaje (provisional)" },
  { url: D.AJUSTES.reel.poster, alt: "Fotograma de «Y el año que viene, ¿qué?»", titulo: "Póster del reel" },
];
for (const m of nuevos) {
  L(
    `insert into public.medios (url_origen, tipo, mime, titulo, texto_alternativo) values (${q(m.url)}, 'imagen', ${q(mime(m.url))}, ${q(m.titulo)}, ${q(m.alt)}) on conflict (url_origen) where url_origen is not null do nothing;`,
  );
}

// --- Servicios: completar y publicar ----------------------------------------------------------------
const SEO = {
  "direccion-de-fotografia": [
    "Director de fotografía en Alicante · Josep Mira Lozano",
    "Dirección de fotografía para cortometrajes, videoclips y spots. La luz, el encuadre y el color al servicio de la historia.",
  ],
  filmmaker: [
    "Filmmaker en Alicante · Josep Mira Lozano",
    "Vídeo corporativo, spots, videoclips, conciertos, eventos, deporte y bodas. Me sumo a tu equipo o llevo el proyecto de la idea al montaje.",
  ],
  edicion: [
    "Montador y editor de vídeo en Alicante · Josep Mira Lozano",
    "Montaje, color y sonido para documentales, videoclips, spots, eventos y redes. El ritmo como forma de contar.",
  ],
};
// Josep no quiere destacar «percusionista desde los 3 años»: fuera del resumen de Edición (sigue en el texto largo)
const RESUMEN = { edicion: "Monto con el ritmo por dentro, como una partitura: que la imagen respire con la música." };
D.SERVICIOS.forEach((s, i) => {
  L(`update public.servicios set
  nombre = ${q(s.nombre)}, frase = ${q(s.frase)}, resumen = ${q(RESUMEN[s.slug] ?? s.resumen)},
  mirada = ${j(s.mirada)}, aporto = ${j(s.aporto)}, para_quien = ${j(s.paraQuien)}, con_quien = ${q(s.conQuien)},
  pasos = ${j(s.pasos)}, preguntas = ${j(s.preguntas.map((p) => ({ pregunta: p.p, respuesta: p.r })))},
  llamada = ${q(s.llamada)}, seo_titulo = ${q(SEO[s.slug][0])}, seo_descripcion = ${q(SEO[s.slug][1])}, orden = ${i + 1},
  estado = 'publicado', publicado_en = coalesce(publicado_en, now())
where slug = ${q(s.slug)} and idioma = 'es';`);
});

// --- Clientes ---------------------------------------------------------------------------------------
const clientes = [...D.CLIENTES.map((c) => ({ ...c, juno: false })), ...D.JUNO.clientes.map((c) => ({ ...c, juno: true }))];
clientes.forEach((c, i) => {
  const estilo = c.logo ? "logo" : c.estilo === "firma" ? "firma" : "nombre";
  L(`insert into public.clientes (nombre, logo_id, alto_logo, estilo, con_juno, orden, estado, publicado_en)
select ${q(c.nombre)}, ${c.logo ? `(select id from public.medios where url_origen = ${q(c.logo)})` : "null"}, ${c.alto ?? "null"}, '${estilo}', ${c.juno}, ${i + 1}, 'publicado', now()
where not exists (select 1 from public.clientes where nombre = ${q(c.nombre)});`);
});

// --- Opiniones (la del taco se guarda sin publicar: lo decide Josep, ver plan/contenido/inicio.md) ----
const opiniones = [
  ...D.OPINIONES.map((o) => ({ ...o, estado: "publicado" })),
  { texto: "¡Josep! ¡Qué eres un puto máquina, tío! Ens ha flipat a tots mogolló.", quien: "Cliente", tipo: "Vídeo de evento", estado: "borrador" },
];
opiniones.forEach((o, i) => {
  L(`insert into public.opiniones (texto, autor, contexto, orden, estado, publicado_en)
select ${q(o.texto)}, ${q(o.quien)}, ${q(o.tipo)}, ${i + 1}, '${o.estado}', ${o.estado === "publicado" ? "now()" : "null"}
where not exists (select 1 from public.opiniones where texto = ${q(o.texto)});`);
});

// --- Canales de YouTube -----------------------------------------------------------------------------
D.CANALES.forEach((c, i) => {
  L(`insert into public.canales (nombre, texto, url, orden, estado, publicado_en)
select ${q(c.nombre)}, ${q(c.texto)}, ${q(c.url ?? null)}, ${i + 1}, 'publicado', now()
where not exists (select 1 from public.canales where nombre = ${q(c.nombre)});`);
});

// --- Ajustes generales ------------------------------------------------------------------------------
const sitio = {
  nombre: D.AJUSTES.nombre,
  lema: "Dirección de fotografía, filmmaker y edición",
  correo: D.AJUSTES.correo,
  whatsapp: D.AJUSTES.whatsapp,
  disponible: true,
  ubicacion: "Alicante",
  redes: {
    instagram: "https://www.instagram.com/josepmiralozano/",
    youtube: "https://www.youtube.com/channel/UCtyNSF1X0pNPxp5fhwu1NUA",
    linkedin: "https://www.linkedin.com/in/josep-mira-lozano-a70798214/",
  },
};
L(`insert into public.ajustes (clave, valor) values ('sitio', ${j(sitio)})
on conflict (clave) do update set valor = excluded.valor
where public.ajustes.valor ->> 'correo' is null;`);

// --- Página de Inicio y sus bloques -----------------------------------------------------------------
L(`insert into public.paginas (slug, titulo, seo_titulo, seo_descripcion, estado, publicado_en) values ('inicio', 'Inicio',
  'Josep Mira Lozano · Director de fotografía y filmmaker en Alicante',
  'Cuento historias con luz. Dirección de fotografía, grabación y edición de cortos, videoclips, spots y eventos en Alicante y la Comunidad Valenciana.',
  'publicado', now())
on conflict (idioma, slug) do nothing;`);

const C = D.CATALOGO;
const comun = (tipo) => {
  const { antetitulo, titulo, texto } = C[tipo].datos;
  return { ...(antetitulo ? { antetitulo } : {}), titulo, ...(texto ? { texto } : {}) };
};
// Cada bloque: datos fijos (JSON) y, aparte, los que apuntan a filas (medios o proyectos), en SQL
const bloques = [
  {
    tipo: "portada",
    datos: { ...comun("portada"), papeles: ["director de fotografía", "filmmaker", "editor"] },
    sql: `jsonb_build_object('video', jsonb_build_object('youtubeId', ${q(D.AJUSTES.reel.youtubeId)}, 'inicio', ${D.AJUSTES.reel.inicio}, 'poster', ${medio(D.AJUSTES.reel.poster)}, 'medio', null, 'recorte', 1.45))`,
  },
  { tipo: "servicios", datos: comun("servicios") },
  {
    tipo: "filmmaker",
    datos: { ...comun("filmmaker"), enlace: { texto: "Cómo trabajo como filmmaker", href: "/servicios/filmmaker" } },
    sql: `jsonb_build_object('piezas', jsonb_build_array(${D.FILMMAKER.map(
      (f) => `jsonb_build_object('nombre', ${q(f.nombre)}, 'texto', ${q(f.texto)}, 'proyecto', ${proyecto(f.proyecto)})`,
    ).join(", ")}))`,
  },
  { tipo: "trabajos", datos: comun("trabajos") },
  {
    tipo: "sobre-mi",
    datos: {
      ...comun("sobre-mi"),
      etiqueta: "+9 años · Alicante",
      cita: "La cámara se convierte en la extensión de mi mirada.",
      papeles: ["Director de fotografía", "Filmmaker", "Editor", "Operador de cámara", "Gaffer", "Realizador"],
      enlace: { texto: "Conóceme mejor", href: "/sobre-mi" },
    },
    sql: `jsonb_build_object('imagen', ${medio(C["sobre-mi"].datos.imagen)})`,
  },
  {
    tipo: "cifras",
    datos: {
      ...comun("cifras"),
      cifras: [
        { valor: 9, prefijo: "+", unidad: "años", texto: "contando historias: primero en YouTube, después en el set" },
        { valor: 1.39, decimales: 2, sufijo: " M", unidad: "visualizaciones", texto: "del EP Oscuridad, de Adrián Muñoz" },
      ],
    },
  },
  { tipo: "proceso", datos: { ...comun("proceso"), pasos: D.PASOS } },
  { tipo: "opiniones", datos: comun("opiniones") },
  { tipo: "clientes", datos: { antetitulo: "Clientes", ...comun("clientes"), juno: { texto: D.JUNO.texto } } },
  { tipo: "blog", datos: { ...comun("blog"), cantidad: 3, enlace: { texto: "Todos los artículos", href: "/blog" } } },
  {
    tipo: "llamada",
    datos: {
      ...comun("llamada"),
      opciones: ["Videoclip", "Cortometraje", "Spot", "Evento", "Boda", "Redes sociales"],
      nota: "Te respondo personalmente, normalmente en menos de 24 horas.",
    },
  },
];
bloques.forEach((b, i) => {
  const datos = b.sql ? `${j(b.datos)} || ${b.sql}` : j(b.datos);
  L(`insert into public.bloques (pagina_id, orden, tipo, visible, datos)
select p.id, ${i}, '${b.tipo}', true, ${datos}
from public.paginas p
where p.slug = 'inicio' and p.idioma = 'es'
  and not exists (select 1 from public.bloques x where x.pagina_id = p.id and x.tipo = '${b.tipo}');`);
});

L("commit;");

const salida = join(raiz, "supabase/datos/04-inicio.sql");
writeFileSync(salida, sql.join("\n\n") + "\n");
console.log(`${sql.length} sentencias -> supabase/datos/04-inicio.sql`);
