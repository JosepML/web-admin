import { FOTO_CONTACTO } from "../contacto/foto";
import { getAjustes } from "./ajustes";
import { getArticulos } from "./articulos";
import { getCanales, getClientes, getOpiniones } from "./confianza";
import { getMedios } from "./medios";
import { getPagina, mediosDeBloques } from "./paginas";
import { getProyectos } from "./proyectos";
import { getServicios } from "./servicios";
import type { DatosWeb, Pagina } from "./tipos";

/**
 * Una página de bloques y todo lo que sus bloques pueden leer (proyectos, servicios, clientes...). Las
 * consultas van en paralelo y cada una sale de la caché, así que es barato. Lo usan Inicio y cualquier
 * página hecha de bloques (Sobre mí, Recreaciones, páginas que cree Josep).
 */
export async function getPaginaConDatos(slug: string): Promise<{ pagina: Pagina; datos: DatosWeb } | null> {
  const [pagina, ajustes, servicios, proyectos, articulos, clientes, opiniones, canales, medios] = await Promise.all([
    getPagina(slug),
    getAjustes(),
    getServicios(),
    getProyectos(),
    getArticulos(),
    getClientes(),
    getOpiniones(),
    getCanales(),
    getMedios(),
  ]);
  if (!pagina) return null;
  // La foto de Contacto no la cita ningún bloque, pero el bloque «Hablemos» la necesita
  const usados = mediosDeBloques(pagina, medios);
  for (const id of [ajustes.fotoContacto, FOTO_CONTACTO]) if (id && medios[id]) usados[id] = medios[id];
  return {
    pagina,
    datos: { ajustes, servicios, proyectos, articulos, clientes, opiniones, canales, medios: usados },
  };
}
