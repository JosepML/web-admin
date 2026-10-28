import React from 'react';
import { Link } from 'react-router-dom';

const ThanksPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in-up text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight">¡Gracias por tu mensaje!</h1>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-text-secondary">
        He recibido tu consulta y me pondré en contacto contigo pronto.
      </p>
      <Link
        to="/"
        className="mt-8 inline-block bg-brand-accent text-white font-bold text-lg py-3 px-8 rounded-md hover:bg-red-700 transition-colors duration-300 transform hover:scale-105"
      >
        Volver a Inicio
      </Link>
    </div>
  );
};

export default ThanksPage;
