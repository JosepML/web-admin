import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, MapPin, Send, User, MessageSquare, CheckCircle2 } from 'lucide-react';
import { LinkedInIcon, InstagramIcon, YouTubeIcon } from '../components/IconComponents';
import { Link } from 'react-router-dom';

const FORMSPREE_FORM_ID = "mrblvlpb";

const ContactPage: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const formAction = `https://formspree.io/f/${FORMSPREE_FORM_ID}`;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setStatus('submitting');
    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setStatus('success');
      } else {
        response.json().then(data => {
            if (data && data.errors) {
                console.error("Errores de Formspree:", data.errors.map((e: any) => e.message).join(", "));
            }
        }).catch(() => {
            console.error("Error al enviar el formulario: La respuesta de error de Formspree no era JSON.");
        });
        setStatus('error');
      }
    } catch (error) {
      console.error('Error de red al enviar el formulario:', error);
      setStatus('error');
    }
  };
  
  const getButtonText = () => {
    if (status === 'submitting') return 'Enviando...';
    if (status === 'success') return '¡Mensaje Enviado!';
    if (status === 'error') return 'Reintentar Envío';
    return 'Enviar Mensaje';
  };
  
  const getButtonClasses = () => {
    let baseClasses = "group relative flex items-center justify-center gap-2 w-full font-bold text-lg py-4 px-8 rounded-full transition-all duration-500 overflow-hidden";
    if (status === 'success') {
      return `${baseClasses} bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] cursor-default`;
    }
    if (status === 'error') {
      return `${baseClasses} bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:bg-red-500/20 transform hover:scale-[1.02]`;
    }
    return `${baseClasses} bg-white/40 dark:bg-white/5 backdrop-blur-2xl border border-white/60 dark:border-white/10 text-text-primary shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:bg-white/60 dark:hover:bg-white/10 hover:border-brand-accent/50 dark:hover:border-brand-accent/50 hover:text-brand-accent hover:shadow-[0_8px_32px_rgba(229,9,20,0.15)] dark:hover:shadow-[0_8px_32px_rgba(229,9,20,0.25)] transform hover:scale-[1.02] hover:-translate-y-1 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:scale-100`;
  };

  const fieldsDisabled = status === 'submitting' || status === 'success';

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background relative overflow-hidden flex flex-col justify-center">
      {/* Decorative blurred blobs */}
      <div className="absolute top-0 left-[-10%] w-[50%] h-[50%] bg-brand-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10 w-full">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-brand-accent text-sm font-bold tracking-[0.2em] uppercase mb-4 block">Hablemos</span>
          <h1 className="text-5xl md:text-7xl font-black text-heading tracking-tighter mb-6">Contacto</h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-text-secondary leading-relaxed font-light">
            ¿Tienes un proyecto en mente en <strong>Alicante</strong> o la <strong>Comunidad Valenciana</strong>? Cuéntame tu idea de producción audiovisual o videografía y la haremos realidad.
          </p>
        </motion.div>

        <div className="flex flex-col-reverse lg:grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          
          {/* Contact Info Column */}
          <motion.div 
            className="lg:col-span-2 space-y-8 w-full"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-surface/50 dark:bg-surface/10 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-heading mb-8">Información Directa</h3>
              
              <div className="space-y-6">
                <a href="mailto:josep.mira@gmail.com" className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-sm font-semibold text-text-secondary mb-1">Email</span>
                    <span className="text-lg text-heading font-medium">josep.mira@gmail.com</span>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-sm font-semibold text-text-secondary mb-1">Ubicación</span>
                    <span className="text-lg text-heading font-medium">Alicante, España</span>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-border/50">
                <span className="block text-sm font-semibold text-text-secondary mb-6 text-center">Sígueme en Redes</span>
                <div className="flex justify-center space-x-6">
                  <a
                    href="https://www.linkedin.com/in/josep-mira-lozano-a70798214/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-white hover:bg-[#0A66C2] hover:border-[#0A66C2] transition-all duration-300 transform hover:scale-110 shadow-lg"
                  >
                    <LinkedInIcon />
                  </a>
                  <a
                    href="https://www.youtube.com/channel/UCtyNSF1X0pNPxp5fhwu1NUA"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-white hover:bg-[#FF0000] hover:border-[#FF0000] transition-all duration-300 transform hover:scale-110 shadow-lg"
                  >
                    <YouTubeIcon />
                  </a>
                  <a
                    href="https://www.instagram.com/josepmiralozano/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-white hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:border-transparent transition-all duration-300 transform hover:scale-110 shadow-lg"
                  >
                    <InstagramIcon />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form Column */}
          <motion.div 
            className="lg:col-span-3 w-full"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-surface/50 dark:bg-surface/10 backdrop-blur-xl border border-border/50 rounded-3xl p-8 sm:p-10 shadow-2xl">
              <h2 className="text-3xl font-bold text-heading mb-8">Escríbeme un mensaje</h2>
              
              <form action={formAction} method="POST" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div className="relative">
                    <label htmlFor="name" className="block text-sm font-semibold text-text-secondary mb-2 ml-1">Nombre</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary/50">
                        <User className="w-5 h-5" />
                      </div>
                      <input 
                        type="text" 
                        id="name" 
                        name="Nombre" 
                        required 
                        disabled={fieldsDisabled}
                        placeholder="Tu nombre"
                        className="w-full bg-background/50 dark:bg-black/20 border border-border/50 text-text-primary rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent/50 transition-all outline-none placeholder:text-text-secondary/30 disabled:opacity-50" 
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="relative">
                    <label htmlFor="email" className="block text-sm font-semibold text-text-secondary mb-2 ml-1">Correo Electrónico</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary/50">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input 
                        type="email" 
                        id="email" 
                        name="Correo electrónico" 
                        required 
                        disabled={fieldsDisabled}
                        placeholder="tu@email.com"
                        className="w-full bg-background/50 dark:bg-black/20 border border-border/50 text-text-primary rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent/50 transition-all outline-none placeholder:text-text-secondary/30 disabled:opacity-50" 
                      />
                    </div>
                  </div>
                </div>

                {/* Message Input */}
                <div className="relative">
                  <label htmlFor="message" className="block text-sm font-semibold text-text-secondary mb-2 ml-1">Mensaje</label>
                  <div className="relative">
                    <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none text-text-secondary/50">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <textarea 
                      id="message" 
                      name="Mensaje" 
                      rows={6} 
                      required 
                      disabled={fieldsDisabled}
                      placeholder="Cuéntame sobre tu proyecto..."
                      className="w-full bg-background/50 dark:bg-black/20 border border-border/50 text-text-primary rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent/50 transition-all outline-none placeholder:text-text-secondary/30 disabled:opacity-50 resize-none"
                    ></textarea>
                  </div>
                </div>

                {/* GDPR Disclaimer */}
                <div className="flex items-start gap-3 mt-8">
                  <div className="flex items-center h-6">
                    <input
                      id="privacy"
                      name="privacy"
                      type="checkbox"
                      required
                      checked={acceptedPrivacy}
                      onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                      disabled={fieldsDisabled}
                      className="w-5 h-5 rounded border-border/50 bg-background/50 dark:bg-black/20 text-brand-accent focus:ring-brand-accent/50 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <label htmlFor="privacy" className="text-sm text-text-secondary leading-snug cursor-pointer select-none">
                    He leído y acepto la <Link to="/privacy" target="_blank" className="text-brand-accent hover:underline font-medium">Política de Privacidad</Link>. Entiendo que mis datos serán tratados para responder a mi consulta.
                  </label>
                </div>
                
                {/* Submit Button & Status */}
                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={status === 'submitting' || status === 'success' || !acceptedPrivacy}
                    className={getButtonClasses()}
                  >
                    {status === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                    {getButtonText()}
                  </button>
                  
                  {/* Status Messages Box (occupies space to prevent jitter) */}
                  <div className="h-8 mt-4 text-center flex justify-center items-start">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: status === 'error' ? 1 : 0, y: status === 'error' ? 0 : -10 }}
                    >
                      {status === 'error' && (
                        <span className="text-red-400 font-medium text-sm bg-red-400/10 py-1.5 px-4 rounded-full">
                          Hubo un error al enviar el mensaje. Inténtalo de nuevo.
                        </span>
                      )}
                    </motion.div>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;