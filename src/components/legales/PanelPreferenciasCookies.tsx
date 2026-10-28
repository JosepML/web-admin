"use client";

import { useConsentimientoCookies } from "./ConsentimientoCookies";

export function PanelPreferenciasCookies() {
  const { estado, cargado, guardar } = useConsentimientoCookies();

  const textoEstado = !cargado
    ? "Comprobando…"
    : estado === "aceptadas"
      ? "Cookies analíticas aceptadas (Google Analytics activo)"
      : estado === "rechazadas"
        ? "Cookies analíticas rechazadas (solo cookies técnicas)"
        : "Aún no has elegido preferencia (Google Analytics inactivo)";

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[var(--jm-borde)] bg-white/[0.03] p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--jm-tenue)]">Estado actual</p>
        <p className="mt-1 font-semibold text-[var(--jm-texto)]">{textoEstado}</p>
      </div>
      <div className="flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={() => guardar("rechazadas")}
          className={`boton px-4 py-2 text-xs font-semibold transition-colors ${
            estado === "rechazadas"
              ? "border border-white/30 bg-white/[0.12] text-[var(--jm-texto)]"
              : "border border-[var(--jm-borde)] bg-white/[0.04] text-[var(--jm-suave)] hover:text-[var(--jm-texto)]"
          }`}
        >
          Solo técnicas (rechazar analíticas)
        </button>
        <button
          type="button"
          onClick={() => guardar("aceptadas")}
          className={`boton px-4 py-2 text-xs font-semibold transition-colors ${
            estado === "aceptadas"
              ? "boton-acento"
              : "border border-[var(--jm-borde)] bg-white/[0.04] text-[var(--jm-suave)] hover:text-[var(--jm-texto)]"
          }`}
        >
          Aceptar analíticas
        </button>
      </div>
    </div>
  );
}
