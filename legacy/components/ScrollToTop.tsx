import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Si no hay un hash (ej: #about), hacemos scroll al inicio
    if (!hash) {
      window.scrollTo({
        top: 0,
        behavior: 'instant' // Usamos instant para que no se vea el salto en cambios de página
      });
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
