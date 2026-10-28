"use client";

import { useReducir } from "./hooks";
import { motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

/**
 * Transición de página (dirección D · Cristal): la imagen de la tarjeta crece, con sus esquinas
 * redondas, hasta ser la cabecera de la ficha mientras el resto se desenfoca como un cristal.
 * Con "reducir movimiento" (o sin imagen) pasa a un fundido corto.
 */
type Rect = { top: number; left: number; width: number; height: number };

type Viaje = {
  href: string;
  estilo: "cristal" | "fundido";
  fase: "salida" | "esperando" | "llegada";
  imagen?: string;
  rect?: Rect;
  radio: number;
};

const Contexto = createContext<(href: string, imagen?: HTMLImageElement | null) => void>(() => {});

export const useTransicion = () => useContext(Contexto);

/** Cabecera de la ficha de proyecto: aquí aterriza la imagen (margen, alto respecto a la pantalla y radio) */
export const CABECERA = { margen: 12, alto: 0.74, radio: 40 };

export function ProveedorTransicion({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reducir = useReducir();
  const [viaje, setViaje] = useState<Viaje | null>(null);
  const rutaSalida = useRef(pathname);

  const ir = useCallback(
    (href: string, imagen?: HTMLImageElement | null) => {
      if (viaje) return;
      rutaSalida.current = pathname;
      const r = imagen?.getBoundingClientRect();
      const marco = imagen?.closest<HTMLElement>("[data-radio]");
      const radio = marco ? parseFloat(getComputedStyle(marco).borderTopLeftRadius) || 0 : 0;
      setViaje({
        href,
        estilo: reducir || !imagen ? "fundido" : "cristal",
        fase: "salida",
        imagen: imagen?.currentSrc || imagen?.src,
        rect: r ? { top: r.top, left: r.left, width: r.width, height: r.height } : undefined,
        radio,
      });
    },
    [pathname, reducir, viaje],
  );

  const salidaTerminada = useCallback(() => {
    setViaje((v) => (v && v.fase === "salida" ? { ...v, fase: "esperando" } : v));
  }, []);

  // Al terminar la salida, navegar
  useEffect(() => {
    if (viaje?.fase === "esperando") router.push(viaje.href);
  }, [viaje, router]);

  // La ruta ya cambió: dejar ver la página nueva
  useEffect(() => {
    if (!viaje || viaje.fase !== "esperando" || pathname === rutaSalida.current) return;
    window.scrollTo(0, 0);
    const t = window.setTimeout(() => setViaje((v) => (v ? { ...v, fase: "llegada" } : v)), 220);
    return () => window.clearTimeout(t);
  }, [pathname, viaje]);

  const fin = useCallback(() => setViaje(null), []);

  return (
    <Contexto.Provider value={ir}>
      {children}
      {viaje && <Capa viaje={viaje} alSalir={salidaTerminada} alLlegar={fin} />}
    </Contexto.Provider>
  );
}

function Capa({ viaje, alSalir, alLlegar }: { viaje: Viaje; alSalir: () => void; alLlegar: () => void }) {
  const llegando = viaje.fase === "llegada";

  if (viaje.estilo === "cristal" && viaje.imagen && viaje.rect) {
    const destino = {
      top: CABECERA.margen,
      left: CABECERA.margen,
      width: document.documentElement.clientWidth - CABECERA.margen * 2,
      height: window.innerHeight * CABECERA.alto - CABECERA.margen,
      borderRadius: CABECERA.radio,
    };
    return (
      <div className="pointer-events-auto fixed inset-0 z-[90]">
        {/* Velo oscuro solo con opacidad: animar un desenfoque a pantalla completa daba tirones */}
        <motion.div
          className="absolute inset-0 bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: llegando ? 0 : 1 }}
          transition={{ duration: llegando ? 0.45 : 0.6 }}
        />
        <motion.img
          src={viaje.imagen}
          alt=""
          className="absolute object-cover shadow-2xl"
          initial={{ ...viaje.rect, borderRadius: viaje.radio }}
          animate={llegando ? { ...destino, opacity: 0 } : { ...destino, opacity: 1 }}
          transition={llegando ? { duration: 0.5, ease: "easeOut" } : { duration: 0.85, ease: [0.65, 0, 0.2, 1] }}
          onAnimationComplete={() => (llegando ? alLlegar() : alSalir())}
        />
      </div>
    );
  }

  return (
    <motion.div
      className="pointer-events-auto fixed inset-0 z-[90] bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: llegando ? 0 : 1 }}
      transition={{ duration: 0.3 }}
      onAnimationComplete={() => (llegando ? alLlegar() : alSalir())}
    />
  );
}
