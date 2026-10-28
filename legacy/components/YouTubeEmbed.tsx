import React, { useEffect, useState } from 'react';

interface YouTubeEmbedProps {
  embedId: string;
  title?: string;
  showControls?: boolean;
  fill?: boolean;
  autoplay?: boolean;
  mute?: boolean;
  loop?: boolean;
  short?: boolean;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ 
  embedId, 
  title = "YouTube Video",
  showControls,
  fill = false,
  autoplay,
  mute,
  loop,
  short = false
}) => {
  const [isMounted, setIsMounted] = useState(false);

  // Aseguramos que esto solo corra en el cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="bg-black w-full h-full min-h-[200px]" />;
  }

  // URL Construida con parámetros apropiados
  const params = new URLSearchParams();
  if (fill) {
    // Modo fondo: Autoplay, silenciado, bucle, sin controles
    params.set('autoplay', '1');
    params.set('mute', '1');
    params.set('controls', '0');
    params.set('loop', '1');
    params.set('playlist', embedId); // Requerido para loop
    params.set('rel', '0');
    params.set('modestbranding', '1');
    params.set('playsinline', '1');
  } else {
    // Modo normal: con controles opcionales
    params.set('rel', '0');
    params.set('modestbranding', '1');
    params.set('playsinline', '1');
    if (showControls === false) params.set('controls', '0');
    if (autoplay) {
      params.set('autoplay', '1');
      params.set('mute', '1'); // Autoplay typically requires mute to work without interaction
    }
    if (mute && !autoplay) {
      params.set('mute', '1');
    }
    if (loop) {
      params.set('loop', '1');
      params.set('playlist', embedId);
    }
  }

  // Usamos youtube-nocookie.com para mayor privacidad y evitar algunos bloqueadores
  const src = `https://www.youtube-nocookie.com/embed/${embedId}?${params.toString()}`;

  // Layout básico para que no rompa el diseño (100% width/height)
  const containerClass = fill 
    ? "absolute inset-0 w-full h-full bg-black flex items-center justify-center overflow-hidden" 
    : `relative w-full ${short ? 'h-full aspect-[9/16]' : 'aspect-video'} bg-black`;

  return (
    <div className={containerClass}>
      <iframe
        className={fill ? "w-[300vw] h-[300vw] sm:w-[150vw] sm:h-[150vh] min-w-full min-h-full max-w-none max-h-none pointer-events-none" : "w-full h-full"}
        src={src}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
};

export default YouTubeEmbed;