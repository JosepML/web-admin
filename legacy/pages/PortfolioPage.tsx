import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import ProjectCard from '../components/ProjectCard';
import { PROJECTS } from '../constants';
import RecreationsSummaryCard from '../components/RecreationsSummaryCard';

const PortfolioPage: React.FC = () => {
  const location = useLocation();
  const [filter, setFilter] = useState(location.state?.filter || 'Todos');

  // Scroll to top when filter changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filter]);

  const categories = ['Todos', ...Array.from(new Set(PROJECTS.flatMap(p => p.category)))];

  const filteredProjects = PROJECTS.filter(project => {
    if (filter === 'Todos' || filter === 'Postproducción') {
      return !project.category.includes('Recreaciones de Películas') && (filter === 'Todos' || project.category.includes('Postproducción'));
    }
    return project.category.includes(filter);
  });

  let displayProjects = [...filteredProjects];

  if (filter === 'Postproducción') {
    const postproduccionOrder = [
      'kiboko',
      'y-el-ano-que-viene-que',
      '100-baladas-arkano',
      'no-se-esta-tan-mal-lovva',
      'el-viajero',
      'cobertura-conciertos',
      'spot-juno-media',
      'sin-tiempo-peiko',
      'bodas-cinematograficas',
      'eventos-deportivos',
      'reels-rrss'
    ];
    displayProjects.sort((a, b) => {
      const indexA = postproduccionOrder.indexOf(a.id);
      const indexB = postproduccionOrder.indexOf(b.id);
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }

  const filterButtonClasses = (category: string) =>
    `px-5 py-2.5 text-sm sm:text-base font-semibold rounded-full transition-all duration-300 transform hover:scale-105 backdrop-blur-md ${
      filter === category
        ? 'bg-brand-accent text-white shadow-[0_8px_32px_rgba(229,9,20,0.3)] border border-brand-accent'
        : 'bg-surface/50 dark:bg-surface/20 text-text-secondary hover:text-text-primary hover:bg-surface border border-border/50 hover:border-border'
    }`;

  let projectsBeforeSummary = [];
  let projectsAfterSummary = [];
  let showSummaryCard = false;

  if (filter === 'Todos') {
    showSummaryCard = true;
    projectsBeforeSummary = displayProjects.slice(0, 4);
    projectsAfterSummary = displayProjects.slice(4);
  } else if (filter === 'Postproducción') {
    showSummaryCard = true;
    const reelsIndex = displayProjects.findIndex(p => p.id === 'reels-rrss');
    if (reelsIndex !== -1) {
      projectsBeforeSummary = displayProjects.slice(0, reelsIndex);
      projectsAfterSummary = displayProjects.slice(reelsIndex);
    } else {
      projectsBeforeSummary = displayProjects;
      projectsAfterSummary = [];
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Optional decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-brand-accent text-sm font-bold tracking-[0.2em] uppercase mb-4 block">Portfolio</span>
          <h1 className="text-5xl md:text-7xl font-black text-heading tracking-tighter mb-6">Trabajos Audiovisuales</h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-text-secondary leading-relaxed font-light">
            Selección de proyectos de <strong>videografía, cine y dirección de fotografía</strong> realizados en Alicante y la Comunidad Valenciana. Cada fotograma esculpido para narrar una historia única.
          </p>
        </motion.div>

        <motion.div 
          className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-16"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={filterButtonClasses(category)}
            >
              {category}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={filter} 
            className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {!showSummaryCard ? (
              // Default rendering for any active filter
              displayProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} filter={filter} />
              ))
            ) : (
              // Custom rendering for 'Todos' or 'Postproducción' to position the summary card correctly
              <>
                {projectsBeforeSummary.map((project, index) => (
                  <ProjectCard key={project.id} project={project} filter={filter} />
                ))}

                <RecreationsSummaryCard onClick={() => setFilter('Recreaciones de Películas')} />

                {projectsAfterSummary.map((project, index) => (
                  <ProjectCard key={project.id} project={project} filter={filter} />
                ))}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PortfolioPage;