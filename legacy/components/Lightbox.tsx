import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface LightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const portalRoot = document.getElementById('portal-root');

const Lightbox: React.FC<LightboxProps> = ({ images, currentIndex, onClose, onPrev, onNext }) => {
  if (!images || images.length === 0 || !portalRoot) {
    return null;
  }

  // Handle body scroll and keyboard events
  useEffect(() => {
    // Add class to body when component mounts to prevent scrolling
    document.body.classList.add('modal-open');
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (images.length > 1) {
        if (e.key === 'ArrowLeft') onPrev();
        if (e.key === 'ArrowRight') onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Remove class and event listener when component unmounts
    return () => {
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, onPrev, onNext, images.length]);

  const lightboxContent = (
    <div
      className="fixed inset-0 bg-black/80 z-[100] flex justify-center items-center p-4 animate-fade-in-up"
      style={{ animationDuration: '0.3s' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      {/* Wrapper for image and buttons to contain clicks and serve as a positioning context */}
      <div
        className="relative w-auto max-w-5xl max-h-full flex items-center justify-center"
        onClick={e => e.stopPropagation()}
      >
        {/* Image */}
        <img
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          className="block max-h-[90vh] object-contain rounded-lg shadow-2xl"
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-0 right-0 -m-3 text-white bg-black/50 rounded-full w-10 h-10 flex items-center justify-center text-2xl leading-none hover:bg-black/80 transition-colors z-[102]"
          aria-label="Close image viewer"
        >
          &times;
        </button>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={onPrev}
              className="absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-16 text-white text-5xl p-2 rounded-full bg-black/30 hover:bg-black/60 transition-colors z-[101]"
              aria-label="Previous image"
            >
              &#8249;
            </button>
            <button
              onClick={onNext}
              className="absolute top-1/2 -translate-y-1/2 -right-4 sm:-right-16 text-white text-5xl p-2 rounded-full bg-black/30 hover:bg-black/60 transition-colors z-[101]"
              aria-label="Next image"
            >
              &#8250;
            </button>
          </>
        )}
      </div>
    </div>
  );

  return createPortal(lightboxContent, portalRoot);
};

export default Lightbox;