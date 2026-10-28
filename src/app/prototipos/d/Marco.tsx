"use client";

import { useReducir } from "../_comun/hooks";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Editor } from "./Editor";
import { ProveedorD, useEstadoD } from "./estado";
import { Icono } from "./Iconos";
import { RAIZ } from "./rutas";
import { useScrollMagico } from "./scrollMagico";

const ENLACES = [
  { nombre: "Trabajos", href: `${RAIZ}#trabajos` },
  { nombre: "Servicios", href: `${RAIZ}#servicios` },
  { nombre: "Sobre mí", href: `${RAIZ}#sobre-mi` },
  { nombre: "Blog", href: `${RAIZ}#blog` },
];

export function MarcoD({ children }: { children: React.ReactNode }) {
  return (
    <ProveedorD>
      <Lienzo>{children}</Lienzo>
    </ProveedorD>
  );
}

function Lienzo({ children }: { children: React.ReactNode }) {
  const { tema, editando } = useEstadoD();
  const reducir = useReducir();
  useFoco();
  // Solo en la portada: en las fichas y páginas de servicio el scroll es el normal
  const ruta = usePathname();
  useScrollMagico(ruta === RAIZ && !reducir && !editando);

  // El fondo de la página (fuera del lienzo) sigue al tema, para que no asome otro color al hacer scroll elástico
  useEffect(() => {
    const anterior = document.body.style.background;
    document.body.style.background = tema === "claro" ? "#f5f5f7" : "#09090b";
    return () => {
      document.body.style.background = anterior;
    };
  }, [tema]);

  return (
    <div data-tema={tema} data-reducir={reducir ? "" : undefined} className="d-raiz relative min-h-svh overflow-x-clip transition-colors duration-700">
      <div className="orbes" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <Menu />
      <div className="relative z-[2]">{children}</div>
      <Editor />
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

function Menu() {
  const { tema, cambiarTema } = useEstadoD();
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

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:pt-4"
        animate={{ y: oculto && !abierto ? -100 : 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav
          className={`cristal cristal-fuerte flex w-full max-w-5xl items-center justify-between rounded-full transition-all duration-500 ${
            compacto ? "py-1.5 pl-5 pr-1.5" : "py-2.5 pl-6 pr-2.5"
          }`}
        >
          <Link href={RAIZ} className="text-[15px] font-extrabold tracking-tight">
            Josep Mira<span className="text-[var(--d-acento)]">.</span>
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            {ENLACES.map((e) => (
              <Link
                key={e.nombre}
                href={e.href}
                className="rounded-full px-4 py-2 text-[13px] font-medium text-[var(--d-suave)] transition-colors hover:bg-[var(--d-cristal)] hover:text-[var(--d-texto)]"
              >
                {e.nombre}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={cambiarTema}
              aria-label={tema === "oscuro" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--d-suave)] transition-colors hover:bg-[var(--d-cristal)] hover:text-[var(--d-texto)]"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={tema}
                  initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.3 }}
                >
                  <Icono nombre={tema === "oscuro" ? "sol" : "luna"} className="h-[18px] w-[18px]" />
                </motion.span>
              </AnimatePresence>
            </button>
            <Link href={`${RAIZ}#llamada`} className="boton boton-acento hidden px-5 py-2 text-[13px] sm:inline-flex">
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
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="cristal cristal-fuerte flex flex-col gap-1 rounded-[28px] p-3">
              {[...ENLACES, { nombre: "Hablemos", href: `${RAIZ}#llamada` }].map((e, i) => (
                <motion.div
                  key={e.nombre}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                >
                  <Link
                    href={e.href}
                    onClick={() => setAbierto(false)}
                    className="block rounded-2xl px-4 py-3 text-2xl font-bold tracking-tight hover:bg-[var(--d-cristal)]"
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
