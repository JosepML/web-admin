"use client";

import { startTransition, useEffect, useState } from "react";
import { imagenesDe } from "@/lib/datos/seleccion";
import type { Bloque, DatosWeb, TipoBloque } from "@/lib/datos/tipos";
import { img } from "../comun/imagen";
import { ProveedorBloque, useEdicion, ZonaEdicion } from "../edicion/contexto";
import { ProveedorDatos, useDatos } from "../marco/DatosWeb";
import { IndiceLateral } from "../marco/IndiceLateral";
import { BloquePortada } from "./BloquePortada";
import { BloqueFilmmaker, BloqueServicios } from "./BloqueServicios";
import { BloqueTrabajos } from "./BloqueTrabajos";
import { BloqueColaboracion } from "./BloqueColaboracion";
import { BloqueCifras, BloqueClientes, BloqueOpiniones } from "./BloquesConfianza";
import { BloqueCita, BloqueGaleria, BloqueVideo } from "./BloquesLibres";
import { BloqueBlog, BloqueLlamada, BloqueProceso, BloqueSobreMi, BloqueTexto } from "./BloquesPersonales";

type PropsBloque = { bloque: Bloque; ancla?: string };

/** Cada tipo de bloque de la base de datos tiene su componente. Un tipo nuevo = un componente nuevo aquí. */
const COMPONENTES: Record<TipoBloque, (p: PropsBloque) => React.ReactNode> = {
  portada: BloquePortada,
  servicios: BloqueServicios,
  filmmaker: BloqueFilmmaker,
  trabajos: BloqueTrabajos,
  cifras: BloqueCifras,
  proceso: BloqueProceso,
  "sobre-mi": BloqueSobreMi,
  opiniones: BloqueOpiniones,
  clientes: BloqueClientes,
  blog: BloqueBlog,
  texto: BloqueTexto,
  llamada: BloqueLlamada,
  galeria: BloqueGaleria,
  video: BloqueVideo,
  cita: BloqueCita,
  colaboracion: BloqueColaboracion,
};

/** Anclas a las que apuntan el menú y los botones (/#trabajos...): las lleva el primer bloque de cada tipo */
const ANCLAS: Partial<Record<TipoBloque, string>> = {
  servicios: "servicios",
  trabajos: "trabajos",
  "sobre-mi": "sobre-mi",
  blog: "blog",
  llamada: "llamada",
};

/**
 * Una página hecha de bloques (Inicio y las páginas que cree Josep). Recibe de la página de servidor los
 * bloques y los datos que leen, y pinta cada bloque con su componente, con el índice lateral.
 * Con `pagina`, Josep puede editarla en su sitio (modo «Editar página», src/components/edicion/).
 */
export function PaginaBloques({ bloques, datos, pagina }: { bloques: Bloque[]; datos: DatosWeb; pagina?: { id: string; slug: string; titulo: string } }) {
  return (
    <ProveedorDatos datos={datos}>
      <ZonaEdicion pagina={pagina} publicados={bloques}>
        {(lista) => <Bloques bloques={lista.filter((b) => b.tipo in COMPONENTES)} />}
      </ZonaEdicion>
    </ProveedorDatos>
  );
}

/**
 * Con la página ya cargada y el navegador libre, descarga y decodifica en segundo plano las fotos que aún
 * no están en pantalla. Así, al llegar a cada sección, la imagen ya está lista y no cae un fotograma largo
 * justo en mitad del deslizamiento.
 */
function usePrecargaImagenes() {
  const { servicios, proyectos } = useDatos();
  useEffect(() => {


    const id = window.setTimeout(() => {
      const urls = new Set<string>();
      for (const s of servicios) imagenesDe(s, proyectos, 1).forEach((u) => urls.add(img(u, 1200)));
      for (const p of proyectos) {
        if (p.destacadoOrden !== null && p.poster) urls.add(img(p.poster.url, 256));

      }

      for (const u of urls) {
        const i = new Image();
        i.decoding = "async";
        i.src = u;
        i.decode().catch(() => {});
      }
    }, 2500);
    return () => window.clearTimeout(id);
  }, [servicios, proyectos]);


}

// La primera carga se hidrata entera (tiene que coincidir con el HTML del servidor). Las siguientes
// veces que se monta la página en el navegador (al volver desde una ficha) montar todo de golpe
// congelaba la pantalla unos 240 ms: entonces se montan primero las dos primeras secciones y el resto
// en segundo plano, con huecos de la misma altura mientras tanto.
let yaMontada = false;
const INMEDIATAS = 2;

function useMontajeEscalonado() {
  const [todo, setTodo] = useState(() => !yaMontada);
  useEffect(() => {
    yaMontada = true;
    if (todo) return;
    const ocioso = window.requestIdleCallback ?? ((f: () => void) => window.setTimeout(f, 120));

    const cancelar = window.cancelIdleCallback ?? window.clearTimeout;
    const id = ocioso(() => startTransition(() => setTodo(true)), { timeout: 400 } as IdleRequestOptions);
    return () => cancelar(id as number);

  }, [todo]);
  return todo;
}

function Bloques({ bloques }: { bloques: (Bloque & { oculto?: boolean })[] }) {
  usePrecargaImagenes();
  const todo = useMontajeEscalonado();
  const edicion = useEdicion();
  const vistos = new Set<TipoBloque>();

  return (
    <main>
      {bloques.map((b, i) => {
        const Componente = COMPONENTES[b.tipo];
        const ancla = vistos.has(b.tipo) ? undefined : ANCLAS[b.tipo];
        vistos.add(b.tipo);
        if (!todo && i >= INMEDIATAS) return <div key={b.id} id={`bloque-${b.id}`} data-bloque={b.tipo} className="min-h-svh" aria-hidden />;
        return (
          <div
            key={b.id}
            id={`bloque-${b.id}`}
            data-bloque={b.tipo}
            // En escritorio cada sección ocupa al menos la pantalla entera con el contenido centrado: el scroll
            // mágico la deja encuadrada y no asoman las vecinas (la portada ya mide una pantalla; el proceso es más alto)
            className={`relative ${b.tipo !== "portada" && b.tipo !== "proceso" ? "lg:flex lg:min-h-svh lg:flex-col lg:justify-center" : ""} ${
              edicion ? "jm-seccion-editada group/seccion" : ""
            }`}
          >
            {edicion ? (
              <ProveedorBloque value={b.id}>
                <div className={b.oculto ? "jm-seccion-oculta" : undefined}>
                  <Componente bloque={b} ancla={ancla} />
                </div>
                <edicion.Herramientas bloque={{ id: b.id, tipo: b.tipo, visible: !b.oculto, datos: b.datos }} indice={i} total={bloques.length} />
              </ProveedorBloque>
            ) : (
              <Componente bloque={b} ancla={ancla} />
            )}
          </div>
        );
      })}
      <IndiceLateral bloques={edicion ? bloques.filter((b) => !b.oculto) : bloques} />
    </main>
  );
}
