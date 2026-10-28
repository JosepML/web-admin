import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Montserrat } from "next/font/google";
import "@/styles/tokens.css";
import "@/styles/web.css";
import "@/styles/edicion.css";

const base = Montserrat({ variable: "--font-base", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const acento = Instrument_Serif({ variable: "--font-acento", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });

export const metadata: Metadata = {
  title: { default: "Panel", template: "%s · Panel" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#09090b" };

/** Panel privado: mismas letras, tokens y cristal que la web, siempre en oscuro */
export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${base.variable} ${acento.variable}`}>
      <div data-tema="oscuro" className="jm-raiz jm-panel min-h-svh">
        <div className="orbes" aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <div className="relative z-[1]">{children}</div>
      </div>
    </div>
  );
}
