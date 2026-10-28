import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      }
    };
  }
}

interface InstagramNativeEmbedProps {
  html: string;
}

const InstagramNativeEmbed: React.FC<InstagramNativeEmbedProps> = ({ html }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    } else {
      const script = document.createElement('script');
      script.async = true;
      script.src = '//www.instagram.com/embed.js';
      script.onload = () => {
        if (window.instgrm) window.instgrm.Embeds.process();
      };
      document.body.appendChild(script);
    }
  }, [html]);

  return (
    <div 
      className="instagram-embed-container w-full max-w-[326px] sm:max-w-[400px] mx-auto bg-white rounded-lg flex justify-center items-center" 
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
};

export default InstagramNativeEmbed;
