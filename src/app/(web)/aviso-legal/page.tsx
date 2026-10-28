import type { Metadata } from "next";
import { PaginaLegal } from "@/components/legales/PaginaLegal";
import { DATOS_LEGALES } from "@/lib/datos/legales";

export const metadata: Metadata = {
  title: "Aviso legal",
  description: "Información general y condiciones de uso del sitio web.",
  robots: { index: false, follow: true },
};


export default function AvisoLegalPage() {
  return (
    <PaginaLegal activa="aviso-legal" titulo="Aviso *legal*">
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-[var(--jm-texto)]">1. Datos identificativos del titular (LSSI-CE)</h2>
        <p>
          En cumplimiento del deber de información recogido en el artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se facilitan a continuación los datos identificativos del titular de este sitio web:
        </p>
        <ul className="list-disc space-y-1.5 pl-6">
          <li>
            <strong className="text-[var(--jm-texto)]">Titular:</strong> {DATOS_LEGALES.titular}
          </li>
          <li>
            <strong className="text-[var(--jm-texto)]">NIF / DNI:</strong> {DATOS_LEGALES.nif}
          </li>
          <li>
            <strong className="text-[var(--jm-texto)]">Domicilio a efectos de notificaciones:</strong> {DATOS_LEGALES.domicilio}
          </li>
          <li>
            <strong className="text-[var(--jm-texto)]">Correo electrónico de contacto:</strong> {DATOS_LEGALES.correo}
          </li>
          <li>
            <strong className="text-[var(--jm-texto)]">Sitio web:</strong> {DATOS_LEGALES.dominio}
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-[var(--jm-texto)]">2. Objeto y condiciones de uso</h2>
        <p>
          Este sitio web tiene por objeto mostrar el portfolio audiovisual, los proyectos de dirección de fotografía, realización y edición, así como ofrecer una vía de contacto profesional directa con el titular.
        </p>
        <p>
          El acceso y la navegación por este sitio web atribuyen la condición de persona usuaria e implican la aceptación de las presentes condiciones de uso. La persona usuaria se compromete a hacer un uso adecuado y lícito del sitio web y de sus contenidos, absteniéndose de realizar actividades ilícitas o contrarias a la buena fe y al ordenamiento jurídico.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-[var(--jm-texto)]">3. Propiedad intelectual e industrial</h2>
        <p>
          Los textos, fotografías, fotogramas, piezas audiovisuales, diseño gráfico y código fuente de este sitio web son titularidad del responsable de la web o de las productoras, artistas y clientes con los que se ha realizado cada proyecto (citados en la ficha técnica correspondiente), y están protegidos por la legislación vigente sobre propiedad intelectual e industrial.
        </p>
        <p>
          Queda prohibida la reproducción, distribución, comunicación pública o transformación total o parcial de los contenidos de esta web con fines comerciales sin la autorización previa y por escrito de sus respectivos titulares.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-[var(--jm-texto)]">4. Exclusión de responsabilidad y enlaces</h2>
        <p>
          El titular procura que los contenidos y el funcionamiento técnico del sitio web sean precisos y estén actualizados, sin que pueda garantizar la inexistencia de interrupciones puntuales o errores ajenos a su control. En el caso de enlaces a sitios de terceros (como YouTube, Instagram o webs de clientes y productoras), el titular no ejerce control sobre dichos sitios ni asume responsabilidad por sus contenidos o políticas propias.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-[var(--jm-texto)]">5. Legislación aplicable y jurisdicción</h2>
        <p>
          Las presentes condiciones se rigen por la legislación española. Para cualquier controversia que pudiera derivarse del acceso o uso de este sitio web, las partes se someten a los Juzgados y Tribunales que correspondan conforme a la normativa procesal vigente.
        </p>
      </section>
    </PaginaLegal>
  );
}
