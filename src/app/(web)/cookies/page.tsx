import type { Metadata } from "next";
import { PaginaLegal } from "@/components/legales/PaginaLegal";
import { PanelPreferenciasCookies } from "@/components/legales/PanelPreferenciasCookies";
import { DATOS_LEGALES } from "@/lib/datos/legales";

export const metadata: Metadata = {
  title: "Política de cookies",
  description: "Información sobre las cookies utilizadas en esta web y gestión del consentimiento.",
  robots: { index: false, follow: true },
};


export default function CookiesPage() {
  return (
    <PaginaLegal activa="cookies" titulo="Política de *cookies*">
      <section className="space-y-3">
        <p>
          En cumplimiento del artículo 22.2 de la Ley 34/2002 (LSSI-CE) y de la Guía sobre el uso de las cookies de la Agencia Española de Protección de Datos (AEPD), aquí se detalla qué cookies y tecnologías de almacenamiento local utiliza este sitio web y cómo puedes configurarlas o revocar tu consentimiento en cualquier momento.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-[var(--jm-texto)]">1. Tu preferencia actual</h2>
        <PanelPreferenciasCookies />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-[var(--jm-texto)]">2. ¿Qué son las cookies?</h2>
        <p>
          Las cookies y el almacenamiento local del navegador son pequeños archivos o registros que una página web guarda en tu dispositivo para recordar preferencias técnicas (como el tema visual o tu elección sobre el aviso de cookies) o, si lo autorizas expresamente, medir de forma agregada el uso de la web.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-[var(--jm-texto)]">3. Cookies utilizadas en esta web</h2>

        <div className="space-y-2 rounded-2xl border border-[var(--jm-borde)] bg-white/[0.02] p-5">
          <h3 className="font-bold text-[var(--jm-texto)]">a) Técnicas o estrictamente necesarias (exentas de consentimiento)</h3>
          <p className="text-sm">
            Permiten el funcionamiento básico de la web y recordar tus preferencias de interfaz:
          </p>
          <ul className="list-disc space-y-1 pl-6 text-sm">
            <li>
              <code className="text-[var(--jm-texto)]">jm-tema</code> (almacenamiento local): guarda si prefieres ver la web en modo oscuro o claro.
            </li>
            <li>
              <code className="text-[var(--jm-texto)]">jm-cookies-consentimiento</code> (almacenamiento local): recuerda si has aceptado o rechazado las cookies analíticas para no volver a mostrarte el aviso en cada visita.
            </li>
            <li>
              Cookies de sesión de administración (<code className="text-[var(--jm-texto)]">sb-*</code>): se usan exclusivamente cuando el titular inicia sesión en el panel de edición privado. No se instalan para los visitantes de la web pública.
            </li>
          </ul>
        </div>

        <div className="space-y-2 rounded-2xl border border-[var(--jm-borde)] bg-white/[0.02] p-5">
          <h3 className="font-bold text-[var(--jm-texto)]">b) Cookies analíticas de terceros (solo si las aceptas)</h3>
          <p className="text-sm">
            Únicamente se descargan y activan si pulsas el botón «Aceptar» en el banner de cookies o en el panel superior:
          </p>
          <ul className="list-disc space-y-1 pl-6 text-sm">
            <li>
              <strong className="text-[var(--jm-texto)]">Proveedor:</strong> Google Ireland Limited (Google Analytics 4, identificador <code className="text-[var(--jm-texto)]">{DATOS_LEGALES.ga4Id}</code>).
            </li>
            <li>
              <strong className="text-[var(--jm-texto)]">Cookies:</strong> <code className="text-[var(--jm-texto)]">_ga</code> y <code className="text-[var(--jm-texto)]">_ga_*</code> (duración máxima: 2 años).
            </li>
            <li>
              <strong className="text-[var(--jm-texto)]">Finalidad:</strong> contabilizar de forma estadística y agregada las visitas y secciones consultadas para mejorar el sitio web, con anonimización de dirección IP activada.
            </li>
            <li>
              <strong className="text-[var(--jm-texto)]">Más información:</strong>{" "}
              <a
                href="https://policies.google.com/technologies/cookies?hl=es"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-white/30 underline-offset-4 hover:text-[var(--jm-texto)]"
              >
                Política de cookies de Google
              </a>
              .
            </li>
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-[var(--jm-texto)]">4. Contenidos embebidos de terceros</h2>
        <p>
          Algunas fichas de proyectos muestran vídeos alojados en YouTube o publicaciones de Instagram cuando decides reproducirlos. Al interactuar con dichos reproductores externos, las plataformas correspondientes (Google/YouTube o Meta/Instagram) pueden aplicar sus propias políticas técnicas y de cookies.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-[var(--jm-texto)]">5. Cómo eliminar o bloquear las cookies desde tu navegador</h2>
        <p>
          Además del panel de arriba y del enlace «Configurar cookies» situado en el pie de todas las páginas, puedes permitir, bloquear o eliminar las cookies instaladas en tu equipo mediante la configuración de las opciones del navegador que utilices (Chrome, Safari, Firefox, Edge u otros).
        </p>
      </section>
    </PaginaLegal>
  );
}
