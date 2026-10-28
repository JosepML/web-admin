"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import type { Medio } from "@/lib/datos/tipos";
import { usePunteroFino, useReducir } from "../comun/hooks";
import { enfoque, img } from "../comun/imagen";
import { Revelar } from "../piezas";

/**
 * Retrato de «Sobre mí» para Contacto y Gracias: se inclina con el ratón, con un zoom muy leve al hacer scroll
 * (anclado arriba para que la cabeza no se corte) y una etiqueta pequeña abajo. Sin foto, no pinta nada.
 */
export function Retrato({
  medio,
  etiqueta,
  className = "",
  children,
}: {
  medio: Medio | null;
  etiqueta?: string;
  className?: string;
  /** Texto que va encima de la foto, abajo, en blanco */
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reducir = useReducir();
  const fino = usePunteroFino();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const escala = useTransform(scrollYProgress, [0, 1], [1.08, 1]);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 18 });
  const sry = useSpring(ry, { stiffness: 150, damping: 18 });
  if (!medio) return null;

  return (
    <Revelar className={className}>
      <div ref={ref} className="lg:h-full" style={{ perspective: 1200 }}>
        <motion.div
          className={`relative mx-auto ${children ? "aspect-[16/10] sm:aspect-[4/5]" : "aspect-[4/5]"} max-w-md overflow-hidden rounded-[24px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] sm:rounded-[44px] lg:aspect-auto lg:h-full lg:min-h-[34rem] lg:max-w-none`}
          style={{ rotateX: srx, rotateY: sry }}
          onPointerMove={(e) => {
            if (!fino || reducir) return;
            const r = e.currentTarget.getBoundingClientRect();
            ry.set(((e.clientX - r.left) / r.width - 0.5) * 10);
            rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
          }}
          onPointerLeave={() => {
            rx.set(0);
            ry.set(0);
          }}
        >
          <motion.img
            src={img(medio.url, 1920)}
            alt={medio.alt}
            className="absolute inset-0 h-full w-full origin-top object-cover object-center [will-change:transform]"
            style={{ scale: reducir ? 1 : escala, ...enfoque(medio) }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          {children && (
            // Dentro de la foto el texto siempre es claro, sea cual sea el tema
            <div className="absolute inset-x-0 bottom-0 z-30 p-5 text-white sm:p-10 [--jm-suave:rgba(255,255,255,0.82)] [--jm-texto:#fff]">
              {children}
            </div>
          )}
          {etiqueta && !children && (
            <div className="absolute bottom-4 left-4 right-4 z-30 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/20 bg-black/35 px-3.5 py-1.5 text-xs font-medium text-white">{etiqueta}</span>
            </div>
          )}
        </motion.div>
      </div>
    </Revelar>
  );
}
