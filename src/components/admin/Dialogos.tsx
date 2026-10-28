"use client";

import { AnimatePresence, motion } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { CURVA } from "@/styles/movimiento";
import { Icono } from "../Iconos";

// Confirmaciones y avisos del panel y del editor, con el mismo cristal que la web (en vez de las ventanas
// grises del navegador).

type OpcionesConfirmar = { titulo: string; texto?: string; aceptar?: string; peligro?: boolean };
type Aviso = { id: number; texto: string; tipo: "ok" | "error" };
type Dialogos = { confirmar: (o: OpcionesConfirmar) => Promise<boolean>; avisar: (texto: string, tipo?: Aviso["tipo"]) => void };

const Contexto = createContext<Dialogos>({ confirmar: async () => false, avisar: () => {} });
export const useDialogos = () => useContext(Contexto);

let siguiente = 0;

export function ProveedorDialogos({ children }: { children: React.ReactNode }) {
  const [pregunta, setPregunta] = useState<(OpcionesConfirmar & { responder: (si: boolean) => void }) | null>(null);
  const [avisos, setAvisos] = useState<Aviso[]>([]);

  const confirmar = useCallback((o: OpcionesConfirmar) => new Promise<boolean>((responder) => setPregunta({ ...o, responder })), []);
  const avisar = useCallback((texto: string, tipo: Aviso["tipo"] = "ok") => {
    const id = ++siguiente;
    setAvisos((l) => [...l, { id, texto, tipo }]);
    window.setTimeout(() => setAvisos((l) => l.filter((a) => a.id !== id)), tipo === "error" ? 7000 : 3500);
  }, []);
  const valor = useMemo(() => ({ confirmar, avisar }), [confirmar, avisar]);

  const responder = (si: boolean) => {
    pregunta?.responder(si);
    setPregunta(null);
  };

  return (
    <Contexto.Provider value={valor}>
      {children}
      <AnimatePresence>{pregunta && <Pregunta {...pregunta} alResponder={responder} />}</AnimatePresence>
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[140] flex flex-col items-center gap-2 px-4" aria-live="polite">
        <AnimatePresence>
          {avisos.map((a) => (
            <motion.div
              key={a.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.45, ease: CURVA }}
              className="cristal cristal-fuerte pointer-events-auto flex max-w-md items-center gap-2.5 rounded-full px-5 py-3 text-sm font-medium"
            >
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${a.tipo === "ok" ? "bg-[#34c759]" : "bg-[#ff453a]"} text-white`}>
                <Icono nombre={a.tipo === "ok" ? "check" : "alerta"} className="h-3 w-3" />
              </span>
              {a.texto}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Contexto.Provider>
  );
}

function Pregunta({ titulo, texto, aceptar = "Aceptar", peligro, alResponder }: OpcionesConfirmar & { alResponder: (si: boolean) => void }) {
  const boton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    boton.current?.focus();
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && alResponder(false);
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [alResponder]);
  return (
    <motion.div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => alResponder(false)}>
      <motion.div
        role="alertdialog"
        aria-modal
        aria-label={titulo}
        className="cristal cristal-fuerte w-full max-w-sm rounded-[32px] p-7"
        initial={{ scale: 0.94, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.4, ease: CURVA }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-extrabold tracking-tight">{titulo}</h2>
        {texto && <p className="mt-2 text-sm leading-relaxed text-[var(--jm-suave)]">{texto}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={() => alResponder(false)} className="boton boton-suave px-5 py-2.5 text-sm">
            Cancelar
          </button>
          <button
            ref={boton}
            type="button"
            onClick={() => alResponder(true)}
            className={`boton px-5 py-2.5 text-sm text-white ${peligro ? "bg-[#ff453a] shadow-[0_10px_30px_-10px_rgba(255,69,58,0.7)]" : "boton-acento"}`}
          >
            {aceptar}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
