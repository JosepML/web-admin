import React from 'react';
import { LinkedInIcon, InstagramIcon, YouTubeIcon } from './IconComponents';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-surface text-text-secondary mt-12 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center space-x-6 mb-4">
          <a
            href="https://www.linkedin.com/in/josep-mira-lozano-a70798214/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Perfil de LinkedIn de Josep Mira Lozano"
            className="text-text-secondary hover:text-text-primary transition-colors duration-300"
          >
            <LinkedInIcon />
          </a>
          <a
            href="https://www.youtube.com/channel/UCtyNSF1X0pNPxp5fhwu1NUA"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Canal de YouTube de Josep Mira Lozano"
            className="text-text-secondary hover:text-text-primary transition-colors duration-300"
          >
            <YouTubeIcon />
          </a>
          <a
            href="https://www.instagram.com/josepmiralozano/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Perfil de Instagram de Josep Mira Lozano"
            className="text-text-secondary hover:text-text-primary transition-colors duration-300"
          >
            <InstagramIcon />
          </a>
        </div>
        <p>&copy; {new Date().getFullYear()} Josep Mira Lozano. Todos los derechos reservados.</p>
        <div className="flex justify-center gap-4 mt-2 text-sm">
          <p>Diseñado para inspirar.</p>
          <span className="text-border">•</span>
          <Link to="/privacy" className="hover:text-brand-accent transition-colors">Política de Privacidad</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;