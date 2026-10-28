import type { Metadata } from "next";
import { Titular } from "@/components/piezas";
import { EnlaceRecreaciones } from "@/components/trabajos/EnlaceRecreaciones";
import { ListadoTrabajos, type Categoria } from "@/components/trabajos/ListadoTrabajos";
import { getPagina } from "@/lib/datos/paginas";
import { getProyectos } from "@/lib/datos/proyectos";
import { getServicios } from "@/lib/datos/servicios";
import { lista, objeto, texto, textos } from "@/lib/datos/util";

// Datos de la caché en cada visita (ver src/app/(web)/page.tsx)

/** Cabecera: el primer bloque de la página «trabajos» (supabase/datos/06-trabajos.sql) y, si no existe, el bloque Selección de Inicio */
async function cabecera() {
  const [trabajos, inicio] = await Promise.all([getPagina("trabajos"), getPagina("inicio")]);
  const datos = trabajos?.bloques[0]?.datos ?? inicio?.bloques.find((b) => b.tipo === "trabajos")?.datos ?? {};
  return { pagina: trabajos, categorias: categorias(datos.filtros), antetitulo: texto(datos.antetitulo) || "Trabajos", titulo: texto(datos.titulo) || "Trabajos", texto: texto(datos.texto) };
}

/** Categorías de cada servicio (`filtros`), leídas con cuidado: las que no tienen nombre o tipos se descartan */
function categorias(v: unknown): Record<string, Categoria[]> {
  return Object.fromEntries(
    Object.entries(objeto(v)).map(([servicio, l]) => [
      servicio,
      lista(l).flatMap((c) => {
        const nombre = texto(objeto(c).nombre);
        const tipos = textos(objeto(c).tipos);
        return nombre && tipos.length ? [{ nombre, tipos }] : [];
      }),
    ]),
  );
}

/** Ids de las imágenes que usan las comparaciones de /recreaciones */
function mediosDeComparaciones(v: unknown) {
  return new Set(Object.values(objeto(v)).flatMap((c) => [objeto(objeto(c).original).medio, objeto(objeto(c).recreacion).medio].map(texto)));
}

export async function generateMetadata(): Promise<Metadata> {
  const { pagina, titulo } = await cabecera();
  return { title: pagina?.seo.titulo ? { absolute: pagina.seo.titulo } : "Trabajos", description: pagina?.seo.descripcion || titulo.replace(/\*/g, "") };
}

export default async function Trabajos() {
  const [c, proyectos, servicios, recreaciones] = await Promise.all([cabecera(), getProyectos(), getServicios(), getPagina("recreaciones")]);
  return (
    <main className="px-4 pb-20 pt-24 sm:px-8 sm:pb-24 sm:pt-40">
      <div className="mx-auto max-w-7xl">
        <Titular nivel={1} antetitulo={c.antetitulo} titulo={c.titulo} texto={c.texto} />
        <ListadoTrabajos proyectos={proyectos} servicios={servicios} categorias={c.categorias} />
        {recreaciones && (
          <EnlaceRecreaciones
            titulo={recreaciones.titulo}
            texto={recreaciones.seo.descripcion}
            recreaciones={proyectos.filter((p) => p.tipo?.slug === "recreacion")}
            evitar={mediosDeComparaciones(recreaciones.bloques[0]?.datos.comparaciones)}
          />
        )}
      </div>
    </main>
  );
}
