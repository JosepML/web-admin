import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import YouTubeEmbed from '../components/YouTubeEmbed';
import { ArrowRight, Film, Camera, Video } from 'lucide-react';
import { PROJECTS } from '../constants';
import ProjectCard from '../components/ProjectCard';

const roles = [
  "Realizador Audiovisual", "Director de Fotografía", "Operador de Cámara", 
  "Gaffer", "Editor de Vídeo"
];

const HomePage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        // Small timeout to ensure DOM update
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  // Tomamos algunos proyectos destacados (ej: los 2 primeros)
  const featuredProjects = PROJECTS.slice(0, 2);

  return (
    <div className="animate-fade-in-up bg-background">
      {/* SECTION 1: HERO (Cinematográfico) */}
      <section className="relative flex flex-col lg:block lg:h-screen lg:min-h-[600px] overflow-hidden bg-gradient-to-b from-background to-surface lg:bg-black">
        
        {/* DESKTOP BACKGROUND VIDEO */}
        <div className="hidden lg:block absolute inset-0 z-0 bg-black">
          <div className="absolute inset-0 opacity-40 z-10 bg-black pointer-events-none" />
          <YouTubeEmbed 
            embedId="dHp3YUb1x2I" 
            title="Josep Mira Lozano Showreel" 
            fill={true} 
          />
        </div>

        {/* CONTENT CONTAINER */}
        <div className="relative z-20 px-4 md:px-8 max-w-5xl mx-auto flex flex-col items-center text-center pt-12 md:pt-20 pb-12 lg:py-0 lg:h-full lg:justify-center">
          
          <span className="text-brand-accent tracking-[0.2em] uppercase text-xs md:text-sm font-semibold mb-3 lg:mb-4 lg:drop-shadow-md">
            Director &amp; DOP
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-heading lg:text-white tracking-tighter leading-tight lg:leading-none mb-4 lg:mb-6 lg:drop-shadow-2xl">
            Narrativas <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-400 dark:from-gray-300 dark:to-gray-500 lg:from-gray-100 lg:to-gray-500 lg:dark:from-gray-100 lg:dark:to-gray-500">
              Hechas de Luz
            </span>
          </h1>
          <p className="text-base md:text-xl lg:text-2xl text-text-secondary lg:text-gray-300 max-w-2xl mx-auto mb-6 lg:mb-10 lg:drop-shadow-md font-light">
            Especializado en dirección audiovisual, cinematografía y montaje. 
            Contemos historias que trascienden la pantalla.
          </p>

          {/* MOBILE/TABLET VIDEO */}
          <div className="w-full max-w-3xl mx-auto lg:hidden rounded-2xl overflow-hidden shadow-2xl mb-8 aspect-video relative bg-black">
            <YouTubeEmbed 
              embedId="dHp3YUb1x2I" 
              title="Josep Mira Lozano Showreel" 
              fill={false} 
              showControls={true}
              autoplay={true}
              loop={true}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              to="/portfolio"
              className="w-full sm:w-auto group relative flex items-center justify-center gap-2 bg-white/40 dark:bg-white/10 lg:bg-white/10 backdrop-blur-xl border border-white/60 dark:border-white/20 lg:border-white/20 text-text-primary lg:text-white font-bold text-lg py-3 lg:py-4 px-8 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] lg:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:bg-white/60 hover:border-brand-accent/50 dark:hover:bg-white/20 lg:hover:bg-white/20 hover:text-brand-accent lg:hover:text-white transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1 overflow-hidden"
            >
              Ver Portfolio
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto group flex items-center justify-center gap-2 bg-black/5 dark:bg-black/20 lg:bg-black/20 backdrop-blur-lg border border-border lg:border-white/10 text-text-primary lg:text-white/90 font-medium text-lg py-3 lg:py-4 px-8 rounded-full shadow-sm lg:shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:bg-black/10 dark:hover:bg-black/40 lg:hover:bg-black/40 hover:text-brand-accent lg:hover:text-white transition-all duration-300"
            >
              Hablemos
            </Link>
          </div>
        </div>
        
        {/* Scroll indicator (desktop only) */}
        <div className="hidden lg:block absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce text-white/50">
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent mx-auto mt-2" />
        </div>
      </section>

      {/* SECTION 2: PROYECTOS DESTACADOS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-background transition-colors duration-300">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-sm font-bold tracking-widest uppercase text-brand-accent mb-2">Selección</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-heading">Proyectos Destacados</h3>
          </div>
          <Link 
            to="/portfolio" 
            className="flex items-center gap-2 text-text-secondary hover:text-brand-accent font-medium transition-colors"
          >
            Ver todos los trabajos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {featuredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* NEW SECTION: SERVICIOS DETALLADOS PARA SEO */}
      <section className="py-24 bg-surface dark:bg-black border-y border-border/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-brand-accent text-sm font-bold tracking-[0.2em] uppercase mb-4">Especialidades</h2>
            <h3 className="text-3xl md:text-5xl font-black tracking-tighter text-heading dark:text-white">Servicios Audiovisuales en Alicante</h3>
            <p className="mt-6 text-text-secondary dark:text-gray-400 max-w-2xl mx-auto text-lg">
              Soluciones profesionales de <strong>vídeo y fotografía</strong> para marcas, artistas y eventos en toda la <strong>Comunidad Valenciana</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Vídeo Corporativo", desc: "Producción de vídeos para empresas en Alicante, spots publicitarios y contenido branding." },
              { title: "Videografía de Eventos", desc: "Cobertura cinematográfica de eventos, conciertos y Aftermovies con edición rápida." },
              { title: "Dirección de Fotografía", desc: "Servicios de DOP para cortometrajes y cine, especializado en narrativa visual." },
              { title: "Edición y Multimedia", desc: "Postproducción profesional, etalonaje y creación de Reels para redes sociales." }
            ].map((service, idx) => (
              <div key={idx} className="p-8 border border-border/50 dark:border-white/10 rounded-2xl hover:border-brand-accent/50 transition-all duration-300 bg-background/50 dark:bg-white/5 shadow-sm hover:shadow-xl group">
                <h4 className="text-xl font-bold mb-4 text-brand-accent group-hover:scale-105 transition-transform origin-left">{service.title}</h4>
                <p className="text-text-secondary dark:text-gray-400 text-sm leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              to="/contact"
              className="group relative inline-flex items-center justify-center gap-2 bg-white/10 dark:bg-white/10 backdrop-blur-xl border border-gray-200 dark:border-white/20 text-text-primary dark:text-white font-bold text-lg py-4 px-10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:bg-white/20 hover:border-brand-accent/50 hover:text-brand-accent transition-all duration-500 transform hover:scale-[1.05] hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/0 via-brand-accent/10 to-brand-accent/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              Hablemos
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </section>


      {/* SECTION 3: SOBRE MÍ */}
      <motion.section 
        id="about" 
        className="py-24 px-4 sm:px-6 lg:px-8 scroll-mt-20 relative bg-background dark:bg-surface/50 border-y border-border transition-colors duration-300"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-6xl mx-auto relative">
          {/* Background Decorative Blur */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-brand-accent/5 rounded-full blur-[120px] pointer-events-none -z-10" />

          <div className="text-center mb-16">
            <span className="text-brand-accent text-sm font-bold tracking-[0.2em] uppercase mb-4 block">Conóceme</span>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-heading tracking-tighter">Sobre Mí</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 flex items-center justify-center p-8">
              <div className="relative group w-64 h-64 sm:w-80 sm:h-80 lg:w-full lg:h-[500px]">
                {/* Background offset card decoration - Adjusted for visibility and clipping fix */}
                <div className="absolute top-6 -right-6 w-full h-full bg-gray-100/80 dark:bg-white/5 border-2 border-brand-accent dark:border-brand-accent/50 rounded-3xl z-0 transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-2 shadow-xl" />
                
                {/* Image Container with Glow/Glass */}
                <div className="relative z-10 w-full h-full rounded-3xl overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                  <img
                    src="https://i.postimg.cc/Qh3FMz10/Captura-de-pantalla-2026-05-13-161052.png"
                    alt="Retrato de Josep Mira Lozano, Director de Fotografía operando equipo en rodaje"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-7 bg-surface/50 dark:bg-surface/10 backdrop-blur-xl border border-border/50 rounded-3xl p-8 sm:p-10 shadow-2xl relative">
              <h4 className="text-3xl font-bold text-heading mb-6">¿Quién soy?</h4>
              <div className="text-lg text-text-secondary leading-relaxed space-y-5 font-light">
                <p>
                  Soy Josep Mira Lozano, un narrador, comunicador y un apasionado del mundo audiovisual. Desde hace más de 15 años, mi objetivo ha sido claro: <strong className="text-text-primary font-medium">conectar y resonar a través de las historias</strong>.
                </p>
                <p>
                  Empecé explorando la música y la actuación, pero fue en el mundo del vídeo y, más tarde, del cine, donde encontré el medio perfecto para fusionar todas mis pasiones. Me defino como una persona creativa, resolutiva y un gran entusiasta del trabajo en equipo.
                </p>
                <p>
                  Mi trayectoria profesional se ha construido sobre esta base. Durante más de ocho años, he estado compartiendo mis pasiones en YouTube, donde comencé en un canal llamado <em>'Del Fan, Para el Fan'</em> antes de dedicarme por completo a la realización cinematográfica. A través de mi canal actual, busco desmitificar el cine, recreando planos de películas y sirviendo de plataforma para la divulgación y el aprendizaje del séptimo arte.
                </p>
                
                <div className="block mt-8 p-6 bg-background/50 dark:bg-black/20 rounded-2xl border border-border/40">
                  <p className="text-base text-text-primary mb-3">
                    Mi trabajo abarca todo el proceso creativo, desde que nace un proyecto hasta su materialización en pantalla. Me dedico por completo a planificar, diseñar y, finalmente, capturar cada detalle, cada emoción y cada instante en el set.
                  </p>
                  <p className="text-sm font-medium italic text-brand-accent">
                    "La cámara se convierte en la extensión de mi visión."
                  </p>
                </div>

                <p className="pt-2">
                  Valoro cada proyecto como un acto de colaboración, una oportunidad para unirme a otros profesionales y construir algo que va más allá de la suma de sus partes. Si tu próximo proyecto busca una narrativa visual que conecte y resuene con el público, me encantaría explorar cómo podemos hacerlo realidad.
                </p>
              </div>

              <div className="mt-10 pt-8 border-t border-border/50">
                <span className="block text-sm font-semibold text-text-secondary uppercase tracking-wider mb-6">Áreas de Especialización</span>
                <div className="flex flex-wrap gap-3">
                  {roles.map(role => (
                    <span key={role} className="bg-brand-accent/10 border border-brand-accent/20 text-brand-accent py-2.5 px-5 rounded-full text-sm font-medium transition-colors hover:bg-brand-accent hover:text-white cursor-default">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* SECTION 4: EXPERTISE Y FILOSOFÍA */}
      <section className="py-24 bg-surface dark:bg-black transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-heading mb-6">La cámara no hace al cineasta, pero la visión sí.</h2>
            <p className="text-text-secondary text-lg md:text-xl">
              Cada plano tiene un propósito. Trato cada proyecto como un lienzo donde la luz, el encuadre y el ritmo del montaje esculpen la emoción. Ofrezco soluciones artísticas y técnicas completas.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              {
                icon: Film,
                title: "Dirección",
                desc: "Liderando la visión artística del proyecto de principio a fin, asegurando que la narrativa y la emoción conecten con el espectador."
              },
              {
                icon: Camera,
                title: "Dirección de Fotografía",
                desc: "Pintando con luz. Creación de esquemas de iluminación y selección óptica para definir la atmósfera exacta que requiere la historia."
              },
              {
                icon: Video,
                title: "Edición y Postproducción",
                desc: "Dando ritmo y forma final a la pieza. Desde el montaje rítmico acelerado hasta el etalonaje cinematográfico que eleva la imagen final."
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl bg-background/50 border border-border/50 hover:border-brand-accent/30 transition-colors">
                <div className="w-12 h-12 bg-brand-accent/10 rounded-lg flex items-center justify-center text-brand-accent mb-6">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-heading mb-3">{feature.title}</h3>
                <p className="text-text-secondary">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: MARCAS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background dark:bg-surface/50 border-t border-border/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <span className="text-brand-accent text-sm font-bold tracking-[0.2em] uppercase mb-4 block">Confianza</span>
            <h3 className="text-3xl md:text-4xl font-black text-heading tracking-tighter">Marcas con las que he trabajado</h3>
          </div>

          <div className="flex flex-col items-center gap-y-10 md:gap-y-12 opacity-70 grayscale">
            {/* Fila 1 */}
            <div className="flex flex-wrap justify-center items-center gap-y-10 gap-x-12 md:gap-x-16">
              <img src="https://www.edigitalagency.com.au/wp-content/uploads/new-Disney-logo-white-png-large-size.png" alt="Disney" className="h-10 md:h-14 object-contain filter invert dark:invert-0 opacity-80 hover:opacity-100 transition-opacity" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/ce/Star_wars2.svg" alt="Star Wars" className="h-12 md:h-16 object-contain dark:invert opacity-80 hover:opacity-100 transition-opacity" />
              <div className="flex flex-col items-center justify-center text-center opacity-80 hover:opacity-100 transition-opacity">
                <span className="text-lg md:text-xl font-bold font-serif tracking-tighter uppercase text-heading leading-tight">Consell Valencià</span>
                <span className="text-lg md:text-xl font-bold font-serif tracking-tighter uppercase text-heading leading-tight">de la Joventut</span>
              </div>
              <img src="https://jobs.kinepolis.com/images/logo-kinepolis.png" alt="Kinepolis" className="h-8 md:h-10 object-contain filter invert dark:invert-0 opacity-80 hover:opacity-100 transition-opacity" />
            </div>
            {/* Fila 2 */}
            <div className="flex flex-wrap justify-center items-center gap-y-10 gap-x-12 md:gap-x-16">
              <div className="text-xl md:text-2xl font-black tracking-wide opacity-80 hover:opacity-100 transition-opacity uppercase text-heading">Ocisport</div>
              <div className="text-lg md:text-xl font-light tracking-widest opacity-80 hover:opacity-100 transition-opacity uppercase text-heading">Mediterra Cinema</div>
            </div>
          </div>

          <div className="mt-20 flex flex-col justify-center items-center space-y-6">
            <div className="inline-flex items-center gap-4 bg-surface dark:bg-surface/50 border border-border/50 rounded-full py-4 px-10 shadow-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/0 via-brand-accent/10 to-brand-accent/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span className="text-text-secondary text-sm md:text-base font-light italic">Trabajo en sinergia con</span>
            </div>
            <div className="flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity">
              <span className="text-3xl md:text-5xl font-black tracking-[0.2em] text-heading">JUNO</span>
              <span className="text-3xl md:text-5xl font-light tracking-[0.2em] text-heading ml-2">MEDIA</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;