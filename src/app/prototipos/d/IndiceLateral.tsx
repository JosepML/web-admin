"use client";

import { useEffect, useState } from "react";
import { useReducir } from "../_comun/hooks";
import type { Bloque, TipoBloque } from "./datos";
import { deslizarA, encuadre } from "./scrollMagico";

const NOMBRES: Record<TipoBloque, string> = {
  portada: "Inicio",
  servicios: "Lo que hago",
  filmmaker: "Lo que grabo",
  trabajos: "Selección",
  "sobre-mi": "Quién soy",
  cifras: "En números",
  proceso: "Cómo trabajo",
  opiniones: "Opiniones",
  clientes: "Clientes",
  blog: "Blog",
  texto: "Sección",
  llamada: "Hablemos",
};

/**
 * Índice lateral de la portada, minimalista: una marca fina por sección, la actual más larga y en rojo;
 * al pasar el ratón aparece su nombre; al pulsar se va a ella con la misma curva del scroll mágico.
 * Solo en escritorio (en pantallas de menos de 1440 px las secciones dejan sitio a la izquierda, ver PortadaD). La sección actual es la que ocupa el centro de la pantalla.
 * Al llegar a la última sección se despliega solo, con los nombres de todas, como invitación a volver
 * a cualquiera; al subir se repliega.
 */
export function IndiceLateral({ bloques }: { bloques: Bloque[] }) {
  const reducir = useReducir();
  const [actual, setActual] = useState(bloques[0]?.id);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) if (e.isIntersecting) setActual(e.target.id.replace("bloque-", ""));
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    for (const b of bloques) {
      const el = document.getElementById(`bloque-${b.id}`);
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
  }, [bloques]);

  // También al tocar el final de la página (por si la última sección es corta y nunca llega al centro)
  const [alFinal, setAlFinal] = useState(false);
  useEffect(() => {
    const medir = () => setAlFinal(window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60);
    medir();
    window.addEventListener("scroll", medir, { passive: true });
    return () => window.removeEventListener("scroll", medir);
  }, []);

  // En la portada (que ocupa todo el ancho) el índice taparía el titular: aparece al salir de ella
  const enPortada = bloques[0]?.tipo === "portada" && actual === bloques[0].id;
  const desplegado = bloques.length > 1 && (alFinal || actual === bloques[bloques.length - 1].id);

  return (
    <nav
      aria-label="Secciones"
      aria-hidden={enPortada}
      className={`cristal cristal-fuerte fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-0.5 px-2 py-3 transition-[opacity,translate,border-radius,padding] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:flex ${
        enPortada ? "pointer-events-none -translate-x-3 opacity-0" : "opacity-100"
      } ${desplegado ? "rounded-[26px] pr-5" : "rounded-[22px]"}`}
    >
      {/* Desplegado: un titular breve encima de la lista */}
      <Plegable abierto={desplegado}>
        <p className="whitespace-nowrap px-1.5 pb-2 pt-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--d-tenue)]">
          ¿Quieres volver a algo?
        </p>
      </Plegable>
      {bloques.map((b, i) => {
        const activa = actual === b.id;
        const nombre = b.tipo === "texto" ? b.datos.antetitulo || b.datos.titulo : NOMBRES[b.tipo];
        return (
          <button
            key={b.id}
            type="button"
            aria-label={nombre}
            aria-current={activa ? "true" : undefined}
            onClick={() => {
              const el = document.getElementById(`bloque-${b.id}`);
              if (el) deslizarA(encuadre(el), reducir);
            }}
            className={`group relative flex items-center transition-[height] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${desplegado ? "h-7" : "h-5"}`}
          >
            <span className="flex w-6 shrink-0 items-center justify-center">
              <span
                className={`h-[2px] rounded-full transition-[width,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  activa ? "w-5 bg-[var(--d-acento)]" : "w-2.5 bg-[var(--d-tenue)] group-hover:w-4 group-hover:bg-[var(--d-texto)]"
                }`}
              />
            </span>
            {/* Desplegado: el nombre al lado de su marca, entrando en cascada */}
            <span
              className="grid transition-[grid-template-columns] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ gridTemplateColumns: desplegado ? "1fr" : "0fr" }}
            >
              <span className="overflow-hidden">
                <span
                  className={`block whitespace-nowrap pl-2 text-left text-[13px] transition-[opacity,transform,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    activa ? "font-semibold text-[var(--d-texto)]" : "font-medium text-[var(--d-suave)] group-hover:text-[var(--d-texto)]"
                  } ${desplegado ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`}
                  style={{ transitionDelay: desplegado ? `${120 + i * 35}ms` : "0ms" }}
                >
                  {nombre}
                </span>
              </span>
            </span>
            {/* Plegado: nombre de la sección al pasar el ratón */}
            {!desplegado && (
              <span className="cristal cristal-fuerte pointer-events-none absolute left-9 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold opacity-0 transition-[opacity,transform] duration-300 [transform:translateX(-4px)] group-hover:opacity-100 group-hover:[transform:translateX(0)]">
                {nombre}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

/** Contenido que se abre y se cierra en alto y en ancho con un fundido (rejilla de 0fr a 1fr): plegado no ocupa nada */
function Plegable({ abierto, children }: { abierto: boolean; children: React.ReactNode }) {
  return (
    <div
      className="grid transition-[grid-template-rows,grid-template-columns,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={{ gridTemplateRows: abierto ? "1fr" : "0fr", gridTemplateColumns: abierto ? "1fr" : "0fr", opacity: abierto ? 1 : 0 }}
      aria-hidden={!abierto}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}
