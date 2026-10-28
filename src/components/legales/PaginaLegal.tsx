import Link from "next/link";
import { Revelar, Titular } from "@/components/piezas";
import { DATOS_LEGALES } from "@/lib/datos/legales";
import { RUTAS } from "@/lib/rutas";

type SeccionActiva = "aviso-legal" | "privacidad" | "cookies";

const PESTANAS: { id: SeccionActiva; etiqueta: string; href: string }[] = [
  { id: "aviso-legal", etiqueta: "Aviso legal", href: RUTAS.avisoLegal },
  { id: "privacidad", etiqueta: "Política de privacidad", href: RUTAS.privacidad },
  { id: "cookies", etiqueta: "Política de cookies", href: RUTAS.cookies },
];

export function PaginaLegal({
  activa,
  titulo,
  children,
}: {
  activa: SeccionActiva;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <main className="px-4 pb-24 pt-28 sm:px-8 sm:pt-36">
      <div className="mx-auto max-w-4xl">
        <Titular nivel={1} antetitulo="Información legal" titulo={titulo} />

        <Revelar retraso={0.1}>
          <nav aria-label="Páginas legales" className="mt-8 flex flex-wrap gap-2">
            {PESTANAS.map((p) => {
              const esActiva = p.id === activa;
              return (
                <Link
                  key={p.id}
                  href={p.href}
                  aria-current={esActiva ? "page" : undefined}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                    esActiva
                      ? "border-transparent bg-[var(--jm-acento)] text-white"
                      : "border-[var(--jm-borde)] bg-white/[0.03] text-[var(--jm-suave)] hover:border-white/25 hover:text-[var(--jm-texto)]"
                  }`}
                >
                  {p.etiqueta}
                </Link>
              );
            })}
          </nav>
        </Revelar>

        <Revelar retraso={0.16}>
          <div className="cristal mt-8 space-y-8 rounded-[32px] p-6 text-base leading-relaxed text-[var(--jm-suave)] sm:p-10">
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--jm-tenue)]">
              Última actualización: {DATOS_LEGALES.ultimaActualizacion}
            </p>
            {children}
          </div>
        </Revelar>
      </div>
    </main>
  );
}
