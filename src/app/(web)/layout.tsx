import type { Metadata } from "next";
import { Instrument_Serif, Montserrat } from "next/font/google";
import { RedireccionAntigua } from "@/components/comun/RedireccionAntigua";
import { ProveedorTransicion } from "@/components/comun/Transicion";
import { AvisoVistaPrevia } from "@/components/edicion/AvisoVistaPrevia";
import { ConsentimientoCookies } from "@/components/legales/ConsentimientoCookies";
import { Marco } from "@/components/marco/Marco";
import { JsonLdPersona } from "@/components/seo/JsonLd";
import { getAjustes } from "@/lib/datos/ajustes";
import { enVistaPrevia } from "@/lib/datos/cliente";
import { URL_SITIO } from "@/lib/seo/url";
import "@/styles/tokens.css";
import "@/styles/web.css";
import "@/styles/edicion.css";

// Montserrat para todo el texto (lo pidió Josep) e Instrument Serif cursiva solo para la palabra de acento
const base = Montserrat({ variable: "--font-base", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const acento = Instrument_Serif({ variable: "--font-acento", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });

export async function generateMetadata(): Promise<Metadata> {
  const ajustes = await getAjustes();
  const indexar = process.env.NEXT_PUBLIC_INDEXAR === "1";
  const tituloPorDefecto = `${ajustes.nombre} · ${ajustes.lema}`;
  return {
    metadataBase: new URL(URL_SITIO),
    title: { default: tituloPorDefecto, template: `%s · ${ajustes.nombre}` },
    description: ajustes.lema,
    openGraph: {
      type: "website",
      locale: "es_ES",
      siteName: ajustes.nombre,
      title: tituloPorDefecto,
      description: ajustes.lema,
    },
    twitter: {
      card: "summary_large_image",
      title: tituloPorDefecto,
      description: ajustes.lema,
    },
    // Hasta el lanzamiento (fase 7) la web nueva no se indexa salvo que NEXT_PUBLIC_INDEXAR="1"
    robots: { index: indexar, follow: indexar },
  };
}

export default async function LayoutWeb({ children }: { children: React.ReactNode }) {
  const [ajustes, previa] = await Promise.all([getAjustes(), enVistaPrevia()]);
  return (
    <div className={`${base.variable} ${acento.variable}`}>
      <JsonLdPersona ajustes={ajustes} />
      <RedireccionAntigua />
      <ProveedorTransicion>
        <Marco ajustes={ajustes}>
          {children}
          {previa && <AvisoVistaPrevia />}
          <ConsentimientoCookies />
        </Marco>
      </ProveedorTransicion>
    </div>
  );
}
