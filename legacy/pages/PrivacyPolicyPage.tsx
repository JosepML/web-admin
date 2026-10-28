import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-[-10%] w-[50%] h-[50%] bg-brand-accent/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <Link to="/contact" className="inline-flex items-center gap-2 text-text-secondary hover:text-brand-accent transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Volver a Contacto
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-surface/50 dark:bg-surface/10 backdrop-blur-xl border border-border/50 rounded-3xl p-8 sm:p-12 shadow-2xl"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-heading tracking-tighter">Política de Privacidad y Cookies</h1>
          </div>

          <div className="prose prose-invert max-w-none text-text-secondary space-y-8 font-light leading-relaxed">
            <section>
              <p className="text-sm italic">Última actualización: 13 de mayo de 2026</p>
              <p className="mt-4">
                Esta Política de Privacidad regula el tratamiento de los datos personales facilitados a través del formulario de contacto de esta web, de acuerdo con el <strong>Reglamento (UE) 2016/679 (RGPD)</strong> y la <strong>Ley Orgánica 3/2018 (LOPDGDD)</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-heading mb-4">1. Responsable del Tratamiento</h2>
              <p><strong>Identidad:</strong> Josep Mira Lozano</p>
              <p><strong>NIF:</strong> 48759346J</p>
              <p><strong>Dirección:</strong> C. Roldan 9, 3º B, 03501 Benidorm (Alicante)</p>
              <p><strong>Email:</strong> <a href="mailto:josep.mira@gmail.com" className="text-brand-accent hover:underline">josep.mira@gmail.com</a></p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-heading mb-4">2. Finalidad y Legitimación</h2>
              <p>Sus datos serán tratados con el único fin de:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Responder a consultas sobre servicios de producción audiovisual, videografía y dirección de fotografía.</li>
                <li>Atender dudas técnicas o sugerencias sobre el funcionamiento de la web.</li>
              </ul>
              <p className="mt-4"><strong>Base legal:</strong> Consentimiento del interesado al enviar el formulario y marcar la casilla de aceptación.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-heading mb-4">3. Datos Recogidos</h2>
              <p>Solo se solicitan datos de contacto básicos necesarios para la comunicación: <strong>Nombre, correo electrónico y el mensaje facilitado</strong>. No se tratan bajo ningún concepto datos sensibles.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-heading mb-4">4. Flujo de Datos y Seguridad</h2>
              <p>Para el funcionamiento de la web, se utilizan los siguientes servicios:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li><strong>Infraestructura:</strong> GitHub Pages (procesamiento técnico seguro para el alojamiento de la web).</li>
                <li><strong>Gestión de Formulario:</strong> Los datos se envían a través de <strong>Formspree</strong>, que actúa como encargado de tratamiento para la recepción segura de correos electrónicos.</li>
                <li><strong>Almacenamiento:</strong> Una vez recibidos, los mensajes se gestionan en un sistema local seguro del Responsable en el Espacio Económico Europeo.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-heading mb-4">5. Derechos</h2>
              <p>Puede ejercer sus derechos de acceso, rectificación, supresión, oposición y limitación enviando un email a <a href="mailto:josep.mira@gmail.com" className="text-brand-accent hover:underline">josep.mira@gmail.com</a>. Tiene derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD) si considera que sus derechos no han sido debidamente atendidos.</p>
            </section>


            <section>
              <h2 className="text-xl font-bold text-heading mb-4">6. Cookies</h2>
              <p>Esta web utiliza solo <strong>cookies técnicas y de seguridad</strong> esenciales para la navegación. No se realiza rastreo analítico ni publicitario de terceros, por lo que no requieren consentimiento previo según la normativa vigente.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
