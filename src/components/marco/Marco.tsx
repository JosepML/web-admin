"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Ajustes } from "@/lib/datos/tipos";
import { RUTAS } from "@/lib/rutas";
import { CURVA } from "@/styles/movimiento";
import { usePantallaAncha, useReducir } from "../comun/hooks";
import { Icono } from "../Iconos";
import { Pie } from "./Pie";
import { useAnclas, useScrollMagico } from "./scrollMagico";

/** Menú principal. «Trabajos» primero (plan/contenido/fundamentos.md). Llevan a las secciones de Inicio
 *  mientras no existen sus páginas; las tareas S5 a S9 cambian cada uno a su página al crearla. */
const ENLACES = [
  { nombre: "Trabajos", href: RUTAS.trabajos },
  { nombre: "Servicios", href: "/#servicios" },
  { nombre: "Sobre mí", href: RUTAS.sobreMi },
  { nombre: "Blog", href: RUTAS.blog },
];
const HABLEMOS = RUTAS.contacto;

/** Tema fijo: la web utiliza exclusivamente la dirección visual cinematográfica oscura */
export const useTema = () => ({ tema: "oscuro" as const, cambiarTema: () => {} });

/**
 * Marco de toda la web pública: diseño cinematográfico oscuro predeterminado,
 * fondo con orbes, menú de cristal, foco de luz de las tarjetas, scroll mágico en Inicio y pie.
 */
export function Marco({ ajustes, children }: { ajustes: Ajustes; children: React.ReactNode }) {
  const reducir = useReducir();
  const ruta = usePathname();
  useFoco();
  const ancha = usePantallaAncha();
  // Solo en Inicio y en pantalla de ordenador (en móvil el scroll es siempre 100% nativo)
  useScrollMagico(ancha && ruta === RUTAS.inicio && !reducir);
  useAnclas(ruta);

  return (
    <div data-tema="oscuro" data-reducir={reducir ? "" : undefined} className="jm-raiz relative min-h-svh overflow-x-clip">
      <a
        href="#contenido-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[var(--jm-acento)] focus:px-5 focus:py-2.5 focus:text-xs focus:font-semibold focus:text-white"
      >
        Saltar al contenido
      </a>
      <div className="orbes" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <Menu nombre={ajustes.nombre} />
      <div id="contenido-principal" className="relative z-[2]">
        {children}
        <Pie ajustes={ajustes} />
      </div>
    </div>
  );
}

/**
 * Foco de luz en las tarjetas con data-foco: un solo escuchador para toda la página,
 * y como mucho una actualización por fotograma (el ratón da más eventos que fotogramas).
 */
function useFoco() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let actual: HTMLElement | null = null;
    let ultimo: PointerEvent | null = null;
    let pendiente = 0;
    const pintar = () => {
      pendiente = 0;
      const e = ultimo;
      if (!e) return;
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-foco]") ?? null;
      if (actual && actual !== el) actual.style.setProperty("--foco", "0");
      actual = el;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
      el.style.setProperty("--foco", "1");
    };
    const mover = (e: PointerEvent) => {
      ultimo = e;
      if (!pendiente) pendiente = requestAnimationFrame(pintar);
    };
    document.addEventListener("pointermove", mover, { passive: true });
    return () => {
      document.removeEventListener("pointermove", mover);
      cancelAnimationFrame(pendiente);
    };
  }, []);
}

/** "Josep Mira Lozano" → "Josep Mira": el nombre corto del menú */
const nombreCorto = (nombre: string) => nombre.split(" ").slice(0, 2).join(" ");

function Menu({ nombre }: { nombre: string }) {
  const reducir = useReducir();
  const { scrollY } = useScroll();
  const [compacto, setCompacto] = useState(false);
  const [oculto, setOculto] = useState(false);
  const [abierto, setAbierto] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const previo = scrollY.getPrevious() ?? 0;
    setCompacto(y > 40);
    setOculto(!reducir && y > 400 && y > previo + 4 ? true : y < previo - 4 ? false : oculto);
  });

  // Con ratón, llevarlo arriba del todo vuelve a enseñar la barra aunque se haya escondido al bajar
  useEffect(() => {
    const mover = (e: PointerEvent) => e.pointerType === "mouse" && e.clientY < 90 && setOculto(false);
    document.addEventListener("pointermove", mover, { passive: true });
    return () => document.removeEventListener("pointermove", mover);
  }, []);

  // Con teclado, Escape cierra el menú móvil
  useEffect(() => {
    if (!abierto) return;
    const alTecla = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    document.addEventListener("keydown", alTecla);
    return () => document.removeEventListener("keydown", alTecla);
  }, [abierto]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:pt-4"
        animate={{ y: oculto && !abierto ? -100 : 0 }}
        transition={{ duration: 0.5, ease: CURVA }}
        onFocusCapture={() => setOculto(false)}
      >
        <nav
          aria-label="Principal"
          className={`cristal cristal-fuerte flex w-full max-w-5xl items-center justify-between rounded-full transition-all duration-500 ${
            compacto ? "py-1.5 pl-5 pr-1.5" : "py-2.5 pl-6 pr-2.5"
          }`}
        >
          <Link href={RUTAS.inicio} className="text-[15px] font-extrabold tracking-tight">
            {nombreCorto(nombre)}
            <span className="text-[var(--jm-acento)]">.</span>
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            {ENLACES.map((e) => (
              <Link
                key={e.nombre}
                href={e.href}
                className="rounded-full px-4 py-2 text-[13px] font-medium text-[var(--jm-suave)] transition-colors hover:bg-[var(--jm-cristal)] hover:text-[var(--jm-texto)]"
              >
                {e.nombre}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <Link href={HABLEMOS} className="boton boton-acento hidden px-5 py-2 text-[13px] sm:inline-flex">
              Hablemos
            </Link>
            <button
              type="button"
              onClick={() => setAbierto((v) => !v)}
              aria-label="Menú"
              aria-expanded={abierto}
              className="flex h-9 w-9 items-center justify-center rounded-full md:hidden"
            >
              <Icono nombre={abierto ? "cerrar" : "menu"} className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {abierto && (
          <motion.div
            className="fixed inset-x-3 top-[76px] z-50 md:hidden"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.35, ease: CURVA }}
          >
            <div className="cristal cristal-fuerte flex flex-col gap-1 rounded-[28px] p-3">
              {[...ENLACES, { nombre: "Hablemos", href: HABLEMOS }].map((e, i) => (
                <motion.div key={e.nombre} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
                  <Link
                    href={e.href}
                    onClick={() => setAbierto(false)}
                    className="block rounded-2xl px-4 py-3 text-2xl font-bold tracking-tight hover:bg-[var(--jm-cristal)]"
                  >
                    {e.nombre}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
