import type { Metadata } from "next";
import Link from "next/link";
import { Icono } from "@/components/Iconos";
import { exigirAdmin } from "@/lib/admin/sesion";
import { rutaPagina } from "@/lib/rutas";

export const metadata: Metadata = { title: "Páginas" };

/** Páginas con plantilla propia: su contenido sale de los proyectos y solo se edita su cabecera */
const CON_PLANTILLA = new Set(["trabajos", "recreaciones"]);
/** Orden de los grupos de la lista */
const PRINCIPALES = ["inicio", "sobre-mi", "trabajos", "recreaciones", "juno-media"];

type FilaPagina = { id: string; titulo: string; slug: string; estado: string };

export default async function Paginas() {
  const s = await exigirAdmin({ redirigir: "/admin/paginas" });
  const [{ data: paginas }, { data: borradores }, { data: tarjetas }] = await Promise.all([
    s.from("paginas").select("id, titulo, slug, estado").order("creado_en"),
    s.from("borradores").select("fila_id").eq("tabla", "paginas"),
    s.from("bloques").select("datos").eq("tipo", "filmmaker"),
  ]);
  // Las especialidades, en el orden de sus tarjetas en Inicio
  const ordenTarjetas = (tarjetas ?? []).flatMap((b) => {
    const piezas = (b.datos as { piezas?: { href?: string }[] }).piezas;
    return Array.isArray(piezas) ? piezas.map((x) => x?.href ?? "") : [];
  });
  const posicion = (slug: string) => {
    const i = ordenTarjetas.indexOf(rutaPagina(slug));
    return i < 0 ? 999 : i;
  };
  const conCambios = new Set((borradores ?? []).map((b) => b.fila_id));
  const todas = (paginas ?? []) as FilaPagina[];
  const principales = PRINCIPALES.flatMap((slug) => todas.filter((p) => p.slug === slug));
  const especialidades = todas.filter((p) => p.slug.startsWith("filmmaker-")).sort((a, b) => posicion(a.slug) - posicion(b.slug));
  const otras = todas.filter((p) => !principales.includes(p) && !especialidades.includes(p));

  const fila = (p: FilaPagina) => {
    const ruta = rutaPagina(p.slug);
    const plantilla = CON_PLANTILLA.has(p.slug);
    return (
      <li key={p.id} className="cristal flex flex-wrap items-center gap-x-4 gap-y-3 rounded-[24px] px-5 py-4">
        <Icono nombre="pagina" className="h-5 w-5 shrink-0 text-[var(--jm-suave)]" />
        <span className="min-w-0 flex-1">
          <span className="block font-semibold">{p.titulo || p.slug}</span>
          <span className="text-xs text-[var(--jm-tenue)]">
            {ruta}
            {p.estado !== "publicado" && <span className="ml-2 text-[#ffb340]">· oculta</span>}
            {conCambios.has(p.id) && <span className="ml-2 text-[var(--jm-calido)]">· cambios sin publicar</span>}
          </span>
        </span>
        <span className="flex flex-wrap justify-end gap-1.5">
          {plantilla ? (
            <Link href={`/admin/paginas/${p.id}`} className="boton boton-acento px-4 py-2 text-sm">
              <Icono nombre="lapiz" className="h-4 w-4" />
              Editar cabecera
            </Link>
          ) : (
            <>
              <Link href={`/admin/paginas/${p.id}`} className="boton boton-acento px-4 py-2 text-sm" title="Textos, fotos, proyectos que salen y orden de las secciones">
                <Icono nombre="lapiz" className="h-4 w-4" />
                Editar contenido
              </Link>
              <Link href={`${ruta}?editar=1`} className="boton boton-suave px-4 py-2 text-sm">
                Editar en la web
              </Link>
            </>
          )}
        </span>
      </li>
    );
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-4xl font-extrabold tracking-[-0.04em]">Páginas</h1>
      <p className="mt-2 max-w-xl text-[var(--jm-suave)]">
        «Editar contenido» abre las secciones de la página: con el lápiz de cada una cambias sus textos, fotos y qué proyectos salen y en qué orden, y con las flechas el orden de las secciones. «Editar en la web» te deja cambiar los textos haciendo clic encima. Trabajos y Recreaciones se montan solas con tus proyectos: de ellas se edita la cabecera.
      </p>
      <ul className="mt-8 flex flex-col gap-2">{principales.map(fila)}</ul>
      {especialidades.length > 0 && (
        <>
          <h2 className="mt-12 text-xl font-extrabold tracking-tight">Especialidades de filmmaker</h2>
          <p className="mt-1 max-w-xl text-sm text-[var(--jm-suave)]">
            Una página por tipo de encargo, con cómo lo trabajas y todos sus proyectos. Las tarjetas de «Lo que puedo grabar para ti», en Inicio, llevan a ellas.
          </p>
          <ul className="mt-4 flex flex-col gap-2">{especialidades.map(fila)}</ul>
        </>
      )}
      {otras.length > 0 && (
        <>
          <h2 className="mt-12 text-xl font-extrabold tracking-tight">Otras páginas</h2>
          <ul className="mt-4 flex flex-col gap-2">{otras.map(fila)}</ul>
        </>
      )}
    </div>
  );
}
