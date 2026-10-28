import type { Metadata } from "next";
import { Instrument_Serif, Montserrat } from "next/font/google";
import { BarraPrototipos } from "./_comun/BarraPrototipos";
import { ProveedorTransicion } from "./_comun/Transicion";
import "./prototipos.css";

// Prototipo D: Montserrat para todo el texto (lo pidió Josep) y Instrument Serif cursiva para las
// palabras de acento y la palabra que rota en la portada
const base = Montserrat({ variable: "--font-base", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const acento = Instrument_Serif({ variable: "--font-acento", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });

export const metadata: Metadata = {
  title: "Prototipos · Dirección visual",
  robots: { index: false, follow: false },
};

export default function LayoutPrototipos({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${base.variable} ${acento.variable}`}>
      <ProveedorTransicion>
        {children}
        <BarraPrototipos />
      </ProveedorTransicion>
    </div>
  );
}
