"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useActionState } from "react";
import { entrar, type EstadoEntrar } from "@/lib/admin/acceso";
import { CURVA } from "@/styles/movimiento";

export function FormularioEntrar({ volver }: { volver: string }) {
  const [estado, accion, enviando] = useActionState<EstadoEntrar, FormData>(entrar, {});

  return (
    <motion.form
      action={accion}
      className="cristal cristal-fuerte w-full max-w-sm rounded-[var(--jm-radio-bloque)] p-8 sm:p-10"
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: CURVA }}
    >
      <Link href="/" className="text-[15px] font-extrabold tracking-tight">
        Josep Mira<span className="text-[var(--jm-acento)]">.</span>
      </Link>
      <h1 className="mt-6 text-3xl font-extrabold tracking-[-0.04em]">
        Hola de nuevo, <span className="jm-serif jm-degradado-acento">Josep</span>
      </h1>
      <p className="mt-2 text-sm text-[var(--jm-suave)]">Entra para editar tu web.</p>

      <input type="hidden" name="volver" value={volver} />
      <label className="mt-8 block">
        <span className="campo-etiqueta">Correo</span>
        <input name="correo" type="email" autoComplete="username" required defaultValue={estado.correo} className="campo mt-1.5" autoFocus />
      </label>
      <label className="mt-4 block">
        <span className="campo-etiqueta">Contraseña</span>
        <input name="clave" type="password" autoComplete="current-password" required className="campo mt-1.5" />
      </label>

      {estado.error && (
        <motion.p role="alert" className="mt-4 text-sm text-[#ff6b6b]" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
          {estado.error}
        </motion.p>
      )}

      <button type="submit" disabled={enviando} className="boton boton-acento mt-8 w-full px-6 py-3.5 text-sm disabled:opacity-60">
        {enviando ? "Entrando…" : "Entrar"}
      </button>
    </motion.form>
  );
}
