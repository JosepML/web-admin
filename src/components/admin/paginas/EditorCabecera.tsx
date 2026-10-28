"use client";

// Cabecera y Google de las páginas con plantilla propia (Trabajos y Recreaciones). No se editan en su sitio: su
// contenido sale de los proyectos, y lo único propio de la página es su primer bloque (la cabecera y algunos
// rótulos) y sus datos para Google. Escribe en el borrador de la página, como «Editar página».

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Campos } from "@/components/admin/campos/Campos";
import type { Campo } from "@/components/admin/campos/tipos";
import { useDialogos } from "@/components/admin/Dialogos";
import { textoGuardado, useAutoguardado } from "@/components/admin/useAutoguardado";
import { Icono } from "@/components/Iconos";
import { descartar, publicar, type ParaEditar } from "@/lib/admin/contenido";

type BloqueEditable = { id: string; tipo: string; visible: boolean; datos: Record<string, unknown> };
type Datos = Record<string, unknown>;

const json = (x: unknown) => JSON.stringify(x);

const CABECERA: Campo[] = [
  { tipo: "texto", clave: "antetitulo", etiqueta: "Antetítulo", ayuda: "La etiqueta pequeña encima del título" },
  { tipo: "texto", clave: "titulo", etiqueta: "Título", ayuda: "La última palabra sale en la letra artística. Para elegir otra, márcala con *asteriscos*." },
  { tipo: "largo", clave: "texto", etiqueta: "Texto", filas: 4 },
];

/** Rótulos propios de cada plantilla, además de la cabecera */
const EXTRA: Record<string, Campo[]> = {
  recreaciones: [
    { tipo: "texto", clave: "etiquetaAntes", etiqueta: "Rótulo del original", medio: true, placeholder: "Original" },
    { tipo: "texto", clave: "etiquetaDespues", etiqueta: "Rótulo de mi versión", medio: true, placeholder: "Mi recreación" },
    { tipo: "texto", clave: "llamada", etiqueta: "Título de la invitación final", placeholder: "¿Y si lo próximo que creamos es tu historia?" },
  ],
};

const GOOGLE: Campo[] = [
  { tipo: "texto", clave: "titulo", etiqueta: "Nombre de la página", ayuda: "El que sale en la pestaña del navegador si no hay título para Google" },
  { tipo: "texto", clave: "seo_titulo", etiqueta: "Título en Google", ayuda: "Unos 60 caracteres" },
  { tipo: "largo", clave: "seo_descripcion", etiqueta: "Descripción en Google", filas: 3, ayuda: "Unos 155 caracteres: qué va a encontrar quien entre" },
];

const CLAVES_PAGINA = ["titulo", "seo_titulo", "seo_descripcion"] as const;

export function EditorCabecera({ id, slug, ruta, inicial }: { id: string; slug: string; ruta: string; inicial: ParaEditar }) {
  const router = useRouter();
  const { confirmar, avisar } = useDialogos();
  const filaPublicada = useMemo(() => Object.fromEntries(CLAVES_PAGINA.map((k) => [k, String(inicial.fila[k] ?? "")])), [inicial.fila]);
  const [publicados, setPublicados] = useState(() => ({ bloques: (inicial.extras.bloques as BloqueEditable[]) ?? [], pagina: filaPublicada }));
  const [bloques, setBloques] = useState<BloqueEditable[]>(() => (inicial.borrador?.bloques as BloqueEditable[] | undefined) ?? publicados.bloques);
  const [pagina, setPagina] = useState<Datos>(() => ({ ...filaPublicada, ...Object.fromEntries(CLAVES_PAGINA.filter((k) => inicial.borrador && k in inicial.borrador).map((k) => [k, inicial.borrador![k]])) }));
  const [publicando, setPublicando] = useState(false);
  const [cambiosIniciales, setCambiosIniciales] = useState<Record<string, unknown>>(() => inicial.borrador ?? {});

  const cambios = useMemo(() => {
    const c: Record<string, unknown> = {};
    if (json(bloques) !== json(publicados.bloques)) c.bloques = bloques;
    for (const k of CLAVES_PAGINA) if (pagina[k] !== publicados.pagina[k]) c[k] = pagina[k];
    return c;
  }, [bloques, pagina, publicados]);
  const guardado = useAutoguardado("paginas", id, cambios, cambiosIniciales);
  const hayCambios = Object.keys(cambios).length > 0;

  // La cabecera es el primer bloque de la página
  const cabecera = bloques[0]?.datos ?? {};
  const cambiarCabecera = (clave: string, valor: unknown) =>
    setBloques((l) => (l.length ? [{ ...l[0], datos: { ...l[0].datos, [clave]: valor } }, ...l.slice(1)] : [{ id: crypto.randomUUID(), tipo: "texto", visible: true, datos: { [clave]: valor } }]));

  const alPublicar = async () => {
    setPublicando(true);
    if (await guardado.guardarYa()) {
      const r = await publicar("paginas", id);
      if (r.ok) {
        avisar("Publicado. Ya se ve en la web.");
        setPublicados({ bloques, pagina: { ...publicados.pagina, ...Object.fromEntries(CLAVES_PAGINA.map((k) => [k, String(pagina[k] ?? "")])) } });
        setCambiosIniciales({});
        router.refresh();
      } else avisar(r.error, "error");
    }
    setPublicando(false);
  };

  const alDescartar = async () => {
    if (!(await confirmar({ titulo: "¿Descartar los cambios?", texto: "La página vuelve a ser la que se ve en la web.", aceptar: "Descartar", peligro: true }))) return;
    await guardado.guardarYa();
    const r = await descartar("paginas", id);
    if (!r.ok) return avisar(r.error, "error");
    setBloques(publicados.bloques);
    setPagina(publicados.pagina);
    setCambiosIniciales({});
    avisar("Cambios descartados");
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="sticky top-16 z-30 -mx-2 mb-6 lg:top-4">
        <div className="cristal cristal-fuerte flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[28px] px-5 py-3.5">
          <Link href="/admin/paginas" className="boton-icono -ml-2" aria-label="Volver a Páginas" title="Volver a Páginas">
            <Icono nombre="izquierda" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-extrabold tracking-tight sm:text-xl">{String(publicados.pagina.titulo || slug)}</h1>
            <p className={`text-xs ${guardado.estado === "error" ? "text-[#ff6b6b]" : "text-[var(--jm-tenue)]"}`} aria-live="polite">
              {textoGuardado(guardado.estado, hayCambios, guardado.error)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <a href={`/admin/vista-previa?ruta=${encodeURIComponent(ruta)}`} target="_blank" rel="noreferrer" className="boton boton-suave px-4 py-2 text-sm" title="Abre la página con tus cambios sin publicar">
              <Icono nombre="ojo" className="h-4 w-4" />
              Vista previa
            </a>
            {hayCambios && (
              <button type="button" onClick={alDescartar} className="boton px-4 py-2 text-sm text-[var(--jm-suave)] hover:bg-[var(--jm-cristal)]">
                Descartar
              </button>
            )}
            <button type="button" onClick={alPublicar} disabled={publicando || !hayCambios} className="boton boton-acento px-5 py-2 text-sm disabled:opacity-40">
              {publicando ? "Publicando…" : "Publicar cambios"}
            </button>
          </div>
        </div>
      </div>

      <p className="max-w-xl text-[var(--jm-suave)]">Esta página se monta sola con tus proyectos. Aquí cambias lo que es suyo: la cabecera de arriba y cómo sale en Google.</p>

      <section className="cristal mt-6 rounded-[32px] p-5 sm:p-8">
        <h2 className="text-lg font-extrabold tracking-tight">Cabecera</h2>
        <div className="mt-6">
          <Campos campos={[...CABECERA, ...(EXTRA[slug] ?? [])]} datos={cabecera} cambiar={cambiarCabecera} />
        </div>
      </section>

      <section className="cristal mt-4 rounded-[32px] p-5 sm:p-8">
        <h2 className="text-lg font-extrabold tracking-tight">Google</h2>
        <div className="mt-6">
          <Campos campos={GOOGLE} datos={pagina} cambiar={(clave, valor) => setPagina((p) => ({ ...p, [clave]: valor }))} />
        </div>
      </section>
    </div>
  );
}
