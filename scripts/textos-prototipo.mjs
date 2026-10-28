// Regenera src/app/prototipos/d/textos.ts a partir de plan/contenido/proyectos/*.md.
// Uso: node scripts/textos-prototipo.mjs
// Solo se publican Tarjeta, El proyecto, Decisiones clave, El reto y Resultado ("Para revisar" no). Cuando exista la base de datos, esto sobra (tarea S4).
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DIR = "plan/contenido/proyectos";
const SALIDA = "src/app/prototipos/d/textos.ts";

// Cada ficha: tarjeta (descripción corta), proyecto (párrafos), decisiones clave (título + texto),
// reto y resultado (lista de hechos). La conclusión con doble tipografía es la `frase` de datos.ts.
const SECCIONES = { "El proyecto": "proyecto", "Decisiones clave": "decisiones", "El reto": "reto", "Resultado": "resultado" };
const textos = {};
for (const archivo of readdirSync(DIR).filter((f) => f.endsWith(".md") && f !== "README.md").sort()) {
  const md = readFileSync(join(DIR, archivo), "utf8").replace(/\r\n/g, "\n");
  const slug = md.match(/^slug:\s*(.+)$/m)[1].trim();
  const cuerpo = md.slice(md.indexOf("\n---\n", 4) + 5);
  const p = { tarjeta: "", proyecto: [], decisiones: [], reto: "", resultado: [] };
  for (const trozo of cuerpo.split(/^## /m).slice(1)) {
    const [titulo, ...resto] = trozo.split("\n");
    const lineas = resto.map((l) => l.trim()).filter(Boolean);
    const items = lineas.filter((l) => l.startsWith("- ")).map((l) => l.slice(2));
    const parrafos = resto.join("\n").trim().split(/\n\s*\n/).map((x) => x.replace(/\s*\n\s*/g, " ").trim()).filter(Boolean);
    const campo = titulo.trim() === "Tarjeta" ? "tarjeta" : SECCIONES[titulo.trim()];
    if (!campo) continue;
    if (campo === "tarjeta" || campo === "reto") p[campo] = parrafos.join(" ");
    else if (campo === "proyecto") p.proyecto = parrafos;
    else if (campo === "resultado") p.resultado = items.length ? items : parrafos;
    else
      p.decisiones = items.map((li) => {
        const m = li.match(/^\*\*(.+?)\*\*\s*(.*)$/);
        return m ? { titulo: m[1].replace(/[.:]$/, ""), texto: m[2] } : { titulo: "", texto: li };
      });
  }
  textos[slug] = p;
}

writeFileSync(
  SALIDA,
  `// Textos de los proyectos para la ficha del prototipo. Generado con scripts/textos-prototipo.mjs a partir de
// plan/contenido/proyectos/*.md (no editar a mano). Cuando exista la base de datos, esto sale de la tabla \`proyectos\`.
export type TextosProyecto = {
  tarjeta: string;
  proyecto: string[];
  decisiones: { titulo: string; texto: string }[];
  reto: string;
  resultado: string[];
};

export const TEXTOS: Record<string, TextosProyecto> = ${JSON.stringify(textos, null, 2)};
`,
);
console.log(`${Object.keys(textos).length} proyectos -> ${SALIDA}`);
