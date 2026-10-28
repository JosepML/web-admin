import type { Metadata } from "next";
import { TarjetaArticulo } from "@/components/blog/TarjetaArticulo";
import { Revelar, Titular } from "@/components/piezas";
import { getArticulos } from "@/lib/datos/articulos";
import { getPagina } from "@/lib/datos/paginas";
import { texto } from "@/lib/datos/util";

// Datos de la caché en cada visita (ver src/app/(web)/page.tsx)

/** Cabecera del blog: el bloque de texto de la página «blog» y, si no existe, el bloque Blog de Inicio */
async function cabecera() {
  const [blog, inicio] = await Promise.all([getPagina("blog"), getPagina("inicio")]);
  const datos = blog?.bloques[0]?.datos ?? inicio?.bloques.find((b) => b.tipo === "blog")?.datos ?? {};
  return { pagina: blog, antetitulo: texto(datos.antetitulo) || "Blog", titulo: texto(datos.titulo) || "Blog", texto: texto(datos.texto) };
}

export async function generateMetadata(): Promise<Metadata> {
  const { pagina, titulo } = await cabecera();
  return { title: pagina?.seo.titulo ? { absolute: pagina.seo.titulo } : "Blog", description: pagina?.seo.descripcion || titulo.replace(/\*/g, "") };
}

export default async function Blog() {
  const [c, articulos] = await Promise.all([cabecera(), getArticulos()]);
  return (
    <main className="px-4 pb-24 pt-32 sm:px-8 sm:pt-40">
      <div className="mx-auto max-w-7xl">
        <Titular nivel={1} antetitulo={c.antetitulo} titulo={c.titulo} texto={c.texto} />
        <div className={`mt-12 grid gap-3 ${articulos.length < 3 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
          {articulos.map((a, i) => (
            <Revelar key={a.slug} retraso={i * 0.08}>
              <TarjetaArticulo articulo={a} />
            </Revelar>
          ))}
        </div>
      </div>
    </main>
  );
}
