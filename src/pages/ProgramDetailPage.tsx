import React from 'react';
import { ArrowLeft, CheckCircle2, Heart, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { Program, Project } from '../types';
import { BlankImage } from '../components/common/BlankImage';
import { StatusBadge } from '../components/common/StatusBadge';
import { SectionHeading } from '../components/common/SectionHeading';
import { useMedia } from '../context/MediaContext';
import { resolveCategoryImage } from '../utils/categoryImage';

interface ProgramDetailPageProps {
  program: Program;
  allProjects: Project[];
  onNavigate: (path: string) => void;
}

export const ProgramDetailPage: React.FC<ProgramDetailPageProps> = ({
  program,
  allProjects,
  onNavigate,
}) => {
  const { getImage } = useMedia();
  const relatedProjects = allProjects.filter(p => program.relatedProjects.includes(p.slug));

  const categoryImages: Record<string, string> = {
    'Child Care & Protection': getImage('programs.childCare', '/images/safecare.jpeg'),
    'Education': getImage('programs.education', '/images/imgt5.jpeg'),
    'Health & Medical Care': getImage('programs.health', '/images/imgt4.jpeg'),
    'Community Outreach': getImage('programs.community', '/images/livelihoods.jpeg'),
    'WASH & Hygiene': getImage('programs.wash', '/images/imgt1.jpeg'),
  };

  return (
    <div id="program-detail-page" className="pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12">
        {/* BACK BUTTON */}
        <button
          onClick={() => onNavigate('/programs')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--c-ink)]/70 hover:text-[var(--c-ink)] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Programs</span>
        </button>

        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#69B53F]">
                {program.category}
              </span>
              <StatusBadge status={program.status} />
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[var(--c-ink)] tracking-tight leading-[1.06]">
              {program.title}
            </h1>

            <p className="text-base sm:text-lg text-[var(--c-ink)]/80 leading-relaxed font-light">
              {program.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate(`/donate?designation=${encodeURIComponent(program.title)}`)}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#111111] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#69B53F] transition-all duration-300 transform active:scale-95"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>Support This Program</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            {/* Hero field photograph */}
            <BlankImage
              aspectRatio="aspect-[4/3]"
              rounded="rounded-[36px]"
              tone="sage"
              src={resolveCategoryImage(program.category, categoryImages, 'Community Outreach')}
              label={`Field photograph for ${program.title}`}
              className="shadow-md"
            >
              <div className="p-6 text-center">
                <span className="text-[11px] uppercase font-semibold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] block mb-1">
                  Active Focus
                </span>
                <span className="font-editorial text-2xl text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] block">
                  {program.category}
                </span>
              </div>
            </BlankImage>
          </div>
        </div>

        {/* DETAILS GRID: WHY IT MATTERS & OBJECTIVES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-16 border-t border-[var(--c-ink)]/8">
          
          <div className="lg:col-span-6 space-y-8">
            <div>
              <h2 className="font-editorial text-2xl sm:text-3xl text-[var(--c-ink)] mb-4">
                Why It Matters
              </h2>
              <p className="text-sm sm:text-base text-[var(--c-ink)]/75 leading-relaxed">
                When basic rights such as shelter, protection, and learning environments are fragile, entire generations face limited futures. Our approach provides stability by building safety nets around families and reinforcing local community structures.
              </p>
            </div>

            <div>
              <h3 className="font-editorial text-xl sm:text-2xl text-[var(--c-ink)] mb-3">
                Our Strategic Approach
              </h3>
              <p className="text-sm text-[var(--c-ink)]/75 leading-relaxed">
                We work through existing community structures rather than creating parallel systems. By collaborating with local councils, primary school headteachers, and certified health officers, our interventions maintain high local ownership and durability.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--c-soft)]/60 border border-[var(--c-ink)]/8 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#69B53F] block">
                Impact Summary
              </span>
              <p className="text-sm font-medium text-[var(--c-ink)]">
                {program.impactSummary}
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-8">
            {/* CORE OBJECTIVES */}
            <div className="bg-[var(--c-surface)] p-7 sm:p-8 rounded-[28px] border border-[var(--c-ink)]/8 shadow-xs">
              <h3 className="font-editorial text-2xl text-[var(--c-ink)] mb-5">
                Core Program Objectives
              </h3>
              <ul className="space-y-3.5">
                {program.objectives.map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-[var(--c-ink)]/80">
                    <CheckCircle2 className="w-4 h-4 text-[#69B53F] shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* KEY ACTIVITIES */}
            <div className="bg-[var(--c-bg)] p-7 sm:p-8 rounded-[28px] border border-[var(--c-ink)]/8">
              <h3 className="font-editorial text-2xl text-[var(--c-ink)] mb-4">
                Activities & Field Operations
              </h3>
              <ul className="space-y-3">
                {program.activities.map((act, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--c-ink)]/75">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#69B53F] shrink-0 mt-2" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* RELATED PROJECTS */}
        {relatedProjects.length > 0 && (
          <div className="py-16 border-t border-[var(--c-ink)]/8">
            <SectionHeading
              eyebrow="ASSOCIATED PROJECTS"
              title="Active projects supported by this program."
              subtitle="See how this program translates into physical infrastructure and ground operations."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedProjects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => onNavigate(`/projects/${proj.slug}`)}
                  className="bg-[var(--c-surface)] rounded-[26px] p-6 border border-[var(--c-ink)]/8 hover:border-[#69B53F]/40 transition-all duration-300 flex flex-col justify-between cursor-pointer group shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-[#69B53F]">
                        {proj.location}
                      </span>
                      <StatusBadge status={proj.status} />
                    </div>
                    <h4 className="font-editorial text-xl text-[var(--c-ink)] group-hover:text-[#69B53F] transition-colors mb-2">
                      {proj.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-[var(--c-ink)]/70 line-clamp-2">
                      {proj.summary}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-[var(--c-ink)]/8 flex items-center justify-between text-xs font-semibold">
                    <span>View Project Case Study</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BOTTOM SUPPORT CALLOUT */}
        <div className="mt-12 bg-[#111111] text-white rounded-[32px] p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-5">
          <span className="text-xs uppercase font-semibold tracking-widest text-[#69B53F]">
            MAKE AN IMPACT
          </span>
          <h3 className="font-editorial text-3xl sm:text-4xl">
            Support the {program.title}
          </h3>
          <p className="text-sm sm:text-base text-[#EDEBE2]/75 max-w-xl mx-auto">
            Your funding helps purchase essential kits, build sustainable community capacity, and ensure long-term monitoring.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate(`/donate?designation=${encodeURIComponent(program.title)}`)}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#69B53F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#5aa134] transition-colors"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>Donate to This Initiative</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
