"use client";

import { AnimatePresence, motion, Reorder, useDragControls } from "motion/react";
import { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import { Icono } from "@/components/Iconos";
import { CURVA } from "@/styles/movimiento";
import { EditorDocumento } from "./EditorDocumento";
import { Miniatura, SelectorMedios, useMediosConocidos, useSoltarArchivos } from "./medios";
import { aSlug, idYoutube, type Campo, type Opcion, type OpcionesFormulario } from "./tipos";

type Datos = Record<string, unknown>;

const ContextoOpciones = createContext<OpcionesFormulario>({});
export function ProveedorOpciones({ opciones, children }: { opciones: OpcionesFormulario; children: React.ReactNode }) {
  return <ContextoOpciones.Provider value={opciones}>{children}</ContextoOpciones.Provider>;
}

/**
 * Pinta los campos de un formulario. `datos` es el objeto de este nivel y `cambiar(clave, valor)` lo cambia.
 * Los campos de media fila (`medio`) se ponen de dos en dos en pantallas anchas.
 */
export function Campos({ campos, datos, cambiar }: { campos: Campo[]; datos: Datos; cambiar: (clave: string, valor: unknown) => void }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-5">
      {campos.filter((c) => !c.si || c.si.valores.includes(String(datos?.[c.si.clave] ?? ""))).map((c) => (
        <div key={c.clave} className={c.medio ? "col-span-2 sm:col-span-1" : "col-span-2"}>
          <UnCampo campo={c} valor={datos?.[c.clave]} datos={datos} cambiar={(v) => cambiar(c.clave, v)} />
        </div>
      ))}
    </div>
  );
}

function Etiqueta({ campo, htmlFor, extra }: { campo: Campo; htmlFor?: string; extra?: React.ReactNode }) {
  return (
    <div className="mb-1.5 flex items-end justify-between gap-2">
      <label htmlFor={htmlFor} className="campo-etiqueta">
        {campo.etiqueta}
      </label>
      {extra}
    </div>
  );
}
const Ayuda = ({ texto }: { texto?: string }) => (texto ? <span className="campo-ayuda">{texto}</span> : null);

const cadena = (v: unknown) => (typeof v === "string" ? v : v == null ? "" : String(v));
const listaDe = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

function UnCampo({ campo, valor, datos, cambiar }: { campo: Campo; valor: unknown; datos: Datos; cambiar: (v: unknown) => void }) {
  const id = useId();
  const opciones = useContext(ContextoOpciones);

  switch (campo.tipo) {
    case "texto":
      return (
        <>
          <Etiqueta campo={campo} htmlFor={id} />
          <input id={id} className="campo" value={cadena(valor)} placeholder={campo.placeholder} onChange={(e) => cambiar(e.target.value)} />
          <Ayuda texto={campo.ayuda} />
        </>
      );

    case "largo":
      return (
        <>
          <Etiqueta campo={campo} htmlFor={id} />
          <AreaTexto id={id} valor={cadena(valor)} filas={campo.filas ?? 4} placeholder={campo.placeholder} alCambiar={cambiar} />
          <Ayuda texto={campo.ayuda ?? "Línea en blanco = párrafo nuevo · **negrita** · *cursiva*"} />
        </>
      );

    case "numero":
      return (
        <>
          <Etiqueta campo={campo} htmlFor={id} />
          <input
            id={id}
            type="number"
            inputMode="decimal"
            className="campo"
            value={typeof valor === "number" ? valor : ""}
            min={campo.min}
            max={campo.max}
            step={campo.paso ?? 1}
            placeholder={campo.placeholder}
            onChange={(e) => cambiar(e.target.value === "" ? null : Number(e.target.value))}
          />
          <Ayuda texto={campo.ayuda} />
        </>
      );

    case "interruptor":
      return (
        <div className="flex items-start justify-between gap-4 rounded-[18px] border border-[var(--jm-borde)] bg-black/15 px-4 py-3">
          <div>
            <span className="text-sm font-semibold">{campo.etiqueta}</span>
            <Ayuda texto={campo.ayuda} />
          </div>
          <button type="button" role="switch" aria-checked={valor === true} aria-label={campo.etiqueta} className="interruptor mt-0.5" onClick={() => cambiar(valor !== true)} />
        </div>
      );

    case "seleccion": {
      const lista: Opcion[] = typeof campo.opciones === "string" ? (opciones[campo.opciones] ?? []) : campo.opciones;
      return (
        <>
          <Etiqueta campo={campo} htmlFor={id} />
          <select id={id} className="campo" value={cadena(valor)} onChange={(e) => cambiar(e.target.value || null)}>
            {!campo.obligatorio && <option value="">{campo.vacio ?? "Sin elegir"}</option>}
            {lista.map((o) => (
              <option key={o.valor} value={o.valor}>
                {o.nombre}
              </option>
            ))}
          </select>
          <Ayuda texto={campo.ayuda} />
        </>
      );
    }

    case "multiple": {
      const lista: Opcion[] = typeof campo.opciones === "string" ? (opciones[campo.opciones] ?? []) : campo.opciones;
      const elegidos = listaDe<string>(valor);
      return (
        <>
          <Etiqueta campo={campo} />
          <div className="flex flex-wrap gap-2">
            {lista.map((o) => {
              const si = elegidos.includes(o.valor);
              return (
                <motion.button
                  key={o.valor}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  aria-pressed={si}
                  onClick={() => cambiar(si ? elegidos.filter((x) => x !== o.valor) : [...elegidos, o.valor])}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                    si ? "border-transparent bg-[var(--jm-acento)] text-white" : "border-[var(--jm-borde)] bg-[var(--jm-cristal)] hover:border-white/30"
                  }`}
                >
                  {si && "✓ "}
                  {o.nombre}
                </motion.button>
              );
            })}
          </div>
          <Ayuda texto={campo.ayuda} />
        </>
      );
    }

    case "proyectos":
      return (
        <>
          <Etiqueta campo={campo} />
          <CampoProyectos valor={listaDe<string>(valor)} opciones={opciones.proyectos ?? []} alCambiar={cambiar} />
          <Ayuda texto={campo.ayuda} />
        </>
      );

    case "proyecto":
      return (
        <>
          <Etiqueta campo={campo} htmlFor={id} />
          <select id={id} className="campo" value={cadena(valor)} onChange={(e) => cambiar(e.target.value || null)}>
            <option value="">Elige un proyecto</option>
            {(opciones.proyectos ?? []).map((o) => (
              <option key={o.valor} value={o.valor}>
                {o.nombre}
              </option>
            ))}
          </select>
          <Ayuda texto={campo.ayuda} />
        </>
      );

    case "medio":
      return (
        <>
          <Etiqueta campo={campo} />
          <CampoMedio valor={typeof valor === "string" ? valor : null} acepta={campo.acepta ?? "imagen"} alCambiar={cambiar} />
          <Ayuda texto={campo.ayuda} />
        </>
      );

    case "galeria":
      return (
        <>
          <Etiqueta campo={campo} extra={<span className="text-xs text-[var(--jm-tenue)]">{listaDe(valor).length || ""}</span>} />
          <CampoGaleria valor={listaDe<{ medio: string; pie?: string }>(valor)} alCambiar={cambiar} />
          <Ayuda texto={campo.ayuda ?? "Arrastra fotos aquí para subirlas. Arrastra las miniaturas para ordenarlas."} />
        </>
      );

    case "youtube":
      return (
        <>
          <Etiqueta campo={campo} htmlFor={id} />
          <CampoYoutube id={id} valor={cadena(valor)} alCambiar={cambiar} />
          <Ayuda texto={campo.ayuda ?? "Pega el enlace del vídeo de YouTube"} />
        </>
      );

    case "videos":
      return (
        <>
          <Etiqueta campo={campo} />
          <CampoVideos valor={listaDe<Datos>(valor)} alCambiar={cambiar} />
          <Ayuda texto={campo.ayuda} />
        </>
      );

    case "textos":
      return (
        <>
          <Etiqueta campo={campo} />
          <CampoTextos valor={listaDe<string>(valor)} placeholder={campo.placeholder} largo={campo.largo} alCambiar={cambiar} />
          <Ayuda texto={campo.ayuda} />
        </>
      );

    case "lista":
      return (
        <>
          <Etiqueta campo={campo} />
          <CampoLista campo={campo} valor={listaDe<Datos>(valor)} alCambiar={cambiar} />
          <Ayuda texto={campo.ayuda} />
        </>
      );

    case "grupo": {
      const objeto = valor && typeof valor === "object" && !Array.isArray(valor) ? (valor as Datos) : {};
      return (
        <fieldset className="rounded-[22px] border border-[var(--jm-borde)] bg-black/10 p-4">
          <legend className="campo-etiqueta px-2">{campo.etiqueta}</legend>
          <Campos campos={campo.campos} datos={objeto} cambiar={(k, v) => cambiar({ ...objeto, [k]: v })} />
          <Ayuda texto={campo.ayuda} />
        </fieldset>
      );
    }

    case "slug": {
      const desde = campo.desde ? cadena(datos?.[campo.desde]) : "";
      return (
        <>
          <Etiqueta
            campo={campo}
            htmlFor={id}
            extra={
              desde && aSlug(desde) !== cadena(valor) ? (
                <button type="button" onClick={() => cambiar(aSlug(desde))} className="text-xs font-semibold text-[var(--jm-acento)] hover:underline">
                  Sacar del título
                </button>
              ) : null
            }
          />
          <div className="campo flex items-center gap-0 !p-0">
            <span className="select-none whitespace-nowrap py-[0.7rem] pl-[0.9rem] text-[var(--jm-tenue)]">{campo.prefijo}</span>
            <input
              id={id}
              className="min-w-0 flex-1 bg-transparent py-[0.7rem] pr-[0.9rem] outline-none"
              value={cadena(valor)}
              onChange={(e) => cambiar(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
              onBlur={(e) => cambiar(aSlug(e.target.value))}
            />
          </div>
          <Ayuda texto={campo.ayuda ?? "La dirección de la página. Si la cambias cuando ya está publicada, la antigua lleva a la nueva."} />
        </>
      );
    }

    case "enlace": {
      const v = cadena(valor);
      const mal = v !== "" && !/^https:\/\/[^\s]+\.[^\s]+/.test(v);
      return (
        <>
          <Etiqueta campo={campo} htmlFor={id} />
          <input
            id={id}
            type="url"
            inputMode="url"
            className="campo"
            value={v}
            placeholder={campo.placeholder ?? "https://"}
            onChange={(e) => cambiar(e.target.value.trim() || null)}
            onBlur={(e) => {
              const t = e.target.value.trim();
              // Quien pega «www.algo.com» casi siempre quiere https
              if (t && !/^https?:\/\//.test(t)) cambiar(`https://${t}`);
              else if (t.startsWith("http://")) cambiar(t.replace(/^http:/, "https:"));
            }}
          />
          {mal ? <span className="campo-ayuda !text-[#ff9f0a]">Tiene que empezar por https:// para que se pueda publicar</span> : <Ayuda texto={campo.ayuda} />}
        </>
      );
    }

    case "fecha":
      return (
        <>
          <Etiqueta campo={campo} htmlFor={id} />
          <input id={id} type="date" className="campo" value={cadena(valor).slice(0, 10)} onChange={(e) => cambiar(e.target.value || null)} />
          <Ayuda texto={campo.ayuda} />
        </>
      );

    case "documento":
      return (
        <>
          <Etiqueta campo={campo} />
          <EditorDocumento valor={valor} alCambiar={cambiar} />
          <Ayuda texto={campo.ayuda} />
        </>
      );

    case "google": {
      const titulo = cadena(datos?.[campo.titulo]) || (campo.respaldoTitulo ? cadena(datos?.[campo.respaldoTitulo]) : "");
      const descripcion = cadena(datos?.[campo.descripcion]) || (campo.respaldoDescripcion ? cadena(datos?.[campo.respaldoDescripcion]) : "");
      const slug = cadena(datos?.slug);
      const largoT = cadena(datos?.[campo.titulo]).length;
      const largoD = cadena(datos?.[campo.descripcion]).length;
      return (
        <>
          <Etiqueta campo={campo} />
          <div className="rounded-[20px] bg-white px-5 py-4 font-[arial,sans-serif] text-left">
            {/* El dominio aún no está decidido: se enseña el nombre de la web y la ruta, como hace Google */}
            <p className="truncate text-[14px] leading-tight text-[#202124]">Josep Mira Lozano</p>
            <p className="truncate text-[12px] text-[#4d5156]">… › {(campo.prefijo + slug).replace(/^\//, "").replace(/\//g, " › ")}</p>
            <p className="mt-1 truncate text-[19px] leading-snug text-[#1a0dab]">{titulo || "Título de la página"}</p>
            <p className="mt-1 line-clamp-2 text-[13.5px] leading-[1.55] text-[#4d5156]">{descripcion || "La descripción que se lee en los resultados de Google."}</p>
          </div>
          <span className="campo-ayuda">
            Título: {largoT} de ~60 caracteres{largoT > 60 ? " (Google lo cortará)" : ""} · Descripción: {largoD} de ~155{largoD > 155 ? " (se cortará)" : ""}
          </span>
        </>
      );
    }

    case "nota":
      return <p className="rounded-[18px] border border-[var(--jm-borde)] bg-white/[0.03] px-4 py-3 text-[13px] leading-relaxed text-[var(--jm-suave)]">{campo.etiqueta}</p>;
  }
}

/** Área de texto que crece con lo que se escribe */
export function AreaTexto({ id, valor, filas, placeholder, alCambiar }: { id?: string; valor: string; filas: number; placeholder?: string; alCambiar: (v: string) => void }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const t = ref.current;
    if (!t) return;
    t.style.height = "auto";
    t.style.height = `${t.scrollHeight + 2}px`;
  }, [valor]);
  return <textarea ref={ref} id={id} rows={filas} className="campo !resize-none" value={valor} placeholder={placeholder} onChange={(e) => alCambiar(e.target.value)} />;
}

// ---- Imagen o vídeo -------------------------------------------------------------------------------

export function CampoMedio({ valor, acepta, alCambiar }: { valor: string | null; acepta: "imagen" | "video" | "todo"; alCambiar: (v: string | null) => void }) {
  const { medios } = useMediosConocidos();
  const [abierto, setAbierto] = useState(false);
  const { encima, subiendo, error, manejadores, fotoElegida } = useSoltarArchivos((m) => alCambiar(m[0].id), { elegirFoco: true });
  const medio = valor ? medios[valor] : null;

  return (
    <div {...manejadores}>
      {fotoElegida}
      <div
        className={`flex items-center gap-4 rounded-[20px] border p-2.5 transition-colors duration-300 ${
          encima ? "border-[var(--jm-acento)] bg-[rgba(229,9,20,0.08)]" : "border-[var(--jm-borde)] bg-black/15"
        }`}
      >
        <button type="button" onClick={() => setAbierto(true)} className="relative h-20 w-28 shrink-0 overflow-hidden rounded-[14px]" aria-label="Cambiar">
          <Miniatura medio={medio} className="absolute inset-0 h-full w-full" />
          {subiendo > 0 && <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs font-semibold text-white">Subiendo…</span>}
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{medio ? (medio.alt || (medio.tipo === "video" ? "Vídeo" : "Imagen")) : valor ? "Cargando…" : "Sin elegir"}</p>
          <p className="mt-0.5 text-xs text-[var(--jm-tenue)]">Arrastra un archivo aquí o elige</p>
          <div className="mt-2 flex gap-1.5">
            <button type="button" onClick={() => setAbierto(true)} className="boton boton-suave px-3.5 py-1.5 text-xs">
              {valor ? "Cambiar" : "Elegir"}
            </button>
            {valor && (
              <button type="button" onClick={() => alCambiar(null)} className="boton px-3 py-1.5 text-xs text-[var(--jm-suave)] hover:bg-[var(--jm-cristal)]">
                Quitar
              </button>
            )}
          </div>
        </div>
      </div>
      {error && <p className="mt-2 text-xs text-[#ff6b6b]">{error}</p>}
      <SelectorMedios abierto={abierto} alCerrar={() => setAbierto(false)} acepta={acepta} alElegir={(m) => alCambiar(m[0].id)} />
    </div>
  );
}

// ---- Galería --------------------------------------------------------------------------------------

type Foto = { medio: string; pie?: string };

export function CampoGaleria({ valor, alCambiar }: { valor: Foto[]; alCambiar: (v: Foto[]) => void }) {
  const { medios } = useMediosConocidos();
  const [abierto, setAbierto] = useState(false);
  const [arrastrada, setArrastrada] = useState<number | null>(null);
  const [destino, setDestino] = useState<number | null>(null);
  const [pieAbierto, setPieAbierto] = useState<number | null>(null);
  const anadir = (m: { id: string }[]) => alCambiar([...valor, ...m.map((x) => ({ medio: x.id, pie: "" }))]);
  const { encima, subiendo, error, manejadores, fotoElegida } = useSoltarArchivos(anadir, { multiple: true, elegirFoco: true });

  const mover = (de: number, a: number) => {
    if (a < 0 || a >= valor.length || de === a) return;
    const copia = [...valor];
    const [x] = copia.splice(de, 1);
    copia.splice(a, 0, x);
    alCambiar(copia);
  };

  return (
    <div {...manejadores} className={`rounded-[22px] border p-2.5 transition-colors duration-300 ${encima ? "border-[var(--jm-acento)] bg-[rgba(229,9,20,0.08)]" : "border-[var(--jm-borde)] bg-black/15"}`}>
      {fotoElegida}
      {fotoElegida}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {valor.map((f, i) => (
          <div
            key={`${f.medio}-${i}`}
            draggable
            onDragStart={(e) => {
              setArrastrada(i);
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragOver={(e) => {
              if (arrastrada === null) return;
              e.preventDefault();
              setDestino(i);
            }}
            onDrop={(e) => {
              if (arrastrada === null) return;
              e.preventDefault();
              mover(arrastrada, i);
              setArrastrada(null);
              setDestino(null);
            }}
            onDragEnd={() => {
              setArrastrada(null);
              setDestino(null);
            }}
            className={`group relative aspect-[4/3] cursor-grab overflow-hidden rounded-[14px] ring-2 transition-[opacity,box-shadow] duration-200 active:cursor-grabbing ${
              destino === i && arrastrada !== i ? "ring-[var(--jm-acento)]" : "ring-transparent"
            } ${arrastrada === i ? "opacity-40" : ""}`}
          >
            <Miniatura medio={medios[f.medio]} className="pointer-events-none absolute inset-0 h-full w-full" />
            {i === 0 && <span className="absolute left-1.5 top-1.5 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white transition-opacity duration-200 group-hover:opacity-0 group-focus-within:opacity-0">Primera</span>}
            {f.pie && <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/80 to-transparent px-2 pb-1 pt-4 text-[10px] text-white">{f.pie}</span>}
            <div className="absolute inset-x-1 top-1 flex justify-end gap-0.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
              <BotonFoto icono="izquierda" etiqueta="Mover antes" onClick={() => mover(i, i - 1)} />
              <BotonFoto icono="derecha" etiqueta="Mover después" onClick={() => mover(i, i + 1)} />
              <BotonFoto icono="lapiz" etiqueta="Pie de foto" onClick={() => setPieAbierto(pieAbierto === i ? null : i)} />
              <BotonFoto icono="cerrar" etiqueta="Quitar de la galería" onClick={() => alCambiar(valor.filter((_, n) => n !== i))} />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setAbierto(true)}
          className="flex aspect-[4/3] flex-col items-center justify-center gap-1 rounded-[14px] border-2 border-dashed border-[var(--jm-borde)] text-[var(--jm-suave)] transition-colors hover:border-white/30 hover:text-[var(--jm-texto)]"
        >
          <Icono nombre={subiendo ? "subir" : "mas"} className="h-5 w-5" />
          <span className="text-[11px] font-semibold">{subiendo ? `Subiendo ${subiendo}…` : "Añadir"}</span>
        </button>
      </div>
      <AnimatePresence>
        {pieAbierto !== null && valor[pieAbierto] && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <label className="mt-3 block">
              <span className="campo-etiqueta">Pie de la foto {pieAbierto + 1}</span>
              <input
                autoFocus
                className="campo mt-1.5"
                value={valor[pieAbierto].pie ?? ""}
                onChange={(e) => alCambiar(valor.map((f, n) => (n === pieAbierto ? { ...f, pie: e.target.value } : f)))}
                onKeyDown={(e) => e.key === "Enter" && setPieAbierto(null)}
              />
            </label>
          </motion.div>
        )}
      </AnimatePresence>
      {error && <p className="mt-2 text-xs text-[#ff6b6b]">{error}</p>}
      <SelectorMedios abierto={abierto} alCerrar={() => setAbierto(false)} multiple alElegir={anadir} titulo="Añadir a la galería" />
    </div>
  );
}

function BotonFoto({ icono, etiqueta, onClick }: { icono: string; etiqueta: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label={etiqueta} title={etiqueta} className="flex h-6 w-6 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur hover:bg-black/85">
      <Icono nombre={icono} className="h-3.5 w-3.5" />
    </button>
  );
}

// ---- YouTube --------------------------------------------------------------------------------------

function CampoYoutube({ id, valor, alCambiar }: { id: string; valor: string; alCambiar: (v: string | null) => void }) {
  const [texto, setTexto] = useState(valor);
  useEffect(() => setTexto(valor), [valor]);
  const vid = idYoutube(texto);
  const malo = texto.trim() !== "" && !vid;
  return (
    <div className="flex items-center gap-3">
      <input
        id={id}
        className={`campo ${malo ? "!border-[#ff6b6b]" : ""}`}
        value={texto}
        placeholder="https://youtu.be/…"
        onChange={(e) => {
          setTexto(e.target.value);
          const v = idYoutube(e.target.value);
          if (v) alCambiar(v);
          else if (!e.target.value.trim()) alCambiar(null);
        }}
        onBlur={() => vid && setTexto(vid)}
      />
      {vid && <img src={`https://i.ytimg.com/vi/${vid}/mqdefault.jpg`} alt="" className="h-12 w-[86px] shrink-0 rounded-[10px] object-cover" />}
      {malo && <span className="shrink-0 text-xs text-[#ff6b6b]">Enlace no válido</span>}
    </div>
  );
}

// ---- Vídeos extra ---------------------------------------------------------------------------------

const TIPOS_VIDEO: Opcion[] = [
  { valor: "youtube", nombre: "YouTube" },
  { valor: "youtube-short", nombre: "YouTube Short" },
  { valor: "instagram", nombre: "Instagram" },
  { valor: "archivo", nombre: "Archivo propio (mp4)" },
];

function CampoVideos({ valor, alCambiar }: { valor: Datos[]; alCambiar: (v: Datos[]) => void }) {
  const cambiarUno = (i: number, nuevo: Datos) => alCambiar(valor.map((v, n) => (n === i ? nuevo : v)));
  return (
    <div className="flex flex-col gap-2">
      {valor.map((v, i) => {
        const tipo = cadena(v.tipo) || "youtube";
        return (
          <div key={i} className="rounded-[20px] border border-[var(--jm-borde)] bg-black/15 p-3">
            <div className="flex items-center gap-2">
              <select className="campo !w-auto !py-2 text-sm" value={tipo} onChange={(e) => cambiarUno(i, { tipo: e.target.value, titulo: v.titulo ?? "" })} aria-label="Tipo de vídeo">
                {TIPOS_VIDEO.map((o) => (
                  <option key={o.valor} value={o.valor}>
                    {o.nombre}
                  </option>
                ))}
              </select>
              <input className="campo !py-2 text-sm" placeholder="Título (opcional)" value={cadena(v.titulo)} onChange={(e) => cambiarUno(i, { ...v, titulo: e.target.value })} />
              <OrdenLista i={i} total={valor.length} lista={valor} alCambiar={alCambiar} />
            </div>
            <div className="mt-2">
              {tipo === "archivo" ? (
                <CampoMedio valor={typeof v.medio === "string" ? v.medio : null} acepta="video" alCambiar={(m) => cambiarUno(i, { tipo, titulo: v.titulo ?? "", medio: m })} />
              ) : tipo === "instagram" ? (
                <input className="campo" placeholder="https://www.instagram.com/reel/…" value={cadena(v.url)} onChange={(e) => cambiarUno(i, { tipo, titulo: v.titulo ?? "", url: e.target.value.trim() })} />
              ) : (
                <CampoYoutube id={`video-${i}`} valor={cadena(v.id)} alCambiar={(id) => cambiarUno(i, { tipo, titulo: v.titulo ?? "", id })} />
              )}
            </div>
          </div>
        );
      })}
      <BotonAnadir texto="Añadir vídeo" onClick={() => alCambiar([...valor, { tipo: "youtube", titulo: "" }])} />
    </div>
  );
}

/** Subir, bajar y quitar un elemento de una lista */
function OrdenLista<T>({ i, total, lista, alCambiar }: { i: number; total: number; lista: T[]; alCambiar: (v: T[]) => void }) {
  const mover = (a: number) => {
    const copia = [...lista];
    const [x] = copia.splice(i, 1);
    copia.splice(a, 0, x);
    alCambiar(copia);
  };
  return (
    <div className="flex shrink-0">
      <button type="button" className="boton-icono !h-8 !w-8" disabled={i === 0} onClick={() => mover(i - 1)} aria-label="Subir">
        <Icono nombre="arriba" className="h-4 w-4" />
      </button>
      <button type="button" className="boton-icono !h-8 !w-8" disabled={i === total - 1} onClick={() => mover(i + 1)} aria-label="Bajar">
        <Icono nombre="abajo" className="h-4 w-4" />
      </button>
      <button type="button" className="boton-icono !h-8 !w-8 hover:!text-[#ff6b6b]" onClick={() => alCambiar(lista.filter((_, n) => n !== i))} aria-label="Quitar">
        <Icono nombre="papelera" className="h-4 w-4" />
      </button>
    </div>
  );
}

function BotonAnadir({ texto, onClick }: { texto: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-1.5 rounded-[18px] border border-dashed border-[var(--jm-borde)] px-4 py-2.5 text-sm font-semibold text-[var(--jm-suave)] transition-colors hover:border-white/30 hover:text-[var(--jm-texto)]"
    >
      <Icono nombre="mas" className="h-4 w-4" />
      {texto}
    </button>
  );
}

// ---- Listas ---------------------------------------------------------------------------------------

function CampoTextos({ valor, placeholder, largo, alCambiar }: { valor: string[]; placeholder?: string; largo?: boolean; alCambiar: (v: string[]) => void }) {
  const cambiarUno = (i: number, v: string) => alCambiar(valor.map((x, n) => (n === i ? v : x)));
  return (
    <div className="flex flex-col gap-2">
      {valor.map((t, i) => (
        <div key={i} className={`flex gap-1 ${largo ? "items-start" : "items-center"}`}>
          {largo ? (
            <div className="min-w-0 flex-1">
              <AreaTexto valor={t} filas={3} placeholder={placeholder} alCambiar={(v) => cambiarUno(i, v)} />
            </div>
          ) : (
            <input className="campo !py-2" value={t} placeholder={placeholder} onChange={(e) => cambiarUno(i, e.target.value)} />
          )}
          <OrdenLista i={i} total={valor.length} lista={valor} alCambiar={alCambiar} />
        </div>
      ))}
      <BotonAnadir texto="Añadir" onClick={() => alCambiar([...valor, ""])} />
    </div>
  );
}

/** Proyectos elegidos, en su orden (subir, bajar, quitar), y un desplegable para añadir otro */
function CampoProyectos({ valor, opciones, alCambiar }: { valor: string[]; opciones: Opcion[]; alCambiar: (v: string[]) => void }) {
  const nombre = (id: string) => opciones.find((o) => o.valor === id)?.nombre ?? "Proyecto que ya no existe";
  const libres = opciones.filter((o) => !valor.includes(o.valor));
  return (
    <div className="flex flex-col gap-2">
      {valor.map((id, i) => (
        <div key={id} className="flex items-center gap-1 rounded-[18px] border border-[var(--jm-borde)] bg-[var(--jm-cristal)] py-1 pl-4 pr-1">
          <span className="min-w-0 flex-1 truncate text-sm font-medium">{nombre(id)}</span>
          <OrdenLista i={i} total={valor.length} lista={valor} alCambiar={alCambiar} />
        </div>
      ))}
      {libres.length > 0 && (
        <select className="campo" value="" onChange={(e) => e.target.value && alCambiar([...valor, e.target.value])} aria-label="Añadir un proyecto">
          <option value="">+ Añadir un proyecto</option>
          {libres.map((o) => (
            <option key={o.valor} value={o.valor}>
              {o.nombre}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

type ConClave = { clave: string; datos: Datos };
let contador = 0;

/** Lista de objetos que se ordenan arrastrando por el asa. Cada elemento se pliega para que la lista se lea de un vistazo. */
function CampoLista({ campo, valor, alCambiar }: { campo: Extract<Campo, { tipo: "lista" }>; valor: Datos[]; alCambiar: (v: Datos[]) => void }) {
  // Claves estables para que Reorder anime bien aunque dos elementos sean iguales
  const [claves, setClaves] = useState<string[]>(() => valor.map(() => `e${contador++}`));
  const [abierto, setAbierto] = useState<string | null>(null);
  const items: ConClave[] = valor.map((datos, i) => ({ clave: claves[i] ?? `e-${i}`, datos }));
  const largo = valor.length;
  useEffect(() => {
    if (claves.length !== largo) setClaves((c) => Array.from({ length: largo }, (_, i) => c[i] ?? `e${contador++}`));
  }, [largo, claves.length]);

  const nombre = (d: Datos, i: number) => (campo.titulo && cadena(d[campo.titulo])) || `${campo.elemento ?? "Elemento"} ${i + 1}`;

  return (
    <div className="flex flex-col gap-2">
      <Reorder.Group
        axis="y"
        values={items}
        onReorder={(nuevos: ConClave[]) => {
          setClaves(nuevos.map((x) => x.clave));
          alCambiar(nuevos.map((x) => x.datos));
        }}
        className="flex flex-col gap-2"
      >
        {items.map((it, i) => (
          <ElementoLista
            key={it.clave}
            item={it}
            nombre={nombre(it.datos, i)}
            abierto={abierto === it.clave}
            alAbrir={() => setAbierto(abierto === it.clave ? null : it.clave)}
            alQuitar={() => {
              setClaves(claves.filter((_, n) => n !== i));
              alCambiar(valor.filter((_, n) => n !== i));
            }}
          >
            <Campos campos={campo.campos} datos={it.datos} cambiar={(k, v) => alCambiar(valor.map((d, n) => (n === i ? { ...d, [k]: v } : d)))} />
          </ElementoLista>
        ))}
      </Reorder.Group>
      <BotonAnadir
        texto={`Añadir ${(campo.elemento ?? "elemento").toLowerCase()}`}
        onClick={() => {
          const clave = `e${contador++}`;
          setClaves([...claves, clave]);
          setAbierto(clave);
          alCambiar([...valor, { ...campo.nuevo }]);
        }}
      />
    </div>
  );
}

function ElementoLista({ item, nombre, abierto, alAbrir, alQuitar, children }: { item: ConClave; nombre: string; abierto: boolean; alAbrir: () => void; alQuitar: () => void; children: React.ReactNode }) {
  const controles = useDragControls();
  return (
    <Reorder.Item value={item} dragListener={false} dragControls={controles} className="rounded-[20px] border border-[var(--jm-borde)] bg-black/15" whileDrag={{ scale: 1.02, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.5)" }}>
      <div className="flex items-center gap-1 p-1.5">
        <button type="button" onPointerDown={(e) => controles.start(e)} className="flex h-8 w-7 shrink-0 cursor-grab touch-none items-center justify-center text-[var(--jm-tenue)] active:cursor-grabbing" aria-label="Arrastrar para ordenar">
          <Icono nombre="asa" className="h-4 w-4" />
        </button>
        <button type="button" onClick={alAbrir} className="min-w-0 flex-1 truncate py-1.5 text-left text-sm font-semibold">
          {nombre}
        </button>
        <button type="button" onClick={alAbrir} className={`boton-icono !h-8 !w-8 ${abierto ? "!text-[var(--jm-acento)]" : ""}`} aria-label="Editar">
          <Icono nombre="lapiz" className="h-4 w-4" />
        </button>
        <button type="button" onClick={alQuitar} className="boton-icono !h-8 !w-8 hover:!text-[#ff6b6b]" aria-label="Quitar">
          <Icono nombre="papelera" className="h-4 w-4" />
        </button>
      </div>
      <AnimatePresence initial={false}>
        {abierto && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: CURVA }} className="overflow-hidden">
            <div className="px-3 pb-3 pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </Reorder.Item>
  );
}
