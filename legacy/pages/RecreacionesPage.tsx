import React from 'react';
import { PROJECTS } from '../constants';
import YouTubeEmbed from '../components/YouTubeEmbed';
import type { Project } from '../types';

const RecreationCard: React.FC<{ project: Project }> = ({ project }) => (
    <div className="bg-surface rounded-lg shadow-lg overflow-hidden animate-fade-in-up">
        {project.youtubeVideoId &&
            <div className="shadow-2xl shadow-black/20 dark:shadow-black/50 rounded-lg overflow-hidden">
                <YouTubeEmbed embedId={project.youtubeVideoId} title={project.title} showControls={true} />
            </div>
        }
        <div className="p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">{project.title}</h2>
            <div className="space-y-4 text-text-secondary leading-relaxed">
                {project.context && <p><strong className="text-text-primary">Contexto:</strong> {project.context}</p>}
                {project.challenges && <p><strong className="text-text-primary">Proceso y Retos:</strong> {project.challenges}</p>}
                {project.results && <p><strong className="text-text-primary">Valor y Resultado:</strong> {project.results}</p>}
            </div>
        </div>
    </div>
);

const RecreacionesPage: React.FC = () => {
    const recreationProjects = PROJECTS.filter(p => p.category.includes('Recreaciones de Películas'));

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12 animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight">Recreaciones de Películas</h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-text-secondary">
                    Un estudio práctico de la cinematografía, deconstruyendo y replicando escenas icónicas para dominar el arte de la luz, la composición y la narrativa visual.
                </p>
            </div>
            <div className="space-y-12">
                {recreationProjects.map(project => (
                    <RecreationCard key={project.id} project={project} />
                ))}
            </div>
        </div>
    );
};

export default RecreacionesPage;