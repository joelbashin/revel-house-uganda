import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Program } from '../../types';
import { BlankImage } from '../common/BlankImage';
import { SectionHeading } from '../common/SectionHeading';
import { useMedia } from '../../context/MediaContext';
import { resolveCategoryImage } from '../../utils/categoryImage';

gsap.registerPlugin(ScrollTrigger);

interface FeaturedProgramsProps {
  programs: Program[];
  onNavigate: (path: string) => void;
}

export const FeaturedPrograms: React.FC<FeaturedProgramsProps> = ({ programs, onNavigate }) => {
  const { getImage } = useMedia();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header: left heading comes from left, right button comes from right slowly as you scroll down; disappear slowly to left and right as you scroll up
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.programs-header-anim',
          start: 'top 95%',
          end: 'top 25%',
          scrub: 2.2,
        },
      });
      headerTl
        .fromTo(
          '.programs-header-left',
          { opacity: 0, x: -140, y: 15 },
          { opacity: 1, x: 0, y: 0, ease: 'none', duration: 1 }
        )
        .fromTo(
          '.programs-header-right',
          { opacity: 0, x: 140, y: 15 },
          { opacity: 1, x: 0, y: 0, ease: 'none', duration: 1 },
          0
        );

      // Program cards: left card from left, right card from right, center from bottom; come in slowly as you scroll down, go out slowly as you scroll up
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
          '.program-card-p1',
          { opacity: 0, x: -140, y: 30, scale: 0.94 },
          { opacity: 1, x: 0, y: 0, scale: 1, ease: 'none', duration: 1 }
        )
        .fromTo(
          '.program-card-p2',
          { opacity: 0, y: 70, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, ease: 'none', duration: 1 },
          0
        )
        .fromTo(
          '.program-card-p3',
          { opacity: 0, x: 140, y: 30, scale: 0.94 },
          { opacity: 1, x: 0, y: 0, scale: 1, ease: 'none', duration: 1 },
          0
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const featured = programs.slice(0, 3);

  const categoryImages: Record<string, string> = {
    'Child Care & Protection': getImage('programs.childCare', '/images/safecare.jpeg'),
    'Education': getImage('programs.education', '/images/imgt5.jpeg'),
    'Health & Medical Care': getImage('programs.health', '/images/imgt4.jpeg'),
    'Community Outreach': getImage('programs.community', '/images/livelihoods.jpeg'),
    'WASH & Hygiene': getImage('programs.wash', '/images/imgt1.jpeg'),
  };

  const toneMap: Record<number, 'sage' | 'clay' | 'stone'> = {
    0: 'sage',
    1: 'clay',
    2: 'stone',
  };

  return (
    <section
      ref={sectionRef}
      id="programs-section"
      className="pt-6 pb-16 md:pt-10 md:pb-24 bg-transparent border-0 border-none overflow-hidden"
    >
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12">
        {/* HEADER */}
        <div className="programs-header-anim flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
          <SectionHeading
            eyebrow="OUR PROGRAMS"
            title="Grassroots solutions addressing core community needs."
            subtitle="We partner directly with local committees, schools, and caregivers to build enduring community protection and opportunity."
            className="mb-0 programs-header-left"
          />

          <button
            id="view-all-programs-btn"
            onClick={() => onNavigate('/programs')}
            className="programs-header-right inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#69B53F] hover:text-[#5aa134] transition-colors shrink-0 group self-start md:self-end pb-2"
          >
            <span>View All Programs</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 3-COLUMN GRID */}
        <div id="programs-cards-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((prog, idx) => (
            <article
              key={prog.id}
              id={`program-card-${prog.slug}`}
              onClick={() => onNavigate(`/programs/${prog.slug}`)}
              className={`program-card-anim tilt-3d ${
                idx === 0 ? 'program-card-p1' : idx === 1 ? 'program-card-p2' : 'program-card-p3'
              } group bg-[var(--c-surface)] rounded-[28px] p-6 sm:p-7 border border-[var(--c-ink)]/8 hover:border-[#69B53F]/40 shadow-xs hover:shadow-lg transition-all duration-500 flex flex-col justify-between cursor-pointer`}
            >
              <div>
                {/* BLANK IMAGE FRAME (per strict user instruction: where there are images, leave them blank) */}
                <div className="mb-6 overflow-hidden rounded-[20px] transition-transform duration-500 group-hover:scale-[1.02]">
                  <BlankImage
                    aspectRatio="aspect-[16/10]"
                    rounded="rounded-[20px]"
                    tone={toneMap[idx] || 'cream'}
                    src={resolveCategoryImage(prog.category, categoryImages, 'Community Outreach')}
                    label={`Visual for ${prog.title}`}
                  >
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                      <span className="text-[10px] uppercase font-semibold tracking-widest text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] mb-1">
                        {prog.category}
                      </span>
                      <span className="font-editorial text-sm text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                        Community Action Area
                      </span>
                    </div>
                  </BlankImage>
                </div>

                {/* CATEGORY EYEBROW */}
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#69B53F]" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#69B53F]">
                    {prog.category}
                  </span>
                </div>

                {/* TITLE */}
                <h3 className="font-editorial text-xl sm:text-2xl text-[var(--c-ink)] leading-snug group-hover:text-[#69B53F] transition-colors">
                  {prog.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="mt-3 text-sm text-[var(--c-ink)]/70 leading-relaxed line-clamp-3">
                  {prog.shortDescription}
                </p>

                {/* KEY HIGHLIGHTS */}
                <ul className="mt-5 space-y-2 border-t border-[var(--c-ink)]/8 pt-4">
                  {prog.objectives.slice(0, 2).map((obj, oIdx) => (
                    <li key={oIdx} className="flex items-start gap-2 text-xs text-[var(--c-ink)]/75">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#69B53F] shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ACTION FOOTER */}
              <div className="mt-6 pt-4 border-t border-[var(--c-ink)]/8 flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--c-ink)] group-hover:text-[#69B53F] transition-colors flex items-center gap-1.5">
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[11px] text-[var(--c-ink)]/40 font-mono">
                  {prog.status}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
