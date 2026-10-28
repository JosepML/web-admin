import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ContenidoArticulo } from "@/components/blog/ContenidoArticulo";
import { TarjetaArticulo } from "@/components/blog/TarjetaArticulo";
import { enfoque, img } from "@/components/comun/imagen";
import { Icono } from "@/components/Iconos";
import { Revelar, TituloConAcento } from "@/components/piezas";
import { JsonLdArticulo } from "@/components/seo/JsonLd";
import { getArticulos } from "@/lib/datos/articulos";
import { getMedios } from "@/lib/datos/medios";
import { getPagina } from "@/lib/datos/paginas";
import { fechaCorta } from "@/lib/datos/seleccion";
import { RUTAS } from "@/lib/rutas";
import { sinAcento } from "@/lib/seo/url";
import { texto } from "@/lib/datos/util";

// Artículo de la web antigua que Josep retiró: redirige al índice del blog para no dar 404
const ARTICULOS_RETIRADOS = new Set(["dslr-vs-cine-la-camara-no-hace-al-cineasta"]);

export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const articulos = await getArticulos();
  const slugs = new Set<string>();
  for (const a of articulos) {
    if (a.slug) slugs.add(a.slug);
    if (a.idAntiguo) slugs.add(a.idAntiguo);
  }
  for (const r of ARTICULOS_RETIRADOS) {
    slugs.add(r);
  }
  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const articulos = await getArticulos();
  const a = articulos.find((x) => x.slug === slug) ?? articulos.find((x) => x.idAntiguo === slug);
  if (!a) return {};
  return {
    title: a.seo.titulo ? { absolute: a.seo.titulo } : sinAcento(a.titulo),
    description: sinAcento(a.seo.descripcion || a.extracto),
    openGraph: a.imagen ? { type: "article", publishedTime: a.fecha, images: [a.imagen.url] } : { type: "article", publishedTime: a.fecha },
  };
}

export default async function Articulo({ params }: Props) {
  const { slug } = await params;
  if (ARTICULOS_RETIRADOS.has(slug)) permanentRedirect(RUTAS.blog);

  const [articulos, medios, inicio] = await Promise.all([getArticulos(), getMedios(), getPagina("inicio")]);
  const a = articulos.find((x) => x.slug === slug);
  if (!a) {
    const porIdAntiguo = articulos.find((x) => x.idAntiguo === slug);
    if (porIdAntiguo) permanentRedirect(RUTAS.articulo(porIdAntiguo.slug));
    notFound();
  }
  // La invitación final repite el título de la llamada de Inicio, para que se edite en un solo sitio
  const llamada = texto(inicio?.bloques.find((b) => b.tipo === "llamada")?.datos.titulo) || "¿Tienes una historia que contar?";
  const otros = articulos.filter((x) => x.slug !== slug).slice(0, 3);

  return (
    <main className="px-4 pb-24 pt-32 sm:px-8 sm:pt-40">
      <JsonLdArticulo articulo={a} />
      <article>
        <header className="mx-auto max-w-3xl">
          <Revelar>
            <Link href={RUTAS.blog} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--jm-suave)] transition-colors hover:text-[var(--jm-texto)]">
              <Icono nombre="flecha" className="h-4 w-4 rotate-180" />
              Blog
            </Link>
          </Revelar>
          <Revelar retraso={0.06}>
            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-[var(--jm-tenue)]">
              {a.categoria && <span className="cristal rounded-full px-3 py-1 text-[11px] font-semibold text-[var(--jm-suave)]">{a.categoria.nombre}</span>}
              <time dateTime={a.fecha}>{fechaCorta(a.fecha)}</time>
            </div>
          </Revelar>
          <Revelar retraso={0.12}>
            <h1 className="mt-5 text-[clamp(2.2rem,5vw,4rem)] font-extrabold leading-[1.05] tracking-[-0.04em] [text-wrap:balance]">
              <TituloConAcento texto={a.titulo} />
            </h1>
          </Revelar>
          {a.extracto && (
            <Revelar retraso={0.18}>
              <p className="mt-6 text-xl leading-relaxed text-[var(--jm-suave)] [text-wrap:pretty]">{a.extracto}</p>
            </Revelar>
          )}
        </header>

        {a.imagen && (
          <Revelar retraso={0.24} className="mx-auto mt-12 max-w-5xl">
            <img src={img(a.imagen.url, 2048)} alt={a.imagen.alt} style={enfoque(a.imagen)} className="aspect-[16/9] w-full rounded-[36px] object-cover" />
          </Revelar>
        )}

        {/* Ancho de lectura: unos 70 caracteres por línea */}
        <div className="mx-auto mt-14 max-w-[680px]">
          <ContenidoArticulo contenido={a.contenido} medios={medios} />
        </div>
      </article>

      <div className="mx-auto mt-20 max-w-[680px]">
        <div className="cristal flex flex-col items-start gap-5 rounded-[32px] p-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-lg font-bold tracking-[-0.02em]">{llamada.replace(/\*/g, "")}</p>
          <Link href={RUTAS.contacto} className="boton boton-acento px-6 py-3 text-sm">
            Hablemos
            <Icono nombre="flecha" className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {otros.length > 0 && (
        <section className="mx-auto mt-24 max-w-7xl">
          <h2 className="text-2xl font-extrabold tracking-[-0.03em]">Más artículos</h2>
          <div className={`mt-8 grid gap-3 ${otros.length < 3 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
            {otros.map((x, i) => (
              <Revelar key={x.slug} retraso={i * 0.08}>
                <TarjetaArticulo articulo={x} />
              </Revelar>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
