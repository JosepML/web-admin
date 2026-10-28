
import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { PROJECTS } from '../constants';
import YouTubeEmbed from '../components/YouTubeEmbed';
import Lightbox from '../components/Lightbox';
import InstagramNativeEmbed from '../components/InstagramNativeEmbed';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const project = PROJECTS.find((p) => p.id === id);
  const fromFilter = location.state?.fromFilter;


  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const showNextImage = () => {
    if (project?.images) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % project.images.length);
    }
  };

  const showPrevImage = () => {
    if (project?.images) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + project.images.length) % project.images.length);
    }
  };

  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <b key={i}>{part.slice(2, -2)}</b>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <i key={i}>{part.slice(1, -1)}</i>;
      }
      return part;
    });
  };

  if (!project) {
    return (
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold text-text-primary">Proyecto no encontrado</h1>
        <p className="text-text-secondary mt-4">El proyecto que buscas no existe o ha sido movido.</p>
        <Link to="/portfolio" className="mt-8 inline-block bg-brand-accent text-white font-bold py-2 px-6 rounded-md hover:bg-red-700 transition-colors">
          Volver al Portfolio
        </Link>
      </div>
    );
  }

  const {
    youtubeVideoId,
    multipleVideos,
    processVideoId,
    title,
    category,
    context,
    role,
    process,
    challenges,
    results,
    images,
    sectionTitles
  } = project;

  return (
    <div className="animate-fade-in-up">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="text-center mb-12">
            <Link to="/portfolio" state={{ filter: fromFilter || 'Todos' }} className="text-brand-accent hover:text-red-700 transition-colors mb-6 inline-block">&larr; Volver al Listado</Link>
            <p className="text-brand-accent font-semibold uppercase tracking-wider">{Array.isArray(category) ? category.join(' | ') : category}</p>
            <h1 className="text-4xl md:text-6xl font-extrabold text-text-primary mt-2">{title}</h1>
        </header>

        {(!project.videosBelowText && multipleVideos && multipleVideos.length > 0) ? (
          <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {multipleVideos.map((video, idx) => (
              <div key={idx} className="flex flex-col">
                {video.title && <h3 className="text-xl font-bold mb-3 text-text-primary">{video.title}</h3>}
                <div className={`shadow-2xl shadow-black/20 dark:shadow-black/50 rounded-lg overflow-hidden bg-black flex-grow flex items-center justify-center ${video.type === 'instagram' || video.type === 'youtube-short' ? 'md:h-[600px]' : ''}`}>
                  {video.type === 'instagram' ? (
                    video.customHtml ? (
                      <InstagramNativeEmbed html={video.customHtml} />
                    ) : (
                      <iframe
                        src={`https://www.instagram.com/p/${video.id}/embed`}
                        className="w-full h-full border-0 mx-auto max-w-[400px]"
                        allow="encrypted-media"
                        title={video.title}
                      />
                    )
                  ) : video.type === 'youtube-short' ? (
                    <div className="w-full h-full max-w-[350px] mx-auto">
                      <YouTubeEmbed embedId={video.id!} title={video.title || title} showControls={true} short={true} autoplay={project.id !== 'reels-rrss'} mute={project.id !== 'reels-rrss'} />
                    </div>
                  ) : (
                    <YouTubeEmbed embedId={video.id!} title={video.title || title} showControls={true} autoplay={project.id !== 'reels-rrss'} mute={project.id !== 'reels-rrss'} />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (!multipleVideos || multipleVideos.length === 0) && youtubeVideoId ? (
          <div className="mb-12 shadow-2xl shadow-black/20 dark:shadow-black/50 rounded-lg overflow-hidden bg-black">
            <YouTubeEmbed embedId={youtubeVideoId} title={title} showControls={true} autoplay={project.id !== 'reels-rrss'} mute={project.id !== 'reels-rrss'} />
          </div>
        ) : project.hideComingSoonOverlay ? (
          <div className="mb-12 shadow-2xl shadow-black/20 dark:shadow-black/50 rounded-2xl overflow-hidden relative group">
            <img 
              src={project.thumbnailUrl} 
              alt={title} 
              className="w-full h-auto md:h-[600px] object-cover"
            />
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-lg">
          <div className="md:col-span-2">
            {context && <Section title={sectionTitles?.context || "Contexto"}>{context.split('\n\n').map((p, i) => <p key={i}>{renderFormattedText(p)}</p>)}</Section>}
            {role && <Section title={sectionTitles?.role || "Mi Rol"}>{role.split('\n\n').map((paragraph, index) => <p key={index}>{renderFormattedText(paragraph)}</p>)}</Section>}
            {process && process.length > 0 && (
              <Section title={sectionTitles?.process || "Proceso Creativo"}>
                {process.length === 1 ? (
                  <>{process[0].split('\n\n').map((p, i) => <p key={i}>{renderFormattedText(p)}</p>)}</>
                ) : (
                  <ul className="list-disc list-inside space-y-2">
                    {process.map((step, index) => (
                      <li key={index}>{renderFormattedText(step)}</li>
                    ))}
                  </ul>
                )}
              </Section>
            )}
            {challenges && <Section title={sectionTitles?.challenges || "Retos y Aprendizajes"}>{challenges.split('\n\n').map((p, i) => <p key={i}>{renderFormattedText(p)}</p>)}</Section>}
            {results && <Section title={sectionTitles?.results || "Impacto y Resultados"}>{results.split('\n\n').map((p, i) => <p key={i}>{renderFormattedText(p)}</p>)}</Section>}
          </div>
          {images && images.length > 0 && (
            <div className="md:col-span-1">
              <div className="bg-surface p-6 rounded-lg sticky top-24 shadow-md border border-border">
                  <h3 className="text-2xl font-bold text-text-primary mb-4 border-b-2 border-brand-accent pb-2">Galería</h3>
                  <div className="space-y-4">
                      {images.map((img, index) => (
                        <button 
                          key={index} 
                          onClick={() => openLightbox(index)}
                          className="w-full h-auto block rounded-md overflow-hidden shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-surface"
                          aria-label={`View image ${index + 1} of project ${title}`}
                        >
                          <img 
                            src={img} 
                            alt={`Imagen ${index + 1} del proyecto ${title}`} 
                            className="w-full h-auto object-cover" 
                          />
                        </button>
                      ))}
                  </div>
              </div>
            </div>
          )}
        </div>

        {(project.videosBelowText && multipleVideos && multipleVideos.length > 0) && (
          <div className="mt-16 pt-8 border-t border-border">
            <h2 className="text-3xl font-bold text-text-primary mb-8 text-center border-b-2 border-brand-accent inline-block pb-2">Piezas</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {multipleVideos.map((video, idx) => (
                <div key={idx} className="flex flex-col">
                  {video.title && <h3 className="text-xl font-bold mb-3 text-text-primary text-center">{video.title}</h3>}
                  <div className={`shadow-2xl shadow-black/20 dark:shadow-black/50 rounded-lg overflow-hidden bg-black flex-grow flex items-center justify-center ${video.type === 'instagram' || video.type === 'youtube-short' ? 'md:h-[600px]' : ''}`}>
                    {video.type === 'instagram' ? (
                      video.customHtml ? (
                        <InstagramNativeEmbed html={video.customHtml} />
                      ) : (
                        <iframe
                          src={`https://www.instagram.com/p/${video.id}/embed`}
                          className="w-full h-full border-0 mx-auto max-w-[400px]"
                          allow="encrypted-media"
                          title={video.title}
                        />
                      )
                    ) : video.type === 'youtube-short' ? (
                      <div className="w-full h-full max-w-[350px] mx-auto">
                        <YouTubeEmbed embedId={video.id!} title={video.title || title} showControls={true} short={true} autoplay={project.id !== 'reels-rrss'} mute={project.id !== 'reels-rrss'} />
                      </div>
                    ) : (
                      <YouTubeEmbed embedId={video.id!} title={video.title || title} showControls={true} autoplay={project.id !== 'reels-rrss'} mute={project.id !== 'reels-rrss'} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {processVideoId && (
          <div className="mt-16 pt-8 border-t border-border">
            <h2 className="text-3xl font-bold text-text-primary mb-8 text-center border-b-2 border-brand-accent inline-block pb-2">Proceso de Trabajo</h2>
            <div className="max-w-4xl mx-auto shadow-2xl shadow-black/20 dark:shadow-black/50 rounded-lg overflow-hidden bg-black">
              <YouTubeEmbed embedId={processVideoId} title="Proceso de Trabajo" showControls={true} autoplay={project.id !== 'reels-rrss'} mute={project.id !== 'reels-rrss'} />
            </div>
          </div>
        )}
      </div>
      {isLightboxOpen && project.images && (
        <Lightbox 
          images={project.images}
          currentIndex={currentImageIndex}
          onClose={closeLightbox}
          onPrev={showPrevImage}
          onNext={showNextImage}
        />
      )}
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-10">
    <h2 className="text-3xl font-bold text-text-primary mb-4 border-l-4 border-brand-accent pl-4">{title}</h2>
    <div className="text-text-secondary space-y-4 leading-relaxed">{children}</div>
  </section>
);


export default ProjectDetailPage;
