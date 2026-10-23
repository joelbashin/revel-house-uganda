import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, ArrowRight, Droplets, MapPin, Check } from 'lucide-react';
import { Project } from '../../types';
import { BlankImage } from '../common/BlankImage';
import { StatusBadge } from '../common/StatusBadge';
import { ProgressBar } from '../common/ProgressBar';
import { useMedia } from '../../context/MediaContext';

gsap.registerPlugin(ScrollTrigger);

interface FeaturedProjectProps {
  project?: Project;
  onNavigate: (path: string) => void;
}

export const FeaturedProject: React.FC<FeaturedProjectProps> = ({ project, onNavigate }) => {
  const { getImage } = useMedia();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Visual & Content: appear from left & right converging slowly as user scrolls down, disappear slowly to left & right as user scrolls up
      const projectTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 95%',
          end: 'top 20%',
          scrub: 2.2,
        },
      });

      projectTl
        .fromTo(
          '.project-visual-anim',
          { opacity: 0, x: -140, y: 15, rotateY: -8, transformOrigin: 'left center' },
          { opacity: 1, x: 0, y: 0, rotateY: 0, ease: 'none', duration: 1 }
        )
        .fromTo(
          '.project-content-anim',
          { opacity: 0, x: 140, y: 15, rotateY: 8, transformOrigin: 'right center' },
          { opacity: 1, x: 0, y: 0, rotateY: 0, ease: 'none', duration: 1 },
          0
        );

      // Offset badge continuous breathing float
      gsap.to('.project-offset-frame', {
        y: -14,
        x: 4,
        duration: 6.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  if (!project) return null;

  return (
    <section
      ref={sectionRef}
      id="featured-project-section"
      className="py-16 md:py-24 bg-transparent border-0 border-none overflow-hidden"
    >
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* LEFT: ORGANIC/CIRCULAR COMPOSITION (BLANK PER USER SPECIFICATION) */}
          <div className="lg:col-span-6 order-2 lg:order-1 relative project-visual-anim project-visual-block">
            <div className="relative max-w-lg mx-auto">
              
              {/* Dominant visual frame with circular/organic styling */}
              <BlankImage
                aspectRatio="aspect-square"
                rounded="rounded-[40px]"
                tone="sage"
                src={getImage('featuredProject.main', '/images/imgt6.jpeg')}
                label="Featured WASH project photograph"
                className="shadow-md border-[#69B53F]/20"
              >
                <div className="p-8 text-center flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-black/30 backdrop-blur-xs flex items-center justify-center text-white mb-4 border border-white/20">
                    <Droplets className="w-7 h-7" />
                  </div>
                  <span className="font-editorial text-2xl text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] block mb-1">
                    Safe Water & Sanitation
                  </span>
                  <span className="text-xs text-white/85 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] max-w-xs">
                    Rainwater harvesting reservoirs & ventilated child-friendly hygiene facilities.
                  </span>
                </div>
              </BlankImage>

              {/* Offset secondary frame with breathing float */}
              <div className="project-offset-frame absolute -bottom-6 -right-4 sm:-right-8 w-44 sm:w-56 hidden sm:block">
                <BlankImage
                  aspectRatio="aspect-[4/3]"
                  rounded="rounded-[24px]"
                  tone="cream"
                  src={getImage('featuredProject.offset', '/images/imgt8.jpeg')}
                  label="Verified school WASH impact photograph"
                  className="shadow-lg border-[var(--c-ink)]/10"
                >
                  <div className="p-3 text-center">
                    <span className="text-[10px] font-semibold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] block uppercase tracking-wider">
                      Verified Impact
                    </span>
                    <span className="text-xs text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">4 Schools Benefiting</span>
                  </div>
                </BlankImage>
              </div>

            </div>
          </div>

          {/* RIGHT: STORYTELLING, OBJECTIVES & FUNDING TARGET */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6 project-content-anim project-content-block">
            
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--c-surface)] border border-[var(--c-ink)]/8">
                <span className="w-2 h-2 rounded-full bg-[#69B53F]" />
                <span className="text-[11px] font-semibold tracking-widest uppercase text-[#69B53F]">
                  FEATURED PROJECT
                </span>
              </div>
              <StatusBadge status={project.status} />
            </div>

            <h3 className="font-editorial text-3xl sm:text-4xl lg:text-[42px] tracking-tight leading-[1.08] text-[var(--c-ink)]">
              {project.title}
            </h3>

            <div className="flex items-center gap-2 text-xs font-medium text-[var(--c-ink)]/70">
              <MapPin className="w-3.5 h-3.5 text-[#69B53F]" />
              <span>{project.location}</span>
            </div>

            <p className="text-base text-[var(--c-ink)]/80 leading-relaxed">
              {project.summary}
            </p>

            {/* PROGRESS & FUNDING METRICS */}
            <div className="bg-[var(--c-surface)] p-5 rounded-2xl border border-[var(--c-ink)]/8 space-y-3.5 shadow-xs">
              <ProgressBar percentage={project.progressPercentage} color="green" />

              {project.fundingGoal && project.amountRaised && (
                <div className="flex items-center justify-between text-xs pt-1 border-t border-[var(--c-ink)]/6">
                  <div>
                    <span className="text-[var(--c-ink)]/60 block text-[10px] uppercase font-semibold">
                      Committed to Date
                    </span>
                    <span className="font-editorial text-lg text-[var(--c-ink)]">
                      ${project.amountRaised.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[var(--c-ink)]/60 block text-[10px] uppercase font-semibold">
                      Full Phase Budget
                    </span>
                    <span className="font-editorial text-lg text-[var(--c-ink)]/60">
                      ${project.fundingGoal.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* KEY IMMEDIATE DELIVERABLES */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-semibold text-[var(--c-ink)] uppercase tracking-wider block">
                Immediate Deliverables:
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[var(--c-ink)]/75">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-[#69B53F] shrink-0 mt-0.5" />
                  <span>10kL rainwater catchment tanks</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-[#69B53F] shrink-0 mt-0.5" />
                  <span>Girls private washrooms & dignity bins</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-[#69B53F] shrink-0 mt-0.5" />
                  <span>Solar UV biosand filtration units</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-[#69B53F] shrink-0 mt-0.5" />
                  <span>Student WASH club hygiene training</span>
                </li>
              </ul>
            </div>

            {/* ACTIONS */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                id="featured-project-support-btn"
                onClick={() => onNavigate(`/donate?designation=${encodeURIComponent(project.title)}`)}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#111111] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#69B53F] shadow-xs transition-all duration-300 transform active:scale-95"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>Support This Project</span>
              </button>

              <button
                id="featured-project-details-btn"
                onClick={() => onNavigate(`/projects/${project.slug}`)}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-[var(--c-surface)] text-[var(--c-ink)] text-xs font-semibold uppercase tracking-wider border border-[var(--c-ink)]/15 hover:border-[var(--c-ink)]/30 transition-colors"
              >
                <span>Read Full Case Study</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
