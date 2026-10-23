import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, MapPin, Filter } from 'lucide-react';
import { Project, ProjectStatus } from '../types';
import { BlankImage } from '../components/common/BlankImage';
import { StatusBadge } from '../components/common/StatusBadge';
import { ProgressBar } from '../components/common/ProgressBar';
import { useMedia } from '../context/MediaContext';

gsap.registerPlugin(ScrollTrigger);

interface ProjectsPageProps {
  projects: Project[];
  onNavigate: (path: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ projects, onNavigate }) => {
  const { getImage } = useMedia();
  const pageRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  const filterTabs: ('ALL' | ProjectStatus)[] = [
    'ALL',
    'ONGOING',
    'SEEKING FUNDING',
    'PLANNED',
    'COMPLETED',
  ];

  const filtered = activeFilter === 'ALL'
    ? projects
    : projects.filter(p => p.status === activeFilter);

  const projectImages: Record<string, string> = {
    'wash-sanitation-schools': getImage('projects.wash-sanitation-schools', '/images/imgt1.jpeg'),
    'community-learning-hub': getImage('projects.community-learning-hub', '/images/imgt5.jpeg'),
    'maternal-infant-health-outreach': getImage('projects.maternal-infant-health-outreach', '/images/imgt4.jpeg'),
    'caregivers-agricultural-empowerment': getImage('projects.caregivers-agricultural-empowerment', '/images/livelihoods.jpeg'),
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero header and filter
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.projects-hero-section',
          start: 'top 95%',
          end: 'top 25%',
          scrub: 2.2,
        },
      });
      heroTl
        .fromTo(
          '.projects-hero-text',
          { opacity: 0, x: -140, y: 15, rotateY: -6, transformOrigin: 'left center' },
          { opacity: 1, x: 0, y: 0, rotateY: 0, ease: 'none', duration: 1 }
        )
        .fromTo(
          '.projects-filter-row',
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, ease: 'none', duration: 0.8 },
          0.2
        );

      // 2. Project cards grid
      const cardsTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#projects-cards-grid',
          start: 'top 92%',
          end: 'top 20%',
          scrub: 2.2,
        },
      });

      cardsTl
        .fromTo(
          '.project-card-left',
          { opacity: 0, x: -140, y: 30, scale: 0.94, rotateY: -8, transformOrigin: 'left center' },
          { opacity: 1, x: 0, y: 0, scale: 1, rotateY: 0, ease: 'none', duration: 1 }
        )
        .fromTo(
          '.project-card-right',
          { opacity: 0, x: 140, y: 30, scale: 0.94, rotateY: 8, transformOrigin: 'right center' },
          { opacity: 1, x: 0, y: 0, scale: 1, rotateY: 0, ease: 'none', duration: 1 },
          0
        );
    }, pageRef);

    return () => ctx.revert();
  }, [activeFilter]);

  return (
    <div id="projects-page" ref={pageRef} className="pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12">
        
        {/* HEADER */}
        <div className="projects-hero-section max-w-3xl mb-12">
          <div className="projects-hero-text">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--c-soft)] border border-[var(--c-ink)]/8 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#69B53F]" />
              <span className="text-[11px] font-semibold tracking-widest uppercase text-[var(--c-ink)]/80">
                FIELD PROJECTS & INITIATIVES
              </span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[var(--c-ink)] tracking-tight leading-[1.04]">
              Tangible community interventions on the ground.
            </h1>

            <p className="mt-5 text-base sm:text-lg text-[var(--c-ink)]/75 leading-relaxed">
              From clean rainwater harvesting installations in primary schools to solar-powered community reading hubs, our projects translate humanitarian solidarity into lasting infrastructure.
            </p>
          </div>
        </div>

        {/* STATUS FILTER TABS */}
        <div className="projects-filter-row flex items-center gap-2 overflow-x-auto pb-4 mb-12 scrollbar-none">
          <span className="text-xs text-[var(--c-ink)]/50 font-medium mr-1 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
          </span>
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                activeFilter === tab
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'bg-[var(--c-surface)] text-[var(--c-ink)]/75 border border-[var(--c-ink)]/10 hover:border-[var(--c-ink)]/30 hover:bg-[var(--c-soft)]/40'
              }`}
            >
              {tab === 'ALL' ? 'All Projects' : tab}
            </button>
          ))}
        </div>

        {/* PROJECTS GRID */}
        {filtered.length === 0 ? (
          <div className="bg-[var(--c-surface)] rounded-[28px] p-12 text-center border border-[var(--c-ink)]/8 max-w-md mx-auto">
            <p className="text-sm text-[var(--c-ink)]/70">No projects currently under this status filter.</p>
            <button
              onClick={() => setActiveFilter('ALL')}
              className="mt-4 px-5 py-2 rounded-full bg-[#111111] text-white text-xs font-semibold"
            >
              Show All Projects
            </button>
          </div>
        ) : (
          <div id="projects-cards-grid" className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filtered.map((proj, idx) => {
              const sideClass = idx % 2 === 0 ? 'project-card-left' : 'project-card-right';
              return (
                <article
                  key={proj.id}
                  onClick={() => onNavigate(`/projects/${proj.slug}`)}
                  className={`group tilt-3d ${sideClass} bg-[var(--c-surface)] rounded-[28px] p-6 sm:p-8 border border-[var(--c-ink)]/8 hover:border-[#69B53F]/40 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer`}
                >
                  <div>
                    {/* FIELD PHOTO CONTAINER */}
                    <div className="mb-6 overflow-hidden rounded-[22px]">
                      <BlankImage
                        aspectRatio="aspect-[16/9]"
                        rounded="rounded-[22px]"
                        tone={proj.isWASH ? 'sage' : idx % 2 === 0 ? 'stone' : 'clay'}
                        src={projectImages[proj.slug] || '/images/imgt9.jpeg'}
                        label={`Field photograph for project: ${proj.title}`}
                      >
                        <div className="text-center p-3">
                          <span className="text-[10px] uppercase font-semibold text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] block">
                            Verified Project
                          </span>
                          <span className="font-editorial text-sm text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                            {proj.location}
                          </span>
                        </div>
                      </BlankImage>
                    </div>

                    {/* STATUS & LOCATION */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5 text-xs text-[var(--c-ink)]/60 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#69B53F]" />
                        <span>{proj.location}</span>
                      </div>
                      <StatusBadge status={proj.status} />
                    </div>

                    {/* TITLE */}
                    <h3 className="font-editorial text-2xl sm:text-3xl text-[var(--c-ink)] leading-snug group-hover:text-[#69B53F] transition-colors mb-3">
                      {proj.title}
                    </h3>

                    {/* SUMMARY */}
                    <p className="text-xs sm:text-sm text-[var(--c-ink)]/70 leading-relaxed line-clamp-3 mb-6">
                      {proj.summary}
                    </p>

                    {/* PROGRESS BAR */}
                    <div className="p-4 rounded-2xl bg-[var(--c-bg)] border border-[var(--c-ink)]/6 mb-2">
                      <ProgressBar percentage={proj.progressPercentage} color="green" />

                      {proj.fundingGoal && proj.amountRaised && (
                        <div className="flex items-center justify-between text-xs pt-3 mt-3 border-t border-[var(--c-ink)]/6">
                          <span className="text-[var(--c-ink)]/60">
                            Raised: <strong className="text-[var(--c-ink)]">${proj.amountRaised.toLocaleString()}</strong>
                          </span>
                          <span className="text-[var(--c-ink)]/60">
                            Goal: <strong className="text-[var(--c-ink)]">${proj.fundingGoal.toLocaleString()}</strong>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[var(--c-ink)]/8 flex items-center justify-between text-xs font-semibold">
                    <span className="text-[var(--c-ink)] group-hover:text-[#69B53F] transition-colors flex items-center gap-1.5">
                      <span>Explore Full Project & Milestones</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    {proj.isWASH && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#69B53F]/15 text-[#3E7C20] text-[10px] uppercase font-bold">
                        Flagship WASH
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
