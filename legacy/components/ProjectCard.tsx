import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import type { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  filter?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, filter }) => {
  const destination = project.linkTo ? project.linkTo : `/project/${project.id}`;
  // Display all categories joined by a separator for a comprehensive view.
  const categoryDisplay = Array.isArray(project.category) && project.category.length > 0
    ? project.category.join(' • ') // Usar dot bullet for sleekness
    : 'Proyecto';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="h-full"
    >
      <Link 
        to={destination} 
        state={{ fromFilter: filter }} 
        className="group relative block overflow-hidden rounded-2xl bg-surface/50 dark:bg-surface/10 border border-border/50 h-full focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-black">
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
          />
          {/* Default gradient slightly visible, much darker on hover for text clarity */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
          
          <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 flex flex-col justify-end transform transition-transform duration-500">
            <span className="text-xs sm:text-sm font-bold text-brand-accent uppercase tracking-[0.15em] mb-2 drop-shadow-md">
              {categoryDisplay}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight drop-shadow-lg group-hover:text-brand-accent transition-colors duration-300">
              {project.title}
            </h3>
            
            {/* "View Project" glassmorphism pill that appears on hover */}
            <div className="mt-4 overflow-hidden h-0 group-hover:h-12 transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100">
              <div className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-sm font-medium">
                Ver Detalle 
                <svg className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;