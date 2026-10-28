import type { Metadata } from "next";
import Link from "next/link";
import { Icono } from "@/components/Iconos";
import { exigirAdmin } from "@/lib/admin/sesion";
import { RUTAS, rutaPagina } from "@/lib/rutas";

export const metadata: Metadata = { title: "Resumen" };

const NOMBRE_TABLA: Record<string, string> = {
  paginas: "Página",
  proyectos: "Proyecto",
  articulos: "Artículo",
  servicios: "Servicio",
  clientes: "Cliente",
  opiniones: "Opinión",
  canales: "Canal",
};

/** Dónde se edita cada cosa con cambios sin publicar */
function enlace(tabla: string, fila: { id: string; slug?: string }) {
  if (tabla === "paginas") return fila.slug === "trabajos" || fila.slug === "recreaciones" ? `/admin/paginas/${fila.id}` : `${rutaPagina(fila.slug ?? "")}?editar=1`;
  return `/admin/${tabla}/${fila.id}`;
}

export default async function Resumen() {
  const s = await exigirAdmin({ redirigir: "/admin" });
  const [{ data: borradores }, { data: proyectos }, { data: paginas }, { data: articulos }, { data: servicios }, { data: clientes }, { data: opiniones }, { data: canales }, { count: nuevos }] = await Promise.all([
    s.from("borradores").select("tabla, fila_id, actualizado_en").order("actualizado_en", { ascending: false }),
    s.from("proyectos").select("id, titulo, slug, estado"),
    s.from("paginas").select("id, titulo, slug"),
    s.from("articulos").select("id, titulo, slug"),
    s.from("servicios").select("id, nombre, slug"),
    s.from("clientes").select("id, nombre"),
    s.from("opiniones").select("id, autor"),
    s.from("canales").select("id, nombre"),
    s.from("mensajes").select("id", { count: "exact", head: true }).eq("estado", "nuevo"),
  ]);
  const filas = new Map<string, { id: string; titulo: string; slug?: string }>([
    ...[...(proyectos ?? []), ...(paginas ?? []), ...(articulos ?? [])].map((f) => [f.id, f] as const),
    ...(servicios ?? []).map((f) => [f.id, { ...f, titulo: f.nombre }] as const),
    ...[...(clientes ?? []), ...(canales ?? [])].map((f) => [f.id, { id: f.id, titulo: f.nombre }] as const),
    ...(opiniones ?? []).map((f) => [f.id, { id: f.id, titulo: `Opinión de ${f.autor || "alguien"}` }] as const),
  ]);
  const inicio = (paginas ?? []).find((p) => p.slug === "inicio");
  const publicados = (proyectos ?? []).filter((p) => p.estado === "publicado").length;

  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--jm-acento)]">Panel</p>
      <h1 className="mt-2 text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl">
        Hola, <span className="jm-serif jm-degradado-acento">Josep</span>
      </h1>
      <p className="mt-3 max-w-xl text-[var(--jm-suave)]">Edita las páginas en la propia web con «Editar página», y lo demás desde aquí. Nada cambia en la web hasta que pulsas Publicar.</p>

      {(nuevos ?? 0) > 0 && (
        <Link href="/admin/mensajes" className="cristal mt-8 flex items-center gap-4 rounded-[24px] px-5 py-4 ring-1 ring-[var(--jm-acento)]/40 transition-transform duration-500 hover:-translate-y-0.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--jm-acento)] text-white">
            <Icono nombre="correo" className="h-5 w-5" />
          </span>
          <span className="flex-1 font-semibold">
            {nuevos} mensaje{nuevos === 1 ? "" : "s"} nuevo{nuevos === 1 ? "" : "s"} sin responder
          </span>
          <Icono nombre="flecha" className="h-4 w-4 text-[var(--jm-tenue)]" />
        </Link>
      )}

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Atajo href="/?editar=1" icono="lapiz" titulo="Editar Inicio" texto="Textos, fotos y secciones, en la propia página" />
        {inicio && <Atajo href={`/admin/paginas/${inicio.id}`} icono="asa" titulo="Orden de Inicio" texto="Qué sección va antes y cuál se oculta" />}
        <Atajo href="/admin/proyectos?nuevo=1" icono="mas" titulo="Nuevo proyecto" texto={`${publicados} publicados ahora`} />
        <Atajo href="/admin/articulos?nuevo=1" icono="mas" titulo="Nuevo artículo" texto={`${articulos?.length ?? 0} en el blog`} />
      </div>

      <section className="cristal mt-10 rounded-[32px] p-6 sm:p-8">
        <h2 className="text-lg font-extrabold tracking-tight">Cambios sin publicar</h2>
        {!borradores?.length ? (
          <p className="mt-2 text-sm text-[var(--jm-suave)]">Todo lo que has editado está publicado.</p>
        ) : (
          <ul className="mt-4 flex flex-col divide-y divide-[var(--jm-linea)]">
            {borradores.map((b) => {
              const f = filas.get(b.fila_id);
              const href = f ? enlace(b.tabla, f) : null;
              const contenido = (
                <>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{f?.titulo || "(sin título)"}</span>
                    <span className="text-xs text-[var(--jm-tenue)]">
                      {NOMBRE_TABLA[b.tabla] ?? b.tabla} · guardado {new Date(b.actualizado_en).toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" })}
                    </span>
                  </span>
                  {href && <Icono nombre="flecha" className="h-4 w-4 text-[var(--jm-tenue)]" />}
                </>
              );
              return (
                <li key={`${b.tabla}-${b.fila_id}`}>
                  {href ? (
                    <Link href={href} className="flex items-center gap-3 py-3 transition-colors hover:text-[var(--jm-texto)]">
                      {contenido}
                    </Link>
                  ) : (
                    <div className="flex items-center gap-3 py-3">{contenido}</div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
      <p className="mt-6 text-xs text-[var(--jm-tenue)]">
        Consejo: «Ver con lo no publicado» (en la barra lateral) abre la web entera con todos tus cambios sin publicar, para revisarla antes de publicar. <Link href={RUTAS.inicio} className="underline">Ir a la web</Link>
      </p>
    </div>
  );
}

function Atajo({ href, icono, titulo, texto }: { href: string; icono: string; titulo: string; texto: string }) {
  return (
    <Link href={href} data-foco className="cristal group block rounded-[28px] p-5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--jm-acento)] text-white shadow-[var(--jm-sombra-acento)]">
        <Icono nombre={icono} className="h-5 w-5" />
      </span>
      <span className="mt-4 block font-bold">{titulo}</span>
      <span className="mt-1 block text-sm text-[var(--jm-suave)]">{texto}</span>
    </Link>
  );
}
