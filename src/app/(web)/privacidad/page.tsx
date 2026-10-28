import type { Metadata } from "next";
import Link from "next/link";
import { PaginaLegal } from "@/components/legales/PaginaLegal";
import { DATOS_LEGALES } from "@/lib/datos/legales";
import { RUTAS } from "@/lib/rutas";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Información sobre el tratamiento de datos personales según el RGPD y la LOPDGDD.",
  robots: { index: false, follow: true },
};


export default function PrivacidadPage() {
  return (
    <PaginaLegal activa="privacidad" titulo="Política de *privacidad*">
      <section className="space-y-3">
        <p>
          Esta Política de Privacidad regula el tratamiento de los datos personales facilitados a través del formulario de contacto de este sitio web, de acuerdo con el <strong className="text-[var(--jm-texto)]">Reglamento (UE) 2016/679 (RGPD)</strong> y la <strong className="text-[var(--jm-texto)]">Ley Orgánica 3/2018, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD)</strong>.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-[var(--jm-texto)]">1. Responsable del tratamiento</h2>
        <ul className="list-disc space-y-1.5 pl-6">
          <li>
            <strong className="text-[var(--jm-texto)]">Identidad:</strong> {DATOS_LEGALES.titular}
          </li>
          <li>
            <strong className="text-[var(--jm-texto)]">NIF / DNI:</strong> {DATOS_LEGALES.nif}
          </li>
          <li>
            <strong className="text-[var(--jm-texto)]">Dirección postal:</strong> {DATOS_LEGALES.domicilio}
          </li>
          <li>
            <strong className="text-[var(--jm-texto)]">Correo electrónico:</strong> {DATOS_LEGALES.correo}
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-[var(--jm-texto)]">2. Datos que se recogen y finalidad</h2>
        <p>
          A través del formulario de contacto únicamente se solicitan los datos necesarios para atender la consulta: <strong className="text-[var(--jm-texto)]">nombre, correo electrónico, teléfono (opcional), tipo de proyecto o servicio de interés y el mensaje enviado</strong>. No se solicitan ni tratan categorías especiales de datos personales.
        </p>
        <p>Los datos facilitados se tratan con las siguientes finalidades:</p>
        <ul className="list-disc space-y-1.5 pl-6">
          <li>Responder personalmente a las consultas sobre proyectos y servicios de dirección de fotografía, realización (filmmaker) y edición audiovisual.</li>
          <li>Mantener la comunicación profesional derivada de la solicitud enviada por la persona interesada.</li>
        </ul>
        <p>
          No se utilizan estos datos para el envío de boletines publicitarios masivos ni para elaborar perfiles automatizados.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-[var(--jm-texto)]">3. Base jurídica del tratamiento</h2>
        <p>
          La base legal para el tratamiento de los datos es el <strong className="text-[var(--jm-texto)]">consentimiento expreso</strong> de la persona interesada al marcar la casilla de aceptación y enviar el formulario de contacto (art. 6.1.a RGPD), así como, en su caso, la aplicación de medidas precontractuales a petición de la propia persona interesada (art. 6.1.b RGPD).
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-[var(--jm-texto)]">4. Conservación de los datos</h2>
        <p>
          Los datos personales se conservarán durante el tiempo necesario para atender la consulta y, en caso de que dé lugar a un encargo o colaboración profesional, mientras dure la relación y durante los plazos legalmente exigibles para atender posibles responsabilidades legales o fiscales. Si no se inicia relación profesional, los mensajes se suprimirán periódicamente una vez resuelta la consulta.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-[var(--jm-texto)]">5. Destinatarios y encargados del tratamiento</h2>
        <p>
          Los datos no se ceden ni venden a terceros, salvo obligación legal. Para el funcionamiento técnico de la web y la recepción de las consultas intervienen como encargados del tratamiento:
        </p>
        <ul className="list-disc space-y-1.5 pl-6">
          <li>
            <strong className="text-[var(--jm-texto)]">Supabase (región Unión Europea, eu-west-3):</strong> almacenamiento seguro de la base de datos de mensajes recibidos desde la web.
          </li>
          <li>
            <strong className="text-[var(--jm-texto)]">Formspree, Inc.:</strong> servicio técnico de notificación por correo electrónico al responsable cuando entra un mensaje en el formulario de contacto, amparado por las cláusulas contractuales tipo y el Marco de Privacidad de Datos UE-EE. UU.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-[var(--jm-texto)]">6. Derechos de las personas interesadas</h2>
        <p>
          Cualquier persona tiene derecho a obtener confirmación sobre si se están tratando sus datos personales y a ejercer en cualquier momento sus derechos de <strong className="text-[var(--jm-texto)]">acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad</strong>, así como a retirar el consentimiento prestado, escribiendo a {DATOS_LEGALES.correo}.
        </p>
        <p>
          Asimismo, si considera que el tratamiento de sus datos no se ajusta a la normativa vigente, tiene derecho a presentar una reclamación ante la <strong className="text-[var(--jm-texto)]">Agencia Española de Protección de Datos (AEPD)</strong> en{" "}
          <a href="https://www.aepd.es" target="_blank" rel="noreferrer" className="underline decoration-white/30 underline-offset-4 hover:text-[var(--jm-texto)]">
            www.aepd.es
          </a>
          .
        </p>
        <p>
          Para información sobre el uso de cookies analíticas y cómo gestionarlas, puede consultar la{" "}
          <Link href={RUTAS.cookies} className="underline decoration-white/30 underline-offset-4 hover:text-[var(--jm-texto)]">
            Política de cookies
          </Link>
          .
        </p>
      </section>
    </PaginaLegal>
  );
}
