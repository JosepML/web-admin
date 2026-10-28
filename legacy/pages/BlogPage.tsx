import React from 'react';
import { motion } from 'motion/react';
import { BLOG_POSTS } from '../constants';
import type { BlogPost } from '../types';
import { Calendar, ChevronRight } from 'lucide-react';

const BlogPostCard: React.FC<{ post: BlogPost; index: number }> = ({ post, index }) => (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group bg-surface/50 dark:bg-surface/10 backdrop-blur-xl border border-border/50 p-8 sm:p-10 rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-brand-accent/10 transition-all duration-300 relative overflow-hidden"
    >
        {/* Subtle hover accent line */}
        <div className="absolute top-0 left-0 w-1 h-full bg-brand-accent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />

        <div className="flex items-center gap-2 text-brand-accent mb-4 font-mono text-sm tracking-tight">
          <Calendar className="w-4 h-4" />
          <time dateTime={post.date}>{post.date}</time>
        </div>
        
        <h2 className="text-3xl sm:text-4xl font-bold text-heading mb-4 leading-tight group-hover:text-brand-accent transition-colors duration-300">
          {post.title}
        </h2>
        
        <p className="text-xl text-text-secondary/80 mb-8 leading-relaxed font-light">
          {post.excerpt}
        </p>
        
        <div className="prose prose-lg dark:prose-invert text-text-secondary leading-relaxed max-w-none pt-6 border-t border-border/50">
          <p className="whitespace-pre-wrap">{post.content}</p>
        </div>

        {/* Optional decorative 'Read More' hint, could be a link later if single post views are added */}
        {/* <div className="mt-8 flex items-center gap-2 text-brand-accent text-sm font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Leer Artículo <ChevronRight className="w-4 h-4" />
        </div> */}
    </motion.div>
);

const BlogPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background relative overflow-hidden flex flex-col items-center">
      {/* Decorative blurred blobs */}
      <div className="absolute top-[-10%] left-[10%] w-[40%] h-[40%] bg-brand-accent/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-brand-accent text-sm font-bold tracking-[0.2em] uppercase mb-4 block">Diario</span>
          <h1 className="text-5xl md:text-7xl font-black text-heading tracking-tighter mb-6">Blog y Noticias</h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-text-secondary leading-relaxed font-light">
            Reflexiones sobre el cine, análisis de tendencias y el detrás de escena de mis proyectos.
          </p>
        </motion.div>

        <div className="space-y-12 pb-12">
          {BLOG_POSTS.map((post, index) => (
            <BlogPostCard key={post.id} post={post} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;