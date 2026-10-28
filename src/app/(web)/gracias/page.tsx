import type { Metadata } from "next";
import Link from "next/link";
import { Retrato } from "@/components/contacto/Retrato";
import { Icono } from "@/components/Iconos";
import { Revelar, Titular } from "@/components/piezas";
import { getFotoContacto } from "@/lib/datos/contacto";
import { getServicio } from "@/lib/datos/servicios";
import { RUTAS } from "@/lib/rutas";

export const metadata: Metadata = {
  title: "Gracias",
  robots: { index: false, follow: false },
};

// Como el resto de la web: los datos (menú, ajustes) se leen en cada visita, no al compilar

const PASOS = [
  { titulo: "Leo tu mensaje", texto: "Lo leo yo, con calma, sin respuestas automáticas." },
  { titulo: "Te respondo", texto: "Normalmente en menos de 24 horas, a tu correo." },
  { titulo: "Lo pensamos juntos", texto: "Te propongo cómo contarlo y, si quieres, hablamos por teléfono." },
];

export default async function Gracias() {
  const foto = await getFotoContacto((await getServicio("filmmaker"))?.imagen ?? null);
  return (
    <section className="px-4 pb-24 pt-28 sm:px-8 sm:pt-32">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <Retrato medio={foto} etiqueta="Josep Mira Lozano" />
        <div>
          <Titular nivel={1} antetitulo="Mensaje enviado" titulo="Gracias por *escribirme*" />
          <Revelar retraso={0.12}>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--jm-suave)]">
              Tu mensaje ya está conmigo. Esto es lo que pasa ahora:
            </p>
          </Revelar>
          <ol className="mt-8 grid gap-3">
            {PASOS.map((p, i) => (
              <Revelar key={p.titulo} retraso={0.2 + i * 0.08}>
                <li className="cristal flex items-start gap-4 rounded-[24px] p-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--jm-acento)] text-sm font-bold text-white">{i + 1}</span>
                  <div>
                    <p className="font-semibold">{p.titulo}</p>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--jm-suave)]">{p.texto}</p>
                  </div>
                </li>
              </Revelar>
            ))}
          </ol>
          <Revelar retraso={0.5}>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href={RUTAS.trabajos} className="boton boton-acento px-7 py-3.5 text-sm">
                Mientras tanto, mira mis trabajos
                <Icono nombre="flecha" className="h-4 w-4" />
              </Link>
              <Link href="/" className="boton border border-[var(--jm-borde)] px-7 py-3.5 text-sm hover:bg-[var(--jm-cristal)]">
                Volver al inicio
              </Link>
            </div>
          </Revelar>
        </div>
      </div>
    </section>
  );
}
