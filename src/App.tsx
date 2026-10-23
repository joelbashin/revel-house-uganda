import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  getOrgSettings,
  getPrograms,
  getProjects,
  getArticles,
  getImpactStats,
  getTeamMembers,
  resetCMSData,
} from './services/api';
import {
  OrganizationSettings,
  Program,
  Project,
  Article,
  ImpactStat,
  TeamMember,
} from './types';
import {
  initialOrgSettings,
  initialPrograms,
  initialProjects,
  initialImpactStats,
  initialArticles,
  initialTeam,
} from './data/cmsData';

import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { OurWork } from './components/common/OurWork';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProgramsPage } from './pages/ProgramsPage';
import { ProgramDetailPage } from './pages/ProgramDetailPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ImpactPage } from './pages/ImpactPage';
import { NewsPage } from './pages/NewsPage';
import { NewsDetailPage } from './pages/NewsDetailPage';
import { GetInvolvedPage } from './pages/GetInvolvedPage';
import { PartnerPage } from './pages/PartnerPage';
import { ContactPage } from './pages/ContactPage';
import { DonatePage } from './pages/DonatePage';
import { SponsorChildPage } from './pages/SponsorChildPage';
import { SafeguardingPage } from './pages/SafeguardingPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { WashPage } from './pages/WashPage';
import { GalleryPage } from './pages/GalleryPage';

// Admin CMS
import { AdminApp } from './components/admin/AdminApp';
import { MediaProvider } from './context/MediaContext';
import { AIChat } from './components/ai/AIChat';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [searchParams, setSearchParams] = useState<string>(() => {
    return window.location.search || '';
  });

  // Dark mode: manual toggle only, defaults to light, persisted
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem('rhu-theme') === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', dark);
    window.localStorage.setItem('rhu-theme', dark ? 'dark' : 'light');
  }, [dark]);

  const [settings, setSettings] = useState<OrganizationSettings>(initialOrgSettings);
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [impactStats, setImpactStats] = useState<ImpactStat[]>(initialImpactStats);
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);
  const [loading, setLoading] = useState(true);

  const mainRef = useRef<HTMLDivElement>(null);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      try {
        const [loadedSettings, loadedProgs, loadedProjs, loadedArts, loadedStats, loadedTeam] =
          await Promise.all([
            getOrgSettings(),
            getPrograms(),
            getProjects(),
            getArticles(),
            getImpactStats(),
            getTeamMembers(),
          ]);

        setSettings(loadedSettings);
        setPrograms(loadedProgs);
        setProjects(loadedProjs);
        setArticles(loadedArts);
        setImpactStats(loadedStats);
        setTeam(loadedTeam);
      } catch (err) {
        console.error('Error loading initial CMS data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Listen to popstate (back/forward button)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      setSearchParams(window.location.search || '');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigation handler
  const handleNavigate = (pathWithSearch: string) => {
    const [newPath, query] = pathWithSearch.split('?');
    const safePath = newPath || '/';
    const safeSearch = query ? `?${query}` : '';

    if (window.location.pathname !== safePath || window.location.search !== safeSearch) {
      window.history.pushState({}, '', `${safePath}${safeSearch}`);
    }

    setCurrentPath(safePath);
    setSearchParams(safeSearch);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Subtle page transition animation with GSAP
    if (mainRef.current) {
      gsap.fromTo(
        mainRef.current,
        { opacity: 0.85, y: 8 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
  };

  // Extract designation if on donate page
  const parsedDesignation = (() => {
    if (searchParams) {
      const urlParams = new URLSearchParams(searchParams);
      return urlParams.get('designation') || undefined;
    }
    return undefined;
  })();

  // Check if on admin route
  const isAdminRoute = currentPath.startsWith('/admin');

  // Render Page based on path
  const renderPage = () => {
    // Admin CMS (handled by AdminApp with its own auth/routing)
    if (isAdminRoute) {
      return <AdminApp />;
    }

    // 1. Home
    if (currentPath === '/' || currentPath === '/home') {
      return (
        <HomePage
          settings={settings}
          programs={programs}
          projects={projects}
          impactStats={impactStats}
          articles={articles}
          onNavigate={handleNavigate}
        />
      );
    }

    // 2. About
    if (currentPath === '/about') {
      return (
        <AboutPage
          settings={settings}
          team={team}
          onNavigate={handleNavigate}
        />
      );
    }

    // 3. Programs
    if (currentPath === '/programs') {
      return (
        <ProgramsPage
          programs={programs}
          onNavigate={handleNavigate}
        />
      );
    }

    // 4. WASH PROJECT
    if (currentPath === '/wash') {
      return <WashPage onNavigate={handleNavigate} />;
    }

    // 5. Program Detail
    if (currentPath.startsWith('/programs/')) {
      const slug = currentPath.replace('/programs/', '').trim();
      const program = programs.find((p) => p.slug === slug);
      if (program) {
        return (
          <ProgramDetailPage
            program={program}
            allProjects={projects}
            onNavigate={handleNavigate}
          />
        );
      }
      return <NotFoundPage onNavigate={handleNavigate} />;
    }

    // 5. Projects
    if (currentPath === '/projects') {
      return (
        <ProjectsPage
          projects={projects}
          onNavigate={handleNavigate}
        />
      );
    }

    // 6. Project Detail
    if (currentPath.startsWith('/projects/')) {
      const slug = currentPath.replace('/projects/', '').trim();
      const project = projects.find((p) => p.slug === slug);
      if (project) {
        return (
          <ProjectDetailPage
            project={project}
            allProjects={projects}
            onNavigate={handleNavigate}
          />
        );
      }
      return <NotFoundPage onNavigate={handleNavigate} />;
    }

    // 7. Impact
    if (currentPath === '/impact') {
      return (
        <ImpactPage
          stats={impactStats}
          onNavigate={handleNavigate}
        />
      );
    }

    // 8. News
    if (currentPath === '/news') {
      return (
        <NewsPage
          articles={articles}
          onNavigate={handleNavigate}
        />
      );
    }

    // 9. News Detail
    if (currentPath.startsWith('/news/')) {
      const slug = currentPath.replace('/news/', '').trim();
      const article = articles.find((a) => a.slug === slug);
      if (article) {
        return (
          <NewsDetailPage
            article={article}
            allArticles={articles}
            allProjects={projects}
            onNavigate={handleNavigate}
          />
        );
      }
      return <NotFoundPage onNavigate={handleNavigate} />;
    }

    // 10. Get Involved
    if (currentPath === '/get-involved') {
      return <GetInvolvedPage onNavigate={handleNavigate} />;
    }

    // 11. Partner With Us
    if (currentPath === '/partner') {
      return <PartnerPage />;
    }

    // 12. Contact
    if (currentPath === '/contact') {
      return <ContactPage settings={settings} onNavigate={handleNavigate} />;
    }

    // 13. Donate
    if (currentPath === '/donate') {
      return (
        <DonatePage
          initialDesignation={parsedDesignation}
          onNavigate={handleNavigate}
        />
      );
    }

    // 13b. Sponsor a Child
    if (currentPath === '/sponsor-a-child') {
      return <SponsorChildPage onNavigate={handleNavigate} />;
    }

    // 14. Safeguarding
    if (currentPath === '/safeguarding') {
      return (
        <SafeguardingPage
          settings={settings}
          onNavigate={handleNavigate}
        />
      );
    }

    // 15. Privacy Policy
    if (currentPath === '/privacy') {
      return <PrivacyPage settings={settings} />;
    }

    // 16. Gallery
    if (currentPath === '/gallery') {
      return <GalleryPage onNavigate={handleNavigate} />;
    }

    // Fallback 404
    return <NotFoundPage onNavigate={handleNavigate} />;
  };

  // Admin routes render their own layout (no header/footer)
  if (isAdminRoute) {
    return <AdminApp />;
  }

  return (
    <MediaProvider>
      <div className="min-h-screen flex flex-col bg-[var(--c-bg)] text-[var(--c-ink)] selection:bg-[#69B53F]/20 selection:text-[var(--c-ink)]">
        {/* GLOBAL HEADER */}
        <Header
          currentPath={currentPath}
          onNavigate={handleNavigate}
          dark={dark}
          onToggleDark={() => setDark(d => !d)}
        />

        {/* MAIN VIEWPORT */}
        <main ref={mainRef} className="flex-1">
          {loading ? (
            <div className="min-h-[60vh] flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="w-8 h-8 rounded-full border-2 border-[var(--c-ink)]/20 border-t-[#69B53F] animate-spin mx-auto" />
                <p className="text-xs font-mono uppercase tracking-widest text-[var(--c-ink)]/60">
                  Loading Community Portal...
                </p>
              </div>
            </div>
          ) : (
            renderPage()
          )}
        </main>

        {/* GLOBAL OUR WORK VIDEO PORTFOLIO */}
        <OurWork />

        {/* GLOBAL FOOTER */}
        <Footer settings={settings} onNavigate={handleNavigate} />

        {/* PUBLIC AI ASSISTANT ("Ask Revel House") */}
        <AIChat onNavigate={handleNavigate} />
      </div>
    </MediaProvider>
  );
}
