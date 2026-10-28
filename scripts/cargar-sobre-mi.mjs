// Genera supabase/datos/05-sobre-mi.sql: la página «sobre-mi» y sus bloques, con los textos de
// plan/contenido/sobre-mi.md (sin «percusionista desde los 3 años», que Josep no quiere destacar).
// Los clientes, los premios y los canales los leen los bloques de sus tablas. Repetible: todo «si no existe».
// Uso: node scripts/cargar-sobre-mi.mjs
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const q = (s) => `'${String(s).replace(/'/g, "''")}'`;
const j = (v) => `${q(JSON.stringify(v))}::jsonb`;
const medio = (url) => `(select id::text from public.medios where url_origen = ${q(url)})`;

const FOTO_JOSEP = "https://i.postimg.cc/Qh3FMz10/Captura-de-pantalla-2026-05-13-161052.png";
const FOTO_HISTORIA = "https://i.imgur.com/ESU7wLA.jpeg"; // «Y el año que viene, ¿qué?»

const bloques = [
  {
    tipo: "sobre-mi",
    datos: {
      antetitulo: "Sobre mí",
      titulo: "Hola, soy Josep",
      texto: "Director de fotografía, filmmaker y editor. Y antes que nada, alguien a quien le encanta contar historias.",
      etiqueta: "+9 años · Alicante",
      cita: "La cámara no hace al cineasta, pero la visión sí.",
      papeles: ["Director de fotografía", "Filmmaker", "Editor", "Operador de cámara", "Gaffer"],
    },
    sql: `jsonb_build_object('imagen', ${medio(FOTO_JOSEP)})`,
  },
  {
    tipo: "texto",
    datos: {
      antetitulo: "Mi historia",
      titulo: "Conectar con la gente a través de las *historias*",
      texto: [
        "Desde hace más de nueve años mi objetivo es el mismo: conectar con la gente a través de las historias.",
        "Empecé por la música y la interpretación, pero fue en el vídeo, y después en el cine, donde encontré la forma de juntar todo lo que me apasiona. Estudié el ciclo superior de Realización en el IES Veles e Vents, donde rodé *El Viajero*, un corto de ciencia ficción hecho con cuatro personas y casi sin presupuesto. En 2024, mi corto *Y el año que viene, ¿qué?* subió al podio del ESCAC Dreammakers Contest de Cupra, con J. A. Bayona en el jurado.",
        "En paralelo, llevo más de nueve años compartiendo mi pasión en YouTube. Empecé en un canal llamado «Del Fan, Para el Fan» y hoy, en mi canal, recreo planos míticos del cine con muy pocos recursos: *Nosferatu*, *El Padrino* o *El Imperio Contraataca*. Es mi forma de demostrar que el cine es ingenio antes que dinero, y de aprender un poco más en cada plano.",
      ].join("\n\n"),
    },
    sql: `jsonb_build_object('imagen', ${medio(FOTO_HISTORIA)})`,
  },
  {
    tipo: "proceso",
    datos: {
      antetitulo: "Cómo trabajo",
      titulo: "Lo que llevo a cada *proyecto*",
      pasos: [
        { titulo: "La historia manda", texto: "Antes de pensar en cámaras o luces, quiero entender qué quieres contar y a quién." },
        { titulo: "El ritmo lo llevo dentro", texto: "Vengo de la música y se nota en el montaje: la imagen baila con la música." },
        { titulo: "Resuelvo", texto: "Si falta presupuesto, sobra ingenio. Una rejilla de estufa puede ser la ventana de Vito Corleone." },
        { titulo: "Equipo", texto: "Cada proyecto es una colaboración. Me gusta sumar y que todo el mundo en el set se sienta parte." },
      ],
    },
  },
  {
    tipo: "cifras",
    datos: {
      antetitulo: "Reconocimientos",
      titulo: "Lo que han conseguido estas *historias*",
      cifras: [
        { valor: 9, prefijo: "+", unidad: "años", texto: "contando historias: primero en YouTube, después en el set" },
        { valor: 1.39, decimales: 2, sufijo: " M", unidad: "visualizaciones", texto: "del EP Oscuridad, de Adrián Muñoz" },
      ],
    },
  },
  {
    tipo: "clientes",
    datos: {
      antetitulo: "Clientes",
      titulo: "Han confiado en mí",
      juno: { texto: "Muchos de mis proyectos nacen mano a mano con JUNO Media. Juntos hemos trabajado para estas marcas." },
    },
  },
  {
    tipo: "llamada",
    datos: {
      titulo: "¿Hablamos de tu próximo *proyecto*?",
      texto: "Si tu próximo proyecto necesita una mirada que conecte con la gente, me encantará escucharte.",
      opciones: ["Videoclip", "Cortometraje", "Spot", "Evento", "Boda", "Redes sociales"],
      nota: "Te respondo personalmente, normalmente en menos de 24 horas.",
    },
  },
];

const sql = ["-- Página «Sobre mí» y sus bloques. Generado con scripts/cargar-sobre-mi.mjs (no editar a mano).", "begin;"];
sql.push(`insert into public.paginas (slug, titulo, seo_titulo, seo_descripcion, estado, publicado_en) values ('sobre-mi', 'Sobre mí',
  'Sobre mí · Josep Mira Lozano',
  'Soy Josep Mira Lozano, director de fotografía, filmmaker y editor. Vengo de la música y llevo más de nueve años contando historias con imágenes.',
  'publicado', now())
on conflict (idioma, slug) do nothing;`);
bloques.forEach((b, i) => {
  const datos = b.sql ? `${j(b.datos)} || ${b.sql}` : j(b.datos);
  sql.push(`insert into public.bloques (pagina_id, orden, tipo, visible, datos)
select p.id, ${i}, '${b.tipo}', true, ${datos}
from public.paginas p
where p.slug = 'sobre-mi' and p.idioma = 'es'
  and not exists (select 1 from public.bloques x where x.pagina_id = p.id and x.tipo = '${b.tipo}');`);
});
sql.push("commit;");
writeFileSync(join(raiz, "supabase/datos/05-sobre-mi.sql"), sql.join("\n\n") + "\n");
console.log(`${sql.length} sentencias -> supabase/datos/05-sobre-mi.sql`);
