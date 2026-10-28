"use client";

// Versiones anteriores de una página: cada vez que se publica se guarda la que había antes. Lo usan el panel
// (/admin/paginas) y el editor de la propia web mientras convivan.

import { useEffect, useState } from "react";
import { useDialogos } from "@/components/admin/Dialogos";
import { Icono } from "@/components/Iconos";
import { restaurar, revisiones, type Revision } from "@/lib/admin/contenido";

export function Historial({ paginaId, alRestaurar }: { paginaId: string; alRestaurar: () => void }) {
  const { confirmar, avisar } = useDialogos();
  const [lista, setLista] = useState<Revision[] | null>(null);
  useEffect(() => {
    revisiones("paginas", paginaId).then((r) => setLista(r.ok ? r.datos : []));
  }, [paginaId]);

  return (
    <section className="mt-8">
      <h3 className="flex items-center gap-2 text-sm font-bold">
        <Icono nombre="historial" className="h-4 w-4" />
        Versiones anteriores
      </h3>
      <p className="mt-1 text-xs leading-relaxed text-[var(--jm-tenue)]">Cada vez que publicas se guarda la versión que había antes (las 30 últimas).</p>
      {lista && !lista.length && <p className="mt-3 text-sm text-[var(--jm-suave)]">Aún no hay versiones anteriores.</p>}
      <ul className="mt-3 flex flex-col gap-1.5">
        {lista?.map((r) => (
          <li key={r.id} className="flex items-center justify-between gap-2 rounded-[16px] border border-[var(--jm-borde)] px-3.5 py-2.5 text-sm">
            <span>{new Date(r.creadoEn).toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" })}</span>
            <button
              type="button"
              className="text-xs font-semibold text-[var(--jm-acento)] hover:underline"
              onClick={async () => {
                const si = await confirmar({ titulo: "¿Recuperar esta versión?", texto: "Sustituye a lo que tienes sin publicar. La web no cambia hasta que publiques.", aceptar: "Recuperar" });
                if (!si) return;
                const res = await restaurar(r.id);
                if (!res.ok) return avisar(res.error, "error");
                avisar("Versión recuperada. Revísala y publica.");
                alRestaurar();
              }}
            >
              Recuperar
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
