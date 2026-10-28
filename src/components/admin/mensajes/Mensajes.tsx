"use client";

// Mensajes del formulario de contacto. Cada uno se abre para leerlo, contestar (correo o WhatsApp), apuntar
// notas y marcarlo como respondido o cerrado.

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Icono } from "@/components/Iconos";
import { borrarMensaje, cambiarMensaje, type EstadoMensaje } from "@/lib/admin/mensajes";
import { CURVA } from "@/styles/movimiento";
import { useDialogos } from "../Dialogos";
import { Insignia } from "../ListaContenido";

export type Mensaje = {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  servicio: string;
  mensaje: string;
  origen: string;
  estado: EstadoMensaje;
  notas: string;
  creadoEn: string;
};

type Filtro = EstadoMensaje | "todos";
const FILTROS: { id: Filtro; nombre: string }[] = [
  { id: "nuevo", nombre: "Nuevos" },
  { id: "respondido", nombre: "Respondidos" },
  { id: "cerrado", nombre: "Cerrados" },
  { id: "todos", nombre: "Todos" },
];
const ESTADO: Record<EstadoMensaje, { nombre: string; color: string }> = {
  nuevo: { nombre: "Nuevo", color: "bg-[var(--jm-acento)]/20 text-[#ff8a80]" },
  respondido: { nombre: "Respondido", color: "bg-[#30d158]/15 text-[#30d158]" },
  cerrado: { nombre: "Cerrado", color: "bg-white/10 text-[var(--jm-suave)]" },
};

function cuando(iso: string) {
  const d = new Date(iso);
  const hoy = new Date();
  const mismoDia = d.toDateString() === hoy.toDateString();
  return mismoDia ? `Hoy, ${d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}` : d.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: d.getFullYear() === hoy.getFullYear() ? undefined : "numeric" });
}

export function Mensajes({ inicial }: { inicial: Mensaje[] }) {
  const router = useRouter();
  const { confirmar, avisar } = useDialogos();
  const [lista, setLista] = useState(inicial);
  const [filtro, setFiltro] = useState<Filtro>(inicial.some((m) => m.estado === "nuevo") ? "nuevo" : "todos");
  const [abierto, setAbierto] = useState<string | null>(null);
  useEffect(() => setLista(inicial), [inicial]);

  const visibles = useMemo(() => lista.filter((m) => filtro === "todos" || m.estado === filtro), [lista, filtro]);
  const cuenta = (f: Filtro) => (f === "todos" ? lista.length : lista.filter((m) => m.estado === f).length);

  const cambiar = async (m: Mensaje, cambios: Partial<Pick<Mensaje, "estado" | "notas">>, aviso?: string) => {
    setLista((l) => l.map((x) => (x.id === m.id ? { ...x, ...cambios } : x)));
    const r = await cambiarMensaje(m.id, cambios);
    if (!r.ok) return avisar(r.error, "error");
    if (aviso) avisar(aviso);
    if (cambios.estado) router.refresh();
  };

  const quitar = async (m: Mensaje) => {
    if (!(await confirmar({ titulo: `¿Borrar el mensaje de ${m.nombre}?`, texto: "Se borra para siempre. Si solo quieres quitarlo de en medio, márcalo como cerrado.", aceptar: "Borrar", peligro: true }))) return;
    const r = await borrarMensaje(m.id);
    if (!r.ok) return avisar(r.error, "error");
    setLista((l) => l.filter((x) => x.id !== m.id));
    avisar("Mensaje borrado");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-4xl font-extrabold tracking-[-0.04em]">Mensajes</h1>
      <p className="mt-1 text-sm text-[var(--jm-suave)]">Lo que llega desde el formulario de contacto de la web.</p>

      <div className="mt-8 inline-flex flex-wrap gap-1 rounded-full bg-black/25 p-1">
        {FILTROS.map((f) => (
          <button key={f.id} type="button" onClick={() => setFiltro(f.id)} className={`relative rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${filtro === f.id ? "text-[var(--jm-texto)]" : "text-[var(--jm-tenue)] hover:text-[var(--jm-suave)]"}`}>
            {filtro === f.id && <motion.span layoutId="filtro-mensajes" className="absolute inset-0 rounded-full bg-white/10" transition={{ duration: 0.4, ease: CURVA }} />}
            <span className="relative">
              {f.nombre} <span className="text-[var(--jm-tenue)]">{cuenta(f.id)}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-2">
        {visibles.map((m) => (
          <Tarjeta key={m.id} m={m} abierto={abierto === m.id} alAbrir={() => setAbierto(abierto === m.id ? null : m.id)} alCambiar={(c, aviso) => cambiar(m, c, aviso)} alBorrar={() => quitar(m)} />
        ))}
      </div>
      {!visibles.length && (
        <div className="cristal mt-5 rounded-[28px] px-6 py-10 text-center">
          <Icono nombre="correo" className="mx-auto h-7 w-7 text-[var(--jm-tenue)]" />
          <p className="mt-3 text-sm text-[var(--jm-suave)]">{lista.length ? "No hay mensajes aquí." : "Todavía no ha llegado ningún mensaje. Cuando alguien escriba desde la web, aparecerá aquí."}</p>
        </div>
      )}
    </div>
  );
}

function Tarjeta({ m, abierto, alAbrir, alCambiar, alBorrar }: { m: Mensaje; abierto: boolean; alAbrir: () => void; alCambiar: (c: Partial<Pick<Mensaje, "estado" | "notas">>, aviso?: string) => void; alBorrar: () => void }) {
  const [notas, setNotas] = useState(m.notas);
  const asunto = encodeURIComponent(`Re: tu mensaje${m.servicio ? ` sobre ${m.servicio.toLowerCase()}` : ""}`);
  const cuerpo = encodeURIComponent(`Hola, ${m.nombre.split(" ")[0]}:\n\n\n\n— Josep\n\n> ${m.mensaje.replace(/\n/g, "\n> ")}`);
  const telefono = m.telefono.replace(/[^\d+]/g, "").replace(/^\+/, "");
  const whatsapp = telefono ? `https://wa.me/${telefono.length === 9 ? `34${telefono}` : telefono}` : null;

  return (
    <div className={`cristal overflow-hidden rounded-[24px] transition-colors ${m.estado === "nuevo" ? "ring-1 ring-[var(--jm-acento)]/40" : ""}`}>
      <button type="button" onClick={alAbrir} aria-expanded={abierto} className="flex w-full items-start gap-4 px-5 py-4 text-left">
        <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${m.estado === "nuevo" ? "bg-[var(--jm-acento)]" : "bg-transparent"}`} />
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className={`font-semibold ${m.estado === "nuevo" ? "" : "text-[var(--jm-suave)]"}`}>{m.nombre}</span>
            {m.servicio && <Insignia color="bg-white/10 text-[var(--jm-suave)]">{m.servicio}</Insignia>}
            {m.estado !== "nuevo" && <Insignia color={ESTADO[m.estado].color}>{ESTADO[m.estado].nombre}</Insignia>}
          </span>
          <span className={`mt-1 block text-sm text-[var(--jm-suave)] ${abierto ? "" : "line-clamp-1"}`}>{abierto ? m.correo : m.mensaje}</span>
        </span>
        <span className="shrink-0 text-xs text-[var(--jm-tenue)]">{cuando(m.creadoEn)}</span>
      </button>
      <AnimatePresence initial={false}>
        {abierto && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: CURVA }} className="overflow-hidden">
            <div className="border-t border-[var(--jm-borde)] px-5 pb-5 pt-4 sm:pl-11">
              <p className="whitespace-pre-line text-[15px] leading-relaxed">{m.mensaje}</p>
              <p className="mt-3 text-xs text-[var(--jm-tenue)]">
                {[m.correo, m.telefono, m.origen && m.origen !== "contacto" ? `Desde: ${m.origen}` : "", new Date(m.creadoEn).toLocaleString("es-ES", { dateStyle: "long", timeStyle: "short" })].filter(Boolean).join(" · ")}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a href={`mailto:${m.correo}?subject=${asunto}&body=${cuerpo}`} onClick={() => m.estado === "nuevo" && alCambiar({ estado: "respondido" })} className="boton boton-acento px-4 py-2.5 text-sm">
                  <Icono nombre="correo" className="h-4 w-4" />
                  Responder por correo
                </a>
                {whatsapp && (
                  <a href={whatsapp} target="_blank" rel="noreferrer" onClick={() => m.estado === "nuevo" && alCambiar({ estado: "respondido" })} className="boton boton-suave px-4 py-2.5 text-sm">
                    <Icono nombre="whatsapp" className="h-4 w-4" />
                    WhatsApp
                  </a>
                )}
              </div>
              <label className="mt-5 block">
                <span className="campo-etiqueta">Notas (solo para ti)</span>
                <textarea className="campo mt-1.5 min-h-[4.5rem] resize-y text-sm" value={notas} onChange={(e) => setNotas(e.target.value)} onBlur={() => notas !== m.notas && alCambiar({ notas }, "Nota guardada")} placeholder="Presupuesto enviado el martes, rodaje en marzo…" />
              </label>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs text-[var(--jm-tenue)]">Marcar como</span>
                {(Object.keys(ESTADO) as EstadoMensaje[]).map((e) => (
                  <button key={e} type="button" onClick={() => alCambiar({ estado: e })} disabled={m.estado === e} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${m.estado === e ? ESTADO[e].color : "text-[var(--jm-suave)] ring-1 ring-[var(--jm-borde)] hover:text-[var(--jm-texto)]"}`}>
                    {ESTADO[e].nombre}
                  </button>
                ))}
                <button type="button" onClick={alBorrar} className="ml-auto rounded-full px-3 py-1.5 text-xs font-semibold text-[#ff6b6b] hover:bg-[#ff453a]/10">
                  Borrar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
