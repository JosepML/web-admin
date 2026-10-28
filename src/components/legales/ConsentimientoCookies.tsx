"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";
import { DATOS_LEGALES } from "@/lib/datos/legales";
import { RUTAS } from "@/lib/rutas";

export type EstadoCookies = "aceptadas" | "rechazadas" | null;

const CLAVE_STORAGE = "jm-cookies-consentimiento";
const EVENTO_ABRIR = "jm:abrir-cookies";
const EVENTO_CAMBIO = "jm:cambio-cookies";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

function borrarCookiesAnaliticas() {
  if (typeof document === "undefined") return;
  const nombres = document.cookie
    .split(";")
    .map((c) => c.trim().split("=")[0])
    .filter((n) => n === "_ga" || n === "_gid" || n === "_gat" || n.startsWith("_ga_"));
  const dominios = [window.location.hostname, `.${window.location.hostname}`];
  for (const nombre of nombres) {
    document.cookie = `${nombre}=; Max-Age=0; path=/; SameSite=Lax`;
    for (const d of dominios) {
      document.cookie = `${nombre}=; Max-Age=0; path=/; domain=${d}; SameSite=Lax`;
    }
  }
}

/** Abre el banner de configuración de cookies desde cualquier enlace del pie o de la página de cookies */
export function abrirConfiguracionCookies() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(EVENTO_ABRIR));
  }
}

/** Lee y actualiza el consentimiento de cookies desde cualquier componente cliente */
export function useConsentimientoCookies() {
  const [estado, setEstado] = useState<EstadoCookies>(null);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    const leer = () => {
      try {
        const v = window.localStorage.getItem(CLAVE_STORAGE);
        setEstado(v === "aceptadas" || v === "rechazadas" ? v : null);
      } catch {
        setEstado(null);
      }
      setCargado(true);
    };
    leer();
    window.addEventListener(EVENTO_CAMBIO, leer);
    return () => window.removeEventListener(EVENTO_CAMBIO, leer);
  }, []);

  const guardar = (nuevo: "aceptadas" | "rechazadas") => {
    try {
      window.localStorage.setItem(CLAVE_STORAGE, nuevo);
    } catch {
      // Sin almacenamiento disponible
    }
    if (nuevo === "rechazadas") {
      window[`ga-disable-${DATOS_LEGALES.ga4Id}`] = true;
      borrarCookiesAnaliticas();
    } else {
      window[`ga-disable-${DATOS_LEGALES.ga4Id}`] = false;
    }
    setEstado(nuevo);
    window.dispatchEvent(new CustomEvent(EVENTO_CAMBIO));
  };

  return { estado, cargado, guardar };
}

/**
 * Banner de cookies (cumple la Guía de Cookies de la AEPD: botones Aceptar y Rechazar al mismo nivel)
 * y carga condicional de Google Analytics 4 (`G-RKBDRMVL1J`) únicamente tras el consentimiento expreso.
 */
export function ConsentimientoCookies() {
  const { estado, cargado, guardar } = useConsentimientoCookies();
  const [forzarVisible, setForzarVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const alAbrir = () => setForzarVisible(true);
    window.addEventListener(EVENTO_ABRIR, alAbrir);
    return () => window.removeEventListener(EVENTO_ABRIR, alAbrir);
  }, []);

  // Registra el cambio de ruta en GA4 solo si el usuario aceptó las cookies analíticas
  useEffect(() => {
    if (estado !== "aceptadas" || typeof window.gtag !== "function") return;
    window.gtag("config", DATOS_LEGALES.ga4Id, {
      page_path: pathname,
      anonymize_ip: true,
    });
  }, [estado, pathname]);

  const elegir = (valor: "aceptadas" | "rechazadas") => {
    guardar(valor);
    setForzarVisible(false);
  };

  const mostrarBanner = cargado && (estado === null || forzarVisible);

  return (
    <>
      {estado === "aceptadas" && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${DATOS_LEGALES.ga4Id}`}
            strategy="afterInteractive"
          />
          <Script id="jm-ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${DATOS_LEGALES.ga4Id}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}

      {mostrarBanner && (
        <aside
          aria-label="Aviso de cookies"
          className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-2xl sm:inset-x-8 sm:bottom-6"
        >
          <div className="cristal flex flex-col gap-4 rounded-[28px] p-5 shadow-2xl sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 sm:py-5">
            <div className="text-sm leading-relaxed text-[var(--jm-suave)]">
              <p className="font-semibold text-[var(--jm-texto)]">Cookies en esta web</p>
              <p className="mt-1">
                Uso cookies técnicas para que la web funcione y, solo si aceptas, Google Analytics para saber qué páginas se visitan. Nada de publicidad.{" "}
                <Link
                  href={RUTAS.cookies}
                  onClick={() => setForzarVisible(false)}
                  className="underline decoration-white/30 underline-offset-4 transition-colors hover:text-[var(--jm-texto)]"
                >
                  Política de cookies
                </Link>
                .
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => elegir("rechazadas")}
                className="boton border border-[var(--jm-borde)] bg-white/[0.04] px-5 py-2.5 text-xs font-semibold text-[var(--jm-texto)] transition-colors hover:bg-white/[0.1]"
              >
                Rechazar
              </button>
              <button
                type="button"
                onClick={() => elegir("aceptadas")}
                className="boton boton-acento px-5 py-2.5 text-xs font-semibold"
              >
                Aceptar
              </button>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
