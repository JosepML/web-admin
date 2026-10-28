"use client";

// Editor visual del cuerpo de un artículo. Se escribe como en un procesador de textos (títulos, negrita, cursiva,
// enlaces, listas, citas) y se meten imágenes y vídeos de YouTube entre párrafos. Guarda el documento con el
// formato que pinta la web (ContenidoArticulo): { type: "doc", content: [...] }, estilo ProseMirror/TipTap.
//
// Sin dependencias: un contentEditable que el navegador gestiona (con su deshacer), y que se traduce a
// documento en cada cambio. Las imágenes y los vídeos son bloques no editables con sus propios controles.

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Icono } from "@/components/Iconos";
import type { MedioBiblioteca } from "@/lib/admin/medios";
import { subirArchivo } from "@/lib/admin/subir";
import type { Medio } from "@/lib/datos/tipos";
import { SelectorMedios, useMediosConocidos } from "./medios";
import { idYoutube } from "./tipos";

type Marca = { type: string; attrs?: Record<string, unknown> };
type Nodo = { type: string; attrs?: Record<string, unknown>; content?: Nodo[]; text?: string; marks?: Marca[] };

// ---- Documento → HTML del editor ------------------------------------------------------------------

const escapar = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const cadena = (v: unknown) => (typeof v === "string" ? v : "");

function enLinea(nodos: Nodo[] = []): string {
  return nodos
    .map((n) => {
      if (n.type === "hardBreak") return "<br>";
      if (n.type !== "text") return enLinea(n.content);
      let h = escapar(n.text ?? "");
      for (const m of n.marks ?? []) {
        if (m.type === "bold") h = `<strong>${h}</strong>`;
        else if (m.type === "italic") h = `<em>${h}</em>`;
        else if (m.type === "link") h = `<a href="${escapar(cadena(m.attrs?.href))}">${h}</a>`;
      }
      return h;
    })
    .join("");
}

/** Texto de un nodo de bloque con párrafos dentro (elemento de lista, cita): los párrafos se unen con saltos */
const parrafosEnLinea = (n: Nodo) => (n.content ?? []).map((p) => (p.type === "paragraph" ? enLinea(p.content) : enLinea([p]))).join("<br>");

const controles = (extra = "") => `
  <div class="jm-doc-controles">${extra}
    <button type="button" data-accion="subir" title="Subir" aria-label="Subir">↑</button>
    <button type="button" data-accion="bajar" title="Bajar" aria-label="Bajar">↓</button>
    <button type="button" data-accion="quitar" title="Quitar" aria-label="Quitar">✕</button>
  </div>`;

function figuraImagen(medio: string, url: string, alt: string, pie: string) {
  return `<figure contenteditable="false" data-tipo="image" data-medio="${escapar(medio)}">
    ${controles('<button type="button" data-accion="cambiar">Cambiar</button>')}
    <img src="${escapar(url)}" alt="" draggable="false">
    <input data-campo="pie" placeholder="Pie de foto (opcional)" value="${escapar(pie)}">
    <input data-campo="alt" placeholder="Descripción para quien no ve la imagen" value="${escapar(alt)}">
  </figure>`;
}

function figuraVideo(id: string, titulo: string) {
  return `<figure contenteditable="false" data-tipo="youtube" data-id="${escapar(id)}">
    ${controles()}
    <div class="jm-doc-video"><img src="https://i.ytimg.com/vi/${escapar(id)}/hqdefault.jpg" alt="" draggable="false"><span>▶ YouTube</span></div>
    <input data-campo="titulo" placeholder="Título del vídeo (opcional)" value="${escapar(titulo)}">
  </figure>`;
}

function aHtml(doc: unknown, medios: Record<string, Medio>): string {
  const raiz = (doc && typeof doc === "object" ? doc : {}) as Nodo;
  const bloque = (n: Nodo): string => {
    switch (n.type) {
      case "paragraph":
        return `<p>${enLinea(n.content) || "<br>"}</p>`;
      case "heading":
        return Number(n.attrs?.level) >= 3 ? `<h3>${enLinea(n.content)}</h3>` : `<h2>${enLinea(n.content)}</h2>`;
      case "bulletList":
      case "orderedList": {
        const t = n.type === "bulletList" ? "ul" : "ol";
        return `<${t}>${(n.content ?? []).map((li) => `<li>${parrafosEnLinea(li) || "<br>"}</li>`).join("")}</${t}>`;
      }
      case "blockquote":
        return `<blockquote>${parrafosEnLinea(n) || "<br>"}</blockquote>`;
      case "horizontalRule":
        return "<hr>";
      case "image": {
        const id = cadena(n.attrs?.medio);
        return figuraImagen(id, medios[id]?.url ?? cadena(n.attrs?.src), cadena(n.attrs?.alt), cadena(n.attrs?.pie));
      }
      case "youtube": {
        const id = idYoutube(cadena(n.attrs?.src) || cadena(n.attrs?.id));
        return id ? figuraVideo(id, cadena(n.attrs?.titulo)) : "";
      }
      default:
        return (n.content ?? []).map(bloque).join("");
    }
  };
  return (raiz.content ?? []).map(bloque).join("") || "<p><br></p>";
}

// ---- HTML del editor → documento ------------------------------------------------------------------

function deLinea(el: Node, marcas: Marca[] = [], fuera: Nodo[] = []): Nodo[] {
  el.childNodes.forEach((h) => {
    if (h.nodeType === Node.TEXT_NODE) {
      const text = (h.textContent ?? "").replace(/​/g, "").replace(/ /g, " ");
      if (!text) return;
      const ultimo = fuera.at(-1);
      // Texto seguido con las mismas marcas: un solo nodo
      if (ultimo?.type === "text" && JSON.stringify(ultimo.marks ?? []) === JSON.stringify(marcas)) ultimo.text += text;
      else fuera.push(marcas.length ? { type: "text", text, marks: marcas } : { type: "text", text });
      return;
    }
    if (!(h instanceof HTMLElement)) return;
    const tag = h.tagName;
    if (tag === "BR") {
      fuera.push({ type: "hardBreak" });
      return;
    }
    let nuevas = marcas;
    const tiene = (t: string) => nuevas.some((m) => m.type === t);
    const negrita = tag === "STRONG" || tag === "B" || /^(bold|[6-9]00)$/.test(h.style.fontWeight);
    const cursiva = tag === "EM" || tag === "I" || h.style.fontStyle === "italic";
    if (negrita && !tiene("bold")) nuevas = [...nuevas, { type: "bold" }];
    if (cursiva && !tiene("italic")) nuevas = [...nuevas, { type: "italic" }];
    if (tag === "A" && h.getAttribute("href")) nuevas = [...nuevas.filter((m) => m.type !== "link"), { type: "link", attrs: { href: h.getAttribute("href") } }];
    deLinea(h, nuevas, fuera);
  });
  return fuera;
}

/** Quita los saltos sueltos del principio y del final (los deja el navegador al vaciar un párrafo) */
function limpiar(nodos: Nodo[]) {
  while (nodos[0]?.type === "hardBreak") nodos.shift();
  while (nodos.at(-1)?.type === "hardBreak") nodos.pop();
  return nodos;
}

const parrafo = (el: Node): Nodo | null => {
  const content = limpiar(deLinea(el));
  return content.length ? { type: "paragraph", content } : null;
};

function aDocumento(raiz: HTMLElement): Nodo {
  const content: Nodo[] = [];
  raiz.childNodes.forEach((h) => {
    if (h.nodeType === Node.TEXT_NODE) {
      const p = h.textContent?.trim() ? { type: "paragraph", content: [{ type: "text", text: h.textContent }] } : null;
      if (p) content.push(p);
      return;
    }
    if (!(h instanceof HTMLElement)) return;
    switch (h.tagName) {
      case "H1":
      case "H2":
      case "H3":
      case "H4": {
        const c = limpiar(deLinea(h));
        if (c.length) content.push({ type: "heading", attrs: { level: h.tagName === "H1" || h.tagName === "H2" ? 2 : 3 }, content: c });
        break;
      }
      case "UL":
      case "OL": {
        const items = [...h.querySelectorAll(":scope > li")].map((li) => parrafo(li)).filter((p): p is Nodo => !!p);
        if (items.length) content.push({ type: h.tagName === "UL" ? "bulletList" : "orderedList", content: items.map((p) => ({ type: "listItem", content: [p] })) });
        break;
      }
      case "BLOCKQUOTE": {
        const p = parrafo(h);
        if (p) content.push({ type: "blockquote", content: [p] });
        break;
      }
      case "HR":
        content.push({ type: "horizontalRule" });
        break;
      case "FIGURE": {
        const valor = (campo: string) => (h.querySelector<HTMLInputElement>(`input[data-campo="${campo}"]`)?.value ?? "").trim();
        if (h.dataset.tipo === "image" && h.dataset.medio) content.push({ type: "image", attrs: { medio: h.dataset.medio, alt: valor("alt"), pie: valor("pie") } });
        if (h.dataset.tipo === "youtube" && h.dataset.id) content.push({ type: "youtube", attrs: { id: h.dataset.id, titulo: valor("titulo") } });
        break;
      }
      default: {
        const p = parrafo(h);
        if (p) content.push(p);
      }
    }
  });
  return { type: "doc", content };
}

// ---- El editor ------------------------------------------------------------------------------------

type Formato = { bloque: string; bold: boolean; italic: boolean };

export function EditorDocumento({ valor, alCambiar }: { valor: unknown; alCambiar: (doc: Nodo) => void }) {
  const raiz = useRef<HTMLDivElement>(null);
  const ultimo = useRef<string>("");
  const rango = useRef<Range | null>(null);
  const figuraACambiar = useRef<HTMLElement | null>(null);
  const { medios, registrar } = useMediosConocidos();
  const [formato, setFormato] = useState<Formato>({ bloque: "p", bold: false, italic: false });
  const [selector, setSelector] = useState(false);
  const [pide, setPide] = useState<null | "enlace" | "video">(null);
  const [texto, setTexto] = useState("");
  const [subiendo, setSubiendo] = useState(false);

  const emitir = useCallback(() => {
    const el = raiz.current;
    if (!el) return;
    const doc = aDocumento(el);
    ultimo.current = JSON.stringify(doc);
    alCambiar(doc);
  }, [alCambiar]);

  // Contenido inicial, y de nuevo solo si el valor cambia desde fuera (descartar, recuperar una versión)
  const valorJson = JSON.stringify(valor ?? null);
  useLayoutEffect(() => {
    const el = raiz.current;
    if (!el || valorJson === ultimo.current) return;
    el.innerHTML = aHtml(valor, medios);
    ultimo.current = valorJson;
  }, [valorJson]); // eslint-disable-line react-hooks/exhaustive-deps

  // Las imágenes cuyo archivo aún no se conocía al pintar
  useEffect(() => {
    raiz.current?.querySelectorAll<HTMLElement>('figure[data-tipo="image"]').forEach((f) => {
      const im = f.querySelector("img");
      const url = medios[f.dataset.medio ?? ""]?.url;
      if (im && url && !im.getAttribute("src")) im.setAttribute("src", url);
    });
  }, [medios]);

  useEffect(() => {
    document.execCommand("defaultParagraphSeparator", false, "p");
    const alSeleccionar = () => {
      const sel = document.getSelection();
      const el = raiz.current;
      if (!el || !sel?.rangeCount || !el.contains(sel.anchorNode)) return;
      rango.current = sel.getRangeAt(0).cloneRange();
      let n: Node | null = sel.anchorNode;
      while (n && n.parentNode !== el) n = n.parentNode;
      const tag = n instanceof HTMLElement ? n.tagName.toLowerCase() : "p";
      setFormato({ bloque: tag, bold: document.queryCommandState("bold"), italic: document.queryCommandState("italic") });
    };
    document.addEventListener("selectionchange", alSeleccionar);
    return () => document.removeEventListener("selectionchange", alSeleccionar);
  }, []);

  const recuperarRango = () => {
    const sel = document.getSelection();
    raiz.current?.focus();
    if (rango.current && sel) {
      sel.removeAllRanges();
      sel.addRange(rango.current);
    }
  };

  const orden = (cmd: string, arg?: string) => {
    recuperarRango();
    document.execCommand(cmd, false, arg);
    emitir();
  };

  /** Bloque de primer nivel donde está el cursor (para meter detrás una imagen o un vídeo) */
  const bloqueActual = (): Element | null => {
    const el = raiz.current;
    let n: Node | null = rango.current?.startContainer ?? null;
    if (!el || !n || !el.contains(n)) return null;
    while (n && n.parentNode !== el) n = n.parentNode;
    return n instanceof Element ? n : null;
  };

  const insertar = (html: string) => {
    const el = raiz.current;
    if (!el) return;
    const plantilla = document.createElement("template");
    plantilla.innerHTML = html.trim();
    const nuevos = [...plantilla.content.children];
    const despues = bloqueActual();
    let ancla: Element | null = despues;
    for (const n of nuevos) {
      if (ancla) ancla.after(n);
      else el.append(n);
      ancla = n;
    }
    // Siempre queda un párrafo detrás para seguir escribiendo
    if (ancla && !ancla.nextElementSibling) {
      const p = document.createElement("p");
      p.innerHTML = "<br>";
      ancla.after(p);
    }
    emitir();
  };

  const alElegirImagenes = (lista: MedioBiblioteca[]) => {
    registrar(lista);
    const f = figuraACambiar.current;
    figuraACambiar.current = null;
    if (f && lista[0]) {
      f.dataset.medio = lista[0].id;
      f.querySelector("img")?.setAttribute("src", lista[0].url);
      const alt = f.querySelector<HTMLInputElement>('input[data-campo="alt"]');
      if (alt && !alt.value) alt.value = lista[0].alt;
      emitir();
      return;
    }
    insertar(lista.map((m) => figuraImagen(m.id, m.url, m.alt, "")).join(""));
  };

  const confirmarPide = () => {
    const t = texto.trim();
    if (pide === "enlace") {
      if (!t) orden("unlink");
      else orden("createLink", /^(https?:|mailto:|\/)/.test(t) ? t : `https://${t}`);
    } else if (pide === "video") {
      const id = idYoutube(t);
      if (id) insertar(figuraVideo(id, ""));
    }
    setPide(null);
    setTexto("");
  };

  const alClic = (e: React.MouseEvent) => {
    const boton = (e.target as HTMLElement).closest<HTMLElement>("[data-accion]");
    const figura = boton?.closest<HTMLElement>("figure");
    if (!boton || !figura) return;
    e.preventDefault();
    const accion = boton.dataset.accion;
    if (accion === "subir" && figura.previousElementSibling) figura.previousElementSibling.before(figura);
    if (accion === "bajar" && figura.nextElementSibling) figura.nextElementSibling.after(figura);
    if (accion === "quitar") figura.remove();
    if (accion === "cambiar") {
      figuraACambiar.current = figura;
      setSelector(true);
      return;
    }
    emitir();
  };

  const alPegar = (e: React.ClipboardEvent) => {
    // Se pega solo el texto (sin colores ni letras de otras webs); cada línea, un párrafo
    if ((e.target as HTMLElement).closest("input")) return;
    e.preventDefault();
    const t = e.clipboardData.getData("text/plain");
    if (!t) return;
    const lineas = t.replace(/\r/g, "").split(/\n+/).filter((l) => l.trim());
    if (lineas.length <= 1) document.execCommand("insertText", false, t.replace(/\n/g, " "));
    else document.execCommand("insertHTML", false, lineas.map((l) => `<p>${escapar(l)}</p>`).join(""));
    emitir();
  };

  const alSoltar = async (e: React.DragEvent) => {
    const fotos = [...e.dataTransfer.files].filter((f) => f.type.startsWith("image/"));
    if (!fotos.length) return;
    e.preventDefault();
    // El cursor va donde se suelta, y las fotos detrás de ese párrafo
    const r = document.caretRangeFromPoint?.(e.clientX, e.clientY);
    if (r) rango.current = r;
    setSubiendo(true);
    try {
      const subidas: MedioBiblioteca[] = [];
      for (const f of fotos) subidas.push(await subirArchivo(f));
      registrar(subidas);
      insertar(subidas.map((m) => figuraImagen(m.id, m.url, m.alt, "")).join(""));
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "No se pudo subir la imagen");
    }
    setSubiendo(false);
  };

  const B = ({ activo, titulo, onClick, children }: { activo?: boolean; titulo: string; onClick: () => void; children: React.ReactNode }) => (
    <button
      type="button"
      title={titulo}
      aria-label={titulo}
      aria-pressed={activo}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`flex h-9 min-w-9 items-center justify-center whitespace-nowrap rounded-[12px] px-2 text-[13px] font-semibold transition-colors ${activo ? "bg-white/15 text-[var(--jm-texto)]" : "text-[var(--jm-suave)] hover:bg-white/[0.07] hover:text-[var(--jm-texto)]"}`}
    >
      {children}
    </button>
  );

  return (
    <div className="rounded-[22px] border border-[var(--jm-borde)] bg-black/20">
      {/* En móvil, la barra se desliza de lado; en pantalla ancha se queda fija bajo la cabecera del formulario */}
      <div className="sin-barra z-20 flex items-center gap-0.5 overflow-x-auto rounded-t-[22px] border-b border-[var(--jm-borde)] bg-[var(--jm-fondo-2)]/95 p-1.5 backdrop-blur lg:sticky lg:top-[6.5rem] lg:flex-wrap lg:overflow-visible [&>*]:shrink-0">
        <B titulo="Párrafo" activo={formato.bloque === "p"} onClick={() => orden("formatBlock", "p")}>Texto</B>
        <B titulo="Título" activo={formato.bloque === "h2"} onClick={() => orden("formatBlock", "h2")}>Título</B>
        <B titulo="Subtítulo" activo={formato.bloque === "h3"} onClick={() => orden("formatBlock", "h3")}>Subtítulo</B>
        <span className="mx-1 h-5 w-px bg-[var(--jm-borde)]" />
        <B titulo="Negrita (Ctrl+B)" activo={formato.bold} onClick={() => orden("bold")}><b>B</b></B>
        <B titulo="Cursiva (Ctrl+I)" activo={formato.italic} onClick={() => orden("italic")}><i className="jm-serif text-base">I</i></B>
        <B titulo="Enlace" onClick={() => setPide("enlace")}>Enlace</B>
        <span className="mx-1 h-5 w-px bg-[var(--jm-borde)]" />
        <B titulo="Lista" activo={formato.bloque === "ul"} onClick={() => orden("insertUnorderedList")}>• Lista</B>
        <B titulo="Lista numerada" activo={formato.bloque === "ol"} onClick={() => orden("insertOrderedList")}>1. Lista</B>
        <B titulo="Cita destacada" activo={formato.bloque === "blockquote"} onClick={() => orden("formatBlock", "blockquote")}>“Cita”</B>
        <B titulo="Separador" onClick={() => orden("insertHorizontalRule")}>―</B>
        <span className="mx-1 h-5 w-px bg-[var(--jm-borde)]" />
        <B titulo="Imagen" onClick={() => setSelector(true)}>
          <Icono nombre="imagen" className="h-4 w-4" />
          <span className="ml-1.5">Imagen</span>
        </B>
        <B titulo="Vídeo de YouTube" onClick={() => setPide("video")}>▶ Vídeo</B>
      </div>

      {pide && (
        <form
          className="flex flex-wrap items-center gap-2 border-b border-[var(--jm-borde)] bg-black/20 px-3 py-2"
          onSubmit={(e) => {
            e.preventDefault();
            confirmarPide();
          }}
        >
          <input autoFocus className="campo !py-2 min-w-0 flex-1" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder={pide === "enlace" ? "Pega el enlace (vacío quita el enlace del texto elegido)" : "Pega el enlace del vídeo de YouTube"} />
          <button type="submit" className="boton boton-acento px-4 py-2 text-[13px]">{pide === "enlace" ? "Poner enlace" : "Añadir vídeo"}</button>
          <button type="button" className="boton boton-suave px-4 py-2 text-[13px]" onClick={() => setPide(null)}>Cancelar</button>
        </form>
      )}

      <div
        ref={raiz}
        className="jm-documento min-h-[18rem] px-6 py-5 outline-none sm:px-8"
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline
        aria-label="Texto del artículo"
        onInput={emitir}
        onClick={alClic}
        onPaste={alPegar}
        onDragOver={(e) => e.dataTransfer.types.includes("Files") && e.preventDefault()}
        onDrop={alSoltar}
      />
      {subiendo && <p className="px-6 pb-4 text-xs text-[var(--jm-suave)]">Subiendo imágenes…</p>}

      <SelectorMedios
        abierto={selector}
        alCerrar={() => {
          setSelector(false);
          figuraACambiar.current = null;
        }}
        alElegir={alElegirImagenes}
        acepta="imagen"
        multiple={!figuraACambiar.current}
        titulo={figuraACambiar.current ? "Cambiar imagen" : "Añadir imágenes al texto"}
      />
    </div>
  );
}
