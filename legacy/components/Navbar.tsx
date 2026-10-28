import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../constants';
import ThemeToggleButton from './ThemeToggleButton';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const getLinkClass = (path: string) => {
    // Check if it's the home page without hash
    const isHome = path === '/' && location.pathname === '/' && !location.hash;
    // Check if it matches exactly (including hash)
    const isExactMatch = location.pathname + location.hash === path;
    // Check if current location starts with the path (for nested routes like /portfolio/xyz)
    const isPartialMatch = path !== '/' && !path.includes('#') && location.pathname.startsWith(path);

    const isActive = isHome || isExactMatch || isPartialMatch;

    return `block py-2 px-3 text-lg transition duration-300 ${
      isActive ? 'text-brand-accent' : 'text-text-primary hover:text-brand-accent'
    }`;
  };

  return (
    <nav className="bg-surface/80 dark:bg-surface/80 backdrop-blur-md sticky top-0 z-50 shadow-lg shadow-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <NavLink to="/" title="Inicio - Josep Mira Lozano Filmmaker & DOP" className="text-2xl font-bold text-text-primary hover:text-brand-accent transition duration-300">
              Josep Mira Lozano
            </NavLink>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <div className="flex items-baseline space-x-4">
              {NAV_LINKS.map((link) => (
                <NavLink key={link.name} to={link.path} title={`Ver ${link.name} - Josep Mira Lozano`} className={() => getLinkClass(link.path)}>
                  {link.name}
                </NavLink>
              ))}
            </div>
            <ThemeToggleButton />
          </div>
          <div className="-mr-2 flex md:hidden items-center">
            <ThemeToggleButton />
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="ml-2 bg-surface inline-flex items-center justify-center p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-brand-accent"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.name} to={link.path} className={() => getLinkClass(link.path)} onClick={() => setIsOpen(false)}>
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;