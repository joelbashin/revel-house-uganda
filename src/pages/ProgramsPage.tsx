import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, CheckCircle2, Filter } from 'lucide-react';
import { Program, ProgramCategory } from '../types';
import { BlankImage } from '../components/common/BlankImage';
import { SectionHeading } from '../components/common/SectionHeading';
import { StatusBadge } from '../components/common/StatusBadge';
import { useMedia } from '../context/MediaContext';
import { resolveCategoryImage } from '../utils/categoryImage';

gsap.registerPlugin(ScrollTrigger);

interface ProgramsPageProps {
  programs: Program[];
  onNavigate: (path: string) => void;
}

export const ProgramsPage: React.FC<ProgramsPageProps> = ({ programs, onNavigate }) => {
  const { getImage } = useMedia();
  const pageRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories: ('ALL' | ProgramCategory)[] = [
    'ALL',
    'Child Care & Protection',
    'Education',
    'Health & Medical Care',
    'Community Outreach',
    'WASH & Hygiene',
  ];

  const filtered = selectedCategory === 'ALL'
    ? programs
    : programs.filter(p => p.category === selectedCategory);

  const categoryImages: Record<string, string> = {
    'Child Care & Protection': getImage('programs.childCare', '/images/safecare.jpeg'),
    'Education': getImage('programs.education', '/images/imgt5.jpeg'),
    'Health & Medical Care': getImage('programs.health', '/images/imgt4.jpeg'),
    'Community Outreach': getImage('programs.community', '/images/livelihoods.jpeg'),
    'WASH & Hygiene': getImage('programs.wash', '/images/imgt1.jpeg'),
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero header and filter
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.programs-hero-section',
          start: 'top 95%',
          end: 'top 25%',
          scrub: 2.2,
        },
      });
      heroTl
        .fromTo(
          '.programs-hero-text',
          { opacity: 0, x: -140, y: 15 },
          { opacity: 1, x: 0, y: 0, ease: 'none', duration: 1 }
        )
        .fromTo(
          '.programs-filter-row',
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, ease: 'none', duration: 0.8 },
          0.2
        );

      // 2. Program cards grid
      const cardsTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#programs-cards-grid',
          start: 'top 92%',
          end: 'top 20%',
          scrub: 2.2,
        },
      });

      cardsTl
        .fromTo(
          '.program-card-col-0',
          { opacity: 0, x: -120, y: 30, scale: 0.94 },
          { opacity: 1, x: 0, y: 0, scale: 1, ease: 'none', duration: 1 }
        )
        .fromTo(
          '.program-card-col-1',
          { opacity: 0, y: 65, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, ease: 'none', duration: 1 },
          0
        )
        .fromTo(
          '.program-card-col-2',
          { opacity: 0, x: 120, y: 30, scale: 0.94 },
          { opacity: 1, x: 0, y: 0, scale: 1, ease: 'none', duration: 1 },
          0
        );
    }, pageRef);

    return () => ctx.revert();
  }, [selectedCategory]);

  return (
    <div id="programs-page" ref={pageRef} className="pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12">
        {/* HERO */}
        <div className="programs-hero-section max-w-3xl mb-12">
          <div className="programs-hero-text">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--c-soft)] border border-[var(--c-ink)]/8 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#69B53F]" />
              <span className="text-[11px] font-semibold tracking-widest uppercase text-[var(--c-ink)]/80">
                COMMUNITY PROGRAMS
              </span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[var(--c-ink)] tracking-tight leading-[1.04]">
              Sustainable initiatives shaped by community insight.
            </h1>

            <p className="mt-5 text-base sm:text-lg text-[var(--c-ink)]/75 leading-relaxed">
              Our programs focus on root causes rather than temporary symptoms. Explore our five active humanitarian focus areas below.
            </p>
          </div>
        </div>

        {/* CATEGORY FILTER PILLS */}
        <div className="programs-filter-row flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          <span className="text-xs text-[var(--c-ink)]/50 font-medium mr-1 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'bg-[var(--c-surface)] text-[var(--c-ink)]/75 border border-[var(--c-ink)]/10 hover:border-[var(--c-ink)]/30 hover:bg-[var(--c-soft)]/40'
              }`}
            >
              {cat === 'ALL' ? 'All Focus Areas' : cat}
            </button>
          ))}
        </div>

        {/* PROGRAM CARDS GRID */}
        <div id="programs-cards-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((prog, idx) => {
            const colClass = `program-card-col-${idx % 3}`;
            return (
              <article
                key={prog.id}
                onClick={() => onNavigate(`/programs/${prog.slug}`)}
                className={`group ${colClass} bg-[var(--c-surface)] rounded-[28px] p-6 sm:p-7 border border-[var(--c-ink)]/8 hover:border-[#69B53F]/50 shadow-xs hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 flex flex-col justify-between cursor-pointer`}
              >
                <div>
                  {/* FIELD PHOTO FRAME */}
                  <div className="mb-6 overflow-hidden rounded-[20px]">
                    <BlankImage
                      aspectRatio="aspect-[16/10]"
                      rounded="rounded-[20px]"
                      tone={idx % 2 === 0 ? 'sage' : 'clay'}
                      src={resolveCategoryImage(prog.category, categoryImages, 'Community Outreach')}
                      label={`Field photograph for ${prog.title}`}
                    >
                      <div className="text-center p-3">
                        <span className="text-[10px] uppercase font-semibold text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] block">
                          Focus Area
                        </span>
                        <span className="font-editorial text-sm text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                          {prog.category}
                        </span>
                      </div>
                    </BlankImage>
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#69B53F]">
                      {prog.category}
                    </span>
                    <StatusBadge status={prog.status} />
                  </div>

                  <h3 className="font-editorial text-2xl text-[var(--c-ink)] group-hover:text-[#69B53F] transition-colors leading-snug">
                    {prog.title}
                  </h3>

                  <p className="mt-3 text-xs sm:text-sm text-[var(--c-ink)]/70 leading-relaxed line-clamp-3">
                    {prog.shortDescription}
                  </p>

                  {/* OBJECTIVES PREVIEW */}
                  <div className="mt-5 pt-4 border-t border-[var(--c-ink)]/8 space-y-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--c-ink)]/50 block">
                      Key Objectives:
                    </span>
                    {prog.objectives.slice(0, 2).map((obj, oIdx) => (
                      <div key={oIdx} className="flex items-start gap-2 text-xs text-[var(--c-ink)]/75">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#69B53F] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{obj}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--c-ink)]/8 flex items-center justify-between text-xs font-semibold">
                  <span className="text-[var(--c-ink)] group-hover:text-[#69B53F] transition-colors flex items-center gap-1.5">
                    <span>View Program Details</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </div>
  );
};
