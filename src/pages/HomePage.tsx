import React from 'react';
import { Hero } from '../components/home/Hero';
import { FeaturedPrograms } from '../components/home/FeaturedPrograms';
import { AboutSnippet } from '../components/home/AboutSnippet';
import { FeaturedProject } from '../components/home/FeaturedProject';
import { SponsorSnippet } from '../components/home/SponsorSnippet';
import { ImpactStats } from '../components/home/ImpactStats';
import { RecentNews } from '../components/home/RecentNews';
import { SupportCTA } from '../components/home/SupportCTA';
import { GallerySnippet } from '../components/home/GallerySnippet';
import { OrganizationSettings, Program, Project, ImpactStat, Article } from '../types';

interface HomePageProps {
  settings: OrganizationSettings;
  programs: Program[];
  projects: Project[];
  impactStats: ImpactStat[];
  articles: Article[];
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  settings,
  programs,
  projects,
  impactStats,
  articles,
  onNavigate,
}) => {
  // Find primary featured project (e.g. WASH project)
  const featuredProject = projects.find(p => p.isWASH) || projects[0];

  return (
    <div id="home-page-container">
      {/* 1. HERO SECTION */}
      <Hero settings={settings} onNavigate={onNavigate} />

      {/* 2. PROGRAMS SECTION */}
      <FeaturedPrograms programs={programs} onNavigate={onNavigate} />

      {/* 3. ABOUT EDITORIAL SECTION */}
      <AboutSnippet onNavigate={onNavigate} />

      {/* 4. FEATURED PROJECT / CAMPAIGN */}
      <FeaturedProject project={featuredProject} onNavigate={onNavigate} />

      {/* 4b. SPONSOR A CHILD */}
      <SponsorSnippet onNavigate={onNavigate} />

      {/* 5. IMPACT SECTION */}
      <ImpactStats stats={impactStats} onNavigate={onNavigate} />

      {/* 6. STORIES / NEWS */}
      <RecentNews articles={articles} onNavigate={onNavigate} />

      {/* 6b. GALLERY PREVIEW */}
      <GallerySnippet onNavigate={onNavigate} />

      {/* 7. SUPPORT CTA */}
      <SupportCTA onNavigate={onNavigate} />
    </div>
  );
};
