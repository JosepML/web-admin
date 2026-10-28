"use client";

import { useEffect, useState } from "react";
import { guardarAjustes } from "@/lib/admin/ajustes";
import { Campos } from "../campos/Campos";
import { ProveedorMedios } from "../campos/medios";
import type { Campo } from "../campos/tipos";
import { useDialogos } from "../Dialogos";

type Datos = Record<string, unknown>;

const CAMPOS: { titulo: string; descripcion?: string; campos: Campo[] }[] = [
  {
    titulo: "Disponibilidad",
    campos: [{ tipo: "interruptor", clave: "disponible", etiqueta: "Disponible para nuevos proyectos", ayuda: "Enseña el aviso verde de la portada. Quítalo cuando tengas la agenda llena." }],
  },
  {
    titulo: "Quién eres",
    campos: [
      { tipo: "texto", clave: "nombre", etiqueta: "Nombre", medio: true },
      { tipo: "texto", clave: "ubicacion", etiqueta: "Dónde trabajas", placeholder: "Alicante", medio: true },
      { tipo: "texto", clave: "lema", etiqueta: "Lema", ayuda: "Sale en el pie de la web y en Google" },
    ],
  },
  {
    titulo: "Contacto",
    descripcion: "A dónde llevan los botones de correo y WhatsApp.",
    campos: [
      { tipo: "texto", clave: "correo", etiqueta: "Correo", placeholder: "hola@josepmira.com", medio: true },
      { tipo: "texto", clave: "whatsapp", etiqueta: "WhatsApp", placeholder: "34600000000", ayuda: "Con el prefijo del país, solo números", medio: true },
    ],
  },
  {
    titulo: "Foto de Contacto",
    descripcion: "La foto de Josep que sale junto al formulario de Contacto y en la página de «Gracias».",
    campos: [{ tipo: "medio", clave: "fotoContacto", etiqueta: "Foto", acepta: "imagen", ayuda: "Mejor vertical, con la cara en el tercio de arriba: el título va encima, abajo." }],
  },
  {
    titulo: "Redes",
    descripcion: "Vacío = no sale el icono.",
    campos: [
      {
        tipo: "grupo",
        clave: "redes",
        etiqueta: "Perfiles",
        campos: [
          { tipo: "enlace", clave: "instagram", etiqueta: "Instagram", placeholder: "https://www.instagram.com/…" },
          { tipo: "enlace", clave: "youtube", etiqueta: "YouTube", placeholder: "https://www.youtube.com/@…" },
          { tipo: "enlace", clave: "linkedin", etiqueta: "LinkedIn", placeholder: "https://www.linkedin.com/in/…" },
        ],
      },
    ],
  },
];

/** Quita los vacíos (las redes sin enlace) y deja el WhatsApp solo con números */
function limpiar(d: Datos): Datos {
  const redes = Object.fromEntries(Object.entries((d.redes as Datos) ?? {}).filter(([, v]) => typeof v === "string" && v.trim()));
  return { ...d, whatsapp: String(d.whatsapp ?? "").replace(/\D/g, ""), redes };
}

export function FormularioAjustes({ inicial }: { inicial: Datos }) {
  const { avisar } = useDialogos();
  const [guardados, setGuardados] = useState(inicial);
  const [datos, setDatos] = useState(inicial);
  const [guardando, setGuardando] = useState(false);
  const hayCambios = JSON.stringify(limpiar(datos)) !== JSON.stringify(limpiar(guardados));

  useEffect(() => {
    if (!hayCambios) return;
    const aviso = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", aviso);
    return () => window.removeEventListener("beforeunload", aviso);
  }, [hayCambios]);

  const guardar = async () => {
    const enLimpio = limpiar(datos);
    const mal = Object.values(enLimpio.redes as Datos).some((v) => !/^https:\/\//.test(String(v)));
    if (mal) return avisar("Los enlaces de las redes tienen que empezar por https://", "error");
    setGuardando(true);
    const r = await guardarAjustes(enLimpio);
    setGuardando(false);
    if (!r.ok) return avisar(r.error, "error");
    setGuardados(enLimpio);
    setDatos(enLimpio);
    avisar("Guardado. Ya se ve en la web.");
  };

  return (
    <ProveedorMedios ids={[String(datos.fotoContacto ?? "")].filter(Boolean)}>
    <div className="mx-auto max-w-3xl">
      <div className="sticky top-16 z-30 -mx-2 mb-8 lg:top-4">
        <div className="cristal cristal-fuerte flex flex-wrap items-center justify-between gap-3 rounded-[28px] px-5 py-3.5">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">Ajustes de la web</h1>
            <p className="text-xs text-[var(--jm-suave)]">{hayCambios ? "Cambios sin guardar" : "Todo guardado · estos cambios se ven al momento"}</p>
          </div>
          <div className="flex gap-2">
            {hayCambios && (
              <button type="button" onClick={() => setDatos(guardados)} className="boton boton-suave px-4 py-2.5 text-sm">
                Deshacer
              </button>
            )}
            <button type="button" onClick={guardar} disabled={!hayCambios || guardando} className="boton boton-acento px-5 py-2.5 text-sm disabled:opacity-40">
              {guardando ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        {CAMPOS.map((s) => (
          <section key={s.titulo} className="cristal rounded-[28px] p-6">
            <h2 className="text-lg font-extrabold tracking-tight">{s.titulo}</h2>
            {s.descripcion && <p className="mt-1 text-sm text-[var(--jm-suave)]">{s.descripcion}</p>}
            <div className="mt-5">
              <Campos campos={s.campos} datos={datos} cambiar={(k, v) => setDatos((d) => ({ ...d, [k]: v }))} />
            </div>
          </section>
        ))}
      </div>
    </div>
    </ProveedorMedios>
  );
}
