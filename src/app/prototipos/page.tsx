import Link from "next/link";

const PROBAR = [
  "Haz scroll despacio: el reel se aleja, los trabajos se desplazan de lado y los pasos se iluminan.",
  "Pasa el ratón por los servicios y los trabajos: se abren y arranca un clip.",
  "Pulsa un trabajo: la imagen crece hasta la cabecera de su ficha.",
  "Cambia a modo claro con el sol de la barra de arriba.",
  "Pulsa «Editar página» (abajo a la derecha): arrastra secciones, ocúltalas, cambia textos o crea una nueva.",
];

export default function IndicePrototipos() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-[#09090b] px-6 py-16 text-[#f5f5f7]">
      <div className="w-full max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e50914]">Fase 3 · Dirección visual</p>
        <h1 className="mt-3 text-5xl font-black tracking-[-0.05em] sm:text-6xl">D · Cristal</h1>
        <p className="mt-4 text-base leading-relaxed text-white/65">
          La web de siempre (Inter, rojo, cristal y esquinas redondas) llevada a otro nivel: más viva, más cine y con más
          peso de venta. Toda la portada se construye a partir de secciones de la base de datos que podrás editar tú.
        </p>
        <ul className="mt-8 flex flex-col gap-2 text-sm leading-relaxed text-white/80">
          {PROBAR.map((p) => (
            <li key={p} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
              {p}
            </li>
          ))}
        </ul>
        <Link
          href="/prototipos/d"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#e50914] px-7 py-3.5 font-semibold text-white shadow-[0_10px_30px_-10px_rgba(229,9,20,0.7)] transition-transform hover:-translate-y-0.5"
        >
          Ver el prototipo →
        </Link>
        <p className="mt-8 text-xs leading-relaxed text-white/40">
          Los vídeos vienen de YouTube solo en el prototipo. En la web final, el reel y los clips serán archivos propios
          cortos, sin marca de YouTube y mucho más rápidos.
        </p>
      </div>
    </main>
  );
}
