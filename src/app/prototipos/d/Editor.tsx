"use client";

import { AnimatePresence, motion, Reorder, useDragControls } from "motion/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CATALOGO, type Bloque, type TipoBloque } from "./datos";
import { useEstadoD } from "./estado";
import { Icono } from "./Iconos";

/**
 * Modo edición de demostración: enseña cómo funcionará el panel privado (fase 6).
 * Las secciones se arrastran para reordenarlas, se ocultan, se editan y se crean nuevas;
 * la portada cambia al momento porque se pinta a partir de esta misma lista de bloques.
 */
export function Editor() {
  const ruta = usePathname();
  const { editando, setEditando, bloques, setBloques, anadir, restablecer } = useEstadoD();
  const [catalogo, setCatalogo] = useState(false);
  const [abiertoId, setAbiertoId] = useState<string | null>(null);

  if (ruta !== "/prototipos/d") return null;

  const crear = (tipo: TipoBloque) => {
    const id = anadir(tipo);
    setCatalogo(false);
    setAbiertoId(id);
    window.setTimeout(() => document.getElementById(`bloque-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 120);
  };

  return (
    <>
      <AnimatePresence>
        {!editando && (
          <motion.button
            type="button"
            onClick={() => setEditando(true)}
            className="cristal cristal-fuerte boton fixed bottom-16 right-4 z-[60] px-4 py-3 text-[13px] sm:bottom-5 sm:right-5"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Icono nombre="lapiz" className="h-4 w-4" />
            <span className="hidden sm:inline">Editar página</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editando && (
          <motion.aside
            className="cristal cristal-fuerte fixed inset-x-2 bottom-2 z-[80] flex max-h-[78svh] flex-col overflow-hidden rounded-[28px] sm:inset-x-auto sm:bottom-3 sm:right-3 sm:top-3 sm:max-h-none sm:w-[400px]"
            initial={{ opacity: 0, x: 40, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            aria-label="Editor de la portada"
          >
            <div className="flex items-start justify-between gap-3 border-b border-[var(--d-borde)] p-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--d-acento)]">Modo edición · demo</p>
                <h2 className="mt-1 text-xl font-extrabold tracking-tight">Secciones de la portada</h2>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--d-suave)]">
                  Arrastra para reordenar, oculta, cambia textos o crea secciones nuevas. Así funcionará tu panel; aquí los
                  cambios solo se guardan en este navegador.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditando(false)}
                aria-label="Cerrar editor"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-[var(--d-cristal)]"
              >
                <Icono nombre="cerrar" className="h-5 w-5" />
              </button>
            </div>

            <div className="sin-barra flex-1 overflow-y-auto p-3" data-lenis-prevent>
              <Reorder.Group axis="y" values={bloques} onReorder={setBloques} className="flex flex-col gap-2">
                {bloques.map((b) => (
                  <Fila
                    key={b.id}
                    bloque={b}
                    abierto={abiertoId === b.id}
                    alAbrir={() => setAbiertoId(abiertoId === b.id ? null : b.id)}
                  />
                ))}
              </Reorder.Group>

              <AnimatePresence initial={false}>
                {catalogo && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 grid grid-cols-1 gap-2 rounded-3xl border border-dashed border-[var(--d-borde)] p-2">
                      {(Object.keys(CATALOGO) as TipoBloque[]).map((tipo) => (
                        <button
                          key={tipo}
                          type="button"
                          onClick={() => crear(tipo)}
                          className="rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-[var(--d-cristal)]"
                        >
                          <span className="block text-sm font-semibold">{CATALOGO[tipo].nombre}</span>
                          <span className="block text-xs text-[var(--d-suave)]">{CATALOGO[tipo].descripcion}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-2 border-t border-[var(--d-borde)] p-3">
              <button type="button" onClick={() => setCatalogo((v) => !v)} className="boton boton-acento flex-1 px-4 py-2.5 text-sm">
                <Icono nombre={catalogo ? "cerrar" : "mas"} className="h-4 w-4" />
                {catalogo ? "Cancelar" : "Añadir sección"}
              </button>
              <button
                type="button"
                onClick={() => {
                  restablecer();
                  setAbiertoId(null);
                }}
                className="boton px-4 py-2.5 text-sm text-[var(--d-suave)] hover:bg-[var(--d-cristal)]"
                title="Volver a la portada original"
              >
                <Icono nombre="reiniciar" className="h-4 w-4" />
                Restablecer
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

function Fila({ bloque, abierto, alAbrir }: { bloque: Bloque; abierto: boolean; alAbrir: () => void }) {
  const { actualizar, quitar } = useEstadoD();
  const controles = useDragControls();
  const info = CATALOGO[bloque.tipo];

  return (
    <Reorder.Item
      value={bloque}
      dragListener={false}
      dragControls={controles}
      className={`rounded-3xl border border-[var(--d-borde)] bg-[var(--d-cristal)] transition-opacity ${bloque.visible ? "" : "opacity-50"}`}
      whileDrag={{ scale: 1.03, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.5)" }}
    >
      <div className="flex items-center gap-1 p-2">
        <button
          type="button"
          onPointerDown={(e) => controles.start(e)}
          className="flex h-9 w-7 shrink-0 cursor-grab touch-none items-center justify-center text-[var(--d-tenue)] active:cursor-grabbing"
          aria-label={`Arrastrar ${info.nombre}`}
        >
          <Icono nombre="asa" className="h-4 w-4" />
        </button>
        <button type="button" onClick={alAbrir} className="min-w-0 flex-1 text-left">
          <span className="block truncate text-sm font-semibold">{bloque.datos.titulo || info.nombre}</span>
          <span className="block text-[11px] text-[var(--d-tenue)]">{info.nombre}</span>
        </button>
        <button
          type="button"
          onClick={() => actualizar(bloque.id, { visible: !bloque.visible })}
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[var(--d-cristal)]"
          aria-label={bloque.visible ? "Ocultar sección" : "Mostrar sección"}
        >
          <Icono nombre={bloque.visible ? "ojo" : "ojo-no"} className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={alAbrir}
          className={`flex h-9 w-9 items-center justify-center rounded-full hover:bg-[var(--d-cristal)] ${abierto ? "text-[var(--d-acento)]" : ""}`}
          aria-label="Editar textos"
        >
          <Icono nombre="lapiz" className="h-4 w-4" />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {abierto && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2 px-3 pb-3">
              {bloque.datos.antetitulo !== undefined && (
                <Campo etiqueta="Antetítulo" valor={bloque.datos.antetitulo} alCambiar={(v) => actualizar(bloque.id, { datos: { antetitulo: v } })} />
              )}
              <Campo etiqueta="Título" valor={bloque.datos.titulo} alCambiar={(v) => actualizar(bloque.id, { datos: { titulo: v } })} />
              {bloque.datos.texto !== undefined && (
                <Campo largo etiqueta="Texto" valor={bloque.datos.texto} alCambiar={(v) => actualizar(bloque.id, { datos: { texto: v } })} />
              )}
              <button
                type="button"
                onClick={() => quitar(bloque.id)}
                className="mt-1 inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1.5 text-xs text-[var(--d-acento)] hover:bg-[var(--d-cristal)]"
              >
                <Icono nombre="papelera" className="h-3.5 w-3.5" />
                Borrar sección
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Reorder.Item>
  );
}

function Campo({ etiqueta, valor, alCambiar, largo }: { etiqueta: string; valor: string; alCambiar: (v: string) => void; largo?: boolean }) {
  const clase =
    "w-full rounded-2xl border border-[var(--d-borde)] bg-[var(--d-fondo)]/40 px-3 py-2 text-sm outline-none transition-colors focus:border-[var(--d-acento)]";
  return (
    <label className="flex flex-col gap-1">
      <span className="px-1 text-[11px] font-medium text-[var(--d-tenue)]">{etiqueta}</span>
      {largo ? (
        <textarea rows={4} value={valor} onChange={(e) => alCambiar(e.target.value)} className={`${clase} resize-none`} />
      ) : (
        <input value={valor} onChange={(e) => alCambiar(e.target.value)} className={clase} />
      )}
    </label>
  );
}
