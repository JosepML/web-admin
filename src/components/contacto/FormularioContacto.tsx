"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { enviarContacto, type EstadoContacto } from "@/lib/contacto/enviar";
import { RUTAS } from "@/lib/rutas";
import { Icono } from "../Iconos";

const CAMPO =
  "w-full rounded-xl border border-white/12 bg-black/20 px-3.5 py-2.5 text-sm font-normal text-[var(--jm-texto)] outline-none transition-[border-color,background-color,box-shadow] duration-300 placeholder:text-[var(--jm-tenue)] hover:border-white/25 focus:border-[var(--jm-acento)] focus:bg-black/30 focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--jm-acento)_22%,transparent)] sm:rounded-2xl sm:px-4 sm:py-3.5 sm:text-base";

function Etiqueta({ texto, opcional, llena, children }: { texto: string; opcional?: boolean; llena?: boolean; children: React.ReactNode }) {
  return (
    <label className={`grid gap-2 ${llena ? "h-full grid-rows-[auto_1fr]" : ""} text-left text-sm font-medium text-[var(--jm-suave)]`}>
      <span>
        {texto}
        {opcional && <span className="ml-2 text-xs font-normal text-[var(--jm-tenue)]">opcional</span>}
      </span>
      {children}
    </label>
  );
}

/** Pastilla que se marca */
function Pastilla({ texto, activo, alCambiar }: { texto: string; activo: boolean; alCambiar: () => void }) {
  return (
    <label
      className={`group inline-flex cursor-pointer select-none items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-normal transition-[background-color,border-color,color,transform] duration-300 active:scale-95 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--jm-acento)] sm:px-4 sm:py-2 sm:text-sm ${
        activo
          ? "border-transparent bg-[var(--jm-acento)] text-white shadow-[0_8px_24px_-10px_var(--jm-acento)]"
          : "border-white/12 bg-white/[0.04] text-[var(--jm-suave)] hover:border-white/30 hover:text-[var(--jm-texto)]"
      }`}
    >
      <input type="checkbox" checked={activo} onChange={alCambiar} className="sr-only" />
      {activo && <Icono nombre="check" className="-ml-0.5 h-3.5 w-3.5" />}
      {texto}
    </label>
  );
}

type Props = {
  /** Las pastillas de «¿Qué tienes en mente?» */
  opciones: string[];
  /** Las que llegan marcadas (?temas=…) */
  marcados?: string[];
  /** Si quien lo usa guarda las marcadas (por ejemplo, la llamada del final de las páginas, que reacciona a los botones de servicio) */
  valor?: string[];
  alCambiar?: (lista: string[]) => void;
  /** De dónde viene el mensaje (se guarda con él) */
  origen?: string;
  /** Línea pequeña junto al botón */
  nota?: React.ReactNode;
};

export function FormularioContacto({ opciones, marcados = [], valor, alCambiar, origen = "contacto", nota }: Props) {
  const router = useRouter();
  const [estado, accion, enviando] = useActionState<EstadoContacto, FormData>(enviarContacto, {});
  const [propios, setPropios] = useState<string[]>(marcados);

  useEffect(() => {
    if (estado?.ok) {
      router.push(RUTAS.gracias);
    }
  }, [estado?.ok, router]);

  const elegidos = valor ?? propios;
  const alternar = (t: string) => {
    const nueva = elegidos.includes(t) ? elegidos.filter((x) => x !== t) : [...elegidos, t];
    (alCambiar ?? setPropios)(nueva);
  };

  return (
    <form action={accion} className="cristal relative flex h-full flex-col gap-3.5 overflow-hidden rounded-[24px] p-4 text-left sm:gap-5 sm:rounded-[32px] sm:p-8">
      <div aria-hidden className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(closest-side,var(--jm-orbe-a),transparent)] opacity-70" />
      <p className="relative flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--jm-suave)]">
        <Icono nombre="correo" className="h-4 w-4 text-[var(--jm-acento)]" />
        Mensaje directo
      </p>

      <input type="hidden" name="origen" value={origen} />
      <input type="hidden" name="servicio" value={elegidos.join(", ")} />

      <div className="relative grid gap-3.5 sm:grid-cols-2 sm:gap-6">
        <Etiqueta texto="Nombre">
          <input name="nombre" required minLength={2} autoComplete="name" placeholder="Cómo te llamas" className={CAMPO} />
        </Etiqueta>
        <Etiqueta texto="Correo">
          <input name="correo" type="email" required autoComplete="email" placeholder="tu@correo.com" className={CAMPO} />
        </Etiqueta>
      </div>

      <fieldset className="relative grid gap-3">
        <legend className="mb-1 text-sm font-medium text-[var(--jm-suave)]">
          ¿Qué tienes en mente?<span className="ml-2 text-xs font-normal text-[var(--jm-tenue)]">opcional, puedes elegir varias</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {opciones.map((t) => (
            <Pastilla key={t} texto={t} activo={elegidos.includes(t)} alCambiar={() => alternar(t)} />
          ))}
        </div>
      </fieldset>

      <div className="relative grid flex-1">
        <Etiqueta texto="Cuéntame tu proyecto" llena>
          <textarea
            name="mensaje"
            required
            minLength={10}
            rows={5}
            placeholder="Qué quieres contar, para quién y para cuándo. Cuanto más me cuentes, mejor."
            className={`${CAMPO} h-full min-h-24 resize-none leading-relaxed sm:min-h-32`}
          />
        </Etiqueta>
      </div>

      <div className="relative grid">
        <Etiqueta texto="Teléfono" opcional>
          <input name="telefono" type="tel" autoComplete="tel" placeholder="Si prefieres que te llame" className={CAMPO} />
        </Etiqueta>
      </div>

      <label className="relative flex cursor-pointer items-start gap-3 text-left text-sm leading-relaxed text-[var(--jm-suave)]">
        <input name="acepta" type="checkbox" required className="peer sr-only" />
        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-white/25 bg-black/20 transition-[background-color,border-color,box-shadow] duration-200 peer-checked:border-transparent peer-checked:bg-[var(--jm-acento)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--jm-acento)] peer-checked:[&>svg]:scale-100 peer-checked:[&>svg]:opacity-100">
          <Icono nombre="check" className="h-3.5 w-3.5 scale-50 text-white opacity-0 transition-[transform,opacity] duration-200" />
        </span>
        <span>
          Acepto que guardes mis datos para responderme. Solo los uso para eso.{" "}
          <Link href={RUTAS.privacidad} className="underline decoration-white/30 underline-offset-4 transition-colors hover:text-[var(--jm-texto)]">
            Política de privacidad
          </Link>
          .
        </span>
      </label>

      {estado.error && (
        <p role="alert" className="relative rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {estado.error}
        </p>
      )}

      <div className="relative flex flex-wrap items-center gap-x-6 gap-y-3">
        <button type="submit" disabled={enviando} className="boton boton-acento group px-6 py-3 text-sm disabled:opacity-60 sm:px-8 sm:py-4 sm:text-base">
          {enviando ? "Enviando…" : "Enviar mensaje"}
          {!enviando && <Icono nombre="flecha" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />}
        </button>
        <p className="text-xs text-[var(--jm-tenue)]">{nota ?? "Te respondo personalmente, normalmente en menos de 24 horas."}</p>
      </div>
    </form>
  );
}
