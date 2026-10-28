import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PortfolioPage from './pages/PortfolioPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import ThanksPage from './pages/ThanksPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ScrollToTop from './components/ScrollToTop';

const App: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-background text-text-primary transition-colors duration-300">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/project/:id" element={<ProjectDetailPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/thanks" element={<ThanksPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};


export default App;